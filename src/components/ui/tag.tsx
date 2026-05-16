import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const tagVariants = cva(
  'inline-flex items-center gap-1 rounded-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border border-primary/20 bg-primary/10 text-primary',
        success: 'border border-success/20 bg-success/10 text-success',
        warning: 'border border-warning/20 bg-warning/10 text-warning',
        destructive: 'border border-destructive/20 bg-destructive/10 text-destructive',
        info: 'border border-info/20 bg-info/10 text-info',
        outline: 'border border-border bg-transparent text-foreground',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-[11px]',
        md: 'px-2 py-1 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

interface TagProps extends VariantProps<typeof tagVariants> {
  children: ReactNode
  closable?: boolean
  onClose?: () => void
  className?: string
}

export function Tag({ children, variant, size, closable, onClose, className }: TagProps) {
  return (
    <span className={cn(tagVariants({ variant, size }), className)}>
      {children}
      {closable && (
        <button
          type="button"
          onClick={onClose}
          className="ml-0.5 rounded-sm opacity-60 hover:opacity-100 focus:outline-none"
          aria-label="关闭"
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      )}
    </span>
  )
}
