import { useState, type ReactNode, type ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'

type ButtonVariant = ComponentProps<typeof Button>['variant']

export interface AppModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children?: ReactNode
  /** null = hide footer entirely */
  footer?: ReactNode | null
  confirmText?: string
  cancelText?: string
  confirmVariant?: ButtonVariant
  /** External loading flag; if omitted, auto-managed during async onConfirm */
  loading?: boolean
  /** Supports async: button stays in loading state until promise resolves */
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  /** DialogContent max-width (default 520px) */
  width?: string | number
  /** Show × close button (default true) */
  closable?: boolean
  /** Close on backdrop click (default true) */
  maskClosable?: boolean
}

export function AppModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  confirmText = '确认',
  cancelText = '取消',
  confirmVariant = 'default',
  loading: externalLoading,
  onConfirm,
  onCancel,
  width = 520,
  closable = true,
  maskClosable = true,
}: AppModalProps) {
  const [internalLoading, setInternalLoading] = useState(false)
  const isLoading = externalLoading ?? internalLoading

  const handleOpenChange = (next: boolean) => {
    if (!next && !maskClosable) return
    onOpenChange(next)
  }

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

  const maxWidth = typeof width === 'number' ? `${width}px` : width

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        style={{ maxWidth }}
        // Hide the default × button when closable=false
        className={!closable ? '[&>button]:hidden' : undefined}
      >
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}

        {children && <div className="py-2">{children}</div>}

        {footer !== null && (
          <DialogFooter>
            {footer ?? (
              <>
                <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                  {cancelText}
                </Button>
                <Button
                  variant={confirmVariant}
                  onClick={handleConfirm}
                  disabled={isLoading}
                  loading={isLoading}
                >
                  {confirmText}
                </Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
