import { useState, useCallback, type ReactNode } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NumberFieldProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  precision?: number
  disabled?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
  placeholder?: string
  className?: string
}

function toPrecision(num: number, precision?: number): number {
  if (precision === undefined) return num
  return parseFloat(num.toFixed(precision))
}

export function NumberField({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  precision,
  disabled = false,
  prefix,
  suffix,
  placeholder,
  className,
}: NumberFieldProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const current = isControlled ? controlledValue : internalValue

  const update = useCallback(
    (next: number) => {
      const clamped = Math.min(max, Math.max(min, toPrecision(next, precision)))
      if (!isControlled) setInternalValue(clamped)
      onChange?.(clamped)
    },
    [isControlled, min, max, precision, onChange],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    if (raw === '' || raw === '-') {
      if (!isControlled) setInternalValue(NaN)
      return
    }
    const num = parseFloat(raw)
    if (!isNaN(num)) update(num)
  }

  const handleBlur = () => {
    if (isNaN(current)) update(min === -Infinity ? 0 : min)
  }

  return (
    <div
      className={cn(
        'flex h-9 w-full items-center rounded-md border border-input bg-background text-sm ring-offset-background',
        'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      {/* Decrement */}
      <button
        type="button"
        disabled={disabled || current <= min}
        onClick={() => update(current - step)}
        className="flex h-full w-8 shrink-0 items-center justify-center border-r border-input text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
      >
        <Minus size={13} />
      </button>

      {/* Prefix */}
      {prefix && (
        <span className="pl-2 text-muted-foreground">{prefix}</span>
      )}

      {/* Input */}
      <input
        type="number"
        value={isNaN(current) ? '' : current}
        onChange={handleInputChange}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder}
        className="h-full min-w-0 flex-1 bg-transparent px-2 text-center tabular-nums outline-none disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      {/* Suffix */}
      {suffix && (
        <span className="pr-2 text-muted-foreground">{suffix}</span>
      )}

      {/* Increment */}
      <button
        type="button"
        disabled={disabled || current >= max}
        onClick={() => update(current + step)}
        className="flex h-full w-8 shrink-0 items-center justify-center border-l border-input text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
      >
        <Plus size={13} />
      </button>
    </div>
  )
}
