// API 響應類型
export interface SurveyListItem {
  id: number
  title: string
  desc: string
  status: 'published' | 'draft'
  questions: number
  responses: number
  updatedAt: string
}

export interface SurveyListResponse {
  items: SurveyListItem[]
  total: number
  page: number
  pageSize: number
  pageCount: number
  hasPrev: boolean
  hasNext: boolean
}

declare global {
  // 確保 composables 的類型可以被正確識別
  interface NuxtApp {
    // 可以在這裡添加全局類型
  }
}
