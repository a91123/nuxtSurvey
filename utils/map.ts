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
  text: '請輸入您的想法或意見',
  number: '請輸入數字',
  date: '請選擇日期',
  time: '請選擇時間',
  single: '請選擇一個選項',
  multiple: '可選擇多個選項',
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

// ============ 瀏覽器顏色映射 ============

export const BROWSER_COLORS: Record<string, { gradient: string; text: string }> = {
  'Google Chrome': { 
    gradient: 'bg-gradient-to-r from-blue-500 to-blue-600', 
    text: 'text-blue-600' 
  },
  'Mozilla Firefox': { 
    gradient: 'bg-gradient-to-r from-orange-500 to-orange-600', 
    text: 'text-orange-600' 
  },
  'Microsoft Edge': { 
    gradient: 'bg-gradient-to-r from-cyan-500 to-cyan-600', 
    text: 'text-cyan-600' 
  },
  'Safari': { 
    gradient: 'bg-gradient-to-r from-gray-500 to-gray-600', 
    text: 'text-gray-600' 
  },
  'Opera': { 
    gradient: 'bg-gradient-to-r from-red-500 to-red-600', 
    text: 'text-red-600' 
  },
  'Unknown': { 
    gradient: 'bg-gradient-to-r from-purple-500 to-purple-600', 
    text: 'text-purple-600' 
  },
  '其他瀏覽器': { 
    gradient: 'bg-gradient-to-r from-indigo-500 to-indigo-600', 
    text: 'text-indigo-600' 
  }
}

export const getBrowserColor = (browserName: string) => {
  return BROWSER_COLORS[browserName] || BROWSER_COLORS['其他瀏覽器']
}