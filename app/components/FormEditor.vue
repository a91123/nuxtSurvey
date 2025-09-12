<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">{{ isEditing ? $t('editor.title') : $t('editor.create_title') }}</h1>
      <div class="flex gap-2">
        <el-button @click="navigateTo('/dashboard')">{{ $t('navigation.back_to_list') }}</el-button>
        <el-button type="primary" @click="submit">{{ $t('common.save') }}</el-button>
      </div>
    </div>

    <el-card shadow="never">
      <el-form
        ref="formRef"
        label-position="top"
        :model="{ title, description, status }"
        :rules="rules"
        label-width="84px"
      >
        <el-form-item :label="$t('editor.form_title_label')" prop="title">
          <el-input v-model="title" :placeholder="$t('editor.form_title_placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('editor.form_description_label')" prop="description">
          <el-input
            v-model="description"
            type="textarea"
            :autosize="{ minRows: 3 }"
            :placeholder="$t('editor.form_description_placeholder')"
          />
        </el-form-item>
        <el-form-item :label="$t('editor.form_status_label')">
          <el-radio-group v-model="status">
            <el-radio label="draft">{{ $t('survey.draft') }}</el-radio>
            <el-radio label="published">{{ $t('survey.publish') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm text-slate-600 mr-2">{{ $t('ui.add_question') }}</span>
        <el-button type="primary" plain @click="addQuestion('text')">{{ $t('editor.question_type_text') }}</el-button>
        <el-button type="primary" plain @click="addQuestion('number')">{{
          $t('editor.question_type_number')
        }}</el-button>
        <el-button type="primary" plain @click="addQuestion('date')">{{ $t('editor.question_type_date') }}</el-button>
        <el-button type="primary" plain @click="addQuestion('time')">{{ $t('editor.question_type_time') }}</el-button>
        <el-button type="primary" plain @click="addQuestion('single')">{{
          $t('editor.question_type_single')
        }}</el-button>
        <el-button type="primary" plain @click="addQuestion('multiple')">{{
          $t('editor.question_type_multiple')
        }}</el-button>
      </div>
    </el-card>

    <ClientOnly>
      <draggable
        v-model="questions"
        item-key="id"
        :force-fallback="true"
        handle=".drag-handle"
        :animation="300"
        :scroll-sensitivity="100"
        :scroll-speed="20"
        ghost-class="ghost-class"
        class="space-y-3"
      >
        <template #item="{ element: q, index: idx }">
          <el-card class="draggable-item" shadow="never">
            <template #header>
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <span class="drag-handle cursor-grab select-none">≡</span>
                  <span class="text-sm text-slate-500">{{ idx + 1 }}. {{ $t(`question.${q.type}`) }}</span>
                </div>
                <button
                  class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors duration-200"
                  @click="removeQuestion(q.id)"
                  :title="$t('ui.delete_question')"
                >
                  <i class="fa-regular fa-trash-can text-xs"></i>
                </button>
              </div>
            </template>

            <div class="grid gap-3 sm:grid-cols-2">
              <div>
                <span class="block text-sm mb-1"
                  >{{ $t('ui.question_title_label') }} <span class="text-red-500">*</span></span
                >
                <el-input
                  :model-value="q.title"
                  @update:model-value="(value) => updateQuestionTitle(q, value)"
                  :placeholder="$t('editor.question_title_placeholder')"
                  :class="{ 'border-red-300': !q.title?.trim() }"
                />
                <span v-if="!q.title?.trim()" class="text-xs text-red-500 mt-1">{{
                  $t('ui.question_title_required')
                }}</span>
              </div>
              <div class="flex items-end">
                <el-checkbox
                  :model-value="q.required"
                  @update:model-value="(value) => updateQuestionRequired(q, Boolean(value))"
                  >{{ $t('ui.required_field') }}</el-checkbox
                >
              </div>
            </div>

            <!-- 提示文字設定 -->
            <div class="mt-3">
              <span class="block text-sm mb-1">{{ $t('ui.tip_label') }}</span>
              <el-input
                :model-value="q.tip"
                @update:model-value="(value) => updateQuestionTip(q, value)"
                :placeholder="$t('ui.tip_placeholder')"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 3 }"
              />
            </div>

            <!-- 數字題型的 min/max 設定 -->
            <div v-if="q.type === 'number'" class="mt-3">
              <div class="flex items-center gap-2 text-sm">
                <span class="text-gray-600">數值範圍：</span>
                <div class="flex items-center gap-1">
                  <el-input-number
                    v-model="q.min"
                    placeholder="最小值"
                    :precision="0"
                    :max="q.max !== undefined ? q.max : undefined"
                    size="small"
                    style="width: 80px"
                    controls-position="right"
                    :value-on-clear="undefined"
                  />
                  <span class="text-gray-400 mx-1">～</span>
                  <el-input-number
                    v-model="q.max"
                    placeholder="最大值"
                    :precision="0"
                    :min="q.min !== undefined ? q.min : undefined"
                    size="small"
                    style="width: 80px"
                    controls-position="right"
                    :value-on-clear="undefined"
                  />
                </div>
              </div>
            </div>

            <!-- 單選題 / 多選題：選項編輯 -->
            <div v-if="q.type === 'single' || q.type === 'multiple'" class="mt-3">
              <span class="block text-sm mb-2">{{ $t('ui.options_label') }}</span>
              <draggable
                :model-value="optionsWithId(q)"
                @update:model-value="(items: any[]) => updateOptions(q, items.map(item => item.text))"
                item-key="id"
                :animation="200"
                ghost-class="option-ghost"
                class="space-y-2"
              >
                <template #item="{ element: item, index: oi }">
                  <div class="flex items-center gap-2">
                    <span class="cursor-move text-gray-400 hover:text-gray-600">☰</span>
                    <el-input
                      :model-value="item.text"
                      @update:model-value="(value) => updateOptionText(q, oi, value)"
                      :placeholder="$t('ui.option_placeholder')"
                      class="flex-1"
                    />
                    <button
                      class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors duration-200"
                      @click="removeOption(q, oi)"
                      :title="$t('ui.delete_option')"
                    >
                      <i class="fa-regular fa-trash-can text-xs"></i>
                    </button>
                  </div>
                </template>
              </draggable>
              <el-button @click="addOption(q)" class="mt-2">＋ {{ $t('ui.add_option') }}</el-button>
            </div>

            <!-- 預覽區（依型別顯示對應輸入） -->
            <div class="mt-3">
              <div class="flex items-center gap-2 mb-1">
                <span class="block text-xs text-slate-500">{{ $t('ui.preview_label') }}</span>
                <el-tooltip v-if="q.tip?.trim()" :content="q.tip" placement="top">
                  <i
                    class="fa-solid fa-circle-question text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-help text-xs"
                  ></i>
                </el-tooltip>
              </div>
              <el-input v-if="q.type === 'text'" :placeholder="$t('ui.text_input_placeholder')" disabled />
              <el-input-number
                v-else-if="q.type === 'number'"
                :disabled="true"
                :placeholder="$t('ui.number_placeholder')"
                class="min-w-[180px]"
              />
              <el-date-picker
                v-else-if="q.type === 'date'"
                type="date"
                :placeholder="$t('ui.date_placeholder')"
                :disabled="true"
                class="w-full"
              />
              <el-time-picker
                v-else-if="q.type === 'time'"
                :placeholder="$t('ui.time_placeholder')"
                :disabled="true"
                class="w-full"
              />
              <div v-else-if="q.type === 'single'" class="space-y-2">
                <el-radio-group :model-value="undefined" disabled>
                  <el-radio v-for="(opt, oi) in q.options" :key="oi" :value="opt">{{
                    opt || $t('ui.option_default', { number: oi + 1 })
                  }}</el-radio>
                </el-radio-group>
              </div>
              <div v-else-if="q.type === 'multiple'" class="space-y-2">
                <el-checkbox-group :model-value="[]" disabled>
                  <el-checkbox v-for="(opt, oi) in q.options" :key="oi" :value="opt">{{
                    opt || $t('ui.option_default', { number: oi + 1 })
                  }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </el-card>
        </template>
      </draggable>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'
import type { QType, Question } from '~~/types/index'
import { QUESTION_DEFAULT_TITLES, QUESTION_DEFAULT_TIPS } from '~~/utils/map'

interface Props {
  title: string
  description: string
  status: 'draft' | 'published'
  questions: Question[]
  isEditing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  status: 'draft',
  questions: () => [],
  isEditing: false,
})

const emit = defineEmits<{
  'update:title': [value: string]
  'update:description': [value: string]
  'update:status': [value: 'draft' | 'published']
  'update:questions': [value: Question[]]
  submit: []
}>()

const title = computed({
  get: () => props.title,
  set: (value) => emit('update:title', value),
})

const description = computed({
  get: () => props.description,
  set: (value) => emit('update:description', value),
})

const status = computed({
  get: () => props.status,
  set: (value) => emit('update:status', value),
})

const questions = computed({
  get: () => props.questions,
  set: (value) => emit('update:questions', value),
})

const formRef = ref<FormInstance>()

const { t } = useI18n()

const rules = reactive<FormRules>({
  title: [
    { required: true, message: t('form.validation.required'), trigger: 'blur' },
    {
      min: 1,
      max: 100,
      message: t('form.validation.min_length', { min: 1 }) + ' - ' + t('form.validation.max_length', { max: 100 }),
      trigger: 'blur',
    },
  ],
  description: [
    { required: true, message: t('form.validation.required'), trigger: 'blur' },
    {
      min: 1,
      max: 500,
      message: t('form.validation.min_length', { min: 1 }) + ' - ' + t('form.validation.max_length', { max: 500 }),
      trigger: 'blur',
    },
  ],
})

const addQuestion = (type: QType) => {
  const base = {
    id: uuidv4(),
    type,
    title: defaultLabel(type),
    required: true,
    tip:'',
  } as Question
  if (type === 'single' || type === 'multiple')
    base.options = [t('ui.option_default', { number: 1 }), t('ui.option_default', { number: 2 })]

  emit('update:questions', [...props.questions, base])
}

const defaultLabel = (type: QType) => {
  return QUESTION_DEFAULT_TITLES[type]
}

const removeQuestion = (id: string) => {
  const newQuestions = props.questions.filter((q) => q.id !== id)
  emit('update:questions', newQuestions)
}

const optionsWithId = (q: Question) =>
  (q.options || []).map((text: string, idx: number) => ({
    text,
    id: `${q.id}-${idx}`,
  }))

const updateQuestion = (questionId: string, updateFn: (question: Question) => Question) => {
  const newQuestions = props.questions.map((q) => (q.id === questionId ? updateFn({ ...q }) : q))
  emit('update:questions', newQuestions)
}

const addOption = (q: Question) => {
  if (!q.id) return
  updateQuestion(q.id, (question) => ({
    ...question,
    options: [...(question.options || []), t('ui.option_default', { number: (question.options?.length || 0) + 1 })],
  }))
}

const removeOption = (q: Question, idx: number) => {
  if (!q.id) return
  updateQuestion(q.id, (question) => ({
    ...question,
    options: question.options?.filter((_, i) => i !== idx),
  }))
}

const updateOptions = (q: Question, newOptions: string[]) => {
  if (!q.id) return
  updateQuestion(q.id, (question) => ({
    ...question,
    options: [...newOptions],
  }))
}

const updateOptionText = (q: Question, index: number, value: string) => {
  if (!q.id) return
  updateQuestion(q.id, (question) => {
    const newOptions = [...(question.options || [])]
    newOptions[index] = value
    return { ...question, options: newOptions }
  })
}

const updateQuestionTitle = (q: Question, value: string) => {
  if (!q.id) return
  updateQuestion(q.id, (question) => ({
    ...question,
    title: value,
  }))
}

const updateQuestionRequired = (q: Question, value: boolean) => {
  if (!q.id) return
  updateQuestion(q.id, (question) => ({
    ...question,
    required: value,
  }))
}

const updateQuestionTip = (q: Question, value: string) => {
  if (!q.id) return
  updateQuestion(q.id, (question) => ({
    ...question,
    tip: value,
  }))
}

const getRangeText = (q: Question) => {
  if (q.min !== undefined && q.max !== undefined) {
    return `範圍：${q.min} ～ ${q.max}`
  } else if (q.min !== undefined) {
    return `最小：${q.min}`
  } else if (q.max !== undefined) {
    return `最大：${q.max}`
  }
  return ''
}

const submit = async () => {
  if (!formRef.value) return

  const emptyLabelQuestions = props.questions.filter((q) => !q.title?.trim())
  if (emptyLabelQuestions.length > 0) {
    ElMessage.error(t('messages.required_questions_error'))
    return
  }

  if (props.questions.length === 0) {
    ElMessage.error(t('messages.min_questions_error'))
    return
  }

  try {
    const valid = await formRef.value.validate()
    if (valid) {
      emit('submit')
    }
  } catch (error) {
    ElMessage.error(t('messages.form_validation_error'))
  }
}
</script>

<style>
.ghost-class {
  border: 1px dashed rgb(6 182 212);
  border-radius: 8px;
}
</style>
