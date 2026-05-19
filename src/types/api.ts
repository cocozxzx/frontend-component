// ─── 通用响应结构 ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

export interface PageResult<T = unknown> {
  list: T[]
  total: number
  pageIndex: number
  pageSize: number
}

export type PageResponse<T = unknown> = ApiResponse<PageResult<T>>

// ─── 通用查询参数 ─────────────────────────────────────────────────────────────

export interface PageParams {
  pageIndex: number
  pageSize: number
  [key: string]: unknown
}

// ─── 用户相关 ─────────────────────────────────────────────────────────────────

export interface UserInfo {
  id: string | number
  name: string
  avatar?: string
  email?: string
  roles: string[]
  permissions: string[]
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  refreshToken?: string
  userInfo: UserInfo
}

// ─── 菜单相关 ─────────────────────────────────────────────────────────────────

export interface MenuItem {
  key: string
  label: string
  icon?: string
  path?: string
  children?: MenuItem[]
  hidden?: boolean
  permission?: string | string[]
}

// ─── 文件上传 ─────────────────────────────────────────────────────────────────

export interface UploadResult {
  url: string
  name: string
  size: number
  type: string
}
