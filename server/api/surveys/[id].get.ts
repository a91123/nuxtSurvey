import { getSurveyById } from '~~/server/utils/storage'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    console.log(`📡 API: GET /api/surveys/${id}`)
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Survey ID is required'
      })
    }

    const survey = await getSurveyById(id, event)
    
    if (!survey) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Survey not found'
      })
    }

    return {
      success: true,
      data: survey
    }
  } catch (error: any) {
    console.error('❌ Error fetching survey:', error)
    if (error.statusCode) throw error
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch survey'
    })
  }
})