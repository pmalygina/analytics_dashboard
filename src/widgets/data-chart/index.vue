<template>
  <v-card>
    <v-card-title class="d-flex align-center justify-space-between">
      <span>Chart</span>

      <v-btn-toggle
        v-model="chartType"
        density="compact"
        variant="outlined"
        mandatory
      >
        <v-btn
          value="line"
          size="small"
        >
          Line
        </v-btn>

        <v-btn
          value="bar"
          size="small"
        >
          Bar
        </v-btn>
      </v-btn-toggle>
    </v-card-title>

    <v-card-text>
      <div
        ref="chartContainer"
        :style="{ width: '100%', height: '400px' }"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import echarts from '@/shared/lib/echarts'
import {
  transformPivotToChartData,
  formatAxisValue,
  extractUniqueYears,
  filterValidSeries,
} from '@/entities/chart-data'

interface Props {
  tableData: PivotTableData
  selectedCountries?: string[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  selectedCountries: () => [],
  tableData: () => ({ rows: [], countries: [], unit: '' }),
})

const chartContainer = ref<HTMLDivElement | null>(null)
const chartInstance = ref<ReturnType<typeof echarts.init> | null>(null)
const chartType = ref<ChartType>('line')
const resizeTimer = ref<number | null>(null)

const { smAndDown } = useDisplay()

const countries = computed(() => props.selectedCountries || [])

const chartSeries = computed(() =>
  transformPivotToChartData({ ...props.tableData, countries: countries.value }, countries.value)
    .filter(s => s?.name && s?.data?.length)
    .map(s => ({
      name: s.name,
      type: chartType.value,
      data: s.data.map(d => d.value).filter(v => v != null),
      smooth: chartType.value === 'line',
    }))
    .filter(s => s.data.length > 0)
)

const chartOption = computed(() => {
  const isMobile = smAndDown.value
  const series = chartSeries.value

  if (!series.length) {
    return {
      series: [] as typeof series,
      title: {
        text: 'No data selected',
        left: 'center',
        top: 'middle',
        textStyle: { color: '#999' },
      },
    }
  }

  return {
    series,
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: {
      data: series.map(s => s.name),
      selectedMode: false,
      top: isMobile ? 10 : 30,
      itemGap: isMobile ? 15 : 20,
      textStyle: { fontSize: isMobile ? 10 : 12 },
    },
    grid: {
      left: isMobile ? '3%' : '1%',
      right: isMobile ? '5%' : '4%',
      bottom: isMobile ? '15%' : '10%',
      top: isMobile ? '20%' : '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: chartType.value === 'bar',
      data: extractUniqueYears(props.tableData.rows),
      axisLabel: { rotate: isMobile ? 45 : 0, fontSize: isMobile ? 10 : 12 },
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: formatAxisValue, fontSize: isMobile ? 10 : 12 },
    },
  }
})

const disposeChart = () => {
  chartInstance.value?.dispose()
  chartInstance.value = null
}

const renderChart = () => {
  if (!chartContainer.value) return

  const option = chartOption.value
  const hasNoSeries = !option.series || !Array.isArray(option.series) || !option.series.length

  if (hasNoSeries) {
    disposeChart()
    if ('title' in option) {
      chartInstance.value = echarts.init(chartContainer.value)
      chartInstance.value.setOption(option, { notMerge: true })
    }
    return
  }

  const validSeries = filterValidSeries(option.series)
  if (!validSeries.length) return

  disposeChart()
  chartInstance.value = echarts.init(chartContainer.value)
  chartInstance.value.setOption({ ...option, series: validSeries }, { notMerge: true })
}

const handleResize = () => {
  if (resizeTimer.value) window.clearTimeout(resizeTimer.value)
  resizeTimer.value = window.setTimeout(renderChart, 150)
}

watch([() => props.tableData, () => props.selectedCountries, chartType, smAndDown], renderChart, {
  deep: true,
})

onMounted(() => {
  nextTick(() => {
    renderChart()
    window.addEventListener('resize', handleResize)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (resizeTimer.value) window.clearTimeout(resizeTimer.value)
  disposeChart()
})
</script>
