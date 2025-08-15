export default defineEventHandler(async (event) => {
  console.log('📡 API: 獲取統計信息請求')

  try {
    // 使用 server store 獲取統計
    const { getServerSurveyStore } = await import('../../../server/utils/surveyStore')
    const serverStore = getServerSurveyStore()
    const stats = serverStore.getStats()

    console.log('📊 統計信息:', stats)

    return {
      success: true,
      data: stats
    }
  } catch (error: any) {
    console.error('📡 API: 獲取統計失敗', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: '獲取統計失敗'
    })
  }
})
