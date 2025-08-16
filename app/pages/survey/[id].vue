<template>
  <div class="min-h-screen bg-gray-50  max-w-4xl mx-auto p-6">
    <Breadcrumb :items="breadcrumbs" />
    <!-- Loading 狀態 -->
    <div v-if="pending" class="flex justify-center items-center min-h-screen">
      <div class="text-center">
        <el-loading class="w-16 h-16 mx-auto mb-4" />
        <p class="text-gray-600">{{ $t('messages.load_survey_failed') }}</p>
      </div>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="flex justify-center items-center min-h-screen">
      <div class="text-center max-w-md">
        <div class="text-6xl mb-4">😵</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ $t('messages.load_failed') }}</h2>
        <p class="text-gray-600 mb-6">{{ $t('messages.loading_error') }}</p>
        <el-button @click="refresh()">{{ $t('messages.reload') }}</el-button>
        <el-button type="primary" @click="navigateTo('/')">{{ $t('messages.return_home') }}</el-button>
      </div>
    </div>

    <!-- 問卷不存在 -->
    <div v-else-if="!surveyData" class="flex justify-center items-center min-h-screen">
      <div class="text-center max-w-md">
        <div class="text-6xl mb-4">🔍</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ $t('messages.survey_not_found') }}</h2>
        <p class="text-gray-600 mb-6">{{ $t('messages.survey_not_found_message') }}</p>
        <el-button type="primary" @click="navigateTo('/')">{{ $t('messages.return_home') }}</el-button>
      </div>
    </div>

    <!-- 問卷未發布 -->
    <div v-else-if="surveyData.status !== 'published'" class="flex justify-center items-center min-h-screen">
      <div class="text-center max-w-md">
        <div class="text-6xl mb-4">🚧</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ $t('messages.survey_not_published') }}</h2>
        <p class="text-gray-600 mb-6">{{ $t('messages.survey_not_published_message') }}</p>
        <el-button type="primary" @click="navigateTo('/')">{{ $t('messages.return_home') }}</el-button>
      </div>
    </div>
    <SurveyForm v-else :survey="surveyData" @submit="handleSubmit" />
    <!-- 提交成功彈窗 -->
    <el-dialog
      v-model="showSuccessDialog"
      :title="$t('messages.submit_success_title')"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
    >
      <div class="text-center py-4">
        <div class="text-6xl mb-4">🎉</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-3">{{ $t('messages.submit_success_title') }}!</h3>
        <p class="text-gray-600 mb-4">{{ $t('messages.submit_success_message') }}</p>
        <div class="text-sm text-gray-500">{{ $t('messages.submit_time', { time: submitTime }) }}</div>
      </div>
      <template #footer>
        <div class="text-center">
          <el-button type="primary" @click="handleReturnHome">{{ $t('messages.thank_reply') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import type { SubmitSurveyPayload } from '~~/types/index'
import { format } from 'date-fns'

const { t } = useI18n()

const route = useRoute()
const surveyId = route.params.id as string
const { data: surveyResponse, pending, error, refresh } = await useFetch(`/api/surveys/${surveyId}`)
const breadcrumbs = computed(() => [
  {
    label: t('common.home'),
    to: '/',
    icon: 'fa-solid fa-home',
  },
  {
    label: surveyData.value?.title || t('survey.survey_form'),
    icon: 'fa-solid fa-clipboard-list',
  },
])
const surveyData = computed(() => {
  return surveyResponse.value?.success ? surveyResponse.value.data : null
})

const showSuccessDialog = ref(false)
const submitTime = ref('')

const handleSubmit = async (payload: SubmitSurveyPayload) => {
  try {
    await ElMessageBox.confirm(t('messages.submit_confirm'), t('messages.submit_confirm_title'), {
      confirmButtonText: t('messages.submit_confirm_button'),
      cancelButtonText: t('messages.submit_recheck_button'),
      type: 'warning',
      confirmButtonClass: 'el-button--primary',
    })

    await $fetch(`/api/surveys/${surveyId}/responses`, {
      method: 'POST',
      body: {
        answers: payload.answers,
      },
    })
    submitTime.value = format(new Date(), 'yyyy/MM/dd HH:mm')
    showSuccessDialog.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error: any) {
    if (error === 'cancel') return
    console.error('提交問卷失敗:', error)
    const errorMessage = error?.data?.statusMessage || error?.message || '提交失敗，請稍後再試'
    ElMessage.error(errorMessage)
  }
}

const handleReturnHome = () => {
  showSuccessDialog.value = false
  window.location.href = 'https://www.google.com'
}

const pageTitle = computed(() => {
  if (surveyData.value) {
    return `${surveyData.value.title} - 問卷調查`
  }
  return '問卷調查'
})

// SEO 設定
useSeoMeta({
  title: pageTitle,
  description: computed(() => surveyData.value?.description || '請填寫問卷調查'),
  ogTitle: pageTitle,
  ogDescription: computed(() => surveyData.value?.description || '請填寫問卷調查'),
})
</script>

<style scoped>
/* 自定義樣式 */
:deep(.el-dialog__body) {
  padding: 20px 30px;
}

:deep(.el-dialog__footer) {
  padding: 10px 30px 30px;
}
</style>
