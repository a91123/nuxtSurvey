export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: '問卷 ID 必須提供'
    })
  }

  console.log('📡 API: 刪除問卷請求', id)

  try {
    // 使用 server store 刪除問卷
    const { getServerSurveyStore } = await import('../../../server/utils/surveyStore')
    const serverStore = getServerSurveyStore()
    await serverStore.deleteSurvey(id)

    return {
      success: true,
      message: '問卷刪除成功'
    }
  } catch (error: any) {
    console.error('📡 API: 刪除問卷失敗', error.message)
    
    if (error.message === '找不到指定的問卷') {
      throw createError({
        statusCode: 404,
        statusMessage: error.message
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: '刪除問卷失敗'
    })
  }
})
