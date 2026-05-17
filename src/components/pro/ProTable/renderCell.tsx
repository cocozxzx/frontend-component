import { useState, type ReactNode } from 'react'
import { Check, X, Copy, CheckCheck, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { Tag } from '@/components/ui/tag'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/lib/utils'
import type { TableColumn, TagVariant } from '@/types/schema'

// ─── Types ─────────────────────────────────────────────────────────────────────

export type CellRenderFn = (
  value: unknown,
  row: Record<string, unknown>,
  index: number,
) => ReactNode

export interface CellRenderOptions {
  renders?: Record<string, CellRenderFn>
  onAction?: (action: string, row: Record<string, unknown>) => void
  page?: number
  pageSize?: number
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const TAG_VARIANT_MAP: Record<TagVariant, TagVariant> = {
  default: 'default',
  success: 'success',
  warning: 'warning',
  destructive: 'destructive',
  info: 'info',
}

// Badge uses shadcn variants, map from TagVariant
const BADGE_VARIANT_MAP: Record<TagVariant, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  default: 'default',
  success: 'secondary',
  warning: 'outline',
  destructive: 'destructive',
  info: 'secondary',
}

function toDisplayValue(value: unknown): string {
  if (value === null || value === undefined) return '—'
  return String(value)
}

function parseDate(value: unknown): Date | null {
  if (value instanceof Date) return value
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value)
    return isNaN(d.getTime()) ? null : d
  }
  return null
}

// ─── Copyable wrapper ──────────────────────────────────────────────────────────

function CopyableCell({ text, children }: { text: string; children: ReactNode }) {
  const [copied, setCopied] = useState(false)

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }).catch(() => undefined)
  }

  return (
    <span className="group inline-flex items-center gap-1 max-w-full">
      <span className="truncate">{children}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
      >
        {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
      </button>
    </span>
  )
}

// ─── Image cell with preview dialog ────────────────────────────────────────────

function ImageCell({ src }: { src: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="shrink-0">
        <img
          src={src}
          alt=""
          className="h-6 w-6 rounded object-cover border border-border hover:opacity-80 transition-opacity"
        />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-2">
          <img src={src} alt="" className="max-h-[80vh] w-full object-contain rounded" />
        </DialogContent>
      </Dialog>
    </>
  )
}

// ─── Main render function ───────────────────────────────────────────────────────

export function renderCell(
  column: TableColumn,
  value: unknown,
  row: Record<string, unknown>,
  index: number,
  options: CellRenderOptions = {},
): ReactNode {
  const { renders, onAction, page = 1, pageSize = 10 } = options
  const type = column.type ?? 'text'
  const strVal = toDisplayValue(value)

  // ── Custom ─────────────────────────────────────────────────────────────────
  if (type === 'custom') {
    const renderKey = column.renderKey
    if (renderKey && renders?.[renderKey]) {
      return renders[renderKey](value, row, index)
    }
    return strVal
  }

  // ── Action ─────────────────────────────────────────────────────────────────
  if (type === 'action') {
    // ActionColumn is rendered separately in ProTable — handled there
    void onAction // referenced to satisfy noUnusedParameters
    return null
  }

  // ── Index (used for showIndex, not a real column type) ─────────────────────
  // Handled by ProTable directly

  let cellContent: ReactNode

  switch (type) {
    case 'number': {
      const n = typeof value === 'number' ? value : parseFloat(String(value))
      cellContent = isNaN(n) ? strVal : formatNumber(n)
      break
    }

    case 'date': {
      const d = parseDate(value)
      cellContent = d ? format(d, column.dateFormat ?? 'yyyy-MM-dd') : '—'
      break
    }

    case 'datetime': {
      const d = parseDate(value)
      cellContent = d ? format(d, column.dateFormat ?? 'yyyy-MM-dd HH:mm:ss') : '—'
      break
    }

    case 'tag': {
      const key = strVal
      const label = column.labelMap?.[key] ?? key
      const variant = (column.tagMap?.[key] && TAG_VARIANT_MAP[column.tagMap[key]]) ?? 'default'
      cellContent = value !== null && value !== undefined
        ? <Tag variant={variant} size="sm">{label}</Tag>
        : '—'
      break
    }

    case 'badge': {
      const key = strVal
      const label = column.labelMap?.[key] ?? key
      const tagVariant: TagVariant = column.tagMap?.[key] ?? 'default'
      const badgeVariant = BADGE_VARIANT_MAP[tagVariant]
      cellContent = value !== null && value !== undefined
        ? <Badge variant={badgeVariant}>{label}</Badge>
        : '—'
      break
    }

    case 'image': {
      const src = typeof value === 'string' ? value : ''
      cellContent = src ? <ImageCell src={src} /> : '—'
      break
    }

    case 'link': {
      let href = ''
      const cfg = column.linkConfig
      if (cfg) {
        href = typeof cfg.href === 'function' ? cfg.href(row) : cfg.href
      } else {
        href = typeof value === 'string' ? value : ''
      }
      cellContent = href ? (
        <a
          href={href}
          target={column.linkConfig?.target ?? '_blank'}
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {strVal}
          <ExternalLink size={12} />
        </a>
      ) : '—'
      break
    }

    case 'boolean': {
      if (column.booleanMap) {
        cellContent = value ? column.booleanMap.true : column.booleanMap.false
      } else {
        cellContent = value
          ? <Check size={14} className="text-success" />
          : <X size={14} className="text-destructive" />
      }
      break
    }

    default: // text
      cellContent = strVal
  }

  // ── Ellipsis + Tooltip ─────────────────────────────────────────────────────
  if (column.ellipsis && typeof cellContent === 'string') {
    cellContent = (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="block truncate max-w-full cursor-default">{cellContent}</span>
          </TooltipTrigger>
          <TooltipContent>{cellContent}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // ── Copyable ───────────────────────────────────────────────────────────────
  if (column.copyable) {
    cellContent = (
      <CopyableCell text={typeof value === 'string' || typeof value === 'number' ? String(value) : strVal}>
        {cellContent}
      </CopyableCell>
    )
  }

  // ── Index for showIndex (page-based numbering, passed via index offset) ────
  if (type === 'text' && column.key === '__index') {
    return (page - 1) * pageSize + index + 1
  }

  return (
    <span
      className={cn(
        'inline-flex items-center',
        column.align === 'center' && 'justify-center w-full',
        column.align === 'right' && 'justify-end w-full',
      )}
    >
      {cellContent}
    </span>
  )
}
