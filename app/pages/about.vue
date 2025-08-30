<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- 麵包屑導航 -->
      <div class="mb-8">
        <Breadcrumb :items="breadcrumbs" />
      </div>

      <!-- 標題區域 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">關於 SurveyFlow</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          現代化的線上問卷調查平台，讓問卷設計與數據收集變得簡單高效
        </p>
      </div>

      <!-- 內容區域 -->
      <div class="prose prose-lg max-w-none">
        <section class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">我們的使命</h2>
          <p class="text-gray-700 leading-relaxed">
            SurveyFlow
            致力於為個人、企業和組織提供最專業、易用的線上問卷調查解決方案。我們相信每個人都應該能夠輕鬆地收集、分析和理解數據，以做出更好的決策。
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">核心特色</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <h3 class="text-lg font-semibold text-blue-600 mb-2">直觀的拖拽編輯器</h3>
              <p class="text-gray-600">無需編程知識，通過簡單的拖拽操作即可創建專業問卷</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <h3 class="text-lg font-semibold text-green-600 mb-2">即時數據分析</h3>
              <p class="text-gray-600">實時查看回應統計，支援多種圖表形式的數據視覺化</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <h3 class="text-lg font-semibold text-purple-600 mb-2">多語言支援</h3>
              <p class="text-gray-600">支援繁體中文、英文等多種語言，滿足不同用戶需求</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <h3 class="text-lg font-semibold text-orange-600 mb-2">響應式設計</h3>
              <p class="text-gray-600">完美適配桌面、平板和手機等各種設備</p>
            </div>
          </div>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">適用場景</h2>
          <ul class="space-y-3 text-gray-700">
            <li class="flex items-center">
              <i class="fa-solid fa-check text-green-500 mr-3"></i>
              市場調查與消費者研究
            </li>
            <li class="flex items-center">
              <i class="fa-solid fa-check text-green-500 mr-3"></i>
              客戶滿意度調查
            </li>
            <li class="flex items-center">
              <i class="fa-solid fa-check text-green-500 mr-3"></i>
              員工回饋與意見收集
            </li>
            <li class="flex items-center">
              <i class="fa-solid fa-check text-green-500 mr-3"></i>
              學術研究與問卷調查
            </li>
            <li class="flex items-center">
              <i class="fa-solid fa-check text-green-500 mr-3"></i>
              活動報名與資料收集
            </li>
            <li class="flex items-center">
              <i class="fa-solid fa-check text-green-500 mr-3"></i>
              產品反饋與使用體驗調查
            </li>
          </ul>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">技術優勢</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            SurveyFlow 採用現代化的 Web 技術棧，確保平台的穩定性、安全性和擴展性：
          </p>
          <ul class="space-y-2 text-gray-700">
            <li>• 基於 Nuxt 3 框架，提供優秀的 SEO 和性能表現</li>
            <li>• 使用 TypeScript 開發，確保代碼質量和可維護性</li>
            <li>• 響應式設計，完美支援各種設備和屏幕尺寸</li>
            <li>• 數據本地存儲，保護用戶隱私和數據安全</li>
          </ul>
        </section>

        <section class="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-lg">
          <h2 class="text-2xl font-semibold mb-4">立即開始使用 SurveyFlow</h2>
          <p class="mb-6">免費創建您的第一份專業問卷，體驗現代化的調查工具</p>
          <NuxtLink to="/creator">
            <el-button size="large" class="bg-white text-blue-600 hover:bg-gray-50">
              <i class="fa-solid fa-plus mr-2"></i>
              立即創建問卷
            </el-button>
          </NuxtLink>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO 設定
useSeoMeta({
  title: '關於我們 - SurveyFlow',
  description:
    'SurveyFlow 是專業的線上問卷調查平台，提供直觀的拖拽編輯器、即時數據分析、多語言支援等功能。適用於市場調查、客戶滿意度調查、學術研究等各種場景。',
  keywords: 'SurveyFlow,關於我們,問卷調查平台,市場調查,客戶滿意度,學術研究,數據收集,about',
  ogTitle: '關於 SurveyFlow - 專業線上問卷調查平台',
  ogDescription: 'SurveyFlow 是專業的線上問卷調查平台，提供直觀的拖拽編輯器、即時數據分析等功能。',
  ogImage: 'https://nuxt-survey.vercel.app/og-image.svg',
  ogUrl: 'https://nuxt-survey.vercel.app/about',
  robots: 'index, follow',
})

const { t } = useI18n()

const breadcrumbs = [
  {
    label: t('common.home'),
    to: '/',
    icon: 'fa-solid fa-home',
  },
  {
    label: '關於我們',
    icon: 'fa-solid fa-info-circle',
  },
]
</script>

<style scoped>
.prose {
  color: inherit;
}
.prose h2 {
  color: inherit;
  font-weight: 600;
}
.prose h3 {
  color: inherit;
  font-weight: 600;
}
</style>
