import type { ReactNode } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type StepStatus = 'pending' | 'active' | 'finished' | 'error'

export interface StepItem {
  title: string
  description?: string
  icon?: ReactNode
}

interface StepperProps {
  steps: StepItem[]
  current: number
  onChange?: (step: number) => void
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

function getStatus(index: number, current: number): StepStatus {
  if (index < current) return 'finished'
  if (index === current) return 'active'
  return 'pending'
}

const statusStyles: Record<StepStatus, string> = {
  finished: 'bg-primary border-primary text-primary-foreground',
  active: 'border-primary bg-background text-primary ring-2 ring-primary/20',
  pending: 'border-border bg-background text-muted-foreground',
  error: 'border-destructive bg-destructive text-destructive-foreground',
}

export function Stepper({
  steps,
  current,
  onChange,
  orientation = 'horizontal',
  className,
}: StepperProps) {
  const isVertical = orientation === 'vertical'

  return (
    <div
      className={cn(
        'flex',
        isVertical ? 'flex-col gap-0' : 'items-start',
        className,
      )}
    >
      {steps.map((step, i) => {
        const status = getStatus(i, current)
        const isLast = i === steps.length - 1
        const clickable = !!onChange && status === 'finished'

        return (
          <div
            key={i}
            className={cn(
              'flex',
              isVertical ? 'flex-row gap-3' : 'flex-col items-center',
              !isVertical && !isLast && 'flex-1',
            )}
          >
            {/* Step node + connector row */}
            <div
              className={cn(
                'flex items-center',
                isVertical ? 'flex-col' : 'w-full',
              )}
            >
              {/* Circle */}
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onChange?.(i)}
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all',
                  statusStyles[status],
                  clickable && 'cursor-pointer hover:scale-105',
                  !clickable && 'cursor-default',
                )}
              >
                {step.icon ?? (
                  status === 'finished' ? (
                    <Check size={14} strokeWidth={3} />
                  ) : status === 'error' ? (
                    <X size={14} strokeWidth={3} />
                  ) : (
                    i + 1
                  )
                )}
              </button>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    'transition-colors',
                    isVertical
                      ? 'my-1 h-8 w-0.5 self-center'
                      : 'mx-2 h-0.5 flex-1',
                    i < current ? 'bg-primary' : 'bg-border',
                  )}
                />
              )}
            </div>

            {/* Label */}
            <div
              className={cn(
                isVertical ? 'pb-6' : 'mt-2 text-center',
              )}
            >
              <p
                className={cn(
                  'text-sm font-medium',
                  status === 'active' && 'text-primary',
                  status === 'pending' && 'text-muted-foreground',
                  status === 'error' && 'text-destructive',
                )}
              >
                {step.title}
              </p>
              {step.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
