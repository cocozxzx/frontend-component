import { cn } from '@/lib/utils'

interface AppLogoProps {
  collapsed?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: { box: 'w-6 h-6 text-[10px]', text: 'text-sm' },
  md: { box: 'w-7 h-7 text-[11px]', text: 'text-[15px]' },
  lg: { box: 'w-8 h-8 text-xs', text: 'text-base' },
}

export function AppLogo({ collapsed = false, size = 'md', className }: AppLogoProps) {
  const { box, text } = sizeMap[size]
  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      {/* Icon mark */}
      <div
        className={cn(
          'shrink-0 rounded-lg flex items-center justify-center font-bold text-white',
          box,
        )}
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(227 85% 68%) 100%)',
          boxShadow: '0 2px 8px hsl(var(--primary) / 0.4)',
        }}
      >
        A
      </div>
      {!collapsed && (
        <span
          className={cn('font-semibold tracking-tight leading-none', text)}
          style={{ letterSpacing: '-0.01em' }}
        >
          Admin
          <span className="text-primary font-bold">Pro</span>
        </span>
      )}
    </div>
  )
}
