import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@element-plus/nuxt'
  ],
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
  // SEO 和 Meta 標籤設定
  app: {
    head: {
      title: '我的問卷系統',
      titleTemplate: '%s - 現代化線上問卷調查平台',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '專業的線上問卷調查系統，輕鬆建立、分享和分析問卷數據' },
        { name: 'keywords', content: '問卷調查,線上問卷,表單建立,數據分析,調查工具' },
        { name: 'author', content: 'tom' },
        { name: 'robots', content: 'index, follow' },
        
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: '我的問卷系統 - 現代化線上問卷調查平台' },
        { property: 'og:description', content: '專業的線上問卷調查系統，輕鬆建立、分享和分析問卷數據' },
        { property: 'og:site_name', content: '我的問卷系統' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: '我的問卷系統 - 現代化線上問卷調查平台' },
        { name: 'twitter:description', content: '專業的線上問卷調查系統，輕鬆建立、分享和分析問卷數據' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://your-domain.com' }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: '我的問卷系統',
            description: '現代化的線上問卷調查平台，提供問卷建立、數據收集和統計分析功能',
            url: 'https://your-domain.com',
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
