import type { ReactNode } from 'react'
import type { EChartsOption } from 'echarts'
import { BaseChart } from './BaseChart'

export interface PieChartProps {
  data: Array<{ name: string; value: number; [key: string]: unknown }>
  donut?: boolean
  innerRadius?: string
  outerRadius?: string
  roseType?: boolean
  showLabel?: boolean
  labelType?: 'inner' | 'outer' | 'center'
  centerText?: ReactNode
  title?: string
  legend?: boolean
  legendPosition?: 'top' | 'bottom' | 'left' | 'right'
  tooltip?: boolean
  height?: string | number
  loading?: boolean
  className?: string
}

export function PieChart({
  data,
  donut = false,
  innerRadius = '55%',
  outerRadius = '70%',
  roseType = false,
  showLabel = true,
  labelType = 'outer',
  centerText,
  title,
  legend = true,
  legendPosition = 'bottom',
  tooltip = true,
  height,
  loading,
  className,
}: PieChartProps) {
  const radius = donut ? [innerRadius, outerRadius] : outerRadius

  const labelConfig = showLabel
    ? labelType === 'inner'
      ? { show: true, position: 'inside' as const, formatter: '{d}%' }
      : labelType === 'center'
        ? { show: true, position: 'center' as const, formatter: '{b}\n{d}%' }
        : { show: true }
    : { show: false }

  const legendConfig = legend
    ? {
        [legendPosition === 'left' || legendPosition === 'right' ? 'orient' : 'orient']:
          legendPosition === 'left' || legendPosition === 'right' ? 'vertical' as const : 'horizontal' as const,
        [legendPosition]: legendPosition === 'bottom' ? '0' : legendPosition === 'top' ? '0' : '0',
      }
    : undefined

  const option: EChartsOption = {
    ...(title && { title: { text: title } }),
    ...(tooltip && { tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' } }),
    ...(legend && { legend: legendConfig }),
    series: [
      {
        type: 'pie',
        radius,
        data,
        roseType: roseType ? 'area' : undefined,
        label: labelConfig,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }

  return (
    <div className="relative">
      <BaseChart option={option} loading={loading} height={height} className={className} />
      {donut && centerText && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {centerText}
        </div>
      )}
    </div>
  )
}
