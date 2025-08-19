import { getSurveyById, getSurveyResponses } from '~~/server/utils/storage'
import type { Survey, SurveyResponse } from '~~/types/index'
import { detectBrowser } from '~~/utils/map'
export default defineEventHandler(async (event) => {
  try {
    const surveyId = getRouterParam(event, 'id')
    const query = getQuery(event)
    const format = query.format as string || 'excel'
    
    console.log(`📡 API: GET /api/surveys/${surveyId}/export?format=${format}`)
    
    if (!surveyId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Survey ID is required'
      })
    }

    const survey = await getSurveyById(surveyId, event)
    if (!survey) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Survey not found'
      })
    }

    const responses = await getSurveyResponses(surveyId, event)
    
    if (format === 'csv') {
      const csvData = generateCSV(survey, responses)
      
      // 清理檔案名，移除特殊字符
      const cleanFileName = survey.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_')
      
      setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
      setHeader(event, 'Content-Disposition', `attachment; filename="${cleanFileName}_responses.csv"`)
      
      return csvData
    } else if (format === 'excel') {
      const excelBuffer = await generateExcel(survey, responses)
      
      // 清理檔案名，移除特殊字符
      const cleanFileName = survey.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_')
      
      setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      setHeader(event, 'Content-Disposition', `attachment; filename="${cleanFileName}_responses.xlsx"`)
      
      return excelBuffer
    } 
  } catch (error: any) {
    console.error('❌ Error exporting survey data:', error)
    if (error.statusCode) throw error
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to export survey data'
    })
  }
})

function generateCSV(survey: Survey, responses: SurveyResponse[]): string {
  const headers = [
    '回答ID',
    '提交時間',
    '瀏覽器',
    ...survey.questions.map(q => q.title)
  ]
  
  const rows = responses.map(response => {
    const row = [
      response.id,
      new Date(response.submittedAt).toLocaleString('zh-TW'),
      detectBrowser(response.userAgent || 'Unknown'),
      ...survey.questions.map(question => {
        const answer = response.answers.find(a => a.id === question.id)
        if (!answer) return ''
        
        switch (question.type) {
          case 'single':
          case 'text':
          case 'number':
          case 'date':
          case 'time':
            return answer.value?.toString() || ''
          case 'multiple':
            return Array.isArray(answer.value) ? answer.value.join('; ') : ''
          default:
            return answer.value?.toString() || ''
        }
      })
    ]
    return row
  })
  
  // 轉換為 CSV 格式
  const csvContent = [headers, ...rows]
    .map(row => 
      row.map(field => {
        // 處理包含逗號、引號或換行的字段
        const stringField = String(field || '')
        if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
          return `"${stringField.replace(/"/g, '""')}"`
        }
        return stringField
      }).join(',')
    )
    .join('\n')
  
  // 添加 BOM 以確保 Excel 正確顯示中文
  return '\uFEFF' + csvContent
}



async function generateExcel(survey: Survey, responses: SurveyResponse[]): Promise<Buffer> {
  const { createRequire } = await import('node:module')
  const require = createRequire(import.meta.url)
  const XLSX = require('xlsx')
  const workbook = XLSX.utils.book_new()
  const responseHeaders = [
    '回答ID',
    '提交時間',
    '瀏覽器',
    ...survey.questions.map(q => q.title)
  ]
  
  const responseRows = responses.map(response => {
    const row = [
      response.id,
      new Date(response.submittedAt).toLocaleString('zh-TW'),
      detectBrowser(response.userAgent || 'Unknown'),
      ...survey.questions.map(question => {
        const answer = response.answers.find(a => a.id === question.id)
        if (!answer) return ''
        
        switch (question.type) {
          case 'single':
          case 'text':
          case 'number':
          case 'date':
          case 'time':
            return answer.value?.toString() || ''
          case 'multiple':
            return Array.isArray(answer.value) ? answer.value.join('; ') : ''
          default:
            return answer.value?.toString() || ''
        }
      })
    ]
    return row
  })
  
  const responseData = [responseHeaders, ...responseRows]
  const responseWorksheet = XLSX.utils.aoa_to_sheet(responseData)
  
  // 設置列寬
  const colWidths = responseHeaders.map((_, index) => {
    if (index === 0) return { wch: 15 } // 回答ID
    if (index === 1) return { wch: 20 } // 提交時間
    if (index === 2) return { wch: 15 } // 瀏覽器
    return { wch: 25 } // 問題列
  })
  responseWorksheet['!cols'] = colWidths
  
  XLSX.utils.book_append_sheet(workbook, responseWorksheet, '問卷回應')
  
  // 第二個工作表：統計摘要
  const statsData = [
    ['統計項目', '數值', '說明'],
    ['問卷標題', survey.title, ''],
    ['問卷描述', survey.description, ''],
    ['總題數', survey.questions.length.toString(), ''],
    ['總回應數', responses.length.toString(), ''],
    ['匯出時間', new Date().toLocaleString('zh-TW'), ''],
    [''], // 空行
    ['問題統計', '', ''],
    ['問題標題', '回應數', '回應率'],
  ]
  
  // 添加每個問題的統計
  survey.questions.forEach(question => {
    const answeredCount = responses.filter(r => 
      r.answers.some(a => a.id === question.id && a.value !== null && a.value !== '')
    ).length
    const responseRate = responses.length > 0 
      ? ((answeredCount / responses.length) * 100).toFixed(1) + '%'
      : '0%'
    
    statsData.push([
      question.title,
      answeredCount.toString(),
      responseRate
    ])
  })
  
  const statsWorksheet = XLSX.utils.aoa_to_sheet(statsData)
  statsWorksheet['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(workbook, statsWorksheet, '統計摘要')
  
  // 第三個工作表：問題選項統計（針對選擇題）
  const optionStatsData = [
    ['問題', '選項', '選擇次數', '百分比']
  ]
  
  survey.questions.forEach(question => {
    if (question.type === 'single' || question.type === 'multiple') {
      const questionAnswers = responses
        .map(r => r.answers.find(a => a.id === question.id))
        .filter(Boolean)
      
      if (question.options) {
        question.options.forEach(option => {
          let count = 0
          questionAnswers.forEach(answer => {
            if (question.type === 'single' && answer?.value === option) {
              count++
            } else if (question.type === 'multiple' && Array.isArray(answer?.value) && answer.value.includes(option)) {
              count++
            }
          })
          
          const percentage = questionAnswers.length > 0 
            ? ((count / questionAnswers.length) * 100).toFixed(1) + '%'
            : '0%'
          
          optionStatsData.push([
            question.title,
            option,
            count.toString(),
            percentage
          ])
        })
      }
    }
  })
  
  if (optionStatsData.length > 1) {
    const optionStatsWorksheet = XLSX.utils.aoa_to_sheet(optionStatsData)
    optionStatsWorksheet['!cols'] = [{ wch: 30 }, { wch: 25 }, { wch: 12 }, { wch: 12 }]
    XLSX.utils.book_append_sheet(workbook, optionStatsWorksheet, '選項統計')
  }
  
  // 生成 Excel 文件
  const excelBuffer = XLSX.write(workbook, { 
    type: 'buffer', 
    bookType: 'xlsx',
    compression: true 
  })
  
  return excelBuffer
}