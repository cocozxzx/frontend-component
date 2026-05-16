import { useState, useRef, useEffect } from 'react'
import { Clock, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface DisabledTime {
  disabledHours?: number[]
  disabledMinutes?: number[]
  disabledSeconds?: number[]
}

export interface TimePickerProps {
  value?: string
  onChange?: (time: string) => void
  format?: string
  disabled?: boolean
  placeholder?: string
  hourStep?: number
  minuteStep?: number
  secondStep?: number
  disabledTime?: () => DisabledTime
  allowClear?: boolean
  use12Hours?: boolean
  className?: string
}

function parseTime(str?: string): [number, number, number] {
  if (!str) return [0, 0, 0]
  const parts = str.split(':').map(Number)
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0]
}

function pad(n: number) { return String(n).padStart(2, '0') }

function generateRange(max: number, step: number): number[] {
  const result: number[] = []
  for (let i = 0; i < max; i += step) result.push(i)
  return result
}

interface ColumnProps {
  items: number[]
  selected: number
  disabled: number[]
  onSelect: (v: number) => void
  label: string
}

function TimeColumn({ items, selected, disabled, onSelect, label }: ColumnProps) {
  const selectedRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [selected])

  return (
    <div className="flex flex-col items-center">
      <p className="mb-1 text-[10px] font-medium text-muted-foreground">{label}</p>
      <ScrollArea className="h-48 w-14">
        <div className="flex flex-col gap-0.5 py-1">
          {items.map((v) => {
            const isDisabled = disabled.includes(v)
            const isSelected = v === selected
            return (
              <button
                key={v}
                ref={isSelected ? selectedRef : undefined}
                type="button"
                disabled={isDisabled}
                onClick={() => onSelect(v)}
                className={cn(
                  'mx-1 rounded px-2 py-1 text-sm tabular-nums transition-colors',
                  isSelected && 'bg-primary text-primary-foreground font-medium',
                  !isSelected && !isDisabled && 'hover:bg-muted',
                  isDisabled && 'cursor-not-allowed text-muted-foreground/40',
                )}
              >
                {pad(v)}
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

export function TimePicker({
  value,
  onChange,
  format = 'HH:mm:ss',
  disabled = false,
  placeholder = '请选择时间',
  hourStep = 1,
  minuteStep = 1,
  secondStep = 1,
  disabledTime,
  allowClear = true,
  use12Hours = false,
  className,
}: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const [h, m, s] = parseTime(value)
  const showSeconds = format.includes('ss')
  const dis = disabledTime?.() ?? {}

  const hours = use12Hours ? generateRange(12, hourStep).map((v) => v || 12) : generateRange(24, hourStep)
  const minutes = generateRange(60, minuteStep)
  const seconds = generateRange(60, secondStep)

  const emit = (newH: number, newM: number, newS: number) => {
    const parts = [pad(newH), pad(newM)]
    if (showSeconds) parts.push(pad(newS))
    onChange?.(parts.join(':'))
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.('')
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
          <Clock size={14} className="shrink-0 text-muted-foreground" />
          <span className={cn('flex-1 tabular-nums', !value && 'text-muted-foreground')}>
            {value || placeholder}
          </span>
          {allowClear && value && (
            <X
              size={13}
              className="shrink-0 text-muted-foreground/60 hover:text-muted-foreground"
              onClick={handleClear}
            />
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto p-3">
        <div className="flex gap-2">
          <TimeColumn
            items={hours}
            selected={h}
            disabled={dis.disabledHours ?? []}
            onSelect={(v) => emit(v, m, s)}
            label="时"
          />
          <TimeColumn
            items={minutes}
            selected={m}
            disabled={dis.disabledMinutes ?? []}
            onSelect={(v) => emit(h, v, s)}
            label="分"
          />
          {showSeconds && (
            <TimeColumn
              items={seconds}
              selected={s}
              disabled={dis.disabledSeconds ?? []}
              onSelect={(v) => emit(h, m, v)}
              label="秒"
            />
          )}
        </div>
        <div className="mt-2 flex justify-end">
          <Button size="sm" onClick={() => setOpen(false)}>确定</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
