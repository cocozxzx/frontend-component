import { useState, type CSSProperties, type ReactNode } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface DragListProps<T extends { id: string | number }> {
  items: T[]
  renderItem: (item: T, index: number, isDragging: boolean) => ReactNode
  onReorder: (items: T[]) => void
  direction?: 'vertical' | 'horizontal'
  handle?: boolean
  disabled?: boolean
  animationDuration?: number
  className?: string
  itemClassName?: string
}

interface SortableItemProps<T extends { id: string | number }> {
  item: T
  index: number
  renderItem: (item: T, index: number, isDragging: boolean) => ReactNode
  handle: boolean
  disabled: boolean
  animationDuration: number
  itemClassName?: string
}

// ─── Internal sortable item ─────────────────────────────────────────────────────

function SortableItem<T extends { id: string | number }>({
  item,
  index,
  renderItem,
  handle,
  disabled,
  animationDuration,
  itemClassName,
}: SortableItemProps<T>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled,
  })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? `transform ${animationDuration}ms ease`,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative select-none',
        isDragging && 'opacity-50 ring-2 ring-primary/30 rounded-md',
        !handle && 'cursor-grab active:cursor-grabbing',
        itemClassName,
      )}
      {...(handle ? attributes : { ...attributes, ...listeners })}
    >
      {handle && (
        <span
          {...listeners}
          className="absolute left-0 top-0 flex h-full w-7 cursor-grab items-center justify-center text-muted-foreground hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical size={16} />
        </span>
      )}
      <div className={cn(handle && 'pl-7')}>
        {renderItem(item, index, isDragging)}
      </div>
    </div>
  )
}

// ─── Public component ──────────────────────────────────────────────────────────

export function DragList<T extends { id: string | number }>({
  items,
  renderItem,
  onReorder,
  direction = 'vertical',
  handle = false,
  disabled = false,
  animationDuration = 200,
  className,
  itemClassName,
}: DragListProps<T>) {
  const [activeId, setActiveId] = useState<string | number | null>(null)
  const activeItem = items.find((item) => item.id === activeId) ?? null
  const activeIndex = activeItem ? items.indexOf(activeItem) : -1

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const strategy =
    direction === 'horizontal' ? horizontalListSortingStrategy : verticalListSortingStrategy

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string | number)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    onReorder(arrayMove(items, oldIndex, newIndex))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={strategy}>
        <div
          className={cn(
            direction === 'horizontal' ? 'flex flex-row gap-2' : 'flex flex-col gap-2',
            className,
          )}
        >
          {items.map((item, index) => (
            <SortableItem
              key={item.id}
              item={item}
              index={index}
              renderItem={renderItem}
              handle={handle}
              disabled={disabled}
              animationDuration={animationDuration}
              itemClassName={itemClassName}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={{ duration: animationDuration, easing: 'ease' }}>
        {activeItem && (
          <div
            className={cn(
              'rounded-md shadow-xl ring-2 ring-primary/50 bg-background cursor-grabbing',
              handle && 'pl-7',
              itemClassName,
            )}
          >
            {renderItem(activeItem, activeIndex, true)}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
