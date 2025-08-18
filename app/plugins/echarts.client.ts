export default defineNuxtPlugin(async (nuxtApp) => {
  // 只在客戶端執行
  if (import.meta.client) {
    try {
      // 同步導入 ECharts 組件
      const { use } = await import('echarts/core')
      const { CanvasRenderer } = await import('echarts/renderers')
      const { PieChart, BarChart, LineChart } = await import('echarts/charts')
      const { TitleComponent, TooltipComponent, LegendComponent, GridComponent } = await import('echarts/components')

      // 註冊需要的組件
      use([
        CanvasRenderer,
        PieChart,
        BarChart,
        LineChart,
        TitleComponent,
        TooltipComponent,
        LegendComponent,
        GridComponent
      ])
      
      console.log('✅ ECharts 插件初始化完成')
      
      // 設置全域狀態標記
      if (typeof window !== 'undefined') {
        window.__ECHARTS_READY__ = true
      }
      
    } catch (error) {
      console.error('❌ ECharts 初始化失敗:', error)
      // 錯誤時不設置 window.__ECHARTS_READY__，保持 undefined
    }
  }
})
