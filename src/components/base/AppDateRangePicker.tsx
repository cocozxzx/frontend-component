import { useState, useMemo } from 'react'
import {
  format, subDays, startOfMonth, endOfMonth,
  subMonths, startOfYear, endOfYear,
} from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { CalendarIcon, X, ArrowRight } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LOCALE } from '@/lib/date'

export interface RangeShortcut {
  label: string
  range: [Date, Date] | (() => [Date, Date])
}

const DEFAULT_RANGE_SHORTCUTS: RangeShortcut[] = [
  { label: '最近 7 天', range: () => [subDays(new Date(), 6), new Date()] },
  { label: '最近 30 天', range: () => [subDays(new Date(), 29), new Date()] },
  { label: '最近 90 天', range: () => [subDays(new Date(), 89), new Date()] },
  { label: '本月', range: () => [startOfMonth(new Date()), endOfMonth(new Date())] },
  { label: '上月', range: () => [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))] },
  { label: '今年', range: () => [startOfYear(new Date()), endOfYear(new Date())] },
]

export interface AppDateRangePickerProps {
  value?: [Date | null, Date | null]
  onChange?: (dates: [Date | null, Date | null], dateStrs: [string, string]) => void
  placeholder?: [string, string]
  format?: string
  disabled?: boolean
  disabledDate?: (date: Date) => boolean
  shortcuts?: RangeShortcut[]
  allowClear?: boolean
  className?: string
}

export function AppDateRangePicker({
  value,
  onChange,
  placeholder = ['开始日期', '结束日期'],
  format: fmtStr = 'yyyy-MM-dd',
  disabled = false,
  disabledDate,
  shortcuts = DEFAULT_RANGE_SHORTCUTS,
  allowClear = true,
  className,
}: AppDateRangePickerProps) {
  const [open, setOpen] = useState(false)

  const selected = useMemo((): DateRange | undefined => {
    if (!value) return undefined
    const [from, to] = value
    if (!from && !to) return undefined
    return { from: from ?? undefined, to: to ?? undefined }
  }, [value])

  const emit = (range: DateRange | undefined) => {
    const from = range?.from ?? null
    const to = range?.to ?? null
    onChange?.(
      [from, to],
      [
        from ? format(from, fmtStr) : '',
        to ? format(to, fmtStr) : '',
      ],
    )
    if (range?.from && range?.to) setOpen(false)
  }

  const handleShortcut = (sc: RangeShortcut) => {
    const [from, to] = typeof sc.range === 'function' ? sc.range() : sc.range
    emit({ from, to })
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.([null, null], ['', ''])
  }

  const startStr = value?.[0] ? format(value[0], fmtStr) : null
  const endStr = value?.[1] ? format(value[1], fmtStr) : null
  const hasValue = !!(startStr || endStr)

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'flex h-9 cursor-pointer items-center gap-1.5 rounded-md border border-input bg-background px-3 text-sm transition-colors',
            'hover:bg-accent/10 focus-within:ring-1 focus-within:ring-ring',
            disabled && 'cursor-not-allowed opacity-50',
            className,
          )}
        >
          <CalendarIcon size={14} className="shrink-0 text-muted-foreground" />
          <span className={cn(!startStr && 'text-muted-foreground')}>{startStr ?? placeholder[0]}</span>
          <ArrowRight size={13} className="shrink-0 text-muted-foreground" />
          <span className={cn('flex-1', !endStr && 'text-muted-foreground')}>{endStr ?? placeholder[1]}</span>
          {allowClear && hasValue && (
            <X
              size={13}
              className="shrink-0 text-muted-foreground/60 hover:text-muted-foreground"
              onClick={handleClear}
            />
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto p-0">
        <div className="flex">
          {/* Shortcuts */}
          {shortcuts.length > 0 && (
            <div className="flex w-24 flex-col gap-0.5 border-r border-border p-2">
              {shortcuts.map((sc) => (
                <Button
                  key={sc.label}
                  variant="ghost"
                  size="sm"
                  className="h-7 justify-start px-2 text-xs"
                  onClick={() => handleShortcut(sc)}
                >
                  {sc.label}
                </Button>
              ))}
            </div>
          )}

          {/* Dual-month calendar */}
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={selected}
            onSelect={emit}
            disabled={disabledDate}
            locale={LOCALE}
            initialFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
