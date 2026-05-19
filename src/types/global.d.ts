/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// ─── 环境变量类型 ─────────────────────────────────────────────────────────────

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_AMAP_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// ─── 高德地图全局类型 ─────────────────────────────────────────────────────────

declare const AMap: unknown

// ─── 全局工具类型 ─────────────────────────────────────────────────────────────

type Nullable<T> = T | null
type Optional<T> = T | undefined
type Recordable<T = unknown> = Record<string, T>
type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] }
