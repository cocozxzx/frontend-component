import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { CountUp } from 'countup.js'
import type { EChartsOption } from 'echarts'
import ReactECharts from 'echarts-for-react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/useAppStore'
import { getChartColors, getBaseOption } from './chartTheme'

export interface StatCardProps {
  title: string
  value: number | string
  prefix?: ReactNode
  suffix?: ReactNode
  precision?: number
  trend?: 'up' | 'down'
  trendValue?: string
  trendDesc?: string
  miniChart?: {
    type: 'line' | 'bar'
    data: number[]
  }
  icon?: ReactNode
  iconBg?: string
  loading?: boolean
  onClick?: () => void
  className?: string
}

export function StatCard({
  title,
  value,
  prefix,
  suffix,
  precision = 0,
  trend,
  trendValue,
  trendDesc,
  miniChart,
  icon,
  iconBg,
  loading = false,
  onClick,
  className,
}: StatCardProps) {
  const countRef = useRef<HTMLSpanElement>(null)
  const { primaryColor, colorMode } = useAppStore()

  useEffect(() => {
    if (typeof value !== 'number' || !countRef.current) return
    const countup = new CountUp(countRef.current, value, {
      duration: 1.5,
      decimalPlaces: precision,
      useEasing: true,
    })
    if (!countup.error) countup.start()
  }, [value, precision])

  const miniOption: EChartsOption | null = miniChart
    ? (() => {
        const base = getBaseOption(primaryColor, colorMode)
        const colors = getChartColors(primaryColor)
        const xData = miniChart.data.map((_, i) => i)
        return {
          color: colors,
          grid: { top: 4, right: 4, bottom: 4, left: 4 },
          xAxis: { type: 'category', data: xData, show: false, boundaryGap: miniChart.type === 'bar' },
          yAxis: { type: 'value', show: false, scale: true },
          tooltip: {
            trigger: 'axis',
            backgroundColor: base.tooltip.backgroundColor,
            borderColor: base.tooltip.borderColor,
            textStyle: base.tooltip.textStyle,
            extraCssText: base.tooltip.extraCssText,
            formatter: (params: unknown) => {
              const p = params as Array<{ value: number }>
              return `${p[0]?.value ?? ''}`
            },
          },
          series: [
            miniChart.type === 'bar'
              ? {
                  type: 'bar' as const,
                  data: miniChart.data,
                  barMaxWidth: 8,
                  itemStyle: { borderRadius: [2, 2, 0, 0] },
                }
              : {
                  type: 'line' as const,
                  data: miniChart.data,
                  smooth: true,
                  showSymbol: false,
                  areaStyle: { opacity: 0.25 },
                  lineStyle: { width: 2 },
                },
          ],
        }
      })()
    : null

  return (
    <div
      className={cn(
        'bg-card border rounded-xl p-4 flex gap-4 items-stretch',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className,
      )}
      onClick={onClick}
    >
      {icon && (
        <div
          className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white"
          style={{ backgroundColor: iconBg ?? primaryColor }}
        >
          {icon}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-muted-foreground text-sm truncate">{title}</p>
        <div className="mt-1 flex items-baseline gap-1 flex-wrap">
          {prefix && <span className="text-muted-foreground text-sm">{prefix}</span>}
          {typeof value === 'number' ? (
            <span ref={countRef} className="text-2xl font-bold tabular-nums">
              {value.toFixed(precision)}
            </span>
          ) : (
            <span className="text-2xl font-bold">{value}</span>
          )}
          {suffix && <span className="text-muted-foreground text-sm">{suffix}</span>}
        </div>
        {(trend || trendValue) && (
          <div className="mt-1 flex items-center gap-1 text-sm">
            {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
            {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
            {trendValue && (
              <span className={trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : ''}>
                {trendValue}
              </span>
            )}
            {trendDesc && <span className="text-muted-foreground">{trendDesc}</span>}
          </div>
        )}
      </div>

      {miniOption && !loading && (
        <div className="flex-shrink-0 w-24 self-stretch">
          <ReactECharts
            option={miniOption}
            style={{ height: '100%', width: '100%', minHeight: 60 }}
            opts={{ renderer: 'canvas' }}
            notMerge
          />
        </div>
      )}
    </div>
  )
}
