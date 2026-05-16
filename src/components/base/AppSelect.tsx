import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Check, ChevronsUpDown, X, Search } from 'lucide-react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { cn } from '@/lib/utils'
import { debounce } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Spin } from '@/components/ui/spin'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface AppSelectProps {
  /** 选项列表 */
  options?: SelectOption[]
  value?: string | number
  onChange?: (value: string | number) => void
  placeholder?: string
  disabled?: boolean
  /** 显示加载状态 */
  loading?: boolean
  /** 启用本地搜索过滤 */
  allowSearch?: boolean
  /** 远程搜索模式（与 onSearch 配合） */
  remote?: boolean
  /** 远程搜索函数 */
  onSearch?: (keyword: string) => Promise<SelectOption[]>
  /** 远程搜索防抖时间(ms) */
  debounceTime?: number
  /** 强制开启虚拟滚动 */
  virtual?: boolean
  emptyText?: string
  className?: string
  style?: React.CSSProperties
}

const VIRTUAL_THRESHOLD = 100
const ITEM_HEIGHT = 36

export function AppSelect({
  options = [],
  value,
  onChange,
  placeholder = '请选择',
  disabled = false,
  loading = false,
  allowSearch = false,
  remote = false,
  onSearch,
  debounceTime = 300,
  virtual = false,
  emptyText = '暂无数据',
  className,
  style,
}: AppSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [remoteOptions, setRemoteOptions] = useState<SelectOption[]>([])
  const [remoteLoading, setRemoteLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((o) => o.value === value)
    ?? remoteOptions.find((o) => o.value === value)

  // Debounced remote search
  const doRemoteSearch = useMemo(
    () =>
      debounce(async (keyword: string) => {
        if (!onSearch) return
        setRemoteLoading(true)
        try {
          const result = await onSearch(keyword)
          setRemoteOptions(result)
        } finally {
          setRemoteLoading(false)
        }
      }, debounceTime),
    [onSearch, debounceTime],
  )

  useEffect(() => {
    if (remote && open) {
      doRemoteSearch(search)
    }
  }, [search, remote, open, doRemoteSearch])

  // Fetch initial remote options when opening
  useEffect(() => {
    if (remote && open && remoteOptions.length === 0) {
      doRemoteSearch('')
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const baseOptions = remote ? remoteOptions : options

  const filtered = useMemo(() => {
    if (remote || !allowSearch || !search) return baseOptions
    const lower = search.toLowerCase()
    return baseOptions.filter((o) => o.label.toLowerCase().includes(lower))
  }, [baseOptions, allowSearch, remote, search])

  const useVirtual = virtual || filtered.length >= VIRTUAL_THRESHOLD

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5,
    enabled: useVirtual,
  })

  const handleSelect = useCallback(
    (option: SelectOption) => {
      if (option.disabled) return
      onChange?.(option.value)
      setOpen(false)
      setSearch('')
    },
    [onChange],
  )

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.('' as string)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || loading}
          style={style}
          className={cn(
            'h-9 w-full justify-between font-normal',
            !selectedOption && 'text-muted-foreground',
            className,
          )}
        >
          <span className="flex-1 truncate text-left">
            {loading ? (
              <span className="flex items-center gap-1.5">
                <Spin size="sm" spinning />
                加载中...
              </span>
            ) : (
              selectedOption?.label ?? placeholder
            )}
          </span>
          <div className="ml-1 flex shrink-0 items-center gap-1">
            {selectedOption && (
              <X size={13} className="opacity-50 hover:opacity-100" onClick={handleClear} />
            )}
            <ChevronsUpDown size={13} className="opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="flex flex-col">
          {/* Search input */}
          {(allowSearch || remote) && (
            <div className="flex items-center border-b border-border px-2 py-1.5">
              <Search size={13} className="mr-1.5 shrink-0 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索..."
                className="h-6 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
          )}

          {/* Options list */}
          {remoteLoading ? (
            <div className="flex-center py-6">
              <Spin size="sm" spinning tip="搜索中..." />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{emptyText}</p>
          ) : useVirtual ? (
            /* Virtual list */
            <div ref={listRef} className="max-h-[300px] overflow-y-auto">
              <div
                style={{ height: virtualizer.getTotalSize() }}
                className="relative"
              >
                {virtualizer.getVirtualItems().map((vItem) => {
                  const option = filtered[vItem.index]
                  const isSelected = option.value === value
                  return (
                    <div
                      key={vItem.key}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${vItem.size}px`,
                        transform: `translateY(${vItem.start}px)`,
                      }}
                    >
                      <OptionItem
                        option={option}
                        selected={isSelected}
                        onSelect={handleSelect}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            /* Standard list */
            <div className="max-h-[300px] overflow-y-auto py-1">
              {filtered.map((option) => (
                <OptionItem
                  key={option.value}
                  option={option}
                  selected={option.value === value}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function OptionItem({
  option,
  selected,
  onSelect,
}: {
  option: SelectOption
  selected: boolean
  onSelect: (option: SelectOption) => void
}) {
  return (
    <button
      type="button"
      disabled={option.disabled}
      onClick={() => onSelect(option)}
      className={cn(
        'flex w-full items-center px-3 py-2 text-sm transition-colors',
        'hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50',
        selected && 'bg-primary/5 text-primary font-medium',
      )}
    >
      <Check
        size={13}
        className={cn('mr-2 shrink-0', selected ? 'opacity-100' : 'opacity-0')}
      />
      <span className="flex-1 truncate text-left">{option.label}</span>
    </button>
  )
}
