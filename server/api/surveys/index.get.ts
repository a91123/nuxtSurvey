export default defineEventHandler((event) => {
    const {
      title = '',
      status = '',
      sort = 'recent', 
      page = 1,
      pageSize = 9
    } = getQuery(event) as Record<string, string>
  
    const all = [
      { id: 1, title: '2025 使用者體驗調查', desc: '新版設計回饋', status: 'published', questions: 10, responses: 134, updatedAt: '2025-08-10' },
      { id: 2, title: '行銷活動成效調查', desc: '近期活動反饋', status: 'draft',   questions: 8,  responses: 0,   updatedAt: '2025-08-05' },
      { id: 3, title: '產品功能需求調查', desc: '未來功能建議', status: 'published', questions: 12, responses: 89,  updatedAt: '2025-07-28' },
      { id: 4, title: '客服滿意度',       desc: '近期客服互動回饋', status: 'published', questions: 6,  responses: 47,  updatedAt: '2025-08-09' },
      { id: 5, title: '新品包裝調查',     desc: '設計 A/B 偏好',  status: 'draft',   questions: 5,  responses: 0,   updatedAt: '2025-08-03' },
      { id: 6, title: '網站易用性',       desc: '任務完成度與 SUS', status: 'published', questions: 9,  responses: 61,  updatedAt: '2025-08-11' },
      { id: 7, title: '教育訓練回饋',     desc: '內訓課程意見',    status: 'published', questions: 7,  responses: 22,  updatedAt: '2025-08-01' },
      { id: 8, title: '社群活動調查',     desc: '見面會回饋',      status: 'draft',   questions: 4,  responses: 0,   updatedAt: '2025-07-30' },
      { id: 9, title: '功能使用頻率',     desc: '月活與功能覆蓋',  status: 'published', questions: 11, responses: 103, updatedAt: '2025-08-12' },
      { id: 10, title: '售後服務調查',    desc: 'RMA 流程體驗',   status: 'published', questions: 8,  responses: 18,  updatedAt: '2025-08-07' },
    ]
  
    const kw = String(title || '').trim().toLowerCase()
    let list = kw
      ? all.filter(it => it.title.toLowerCase().includes(kw) || (it.desc || '').toLowerCase().includes(kw))
      : all.slice()
  
    // 狀態
    if (status) list = list.filter(it => it.status === status)
  
    // 排序
    switch (sort) {
      case 'responses':
        list.sort((a, b) => b.responses - a.responses)
        break
      case 'questions':
        list.sort((a, b) => b.questions - a.questions)
        break
      case 'title-asc':
        list.sort((a, b) => a.title.localeCompare(b.title, 'zh-Hant'))
        break
      case 'title-desc':
        list.sort((a, b) => b.title.localeCompare(a.title, 'zh-Hant'))
        break
      case 'recent':
      default:
        list.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    }
  
    const p = Math.max(1, parseInt(String(page), 10) || 1)
    const ps = Math.min(50, Math.max(1, parseInt(String(pageSize), 10) || 9))
    const total = list.length
    const pageCount = Math.max(1, Math.ceil(total / ps))
    const start = (p - 1) * ps
    const end = start + ps
    const items = list.slice(start, end)
  
    return {
      items,
      total,
      page: p,
      pageSize: ps,
      pageCount,
      hasPrev: p > 1,
      hasNext: p < pageCount
    }
  })