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
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface DragGridProps<T extends { id: string | number }> {
  items: T[]
  renderItem: (item: T, index: number, isDragging: boolean) => ReactNode
  onReorder: (items: T[]) => void
  columns?: number
  gap?: number
  disabled?: boolean
  className?: string
}

interface GridItemProps<T extends { id: string | number }> {
  item: T
  index: number
  renderItem: (item: T, index: number, isDragging: boolean) => ReactNode
  disabled: boolean
}

// ─── Internal sortable cell ─────────────────────────────────────────────────────

function GridItem<T extends { id: string | number }>({
  item,
  index,
  renderItem,
  disabled,
}: GridItemProps<T>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled,
  })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? 'transform 200ms ease',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'cursor-grab select-none active:cursor-grabbing',
        isDragging && 'opacity-50 ring-2 ring-primary/30 rounded-md',
      )}
      {...attributes}
      {...listeners}
    >
      {renderItem(item, index, isDragging)}
    </div>
  )
}

// ─── Public component ──────────────────────────────────────────────────────────

export function DragGrid<T extends { id: string | number }>({
  items,
  renderItem,
  onReorder,
  columns = 3,
  gap = 16,
  disabled = false,
  className,
}: DragGridProps<T>) {
  const [activeId, setActiveId] = useState<string | number | null>(null)
  const activeItem = items.find((item) => item.id === activeId) ?? null
  const activeIndex = activeItem ? items.indexOf(activeItem) : -1

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

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
      <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
        <div
          className={cn('grid', className)}
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: `${gap}px` }}
        >
          {items.map((item, index) => (
            <GridItem
              key={item.id}
              item={item}
              index={index}
              renderItem={renderItem}
              disabled={disabled}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeItem && (
          <div className="cursor-grabbing rounded-md shadow-xl ring-2 ring-primary/50 bg-background">
            {renderItem(activeItem, activeIndex, true)}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
