import { type ReactNode } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { Form } from '@/components/ui/form'
import { cn } from '@/lib/utils'

export interface AppFormProps<S extends z.ZodType> {
  schema: S
  defaultValues?: Partial<z.infer<S>>
  onSubmit: (values: z.infer<S>) => void | Promise<void>
  children: ReactNode | ((form: UseFormReturn<z.infer<S>>) => ReactNode)
  layout?: 'vertical' | 'horizontal'
  /** Label width for horizontal layout (e.g. '100px') */
  labelWidth?: string
  className?: string
}

export function AppForm<S extends z.ZodType>({
  schema,
  defaultValues,
  onSubmit,
  children,
  layout = 'vertical',
  labelWidth = '100px',
  className,
}: AppFormProps<S>) {
  type FormValues = z.infer<S>

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as FormValues,
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values)
  })

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className={cn(
          layout === 'horizontal' && '[&_.form-item]:flex [&_.form-item]:items-start [&_.form-item]:gap-4',
          className,
        )}
        style={
          layout === 'horizontal'
            ? ({ '--label-width': labelWidth } as React.CSSProperties)
            : undefined
        }
      >
        {typeof children === 'function' ? children(form) : children}
      </form>
    </Form>
  )
}
