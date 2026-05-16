import { useState, useMemo } from 'react'
import { format, subDays, startOfWeek, subWeeks, startOfMonth, subMonths } from 'date-fns'
import { CalendarIcon, X, Clock } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { LOCALE } from '@/lib/date'

export interface DateShortcut {
  label: string
  date: Date | (() => Date)
}

const DEFAULT_SHORTCUTS: DateShortcut[] = [
  { label: '今天', date: () => new Date() },
  { label: '昨天', date: () => subDays(new Date(), 1) },
  { label: '本周', date: () => startOfWeek(new Date(), { weekStartsOn: 1 }) },
  { label: '上周', date: () => startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }) },
  { label: '本月', date: () => startOfMonth(new Date()) },
  { label: '上月', date: () => startOfMonth(subMonths(new Date(), 1)) },
]

export interface AppDatePickerProps {
  value?: Date | string | null
  onChange?: (date: Date | null, dateStr: string) => void
  placeholder?: string
  format?: string
  disabled?: boolean
  disabledDate?: (date: Date) => boolean
  showTime?: boolean
  shortcuts?: DateShortcut[]
  allowClear?: boolean
  className?: string
}

export function AppDatePicker({
  value,
  onChange,
  placeholder = '请选择日期',
  format: fmtStr = 'yyyy-MM-dd',
  disabled = false,
  disabledDate,
  showTime = false,
  shortcuts = DEFAULT_SHORTCUTS,
  allowClear = true,
  className,
}: AppDatePickerProps) {
  const [open, setOpen] = useState(false)
  const [timeH, setTimeH] = useState(0)
  const [timeM, setTimeM] = useState(0)
  const [timeS, setTimeS] = useState(0)

  const selected = useMemo(() => {
    if (!value) return undefined
    const d = value instanceof Date ? value : new Date(value)
    return isNaN(d.getTime()) ? undefined : d
  }, [value])

  const displayValue = selected
    ? format(selected, showTime ? `${fmtStr} HH:mm:ss` : fmtStr)
    : undefined

  const emit = (date: Date | null) => {
    if (!date) { onChange?.(null, ''); return }
    const d = new Date(date)
    if (showTime) { d.setHours(timeH, timeM, timeS) }
    onChange?.(d, format(d, showTime ? `${fmtStr} HH:mm:ss` : fmtStr))
  }

  const handleSelect = (date: Date | undefined) => {
    emit(date ?? null)
    if (!showTime) setOpen(false)
  }

  const handleShortcut = (sc: DateShortcut) => {
    const d = typeof sc.date === 'function' ? sc.date() : sc.date
    emit(d)
    if (!showTime) setOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    emit(null)
  }

  const applyTime = () => {
    if (selected) emit(selected)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'flex h-9 cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 text-sm transition-colors',
            'hover:bg-accent/10 focus-within:ring-1 focus-within:ring-ring',
            disabled && 'cursor-not-allowed opacity-50',
            className,
          )}
        >
          <CalendarIcon size={14} className="shrink-0 text-muted-foreground" />
          <span className={cn('flex-1 select-none', !displayValue && 'text-muted-foreground')}>
            {displayValue ?? placeholder}
          </span>
          {allowClear && selected && (
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
            <>
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
            </>
          )}
          <div>
            <Calendar
              mode="single"
              selected={selected}
              onSelect={handleSelect}
              disabled={disabledDate}
              locale={LOCALE}
              initialFocus
            />
            {showTime && (
              <>
                <Separator />
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-muted-foreground" />
                    {[
                      { label: '时', value: timeH, set: setTimeH, max: 23 },
                      { label: '分', value: timeM, set: setTimeM, max: 59 },
                      { label: '秒', value: timeS, set: setTimeS, max: 59 },
                    ].map(({ label, value: tv, set, max }, i) => (
                      <span key={label} className="flex items-center gap-0.5">
                        {i > 0 && <span className="text-muted-foreground">:</span>}
                        <input
                          type="number"
                          min={0}
                          max={max}
                          value={String(tv).padStart(2, '0')}
                          onChange={(e) => set(Math.min(max, Math.max(0, Number(e.target.value))))}
                          className="w-10 rounded border border-input bg-background text-center text-sm tabular-nums outline-none focus:ring-1 focus:ring-ring [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </span>
                    ))}
                  </div>
                  <Button size="sm" onClick={applyTime}>确定</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
