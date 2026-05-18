import { useState } from 'react'
import { Settings2, ArrowLeftToLine, ArrowRightToLine, PinOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { DragList } from '@/components/advanced/DragList'
import type { TableColumn } from '@/types/schema'

// ─── Types ─────────────────────────────────────────────────────────────────────

export type PinDirection = 'left' | 'right' | false

export interface ColumnSettingProps {
  columns: TableColumn[]
  visibleKeys: string[]
  pinning: Record<string, PinDirection>
  onVisibilityChange: (keys: string[]) => void
  onOrderChange: (columns: TableColumn[]) => void
  onPinChange: (key: string, direction: PinDirection) => void
  onReset: () => void
}

// ─── Drag item wrapper — adds `id` for DragList ─────────────────────────────────

type DragColumn = TableColumn & { id: string }

function toDragItems(columns: TableColumn[]): DragColumn[] {
  return columns.map((c) => ({ ...c, id: c.key }))
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ColumnSetting({
  columns,
  visibleKeys,
  pinning,
  onVisibilityChange,
  onOrderChange,
  onPinChange,
  onReset,
}: ColumnSettingProps) {
  const [open, setOpen] = useState(false)

  function handleReorder(items: DragColumn[]) {
    onOrderChange(items.map(({ id: _id, ...col }) => col as TableColumn))
  }

  function handleVisibility(key: string, checked: boolean) {
    if (checked) {
      onVisibilityChange([...visibleKeys, key])
    } else {
      onVisibilityChange(visibleKeys.filter((k) => k !== key))
    }
  }

  function handlePin(key: string, current: PinDirection, direction: 'left' | 'right') {
    onPinChange(key, current === direction ? false : direction)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" title="列配置">
          <Settings2 size={16} />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-64 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">列设置</span>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => { onReset(); setOpen(false) }}>
            重置
          </Button>
        </div>
        <Separator className="mb-2" />

        <DragList
          items={toDragItems(columns)}
          handle
          animationDuration={150}
          onReorder={handleReorder}
          renderItem={(col) => (
            <div className="flex items-center gap-1.5 py-1 text-sm">
              {/* Visibility */}
              <Checkbox
                checked={visibleKeys.includes(col.key)}
                onCheckedChange={(v) => handleVisibility(col.key, !!v)}
              />
              {/* Title */}
              <span className="flex-1 truncate">{col.title}</span>
              {/* Pin controls */}
              <button
                type="button"
                title="固定在左侧"
                onClick={() => handlePin(col.key, pinning[col.key] ?? false, 'left')}
                className={
                  pinning[col.key] === 'left'
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }
              >
                <ArrowLeftToLine size={13} />
              </button>
              <button
                type="button"
                title="固定在右侧"
                onClick={() => handlePin(col.key, pinning[col.key] ?? false, 'right')}
                className={
                  pinning[col.key] === 'right'
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }
              >
                <ArrowRightToLine size={13} />
              </button>
              {pinning[col.key] && (
                <button
                  type="button"
                  title="取消固定"
                  onClick={() => onPinChange(col.key, false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <PinOff size={13} />
                </button>
              )}
            </div>
          )}
        />
      </PopoverContent>
    </Popover>
  )
}
