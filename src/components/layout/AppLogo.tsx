import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AppLogoProps {
  collapsed?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: { icon: 16, text: 'text-sm' },
  md: { icon: 20, text: 'text-base' },
  lg: { icon: 24, text: 'text-lg' },
}

export function AppLogo({ collapsed = false, size = 'md', className }: AppLogoProps) {
  const { icon, text } = sizeMap[size]
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Zap size={icon} className="shrink-0 text-primary" />
      {!collapsed && (
        <span className={cn('font-bold tracking-tight', text)}>
          Admin Scaffold
        </span>
      )}
    </div>
  )
}
