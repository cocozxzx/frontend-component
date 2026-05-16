import type { EChartsOption } from 'echarts'
import { BaseChart } from './BaseChart'

export interface GaugeChartProps {
  value: number
  min?: number
  max?: number
  title?: string
  unit?: string
  thresholds?: Array<{ value: number; color: string }>
  splitNumber?: number
  height?: string | number
  loading?: boolean
  className?: string
}

const DEFAULT_THRESHOLDS = [
  { value: 0.6, color: '#52C41A' },
  { value: 0.8, color: '#FAAD14' },
  { value: 1, color: '#F5222D' },
]

export function GaugeChart({
  value,
  min = 0,
  max = 100,
  title,
  unit = '',
  thresholds,
  splitNumber = 10,
  height,
  loading,
  className,
}: GaugeChartProps) {
  const axisLineColors = (thresholds ?? DEFAULT_THRESHOLDS).map((t) => [t.value, t.color] as [number, string])

  const option: EChartsOption = {
    series: [
      {
        type: 'gauge',
        min,
        max,
        splitNumber,
        axisLine: {
          lineStyle: {
            width: 15,
            color: axisLineColors,
          },
        },
        pointer: { itemStyle: { color: 'auto' } },
        axisTick: { distance: -15, length: 8, lineStyle: { color: '#fff', width: 2 } },
        splitLine: { distance: -15, length: 20, lineStyle: { color: '#fff', width: 4 } },
        axisLabel: { color: 'inherit', distance: 25, fontSize: 12 },
        detail: {
          valueAnimation: true,
          formatter: `{value}${unit}`,
          color: 'inherit',
          fontSize: 24,
          fontWeight: 'bold',
          offsetCenter: [0, '60%'],
        },
        title: title ? { offsetCenter: [0, '85%'], fontSize: 14 } : undefined,
        data: [{ value, name: title }],
      },
    ],
  }

  return <BaseChart option={option} loading={loading} height={height} className={className} />
}
