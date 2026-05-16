import { type ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Empty } from '@/components/ui/empty'
import { AppPagination } from '@/components/base/AppPagination'
import { VirtualList } from './VirtualList'
import { cn } from '@/lib/utils'

// ─── ListItem.Meta ────────────────────────────────────────────────────────────

interface MetaProps {
  avatar?: ReactNode
  title?: ReactNode
  description?: ReactNode
}

function Meta({ avatar, title, description }: MetaProps) {
  return (
    <div className="flex items-start gap-3">
      {avatar && <div className="shrink-0">{avatar}</div>}
      <div className="min-w-0">
        {title && <div className="font-medium">{title}</div>}
        {description && <div className="mt-0.5 text-sm text-muted-foreground">{description}</div>}
      </div>
    </div>
  )
}

// ─── ListItem ─────────────────────────────────────────────────────────────────

export interface ListItemProps {
  extra?: ReactNode
  actions?: ReactNode[]
  children: ReactNode
  className?: string
}

export function ListItem({ extra, actions, children, className }: ListItemProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 py-3 px-4', className)}>
      <div className="min-w-0 flex-1">
        {children}
        {actions && actions.length > 0 && (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            {actions.map((action, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span>·</span>}
                {action}
              </span>
            ))}
          </div>
        )}
      </div>
      {extra && <div className="shrink-0">{extra}</div>}
    </div>
  )
}

ListItem.Meta = Meta

// ─── List ────────────────────────────────────────────────────────────────────

interface PaginationConfig {
  page: number
  pageSize: number
  total: number
  onChange: (page: number) => void
}

export interface ListProps<T> {
  dataSource: T[]
  renderItem: (item: T, index: number) => ReactNode
  rowKey?: string | ((item: T) => string)
  loading?: boolean
  emptyText?: string
  bordered?: boolean
  divided?: boolean
  size?: 'sm' | 'md' | 'lg'
  pagination?: PaginationConfig
  loadMore?: ReactNode
  header?: ReactNode
  footer?: ReactNode
  virtual?: boolean
  height?: number
  itemHeight?: number
  className?: string
}

const sizeClass = { sm: 'py-1', md: 'py-2', lg: 'py-4' }

function getItemKey<T>(item: T, rowKey: ListProps<T>['rowKey'], index: number): string {
  if (!rowKey) return String(index)
  if (typeof rowKey === 'function') return rowKey(item)
  return String((item as Record<string, unknown>)[rowKey])
}

export function List<T,>({
  dataSource,
  renderItem,
  rowKey,
  loading = false,
  emptyText,
  bordered = false,
  divided = true,
  size = 'md',
  pagination,
  loadMore,
  header,
  footer,
  virtual = false,
  height,
  itemHeight = 56,
  className,
}: ListProps<T>) {
  const content = () => {
    if (loading) {
      return (
        <div className="space-y-3 p-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (dataSource.length === 0) {
      return <Empty title={emptyText} />
    }

    if (virtual && height) {
      return (
        <VirtualList
          data={dataSource}
          height={height}
          itemHeight={itemHeight}
          renderItem={renderItem}
          rowKey={rowKey}
        />
      )
    }

    return (
      <ul className={cn(divided && 'divide-y divide-border')}>
        {dataSource.map((item, i) => (
          <li key={getItemKey(item, rowKey, i)} className={sizeClass[size]}>
            {renderItem(item, i)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div
      className={cn(
        bordered && 'rounded-md border border-border',
        className,
      )}
    >
      {header && (
        <>
          <div className="px-4 py-3 font-medium">{header}</div>
          <Separator />
        </>
      )}

      {content()}

      {footer && (
        <>
          <Separator />
          <div className="px-4 py-3">{footer}</div>
        </>
      )}

      {loadMore && <div className="flex-center py-3">{loadMore}</div>}

      {pagination && (
        <div className="border-t border-border px-4 py-3">
          <AppPagination
            total={pagination.total}
            page={pagination.page}
            pageSize={pagination.pageSize}
            onPageChange={pagination.onChange}
            showTotal
            showQuickJump={false}
            showPageSize={false}
          />
        </div>
      )}
    </div>
  )
}
