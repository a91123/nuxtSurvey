import { getSurveyById, getSurveyResponses } from '~~/server/utils/storage'
import type { Survey, SurveyResponse, BrowserStat } from '~~/types/index'
import { detectBrowser } from '~~/utils/map'

export default defineEventHandler(async (event) => {
  try {
    const surveyId = getRouterParam(event, 'id')
    console.log(`📡 API: GET /api/surveys/${surveyId}/stats`)
    
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
    const stats = calculateSurveyStats(survey, responses)

    return {
      success: true,
      data: stats
    }
  } catch (error: any) {
    console.error('❌ Error fetching survey stats:', error)
    if (error.statusCode) throw error
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch survey stats'
    })
  }
})

// 計算統計數據的輔助函數
function calculateSurveyStats(survey: Survey, responses: SurveyResponse[]) {
  const totalResponses = responses.length
  
  const questionStats = survey.questions.map(question => {
    const answers = responses
      .map(r => r.answers.find(a => a.id === question.id)?.value)
      .filter(Boolean)

    const answeredCount = answers.length
    const responseRate = totalResponses > 0 ? (answeredCount / totalResponses * 100).toFixed(1) : '0'

    let stats: any = {
      questionId: question.id,
      questionTitle: question.title,
      questionType: question.type,
      answeredCount,
      responseRate: responseRate // 移除 % 符號，讓前端處理
    }

    switch (question.type) {
      case 'single':
        const singleChoiceCounts: Record<string, number> = {}
        
        // 初始化所有選項為0
        if (question.options) {
          question.options.forEach(option => {
            singleChoiceCounts[option] = 0
          })
        }
        
        // 計算實際選擇次數
        answers.forEach(answer => {
          if (typeof answer === 'string' && singleChoiceCounts.hasOwnProperty(answer)) {
            singleChoiceCounts[answer] = (singleChoiceCounts[answer] || 0) + 1
          }
        })

        stats.optionStats = Object.entries(singleChoiceCounts).map(([option, count]) => ({
          option,
          count,
          percentage: answeredCount > 0 ? ((count / answeredCount) * 100).toFixed(1) : '0'
        }))
        break

      case 'multiple':
        const multipleChoiceCounts: Record<string, number> = {}
        
        // 初始化所有選項為0
        if (question.options) {
          question.options.forEach(option => {
            multipleChoiceCounts[option] = 0
          })
        }
        
        // 計算實際選擇次數
        answers.forEach(answer => {
          if (Array.isArray(answer)) {
            answer.forEach(choice => {
              if (typeof choice === 'string' && multipleChoiceCounts.hasOwnProperty(choice)) {
                multipleChoiceCounts[choice] = (multipleChoiceCounts[choice] || 0) + 1
              }
            })
          }
        })

        stats.optionStats = Object.entries(multipleChoiceCounts).map(([option, count]) => ({
          option,
          count,
          percentage: answeredCount > 0 ? ((count / answeredCount) * 100).toFixed(1) : '0'
        }))
        break

      case 'number':
        const numbers = answers
          .map(answer => typeof answer === 'number' ? answer : parseFloat(answer as string))
          .filter(num => !isNaN(num))

        if (numbers.length > 0) {
          const sum = numbers.reduce((a, b) => a + b, 0)
          stats.numberStats = {
            average: (sum / numbers.length).toFixed(2),
            min: Math.min(...numbers),
            max: Math.max(...numbers),
            total: sum, // 添加總和
            count: numbers.length
          }
        }
        break

      case 'text':
        const totalWords = answers.reduce((sum, answer) => {
          // 簡單的詞數計算：按空格分割
          const words = String(answer).trim().split(/\s+/).filter(word => word.length > 0)
          return sum + words.length
        }, 0)
        
        stats.textStats = {
          totalAnswers: answers.length,
          averageLength: answers.length > 0 
            ? (answers.reduce((sum, answer) => sum + String(answer).length, 0) / answers.length).toFixed(1)
            : '0',
          totalWords: totalWords // 添加總詞數
        }
        break
    }

    return stats
  })

  // 瀏覽器統計
  const browserStats: Record<string, number> = {}
  responses.forEach(response => {
    const browser = detectBrowser(response.userAgent || 'Unknown')
    browserStats[browser] = (browserStats[browser] || 0) + 1
  })

  return {
    surveyInfo: {
      id: survey.id,
      title: survey.title,
      description: survey.description,
      status: survey.status,
      totalQuestions: survey.questions.length,
      createdAt: survey.createdAt,
      updatedAt: survey.updatedAt
    },
    overview: {
      totalResponses,
      questionsCount: survey.questions.length,
      responseRate: '100.0', // 假設所有回應都是完整的，或者可以根據業務邏輯調整
      lastResponseAt: responses.length > 0 ? responses[responses.length - 1].submittedAt : null
    },
    questionStats,
    browserStats: Object.entries(browserStats).map(([browser, count]): BrowserStat => ({
      browser,
      count,
      percentage: totalResponses > 0 ? ((count / totalResponses) * 100).toFixed(1) : '0'
    })),
    responseDetails: responses
  }
}