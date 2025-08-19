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
