import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyProps {
  image?: ReactNode
  imageSize?: number
  title?: string
  description?: string
  action?: ReactNode
  className?: string
}

export function Empty({
  image,
  imageSize = 64,
  title = '暂无数据',
  description,
  action,
  className,
}: EmptyProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8', className)}>
      <div className="text-muted-foreground/40">
        {image ?? <Inbox size={imageSize} strokeWidth={1} />}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground/60">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
