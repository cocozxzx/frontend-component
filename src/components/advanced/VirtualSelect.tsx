import {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Check, ChevronsUpDown, X, Search } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Spin } from '@/components/ui/spin'
import { cn } from '@/lib/utils'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface OptionItem {
  label: string
  value: string | number
  disabled?: boolean
  group?: string
  [key: string]: unknown
}

type VirtualRow =
  | { type: 'header'; group: string; key: string }
  | { type: 'item'; option: OptionItem; optionIndex: number; key: string }

export interface VirtualSelectProps {
  options: OptionItem[]
  value?: string | number | Array<string | number>
  onChange?: (
    value: string | number | Array<string | number>,
    option: OptionItem | OptionItem[],
  ) => void
  multiple?: boolean
  searchable?: boolean
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  maxTagCount?: number
  clearable?: boolean
  groupBy?: string
  itemHeight?: number
  maxHeight?: number
  emptyText?: string
  className?: string
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function buildVirtualRows(options: OptionItem[], groupBy?: string): VirtualRow[] {
  if (!groupBy) {
    return options.map((option, i) => ({
      type: 'item' as const,
      option,
      optionIndex: i,
      key: String(option.value),
    }))
  }

  const rows: VirtualRow[] = []
  let lastGroup: unknown = Symbol('none') // guaranteed not equal to any real value

  for (let i = 0; i < options.length; i++) {
    const option = options[i]
    const group = option[groupBy]
    if (group !== lastGroup) {
      lastGroup = group
      if (typeof group === 'string' && group) {
        rows.push({ type: 'header', group, key: `header:${group}` })
      }
    }
    rows.push({ type: 'item', option, optionIndex: i, key: String(option.value) })
  }

  return rows
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function VirtualSelect({
  options,
  value,
  onChange,
  multiple = false,
  searchable = true,
  placeholder = '请选择',
  disabled = false,
  loading = false,
  maxTagCount = 3,
  clearable = true,
  groupBy,
  itemHeight = 36,
  maxHeight = 300,
  emptyText = '暂无数据',
  className,
}: VirtualSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const listRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // ── Derived selected state ────────────────────────────────────────────────

  const selectedValues = useMemo((): Array<string | number> => {
    if (!multiple) return []
    if (Array.isArray(value)) return value
    return value !== undefined && value !== '' ? [value as string | number] : []
  }, [multiple, value])

  const singleSelected = useMemo((): OptionItem | undefined => {
    if (multiple || Array.isArray(value)) return undefined
    return options.find((o) => o.value === value)
  }, [multiple, value, options])

  const hasValue = multiple ? selectedValues.length > 0 : singleSelected !== undefined

  // ── Filtered options + virtual rows ──────────────────────────────────────

  const filteredOptions = useMemo(() => {
    if (!search) return options
    const lower = search.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(lower))
  }, [options, search])

  const virtualRows = useMemo(
    () => buildVirtualRows(filteredOptions, groupBy),
    [filteredOptions, groupBy],
  )

  // Row index → option index mapping for keyboard nav
  const focusableRows = useMemo(
    () => virtualRows.filter((r): r is Extract<VirtualRow, { type: 'item' }> => r.type === 'item'),
    [virtualRows],
  )

  // ── Virtualizer ───────────────────────────────────────────────────────────

  const virtualizer = useVirtualizer({
    count: virtualRows.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => itemHeight,
    overscan: 5,
  })

  // Reset scroll + focus when search changes
  useEffect(() => {
    setFocusedIndex(0)
    listRef.current?.scrollTo({ top: 0 })
  }, [search])

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex < 0 || !open) return
    const row = focusableRows[focusedIndex]
    if (!row) return
    const rowIdx = virtualRows.indexOf(row)
    if (rowIdx >= 0) virtualizer.scrollToIndex(rowIdx, { align: 'auto' })
  }, [focusedIndex, open, focusableRows, virtualRows, virtualizer])

  // Focus search input when opened
  useEffect(() => {
    if (open) setTimeout(() => searchInputRef.current?.focus(), 50)
    else setSearch('')
  }, [open])

  // ── Event handlers ────────────────────────────────────────────────────────

  const handleSelect = useCallback(
    (option: OptionItem) => {
      if (option.disabled) return

      if (!multiple) {
        onChange?.(option.value, option)
        setOpen(false)
        return
      }

      const isSelected = selectedValues.includes(option.value)
      const newValues = isSelected
        ? selectedValues.filter((v) => v !== option.value)
        : [...selectedValues, option.value]
      const newOptions = newValues
        .map((v) => options.find((o) => o.value === v))
        .filter((o): o is OptionItem => !!o)
      onChange?.(newValues, newOptions)
    },
    [multiple, selectedValues, options, onChange],
  )

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(multiple ? [] : ('' as string), multiple ? [] : ({} as OptionItem))
  }

  const handleRemoveTag = (e: React.MouseEvent, tagValue: string | number) => {
    e.stopPropagation()
    const newValues = selectedValues.filter((v) => v !== tagValue)
    const newOptions = newValues
      .map((v) => options.find((o) => o.value === v))
      .filter((o): o is OptionItem => !!o)
    onChange?.(newValues, newOptions)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const maxIdx = focusableRows.length - 1
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex((prev) => Math.min(prev + 1, maxIdx))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex((prev) => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (focusedIndex >= 0 && focusableRows[focusedIndex]) {
          handleSelect(focusableRows[focusedIndex].option)
        }
        break
      case 'Backspace':
        if (!search && multiple && selectedValues.length) {
          const newValues = selectedValues.slice(0, -1)
          const newOptions = newValues
            .map((v) => options.find((o) => o.value === v))
            .filter((o): o is OptionItem => !!o)
          onChange?.(newValues, newOptions)
        }
        break
      case 'Escape':
        setOpen(false)
        break
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const isSelected = (optionValue: string | number) =>
    multiple ? selectedValues.includes(optionValue) : value === optionValue

  const visibleTags = selectedValues.slice(0, maxTagCount)
  const overflowCount = selectedValues.length - visibleTags.length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || loading}
          className={cn(
            'h-auto min-h-9 w-full justify-between font-normal',
            multiple && selectedValues.length > 0 ? 'px-2 py-1.5' : 'px-3',
            className,
          )}
        >
          {/* Trigger content */}
          {loading ? (
            <span className="flex flex-1 items-center gap-1.5 text-muted-foreground">
              <Spin size="sm" spinning /> 加载中...
            </span>
          ) : multiple ? (
            <div className="flex flex-1 min-w-0 flex-wrap gap-1">
              {visibleTags.map((v) => {
                const opt = options.find((o) => o.value === v)
                return (
                  <span
                    key={v}
                    className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 text-xs leading-none"
                  >
                    {opt?.label ?? v}
                    {!disabled && (
                      <button
                        type="button"
                        onMouseDown={(e) => handleRemoveTag(e, v)}
                        className="ml-0.5 rounded hover:text-destructive"
                      >
                        <X size={10} />
                      </button>
                    )}
                  </span>
                )
              })}
              {overflowCount > 0 && (
                <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-xs leading-none">
                  +{overflowCount}
                </span>
              )}
              {selectedValues.length === 0 && (
                <span className="text-sm text-muted-foreground">{placeholder}</span>
              )}
            </div>
          ) : (
            <span className={cn('flex-1 truncate text-left text-sm', !singleSelected && 'text-muted-foreground')}>
              {singleSelected?.label ?? placeholder}
            </span>
          )}

          {/* Right icons */}
          <div className="ml-1 flex shrink-0 items-center gap-1">
            {clearable && hasValue && !disabled && (
              <X
                size={13}
                className="opacity-50 hover:opacity-100"
                onMouseDown={handleClear}
              />
            )}
            <ChevronsUpDown size={13} className="opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col">
          {/* Search input */}
          {searchable && (
            <div className="flex items-center border-b px-2 py-1.5">
              <Search size={13} className="mr-1.5 shrink-0 text-muted-foreground" />
              <input
                ref={searchInputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="搜索..."
                className="h-6 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          )}

          {/* Virtual list */}
          {filteredOptions.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{emptyText}</p>
          ) : (
            <div
              ref={listRef}
              style={{ maxHeight: `${maxHeight}px` }}
              className="overflow-y-auto"
            >
              <div style={{ height: virtualizer.getTotalSize() }} className="relative">
                {virtualizer.getVirtualItems().map((vItem) => {
                  const row = virtualRows[vItem.index]
                  return (
                    <div
                      key={row.key}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${vItem.size}px`,
                        transform: `translateY(${vItem.start}px)`,
                      }}
                    >
                      {row.type === 'header' ? (
                        <div className="flex items-center px-3 text-xs font-medium text-muted-foreground bg-muted/50 h-full">
                          {row.group}
                        </div>
                      ) : (
                        <VirtualOptionItem
                          option={row.option}
                          selected={isSelected(row.option.value)}
                          focused={focusableRows.indexOf(row) === focusedIndex}
                          onSelect={handleSelect}
                          onMouseEnter={() => setFocusedIndex(focusableRows.indexOf(row))}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ─── Option item ───────────────────────────────────────────────────────────────

function VirtualOptionItem({
  option,
  selected,
  focused,
  onSelect,
  onMouseEnter,
}: {
  option: OptionItem
  selected: boolean
  focused: boolean
  onSelect: (option: OptionItem) => void
  onMouseEnter: () => void
}) {
  return (
    <button
      type="button"
      disabled={option.disabled}
      onClick={() => onSelect(option)}
      onMouseEnter={onMouseEnter}
      className={cn(
        'flex h-full w-full items-center px-3 text-sm transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        focused && !option.disabled && 'bg-muted',
        selected && 'text-primary font-medium',
      )}
    >
      <Check
        size={13}
        className={cn('mr-2 shrink-0 transition-opacity', selected ? 'opacity-100' : 'opacity-0')}
      />
      <span className="flex-1 truncate text-left">{option.label}</span>
    </button>
  )
}
