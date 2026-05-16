import type { ReactNode, CSSProperties } from 'react'
import { cn } from '@/lib/utils'

type BadgeStatus = 'success' | 'warning' | 'error' | 'processing' | 'default'

const statusColorMap: Record<BadgeStatus, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-destructive',
  processing: 'bg-primary',
  default: 'bg-muted-foreground',
}

export interface AppBadgeProps {
  count?: number
  overflowCount?: number
  dot?: boolean
  status?: BadgeStatus
  showZero?: boolean
  children?: ReactNode
  offset?: [number, number]
  className?: string
}

export function AppBadge({
  count,
  overflowCount = 99,
  dot = false,
  status,
  showZero = false,
  children,
  offset,
  className,
}: AppBadgeProps) {
  const hasCount = count !== undefined
  const shouldShow = dot || (hasCount && (showZero || count > 0))
  const displayCount = hasCount && count > overflowCount ? `${overflowCount}+` : count

  // Status dot mode (no children wrapping needed)
  if (status && !children) {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-sm', className)}>
        <span className="relative flex h-2 w-2">
          {status === 'processing' && (
            <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', statusColorMap.processing)} />
          )}
          <span className={cn('relative inline-flex h-2 w-2 rounded-full', statusColorMap[status])} />
        </span>
      </span>
    )
  }

  // With children: wrap in relative container
  if (children) {
    const offsetStyle: CSSProperties = offset
      ? { right: -offset[0], top: -offset[1] }
      : { right: '-6px', top: '-6px' }

    return (
      <span className={cn('relative inline-flex', className)}>
        {children}
        {shouldShow && (
          <span
            className={cn(
              'absolute z-10 flex min-w-4 items-center justify-center rounded-full',
              dot ? 'h-2 w-2' : 'h-4 px-1 text-[10px] font-medium text-white',
              'bg-destructive',
            )}
            style={offsetStyle}
          >
            {!dot && displayCount}
            {status === 'processing' && !dot && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
            )}
          </span>
        )}
      </span>
    )
  }

  // Standalone (no children)
  if (status) {
    return (
      <span className={cn('relative flex h-2 w-2', className)}>
        {status === 'processing' && (
          <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', statusColorMap.processing)} />
        )}
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', statusColorMap[status])} />
      </span>
    )
  }

  if (!shouldShow) return null

  return (
    <span
      className={cn(
        'inline-flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-white',
        dot && 'h-2 w-2 p-0',
        className,
      )}
    >
      {!dot && displayCount}
    </span>
  )
}
