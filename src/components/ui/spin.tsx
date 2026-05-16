import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SpinProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  tip?: string
  fullscreen?: boolean
  spinning?: boolean
  children?: ReactNode
}

const sizeMap = { sm: 16, md: 24, lg: 32, xl: 48 }

function SpinIcon({ size, tip, className }: { size: number; tip?: string; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <Loader2 size={size} className="animate-spin text-primary" />
      {tip && <span className="text-sm text-muted-foreground">{tip}</span>}
    </div>
  )
}

export function Spin({
  size = 'md',
  className,
  tip,
  fullscreen = false,
  spinning = true,
  children,
}: SpinProps) {
  const iconSize = sizeMap[size]

  if (fullscreen) {
    return spinning ? (
      <div className="fixed inset-0 z-50 flex-center bg-background/80 backdrop-blur-sm">
        <SpinIcon size={iconSize} tip={tip} />
      </div>
    ) : null
  }

  if (children) {
    return (
      <div className={cn('relative', className)}>
        <div className={cn('transition-opacity', spinning && 'pointer-events-none opacity-50')}>
          {children}
        </div>
        {spinning && (
          <div className="absolute-center">
            <SpinIcon size={iconSize} tip={tip} />
          </div>
        )}
      </div>
    )
  }

  if (!spinning) return null

  return <SpinIcon size={iconSize} tip={tip} className={className} />
}
