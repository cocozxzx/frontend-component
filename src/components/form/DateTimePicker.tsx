import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, X } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { LOCALE } from '@/lib/date'
import { TimePicker } from './TimePicker'

export interface DateTimePickerProps {
  value?: Date | string | null
  onChange?: (date: Date | null, dateStr: string) => void
  placeholder?: string
  format?: string
  disabled?: boolean
  disabledDate?: (date: Date) => boolean
  allowClear?: boolean
  className?: string
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = '请选择日期时间',
  format: fmtStr = 'yyyy-MM-dd HH:mm:ss',
  disabled = false,
  disabledDate,
  allowClear = true,
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const [timeStr, setTimeStr] = useState('00:00:00')

  const selected = useMemo(() => {
    if (!value) return undefined
    const d = value instanceof Date ? value : new Date(value)
    return isNaN(d.getTime()) ? undefined : d
  }, [value])

  const displayValue = selected ? format(selected, fmtStr) : undefined

  const buildDate = (base: Date | undefined, time: string): Date => {
    const d = base ? new Date(base) : new Date()
    const [h, m, s] = time.split(':').map(Number)
    d.setHours(h ?? 0, m ?? 0, s ?? 0, 0)
    return d
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    const combined = buildDate(date, timeStr)
    onChange?.(combined, format(combined, fmtStr))
  }

  const handleTimeChange = (time: string) => {
    setTimeStr(time)
    if (selected) {
      const combined = buildDate(selected, time)
      onChange?.(combined, format(combined, fmtStr))
    }
  }

  const handleConfirm = () => setOpen(false)

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(null, '')
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
          <span className={cn('flex-1', !displayValue && 'text-muted-foreground')}>
            {displayValue ?? placeholder}
          </span>
          {allowClear && selected && (
            <X size={13} className="shrink-0 text-muted-foreground/60 hover:text-muted-foreground" onClick={handleClear} />
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto p-0">
        <div className="flex">
          {/* Left: Calendar */}
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleDateSelect}
            disabled={disabledDate}
            locale={LOCALE}
            initialFocus
          />
          <Separator orientation="vertical" />
          {/* Right: TimePicker */}
          <div className="flex flex-col justify-between p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">选择时间</p>
            <TimePicker
              value={timeStr}
              onChange={handleTimeChange}
            />
            <Button size="sm" className="mt-3" onClick={handleConfirm}>确认</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
