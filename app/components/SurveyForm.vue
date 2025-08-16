<template>
  <el-card shadow="never">
    <!-- 問卷頭部信息 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-3">{{ survey.title }}</h1>
      <p v-if="survey.description" class="text-gray-600 leading-relaxed">{{ survey.description }}</p>
      <div class="mt-4 text-sm text-gray-500">
        <span>共 {{ survey.questions.length }} 題</span>
        <span class="mx-2">•</span>
        <span>必填項目 {{ requiredCount }} 題</span>
      </div>
    </div>

    <!-- 進度條 -->
    <div class="mb-8">
      <div class="flex justify-between text-sm text-gray-600 mb-2">
        <span>填寫進度</span>
        <span>{{ Math.round((answeredCount / survey.questions.length) * 100) }}%</span>
      </div>
      <el-progress
        :percentage="Math.round((answeredCount / survey.questions.length) * 100)"
        :stroke-width="8"
        :show-text="false"
      />
    </div>

    <!-- 問卷表單 -->
    <el-form ref="formRef" :model="formData" :rules="rules" label-position="top" class="space-y-8">
      <div
        v-for="(question, index) in survey.questions"
        :key="question.id || index"
        class="bg-white shadow-sm p-6 rounded-xl border border-gray-200"
      >
        <div class="mb-4">
          <div class="flex items-start gap-3">
            <span
              class="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm flex-shrink-0"
              >{{ index + 1 }}</span
            >
            <div class="flex-1 flex justify-between">
              <div class="flex items-center gap-2">
                <el-tooltip v-if="question.tip?.trim()" :content="question.tip" placement="top">
                  <i class="fa-solid fa-circle-question hover:text-gray-400 transition-colors duration-200 mb-2"></i>
                </el-tooltip>
                <h3 class="text-lg font-semibold text-gray-800 mb-1">
                  <span v-if="question.required" class="text-red-500 ml-1">*</span>
                  {{ question.title }}
                </h3>
              </div>
              <el-tag>{{ getQuestionTypeLabel(question.type) }}</el-tag>
            </div>
          </div>
        </div>

        <!-- 文字輸入 -->
        <el-form-item v-if="question.type === 'text' && question.id" :prop="`answers.${question.id}`" class="mt-4">
          <el-input
            v-model="formData.answers[question.id]"
            placeholder="請輸入您的答案"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            clearable
          />
        </el-form-item>

        <!-- 數字輸入 -->
        <el-form-item
          v-else-if="question.type === 'number' && question.id"
          :prop="`answers.${question.id}`"
          class="mt-4"
        >
          <el-input-number
            v-model="formData.answers[question.id]"
            :precision="0"
            :placeholder="$t('ui.number_placeholder')"
            :min="question.min ? question.min : undefined"
            :max="question.max ? question.max : undefined"
            class="min-w-[180px]"
          />
        </el-form-item>

        <!-- 日期選擇 -->
        <el-form-item v-else-if="question.type === 'date' && question.id" :prop="`answers.${question.id}`" class="mt-4">
          <el-date-picker
            v-model="formData.answers[question.id]"
            type="date"
            placeholder="請選擇日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="w-full"
          />
        </el-form-item>

        <!-- 時間選擇 -->
        <el-form-item v-else-if="question.type === 'time' && question.id" :prop="`answers.${question.id}`" class="mt-4">
          <el-time-picker
            v-model="formData.answers[question.id]"
            placeholder="請選擇時間"
            format="HH:mm"
            value-format="HH:mm"
            class="w-full"
          />
        </el-form-item>

        <!-- 單選題 -->
        <el-form-item
          v-else-if="question.type === 'single' && question.id && question.options"
          :prop="`answers.${question.id}`"
          class="mt-4"
        >
          <div class="flex flex-col gap-3">
            <el-radio
              v-for="(option, optIndex) in question.options"
              :key="optIndex"
              v-model="formData.answers[question.id]"
              :label="option"
              class="p-3 border border-gray-200 rounded-lg transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 w-full mb-2"
            >
              {{ option }}
            </el-radio>
          </div>
        </el-form-item>

        <!-- 多選題 -->
        <el-form-item
          v-else-if="question.type === 'multiple' && question.id && question.options"
          :prop="`answers.${question.id}`"
          class="mt-4"
        >
          <el-checkbox-group v-model="formData.answers[question.id]" class="flex flex-col gap-3">
            <el-checkbox
              v-for="(option, optIndex) in question.options"
              :key="optIndex"
              :label="option"
              class="p-3 border border-gray-200 rounded-lg transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 w-full mb-2"
            >
              {{ option }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>
    </el-form>

    <!-- 提交按鈕 -->
    <div class="mt-12 flex justify-center">
      <el-button type="primary" :loading="submitting" @click="handleSubmit" class="px-12 py-3 text-lg font-semibold">
        {{ submitting ? '提交中...' : '提交問卷' }}
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { Survey, SubmitSurveyPayload, AnswerItem } from '~~/types/index'

interface Props {
  survey: Survey
}

const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [payload: SubmitSurveyPayload]
}>()

const { t } = useI18n()

const formData = reactive({
  answers: {} as Record<string, any>,
})

const formRef = ref<FormInstance>()
const submitting = ref(false)

// 初始化答案結構
const initializeAnswers = () => {
  const answers: Record<string, any> = {}
  props.survey.questions.forEach((question) => {
    if (question.id) {
      answers[question.id] = question.type === 'multiple' ? [] : null
    }
  })
  return answers
}

onMounted(() => initializeAnswers())

const requiredCount = computed(() => props.survey.questions.filter((q) => q.required).length)

const answeredCount = computed(() => {
  let count = 0
  props.survey.questions.forEach((question) => {
    if (question.id) {
      const answer = formData.answers[question.id]
      if (answer !== null && answer !== undefined && answer !== '' && !(Array.isArray(answer) && answer.length === 0)) {
        count++
      }
    }
  })
  return count
})

const rules = computed<FormRules>(() => {
  const formRules: FormRules = {}
  props.survey.questions.forEach((question) => {
    if (question.id) {
      const validators: any[] = []

      // 必填驗證
      if (question.required) {
        validators.push({
          validator: (rule: any, value: any, callback: any) => {
            if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
              callback(new Error(t('messages.answer_required', { title: question.title })))
            } else {
              callback()
            }
          },
          trigger: ['change', 'blur'],
        })
      }

      // 數字範圍驗證
      if (question.type === 'number' && (question.min !== undefined || question.max !== undefined)) {
        validators.push({
          validator: (rule: any, value: any, callback: any) => {
            if (value !== null && value !== undefined && value !== '') {
              const numValue = Number(value)
              if (question.min !== undefined && numValue < question.min) {
                callback(new Error(t('form.validation.number_min_error', { min: question.min })))
              } else if (question.max !== undefined && numValue > question.max) {
                callback(new Error(t('form.validation.number_max_error', { max: question.max })))
              } else {
                callback()
              }
            } else {
              callback()
            }
          },
          trigger: ['change', 'blur'],
        })
      }

      if (validators.length > 0) {
        formRules[`answers.${question.id}`] = validators
      }
    }
  })

  return formRules
})

const getQuestionTypeLabel = (type: string) => {
  return t(`question.${type}`) || '未知類型'
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    submitting.value = true
    const valid = await formRef.value.validate()
    if (!valid) {
      ElMessage.error(t('messages.complete_required_fields'))
      return
    }
    const answers: AnswerItem[] = []
    props.survey.questions.forEach((q) => {
      if (q.id && formData.answers[q.id] !== null && formData.answers[q.id] !== undefined) {
        answers.push({
          id: q.id,
          value: formData.answers[q.id],
        })
      }
    })

    const payload: SubmitSurveyPayload = {
      answers,
    }

    emit('submit', payload)
  } catch (error) {
    console.error('表單驗證失敗:', error)
    ElMessage.error(t('messages.form_validation_error'))
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
:deep(.el-radio),
:deep(.el-checkbox) {
  width: 100% !important;
  max-width: none !important;
}

:deep(.el-radio__label),
:deep(.el-checkbox__label) {
  width: 100% !important;
  white-space: normal !important;
  word-break: break-words !important;
  padding-left: 0.5rem !important;
}

:deep(.el-radio__input),
:deep(.el-checkbox__input) {
  margin-right: 0.5rem !important;
}

:deep(.el-form-item__error) {
  color: #ef4444 !important;
}
</style>
