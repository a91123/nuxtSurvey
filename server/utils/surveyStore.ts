// Server 端的 Survey 數據管理 - 模擬數據庫
import type { Survey, Question, CreateSurveyPayload, UpdateSurveyPayload } from '~~/stores/surveys'
import { v4 as uuid } from 'uuid'
class ServerSurveyStore {
  private surveys: Map<string, Survey> = new Map()

  constructor() {
    this.initializeData()
  }

  private initializeData() {
    const initialSurveys: Survey[] = [
      {
        id: '1',
        title: '顧客滿意度調查',
        desc: '我們希望了解您對我們服務的看法',
        status: '已發布',
        questions: [
          {
            id: uuid(),
            type: 'text',
            label: '請輸入您的姓名',
            required: true
          },
          {
            id: uuid(),
            type: 'single',
            label: '您對我們的服務滿意嗎？',
            required: true,
            options: ['非常滿意', '滿意', '普通', '不滿意', '非常不滿意']
          },
          {
            id: uuid(),
            type: 'number',
            label: '您給我們的服務打幾分？（1-10分）',
            required: false
          },
          {
            id: uuid(),
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
            id: uuid(),
            type: 'text',
            label: '您最常使用的功能是什麼？',
            required: true
          },
          {
            id: uuid(),
            type: 'single',
            label: '您會推薦我們的產品給朋友嗎？',
            required: true,
            options: ['絕對會', '可能會', '不確定', '可能不會', '絕對不會']
          }
        ],
        createdAt: '2024-01-16T09:15:00Z',
        updatedAt: '2024-01-16T09:15:00Z'
      }
    ]

    initialSurveys.forEach(survey => {
      this.surveys.set(survey.id, survey)
    })

    console.log('🗄️ Server Store: 初始化完成，載入', this.surveys.size, '筆問卷數據')
  }

  // 模擬網路延遲
  private async simulateDelay(ms: number = 300) {
    await new Promise(resolve => setTimeout(resolve, ms))
  }

  // 獲取所有問卷
  async getAllSurveys(): Promise<Survey[]> {
    await this.simulateDelay()
    const surveys = Array.from(this.surveys.values())
    console.log('🗄️ Server Store: 獲取所有問卷，共', surveys.length, '筆')
    return surveys
  }

  // 根據 ID 獲取單個問卷
  async getSurveyById(id: string): Promise<Survey | null> {
    await this.simulateDelay()
    const survey = this.surveys.get(id)
    if (survey) {
      console.log('🗄️ Server Store: 獲取問卷', id, '-', survey.title)
    } else {
      console.log('🗄️ Server Store: 找不到問卷', id)
    }
    return survey || null
  }

  // 創建新問卷
  async createSurvey(payload: CreateSurveyPayload): Promise<Survey> {
    await this.simulateDelay()

    // 驗證
    if (!payload.title?.trim()) {
      throw new Error('問卷標題不能為空')
    }

    if (!payload.questions || payload.questions.length === 0) {
      throw new Error('問卷必須至少有一個問題')
    }

    const newSurvey: Survey = {
      id: Date.now().toString(),
      title: payload.title.trim(),
      desc: payload.desc?.trim() || '',
      status: payload.status || '草稿',
      questions: payload.questions.map((q: any, index: number) => ({
        ...q,
        id: index + 1
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.surveys.set(newSurvey.id, newSurvey)
    console.log('🗄️ Server Store: 創建問卷', newSurvey.id, '-', newSurvey.title)
    
    return newSurvey
  }

  // 更新問卷
  async updateSurvey(id: string, payload: UpdateSurveyPayload): Promise<Survey> {
    await this.simulateDelay()

    const existingSurvey = this.surveys.get(id)
    if (!existingSurvey) {
      throw new Error('找不到指定的問卷')
    }

    // 驗證
    if (!payload.title?.trim()) {
      throw new Error('問卷標題不能為空')
    }

    const updatedSurvey: Survey = {
      ...existingSurvey,
      title: payload.title.trim(),
      desc: payload.desc?.trim() || '',
      status: payload.status || existingSurvey.status,
      questions: payload.questions.map((q: any, index: number) => ({
        ...q,
        id: q.id || index + 1
      })),
      updatedAt: new Date().toISOString()
    }

    this.surveys.set(id, updatedSurvey)
    console.log('🗄️ Server Store: 更新問卷', id, '-', updatedSurvey.title)
    
    return updatedSurvey
  }

  // 刪除問卷
  async deleteSurvey(id: string): Promise<boolean> {
    await this.simulateDelay()

    const existingSurvey = this.surveys.get(id)
    if (!existingSurvey) {
      throw new Error('找不到指定的問卷')
    }

    this.surveys.delete(id)
    console.log('🗄️ Server Store: 刪除問卷', id, '-', existingSurvey.title)
    
    return true
  }

  // 獲取統計信息
  getStats() {
    const surveys = Array.from(this.surveys.values())
    const draftCount = surveys.filter(s => s.status === '草稿').length
    const publishedCount = surveys.filter(s => s.status === '已發布').length
    
    return {
      total: surveys.length,
      draft: draftCount,
      published: publishedCount
    }
  }
}

// 單例模式 - 全域共享的 store 實例
let serverStoreInstance: ServerSurveyStore | null = null

export const getServerSurveyStore = (): ServerSurveyStore => {
  if (!serverStoreInstance) {
    serverStoreInstance = new ServerSurveyStore()
  }
  return serverStoreInstance
}
