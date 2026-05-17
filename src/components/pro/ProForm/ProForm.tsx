import { useEffect, useCallback, useMemo, useImperativeHandle, type ReactNode } from 'react'
import { useForm, useWatch, type Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ProFormSchema, FormField } from '@/types/schema'
import { FormRenderer, buildFieldZodSchema, type FieldRenderFn, type ValidatorFn } from './FormRenderer'
import { ProFormGroup } from './ProFormGroup'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ProFormRef {
  submit: () => void
  reset: () => void
  validate: () => Promise<boolean>
  getValues: () => Record<string, unknown>
  setValues: (values: Record<string, unknown>) => void
  setFieldValue: (field: string, value: unknown) => void
}

export interface ProFormProps {
  schema: ProFormSchema
  defaultValues?: Record<string, unknown>
  values?: Record<string, unknown>
  onValuesChange?: (changedValues: Record<string, unknown>, allValues: Record<string, unknown>) => void
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>
  onReset?: () => void
  loading?: boolean
  disabled?: boolean
  renders?: Record<string, FieldRenderFn>
  validators?: Record<string, ValidatorFn>
  uploadFn?: (file: File) => Promise<string>
  formRef?: React.RefObject<ProFormRef | null>
  className?: string
  children?: ReactNode
}

// ─── Zod schema builder ────────────────────────────────────────────────────────

function buildZodSchema(
  fields: FormField[],
  validators?: Record<string, ValidatorFn>,
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {}
  fields.forEach((f) => {
    if (f.field.includes('.')) return // skip nested for now
    shape[f.field] = buildFieldZodSchema(f, validators)
  })
  return z.object(shape)
}

function buildDefaultValues(fields: FormField[]): Record<string, unknown> {
  const dv: Record<string, unknown> = {}
  fields.forEach((f) => {
    if (f.defaultValue !== undefined) dv[f.field] = f.defaultValue
    else dv[f.field] = getDefaultByType(f)
  })
  return dv
}

function getDefaultByType(field: FormField): unknown {
  switch (field.type) {
    case 'checkbox': case 'switch': return false
    case 'number': case 'slider': case 'rate': return undefined
    case 'checkbox-group': case 'multi-select': case 'tags-input': return []
    case 'date-range': return [null, null]
    case 'upload': return []
    default: return ''
  }
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ProForm({
  schema,
  defaultValues: externalDefaults,
  values: controlledValues,
  onValuesChange,
  onSubmit,
  onReset,
  loading = false,
  disabled = false,
  renders,
  validators,
  uploadFn,
  formRef,
  className,
}: ProFormProps) {
  const allFields = useMemo((): FormField[] => {
    if (schema.fields) return schema.fields
    if (schema.groups) return schema.groups.flatMap((g) => g.fields)
    return []
  }, [schema])

  const zodSchema = useMemo(
    () => buildZodSchema(allFields, validators),
    [allFields, validators],
  )

  const computedDefaults = useMemo(
    () => ({ ...buildDefaultValues(allFields), ...externalDefaults }),
    [allFields, externalDefaults],
  )

  const methods = useForm<Record<string, unknown>>({
    defaultValues: computedDefaults,
    resolver: zodResolver(zodSchema),
    mode: 'onChange',
  })

  const { control, handleSubmit, reset, setValue, getValues, trigger, formState } = methods

  // Sync controlled values
  useEffect(() => {
    if (!controlledValues) return
    Object.entries(controlledValues).forEach(([k, v]) => setValue(k, v))
  }, [controlledValues, setValue])

  // Subscribe to form changes (no infinite loop — uses watch subscription pattern)
  useEffect(() => {
    if (!onValuesChange) return
    const { unsubscribe } = methods.watch((values, { name }) => {
      if (name) {
        onValuesChange(
          { [name]: values[name] } as Record<string, unknown>,
          values as Record<string, unknown>,
        )
      }
    })
    return unsubscribe
  }, [methods, onValuesChange])

  // ProFormRef
  useImperativeHandle(formRef, () => ({
    submit: () => { void handleSubmit(handleFormSubmit)() },
    reset: () => { reset(computedDefaults); onReset?.() },
    validate: async () => { const ok = await trigger(); return ok },
    getValues: () => getValues() as Record<string, unknown>,
    setValues: (vals) => { Object.entries(vals).forEach(([k, v]) => setValue(k, v)) },
    setFieldValue: (field, value) => { setValue(field, value) },
  }), [handleSubmit, reset, trigger, getValues, setValue, computedDefaults, onReset])

  async function handleFormSubmit(values: Record<string, unknown>) {
    await onSubmit(values)
  }

  // Watch all fields for condition evaluation
  const watchValues = useWatch({ control }) as Record<string, unknown>

  // Layout helpers
  const columns = schema.columns ?? 1
  const colSpan = Math.floor(24 / columns)
  const submitPos = schema.submitPosition ?? 'right'
  const submitAlignClass = submitPos === 'center' ? 'justify-center' : submitPos === 'left' ? 'justify-start' : 'justify-end'

  const labelStyle =
    schema.layout === 'horizontal'
      ? { '--label-width': typeof schema.labelWidth === 'number' ? `${schema.labelWidth}px` : (schema.labelWidth ?? '100px') } as React.CSSProperties
      : undefined

  const renderField = useCallback(
    (field: FormField) => (
      <FormRenderer
        key={field.field}
        field={field}
        watchValues={watchValues}
        renders={renders}
        validators={validators}
        uploadFn={uploadFn}
        disabled={disabled}
      />
    ),
    [watchValues, renders, validators, uploadFn, disabled],
  )

  return (
    <Form {...methods}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className={cn(
          'space-y-4',
          schema.layout === 'horizontal' && 'pro-form-horizontal',
          loading && 'pointer-events-none opacity-70',
          className,
        )}
        style={labelStyle}
        noValidate
      >
        {/* Flat fields */}
        {schema.fields && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(24, 1fr)',
              gap: '16px 20px',
            }}
          >
            {schema.fields.map((field) => {
              const span = field.span ?? colSpan
              return (
                <div
                  key={field.field}
                  style={{ gridColumn: `span ${span} / span ${span}` }}
                  className="min-w-0"
                >
                  {renderField(field)}
                </div>
              )
            })}
          </div>
        )}

        {/* Grouped fields */}
        {schema.groups?.map((group, i) => (
          <ProFormGroup
            key={i}
            group={group}
            watchValues={watchValues}
            renders={renders}
            validators={validators}
            uploadFn={uploadFn}
            disabled={disabled}
            globalColumns={columns}
          />
        ))}

        {/* Submit/Reset buttons */}
        {(schema.showSubmit !== false || schema.showReset !== false) && (
          <div className={cn('flex items-center gap-3 pt-2', submitAlignClass)}>
            {schema.showReset !== false && (
              <Button
                type="button"
                variant="outline"
                disabled={loading || formState.isSubmitting}
                onClick={() => { reset(computedDefaults); onReset?.() }}
              >
                {schema.resetText ?? '重置'}
              </Button>
            )}
            {schema.showSubmit !== false && (
              <Button type="submit" disabled={loading || formState.isSubmitting}>
                {(loading || formState.isSubmitting) && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                {schema.submitText ?? '提交'}
              </Button>
            )}
          </div>
        )}
      </form>
    </Form>
  )
}
