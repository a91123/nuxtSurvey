<template>
  <section class="p-6 max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">{{ isEditing ? '編輯問卷' : '新增問卷' }}</h1>
      <div class="flex gap-2">
        <el-button @click="navigateTo('/')">返回列表</el-button>
        <el-button type="primary" @click="submit">儲存</el-button>
      </div>
    </div>

    <el-card shadow="never">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="84px">
        <el-form-item label="標題" prop="title">
          <el-input
            :model-value="title"
            @update:model-value="(value) => emit('update:title', value)"
            placeholder="例如：顧客滿意度調查"
          />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input
            :model-value="desc"
            @update:model-value="(value) => emit('update:desc', value)"
            type="textarea"
            :autosize="{ minRows: 3 }"
            placeholder="請輸入描述"
          />
        </el-form-item>
        <el-form-item label="狀態">
          <el-radio-group :model-value="status" @update:model-value="(value: any) => emit('update:status', value)">
            <el-radio label="草稿" />
            <el-radio label="已發布" />
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm text-slate-600 mr-2">新增題目：</span>
        <el-button type="primary" plain @click="addQuestion('text')">純文字</el-button>
        <el-button type="primary" plain @click="addQuestion('number')">數字</el-button>
        <el-button type="primary" plain @click="addQuestion('date')">日期</el-button>
        <el-button type="primary" plain @click="addQuestion('time')">時間</el-button>
        <el-button type="primary" plain @click="addQuestion('single')">單選</el-button>
        <el-button type="primary" plain @click="addQuestion('multiple')">多選</el-button>
      </div>
    </el-card>

    <ClientOnly>
      <draggable
        v-model="questions"
        item-key="id"
        handle=".drag-handle"
        :animation="300"
        ghost-class="ghost-class"
        class="space-y-3"
      >
        <template #item="{ element: q, index: idx }">
          <el-card class="draggable-item" shadow="never">
            <template #header>
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <span class="drag-handle cursor-grab select-none">≡</span>
                  <span class="text-sm text-slate-500">{{ idx + 1 }}. {{ q.type }}</span>
                </div>
                <i
                  class="fa-regular fa-trash-can text-gray-400 cursor-pointer hover:text-red-600 w-4 h-4 flex items-center justify-center"
                  @click="removeQuestion(q.id)"
                ></i>
              </div>
            </template>

            <div class="grid gap-3 sm:grid-cols-2">
              <div>
                <span class="block text-sm mb-1">題目標籤 <span class="text-red-500">*</span></span>
                <el-input
                  v-model="q.label"
                  placeholder="例如：請輸入您的名字"
                  :class="{ 'border-red-300': !q.label.trim() }"
                />
                <span v-if="!q.label.trim()" class="text-xs text-red-500 mt-1">此欄位為必填</span>
              </div>
              <div class="flex items-end">
                <el-checkbox v-model="q.required">必填</el-checkbox>
              </div>
            </div>

            <!-- 單選題 / 多選題：選項編輯 -->
            <div v-if="q.type === 'single' || q.type === 'multiple'" class="mt-3">
              <span class="block text-sm mb-2">選項</span>
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
                      placeholder="選項文字"
                      class="flex-1"
                    />
                    <i
                      class="fa-regular fa-trash-can text-gray-400 cursor-pointer hover:text-red-600 w-4 h-4 flex items-center justify-center"
                      @click="removeOption(q, oi)"
                    ></i>
                  </div>
                </template>
              </draggable>
              <el-button @click="addOption(q)" class="mt-2">＋ 新增選項</el-button>
            </div>

            <!-- 預覽區（依型別顯示對應輸入） -->
            <div class="mt-3">
              <span class="block text-xs text-slate-500 mb-1">預覽</span>
              <el-input v-if="q.type === 'text'" placeholder="文字輸入" disabled />
              <el-input-number v-else-if="q.type === 'number'" :disabled="true" class="w-full" />
              <el-date-picker
                v-else-if="q.type === 'date'"
                type="date"
                placeholder="選擇日期"
                :disabled="true"
                class="w-full"
              />
              <el-time-picker v-else-if="q.type === 'time'" placeholder="選擇時間" :disabled="true" class="w-full" />
              <div v-else-if="q.type === 'single'" class="space-y-2">
                <el-radio-group :model-value="undefined" disabled>
                  <el-radio v-for="(opt, oi) in q.options" :key="oi" :label="oi">{{
                    opt || `選項 ${oi + 1}`
                  }}</el-radio>
                </el-radio-group>
              </div>
              <div v-else-if="q.type === 'multiple'" class="space-y-2">
                <el-checkbox-group :model-value="[]" disabled>
                  <el-checkbox v-for="(opt, oi) in q.options" :key="oi" :label="oi">{{
                    opt || `選項 ${oi + 1}`
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
import type { QType, Question, SurveyFormData } from '~~/stores/surveys'

// Props
interface Props {
  title: string
  desc: string
  status: '草稿' | '已發布'
  questions: Question[]
  isEditing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  desc: '',
  status: '草稿',
  questions: () => [],
  isEditing: false,
})

// Emits for v-model
const emit = defineEmits<{
  'update:title': [value: string]
  'update:desc': [value: string]
  'update:status': [value: '草稿' | '已發布']
  'update:questions': [value: Question[]]
  submit: []
}>()

// 使用 computed 實現雙向綁定
const form = computed({
  get: () => ({
    title: props.title,
    desc: props.desc,
    status: props.status,
  }),
  set: (value) => {
    emit('update:title', value.title)
    emit('update:desc', value.desc)
    emit('update:status', value.status)
  },
})

const questions = computed({
  get: () => props.questions,
  set: (value) => emit('update:questions', value),
})

// Form reference and validation rules
const formRef = ref<FormInstance>()

const rules = reactive<FormRules>({
  title: [
    { required: true, message: '請輸入標題', trigger: 'blur' },
    { min: 1, max: 100, message: '標題長度應在 1 到 100 個字符之間', trigger: 'blur' },
  ],
  desc: [
    { required: true, message: '請輸入描述', trigger: 'blur' },
    { min: 1, max: 500, message: '描述長度應在 1 到 500 個字符之間', trigger: 'blur' },
  ],
})

// Question management functions
const addQuestion = (type: QType) => {
  const base = { id: uuidv4(), type, label: defaultLabel(type), required: false } as Question
  if (type === 'single' || type === 'multiple') base.options = ['選項 1', '選項 2']

  emit('update:questions', [...props.questions, base])

  // 添加問題後滾動到頁面底部
  nextTick(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    })
  })
}

const defaultLabel = (type: QType) => {
  switch (type) {
    case 'number':
      return '數字題'
    case 'date':
      return '日期題'
    case 'time':
      return '時間題'
    case 'single':
      return '單選題'
    case 'multiple':
      return '多選題'
    default:
      return '文字題'
  }
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

// 通用的問題更新函數
const updateQuestion = (questionId: string, updateFn: (question: Question) => Question) => {
  const newQuestions = props.questions.map((q) => (q.id === questionId ? updateFn({ ...q }) : q))
  emit('update:questions', newQuestions)
}

const addOption = (q: Question) => {
  if (!q.id) return
  updateQuestion(q.id, (question) => ({
    ...question,
    options: [...(question.options || []), `選項 ${(question.options?.length || 0) + 1}`],
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

// Submit function
const submit = async () => {
  if (!formRef.value) return

  // 檢查是否有問題標題為空的問題
  const emptyLabelQuestions = props.questions.filter((q) => !q.label.trim())
  if (emptyLabelQuestions.length > 0) {
    ElMessage.error('所有問題都必須填寫標題')
    return
  }

  // 檢查是否至少有一題
  if (props.questions.length === 0) {
    ElMessage.error('至少需要新增一個問題')
    return
  }

  try {
    const valid = await formRef.value.validate()
    if (valid) {
      emit('submit')
    }
  } catch (error) {
    ElMessage.error('請檢查表單輸入')
  }
}
</script>

<style>
.ghost-class {
  border-top: 1px solid rgb(26, 183, 194);
}

.option-ghost {
  background-color: #f3f4f6;
  border: 1px dashed #d1d5db;
}
</style>
