import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@element-plus/nuxt',
    '@nuxtjs/sitemap'
  ],
  
  elementPlus: {
    importStyle: 'scss'
  },
  // i18n 設定
  i18n: {
    locales: [
      { code: 'zh-TW', file: 'zh-TW.json', name: '繁體中文' },
      { code: 'en', file: 'en.json', name: 'English' }
    ],
    defaultLocale: 'zh-TW',
    langDir: 'locales/',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      cookieSecure: false,
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'zh-TW'
    }
  },
  css: [
    '@fortawesome/fontawesome-free/css/all.min.css',
    '~/assets/css/custom.css'
  ],
  // 設定 headers
  nitro: {
    routeRules: {
      '/sitemap.xml': { 
        headers: { 
          'Content-Type': 'application/xml; charset=utf-8'
        }
      },
      '/robots.txt': { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
      // 設定不需要被搜索引擎索引的頁面
      '/editor/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
      '/stats/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
      '/survey/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
      '/api/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
    },
    externals: {
      inline: ['xlsx']
    },
    moduleSideEffects: ['xlsx']
  },
  // Sitemap 設定
  site: {
    url: 'https://nuxt-survey.vercel.app',
    name: 'SurveyFlow',
    description: 'SurveyFlow - 專業的線上問卷調查系統',
    defaultLocale: 'zh-TW'
  },
  
  // Sitemap 詳細配置
  sitemap: {
    urls: [
      {
        loc: '/',
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString()
      },
      {
        loc: '/dashboard',
        changefreq: 'weekly', 
        priority: 0.8,
        lastmod: new Date().toISOString()
      },
      {
        loc: '/creator',
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString()
      },
      {
        loc: '/about',
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString()
      },
      {
        loc: '/features',
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString()
      },
      {
        loc: '/privacy',
        changefreq: 'yearly',
        priority: 0.5,
        lastmod: new Date().toISOString()
      }
    ],
    exclude: ['/editor/**', '/stats/**', '/survey/**', '/api/**'],
    defaults: {
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString()
    }
  },
  // SEO 和 Meta 標籤設定
  app: {
    head: {
      title: 'SurveyFlow',
      titleTemplate: '%s - 現代化線上問卷調查平台',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'SurveyFlow - 專業的線上問卷調查系統，輕鬆建立、分享和分析問卷數據' },
        { name: 'keywords', content: '問卷調查,線上問卷,表單建立,數據分析,調查工具' },
        { name: 'author', content: 'tom' },
        { name: 'robots', content: 'index, follow' },
        // Google Search Console 驗證
        { name: 'google-site-verification', content: 'bqttwLt2ljAcqqsx060G-MqF_LMz4oiUAcKKxD6EDj0' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'SurveyFlow - 現代化線上問卷調查平台' },
        { property: 'og:description', content: 'SurveyFlow - 專業的線上問卷調查系統，輕鬆建立、分享和分析問卷數據' },
        { property: 'og:url', content: 'https://nuxt-survey.vercel.app' },
        { property: 'og:site_name', content: 'SurveyFlow' },
        { property: 'og:image', content: 'https://nuxt-survey.vercel.app/og-image.png' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'SurveyFlow - 現代化線上問卷調查平台' },
        { name: 'twitter:description', content: 'SurveyFlow - 專業的線上問卷調查系統，輕鬆建立、分享和分析問卷數據' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://nuxt-survey.vercel.app' }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'SurveyFlow',
            description: 'SurveyFlow - 現代化的線上問卷調查平台，提供問卷建立、數據收集和統計分析功能',
            url: 'https://nuxt-survey.vercel.app',
            operatingSystem: 'Web Browser',
            featureList: [
              '拖拽式問卷建立',
              '多種題型支援',
              '即時數據統計',
              '響應式設計',
            ],
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'TWD',
              availability: 'https://schema.org/InStock'
            },
            applicationCategory: 'BusinessApplication',
            applicationSubCategory: 'SurveyApplication'
          })
        }
      ]
    }
  }
})
