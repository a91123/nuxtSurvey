<template>
  <section class="p-6 max-w-7xl mx-auto h-full min-h-0 grid gap-4">
    <!-- 麵包屑導航 -->
    <Breadcrumb :items="[]" />

    <div class="h-[100px]">
      <div class="flex justify-between items-center mb-3">
        <h1 class="text-2xl font-bold">{{ $t('header.survey_management') }}</h1>
        <NuxtLink to="/creator">
          <el-button type="primary">{{ $t('survey.create_new') }}</el-button>
        </NuxtLink>
      </div>

      <div class="flex flex-wrap gap-3 items-center">
        <div class="flex-1 min-w-[200px]">
          <el-input v-model="title" :placeholder="$t('ui.search_placeholder')" clearable />
        </div>
        <div class="w-40">
          <el-select v-model="status" :placeholder="$t('ui.status_placeholder')" clearable class="w-full">
            <el-option :label="$t('ui.all_status')" value="all" />
            <el-option :label="$t('survey.published')" value="published" />
            <el-option :label="$t('survey.draft')" value="draft" />
          </el-select>
        </div>
        <div class="w-44">
          <el-select v-model="sort" :placeholder="$t('ui.sort_placeholder')" class="w-full">
            <el-option :label="$t('ui.recent_update')" value="recent" />
            <el-option :label="$t('ui.most_responses')" value="responses" />
            <el-option :label="$t('ui.most_questions')" value="questions" />
          </el-select>
        </div>
      </div>
    </div>

    <div class="overflow-auto flex-1 h-[calc(100vh-366px)]">
      <div v-if="pending" class="pr-1">
        <el-skeleton :rows="6" animated />
      </div>
      <div v-else-if="error" class="pr-1">
        <el-alert
          type="error"
          :closable="false"
          show-icon
          :title="$t('messages.load_failed')"
          :description="$t('messages.loading_error')"
          class="mb-4"
        />
      </div>
      <div v-else-if="items.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pr-1">
        <div v-for="s in items" :key="s.id" class="w-full">
          <el-card shadow="hover" class="relative h-full">
            <div class="text-lg font-semibold mb-1">{{ s.title }}</div>
            <div class="text-slate-600 mb-2 min-h-[1.5rem]">
              {{ s.description && s.description.length > 30 ? s.description.substring(0, 20) + '...' : s.description }}
            </div>
            <div class="text-sm text-slate-500 mb-1">
              {{ $t('survey.status') }}：<span :class="s.status === 'published' ? 'text-green-600' : 'text-yellow-600'">
                {{ $t(`survey.${s.status}`) }}
              </span>
            </div>
            <div class="text-sm text-slate-500">
              {{ $t('survey.questions') }}：{{ s.questions }} · {{ $t('survey.responses') }}：{{ s.responses }}
            </div>
            <div class="text-xs text-slate-400 mt-1">
              {{ $t('survey.updated_at') }}：{{ formatDateTime(s.updatedAt) }}
            </div>
            <template #footer>
              <div class="flex gap-2 justify-end">
                <NuxtLink :to="`/editor/${s.id}`">
                  <el-button size="small" plain>{{ $t('common.edit') }}</el-button>
                </NuxtLink>
                <NuxtLink v-if="s.status === 'published'" :to="`/stats/${s.id}`">
                  <el-button size="small" plain>{{ $t('header.statistics') }}</el-button>
                </NuxtLink>
                <el-button v-if="s.status === 'published'" size="small" plain @click="handleCopyLink(s.id.toString())">
                  {{ $t('survey.copy_link') }}
                </el-button>
                <button
                  class="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  @click="handleDelete(s.id.toString(), s.title)"
                  :title="$t('survey.delete_confirm')"
                >
                  <i class="fa-regular fa-trash-can text-sm"></i>
                </button>
              </div>
            </template>
          </el-card>
        </div>
      </div>
      <div v-else class="w-full flex justify-center items-center h-full">
        <el-empty :description="$t('ui.no_surveys')" />
      </div>
    </div>

    <div class="flex justify-end h-[70px]">
      <el-pagination
        layout="prev, pager, next, jumper, ->, total, sizes"
        :page-size="pageSize"
        :current-page="page"
        :total="total"
        :page-sizes="[6, 9, 12]"
        @size-change="(ps:number)=>{ pageSize = ps; page = 1 }"
        @current-change="(p:number)=>{ page = p }"
      />
    </div>
  </section>
</template>
<script setup lang="ts">
import { useDebounceFn, useClipboard } from '@vueuse/core'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { SurveyListAPIItem, APIResponse } from '~~/types/index'

const { t } = useI18n()
const { formatDateTime } = useDateFormatter()

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
      method: 'DELETE',
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
