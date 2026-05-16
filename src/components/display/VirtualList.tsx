import { useRef, useEffect, useCallback, type ReactNode } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Spin } from '@/components/ui/spin'
import { Empty } from '@/components/ui/empty'
import { cn } from '@/lib/utils'

export interface VirtualListProps<T> {
  data: T[]
  height: number
  itemHeight: number | ((index: number) => number)
  renderItem: (item: T, index: number) => ReactNode
  rowKey?: string | ((item: T) => string)
  overscan?: number
  onEndReached?: () => void
  endReachedThreshold?: number
  loading?: boolean
  emptyText?: string
  className?: string
}

function getKey<T>(item: T, rowKey: VirtualListProps<T>['rowKey'], index: number): string {
  if (!rowKey) return String(index)
  if (typeof rowKey === 'function') return rowKey(item)
  return String((item as Record<string, unknown>)[rowKey])
}

export function VirtualList<T,>({
  data,
  height,
  itemHeight,
  renderItem,
  rowKey,
  overscan = 5,
  onEndReached,
  endReachedThreshold = 100,
  loading = false,
  emptyText,
  className,
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null)
  const endReachedRef = useRef(false)

  const isDynamic = typeof itemHeight === 'function'

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: isDynamic ? itemHeight : () => itemHeight as number,
    overscan,
    measureElement: isDynamic
      ? (el) => el.getBoundingClientRect().height
      : undefined,
  })

  // onEndReached with lock to prevent duplicate firing
  const handleScroll = useCallback(() => {
    const el = parentRef.current
    if (!el || !onEndReached) return
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    if (distanceToBottom <= endReachedThreshold) {
      if (!endReachedRef.current) {
        endReachedRef.current = true
        onEndReached()
      }
    } else {
      endReachedRef.current = false
    }
  }, [onEndReached, endReachedThreshold])

  useEffect(() => {
    const el = parentRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  if (data.length === 0 && !loading) {
    return <Empty title={emptyText} className={className} />
  }

  return (
    <div
      ref={parentRef}
      className={cn('overflow-auto', className)}
      style={{ height }}
    >
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((vItem) => (
          <div
            key={getKey(data[vItem.index], rowKey, vItem.index)}
            data-index={vItem.index}
            ref={isDynamic ? virtualizer.measureElement : undefined}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${vItem.start}px)`,
            }}
          >
            {renderItem(data[vItem.index], vItem.index)}
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex-center py-4">
          <Spin size="sm" spinning tip="加载中..." />
        </div>
      )}
    </div>
  )
}
