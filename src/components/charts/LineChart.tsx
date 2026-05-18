import type { EChartsOption } from 'echarts'
import { BaseChart, type BaseChartProps } from './BaseChart'

type DataRow = Record<string, unknown>

export interface LineChartProps {
  data: DataRow[]
  xField: string
  yField: string | string[]
  seriesNames?: string[]
  smooth?: boolean
  area?: boolean
  areaOpacity?: number
  showSymbol?: boolean
  showLabel?: boolean
  connectNulls?: boolean
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

export function LineChart({
  data,
  xField,
  yField,
  seriesNames,
  smooth = false,
  area = false,
  areaOpacity = 0.3,
  showSymbol = true,
  showLabel = false,
  connectNulls = false,
  title,
  legend = true,
  tooltip = true,
  grid,
  yAxisFormatter,
  tooltipFormatter,
  height,
  loading,
  className,
}: LineChartProps) {
  const xData = data.map((d) => d[xField])
  const yFields = Array.isArray(yField) ? yField : [yField]

  const series: EChartsOption['series'] = yFields.map((field, i) => ({
    type: 'line',
    name: seriesNames?.[i] ?? field,
    data: data.map((d) => d[field]),
    smooth,
    showSymbol,
    connectNulls,
    label: { show: showLabel },
    ...(area && {
      areaStyle: { opacity: areaOpacity },
    }),
  }))

  const showLegend = legend && yFields.length > 1
  const topOffset = title && showLegend ? 72 : title ? 46 : showLegend ? 40 : 10

  const option: EChartsOption = {
    ...(title && { title: { text: title, top: 5 } }),
    ...(tooltip && { tooltip: { trigger: 'axis', ...(tooltipFormatter && { formatter: tooltipFormatter }) } }),
    legend: showLegend
      ? { data: seriesNames ?? yFields, top: title ? 30 : 6 }
      : { show: false },
    grid: { top: topOffset, left: '3%', right: '4%', bottom: '3%', containLabel: true, ...grid },
    xAxis: { type: 'category', data: xData, boundaryGap: false },
    yAxis: {
      type: 'value',
      ...(yAxisFormatter && { axisLabel: { formatter: yAxisFormatter } }),
    },
    series,
  }

  return (
    <BaseChart
      option={option}
      loading={loading}
      height={height}
      className={className}
    />
  )
}
