// 基礎問卷類型
export type QType = 'text' | 'number' | 'date' | 'time' | 'single' | 'multiple'

export interface Question {
  id?: string
  type: QType
  title: string
  required: boolean
  options?: string[]
  min?: number // 數字類型的最小值限制
  max?: number // 數字類型的最大值限制
  tip?: string // 問題的提示文字
}

export interface Survey {
  id: string
  title: string
  description: string
  status: 'published' | 'draft'
  questions: Question[]
  createdAt: string
  updatedAt: string
}

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

// 問卷提交相關類型
export interface AnswerItem {
  id: string
  value: any
}

export interface SubmitSurveyPayload {
  answers: AnswerItem[]
}

export interface SurveyResponse {
  id: string
  surveyId: string
  answers: AnswerItem[]
  submittedAt: string
  userAgent: string
}

export interface SubmitSurveyResult {
  success: boolean
  data: {
    responseId: string
    submittedAt: string
  }
  message: string
}

// 統計相關類型
export interface SurveyStats {
  surveyInfo: {
    id: string
    title: string
    desc: string
    status: string
    createdAt: string
    updatedAt: string
  }
  overview: {
    totalResponses: number
    totalQuestions: number
    responseRate: number
    lastResponseAt: string | null
  }
  questionStats: QuestionStat[]
  browserStats: BrowserStat[]
  responseDetails: ResponseDetail[]
}

export interface QuestionStat {
  questionId: string
  questionLabel: string
  questionType: string
  totalResponses: number
  responseRate: string
  optionStats?: OptionStat[]
  numberStats?: NumberStat
  textStats?: TextStat
  dateStats?: DateStat
}

export interface OptionStat {
  option: string
  count: number
  percentage: string
}

export interface NumberStat {
  min: number
  max: number
  average: string
  total: number
}

export interface TextStat {
  averageLength: number
  totalWords: number
}

export interface DateStat {
  earliest: string
  latest: string
}

export interface ResponseDetail {
  id: string
  submittedAt: string
  userAgent: string
  answersCount: number
}

// ============ 共用工具類型 ============
// 注意: 映射常量已移至 utils/map.ts

// ============ API 類型修正 ============
export interface SurveyListAPIItem {
  id: string
  title: string
  description: string
  status: 'draft' | 'published'
  questions: number
  responses: number
  updatedAt: string
}

// API 通用響應格式
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// 瀏覽器統計類型
export interface BrowserStat {
  browser: string
  count: number
  percentage: string
}

// 全域類型聲明
declare global {
  interface Window {
    __ECHARTS_READY__?: boolean
  }
}