import type { EChartsOption } from 'echarts'
import { BaseChart } from './BaseChart'

export interface ScatterChartProps {
  data: Array<[number, number] | [number, number, number]>
  xName?: string
  yName?: string
  symbolSize?: number | ((value: number[]) => number)
  title?: string
  tooltip?: boolean
  height?: string | number
  loading?: boolean
  className?: string
}

export function ScatterChart({
  data,
  xName,
  yName,
  symbolSize = 10,
  title,
  tooltip = true,
  height,
  loading,
  className,
}: ScatterChartProps) {
  const option: EChartsOption = {
    ...(title && { title: { text: title } }),
    ...(tooltip && {
      tooltip: {
        trigger: 'item',
        formatter: (params: unknown) => {
          const p = params as { value: number[] }
          return `${xName ?? 'X'}: ${p.value[0]}<br/>${yName ?? 'Y'}: ${p.value[1]}`
        },
      },
    }),
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', name: xName, scale: true },
    yAxis: { type: 'value', name: yName, scale: true },
    series: [
      {
        type: 'scatter',
        data,
        symbolSize,
      },
    ],
  }

  return <BaseChart option={option} loading={loading} height={height} className={className} />
}
