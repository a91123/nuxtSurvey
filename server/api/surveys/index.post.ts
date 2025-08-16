import { createSurvey } from '~~/server/utils/storage'
import type { Survey, Question } from '~~/types/index'
import { v4 as uuidv4 } from 'uuid'
import { createTimeStamp } from '~~/utils/date-fns'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('📡 API: POST /api/surveys', body)

    const newSurvey: Survey = {
      id: uuidv4(),
      title: body.title,
      description: body.description,
      status: body.status || 'draft',
      questions: body.questions.map((q: Question) => ({
        id: uuidv4(),
        type: q.type,
        title: q.title,
        required: q.required,
        options: q.options
      })),
      createdAt: createTimeStamp(),
      updatedAt: createTimeStamp()
    }

    await createSurvey(newSurvey, event)

    return {
      success: true,
      data: newSurvey
    }
  } catch (error: any) {
    console.error('❌ Error creating survey:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create survey'
    })
  }
})