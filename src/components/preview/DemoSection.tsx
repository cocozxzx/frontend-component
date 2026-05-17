import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface DemoSectionProps {
  title: string
  children: ReactNode
  className?: string
}

export function DemoSection({ title, children, className }: DemoSectionProps) {
  return (
    <section className={cn('space-y-4', className)}>
      <div className="flex items-center gap-3">
        <div className="w-[3px] h-5 rounded-full bg-primary shrink-0" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}
