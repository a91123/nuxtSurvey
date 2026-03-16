<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 導航欄 -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 sm:gap-3">
            <i class="fa-solid fa-chart-bar text-blue-600 text-lg sm:text-xl"></i>
            <span class="font-semibold text-gray-800 text-sm sm:text-base">{{ $t('stats.page_title') }}</span>
          </div>
          <div class="flex items-center gap-2 sm:gap-3">
            <!-- 語言切換 -->
            <LanguageSwitcher class="hidden sm:block" />
            <!-- 返回按鈕 -->
            <el-button plain @click="navigateTo('/')" class="text-gray-600 hover:text-blue-600" size="small">
              <i class="fa-solid fa-arrow-left mr-1 sm:mr-2"></i>
              <span class="hidden sm:inline">{{ $t('messages.return_list') }}</span>
              <span class="sm:hidden">{{ $t('common.back') }}</span>
            </el-button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Loading 狀態 -->
    <div v-if="pending" class="flex justify-center items-center min-h-[400px]">
      <div class="text-center">
        <el-loading class="w-16 h-16 mx-auto mb-4" />
        <p class="text-gray-600">{{ $t('messages.load_stats_failed') }}</p>
      </div>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="flex justify-center items-center min-h-[400px]">
      <div class="text-center max-w-md">
        <div class="text-6xl mb-4">😵</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ $t('messages.load_failed') }}</h2>
        <p class="text-gray-600 mb-6">{{ $t('messages.loading_error') }}</p>
        <el-button @click="refresh()">{{ $t('messages.reload') }}</el-button>
        <el-button type="primary" @click="navigateTo('/')">{{ $t('messages.return_home') }}</el-button>
      </div>
    </div>

    <!-- 統計內容 -->
    <main v-else-if="statsData" class="py-4 sm:py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <!-- 麵包屑導航 -->
        <Breadcrumb :items="breadcrumbs" />

        <!-- 問卷基本信息 -->
        <div class="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
            <div class="flex-1">
              <h1 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{{ statsData.surveyInfo.title }}</h1>
              <p class="text-gray-600 mb-4">{{ statsData.surveyInfo.description }}</p>
              <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-500">
                <span
                  >{{ $t('stats.survey_status') }}
                  <span :class="statsData.surveyInfo.status === 'published' ? 'text-green-600' : 'text-yellow-600'">
                    {{ $t(`survey.${statsData.surveyInfo.status}`) }}
                  </span>
                </span>
                <span>{{ $t('stats.created_time', { time: formatDate(statsData.surveyInfo.createdAt) }) }}</span>
                <span>{{ $t('stats.updated_time', { time: formatDate(statsData.surveyInfo.updatedAt) }) }}</span>
              </div>
            </div>

            <!-- 匯出按鈕區域 -->
            <div class="flex flex-col sm:flex-row gap-2 shrink-0">
              <el-dropdown @command="handleExport" placement="bottom-end">
                <el-button type="primary" :loading="exportLoading">
                  <i class="fa-solid fa-download mr-2"></i>
                  {{ $t('stats.export_data') }}
                  <i class="fa-solid fa-chevron-down ml-2"></i>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="csv">
                      <i class="fa-solid fa-file-csv mr-2 text-green-600"></i>
                      {{ $t('stats.export_csv') }}
                    </el-dropdown-item>
                    <el-dropdown-item command="excel">
                      <i class="fa-solid fa-file-excel mr-2 text-emerald-600"></i>
                      {{ $t('stats.export_excel') }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>

        <!-- 總覽統計 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div class="bg-white rounded-lg shadow p-4 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fa-solid fa-users text-blue-500 text-xl sm:text-2xl"></i>
              </div>
              <div class="ml-3 sm:ml-4">
                <p class="text-xs sm:text-sm font-medium text-gray-500">{{ $t('stats.total_responses_label') }}</p>
                <p class="text-xl sm:text-2xl font-semibold text-gray-900">{{ statsData.overview.totalResponses }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-4 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fa-solid fa-question-circle text-green-500 text-xl sm:text-2xl"></i>
              </div>
              <div class="ml-3 sm:ml-4">
                <p class="text-xs sm:text-sm font-medium text-gray-500">{{ $t('stats.total_questions_label') }}</p>
                <p class="text-xl sm:text-2xl font-semibold text-gray-900">{{ statsData.overview.questionsCount }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-4 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fa-solid fa-percentage text-purple-500 text-xl sm:text-2xl"></i>
              </div>
              <div class="ml-3 sm:ml-4">
                <p class="text-xs sm:text-sm font-medium text-gray-500">{{ $t('stats.response_rate_label') }}</p>
                <p class="text-xl sm:text-2xl font-semibold text-gray-900">{{ statsData.overview.responseRate }}%</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-4 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fa-solid fa-clock text-orange-500 text-xl sm:text-2xl"></i>
              </div>
              <div class="ml-3 sm:ml-4">
                <p class="text-xs sm:text-sm font-medium text-gray-500">{{ $t('stats.last_response_label') }}</p>
                <p class="text-sm sm:text-xl lg:text-2xl font-semibold text-gray-900">
                  {{
                    statsData.overview.lastResponseAt
                      ? formatDate(statsData.overview.lastResponseAt)
                      : $t('stats.no_responses')
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 問題統計 -->
        <div class="space-y-6">
          <h2 class="text-xl font-bold text-gray-800">{{ $t('stats.question_stats_title') }}</h2>

          <div
            v-for="questionStat in statsData.questionStats"
            :key="questionStat.questionId"
            class="bg-white rounded-lg shadow p-6"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-800">{{ questionStat.questionTitle }}</h3>
                <p class="text-sm text-gray-500">
                  {{ getQuestionTypeLabel(questionStat.questionType) }} ·
                  {{ $t('stats.response_count', { count: questionStat.answeredCount }) }} ·
                  {{ $t('stats.response_rate', { rate: questionStat.responseRate }) }}
                </p>
              </div>
            </div>

            <!-- 選項統計 (單選/多選) -->
            <div v-if="questionStat.optionStats && questionStat.optionStats.length > 0" class="space-y-6">
              <!-- 圓餅圖展示 -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- 圓餅圖 - 使用封裝組件 -->
                <ChartPie :data="questionStat.optionStats" title="選項分布圖" />

                <!-- 詳細數據 -->
                <div class="space-y-3">
                  <h4 class="text-lg font-semibold text-gray-800 mb-4">詳細統計</h4>
                  <div
                    v-for="option in questionStat.optionStats"
                    :key="option.option"
                    class="bg-white rounded-lg p-4 shadow-sm border"
                  >
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm font-medium text-gray-800">{{ option.option }}</span>
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-600">{{ option.count }} 人</span>
                        <span class="text-sm font-semibold text-blue-600">{{ option.percentage }}%</span>
                      </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                        :style="{ width: option.percentage + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 數字統計 -->
            <div v-if="questionStat.numberStats" class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center p-3 bg-gray-50 rounded">
                <p class="text-sm text-gray-500">{{ $t('stats.number_stats.min') }}</p>
                <p class="text-lg font-semibold">{{ questionStat.numberStats.min }}</p>
              </div>
              <div class="text-center p-3 bg-gray-50 rounded">
                <p class="text-sm text-gray-500">{{ $t('stats.number_stats.max') }}</p>
                <p class="text-lg font-semibold">{{ questionStat.numberStats.max }}</p>
              </div>
              <div class="text-center p-3 bg-gray-50 rounded">
                <p class="text-sm text-gray-500">{{ $t('stats.number_stats.average') }}</p>
                <p class="text-lg font-semibold">{{ questionStat.numberStats.average }}</p>
              </div>
              <div class="text-center p-3 bg-gray-50 rounded">
                <p class="text-sm text-gray-500">{{ $t('stats.number_stats.total') }}</p>
                <p class="text-lg font-semibold">{{ questionStat.numberStats.total }}</p>
              </div>
            </div>

            <!-- 日期統計 -->
            <div v-if="questionStat.dateStats" class="grid grid-cols-2 gap-4">
              <div class="text-center p-3 bg-gray-50 rounded">
                <p class="text-sm text-gray-500">{{ $t('stats.date_stats.earliest') }}</p>
                <p class="text-lg font-semibold">{{ questionStat.dateStats.earliest }}</p>
              </div>
              <div class="text-center p-3 bg-gray-50 rounded">
                <p class="text-sm text-gray-500">{{ $t('stats.date_stats.latest') }}</p>
                <p class="text-lg font-semibold">{{ questionStat.dateStats.latest }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 瀏覽器統計 -->
        <div v-if="statsData.browserStats && statsData.browserStats.length > 0" class="mt-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4">{{ $t('stats.browser_stats_title') }}</h2>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="space-y-4">
              <div
                v-for="browserStat in statsData.browserStats"
                :key="browserStat.browser"
                class="bg-gray-50 rounded-lg p-4"
              >
                <div class="flex justify-between items-center mb-3">
                  <span class="text-sm font-medium text-gray-800">{{ browserStat.browser }}</span>
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-600">{{ browserStat.count }} {{ $t('common.people', '人') }}</span>
                    <span class="text-sm font-semibold" :class="getBrowserColor(browserStat.browser)?.text"
                      >{{ browserStat.percentage }}%</span
                    >
                  </div>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div
                    class="h-3 rounded-full transition-all duration-300"
                    :class="getBrowserColor(browserStat.browser)?.gradient"
                    :style="{ width: browserStat.percentage + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 回應詳情 -->
        <div class="mt-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4">{{ $t('stats.recent_responses_title') }}</h2>
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ $t('stats.response_time_header') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ $t('stats.response_count_header') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ $t('stats.browser_header') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="response in statsData.responseDetails.slice(0, 10)" :key="response.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatDateTime(response.submittedAt) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ response.answers.length }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ detectBrowser(response.userAgent) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="statsData.responseDetails.length === 0" class="text-center py-8 text-gray-500">
              {{ $t('stats.no_responses') }}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { QUESTION_TYPE_LABELS, detectBrowser, getBrowserColor } from '~~/utils/map'
import { ElMessage } from 'element-plus'

definePageMeta({
  layout: false,
})

const { t } = useI18n()
const { formatDate, formatDateTime } = useDateFormatter()

const route = useRoute()
const surveyId = route.params.id as string

const { data: statsResponse, pending, error, refresh } = await useFetch(`/api/surveys/${surveyId}/stats`)

// 匯出功能
const exportLoading = ref(false)

const handleExport = async (format: 'csv' | 'excel') => {
  if (!statsData.value) {
    ElMessage.error('無法獲取問卷數據')
    return
  }

  try {
    exportLoading.value = true
    console.log(`📤 開始匯出 ${format.toUpperCase()} 格式`)

    const url = `/api/surveys/${surveyId}/export?format=${format}`
    console.log(`📡 請求 URL: ${url}`)

    const response = await fetch(url)
    console.log(`📡 響應狀態: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API 錯誤響應:', errorText)
      throw new Error(`匯出失敗 (${response.status}): ${errorText}`)
    }

    // 獲取檔案名稱
    const contentDisposition = response.headers.get('Content-Disposition')
    console.log('Content-Disposition:', contentDisposition)

    // 清理檔案名稱
    const cleanTitle = statsData.value.surveyInfo.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_')
    let filename = `${cleanTitle}_responses.${format}`

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/)
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1]
      }
    }

    console.log(`📁 檔案名稱: ${filename}`)

    // 下載檔案
    const blob = await response.blob()
    console.log(`📦 檔案大小: ${blob.size} bytes`)

    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)

    ElMessage.success(t('stats.export_success', { format: format.toUpperCase() }))
    console.log(`✅ 匯出成功: ${filename}`)
  } catch (error: any) {
    console.error('❌ 匯出失敗:', error)
    ElMessage.error(`${t('stats.export_failed')}: ${error.message || error}`)
  } finally {
    exportLoading.value = false
  }
}

const statsData = computed(() => {
  return statsResponse.value?.success ? statsResponse.value.data : null
})

const getQuestionTypeLabel = (type: keyof typeof QUESTION_TYPE_LABELS) => {
  return t(`question.${type}`) || '未知類型'
}

const pageTitle = computed(() => {
  if (statsData.value) {
    return `${statsData.value.surveyInfo.title} - 統計分析`
  }
  return '問卷統計'
})

// 麵包屑導航
const breadcrumbs = computed(() => [
  {
    label: t('common.home'),
    to: '/',
    icon: 'fa-solid fa-home',
  },
  {
    label: statsData.value?.surveyInfo.title || t('survey.survey_stats'),
    icon: 'fa-solid fa-chart-bar',
  },
])

// SEO 設定
useSeoMeta({
  title: pageTitle,
  description: computed(() => statsData.value?.surveyInfo.description || '問卷統計分析'),
})
</script>

<style scoped>
.line-clamp-2 {
  @apply overflow-hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
