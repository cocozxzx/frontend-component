import {
  Children, isValidElement, type ReactNode, type CSSProperties,
} from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── TimelineItem ─────────────────────────────────────────────────────────────

export interface TimelineItemProps {
  label?: ReactNode
  dot?: ReactNode
  color?: 'primary' | 'success' | 'warning' | 'error' | string
  position?: 'left' | 'right'
  children?: ReactNode
  className?: string
}

const colorMap: Record<string, string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-destructive',
}

function getDotColor(color?: string): string {
  if (!color) return 'bg-primary'
  return colorMap[color] ?? ''
}

export function TimelineItem(_props: TimelineItemProps) {
  return null // Rendered by Timeline parent
}
TimelineItem.displayName = 'TimelineItem'

// ─── Timeline ─────────────────────────────────────────────────────────────────

export interface TimelineProps {
  mode?: 'left' | 'alternate' | 'right'
  pending?: ReactNode | boolean
  pendingDot?: ReactNode
  reverse?: boolean
  children: ReactNode
  className?: string
}

interface ParsedItem {
  props: TimelineItemProps
  index: number
}

export function Timeline({
  mode = 'left',
  pending,
  pendingDot,
  reverse = false,
  children,
  className,
}: TimelineProps) {
  const items: ParsedItem[] = []
  Children.forEach(children, (child, i) => {
    if (isValidElement(child) && (child.type as { displayName?: string }).displayName === 'TimelineItem') {
      items.push({ props: child.props as TimelineItemProps, index: i })
    }
  })

  if (reverse) items.reverse()

  const pendingItem: TimelineItemProps | null = pending
    ? {
        dot: pendingDot ?? <Loader2 size={14} className="animate-spin text-primary" />,
        children: typeof pending === 'boolean' ? null : pending,
      }
    : null

  const allItems = pendingItem ? [...items.map((i) => i.props), pendingItem] : items.map((i) => i.props)

  return (
    <div className={cn('relative', className)}>
      {allItems.map((item, i) => {
        const isLast = i === allItems.length - 1
        const isPending = pendingItem && i === allItems.length - 1

        // Alternate mode: even=right, odd=left
        const position =
          mode === 'alternate'
            ? i % 2 === 0 ? 'right' : 'left'
            : mode === 'right' ? 'left' : 'right'

        const dotEl = item.dot ?? (
          <span
            className={cn('block h-2.5 w-2.5 rounded-full border-2 border-background', getDotColor(item.color))}
            style={!colorMap[item.color ?? ''] ? { backgroundColor: item.color } : undefined}
          />
        )

        if (mode === 'alternate') {
          return (
            <div
              key={i}
              className="grid animate-fade-in gap-x-4"
              style={{ gridTemplateColumns: '1fr 20px 1fr', animationDelay: `${i * 60}ms` }}
            >
              {/* Left content */}
              <div className={cn('pb-6 text-right', position === 'right' ? 'text-muted-foreground text-sm' : '')}>
                {position === 'left' ? item.children : item.label}
              </div>

              {/* Dot + line */}
              <div className="flex flex-col items-center">
                <div className="flex-center h-5">{dotEl}</div>
                {(!isLast || isPending) && (
                  <div className={cn('flex-1 w-0.5 bg-border', isPending && 'border-l-2 border-dashed border-border bg-transparent')} />
                )}
              </div>

              {/* Right content */}
              <div className={cn('pb-6', position === 'left' ? 'text-muted-foreground text-sm' : '')}>
                {position === 'right' ? item.children : item.label}
              </div>
            </div>
          )
        }

        // Left / Right mode
        return (
          <div
            key={i}
            className={cn('relative flex gap-4 animate-fade-in pb-6', mode === 'right' && 'flex-row-reverse')}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Label */}
            {item.label && (
              <div className="w-24 shrink-0 text-right text-sm text-muted-foreground">
                {item.label}
              </div>
            )}

            {/* Dot + line */}
            <div className="flex flex-col items-center">
              <div className="flex-center h-5 w-5">{dotEl}</div>
              {(!isLast || isPending) && (
                <div className={cn('mt-1 w-0.5 flex-1 bg-border', isPending && 'border-l-2 border-dashed border-border bg-transparent')} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1">{item.children}</div>
          </div>
        )
      })}
    </div>
  )
}
