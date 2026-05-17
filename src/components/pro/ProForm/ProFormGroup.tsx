import { useState, type ReactNode } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { FormGroup as FormGroupType } from '@/types/schema'
import { FormRenderer, type FieldRenderFn, type ValidatorFn } from './FormRenderer'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ProFormGroupProps {
  group: FormGroupType
  watchValues: Record<string, unknown>
  renders?: Record<string, FieldRenderFn>
  validators?: Record<string, ValidatorFn>
  uploadFn?: (file: File) => Promise<string>
  disabled?: boolean
  globalColumns?: number
  children?: ReactNode
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ProFormGroup({
  group,
  watchValues,
  renders,
  validators,
  uploadFn,
  disabled,
  globalColumns = 1,
}: ProFormGroupProps) {
  const [open, setOpen] = useState(!group.defaultCollapsed)

  const columns = group.columns ?? globalColumns
  const colSpan = Math.floor(24 / columns)

  const fields = (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(24, 1fr)`,
        gap: '16px 20px',
      }}
    >
      {group.fields.map((field) => {
        const span = field.span ?? colSpan
        return (
          <div
            key={field.field}
            style={{ gridColumn: `span ${span} / span ${span}` }}
            className="min-w-0"
          >
            <FormRenderer
              field={field}
              watchValues={watchValues}
              renders={renders}
              validators={validators}
              uploadFn={uploadFn}
              disabled={disabled}
            />
          </div>
        )
      })}
    </div>
  )

  // No title — render fields directly
  if (!group.title && !group.collapsible) return fields

  if (group.collapsible) {
    return (
      <Collapsible open={open} onOpenChange={setOpen} className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            {group.title && (
              <h4 className="text-sm font-semibold">{group.title}</h4>
            )}
            {group.description && (
              <p className="text-xs text-muted-foreground mt-0.5">{group.description}</p>
            )}
          </div>
          <CollapsibleTrigger asChild>
            <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
              {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </CollapsibleTrigger>
        </div>
        <Separator />
        <CollapsibleContent className={cn('space-y-4', !open && 'hidden')}>
          {fields}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <div className="space-y-3">
      <div>
        {group.title && <h4 className="text-sm font-semibold">{group.title}</h4>}
        {group.description && (
          <p className="text-xs text-muted-foreground mt-0.5">{group.description}</p>
        )}
      </div>
      <Separator />
      {fields}
    </div>
  )
}
