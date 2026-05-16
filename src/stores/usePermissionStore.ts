import { create } from 'zustand'

interface PermissionStore {
  /** 权限标识列表，'*' 表示超级管理员 */
  permissions: string[]
  /** 角色列表 */
  roles: string[]

  setPermissions: (permissions: string[], roles?: string[]) => void
  /** OR 逻辑：包含任意一个即通过 */
  hasPermission: (permission: string | string[]) => boolean
  /** AND 逻辑：必须包含全部才通过 */
  hasAllPermissions: (permissions: string[]) => boolean
  hasRole: (role: string | string[]) => boolean
  reset: () => void
}

export const usePermissionStore = create<PermissionStore>()((set, get) => ({
  permissions: ['*'],
  roles: [],

  setPermissions: (permissions, roles = []) => set({ permissions, roles }),

  hasPermission: (permission) => {
    const { permissions } = get()
    if (permissions.includes('*')) return true
    if (Array.isArray(permission)) return permission.some((p) => permissions.includes(p))
    return permissions.includes(permission)
  },

  hasAllPermissions: (perms) => {
    const { permissions } = get()
    if (permissions.includes('*')) return true
    return perms.every((p) => permissions.includes(p))
  },

  hasRole: (role) => {
    const { roles } = get()
    if (Array.isArray(role)) return role.some((r) => roles.includes(r))
    return roles.includes(role)
  },

  reset: () => set({ permissions: [], roles: [] }),
}))
