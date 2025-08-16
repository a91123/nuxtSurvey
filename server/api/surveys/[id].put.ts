import { updateSurvey } from '~~/server/utils/storage'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    console.log(`📡 API: PUT /api/surveys/${id}`)
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Survey ID is required'
      })
    }

    const body = await readBody(event)
    const updatedSurvey = await updateSurvey(id, body, event)
    
    if (!updatedSurvey) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Survey not found'
      })
    }

    return {
      success: true,
      data: updatedSurvey
    }
  } catch (error: any) {
    console.error('❌ Error updating survey:', error)
    if (error.statusCode) throw error
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update survey'
    })
  }
})