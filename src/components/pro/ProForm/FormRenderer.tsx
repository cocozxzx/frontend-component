import { useState, useEffect, type ReactNode } from 'react'
import { useFormContext, type Control } from 'react-hook-form'
import { HelpCircle } from 'lucide-react'
import { z } from 'zod'
import {
  FormField as ShadcnFormField,
  FormItem, FormLabel, FormControl, FormDescription, FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { NumberField } from '@/components/ui/number-field'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import {
  Tooltip, TooltipContent, TooltipTrigger, TooltipProvider,
} from '@/components/ui/tooltip'
import { AppInput } from '@/components/base/AppInput'
import { AppSelect } from '@/components/base/AppSelect'
import { AppDatePicker } from '@/components/base/AppDatePicker'
import { AppDateRangePicker } from '@/components/base/AppDateRangePicker'
import { AppUpload } from '@/components/base/AppUpload'
import { Rate } from '@/components/form/Rate'
import { ColorPicker } from '@/components/form/ColorPicker'
import { TimePicker } from '@/components/form/TimePicker'
import { DateTimePicker } from '@/components/form/DateTimePicker'
import { RichEditor } from '@/components/editor/RichEditor'
import { VirtualSelect } from '@/components/advanced/VirtualSelect'
import { TagsInput } from '@/components/advanced/TagsInput'
import { get } from '@/lib/request'
import { cn } from '@/lib/utils'
import type { FormField, FormFieldOption, ZodRuleConfig } from '@/types/schema'

// ─── Types ─────────────────────────────────────────────────────────────────────

export type FieldRenderFn = (
  field: FormField,
  control: Control<Record<string, unknown>>,
) => ReactNode

export type ValidatorFn = (value: unknown) => boolean | string

export interface FormRendererProps {
  field: FormField
  watchValues: Record<string, unknown>
  renders?: Record<string, FieldRenderFn>
  validators?: Record<string, ValidatorFn>
  uploadFn?: (file: File) => Promise<string>
  disabled?: boolean
}

// ─── Condition evaluator ────────────────────────────────────────────────────────

function evalCondition(condition: boolean | string, values: Record<string, unknown>): boolean {
  if (typeof condition === 'boolean') return condition
  try {
    // eslint-disable-next-line no-new-func
    return !!(new Function('values', `return !!(${condition})`)(values) as unknown)
  } catch {
    return false
  }
}

// ─── Zod schema builder for a single field ─────────────────────────────────────

export function buildFieldZodSchema(
  field: FormField,
  validators?: Record<string, ValidatorFn>,
): z.ZodTypeAny {
  const rules: ZodRuleConfig = field.rules ?? {}

  let schema: z.ZodTypeAny

  switch (field.type) {
    case 'number':
    case 'slider':
    case 'rate': {
      let s = z.number({ message: `${field.label ?? field.field}必须是数字` })
      if (rules.min !== undefined) s = s.min(rules.min, `最小值为 ${rules.min}`)
      if (rules.max !== undefined) s = s.max(rules.max, `最大值为 ${rules.max}`)
      schema = s
      break
    }
    case 'checkbox':
    case 'switch': {
      schema = z.boolean()
      break
    }
    case 'date':
    case 'datetime': {
      schema = z.union([z.date(), z.string(), z.null()])
      break
    }
    case 'date-range': {
      schema = z.array(z.union([z.date(), z.null()]))
      break
    }
    case 'checkbox-group':
    case 'multi-select':
    case 'tags-input': {
      let s = z.array(z.string())
      if (rules.min !== undefined) s = s.min(rules.min, `至少选择 ${rules.min} 项`)
      if (rules.max !== undefined) s = s.max(rules.max, `最多选择 ${rules.max} 项`)
      schema = s
      break
    }
    default: {
      let s = z.string({ message: field.required ? `${field.label ?? field.field}不能为空` : undefined })
      if (rules.min !== undefined || rules.minLength !== undefined) {
        const n = rules.minLength ?? rules.min!
        s = s.min(n, `最少 ${n} 个字符`)
      }
      if (rules.max !== undefined || rules.maxLength !== undefined) {
        const n = rules.maxLength ?? rules.max!
        s = s.max(n, `最多 ${n} 个字符`)
      }
      if (rules.email) s = s.email('请输入有效的邮箱地址')
      if (rules.url) s = s.url('请输入有效的 URL')
      if (rules.pattern) {
        s = s.regex(new RegExp(rules.pattern), rules.patternMessage ?? '格式不正确')
      }
      schema = s
      break
    }
  }

  // Custom validator
  if (rules.custom && validators?.[rules.custom]) {
    const fn = validators[rules.custom]
    schema = schema.refine(
      (v: unknown) => { const r = fn(v); return r === true || typeof r !== 'string' || r === '' },
      (v: unknown) => { const r = fn(v); return { message: typeof r === 'string' && r ? r : '验证失败' } },
    )
  }

  return field.required ? schema : schema.optional()
}

// ─── Remote options hook ────────────────────────────────────────────────────────

function useRemoteOptions(remote: FormField['remote']): { options: FormFieldOption[]; loading: boolean } {
  const [options, setOptions] = useState<FormFieldOption[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!remote?.api) return
    setLoading(true)
    get<unknown>(remote.api, { params: remote.params })
      .then((data) => {
        if (!Array.isArray(data)) return
        setOptions(
          (data as Record<string, unknown>[]).map((item) => ({
            label: String(item[remote.labelField ?? 'label'] ?? ''),
            value: item[remote.valueField ?? 'value'] as string | number,
          })),
        )
      })
      .catch(() => setOptions([]))
      .finally(() => setLoading(false))
  }, [remote?.api]) // eslint-disable-line react-hooks/exhaustive-deps

  return { options, loading }
}

// ─── Field input renderer ───────────────────────────────────────────────────────

interface FieldInputProps {
  field: FormField
  value: unknown
  onChange: (v: unknown) => void
  disabled: boolean
  renders?: Record<string, FieldRenderFn>
  validators?: Record<string, ValidatorFn>
  uploadFn?: (file: File) => Promise<string>
  control: Control<Record<string, unknown>>
}

function FieldInput({ field, value, onChange, disabled, renders, uploadFn, control }: FieldInputProps) {
  const { options: remoteOptions, loading: remoteLoading } = useRemoteOptions(field.remote)
  const opts: FormFieldOption[] = field.remote ? remoteOptions : (field.options ?? [])
  const selectOpts = opts.map((o) => ({ label: o.label, value: o.value, disabled: o.disabled }))

  const placeholder = field.placeholder ?? (field.label ? `请输入${field.label}` : '请输入')
  const disabledFinal = disabled || field.disabled === true

  switch (field.type) {
    case 'input':
      return (
        <AppInput
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabledFinal}
          allowClear
        />
      )

    case 'password':
      return (
        <AppInput
          type="password"
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabledFinal}
        />
      )

    case 'textarea':
      return (
        <Textarea
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabledFinal}
          rows={(field.props?.rows as number | undefined) ?? 3}
          className="resize-y"
        />
      )

    case 'number':
      return (
        <NumberField
          value={typeof value === 'number' ? value : undefined}
          onChange={(v) => onChange(v)}
          placeholder={placeholder}
          disabled={disabledFinal}
        />
      )

    case 'select':
      return (
        <AppSelect
          value={value as string | number | undefined}
          onChange={onChange}
          options={selectOpts}
          placeholder={field.placeholder ?? `请选择${field.label ?? ''}`}
          loading={remoteLoading}
          disabled={disabledFinal}
          allowSearch
        />
      )

    case 'multi-select':
    case 'virtual-select':
      return (
        <VirtualSelect
          options={selectOpts}
          value={value as string | number | Array<string | number> | undefined}
          onChange={(v) => onChange(v)}
          multiple={field.type === 'multi-select'}
          searchable
          loading={remoteLoading}
          disabled={disabledFinal}
          placeholder={field.placeholder ?? `请选择${field.label ?? ''}`}
        />
      )

    case 'checkbox':
      return (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={value === true}
            onCheckedChange={(v) => onChange(!!v)}
            disabled={disabledFinal}
          />
          {field.label && <span className="text-sm">{field.label}</span>}
        </div>
      )

    case 'checkbox-group': {
      const checked = Array.isArray(value) ? (value as string[]) : []
      return (
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {opts.map((opt) => {
            const strVal = String(opt.value)
            return (
              <div key={strVal} className="flex items-center gap-1.5">
                <Checkbox
                  id={`${field.field}-${strVal}`}
                  checked={checked.includes(strVal)}
                  disabled={disabledFinal || opt.disabled}
                  onCheckedChange={(v) => {
                    onChange(v ? [...checked, strVal] : checked.filter((s) => s !== strVal))
                  }}
                />
                <Label htmlFor={`${field.field}-${strVal}`} className="font-normal cursor-pointer text-sm">
                  {opt.label}
                </Label>
              </div>
            )
          })}
        </div>
      )
    }

    case 'radio':
      return (
        <RadioGroup
          value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''}
          onValueChange={(v) => onChange(v)}
          disabled={disabledFinal}
          className="flex flex-wrap gap-x-4 gap-y-2"
        >
          {opts.map((opt) => (
            <div key={String(opt.value)} className="flex items-center gap-1.5">
              <RadioGroupItem value={String(opt.value)} id={`${field.field}-${opt.value}`} disabled={opt.disabled} />
              <Label htmlFor={`${field.field}-${opt.value}`} className="font-normal cursor-pointer text-sm">
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )

    case 'switch':
      return (
        <Switch
          checked={value === true}
          onCheckedChange={(v) => onChange(v)}
          disabled={disabledFinal}
        />
      )

    case 'slider': {
      const num = typeof value === 'number' ? value : 0
      return (
        <div className="flex items-center gap-3">
          <Slider
            value={[num]}
            onValueChange={([v]) => onChange(v)}
            min={(field.props?.min as number | undefined) ?? 0}
            max={(field.props?.max as number | undefined) ?? 100}
            step={(field.props?.step as number | undefined) ?? 1}
            disabled={disabledFinal}
            className="flex-1"
          />
          <span className="w-8 text-right text-sm text-muted-foreground">{num}</span>
        </div>
      )
    }

    case 'rate':
      return (
        <Rate
          value={typeof value === 'number' ? value : 0}
          onChange={(v) => onChange(v)}
          disabled={disabledFinal}
        />
      )

    case 'date':
      return (
        <AppDatePicker
          value={value instanceof Date ? value : undefined}
          onChange={(d) => onChange(d)}
          placeholder={field.placeholder ?? `请选择${field.label ?? '日期'}`}
          disabled={disabledFinal}
        />
      )

    case 'datetime':
      return (
        <DateTimePicker
          value={value instanceof Date ? value : undefined}
          onChange={(d) => onChange(d)}
          placeholder={field.placeholder ?? `请选择${field.label ?? '日期时间'}`}
          disabled={disabledFinal}
        />
      )

    case 'date-range':
      return (
        <AppDateRangePicker
          value={Array.isArray(value) ? (value as [Date | null, Date | null]) : [null, null]}
          onChange={(r) => onChange(r)}
          disabled={disabledFinal}
        />
      )

    case 'time':
      return (
        <TimePicker
          value={typeof value === 'string' ? value : undefined}
          onChange={(t) => onChange(t)}
          placeholder={field.placeholder ?? `请选择${field.label ?? '时间'}`}
          disabled={disabledFinal}
        />
      )

    case 'color':
      return (
        <ColorPicker
          value={typeof value === 'string' ? value : undefined}
          onChange={(color) => onChange(color)}
          disabled={disabledFinal}
        />
      )

    case 'upload':
      return (
        <AppUpload
          value={Array.isArray(value) ? (value as import('@/components/base/AppUpload').UploadFile[]) : []}
          onChange={(files) => onChange(files)}
          uploadFn={uploadFn}
          disabled={disabledFinal}
          maxCount={(field.props?.maxCount as number | undefined) ?? 1}
          listType={(field.props?.listType as 'text' | 'picture' | 'picture-card' | undefined) ?? 'text'}
          accept={field.props?.accept as string | undefined}
          multiple={(field.props?.multiple as boolean | undefined) ?? false}
        />
      )

    case 'rich-editor':
      return (
        <RichEditor
          value={typeof value === 'string' ? value : ''}
          onChange={(v) => onChange(v)}
          uploadFn={uploadFn}
          readOnly={disabledFinal}
          placeholder={field.placeholder ?? '请输入内容'}
        />
      )

    case 'tags-input':
      return (
        <TagsInput
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={(tags) => onChange(tags)}
          disabled={disabledFinal}
          placeholder={field.placeholder ?? '输入后按 Enter 添加'}
          maxCount={field.props?.maxCount as number | undefined}
        />
      )

    case 'custom': {
      const key = field.renderKey ?? field.field
      return <>{renders?.[key]?.(field, control) ?? null}</>
    }

    default:
      return null
  }
}

// ─── Public FormRenderer component ─────────────────────────────────────────────

export function FormRenderer({
  field,
  watchValues,
  renders,
  validators,
  uploadFn,
  disabled = false,
}: FormRendererProps) {
  const { control } = useFormContext<Record<string, unknown>>()

  // Condition: hidden
  if (field.hidden !== undefined && evalCondition(field.hidden, watchValues)) return null

  // Condition: disabled
  const isDisabled =
    disabled ||
    (field.disabled !== undefined && typeof field.disabled === 'string'
      ? evalCondition(field.disabled, watchValues)
      : field.disabled === true)

  return (
    <ShadcnFormField
      control={control}
      name={field.field}
      render={({ field: ff, fieldState }) => (
        <FormItem>
          {/* Label (skip for checkbox since it renders its own label) */}
          {field.label && field.type !== 'checkbox' && (
            <FormLabel className={cn(fieldState.error && 'text-destructive')}>
              {field.label}
              {field.required && <span className="ml-0.5 text-destructive">*</span>}
              {field.tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle size={13} className="ml-1 inline text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>{field.tooltip}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </FormLabel>
          )}

          <FormControl>
            <FieldInput
              field={field}
              value={ff.value}
              onChange={ff.onChange}
              disabled={isDisabled}
              renders={renders}
              validators={validators}
              uploadFn={uploadFn}
              control={control}
            />
          </FormControl>

          {field.help && <FormDescription>{field.help}</FormDescription>}
          {fieldState.error && (
            <FormMessage>{fieldState.error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  )
}
