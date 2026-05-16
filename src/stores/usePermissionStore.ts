import { create } from 'zustand'

interface PermissionStore {
  /** 当前用户权限列表，'*' 表示超级管理员（全部权限） */
  permissions: string[]
  setPermissions: (perms: string[]) => void
  hasPermission: (perm: string | string[]) => boolean
}

export const usePermissionStore = create<PermissionStore>()((set, get) => ({
  // 默认拥有全部权限；接入真实 auth 后通过 setPermissions 替换
  permissions: ['*'],

  setPermissions: (perms) => set({ permissions: perms }),

  hasPermission: (perm) => {
    const { permissions } = get()
    if (permissions.includes('*')) return true
    if (Array.isArray(perm)) return perm.every((p) => permissions.includes(p))
    return permissions.includes(perm)
  },
}))
