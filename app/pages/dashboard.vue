<template>
  <div class="bg-gray-50 h-[calc(100vh-112px)] flex flex-col">
    <!-- 中間白色内容區域 - 可滾動 -->
    <div class="flex-1 bg-white mx-3 my-3 rounded-lg shadow-sm overflow-hidden flex flex-col min-h-0">
      <div class="flex-1 overflow-y-auto min-h-0">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <!-- 頂部區域 - 標題和操作按鈕 -->
          <div class="border-b border-gray-200 pb-6 mb-6">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
              <h1 class="text-xl sm:text-2xl font-bold text-gray-900">{{ $t('header.survey_management') }}</h1>
              <NuxtLink to="/creator">
                <el-button type="primary" class="w-full sm:w-auto">{{ $t('survey.create_new') }}</el-button>
              </NuxtLink>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div class="flex-1 min-w-0">
                <el-input v-model="title" :placeholder="$t('ui.search_placeholder')" clearable class="w-full" />
              </div>
              <div class="flex gap-3">
                <div class="flex-1 sm:w-40">
                  <el-select v-model="status" :placeholder="$t('ui.status_placeholder')" clearable class="w-full">
                    <el-option :label="$t('ui.all_status')" value="all" />
                    <el-option :label="$t('survey.published')" value="published" />
                    <el-option :label="$t('survey.draft')" value="draft" />
                  </el-select>
                </div>
                <div class="flex-1 sm:w-44">
                  <el-select v-model="sort" :placeholder="$t('ui.sort_placeholder')" class="w-full">
                    <el-option :label="$t('ui.recent_update')" value="recent" />
                    <el-option :label="$t('ui.most_responses')" value="responses" />
                    <el-option :label="$t('ui.most_questions')" value="questions" />
                  </el-select>
                </div>
              </div>
            </div>
          </div>

          <!-- 麵包屑導航 -->
          <div class="mb-6">
            <Breadcrumb :items="[{ label: $t('header.dashboard'), to: '/dashboard' }]" />
          </div>

          <!-- 內容區域 -->
          <div class="min-h-[400px]">
            <div v-if="pending">
              <el-skeleton :rows="6" animated />
            </div>
            <div v-else-if="error">
              <el-alert
                type="error"
                :closable="false"
                show-icon
                :title="$t('messages.load_failed')"
                :description="$t('messages.loading_error')"
                class="mb-4"
              />
            </div>
            <div
              v-else-if="items.length > 0"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            >
              <!-- 問卷卡片 -->
              <el-card v-for="s in items" :key="s.id" shadow="hover" class="relative">
                <div class="text-base sm:text-lg font-semibold mb-2 pr-8">{{ s.title }}</div>
                <div class="text-gray-600 mb-3 min-h-[1.5rem] text-sm">
                  {{
                    s.description && s.description.length > 50 ? s.description.substring(0, 47) + '...' : s.description
                  }}
                </div>
                <div class="text-xs sm:text-sm text-gray-500 mb-2">
                  {{ $t('survey.status') }}：<span
                    :class="s.status === 'published' ? 'text-green-600' : 'text-yellow-600'"
                  >
                    {{ $t(`survey.${s.status}`) }}
                  </span>
                </div>
                <div class="text-xs sm:text-sm text-gray-500 mb-2">
                  {{ $t('survey.questions') }}：{{ s.questions }} · {{ $t('survey.responses') }}：{{ s.responses }}
                </div>
                <div class="text-xs text-gray-400 mb-2">
                  {{ $t('survey.updated_at') }}：{{ formatDateTime(s.updatedAt) }}
                </div>
                <template #footer>
                  <div class="flex flex-col sm:flex-row gap-2 justify-end">
                    <div class="flex gap-2 justify-between sm:justify-end">
                      <NuxtLink :to="`/editor/${s.id}`" class="flex-1 sm:flex-none">
                        <el-button size="small" plain class="w-full sm:w-auto">{{ $t('common.edit') }}</el-button>
                      </NuxtLink>
                      <NuxtLink v-if="s.status === 'published'" :to="`/stats/${s.id}`" class="flex-1 sm:flex-none">
                        <el-button size="small" plain class="w-full sm:w-auto">{{ $t('header.statistics') }}</el-button>
                      </NuxtLink>
                    </div>
                    <el-button
                      v-if="s.status === 'published'"
                      size="small"
                      plain
                      @click="handleCopyLink(s.id.toString())"
                      class="w-full sm:w-auto"
                    >
                      {{ $t('survey.copy_link') }}
                    </el-button>
                    <button
                      class="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                      @click="handleDelete(s.id.toString(), s.title)"
                      :title="$t('survey.delete_confirm')"
                    >
                      <i class="fa-regular fa-trash-can text-xs"></i>
                    </button>
                  </div>
                </template>
              </el-card>
            </div>
            <div v-else class="flex justify-center items-center h-64">
              <el-empty :description="$t('ui.no_surveys')" />
            </div>
          </div>
        </div>
      </div>

      <!-- 底部分頁器 - 固定在白色區域底部 -->
      <div class="flex-shrink-0 border-t border-gray-200 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div class="flex justify-center sm:justify-end">
            <el-pagination
              :layout="isMobileView ? 'prev, pager, next' : 'prev, pager, next, jumper, ->, total, sizes'"
              :page-size="pageSize"
              :current-page="page"
              :total="total"
              :page-sizes="[6, 9, 12]"
              :small="isMobileView"
              @size-change="(ps:number)=>{ pageSize = ps; page = 1 }"
              @current-change="(p:number)=>{ page = p }"
              class="flex-wrap"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useDebounceFn, useClipboard } from '@vueuse/core'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { SurveyListAPIItem, APIResponse } from '~~/types/index'

// SEO 設定
useSeoMeta({
  title: '問卷管理後台 - SurveyFlow',
  description:
    '專業問卷管理後台，輕鬆管理你的問卷調查、查看統計數據和回應分析。SurveyFlow 提供完整的問卷管理解決方案。',
  keywords: 'SurveyFlow,問卷管理,數據統計,問卷調查,dashboard,問卷後台,調查管理',
  ogTitle: '問卷管理後台 - SurveyFlow',
  ogDescription: '專業問卷管理後台，輕鬆管理你的問卷調查、查看統計數據和回應分析。',
  ogImage: 'https://nuxt-survey.vercel.app/og-image.svg',
  ogUrl: 'https://nuxt-survey.vercel.app/dashboard',
  // 允許搜索引擎索引，這是一個公開的管理功能介紹頁面
  robots: 'index, follow',
})

const { t } = useI18n()
const { formatDateTime } = useDateFormatter()

// 判斷是否為手機視圖
const isMobileView = computed(() => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 640
})

const title = ref('')
const status = ref('all')
const sort = ref<'recent' | 'responses' | 'questions' | 'title-asc' | 'title-desc'>('recent')
const page = ref(1)
const pageSize = ref(6)
const titleDebounced = ref('')

const applyDebounce = useDebounceFn((v: string) => {
  titleDebounced.value = v
  page.value = 1
}, 300)

watch(title, (v) => applyDebounce(v))

// 建立反應式查詢參數
const queryParams = computed(() => ({
  search: titleDebounced.value,
  status: status.value,
  sort: sort.value,
  page: page.value.toString(),
  pageSize: pageSize.value.toString(),
}))

const {
  data: surveysData,
  pending,
  error,
  refresh,
} = await useFetch<APIResponse<SurveyListAPIItem[]>>('/api/surveys', {
  query: queryParams,
})

const items = computed(() => {
  return surveysData.value?.success ? surveysData.value.data || [] : []
})

const total = computed(() => {
  return surveysData.value?.pagination?.total || 0
})

const { copy, isSupported } = useClipboard()
const handleCopyLink = async (surveyId: string) => {
  const surveyUrl = `${window.location.origin}/survey/${surveyId}`
  if (isSupported.value) {
    await copy(surveyUrl)
    ElMessage.success(t('messages.copy_success'))
  } else {
    ElMessageBox.alert(`請手動複製此連結：\n${surveyUrl}`, t('survey.copy_link'), {
      confirmButtonText: t('common.confirm'),
      type: 'info',
    })
  }
}

const handleDelete = async (surveyId: string, surveyTitle: string) => {
  try {
    await ElMessageBox.confirm(
      t('messages.delete_confirm_message', { title: surveyTitle }),
      t('messages.delete_confirm_title'),
      {
        confirmButtonText: t('messages.delete_confirm_button'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
      },
    )
    await $fetch(`/api/surveys/${surveyId}`, {
      method: 'DELETE' as any,
    })

    ElMessage.success(t('messages.delete_success'))
    await refresh()
  } catch (error: any) {
    if (error === 'cancel') {
      return
    }
    console.error('刪除問卷失敗:', error)
    ElMessage.error(error?.message || t('messages.delete_error'))
  }
}
</script>
