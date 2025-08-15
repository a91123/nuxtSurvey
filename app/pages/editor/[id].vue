<template>
  <div v-if="pending" class="flex justify-center items-center min-h-[400px]">
    <el-loading class="w-full h-full" />
  </div>
  <div v-else-if="error" class="flex justify-center items-center min-h-[400px]">
    <el-alert
      type="error"
      :closable="false"
      show-icon
      title="載入失敗"
      :description="error?.message || '獲取問卷數據失敗'"
      class="mb-4"
    />
  </div>
  <FormEditor
    v-else
    v-model:title="formData.title"
    v-model:desc="formData.desc"
    v-model:status="formData.status"
    v-model:questions="formData.questions"
    :is-editing="true"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { Question, Survey } from '~~/stores/surveys'
const route = useRoute()
const surveyId = route.params.id as string
const { data: surveyData, pending, error } = await useFetch<Survey>(`/api/surveys/${surveyId}`)

// 獨立的表單數據管理
const formData = reactive({
  title: '',
  desc: '',
  status: '草稿' as '草稿' | '已發布',
  questions: [] as Question[],
})

// 使用 watchEffect 自動追蹤依賴
watchEffect(() => {
  if (surveyData.value) {
    formData.title = surveyData.value.title || ''
    formData.desc = surveyData.value.desc || ''
    formData.status = surveyData.value.status || '草稿'
    formData.questions = (surveyData.value.questions || []).map((q: any, index: number) => ({
      ...q,
      id: q.id || `question-${index + 1}`, // 保持現有 id 或生成新的
    })) as Question[]
  }
})

// 處理錯誤 - 如果數據獲取失敗，導航回列表頁
watch(error, (newError) => {
  if (newError) {
    ElMessage.error('獲取問卷數據失敗')
    console.error(newError)
    navigateTo('/')
  }
})

// 處理表單提交
async function handleSubmit() {
  try {
    const payload = {
      title: formData.title.trim(),
      desc: formData.desc.trim(),
      status: formData.status,
      questions: formData.questions.map((q) => ({
        type: q.type,
        label: q.label.trim(),
        required: q.required,
        options: q.type === 'single' ? (q.options || []).filter(Boolean) : undefined,
      })),
    }

    await $fetch(`/api/surveys/${surveyId}`, {
      method: 'PUT' as any,
      body: payload,
    })
    ElMessage.success('已更新')
    await navigateTo('/')
  } catch (error) {
    ElMessage.error('更新失敗')
    console.error(error)
  }
}
</script>
