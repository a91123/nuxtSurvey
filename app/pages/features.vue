<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- 麵包屑導航 -->
      <div class="mb-8">
        <Breadcrumb :items="breadcrumbs" />
      </div>

      <!-- 標題區域 -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">功能特色</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          探索 SurveyFlow 的強大功能，讓問卷設計、數據收集和分析變得前所未有的簡單
        </p>
      </div>

      <!-- 核心功能 -->
      <section class="mb-20">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">核心功能</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fa-solid fa-wand-magic-sparkles text-2xl text-blue-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4 text-center">拖拽式編輯器</h3>
            <p class="text-gray-600 text-center leading-relaxed">
              直觀的拖拽介面，無需編程知識即可創建專業問卷。支援多種題型，操作簡單快速。
            </p>
          </div>

          <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fa-solid fa-chart-pie text-2xl text-green-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4 text-center">即時數據分析</h3>
            <p class="text-gray-600 text-center leading-relaxed">
              實時查看問卷回應，自動生成統計圖表。支援圓餅圖、長條圖等多種視覺化方式。
            </p>
          </div>

          <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fa-solid fa-mobile-screen-button text-2xl text-purple-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4 text-center">響應式設計</h3>
            <p class="text-gray-600 text-center leading-relaxed">
              完美適配各種設備，從桌面電腦到手機平板，確保最佳的填寫體驗。
            </p>
          </div>

          <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fa-solid fa-share-nodes text-2xl text-orange-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4 text-center">輕鬆分享</h3>
            <p class="text-gray-600 text-center leading-relaxed">
              一鍵生成分享連結，支援社群媒體分享。輕鬆觸及更多目標受眾。
            </p>
          </div>

          <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div class="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fa-solid fa-download text-2xl text-teal-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4 text-center">數據匯出</h3>
            <p class="text-gray-600 text-center leading-relaxed">
              支援 Excel、CSV 等多種格式匯出，方便後續數據處理和分析。
            </p>
          </div>

          <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div class="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fa-solid fa-globe text-2xl text-rose-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4 text-center">多語言支援</h3>
            <p class="text-gray-600 text-center leading-relaxed">
              支援繁體中文、英文等多種語言介面，滿足不同地區用戶需求。
            </p>
          </div>
        </div>
      </section>

      <!-- 題型支援 -->
      <section class="mb-20">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">豐富的題型支援</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="text-center p-6 bg-white rounded-lg shadow-sm">
            <i class="fa-solid fa-circle-dot text-3xl text-blue-600 mb-4"></i>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">單選題</h3>
            <p class="text-gray-600 text-sm">經典單選選項，適合意見調查</p>
          </div>
          <div class="text-center p-6 bg-white rounded-lg shadow-sm">
            <i class="fa-solid fa-square-check text-3xl text-green-600 mb-4"></i>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">多選題</h3>
            <p class="text-gray-600 text-sm">多項選擇，收集更多回應</p>
          </div>
          <div class="text-center p-6 bg-white rounded-lg shadow-sm">
            <i class="fa-solid fa-keyboard text-3xl text-purple-600 mb-4"></i>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">文字輸入</h3>
            <p class="text-gray-600 text-sm">開放式問題，獲得詳細回饋</p>
          </div>
          <div class="text-center p-6 bg-white rounded-lg shadow-sm">
            <i class="fa-solid fa-calendar text-3xl text-orange-600 mb-4"></i>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">日期時間</h3>
            <p class="text-gray-600 text-sm">日期選擇，適合活動報名</p>
          </div>
        </div>
      </section>

      <!-- 數據視覺化 -->
      <section class="mb-20">
        <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-12">
          <h2 class="text-3xl font-bold text-center text-gray-900 mb-8">強大的數據視覺化</h2>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-chart-pie text-2xl text-white"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">圓餅圖</h3>
              <p class="text-gray-600">直觀顯示比例分布</p>
            </div>
            <div class="text-center">
              <div class="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-chart-column text-2xl text-white"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">長條圖</h3>
              <p class="text-gray-600">清楚展示數據對比</p>
            </div>
            <div class="text-center">
              <div class="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-table text-2xl text-white"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">統計表格</h3>
              <p class="text-gray-600">詳細的數據分析表</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA 區域 -->
      <section class="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-12 rounded-2xl">
        <h2 class="text-3xl font-bold mb-4">體驗 SurveyFlow 的強大功能</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          立即開始創建您的第一份專業問卷，體驗現代化的調查工具帶來的便利
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/creator">
            <el-button size="large" class="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3">
              <i class="fa-solid fa-plus mr-2"></i>
              立即創建問卷
            </el-button>
          </NuxtLink>
          <NuxtLink to="/dashboard">
            <el-button size="large" plain class="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
              <i class="fa-solid fa-chart-line mr-2"></i>
              查看管理後台
            </el-button>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO 設定
useSeoMeta({
  title: '功能特色 - SurveyFlow',
  description:
    'SurveyFlow 提供拖拽式編輯器、即時數據分析、響應式設計、多語言支援等強大功能。支援單選、多選、文字輸入、日期時間等多種題型，以及圓餅圖、長條圖等數據視覺化功能。',
  keywords: 'SurveyFlow,功能特色,拖拽編輯器,數據分析,響應式設計,多語言,問卷題型,數據視覺化,features',
  ogTitle: '功能特色 - SurveyFlow 專業問卷調查平台',
  ogDescription: 'SurveyFlow 提供拖拽式編輯器、即時數據分析、響應式設計等強大功能，支援多種題型和數據視覺化。',
  ogImage: 'https://nuxt-survey.vercel.app/og-image.svg',
  ogUrl: 'https://nuxt-survey.vercel.app/features',
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
    label: '功能特色',
    icon: 'fa-solid fa-star',
  },
]
</script>
