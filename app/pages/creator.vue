<template>
  <div class="p-6 max-w-4xl mx-auto">
    <Breadcrumb :items="breadcrumbs" />
    <FormEditor
      v-model:title="formData.title"
      v-model:description="formData.description"
      v-model:status="formData.status"
      v-model:questions="formData.questions"
      :isEditing="false"
      :isLoading="isSaving"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { Question } from '~~/types/index'

// SEO 設定
useSeoMeta({
  title: '建立問卷 - SurveyFlow',
  description:
    '使用 SurveyFlow 拖拽式編輯器輕鬆建立專業問卷。支援多種題型：單選、多選、文字輸入、日期時間等。完全免費使用。',
  keywords: 'SurveyFlow,建立問卷,問卷設計,線上表單,問卷編輯器,拖拽式問卷',
  ogTitle: '建立問卷 - SurveyFlow',
  ogDescription: '使用 SurveyFlow 拖拽式編輯器輕鬆建立專業問卷，支援多種題型設計。',
})

// 麵包屑
const { t } = useI18n()
const breadcrumbs = [
  {
    label: t('common.home'),
    to: '/',
    icon: 'fa-solid fa-home',
  },
  {
    label: t('survey.create_new'),
    icon: 'fa-solid fa-plus',
  },
]

const formData = reactive({
  title: '',
  description: '',
  status: 'published' as 'draft' | 'published',
  questions: [] as Question[],
})

const isSaving = ref(false)

const handleSubmit = async () => {
  if (isSaving.value) return

  try {
    isSaving.value = true

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      questions: formData.questions.map((q: Question) => ({
        id: q.id,
        type: q.type,
        title: q.title?.trim() || '',
        required: q.required,
        options: q.type === 'single' || q.type === 'multiple' ? (q.options || []).filter(Boolean) : undefined,
        min: q.type === 'number' ? q.min : undefined,
        max: q.type === 'number' ? q.max : undefined,
        tip: q.tip?.trim() || undefined,
      })),
    }

    console.log('🚀 Creating survey with payload:', payload)

    const response = await $fetch(`/api/surveys`, {
      method: 'POST',
      body: payload,
    })

    console.log('✅ Survey created:', response)
    ElMessage.success(t('messages.created_success'))
    await navigateTo('/dashboard')
  } catch (error) {
    console.error('❌ Error creating survey:', error)
    ElMessage.error(t('messages.create_failed'))
  } finally {
    isSaving.value = false
  }
}
</script>
