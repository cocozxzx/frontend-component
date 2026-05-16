import { forwardRef, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { Button, type ButtonProps } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { usePermissionStore } from '@/stores/usePermissionStore'

export interface AppButtonProps extends ButtonProps {
  /** 显示加载旋转图标并禁用点击 */
  loading?: boolean
  /** 节流时间(ms)，0 = 不节流 */
  throttleTime?: number
  /** 所需权限标识（单个或多个） */
  permission?: string | string[]
  /** 无权限时隐藏（true）还是禁用（false，默认） */
  hideOnNoPermission?: boolean
}

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    {
      loading = false,
      throttleTime = 0,
      permission,
      hideOnNoPermission = false,
      onClick,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const lastClickRef = useRef(0)
    const { hasPermission } = usePermissionStore()

    const noPermission = permission !== undefined && !hasPermission(permission)

    if (noPermission && hideOnNoPermission) return null

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (throttleTime > 0) {
        const now = Date.now()
        if (now - lastClickRef.current < throttleTime) return
        lastClickRef.current = now
      }
      onClick?.(e)
    }

    const button = (
      <Button
        ref={ref}
        disabled={disabled || loading || noPermission}
        onClick={handleClick}
        {...props}
      >
        {loading && <Loader2 size={14} className="mr-1.5 animate-spin" />}
        {children}
      </Button>
    )

    if (noPermission) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* span wrapper so tooltip fires even when button is disabled */}
              <span className="inline-flex cursor-not-allowed">{button}</span>
            </TooltipTrigger>
            <TooltipContent>无操作权限</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return button
  },
)
AppButton.displayName = 'AppButton'
