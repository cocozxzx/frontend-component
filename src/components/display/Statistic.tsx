import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react'
import { CountUp } from 'countup.js'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface StatisticProps {
  title: ReactNode
  value: number | string
  prefix?: ReactNode
  suffix?: ReactNode
  precision?: number
  formatter?: (value: number | string) => ReactNode
  valueStyle?: CSSProperties
  loading?: boolean
  countUp?: boolean
  countUpDuration?: number
  trend?: 'up' | 'down'
  trendValue?: string
  className?: string
}

export function Statistic({
  title,
  value,
  prefix,
  suffix,
  precision = 0,
  formatter,
  valueStyle,
  loading = false,
  countUp: enableCountUp = true,
  countUpDuration = 2,
  trend,
  trendValue,
  className,
}: StatisticProps) {
  const valueRef = useRef<HTMLSpanElement>(null)
  const counterRef = useRef<CountUp | null>(null)
  const isNumber = typeof value === 'number'

  useEffect(() => {
    if (!enableCountUp || !isNumber || !valueRef.current) return

    if (counterRef.current) {
      counterRef.current.update(value as number)
    } else {
      const instance = new CountUp(valueRef.current, value as number, {
        duration: countUpDuration,
        decimalPlaces: precision,
        useEasing: true,
      })
      counterRef.current = instance
      if (!instance.error) instance.start()
    }
  }, [value, enableCountUp, isNumber, countUpDuration, precision])

  if (loading) {
    return (
      <div className={cn('space-y-2', className)}>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-32" />
      </div>
    )
  }

  const renderValue = () => {
    if (formatter) return formatter(value)
    if (!isNumber || !enableCountUp) {
      return (
        <span>
          {typeof value === 'number' ? value.toFixed(precision) : value}
        </span>
      )
    }
    return <span ref={valueRef}>0</span>
  }

  return (
    <div className={cn('space-y-1', className)}>
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="flex items-end gap-1.5">
        {prefix && <span className="mb-0.5 text-base text-muted-foreground">{prefix}</span>}
        <span className="text-3xl font-semibold tabular-nums" style={valueStyle}>
          {renderValue()}
        </span>
        {suffix && <span className="mb-0.5 text-base text-muted-foreground">{suffix}</span>}
      </div>
      {(trend || trendValue) && (
        <div className={cn('flex items-center gap-1 text-sm', trend === 'up' ? 'text-success' : 'text-destructive')}>
          {trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          {trendValue && <span>{trendValue}</span>}
        </div>
      )}
    </div>
  )
}
