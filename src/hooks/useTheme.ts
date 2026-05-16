import { useEffect } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { applyThemeColor } from '@/lib/theme-utils'

export function useTheme() {
  const colorMode = useAppStore((s) => s.colorMode)
  const setColorMode = useAppStore((s) => s.setColorMode)
  const primaryColor = useAppStore((s) => s.primaryColor)
  const setPrimaryColor = useAppStore((s) => s.setPrimaryColor)
  const borderRadius = useAppStore((s) => s.borderRadius)

  // 应用启动时初始化：主题色 + 圆角 + 明暗模式
  useEffect(() => {
    applyThemeColor(primaryColor)
    document.documentElement.style.setProperty('--radius', `${borderRadius / 16}rem`)

    const root = document.documentElement
    if (colorMode === 'dark') {
      root.classList.add('dark')
    } else if (colorMode === 'light') {
      root.classList.remove('dark')
    } else {
      root.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // colorMode 为 'system' 时监听系统主题变化
  useEffect(() => {
    if (colorMode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [colorMode])

  const isDark =
    colorMode === 'dark' ||
    (colorMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return { colorMode, setColorMode, primaryColor, setPrimaryColor, isDark }
}
