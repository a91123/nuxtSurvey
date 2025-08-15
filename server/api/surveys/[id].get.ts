export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: '問卷 ID 必須提供'
    })
  }

  console.log('📡 API: 獲取問卷請求', id)

  try {
    // 使用 server store 獲取問卷
    const { getServerSurveyStore } = await import('../../../server/utils/surveyStore')
    const serverStore = getServerSurveyStore()
    const survey = await serverStore.getSurveyById(id)

    if (!survey) {
      throw createError({
        statusCode: 404,
        statusMessage: '找不到指定的問卷'
      })
    }

    return survey
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('📡 API: 獲取問卷失敗', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: '獲取問卷失敗'
    })
  }
})
