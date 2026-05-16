import { forwardRef, type ReactNode, type InputHTMLAttributes } from 'react'
import { XCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 前置内容（图标或文字） */
  prefix?: ReactNode
  /** 后置内容（图标或文字） */
  suffix?: ReactNode
  /** 显示清除按钮，value 非空时出现 */
  allowClear?: boolean
  /** 显示字数统计（需配合 maxLength） */
  showCount?: boolean
  /** 后置位置显示加载旋转图标 */
  loading?: boolean
  /** 点击清除按钮的回调 */
  onClear?: () => void
  className?: string
}

export const AppInput = forwardRef<HTMLInputElement, AppInputProps>(
  (
    {
      prefix,
      suffix,
      allowClear = false,
      showCount = false,
      loading = false,
      onClear,
      onChange,
      value,
      maxLength,
      className,
      ...props
    },
    ref,
  ) => {
    const hasPrefix = !!prefix
    const hasRightAddon = !!suffix || allowClear || loading

    const handleClear = () => {
      onClear?.()
      // Synthesise a change event to clear controlled value
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value',
      )?.set
      if (ref && 'current' in ref && ref.current && nativeInputValueSetter) {
        nativeInputValueSetter.call(ref.current, '')
        ref.current.dispatchEvent(new Event('input', { bubbles: true }))
      }
      // Trigger onChange with empty string via synthetic event
      const syntheticEvent = {
        target: { value: '' },
        currentTarget: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>
      onChange?.(syntheticEvent)
    }

    const currentLength = typeof value === 'string' ? value.length : 0
    const showClearBtn = allowClear && value !== undefined && value !== ''

    return (
      <div className="relative w-full">
        {/* Prefix */}
        {hasPrefix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {prefix}
          </div>
        )}

        <input
          ref={ref}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm',
            'transition-colors placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            hasPrefix && 'pl-9',
            hasRightAddon && 'pr-9',
            className,
          )}
          {...props}
        />

        {/* Right addon (priority: loading > clear > suffix) */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground">
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <>
              {showClearBtn && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={handleClear}
                  className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                >
                  <XCircle size={14} />
                </button>
              )}
              {suffix && !showClearBtn && suffix}
            </>
          )}
        </div>

        {/* Character count */}
        {showCount && maxLength !== undefined && (
          <p className="mt-1 text-right text-xs text-muted-foreground">
            {currentLength} / {maxLength}
          </p>
        )}
      </div>
    )
  },
)
AppInput.displayName = 'AppInput'
