import { Children, isValidElement, type ReactNode, type CSSProperties } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

// ─── DescriptionsItem ─────────────────────────────────────────────────────────

export interface DescriptionsItemProps {
  label: ReactNode
  span?: number
  labelStyle?: CSSProperties
  contentStyle?: CSSProperties
  children: ReactNode
}

export function DescriptionsItem(_props: DescriptionsItemProps) {
  return null // Rendered by Descriptions parent
}
DescriptionsItem.displayName = 'DescriptionsItem'

// ─── Descriptions ─────────────────────────────────────────────────────────────

type ResponsiveColumn = { xs?: number; sm?: number; md?: number; lg?: number }

export interface DescriptionsProps {
  title?: ReactNode
  extra?: ReactNode
  bordered?: boolean
  column?: number | ResponsiveColumn
  size?: 'sm' | 'md' | 'lg'
  layout?: 'horizontal' | 'vertical'
  colon?: boolean
  labelStyle?: CSSProperties
  contentStyle?: CSSProperties
  children: ReactNode
  className?: string
}

const sizeGap = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6' }
const sizePad = { sm: 'px-2 py-1', md: 'px-4 py-2', lg: 'px-4 py-3' }

export function Descriptions({
  title,
  extra,
  bordered = false,
  column = 3,
  size = 'md',
  layout = 'horizontal',
  colon = true,
  labelStyle,
  contentStyle,
  children,
  className,
}: DescriptionsProps) {
  const isMd = useMediaQuery('(min-width: 768px)')
  const isLg = useMediaQuery('(min-width: 1024px)')

  const cols = typeof column === 'number'
    ? column
    : isLg ? (column.lg ?? column.md ?? column.sm ?? column.xs ?? 3)
    : isMd ? (column.md ?? column.sm ?? column.xs ?? 2)
    : (column.sm ?? column.xs ?? 1)

  // Parse children into item configs
  const items: DescriptionsItemProps[] = []
  Children.forEach(children, (child) => {
    if (
      isValidElement(child) &&
      (child.type as { displayName?: string }).displayName === 'DescriptionsItem'
    ) {
      items.push(child.props as DescriptionsItemProps)
    }
  })

  // Build rows considering span
  const rows: DescriptionsItemProps[][] = []
  let currentRow: DescriptionsItemProps[] = []
  let currentCols = 0

  for (const item of items) {
    const span = Math.min(item.span ?? 1, cols)
    if (currentCols + span > cols) {
      rows.push(currentRow)
      currentRow = []
      currentCols = 0
    }
    currentRow.push({ ...item, span })
    currentCols += span
  }
  if (currentRow.length) rows.push(currentRow)

  const renderCell = (item: DescriptionsItemProps, isLastInRow: boolean) => {
    const spanStyle = { gridColumn: `span ${item.span ?? 1}` }
    const labelText = (
      <span
        className={cn(
          'text-sm',
          bordered ? 'font-medium text-foreground' : 'text-muted-foreground',
        )}
        style={labelStyle ?? item.labelStyle}
      >
        {item.label}{colon && layout === 'horizontal' && '：'}
      </span>
    )
    const contentEl = (
      <span className="text-sm text-foreground" style={contentStyle ?? item.contentStyle}>
        {item.children}
      </span>
    )

    if (bordered) {
      return (
        <div key={String(item.label)} style={spanStyle} className="flex">
          <div className={cn('bg-muted/50 border-r border-border shrink-0 flex items-center', sizePad[size])}>
            {labelText}
          </div>
          <div className={cn('flex-1 flex items-center', sizePad[size])}>
            {contentEl}
          </div>
        </div>
      )
    }

    if (layout === 'vertical') {
      return (
        <div key={String(item.label)} style={spanStyle} className="flex flex-col gap-1">
          {labelText}
          {contentEl}
        </div>
      )
    }

    return (
      <div key={String(item.label)} style={spanStyle} className="flex items-center gap-2">
        {labelText}
        {contentEl}
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      {(title || extra) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="font-semibold">{title}</h3>}
          {extra && <div>{extra}</div>}
        </div>
      )}

      <div
        className={cn(
          bordered && 'rounded-md border border-border overflow-hidden',
          !bordered && sizeGap[size],
          'space-y-0',
        )}
      >
        {rows.map((row, ri) => (
          <div
            key={ri}
            className={cn(
              'grid',
              bordered && ri > 0 && 'border-t border-border',
              !bordered && sizeGap[size],
            )}
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
          >
            {row.map((item, ci) => renderCell(item, ci === row.length - 1))}
          </div>
        ))}
      </div>
    </div>
  )
}
