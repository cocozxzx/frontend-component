import { useState, type ReactNode } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Search, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { NumberField } from '@/components/ui/number-field'
import { AppInput } from '@/components/base/AppInput'
import { AppSelect } from '@/components/base/AppSelect'
import { AppDatePicker } from '@/components/base/AppDatePicker'
import { AppDateRangePicker } from '@/components/base/AppDateRangePicker'
import { cn } from '@/lib/utils'
import type { SearchField } from '@/types/schema'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface SearchBarProps {
  fields: SearchField[]
  onSearch: (values: Record<string, unknown>) => void
  onReset: () => void
  loading?: boolean
  renders?: Record<string, (field: SearchField) => ReactNode>
  remoteSearch?: Record<string, (keyword: string) => Promise<Array<{ label: string; value: string | number }>>>
}

// ─── Default values builder ─────────────────────────────────────────────────────

function buildDefaultValues(fields: SearchField[]): Record<string, unknown> {
  const defaults: Record<string, unknown> = {}
  fields.forEach((f) => {
    defaults[f.field] = f.defaultValue ?? ''
  })
  return defaults
}

// ─── Field renderer ────────────────────────────────────────────────────────────

interface FieldInputProps {
  field: SearchField
  value: unknown
  onChange: (v: unknown) => void
  renders?: SearchBarProps['renders']
  remoteSearch?: SearchBarProps['remoteSearch']
}

function FieldInput({ field, value, onChange, renders, remoteSearch }: FieldInputProps) {
  switch (field.type) {
    case 'input':
      return (
        <AppInput
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? `请输入${field.label}`}
          allowClear
        />
      )

    case 'select': {
      const onSearchFn = field.remote && field.onSearch
        ? remoteSearch?.[field.onSearch]
        : undefined
      return (
        <AppSelect
          value={value as string | number | undefined}
          onChange={onChange}
          options={field.options ?? []}
          placeholder={field.placeholder ?? `请选择${field.label}`}
          allowSearch={!field.remote}
          remote={field.remote}
          onSearch={onSearchFn}
        />
      )
    }

    case 'date':
      return (
        <AppDatePicker
          value={value instanceof Date ? value : undefined}
          onChange={(d) => onChange(d)}
          placeholder={field.placeholder ?? `请选择${field.label}`}
        />
      )

    case 'date-range':
      return (
        <AppDateRangePicker
          value={Array.isArray(value) ? (value as [Date | null, Date | null]) : [null, null]}
          onChange={(r) => onChange(r)}
        />
      )

    case 'number-range': {
      const range = Array.isArray(value) ? value : [undefined, undefined]
      return (
        <div className="flex items-center gap-1.5">
          <NumberField
            value={typeof range[0] === 'number' ? range[0] : undefined}
            onChange={(v) => onChange([v, range[1]])}
            placeholder="最小值"
            className="flex-1"
          />
          <span className="shrink-0 text-muted-foreground text-sm">至</span>
          <NumberField
            value={typeof range[1] === 'number' ? range[1] : undefined}
            onChange={(v) => onChange([range[0], v])}
            placeholder="最大值"
            className="flex-1"
          />
        </div>
      )
    }

    case 'radio':
      return (
        <RadioGroup
          value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''}
          onValueChange={(v) => onChange(v)}
          className="flex flex-wrap gap-x-4 gap-y-1"
        >
          {field.options?.map((opt) => (
            <div key={String(opt.value)} className="flex items-center gap-1.5">
              <RadioGroupItem value={String(opt.value)} id={`${field.field}-${opt.value}`} />
              <Label htmlFor={`${field.field}-${opt.value}`} className="font-normal cursor-pointer">
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )

    case 'checkbox': {
      const selected = Array.isArray(value) ? (value as string[]) : []
      return (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {field.options?.map((opt) => {
            const strVal = String(opt.value)
            return (
              <div key={strVal} className="flex items-center gap-1.5">
                <Checkbox
                  id={`${field.field}-${strVal}`}
                  checked={selected.includes(strVal)}
                  onCheckedChange={(checked) => {
                    onChange(
                      checked
                        ? [...selected, strVal]
                        : selected.filter((v) => v !== strVal),
                    )
                  }}
                />
                <Label htmlFor={`${field.field}-${strVal}`} className="font-normal cursor-pointer">
                  {opt.label}
                </Label>
              </div>
            )
          })}
        </div>
      )
    }

    case 'custom': {
      const key = field.onSearch ?? field.field
      return <>{renders?.[key]?.(field) ?? null}</>
    }

    default:
      return null
  }
}

// ─── SearchBar ─────────────────────────────────────────────────────────────────

const COLLAPSE_THRESHOLD = 3

export function SearchBar({ fields, onSearch, onReset, loading, renders, remoteSearch }: SearchBarProps) {
  const [collapsed, setCollapsed] = useState(true)
  const canCollapse = fields.length > COLLAPSE_THRESHOLD

  const { control, handleSubmit, reset } = useForm<Record<string, unknown>>({
    defaultValues: buildDefaultValues(fields),
  })

  const visibleFields = canCollapse && collapsed ? fields.slice(0, COLLAPSE_THRESHOLD) : fields

  function handleSearch(values: Record<string, unknown>) {
    // Strip empty values
    const cleaned: Record<string, unknown> = {}
    Object.entries(values).forEach(([k, v]) => {
      if (v === '' || v === null || v === undefined) return
      if (Array.isArray(v) && v.length === 0) return
      cleaned[k] = v
    })
    onSearch(cleaned)
  }

  function handleReset() {
    reset(buildDefaultValues(fields))
    onReset()
  }

  return (
    <form
      onSubmit={handleSubmit(handleSearch)}
      className="rounded-lg border bg-card p-4 mb-4"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(24, 1fr)',
          gap: '12px 16px',
          alignItems: 'end',
        }}
      >
        {visibleFields.map((field) => {
          const span = field.span ?? 8
          return (
            <div
              key={field.field}
              style={{ gridColumn: `span ${span} / span ${span}` }}
              className="min-w-0"
            >
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                {field.label}
              </Label>
              <Controller
                control={control}
                name={field.field}
                render={({ field: formField }) => (
                  <FieldInput
                    field={field}
                    value={formField.value}
                    onChange={formField.onChange}
                    renders={renders}
                    remoteSearch={remoteSearch}
                  />
                )}
              />
            </div>
          )
        })}

        {/* Action buttons — always at the end, right-aligned */}
        <div
          style={{ gridColumn: 'span 24 / span 24' }}
          className={cn(
            'flex items-center gap-2 justify-end',
            // When last row has leftover space, push buttons right
          )}
        >
          {canCollapse && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed((c) => !c)}
              className="gap-1"
            >
              {collapsed ? (
                <><ChevronDown size={14} />展开</>
              ) : (
                <><ChevronUp size={14} />收起</>
              )}
            </Button>
          )}
          <Button type="button" variant="outline" size="sm" onClick={handleReset} disabled={loading}>
            <RotateCcw size={14} />
            重置
          </Button>
          <Button type="submit" size="sm" disabled={loading}>
            <Search size={14} />
            搜索
          </Button>
        </div>
      </div>
    </form>
  )
}
