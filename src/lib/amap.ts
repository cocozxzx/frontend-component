export const AMAP_KEY = import.meta.env.VITE_AMAP_KEY
export const DEFAULT_CENTER: [number, number] = [116.397428, 39.90923]
export const DEFAULT_ZOOM = 12

// Singleton promise — prevents duplicate script injection across multiple map components
let loadPromise: Promise<typeof AMap> | null = null

export function loadAMap(key: string, plugins: string[] = []): Promise<typeof AMap> {
  if (window.AMap) {
    if (plugins.length) {
      return new Promise<typeof AMap>((resolve, reject) => {
        try {
          window.AMap.plugin(plugins, () => resolve(window.AMap))
        } catch {
          reject(new Error('高德地图插件加载失败'))
        }
      })
    }
    return Promise.resolve(window.AMap)
  }

  if (loadPromise) return loadPromise

  loadPromise = new Promise<typeof AMap>((resolve, reject) => {
    const script = document.createElement('script')
    const pluginStr = plugins.length ? `&plugin=${plugins.join(',')}` : ''
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${key}${pluginStr}`
    script.async = true
    script.onload = () => resolve(window.AMap)
    script.onerror = () => {
      loadPromise = null
      reject(new Error('高德地图 SDK 加载失败，请检查网络连接或 API Key'))
    }
    document.head.appendChild(script)
  })

  return loadPromise
}

export function loadPlugin(plugins: string[]): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      window.AMap.plugin(plugins, resolve)
    } catch {
      reject(new Error(`高德地图插件加载失败: ${plugins.join(', ')}`))
    }
  })
}

export function resolveIsDark(colorMode: 'light' | 'dark' | 'system'): boolean {
  if (colorMode === 'dark') return true
  if (colorMode === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches
  return false
}
