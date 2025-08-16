import { getAllSurveys, getSurveyResponses } from '~~/server/utils/storage'

export default defineEventHandler(async (event) => {
  try {
    console.log('📡 API: GET /api/surveys')
    
    // 獲取查詢參數
    const query = getQuery(event)
    const {
      search = '',
      status = 'all',
      sort = 'recent',
      page = '1',
      pageSize = '6'
    } = query
    
    const surveys = await getAllSurveys(event)
    console.log(`📊 Found ${surveys.length} surveys in storage`)
    
    let result = await Promise.all(surveys.map(async (s: any) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      status: s.status,
      questions: s.questions.length,
      responses: (await getSurveyResponses(s.id, event)).length,
      updatedAt: s.updatedAt,
      createdAt: s.createdAt
    })))
    
    // 搜尋過濾
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase()
      result = result.filter(survey => 
        survey.title.toLowerCase().includes(searchLower) || 
        survey.description.toLowerCase().includes(searchLower)
      )
    }
    
    // 狀態過濾
    if (status && status !== 'all') {
      result = result.filter(survey => survey.status === status)
    }
    
    // 排序
    switch (sort) {
      case 'responses':
        result.sort((a, b) => b.responses - a.responses)
        break
      case 'questions':
        result.sort((a, b) => b.questions - a.questions)
        break
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title, 'zh-Hant'))
        break
      case 'title-desc':
        result.sort((a, b) => b.title.localeCompare(a.title, 'zh-Hant'))
        break
      case 'recent':
      default:
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    }
    
    // 分頁
    const total = result.length
    const pageNum = parseInt(page as string, 10)
    const pageSizeNum = parseInt(pageSize as string, 10)
    const startIndex = (pageNum - 1) * pageSizeNum
    const endIndex = startIndex + pageSizeNum
    
    result = result.slice(startIndex, endIndex)
    
    console.log(`📦 Returning ${result.length} of ${total} surveys to frontend`)
    
    return {
      success: true,
      data: result,
      pagination: {
        page: pageNum,
        pageSize: pageSizeNum,
        total,
        totalPages: Math.ceil(total / pageSizeNum)
      }
    }
  } catch (error: any) {
    console.error('❌ Error fetching surveys:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch surveys'
    })
  }
})
