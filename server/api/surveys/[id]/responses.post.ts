import { getSurveyById, submitSurveyResponse } from '~~/server/utils/storage'
import { createTimeStamp } from '~~/utils/date-fns'

export default defineEventHandler(async (event) => {
  try {
    const surveyId = getRouterParam(event, 'id')
    console.log(`📡 API: POST /api/surveys/${surveyId}/responses`)
    
    if (!surveyId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Survey ID is required'
      })
    }

    // 驗證問卷是否存在
    const survey = await getSurveyById(surveyId, event)
    if (!survey) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Survey not found'
      })
    }

    // 檢查問卷狀態
    if (survey.status !== 'published') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Survey is not published'
      })
    }

    const body = await readBody(event)
    
    // 驗證必填字段
    if (!body.answers || !Array.isArray(body.answers)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Answers are required and must be an array'
      })
    }

    // 獲取用戶代理
    const userAgent = getHeader(event, 'user-agent') || 'Unknown'
    console.log('🔍 UserAgent received:', userAgent)

    const newResponse = await submitSurveyResponse({
      id: `response_${Date.now()}`,
      surveyId,
      answers: body.answers,
      submittedAt: createTimeStamp(),
      userAgent
    }, event)

    return {
      success: true,
      data: newResponse
    }
  } catch (error: any) {
    console.error('❌ Error submitting response:', error)
    if (error.statusCode) throw error
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to submit response'
    })
  }
})