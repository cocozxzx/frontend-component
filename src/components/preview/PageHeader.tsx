import { ExternalLink, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  title: string
  description: string
  tags?: string[]
  sourceUrl?: string
  className?: string
}

export function PageHeader({ title, description, tags, sourceUrl, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      {/* Title area */}
      <div className="mb-4 flex items-start justify-between gap-6">
        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-2">
            <h1
              className="text-[26px] font-bold leading-tight"
              style={{ letterSpacing: '-0.025em' }}
            >
              {title}
            </h1>
          </div>
          <p className="max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="group shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-card px-3 py-2 text-[12px] text-muted-foreground shadow-sm transition-all hover:border-primary/40 hover:text-primary hover:shadow-md"
          >
            <ExternalLink size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            源码
          </a>
        )}
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-lg border border-primary/15 bg-primary/5 px-2.5 py-1 text-[11.5px] font-medium text-primary/80"
            >
              <Hash size={10} className="opacity-60" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div
        className="h-px w-full"
        style={{
          background: 'linear-gradient(90deg, hsl(var(--primary) / 0.3) 0%, hsl(var(--border)) 30%, transparent 100%)',
        }}
      />
    </div>
  )
}
