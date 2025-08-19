import { getAllSurveys, getAllResponses } from '~~/server/utils/storage'

export default defineEventHandler(async (event) => {
  try {
    const surveys = await getAllSurveys(event)
    const allResponses = await getAllResponses(event)
    
    // 計算統計數據
    const totalSurveys = surveys.length
    const totalResponses = allResponses.length
    const publishedSurveys = surveys.filter(s => s.status === 'published').length
    
    // 計算用戶數量（基於不同的 userAgent 或 IP，這裡簡化處理）
    const uniqueUsers = new Set(allResponses.map(r => r.userAgent || 'unknown')).size
    
    return {
      success: true,
      data: {
        total: totalSurveys,
        published: publishedSurveys,
        responses: totalResponses,
        users: uniqueUsers
      }
    }
  } catch (error: any) {
    console.error('Error fetching survey stats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch survey statistics'
    })
  }
})
