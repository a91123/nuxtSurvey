<template>
  <section class="p-6 max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">新增問卷</h1>
      <div class="flex gap-2">
        <el-button @click="navigateTo('/')">返回列表</el-button>
        <el-button type="primary" @click="submit">儲存</el-button>
      </div>
    </div>

    <el-card shadow="never">
      <el-form :model="form" label-width="84px">
        <el-form-item label="標題">
          <el-input v-model="form.title" placeholder="例如：顧客滿意度調查" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.desc" type="textarea" :autosize="{ minRows: 3 }" placeholder="可選" />
        </el-form-item>
        <el-form-item label="狀態">
          <el-radio-group v-model="form.status">
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
      </div>
    </el-card>

    <ClientOnly>
      <draggable
        v-model="questions"
        item-key="id"
        handle=".drag-handle"
        :animation="300"
        ghost-class="ghostClass"
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
                <el-button link type="danger" @click="removeQuestion(q.id)">刪除</el-button>
              </div>
            </template>

            <div class="grid gap-3 sm:grid-cols-2">
              <div>
                <span class="block text-sm mb-1">題目標籤</span>
                <el-input v-model="q.label" placeholder="例如：請輸入您的名字" />
              </div>
              <div class="flex items-end">
                <el-checkbox v-model="q.required">必填</el-checkbox>
              </div>
            </div>

            <!-- 單選題：選項編輯 -->
            <div v-if="q.type === 'single'" class="mt-3">
              <span class="block text-sm mb-2">選項</span>
              <div class="space-y-2">
                <div v-for="(opt, oi) in q.options" :key="oi" class="flex items-center gap-2">
                  <el-input v-model="q.options[oi]" placeholder="選項文字" class="flex-1" />
                  <el-button link type="danger" @click="removeOption(q, oi)">刪除</el-button>
                </div>
                <el-button @click="addOption(q)">＋ 新增選項</el-button>
              </div>
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
            </div>
          </el-card>
        </template>
      </draggable>
    </ClientOnly>
  </section>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import draggable from 'vuedraggable'
import { ElMessage } from 'element-plus'

type QType = 'text' | 'number' | 'date' | 'time' | 'single'

type Question = {
  id: number
  type: QType
  label: string
  required: boolean
  options?: string[]
}

const form = reactive({
  title: '',
  desc: '',
  status: '草稿' as '草稿' | '已發布',
})

const questions = ref<Question[]>([])
let seq = 1

function addQuestion(type: QType) {
  const base = { id: seq++, type, label: defaultLabel(type), required: false } as Question
  if (type === 'single') base.options = ['選項 1', '選項 2']
  questions.value.push(base)
}
function defaultLabel(type: QType) {
  switch (type) {
    case 'number':
      return '數字題'
    case 'date':
      return '日期題'
    case 'time':
      return '時間題'
    case 'single':
      return '單選題'
    default:
      return '文字題'
  }
}
function removeQuestion(id: number) {
  const index = questions.value.findIndex((q) => q.id === id)
  if (index !== -1) questions.value.splice(index, 1)
}
function addOption(q: Question) {
  if (!q.options) q.options = []
  q.options.push(`選項 ${q.options.length + 1}`)
}
function removeOption(q: Question, idx: number) {
  q.options?.splice(idx, 1)
}

async function submit() {
  if (!form.title.trim()) {
    ElMessage.error('請輸入標題')
    return
  }
  const payload = {
    title: form.title.trim(),
    desc: form.desc.trim(),
    status: form.status,
    questions: questions.value.map((q) => ({
      type: q.type,
      label: q.label.trim(),
      required: q.required,
      options: q.type === 'single' ? (q.options || []).filter(Boolean) : undefined,
    })),
  }
  await $fetch('/api/surveys', { method: 'POST', body: payload })
  ElMessage.success('已儲存')
  await navigateTo('/')
}
</script>
<style>
.ghostClass {
  border-top: 1px solid rgb(26, 183, 194);
}
</style>
