import { useState, type ReactNode, type ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet, SheetContent, SheetDescription,
  SheetFooter, SheetHeader, SheetTitle,
} from '@/components/ui/sheet'
import { Spin } from '@/components/ui/spin'

type ButtonVariant = ComponentProps<typeof Button>['variant']
type SheetSide = 'left' | 'right' | 'top' | 'bottom'

type DrawerSize = 'sm' | 'md' | 'lg' | 'full'

const sideStyle: Record<SheetSide, Record<DrawerSize, React.CSSProperties>> = {
  left: { sm: { width: 320 }, md: { width: 480 }, lg: { width: 640 }, full: { width: '100%' } },
  right: { sm: { width: 320 }, md: { width: 480 }, lg: { width: 640 }, full: { width: '100%' } },
  top: { sm: { height: '30vh' }, md: { height: '50vh' }, lg: { height: '70vh' }, full: { height: '100%' } },
  bottom: { sm: { height: '30vh' }, md: { height: '50vh' }, lg: { height: '70vh' }, full: { height: '100%' } },
}

export interface AppDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children?: ReactNode
  footer?: ReactNode | null
  side?: SheetSide
  size?: DrawerSize
  loading?: boolean
  confirmText?: string
  cancelText?: string
  confirmVariant?: ButtonVariant
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
}

export function AppDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  side = 'right',
  size = 'md',
  loading: externalLoading,
  confirmText = '确认',
  cancelText = '取消',
  confirmVariant = 'default',
  onConfirm,
  onCancel,
}: AppDrawerProps) {
  const [internalLoading, setInternalLoading] = useState(false)
  const isLoading = externalLoading ?? internalLoading

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const handleConfirm = async () => {
    if (!onConfirm) { onOpenChange(false); return }
    const result = onConfirm()
    if (result instanceof Promise) {
      setInternalLoading(true)
      try {
        await result
        onOpenChange(false)
      } finally {
        setInternalLoading(false)
      }
    } else {
      onOpenChange(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        style={sideStyle[side][size]}
        className="flex flex-col p-0"
      >
        {(title || description) && (
          <SheetHeader className="border-b border-border px-5 py-4">
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        )}

        <div className="relative flex-1 overflow-y-auto px-5 py-4">
          <Spin spinning={isLoading}>{children}</Spin>
        </div>

        {footer !== null && (
          <SheetFooter className="border-t border-border px-5 py-4">
            {footer ?? (
              <>
                <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                  {cancelText}
                </Button>
                <Button
                  variant={confirmVariant}
                  onClick={handleConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? '处理中...' : confirmText}
                </Button>
              </>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
