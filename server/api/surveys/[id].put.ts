export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: '問卷 ID 必須提供'
    })
  }

  console.log('📡 API: 更新問卷請求', id, body.title)

  try {
    // 使用 server store 更新問卷
    const { getServerSurveyStore } = await import('../../../server/utils/surveyStore')
    const serverStore = getServerSurveyStore()
    const updatedSurvey = await serverStore.updateSurvey(id, body)

    return {
      success: true,
      message: '問卷更新成功',
      data: updatedSurvey
    }
  } catch (error: any) {
    console.error('📡 API: 更新問卷失敗', error.message)
    
    if (error.message === '找不到指定的問卷') {
      throw createError({
        statusCode: 404,
        statusMessage: error.message
      })
    }
    
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })
  }
})
