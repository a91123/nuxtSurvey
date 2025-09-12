<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div v-if="pending" class="flex justify-center items-center min-h-[400px]">
      <div class="text-center">
        <i class="fa-solid fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
        <p class="text-gray-600">{{ $t('messages.load_survey_failed') }}</p>
      </div>
    </div>
    <div v-else>
      <!-- 麵包屑導航 -->
      <Breadcrumb :items="breadcrumbs" />

      <FormEditor
        v-model:title="formData.title"
        v-model:description="formData.description"
        v-model:status="formData.status"
        v-model:questions="formData.questions"
        :is-editing="true"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { Question } from '~~/types/index'
const route = useRoute()
const surveyId = route.params.id as string
const { data: surveyData, pending } = await useFetch(`/api/surveys/${surveyId}`)

// 麵包屑導航
const { t } = useI18n()
const breadcrumbs = computed(() => [
  {
    label: t('common.home'),
    to: '/',
    icon: 'fa-solid fa-home',
  },
  {
    label: formData.title || t('survey.edit_survey'),
    icon: 'fa-solid fa-edit',
  },
])

const formData = reactive({
  title: '',
  description: '',
  status: 'draft' as 'draft' | 'published',
  questions: [] as Question[],
})

watchEffect(() => {
  const data = surveyData.value
  if (!data) return
  if (data.success && data.data) {
    const survey = data.data as any
    const processedQuestions = (survey.questions || []).map((q: any, index: number) => ({
      ...q,
      id: q.id || `question-${index + 1}`,
      tip: q.tip || '',
    })) as Question[]

    Object.assign(formData, {
      title: survey.title || '',
      description: survey.description || '',
      status: survey.status || 'draft',
      questions: processedQuestions,
    })
  } else {
    console.error('載入問卷失敗:', data)
    ElMessage.error(t('messages.loading_error'))
    navigateTo('/dashboard')
  }
})

const handleSubmit = async () => {
  try {
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      questions: formData.questions.map((q) => ({
        id: q.id,
        type: q.type,
        title: q.title?.trim() || '',
        required: q.required,
        options: q.type === 'single' || q.type === 'multiple' ? (q.options || []).filter(Boolean) : undefined,
        min: q.type === 'number' ? q.min : undefined,
        max: q.type === 'number' ? q.max : undefined,
        tip: q.tip && q.tip.trim() ? q.tip.trim() : undefined,
      })),
    }
    await $fetch(`/api/surveys/${surveyId}`, {
      method: 'PUT' as any,
      body: payload,
    })
    ElMessage.success(t('messages.update_success'))
    await navigateTo('/dashboard')
  } catch (error) {
    ElMessage.error(t('messages.update_failed'))
    console.error(error)
  }
}
</script>
