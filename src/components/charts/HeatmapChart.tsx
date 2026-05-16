import type { EChartsOption } from 'echarts'
import { BaseChart } from './BaseChart'
import { useAppStore } from '@/stores/useAppStore'

export interface HeatmapChartProps {
  data: Array<[string, number]>
  year?: number
  colorRange?: [string, string]
  cellSize?: number
  cellGap?: number
  tooltip?: boolean
  months?: string[]
  weekdays?: string[]
  height?: string | number
  loading?: boolean
  className?: string
}

const DEFAULT_MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const DEFAULT_WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export function HeatmapChart({
  data,
  year = new Date().getFullYear(),
  colorRange,
  cellSize = 14,
  cellGap = 2,
  tooltip = true,
  months = DEFAULT_MONTHS,
  weekdays = DEFAULT_WEEKDAYS,
  height,
  loading,
  className,
}: HeatmapChartProps) {
  const { primaryColor } = useAppStore()
  const range: [string, string] = colorRange ?? ['#ebedf0', primaryColor]

  const values = data.map(([, v]) => v)
  const maxVal = values.length ? Math.max(...values) : 1

  const option: EChartsOption = {
    ...(tooltip && {
      tooltip: {
        trigger: 'item',
        formatter: (params: unknown) => {
          const p = params as { value: [string, number] }
          return `${p.value[0]}: ${p.value[1]}`
        },
      },
    }),
    visualMap: {
      min: 0,
      max: maxVal,
      calculable: false,
      orient: 'horizontal',
      show: false,
      inRange: { color: range },
    },
    calendar: {
      top: 30,
      left: 40,
      right: 10,
      cellSize: [cellSize + cellGap, cellSize + cellGap],
      range: String(year),
      itemStyle: { borderWidth: cellGap, borderColor: 'transparent' },
      yearLabel: { show: false },
      monthLabel: { nameMap: months },
      dayLabel: { firstDay: 0, nameMap: weekdays },
    },
    series: [
      {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data,
        itemStyle: { borderRadius: 2 },
      },
    ],
  }

  return <BaseChart option={option} loading={loading} height={height ?? 180} className={className} />
}
