export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  console.log('📡 API: 創建問卷請求', body.title)

  try {
    // 使用 server store 創建問卷
    const { getServerSurveyStore } = await import('../../../server/utils/surveyStore')
    const serverStore = getServerSurveyStore()
    const newSurvey = await serverStore.createSurvey(body)

    return {
      success: true,
      message: '問卷創建成功',
      data: newSurvey
    }
  } catch (error: any) {
    console.error('📡 API: 創建問卷失敗', error.message)
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })
  }
})
