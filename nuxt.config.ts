// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss','@pinia/nuxt', ['@element-plus/nuxt', { importStyle: 'css' }]],
  css: ['@fortawesome/fontawesome-free/css/all.min.css','~/assets/css/themes.css']
})
