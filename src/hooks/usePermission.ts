import { usePermissionStore } from '@/stores/usePermissionStore'

export function usePermission() {
  const { permissions, roles, hasPermission, hasAllPermissions, hasRole } = usePermissionStore()

  return {
    permissions,
    roles,
    /** OR 逻辑：包含任意一个权限即通过 */
    can: (permission: string | string[]) => hasPermission(permission),
    /** AND 逻辑：必须包含全部权限才通过 */
    canAll: (perms: string[]) => hasAllPermissions(perms),
    /** 角色检查 */
    hasRole: (role: string | string[]) => hasRole(role),
    /** 是否超级管理员 */
    isAdmin: permissions.includes('*'),
  }
}
