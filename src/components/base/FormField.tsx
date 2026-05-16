import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { useFormContext, type ControllerRenderProps } from 'react-hook-form'
import { Info } from 'lucide-react'
import {
  FormField as ShadcnFormField,
  FormItem, FormLabel, FormControl, FormMessage,
} from '@/components/ui/form'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type FieldChildren =
  | ReactElement
  | ((field: ControllerRenderProps) => ReactNode)

export interface FormFieldProps {
  /** 对应 schema 中的字段名 */
  name: string
  label?: string
  required?: boolean
  /** label 右侧 tooltip 说明 */
  tooltip?: string
  children: FieldChildren
  className?: string
}

export function FormField({
  name,
  label,
  required,
  tooltip,
  children,
  className,
}: FormFieldProps) {
  const { control } = useFormContext()

  return (
    <ShadcnFormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('space-y-1.5', className)}>
          {label && (
            <FormLabel className="flex items-center gap-1">
              {required && <span className="text-destructive">*</span>}
              {label}
              {tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={13} className="cursor-help text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>{tooltip}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </FormLabel>
          )}
          <FormControl>
            {typeof children === 'function'
              ? children(field)
              : isValidElement(children)
              ? cloneElement(children as ReactElement<Record<string, unknown>>, {
                  ...field,
                  // Preserve children's own onChange/onBlur if they have specific logic
                  onChange: (children.props as Record<string, unknown>).onChange
                    ? (...args: unknown[]) => {
                        field.onChange(...args)
                        ;((children.props as Record<string, unknown>).onChange as (...args: unknown[]) => void)?.(...args)
                      }
                    : field.onChange,
                })
              : children}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
