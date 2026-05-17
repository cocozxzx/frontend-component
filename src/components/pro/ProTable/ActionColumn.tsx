import { type ReactNode } from 'react'
import {
  Edit2, Trash2, Eye, Plus, Download, Upload, Send,
  RefreshCw, Settings, Check, X, Ban, MoreHorizontal,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useModal } from '@/hooks/useModal'
import { usePermissionStore } from '@/stores/usePermissionStore'
import { cn } from '@/lib/utils'
import type { ActionButton, ActionCondition } from '@/types/schema'

// ─── Icon map ──────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  Edit: Edit2, Edit2, Trash: Trash2, Trash2, Eye, Plus, Download, Upload,
  Send, RefreshCw, Settings, Check, X, Ban, MoreHorizontal,
  edit: Edit2, delete: Trash2, remove: Trash2, view: Eye, add: Plus,
  download: Download, upload: Upload, send: Send, refresh: RefreshCw,
  disable: Ban, enable: Check,
}

function ActionIcon({ name, size = 14 }: { name: string; size?: number }) {
  const Icon = ICON_MAP[name]
  return Icon ? <Icon size={size} /> : null
}

// ─── Condition evaluator ───────────────────────────────────────────────────────

function evalCondition(condition: ActionCondition, row: Record<string, unknown>): boolean {
  if (typeof condition === 'boolean') return condition
  try {
    // eslint-disable-next-line no-new-func
    return !!(new Function('row', `return !!(${condition})`)(row) as unknown)
  } catch {
    return false
  }
}

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ActionColumnProps {
  actions: ActionButton[]
  row: Record<string, unknown>
  onAction: (action: string, row: Record<string, unknown>) => void
  maxVisible?: number
}

// ─── Single action button ──────────────────────────────────────────────────────

interface ActionBtnProps {
  btn: ActionButton
  row: Record<string, unknown>
  onAction: (action: string, row: Record<string, unknown>) => void
  asMenuItem?: boolean
}

function ActionBtn({ btn, row, onAction, asMenuItem = false }: ActionBtnProps) {
  const { confirm } = useModal()

  const isHidden = btn.hidden !== undefined ? evalCondition(btn.hidden, row) : false
  const isDisabled = btn.disabled !== undefined ? evalCondition(btn.disabled, row) : false

  if (isHidden) return null

  async function handleClick() {
    if (btn.confirm) {
      const ok = await confirm({
        title: btn.confirm.title,
        content: btn.confirm.content,
        type: btn.confirm.type === 'danger' ? 'danger' : btn.confirm.type ?? 'default',
      })
      if (!ok) return
    }
    onAction(btn.action, row)
  }

  const variantMap = {
    primary: 'default',
    destructive: 'destructive',
    warning: 'outline',
    default: 'ghost',
  } as const

  const variant = variantMap[btn.type ?? 'default']

  const colorClass = btn.type === 'destructive'
    ? ''
    : btn.type === 'warning'
      ? 'text-warning hover:text-warning'
      : ''

  if (asMenuItem) {
    return (
      <DropdownMenuItem
        disabled={isDisabled}
        onClick={handleClick}
        className={cn(
          'gap-1.5 text-sm cursor-pointer',
          btn.type === 'destructive' && 'text-destructive focus:text-destructive',
          colorClass,
        )}
      >
        {btn.icon && <ActionIcon name={btn.icon} size={13} />}
        {btn.label}
      </DropdownMenuItem>
    )
  }

  return (
    <Button
      variant={variant}
      size="sm"
      disabled={isDisabled}
      onClick={handleClick}
      className={cn('h-7 px-2 text-xs', colorClass)}
    >
      {btn.icon && <ActionIcon name={btn.icon} size={13} />}
      {btn.label}
    </Button>
  )
}

// ─── Public component ──────────────────────────────────────────────────────────

export function ActionColumn({ actions, row, onAction, maxVisible = 3 }: ActionColumnProps): ReactNode {
  const hasPermission = usePermissionStore((s) => s.hasPermission)

  const visibleActions = actions.filter((btn) => {
    if (btn.permission && !hasPermission(btn.permission)) return false
    return true
  })

  const direct = visibleActions.slice(0, maxVisible)
  const overflow = visibleActions.slice(maxVisible)

  return (
    <div className="flex items-center gap-1">
      {direct.map((btn) => (
        <ActionBtn key={btn.action} btn={btn} row={row} onAction={onAction} />
      ))}

      {overflow.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <MoreHorizontal size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {overflow.map((btn) => (
              <ActionBtn key={btn.action} btn={btn} row={row} onAction={onAction} asMenuItem />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
