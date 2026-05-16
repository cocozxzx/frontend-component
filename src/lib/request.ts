import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { toast } from '@/hooks/useToast'

export interface RequestConfig extends AxiosRequestConfig {
  /** false = 不自动弹出错误提示 */
  showError?: boolean
}

export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

// 防止 401 重复跳转
let isRedirectingToLogin = false

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string | undefined ?? '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── 请求拦截 ─────────────────────────────────────────────────────────────────
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── 响应拦截 ─────────────────────────────────────────────────────────────────
instance.interceptors.response.use(
  (response) => {
    const cfg = response.config as RequestConfig
    const showError = cfg.showError !== false

    const res = response.data as ApiResponse
    if (res && typeof res === 'object' && 'code' in res) {
      if (res.code === 200) return res.data

      if (res.code === 401) {
        if (!isRedirectingToLogin) {
          isRedirectingToLogin = true
          localStorage.removeItem('token')
          if (showError) toast.error('登录已过期，请重新登录')
          window.location.replace('/login')
          setTimeout(() => { isRedirectingToLogin = false }, 3000)
        }
        return Promise.reject(new Error(res.message ?? '登录已过期'))
      }

      if (res.code === 403) {
        if (showError) toast.error('无操作权限')
        return Promise.reject(new Error(res.message ?? '无操作权限'))
      }

      if (showError) toast.error(res.message ?? '请求失败')
      return Promise.reject(new Error(res.message ?? '请求失败'))
    }

    return response.data
  },
  (error) => {
    const cfg = (error.config ?? {}) as RequestConfig
    const showError = cfg.showError !== false

    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }

    if (!error.response) {
      if (showError) toast.error('网络连接失败，请检查网络')
      return Promise.reject(error)
    }

    const { status } = error.response as { status: number }
    if (status === 401) {
      if (!isRedirectingToLogin) {
        isRedirectingToLogin = true
        localStorage.removeItem('token')
        if (showError) toast.error('登录已过期，请重新登录')
        window.location.replace('/login')
        setTimeout(() => { isRedirectingToLogin = false }, 3000)
      }
    } else if (status === 403) {
      if (showError) toast.error('无操作权限')
    } else if (status >= 500) {
      if (showError) toast.error('服务器错误，请稍后重试')
    }

    return Promise.reject(error)
  },
)

// ─── 快捷方法 ─────────────────────────────────────────────────────────────────
export const request = instance

export const get = <T = unknown>(url: string, config?: RequestConfig) =>
  instance.get<unknown, T>(url, config)

export const post = <T = unknown>(url: string, data?: unknown, config?: RequestConfig) =>
  instance.post<unknown, T>(url, data, config)

export const put = <T = unknown>(url: string, data?: unknown, config?: RequestConfig) =>
  instance.put<unknown, T>(url, data, config)

export const del = <T = unknown>(url: string, config?: RequestConfig) =>
  instance.delete<unknown, T>(url, config)

export const patch = <T = unknown>(url: string, data?: unknown, config?: RequestConfig) =>
  instance.patch<unknown, T>(url, data, config)
