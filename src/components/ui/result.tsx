import type { ReactNode } from 'react'
import {
  CheckCircle2, XCircle, AlertTriangle, Info,
  ShieldOff, FileQuestion, ServerCrash,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { H3, Muted } from './typography'

type ResultStatus = 'success' | 'error' | 'warning' | 'info' | '403' | '404' | '500'

interface StatusConfig {
  icon: LucideIcon
  className: string
}

const statusMap: Record<ResultStatus, StatusConfig> = {
  success: { icon: CheckCircle2, className: 'text-success' },
  error: { icon: XCircle, className: 'text-destructive' },
  warning: { icon: AlertTriangle, className: 'text-warning' },
  info: { icon: Info, className: 'text-info' },
  '403': { icon: ShieldOff, className: 'text-muted-foreground' },
  '404': { icon: FileQuestion, className: 'text-muted-foreground' },
  '500': { icon: ServerCrash, className: 'text-muted-foreground' },
}

interface ResultProps {
  status: ResultStatus
  title: string
  subTitle?: string
  extra?: ReactNode
  icon?: ReactNode
  className?: string
}

export function Result({ status, title, subTitle, extra, icon, className }: ResultProps) {
  const config = statusMap[status]
  const Icon = config.icon

  return (
    <div className={cn('flex flex-col items-center py-10 text-center', className)}>
      <div className="mb-5">
        {icon ?? <Icon size={72} className={config.className} strokeWidth={1.5} />}
      </div>
      <H3>{title}</H3>
      {subTitle && <Muted className="mt-2">{subTitle}</Muted>}
      {extra && <div className="mt-6 flex items-center gap-3">{extra}</div>}
    </div>
  )
}
