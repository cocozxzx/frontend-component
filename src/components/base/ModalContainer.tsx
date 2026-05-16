import { useState } from 'react'
import { AlertTriangle, CheckCircle2, XCircle, Info, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { useModalStore, type ModalItem, type ModalType } from '@/stores/useModalStore'
import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

type ButtonVariant = ComponentProps<typeof Button>['variant']

// ─── Icon + button variant per modalType ─────────────────────────────────────

const typeConfig: Record<
  ModalType,
  { icon: React.ElementType | null; iconClass: string; confirmVariant: ButtonVariant }
> = {
  default: { icon: null, iconClass: '', confirmVariant: 'default' },
  info: { icon: Info, iconClass: 'text-info', confirmVariant: 'default' },
  success: { icon: CheckCircle2, iconClass: 'text-success', confirmVariant: 'default' },
  warning: { icon: AlertTriangle, iconClass: 'text-warning', confirmVariant: 'default' },
  danger: { icon: ShieldAlert, iconClass: 'text-destructive', confirmVariant: 'destructive' },
  error: { icon: XCircle, iconClass: 'text-destructive', confirmVariant: 'destructive' },
}

// ─── Single modal ─────────────────────────────────────────────────────────────

function ModalDialog({ item }: { item: ModalItem }) {
  const remove = useModalStore((s) => s.remove)
  const [loading, setLoading] = useState(false)
  const config = typeConfig[item.modalType ?? 'default']
  const Icon = config.icon

  const close = (value: boolean) => {
    item.resolve(value)
    remove(item.id)
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      close(true)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => close(false)

  return (
    <Dialog open onOpenChange={(open) => !open && close(false)}>
      <DialogContent className="max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {Icon && <Icon size={20} className={config.iconClass} />}
            {item.title}
          </DialogTitle>
          {item.content && (
            <DialogDescription asChild>
              <div className="pt-1 text-sm text-foreground/80">{item.content}</div>
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogFooter>
          {item.type === 'confirm' && (
            <Button variant="outline" onClick={handleCancel}>
              {item.cancelText ?? '取消'}
            </Button>
          )}
          <Button
            variant={config.confirmVariant}
            disabled={loading}
            onClick={handleConfirm}
          >
            {item.confirmText ?? '确认'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Container — renders entire queue ─────────────────────────────────────────

export function ModalContainer() {
  const modals = useModalStore((s) => s.modals)
  return (
    <>
      {modals.map((item) => (
        <ModalDialog key={item.id} item={item} />
      ))}
    </>
  )
}
