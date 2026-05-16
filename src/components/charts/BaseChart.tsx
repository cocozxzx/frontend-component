import {
  forwardRef, useImperativeHandle, useRef, useEffect,
  type CSSProperties,
} from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useAppStore } from '@/stores/useAppStore'
import { debounce } from '@/lib/utils'
import { getBaseOption } from './chartTheme'
import { cn } from '@/lib/utils'

export interface BaseChartRef {
  getChartInstance: () => ReturnType<ReactECharts['getEchartsInstance']> | null
}

export interface BaseChartProps {
  option: EChartsOption
  loading?: boolean
  height?: string | number
  width?: string | number
  onChartReady?: (chart: ReturnType<ReactECharts['getEchartsInstance']>) => void
  onEvents?: Record<string, (params: unknown) => void>
  renderer?: 'canvas' | 'svg'
  className?: string
  style?: CSSProperties
}

export const BaseChart = forwardRef<BaseChartRef, BaseChartProps>(
  (
    {
      option,
      loading = false,
      height = '300px',
      width = '100%',
      onChartReady,
      onEvents,
      renderer = 'canvas',
      className,
      style,
    },
    ref,
  ) => {
    const echartsRef = useRef<ReactECharts>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const { colorMode, primaryColor } = useAppStore()

    useImperativeHandle(ref, () => ({
      getChartInstance: () => echartsRef.current?.getEchartsInstance() ?? null,
    }))

    // ResizeObserver — debounced 50ms
    useEffect(() => {
      const el = containerRef.current
      if (!el) return
      const debouncedResize = debounce(() => {
        echartsRef.current?.getEchartsInstance()?.resize()
      }, 50)
      const observer = new ResizeObserver(debouncedResize)
      observer.observe(el)
      return () => observer.disconnect()
    }, [])

    // loading state
    useEffect(() => {
      const chart = echartsRef.current?.getEchartsInstance()
      if (!chart) return
      if (loading) {
        chart.showLoading({ text: '加载中...', maskColor: 'transparent', textColor: '#999', zlevel: 0 })
      } else {
        chart.hideLoading()
      }
    }, [loading])

    const base = getBaseOption(primaryColor, colorMode)

    // Merge base theme with user option (user option takes precedence)
    const mergedOption: EChartsOption = {
      color: base.color,
      backgroundColor: base.backgroundColor,
      textStyle: base.textStyle,
      legend: base.legend,
      tooltip: { ...base.tooltip, ...(option.tooltip as object) },
      ...option,
    }

    const h = typeof height === 'number' ? `${height}px` : height
    const w = typeof width === 'number' ? `${width}px` : width

    return (
      <div ref={containerRef} className={cn('relative', className)} style={{ width: w, ...style }}>
        <ReactECharts
          ref={echartsRef}
          option={mergedOption}
          style={{ height: h, width: '100%' }}
          onChartReady={onChartReady}
          onEvents={onEvents as Record<string, () => void>}
          opts={{ renderer }}
          notMerge
          lazyUpdate={false}
        />
      </div>
    )
  },
)
BaseChart.displayName = 'BaseChart'
