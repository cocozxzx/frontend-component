import { useState, type ReactNode } from 'react'
import { Star } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const sizeMap = { sm: 16, md: 20, lg: 24 }

export interface RateProps {
  value?: number
  onChange?: (value: number) => void
  count?: number
  allowHalf?: boolean
  allowClear?: boolean
  disabled?: boolean
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  activeColor?: string
  inactiveColor?: string
  tooltips?: string[]
  className?: string
}

interface StarItemProps {
  index: number
  fill: number // 0 | 50 | 100
  iconSize: number
  activeColor: string
  inactiveColor: string
  interactive: boolean
  allowHalf: boolean
  tooltip?: string
  onMouseMove: (e: React.MouseEvent, i: number) => void
  onMouseLeave: () => void
  onClick: (e: React.MouseEvent, i: number) => void
}

function StarItem({
  index, fill, iconSize, activeColor, inactiveColor,
  interactive, allowHalf, tooltip,
  onMouseMove, onMouseLeave, onClick,
}: StarItemProps) {
  const star = (
    <div
      className={cn('relative cursor-pointer select-none', !interactive && 'cursor-default')}
      style={{ width: iconSize, height: iconSize }}
      onMouseMove={(e) => interactive && onMouseMove(e, index)}
      onMouseLeave={() => interactive && onMouseLeave()}
      onClick={(e) => interactive && onClick(e, index)}
    >
      {/* Inactive background star */}
      <Star
        size={iconSize}
        style={{ color: inactiveColor }}
        strokeWidth={1.5}
      />
      {/* Active overlay — clipped by fill% width */}
      {fill > 0 && (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fill}%` }}
        >
          <Star
            size={iconSize}
            style={{ color: activeColor }}
            fill={activeColor}
            strokeWidth={1.5}
          />
        </div>
      )}
    </div>
  )

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{star}</span>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    )
  }
  return star
}

export function Rate({
  value = 0,
  onChange,
  count = 5,
  allowHalf = false,
  allowClear = true,
  disabled = false,
  readonly = false,
  size = 'md',
  activeColor,
  inactiveColor = 'var(--color-muted-foreground)',
  tooltips,
  className,
}: RateProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const iconSize = sizeMap[size]
  const resolvedActiveColor = activeColor ?? 'hsl(var(--warning))'
  const interactive = !disabled && !readonly
  const displayValue = hoverValue ?? value

  const getFill = (index: number): 0 | 50 | 100 => {
    const starValue = index + 1
    if (displayValue >= starValue) return 100
    if (allowHalf && displayValue >= starValue - 0.5) return 50
    return 0
  }

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    const { left, width } = e.currentTarget.getBoundingClientRect()
    const isLeft = e.clientX - left < width / 2
    setHoverValue(isLeft && allowHalf ? index + 0.5 : index + 1)
  }

  const handleMouseLeave = () => setHoverValue(null)

  const handleClick = (e: React.MouseEvent, index: number) => {
    const { left, width } = e.currentTarget.getBoundingClientRect()
    const isLeft = e.clientX - left < width / 2
    let next = isLeft && allowHalf ? index + 0.5 : index + 1
    if (allowClear && next === value) next = 0
    onChange?.(next)
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          'inline-flex items-center gap-1',
          disabled && 'opacity-50',
          className,
        )}
      >
        {Array.from({ length: count }, (_, i) => (
          <StarItem
            key={i}
            index={i}
            fill={getFill(i)}
            iconSize={iconSize}
            activeColor={resolvedActiveColor}
            inactiveColor={inactiveColor}
            interactive={interactive}
            allowHalf={allowHalf}
            tooltip={tooltips?.[i]}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          />
        ))}
      </div>
    </TooltipProvider>
  )
}
