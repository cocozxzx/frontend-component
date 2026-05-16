import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Separator } from './separator'

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  children?: ReactNode
  className?: string
}

export function Divider({ orientation = 'horizontal', children, className }: DividerProps) {
  if (orientation === 'vertical') {
    return <Separator orientation="vertical" className={className} />
  }

  if (!children) {
    return <Separator className={className} />
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Separator className="flex-1" />
      <span className="shrink-0 text-sm text-muted-foreground">{children}</span>
      <Separator className="flex-1" />
    </div>
  )
}
