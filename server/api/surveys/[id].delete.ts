import { deleteSurvey } from '~~/server/utils/storage'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    console.log(`📡 API: DELETE /api/surveys/${id}`)
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Survey ID is required'
      })
    }

    const deleted = await deleteSurvey(id, event)
    
    if (!deleted) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Survey not found'
      })
    }

    return {
      success: true,
      message: 'Survey deleted successfully'
    }
  } catch (error: any) {
    console.error('❌ Error deleting survey:', error)
    if (error.statusCode) throw error
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete survey'
    })
  }
})