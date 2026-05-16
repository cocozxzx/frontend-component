import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export type StepStatus = 'wait' | 'process' | 'finish' | 'error'

export interface StepItem {
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  status?: StepStatus
}

export interface StepsProps {
  current: number
  items: StepItem[]
  direction?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md'
  labelPlacement?: 'horizontal' | 'vertical'
  onChange?: (current: number) => void
  className?: string
}

function getStatus(index: number, current: number, item: StepItem): StepStatus {
  if (item.status) return item.status
  if (index < current) return 'finish'
  if (index === current) return 'process'
  return 'wait'
}

const iconSize = { sm: 'h-6 w-6 text-xs', md: 'h-8 w-8 text-sm' }

const statusStyle: Record<StepStatus, string> = {
  finish: 'bg-primary text-primary-foreground',
  process: 'bg-primary text-primary-foreground ring-4 ring-primary/20',
  error: 'bg-destructive text-destructive-foreground',
  wait: 'bg-muted text-muted-foreground',
}

interface StepNodeProps {
  item: StepItem
  index: number
  status: StepStatus
  isLast: boolean
  current: number
  size: 'sm' | 'md'
  direction: 'horizontal' | 'vertical'
  labelPlacement: 'horizontal' | 'vertical'
  onClick?: () => void
}

function StepNode({ item, index, status, isLast, current, size, direction, labelPlacement, onClick }: StepNodeProps) {
  const isClickable = !!onClick && status !== 'process'
  const connectorActive = index < current

  const icon = item.icon ?? (
    <span>
      {status === 'finish' && <Check size={14} strokeWidth={3} />}
      {status === 'error' && <X size={14} strokeWidth={3} />}
      {(status === 'wait' || status === 'process') && <span>{index + 1}</span>}
    </span>
  )

  const circle = (
    <div
      onClick={isClickable ? onClick : undefined}
      className={cn(
        'relative flex shrink-0 items-center justify-center rounded-full font-semibold transition-all',
        iconSize[size],
        statusStyle[status],
        isClickable && 'cursor-pointer hover:opacity-80',
      )}
    >
      {icon}
    </div>
  )

  const label = (
    <div className={cn(direction === 'vertical' && 'flex-1')}>
      <p
        className={cn(
          'font-medium',
          size === 'sm' ? 'text-sm' : 'text-base',
          status === 'process' ? 'text-primary' : status === 'error' ? 'text-destructive' : status === 'finish' ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {item.title}
      </p>
      {item.description && (
        <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
      )}
    </div>
  )

  // Horizontal connector
  const hConnector = !isLast && (
    <div className="relative mx-2 flex-1">
      <div className="h-0.5 w-full bg-border" />
      <div
        className="absolute inset-y-0 left-0 h-0.5 bg-primary transition-all duration-500"
        style={{ width: connectorActive ? '100%' : '0%' }}
      />
    </div>
  )

  // Vertical connector
  const vConnector = !isLast && (
    <div className="relative ml-[14px] my-1 w-0.5 bg-border" style={{ minHeight: 24 }}>
      <div
        className="absolute inset-x-0 top-0 w-0.5 bg-primary transition-all duration-500"
        style={{ height: connectorActive ? '100%' : '0%' }}
      />
    </div>
  )

  if (direction === 'vertical') {
    return (
      <div className="flex flex-col">
        <div className="flex items-start gap-3">
          {circle}
          {label}
        </div>
        {vConnector}
      </div>
    )
  }

  // Horizontal + labelPlacement
  if (labelPlacement === 'vertical') {
    return (
      <>
        <div className="flex flex-col items-center gap-2">
          {circle}
          {label}
        </div>
        {hConnector}
      </>
    )
  }

  // Horizontal + label on right
  return (
    <>
      <div className="flex items-center gap-2">
        {circle}
        {label}
      </div>
      {hConnector}
    </>
  )
}

export function Steps({
  current,
  items,
  direction = 'horizontal',
  size = 'md',
  labelPlacement = 'vertical',
  onChange,
  className,
}: StepsProps) {
  return (
    <div
      className={cn(
        'flex',
        direction === 'vertical' ? 'flex-col' : 'flex-row items-start',
        className,
      )}
    >
      {items.map((item, i) => (
        <StepNode
          key={i}
          item={item}
          index={i}
          status={getStatus(i, current, item)}
          isLast={i === items.length - 1}
          current={current}
          size={size}
          direction={direction}
          labelPlacement={labelPlacement}
          onClick={onChange ? () => onChange(i) : undefined}
        />
      ))}
    </div>
  )
}
