import {
  useState,
  useRef,
  useMemo,
  useEffect,
  type KeyboardEvent,
  type ClipboardEvent,
  type CSSProperties,
} from 'react'
import { X } from 'lucide-react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface TagsInputProps {
  value?: string[]
  onChange?: (tags: string[]) => void
  placeholder?: string
  maxCount?: number
  maxTagLength?: number
  allowDuplicate?: boolean
  separator?: string | string[]
  validator?: (tag: string) => boolean | string
  suggestions?: string[]
  disabled?: boolean
  readOnly?: boolean
  draggable?: boolean
  className?: string
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const KEY_NAMES = new Set(['Enter', 'Tab', 'Space', 'Backspace', 'Escape', 'ArrowUp', 'ArrowDown'])

function getSeparatorChars(separator: string | string[]): string[] {
  const seps = Array.isArray(separator) ? separator : [separator]
  return seps.filter((s) => !KEY_NAMES.has(s))
}

function isSeparatorKey(key: string, separator: string | string[]): boolean {
  const seps = Array.isArray(separator) ? separator : [separator]
  return seps.includes(key)
}

function splitBySeparators(text: string, chars: string[]): string[] {
  if (!chars.length) return text.split(/\n/)
  const escaped = chars.map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  return text.split(new RegExp(`[${escaped.join('')}\n\r]`))
}

// ─── Sortable Tag ─────────────────────────────────────────────────────────────

function SortableTag({
  id,
  tag,
  disabled,
  readOnly,
  onRemove,
}: {
  id: string
  tag: string
  disabled: boolean
  readOnly: boolean
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  }

  return (
    <span
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs leading-5 select-none"
    >
      {tag}
      {!disabled && !readOnly && (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className="rounded hover:text-destructive"
        >
          <X size={10} />
        </button>
      )}
    </span>
  )
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function TagsInput({
  value,
  onChange,
  placeholder = '输入后按 Enter 添加',
  maxCount,
  maxTagLength,
  allowDuplicate = false,
  separator = ['Enter', ','],
  validator,
  suggestions = [],
  disabled = false,
  readOnly = false,
  draggable = false,
  className,
}: TagsInputProps) {
  const tags = value ?? []
  const [inputValue, setInputValue] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [shaking, setShaking] = useState(false)
  const [suggOpen, setSuggOpen] = useState(false)
  const [suggFocus, setSuggFocus] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const separatorChars = useMemo(() => getSeparatorChars(separator), [separator])

  // Unique IDs for dnd-kit (index-based to handle duplicates)
  const tagIds = useMemo(() => tags.map((tag, i) => `${i}__${tag}`), [tags])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  )

  const filteredSuggestions = useMemo(() => {
    if (!inputValue.trim() || !suggestions.length) return []
    const lower = inputValue.toLowerCase()
    return suggestions.filter((s) => s.toLowerCase().includes(lower) && !tags.includes(s))
  }, [inputValue, suggestions, tags])

  useEffect(() => {
    setSuggOpen(filteredSuggestions.length > 0)
    setSuggFocus(0)
  }, [filteredSuggestions])

  function showError(msg: string) {
    setErrorMsg(msg)
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current)
    errorTimerRef.current = setTimeout(() => setErrorMsg(''), 2000)
  }

  function triggerShake() {
    setShaking(true)
    setTimeout(() => setShaking(false), 400)
  }

  function tryAddTag(raw: string): boolean {
    const tag = raw.trim()
    if (!tag) return false
    if (maxTagLength && tag.length > maxTagLength) { showError(`标签最多 ${maxTagLength} 个字符`); return false }
    if (!allowDuplicate && tags.includes(tag)) { triggerShake(); return false }
    if (maxCount !== undefined && tags.length >= maxCount) { showError(`最多添加 ${maxCount} 个标签`); return false }
    if (validator) {
      const result = validator(tag)
      if (typeof result === 'string') { showError(result); return false }
      if (!result) { showError('标签格式不正确'); return false }
    }
    onChange?.([...tags, tag])
    return true
  }

  function removeTag(index: number) {
    if (disabled || readOnly) return
    const next = [...tags]
    next.splice(index, 1)
    onChange?.(next)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (suggOpen && filteredSuggestions.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSuggFocus((i) => Math.min(i + 1, filteredSuggestions.length - 1)); return }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSuggFocus((i) => Math.max(i - 1, 0)); return }
      if (e.key === 'Enter') { e.preventDefault(); if (tryAddTag(filteredSuggestions[suggFocus])) setInputValue(''); setSuggOpen(false); return }
      if (e.key === 'Escape') { setSuggOpen(false); return }
    }
    if (isSeparatorKey(e.key, separator)) {
      if (e.key !== 'Tab') e.preventDefault()
      if (tryAddTag(inputValue)) setInputValue('')
      return
    }
    if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) removeTag(tags.length - 1)
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text')
    if (!separatorChars.length) return
    const hasSep = separatorChars.some((c) => text.includes(c)) || text.includes('\n') || text.includes('\r')
    if (!hasSep) return
    e.preventDefault()
    const parts = splitBySeparators(text, separatorChars)
    const added: string[] = []
    for (const part of parts) { if (tryAddTag(part)) added.push(part.trim()) }
    if (added.length) setInputValue('')
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return
    const oldIndex = tagIds.indexOf(String(active.id))
    const newIndex = tagIds.indexOf(String(over.id))
    if (oldIndex !== -1 && newIndex !== -1) onChange?.(arrayMove(tags, oldIndex, newIndex))
  }

  const tagList = draggable ? (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tagIds} strategy={horizontalListSortingStrategy}>
        {tags.map((tag, i) => (
          <SortableTag
            key={tagIds[i]}
            id={tagIds[i]}
            tag={tag}
            disabled={disabled}
            readOnly={readOnly}
            onRemove={() => removeTag(i)}
          />
        ))}
      </SortableContext>
    </DndContext>
  ) : (
    <>
      {tags.map((tag, i) => (
        <span key={i} className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs leading-5">
          {tag}
          {!disabled && !readOnly && (
            <button type="button" onClick={(e) => { e.stopPropagation(); removeTag(i) }} className="rounded hover:text-destructive">
              <X size={10} />
            </button>
          )}
        </span>
      ))}
    </>
  )

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'flex min-h-9 w-full flex-wrap gap-1.5 rounded-md border border-input bg-background px-3 py-1.5',
          'transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0',
          errorMsg && 'border-destructive focus-within:ring-destructive/30',
          (disabled || readOnly) && 'cursor-not-allowed opacity-50',
          shaking && 'animate-shake',
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {tagList}

        {!disabled && !readOnly && (maxCount === undefined || tags.length < maxCount) && (
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onFocus={() => setSuggOpen(filteredSuggestions.length > 0)}
            onBlur={() => setTimeout(() => setSuggOpen(false), 150)}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="min-w-[120px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            style={{ width: `${Math.max(120, inputValue.length * 8 + 20)}px` }}
          />
        )}
      </div>

      {suggOpen && filteredSuggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-md border bg-popover shadow-md">
          {filteredSuggestions.map((s, i) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); if (tryAddTag(s)) setInputValue(''); setSuggOpen(false) }}
              className={cn('flex w-full px-3 py-2 text-sm hover:bg-muted text-left', i === suggFocus && 'bg-muted')}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {errorMsg && <p className="mt-1 text-xs text-destructive">{errorMsg}</p>}
    </div>
  )
}
