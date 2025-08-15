<template>
  <FormEditor
    v-model:title="formData.title"
    v-model:desc="formData.desc"
    v-model:status="formData.status"
    v-model:questions="formData.questions"
    :is-editing="false"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { Question } from '~~/stores/surveys'

// 創建問卷頁面 - 使用 FormEditor 組件

// 頁面層級的數據管理
const formData = reactive({
  title: '',
  desc: '',
  status: '草稿' as '草稿' | '已發布',
  questions: [] as Question[],
})

const handleSubmit = async () => {
  try {
    const payload = {
      title: formData.title.trim(),
      desc: formData.desc.trim(),
      status: formData.status,
      questions: formData.questions.map((q: Question) => ({
        type: q.type,
        label: q.label.trim(),
        required: q.required,
        options: q.type === 'single' ? (q.options || []).filter(Boolean) : undefined,
      })),
    }

    await $fetch('/api/surveys', {
      method: 'POST',
      body: payload,
    })

    ElMessage.success('已儲存')
    await navigateTo('/')
  } catch (error) {
    ElMessage.error('儲存失敗')
    console.error(error)
  }
}
</script>
