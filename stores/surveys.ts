import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
export type QType = 'text' | 'number' | 'date' | 'time' | 'single' | 'multiple'

export interface Question {
  id?: string
  type: QType
  label: string
  required: boolean
  options?: string[]
}

export interface Survey {
  id: string
  title: string
  desc: string
  status: '草稿' | '已發布'
  questions: Question[]
  createdAt: string
  updatedAt: string
}

export interface CreateSurveyPayload {
  title: string
  desc: string
  status: '草稿' | '已發布'
  questions: Question[]
}

export interface UpdateSurveyPayload extends CreateSurveyPayload {}

// 表單數據類型（用於前端表單）
export interface FormData {
  title: string
  desc: string
  status: '草稿' | '已發布'
}

// 編輯器數據類型（用於 FormEditor 組件）
export interface SurveyFormData {
  id?: string | number
  title: string
  desc: string
  status: '草稿' | '已發布'
  questions: Question[]
}

export const useSurveysStore = defineStore('surveys', () => {
  // State
  const surveys = ref<Survey[]>([
    // 預設的模擬數據
    {
      id: '1',
      title: '顧客滿意度調查',
      desc: '我們希望了解您對我們服務的看法',
      status: '已發布',
      questions: [
        {
          id: 'q1',
          type: 'text',
          label: '請輸入您的姓名',
          required: true
        },
        {
          id: 'q2',
          type: 'single',
          label: '您對我們的服務滿意嗎？',
          required: true,
          options: ['非常滿意', '滿意', '普通', '不滿意', '非常不滿意']
        },
        {
          id: 'q3',
          type: 'number',
          label: '您給我們的服務打幾分？（1-10分）',
          required: false
        },
        {
          id: 'q4',
          type: 'date',
          label: '您上次使用我們服務的日期',
          required: false
        }
      ],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T15:45:00Z'
    },
    {
      id: '2',
      title: '產品反饋問卷',
      desc: '幫助我們改進產品',
      status: '草稿',
      questions: [
        {
          id: 'q1',
          type: 'text',
          label: '您最常使用的功能是什麼？',
          required: true
        },
        {
          id: 'q2',
          type: 'single',
          label: '您會推薦我們的產品給朋友嗎？',
          required: true,
          options: ['絕對會', '可能會', '不確定', '可能不會', '絕對不會']
        }
      ],
      createdAt: '2024-01-16T09:15:00Z',
      updatedAt: '2024-01-16T09:15:00Z'
    }
  ])

  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getAllSurveys = computed(() => surveys.value)
  const getSurveyById = computed(() => (id: string) => 
    surveys.value.find(survey => survey.id === id)
  )
  const getDraftSurveys = computed(() => 
    surveys.value.filter(survey => survey.status === '草稿')
  )
  const getPublishedSurveys = computed(() => 
    surveys.value.filter(survey => survey.status === '已發布')
  )

  // Actions
  
  // 模擬延遲（模擬網路請求時間）
  const simulateDelay = (ms: number = 500) => 
    new Promise(resolve => setTimeout(resolve, ms))

  // 獲取所有問卷
  const fetchSurveys = async () => {
    try {
      loading.value = true
      error.value = null
      
      await simulateDelay()
      
      console.log('📡 模擬 API: 獲取問卷列表', surveys.value.length, '筆')
      
      return surveys.value
    } catch (err) {
      error.value = '獲取問卷列表失敗'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 獲取單個問卷
  const fetchSurvey = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      
      await simulateDelay()
      
      const survey = surveys.value.find(s => s.id === id)
      
      if (!survey) {
        const error = new Error('找不到指定的問卷')
        ;(error as any).statusCode = 404
        throw error
      }
      
      console.log('📡 模擬 API: 獲取問卷', id, survey.title)
      
      return survey
    } catch (err) {
      error.value = '獲取問卷失敗'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 創建問卷
  const createSurvey = async (payload: CreateSurveyPayload) => {
    try {
      loading.value = true
      error.value = null
      
      // 驗證
      if (!payload.title.trim()) {
        const error = new Error('問卷標題不能為空')
        ;(error as any).statusCode = 400
        throw error
      }
      
      if (!payload.questions || payload.questions.length === 0) {
        const error = new Error('問卷必須至少有一個問題')
        ;(error as any).statusCode = 400
        throw error
      }
      
      await simulateDelay()
      
      // 創建新問卷
      const newSurvey: Survey = {
        id: Date.now().toString(),
        title: payload.title.trim(),
        desc: payload.desc.trim(),
        status: payload.status,
        questions: payload.questions.map((q) => ({
          ...q,
          id: q.id || uuidv4()
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      surveys.value.push(newSurvey)
      
      console.log('📡 模擬 API: 創建問卷', newSurvey.id, newSurvey.title)
      
      return newSurvey
    } catch (err) {
      error.value = '創建問卷失敗'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 更新問卷
  const updateSurvey = async (id: string, payload: UpdateSurveyPayload) => {
    try {
      loading.value = true
      error.value = null
      
      const index = surveys.value.findIndex(s => s.id === id)
      
      if (index === -1) {
        const error = new Error('找不到指定的問卷')
        ;(error as any).statusCode = 404
        throw error
      }
      
      // 驗證
      if (!payload.title.trim()) {
        const error = new Error('問卷標題不能為空')
        ;(error as any).statusCode = 400
        throw error
      }
      
      await simulateDelay()
      
      // 更新問卷
      const updatedSurvey: Survey = {
        ...surveys.value[index],
        title: payload.title.trim(),
        desc: payload.desc.trim(),
        status: payload.status,
        questions: payload.questions.map((q) => ({
          ...q,
          id: q.id || uuidv4()
        })),
        updatedAt: new Date().toISOString()
      } as Survey
      
      surveys.value[index] = updatedSurvey
      
      console.log('📡 模擬 API: 更新問卷', id, updatedSurvey.title)
      
      return updatedSurvey
    } catch (err) {
      error.value = '更新問卷失敗'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 刪除問卷
  const deleteSurvey = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      
      const index = surveys.value.findIndex(s => s.id === id)
      
      if (index === -1) {
        const error = new Error('找不到指定的問卷')
        ;(error as any).statusCode = 404
        throw error
      }
      
      await simulateDelay()
      
      const deletedSurvey = surveys.value[index]
      surveys.value.splice(index, 1)
      
      console.log('📡 模擬 API: 刪除問卷', id, deletedSurvey?.title)
      
      return { success: true, message: '問卷已刪除' }
    } catch (err) {
      error.value = '刪除問卷失敗'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 清除錯誤
  const clearError = () => {
    error.value = null
  }

  // 重置 store
  const reset = () => {
    surveys.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    surveys,
    loading,
    error,
    
    // Getters
    getAllSurveys,
    getSurveyById,
    getDraftSurveys,
    getPublishedSurveys,
    
    // Actions
    fetchSurveys,
    fetchSurvey,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    clearError,
    reset
  }
})
