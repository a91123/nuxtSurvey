<template>
  <section class="p-6 max-w-7xl mx-auto h-full min-h-0 grid gap-4">
    <div class="h-[100px]">
      <div class="flex justify-between items-center mb-3">
        <h1 class="text-2xl font-bold">問卷管理</h1>
        <NuxtLink to="/creator">
          <el-button type="primary">新增問卷</el-button>
        </NuxtLink>
      </div>

      <div class="flex flex-wrap gap-3 items-center">
        <div class="flex-1 min-w-[200px]">
          <el-input v-model="title" placeholder="搜尋問卷標題" clearable />
        </div>
        <div class="w-40">
          <el-select v-model="status" placeholder="狀態" clearable class="w-full">
            <el-option label="全部" value="all" />
            <el-option label="已發布" value="published" />
            <el-option label="草稿" value="draft" />
          </el-select>
        </div>
        <div class="w-44">
          <el-select v-model="sort" placeholder="排序" class="w-full">
            <el-option label="最近更新" value="recent" />
            <el-option label="回覆數多到少" value="responses" />
            <el-option label="題數多到少" value="questions" />
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
          title="載入失敗"
          :description="error?.message"
          class="mb-4"
        />
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pr-1">
        <div v-for="s in items" :key="s.id" class="w-full">
          <el-card shadow="hover" class="relative">
            <div class="text-lg font-semibold mb-1">{{ s.title }}</div>
            <div class="text-slate-600 mb-2">{{ s.desc }}</div>
            <div class="text-sm text-slate-500 mb-1">
              狀態：<span :class="s.status === 'published' ? 'text-green-600' : 'text-yellow-600'">
                {{ s.status === 'published' ? '已發布' : '草稿' }}
              </span>
            </div>
            <div class="text-sm text-slate-500">題數：{{ s.questions }} · 回覆：{{ s.responses }}</div>
            <div class="text-xs text-slate-400 mt-1">最後更新：{{ s.updatedAt }}</div>
            <template #footer>
              <div class="flex gap-2 justify-end">
                <NuxtLink :to="`/editor/${s.id}`">
                  <el-button size="small" plain>編輯</el-button>
                </NuxtLink>
                <el-button size="small" plain>統計</el-button>
                <el-button size="small" plain>複製連結</el-button>
                <i
                  class="fa-regular fa-trash-can text-[#a09f9f] cursor-pointer hover:text-red-600 absolute top-2 right-2"
                  @click="handleDelete(s.id.toString(), s.title)"
                ></i>
              </div>
            </template>
          </el-card>
        </div>
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
import { useDebounceFn } from '@vueuse/core'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { SurveyListResponse } from '../../types/index'

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

const { data, pending, error, refresh } = await useFetch<SurveyListResponse>('/api/surveys', {
  query: { title: titleDebounced, status, sort, page, pageSize },
  watch: [titleDebounced, status, sort, page, pageSize],
})
const items = computed(() => data.value?.items || [])
const total = computed(() => data.value?.total || 0)

// 刪除功能
const handleDelete = async (surveyId: string, surveyTitle: string) => {
  try {
    await ElMessageBox.confirm(`確定要刪除問卷「${surveyTitle}」嗎？此操作無法復原。`, '刪除確認', {
      confirmButtonText: '確定刪除',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger',
    })
    await $fetch<any>(`/api/surveys/${surveyId}`, {
      method: 'DELETE',
    })
    ElMessage.success('問卷刪除成功')
    await refresh()
  } catch (error: any) {
    if (error === 'cancel') {
      return
    }
    console.error('刪除問卷失敗:', error)
    ElMessage.error(error?.data?.statusMessage || '刪除問卷失敗')
  }
}
</script>
