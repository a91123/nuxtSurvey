<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <!-- Hero Section -->
    <section class="relative px-4 pt-16 pb-24 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center">
          <h1 class="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight">
            <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> SurveyFlow </span>
          </h1>
          <p class="mt-6 text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {{ $t('home.hero_subtitle') }}
          </p>
          <p class="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            {{ $t('home.hero_description') }}
          </p>

          <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/creator">
              <el-button type="primary" size="large" class="w-full sm:w-auto px-8 py-3 text-lg">
                <i class="fa-solid fa-plus mr-2"></i>
                {{ $t('home.start_creating') }}
              </el-button>
            </NuxtLink>
            <NuxtLink to="/dashboard">
              <el-button size="large" plain class="w-full sm:w-auto px-8 py-3 text-lg">
                <i class="fa-solid fa-chart-line mr-2"></i>
                {{ $t('home.view_dashboard') }}
              </el-button>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Floating Elements -->
      <div class="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div
        class="absolute top-40 right-16 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse"
        style="animation-delay: 1s"
      ></div>
      <div
        class="absolute bottom-20 left-1/4 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse"
        style="animation-delay: 2s"
      ></div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {{ $t('home.features_title') }}
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            {{ $t('home.features_subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div
            class="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-shadow"
          >
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fa-solid fa-wand-magic-sparkles text-2xl text-blue-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ $t('home.feature_1_title') }}</h3>
            <p class="text-gray-600">{{ $t('home.feature_1_desc') }}</p>
          </div>

          <!-- Feature 2 -->
          <div
            class="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-shadow"
          >
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fa-solid fa-chart-pie text-2xl text-green-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ $t('home.feature_2_title') }}</h3>
            <p class="text-gray-600">{{ $t('home.feature_2_desc') }}</p>
          </div>

          <!-- Feature 3 -->
          <div
            class="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-shadow"
          >
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fa-solid fa-mobile-screen-button text-2xl text-purple-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ $t('home.feature_3_title') }}</h3>
            <p class="text-gray-600">{{ $t('home.feature_3_desc') }}</p>
          </div>

          <!-- Feature 4 -->
          <div
            class="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-lg transition-shadow"
          >
            <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fa-solid fa-share-nodes text-2xl text-orange-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ $t('home.feature_4_title') }}</h3>
            <p class="text-gray-600">{{ $t('home.feature_4_desc') }}</p>
          </div>

          <!-- Feature 5 -->
          <div
            class="text-center p-6 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 hover:shadow-lg transition-shadow"
          >
            <div class="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fa-solid fa-download text-2xl text-teal-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ $t('home.feature_5_title') }}</h3>
            <p class="text-gray-600">{{ $t('home.feature_5_desc') }}</p>
          </div>

          <!-- Feature 6 -->
          <div
            class="text-center p-6 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 hover:shadow-lg transition-shadow"
          >
            <div class="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fa-solid fa-globe text-2xl text-rose-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ $t('home.feature_6_title') }}</h3>
            <p class="text-gray-600">{{ $t('home.feature_6_desc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it Works Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {{ $t('home.how_it_works_title') }}
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            {{ $t('home.how_it_works_subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="relative">
              <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="text-2xl font-bold text-white">1</span>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ $t('home.step_1_title') }}</h3>
            <p class="text-gray-600">{{ $t('home.step_1_desc') }}</p>
          </div>

          <div class="text-center">
            <div class="relative">
              <div class="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="text-2xl font-bold text-white">2</span>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ $t('home.step_2_title') }}</h3>
            <p class="text-gray-600">{{ $t('home.step_2_desc') }}</p>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl font-bold text-white">3</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ $t('home.step_3_title') }}</h3>
            <p class="text-gray-600">{{ $t('home.step_3_desc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl font-bold text-blue-600 mb-2">{{ stats.total || '100+' }}</div>
            <div class="text-gray-600">{{ $t('home.stat_surveys') }}</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-green-600 mb-2">{{ stats.responses || '1000+' }}</div>
            <div class="text-gray-600">{{ $t('home.stat_responses') }}</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-purple-600 mb-2">{{ stats.users || '50+' }}</div>
            <div class="text-gray-600">{{ $t('home.stat_users') }}</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-orange-600 mb-2">99%</div>
            <div class="text-gray-600">{{ $t('home.stat_satisfaction') }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6">
          {{ $t('home.cta_title') }}
        </h2>
        <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          {{ $t('home.cta_description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/creator">
            <el-button size="large" class="w-full sm:w-auto px-8 py-3 text-lg bg-white text-blue-600 hover:bg-gray-50">
              <i class="fa-solid fa-rocket mr-2"></i>
              {{ $t('home.get_started') }}
            </el-button>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO 設定 - 使用 useSeoMeta 是 Nuxt 3 的最佳實踐
useSeoMeta({
  title: 'SurveyFlow - 專業線上問卷調查平台',
  description:
    'SurveyFlow 是專業的線上問卷調查系統，支援拖拽式問卷建立、多種題型、即時數據統計。適合市場調查、客戶回饋、學術研究等各種場景。',
  keywords:
    'SurveyFlow,問卷調查,線上問卷,市場調查,客戶回饋,數據收集,統計分析,免費問卷工具,表單建立,survey,questionnaire',
  ogTitle: 'SurveyFlow - 專業線上問卷調查平台',
  ogDescription: 'SurveyFlow 是專業的線上問卷調查系統，輕鬆建立專業問卷，收集和分析數據。',
  ogImage: 'https://nuxt-survey.vercel.app/og-image.svg',
  ogUrl: 'https://nuxt-survey.vercel.app',
  twitterTitle: 'SurveyFlow - 專業線上問卷調查平台',
  twitterDescription: 'SurveyFlow 是專業的線上問卷調查系統，輕鬆建立專業問卷，收集和分析數據。',
  twitterImage: 'https://nuxt-survey.vercel.app/og-image.svg',
  twitterCard: 'summary_large_image',
})

// 結構化數據 - 只在首頁需要
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'SurveyFlow',
        description: 'SurveyFlow 是專業的線上問卷調查系統',
        url: 'https://nuxt-survey.vercel.app',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'TWD',
          availability: 'https://schema.org/InStock',
        },
        featureList: ['拖拽式問卷建立', '多種題型支援', '即時數據統計', '響應式設計', '多格式匯出', '多語言支援'],
      }),
    },
  ],
})

const { t } = useI18n()

// 獲取統計數據
const { data: surveyStats } = await useFetch('/api/surveys/stats', {
  default: () => ({ success: true, data: { total: 0, responses: 0, users: 0 } }),
})

const stats = computed(() => {
  if (surveyStats.value && surveyStats.value.success) {
    return surveyStats.value.data
  }
  return { total: 0, responses: 0, users: 0 }
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.4;
  }
}
</style>
