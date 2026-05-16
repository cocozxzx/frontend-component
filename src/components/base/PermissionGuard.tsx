import type { ReactNode } from 'react'
import { usePermissionStore } from '@/stores/usePermissionStore'

export interface PermissionGuardProps {
  /** 需要的权限标识（单个或多个，多个为 OR 逻辑） */
  permission: string | string[]
  /** 无权限时展示的内容，默认 null */
  fallback?: ReactNode
  children: ReactNode
}

export function PermissionGuard({ permission, fallback = null, children }: PermissionGuardProps) {
  const hasPermission = usePermissionStore((s) => s.hasPermission)
  return hasPermission(permission) ? <>{children}</> : <>{fallback}</>
}
