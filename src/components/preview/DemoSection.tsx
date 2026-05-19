import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface DemoSectionProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function DemoSection({ title, description, children, className }: DemoSectionProps) {
  return (
    <section className={cn('space-y-3', className)}>
      <div className="flex items-start gap-3">
        <span
          className="mt-[3px] inline-flex h-[18px] w-[3px] shrink-0 rounded-full"
          style={{
            background: 'linear-gradient(180deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.25) 100%)',
          }}
        />
        <div>
          <h2 className="text-[14px] font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="mt-0.5 text-[12.5px] text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-3 pl-[15px]">{children}</div>
    </section>
  )
}
