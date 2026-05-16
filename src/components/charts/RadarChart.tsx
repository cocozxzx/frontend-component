import type { EChartsOption } from 'echarts'
import { BaseChart } from './BaseChart'

export interface RadarChartProps {
  data: Array<{ name: string; value: number[] }>
  indicators: Array<{ name: string; max: number }>
  shape?: 'polygon' | 'circle'
  filled?: boolean
  title?: string
  legend?: boolean
  tooltip?: boolean
  height?: string | number
  loading?: boolean
  className?: string
}

export function RadarChart({
  data,
  indicators,
  shape = 'polygon',
  filled = true,
  title,
  legend = true,
  tooltip = true,
  height,
  loading,
  className,
}: RadarChartProps) {
  const option: EChartsOption = {
    ...(title && { title: { text: title } }),
    ...(tooltip && { tooltip: { trigger: 'item' } }),
    ...(legend && data.length > 1 && { legend: { data: data.map((d) => d.name) } }),
    radar: {
      indicator: indicators,
      shape,
    },
    series: [
      {
        type: 'radar',
        data: data.map((d) => ({
          name: d.name,
          value: d.value,
          ...(filled && { areaStyle: { opacity: 0.25 } }),
        })),
      },
    ],
  }

  return <BaseChart option={option} loading={loading} height={height} className={className} />
}
