<template>
  <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
    <h4 v-if="title" class="text-lg font-semibold text-gray-800 mb-4 text-center">
      {{ title }}
    </h4>

    <ClientOnly>
      <!-- 無數據狀態 -->
      <div v-if="!hasData" class="text-center text-gray-500 py-12">
        <div class="text-5xl mb-3">🤔</div>
        <div class="text-lg font-medium mb-2">還沒有人回答這個問題</div>
        <div class="text-sm">等有回答後就會顯示統計圖表囉！</div>
      </div>

      <!-- 載入狀態 -->
      <div v-else-if="isLoading" class="text-center text-gray-500 py-8">
        <div class="animate-pulse">{{ loadingText || '載入圖表中...' }}</div>
      </div>

      <!-- 圓餅圖 -->
      <VChart
        v-else
        :option="chartOption"
        :style="{ height: height || '300px' }"
        autoresize
        class="transition-opacity duration-300"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
import { useChartsProvider } from '~/composables/useChartsProvider'

interface Props {
  data: Array<{ option: string; count: number }> | null
  title?: string
  height?: string
  colors?: string[]
  loadingText?: string
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '300px',
  colors: () => ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'],
  loadingText: '載入圖表中...',
  emptyText: '暫無數據可顯示',
})

const { createPieChartOption, isEChartsReady } = useChartsProvider()

// 計算屬性
const hasData = computed(() => {
  // 檢查是否有數據且至少有一個選項被選擇
  return props.data && props.data.length > 0 && props.data.some((item) => item.count > 0)
})
const isLoading = computed(() => !isEChartsReady.value)

const chartOption = computed(() => {
  if (!hasData.value || isLoading.value) {
    return {}
  }

  const chartData = props.data!.map((item) => ({
    name: item.option,
    value: item.count,
  }))

  return createPieChartOption(chartData, {
    colors: props.colors,
  })
})
</script>
<style scoped></style>
