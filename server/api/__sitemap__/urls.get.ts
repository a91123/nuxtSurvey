export default defineEventHandler(async (event) => {
  return [
    {
      loc: '/',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: '/dashboard',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: '/creator',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.9
    }
  ]
})
