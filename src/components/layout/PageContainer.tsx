import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  title?: string
  description?: string
  extra?: ReactNode
  children: ReactNode
  padding?: boolean
}

export function PageContainer({
  title,
  description,
  extra,
  children,
  padding = true,
}: PageContainerProps) {
  return (
    <div className="flex flex-col gap-4">
      {(title || extra) && (
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-6 py-4">
          <div>
            {title && <h1 className="text-xl font-semibold">{title}</h1>}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {extra && <div className="flex items-center gap-2">{extra}</div>}
        </div>
      )}
      <div className={cn(padding && 'rounded-lg border border-border bg-card p-6')}>
        {children}
      </div>
    </div>
  )
}
