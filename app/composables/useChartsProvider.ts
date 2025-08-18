export const useChartsProvider = () => {
  const isEChartsReady = useState('echarts-ready', () => false)
  onMounted(() =>isEChartsReady.value = true)
  const createPieChartOption = (data: Array<{name: string, value: number}>, options?: {
    colors?: string[]
    title?: string
  }) => {
    const defaultColors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316']
    const colors = options?.colors || defaultColors

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: {
          color: '#374151',
          fontSize: 14
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
        textStyle: {
          color: '#6b7280',
          fontSize: 12
        },
        itemGap: 8
      },
      series: [
        {
          name: options?.title || '選項統計',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['65%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
              color: '#374151'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          labelLine: {
            show: false
          },
          data: data.map((item, index) => ({
            value: item.value,
            name: item.name,
            itemStyle: {
              color: colors[index % colors.length]
            }
          }))
        }
      ]
    }
  }

  // 柱狀圖配置生成器
  const createBarChartOption = (data: Array<{name: string, value: number}>, options?: {
    color?: string
    title?: string
  }) => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.name),
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: options?.title || '統計數據',
          type: 'bar',
          barWidth: '60%',
          data: data.map(item => ({
            value: item.value,
            itemStyle: {
              color: options?.color || '#3B82F6'
            }
          }))
        }
      ]
    }
  }

  // 線圖配置生成器
  const createLineChartOption = (data: Array<{name: string, value: number}>, options?: {
    color?: string
    title?: string
  }) => {
    return {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map(item => item.name)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: options?.title || '趨勢統計',
          type: 'line',
          stack: 'Total',
          data: data.map(item => item.value),
          itemStyle: {
            color: options?.color || '#10B981'
          },
          areaStyle: {
            opacity: 0.3
          }
        }
      ]
    }
  }

  return {
    isEChartsReady: readonly(isEChartsReady),
    createPieChartOption,
    createBarChartOption,
    createLineChartOption
  }
}