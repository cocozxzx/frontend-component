import type { EChartsOption } from 'echarts'
import { BaseChart } from './BaseChart'

type DataRow = Record<string, unknown>

export interface BarChartProps {
  data: DataRow[]
  xField: string
  yField: string | string[]
  seriesNames?: string[]
  horizontal?: boolean
  stack?: boolean | string
  barWidth?: number | string
  barMaxWidth?: number
  showBackground?: boolean
  radius?: number
  showLabel?: boolean
  title?: string
  legend?: boolean
  tooltip?: boolean
  grid?: object
  yAxisFormatter?: (value: number) => string
  tooltipFormatter?: (params: unknown) => string
  height?: string | number
  loading?: boolean
  className?: string
}

export function BarChart({
  data,
  xField,
  yField,
  seriesNames,
  horizontal = false,
  stack = false,
  barWidth,
  barMaxWidth = 60,
  showBackground = false,
  radius = 4,
  showLabel = false,
  title,
  legend = true,
  tooltip = true,
  grid,
  yAxisFormatter,
  tooltipFormatter,
  height,
  loading,
  className,
}: BarChartProps) {
  const catData = data.map((d) => d[xField])
  const yFields = Array.isArray(yField) ? yField : [yField]
  const stackName = typeof stack === 'string' ? stack : stack ? 'stack' : undefined

  const series: EChartsOption['series'] = yFields.map((field, i) => ({
    type: 'bar',
    name: seriesNames?.[i] ?? field,
    data: data.map((d) => d[field]),
    stack: stackName,
    barWidth,
    barMaxWidth,
    showBackground,
    label: { show: showLabel, position: horizontal ? 'right' : 'top' },
    itemStyle: {
      borderRadius: horizontal
        ? [0, radius, radius, 0]
        : [radius, radius, 0, 0],
    },
  }))

  const catAxis = { type: 'category' as const, data: catData }
  const valAxis = {
    type: 'value' as const,
    ...(yAxisFormatter && { axisLabel: { formatter: yAxisFormatter } }),
  }

  const option: EChartsOption = {
    ...(title && { title: { text: title } }),
    ...(tooltip && { tooltip: { trigger: 'axis', ...(tooltipFormatter && { formatter: tooltipFormatter }) } }),
    ...(legend && yFields.length > 1 && { legend: { data: seriesNames ?? yFields } }),
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true, ...grid },
    xAxis: horizontal ? valAxis : catAxis,
    yAxis: horizontal ? catAxis : valAxis,
    series,
  }

  return <BaseChart option={option} loading={loading} height={height} className={className} />
}
