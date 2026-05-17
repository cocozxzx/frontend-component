import { ExternalLink } from 'lucide-react'
import { Tag } from '@/components/ui/tag'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface PageHeaderProps {
  title: string
  description: string
  tags?: string[]
  sourceUrl?: string
  className?: string
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function PageHeader({ title, description, tags, sourceUrl, className }: PageHeaderProps) {
  return (
    <div className={cn('space-y-4 mb-8', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">{description}</p>
        </div>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink size={14} />
            源码
          </a>
        )}
      </div>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag} variant="default" size="sm">
              {tag}
            </Tag>
          ))}
        </div>
      )}

      <Separator />
    </div>
  )
}
