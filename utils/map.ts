import type { QType } from '~~/types/index'

// 問題類型
export const QUESTION_TYPE_LABELS: Record<QType, string> = {
  text: '文字題',
  number: '數字題',
  date: '日期題',
  time: '時間題',
  single: '單選題',
  multiple: '多選題',
} as const

// 問題類型默認值
export const QUESTION_DEFAULT_TITLES: Record<QType, string> = {
  text: '文字題',
  number: '數字題',
  date: '日期題',
  time: '時間題',
  single: '單選題',
  multiple: '多選題',
} as const

// 問題類型默認提示範例
export const QUESTION_DEFAULT_TIPS: Record<QType, string> = {
  text: '請詳細說明您的想法，字數建議在50字以上',
  number: '請輸入正整數，若無特別說明可填寫0',
  date: '請選擇您希望的日期，格式為年-月-日',
  time: '請選擇具體的時間點，採用24小時制',
  single: '請從以下選項中選擇一個最符合您情況的答案',
  multiple: '可以選擇多個選項，請勾選所有符合的項目',
} as const

// ============ 狀態相關 ============

// 狀態標籤
export const STATUS_LABELS = {
  draft: '草稿',
  published: '已發布',
} as const

// ============ 瀏覽器檢測 ============
interface BrowserRule {
  pattern: string | string[]
  name: string
  exclude?: string
}

export const BROWSER_DETECTION_RULES: BrowserRule[] = [
  { pattern: 'Edg/', name: 'Microsoft Edge' },
  { pattern: ['Chrome/', 'Safari/'], name: 'Google Chrome', exclude: 'Edg/' },
  { pattern: 'Firefox/', name: 'Mozilla Firefox' },
  { pattern: 'Safari/', name: 'Safari', exclude: 'Chrome/' },
  { pattern: ['OPR/', 'Opera/'], name: 'Opera' },
]

export const detectBrowser = (userAgent: string): string => {
  if (!userAgent || userAgent === 'Unknown') return 'Unknown'
  
  for (const rule of BROWSER_DETECTION_RULES) {
    const patterns = Array.isArray(rule.pattern) ? rule.pattern : [rule.pattern]
    const hasPattern = patterns.every(pattern => userAgent.includes(pattern))
    const hasExclude = rule.exclude && userAgent.includes(rule.exclude)
    
    if (hasPattern && !hasExclude) {
      return rule.name
    }
  }
  
  return '其他瀏覽器'
}
