import type { Survey, SurveyResponse } from '../../types/index'
import { createTimeStamp } from '../../utils/date-fns'

// 使用 Nitro storage API 並透過 cookie 隔離用戶數據
const SURVEYS_KEY = 'surveys'
const RESPONSES_KEY = 'responses'

const getUserId = (event: any): string => {
  let userId = getCookie(event, 'survey-user-id')
  if (!userId) {
    // 如果沒有 cookie，生成新的用戶 ID
    userId = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
    setCookie(event, 'survey-user-id', userId, {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: false,
      secure: false,
      sameSite: 'lax'
    })
    
    console.log(`🆔 Created new user ID: ${userId}`)
  } else {
    console.log(`🆔 Found existing user ID: ${userId}`)
  }
  
  return userId
}

/**
 * 獲取用戶專屬的存儲 key
 */
const getUserKey = (baseKey: string, userId: string): string => {
  return `${baseKey}-${userId}`
}

// 預設數據
const getDefaultSurveys = (): Survey[] => {
  return [
    {
      id: 'survey1',
      title: '產品滿意度調查',
      description: '請幫助我們了解您對產品的使用體驗',
      status: 'draft',
      questions: [
        {
          id: 'q1',
          type: 'single',
          title: '整體滿意度如何？',
          required: true,
          options: ['非常滿意', '滿意', '普通', '不滿意', '非常不滿意']
        },
        {
          id: 'q2',
          type: 'multiple',
          title: '您最看重哪些功能？',
          required: false,
          options: ['易用性', '功能豐富', '性能', '設計美觀', '價格']
        },
        {
          id: 'q3',
          type: 'text',
          title: '有什麼建議嗎？',
          required: false
        }
      ],
      createdAt: createTimeStamp(),
      updatedAt: createTimeStamp()
    },
    {
      id: 'survey2',
      title: '員工滿意度調查',
      description: '了解員工對工作環境的滿意度',
      status: 'published',
      questions: [
        {
          id: 'q4',
          type: 'number',
          title: '您對工作環境的評分',
          tip: '1-10分',
          min: 1,
          max: 10,
          required: true
        },
        {
          id: 'q5',
          type: 'single',
          title: '您是否推薦朋友來這裡工作？',
          required: true,
          options: ['非常願意', '願意', '不確定', '不願意', '非常不願意']
        }
      ],
      createdAt: createTimeStamp(),
      updatedAt: createTimeStamp()
    }
  ]
}

const getDefaultResponses = (): SurveyResponse[] => {
  return [
    {
      id: 'response1',
      surveyId: 'survey1',
      answers: [
        { id: 'q1', value: '滿意' },
        { id: 'q2', value: ['易用性', '性能'] },
        { id: 'q3', value: '希望能添加更多功能' }
      ],
      submittedAt: createTimeStamp(),
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  ]
}

// ============ 問卷相關函數 ============

export const getAllSurveys = async (event: any): Promise<Survey[]> => {
  try {
    const userId = getUserId(event)
    const userSurveysKey = getUserKey(SURVEYS_KEY, userId)
    
    const surveys = await useStorage().getItem(userSurveysKey) as Survey[] | null
    if (surveys && Array.isArray(surveys)) {
      console.log(`📦 Loaded ${surveys.length} surveys for user ${userId}`)
      return surveys
    }
    console.log(`📋 No surveys found for user ${userId}, initializing with defaults`)
    const defaultSurveys = getDefaultSurveys()
    await useStorage().setItem(userSurveysKey, defaultSurveys)
    return defaultSurveys
  } catch (error) {
    console.error('❌ Error loading surveys:', error)
    return getDefaultSurveys()
  }
}

export const getSurveyById = async (id: string, event: any): Promise<Survey | undefined> => {
  const surveys = await getAllSurveys(event)
  return surveys.find(s => s.id === id)
}

export const createSurvey = async (survey: Survey, event: any): Promise<Survey> => {
  console.log(`🔄 Creating survey: ${survey.title}`)
  const userId = getUserId(event)
  const userSurveysKey = getUserKey(SURVEYS_KEY, userId)
  
  const surveys = await getAllSurveys(event)
  console.log(`📊 Current surveys count for user ${userId}: ${surveys.length}`)
  surveys.push(survey)
  console.log(`📊 New surveys count for user ${userId}: ${surveys.length}`)
  await useStorage().setItem(userSurveysKey, surveys)
  console.log(`✅ Created survey: ${survey.title} for user ${userId}`)
  
  // 驗證保存
  const verify = await getAllSurveys(event)
  console.log(`🔍 Verification: ${verify.length} surveys in storage for user ${userId}`)
  
  return survey
}

export const updateSurvey = async (id: string, updatedSurvey: Partial<Survey>, event: any): Promise<Survey | undefined> => {
  const userId = getUserId(event)
  const userSurveysKey = getUserKey(SURVEYS_KEY, userId)
  
  const surveys = await getAllSurveys(event)
  const index = surveys.findIndex(s => s.id === id)
  if (index !== -1) {
    surveys[index] = { 
      ...surveys[index], 
      ...updatedSurvey, 
      updatedAt: createTimeStamp() 
    }
    await useStorage().setItem(userSurveysKey, surveys)
    console.log(`✅ Updated survey: ${surveys[index].title} for user ${userId}`)
    return surveys[index]
  }
  return undefined
}

export const deleteSurvey = async (id: string, event: any): Promise<boolean> => {
  const userId = getUserId(event)
  const userSurveysKey = getUserKey(SURVEYS_KEY, userId)
  const userResponsesKey = getUserKey(RESPONSES_KEY, userId)
  
  const surveys = await getAllSurveys(event)
  const initialLength = surveys.length
  const newSurveys = surveys.filter(s => s.id !== id)
  await useStorage().setItem(userSurveysKey, newSurveys)
  
  // 同時刪除相關的回應
  const responses = await getAllResponses(event)
  const newResponses = responses.filter(r => r.surveyId !== id)
  await useStorage().setItem(userResponsesKey, newResponses)
  
  console.log(`✅ Deleted survey and its responses for user ${userId}`)
  return newSurveys.length < initialLength
}

// ============ 回應相關函數 ============

export const getAllResponses = async (event: any): Promise<SurveyResponse[]> => {
  try {
    const userId = getUserId(event)
    const userResponsesKey = getUserKey(RESPONSES_KEY, userId)
    
    const responses = await useStorage().getItem(userResponsesKey) as SurveyResponse[] | null
    if (responses && Array.isArray(responses)) {
      console.log(`📦 Loaded ${responses.length} responses for user ${userId}`)
      return responses
    }
    console.log(`📋 No responses found for user ${userId}, initializing with defaults`)
    const defaultResponses = getDefaultResponses()
    await useStorage().setItem(userResponsesKey, defaultResponses)
    return defaultResponses
  } catch (error) {
    console.error('❌ Error loading responses:', error)
    return getDefaultResponses()
  }
}

export const getSurveyResponses = async (surveyId: string, event: any): Promise<SurveyResponse[]> => {
  const responses = await getAllResponses(event)
  return responses.filter(r => r.surveyId === surveyId)
}

export const submitSurveyResponse = async (response: SurveyResponse, event: any): Promise<SurveyResponse> => {
  const userId = getUserId(event)
  const userResponsesKey = getUserKey(RESPONSES_KEY, userId)
  
  const responses = await getAllResponses(event)
  responses.push(response)
  await useStorage().setItem(userResponsesKey, responses)
  console.log(`✅ Submitted response for survey: ${response.surveyId} by user ${userId}`)
  return response
}