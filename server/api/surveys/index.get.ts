export default defineEventHandler(async (event) => {
  const {
    title = '',
    status = '',
    sort = 'recent', 
    page = 1,
    pageSize = 9
  } = getQuery(event) as Record<string, string>

  console.log('📡 API: 獲取問卷列表請求')

  // 使用 server store 獲取數據
  const { getServerSurveyStore } = await import('../../../server/utils/surveyStore')
  const serverStore = getServerSurveyStore()
  const allSurveys = await serverStore.getAllSurveys()

  // 轉換格式以兼容原有前端
  const all = allSurveys.map((survey: any) => ({
    id: parseInt(survey.id),
    title: survey.title,
    desc: survey.desc,
    status: survey.status === '已發布' ? 'published' : 'draft',
    questions: survey.questions.length,
    responses: Math.floor(Math.random() * 150), // 模擬回應數
    updatedAt: survey.updatedAt.split('T')[0] // 只保留日期部分
  }))

  const kw = String(title || '').trim().toLowerCase()
  let list = kw
    ? all.filter((it: any) => it.title.toLowerCase().includes(kw) || (it.desc || '').toLowerCase().includes(kw))
    : all.slice()

  // 狀態篩選
  if (status && status !== 'all' && status !== '') list = list.filter((it: any) => it.status === status)

  // 排序
  switch (sort) {
    case 'responses':
      list.sort((a: any, b: any) => b.responses - a.responses)
      break
    case 'questions':
      list.sort((a: any, b: any) => b.questions - a.questions)
      break
    case 'title-asc':
      list.sort((a: any, b: any) => a.title.localeCompare(b.title, 'zh-Hant'))
      break
    case 'title-desc':
      list.sort((a: any, b: any) => b.title.localeCompare(a.title, 'zh-Hant'))
      break
    case 'recent':
    default:
      list.sort((a: any, b: any) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
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