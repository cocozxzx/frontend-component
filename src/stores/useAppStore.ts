import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { applyThemeColor } from '@/lib/theme-utils'

interface AppConfig {
  layoutMode: 'top' | 'side' | 'mix'
  sidebarCollapsed: boolean
  sidebarWidth: number
  primaryColor: string
  colorMode: 'light' | 'dark' | 'system'
  showBreadcrumb: boolean
  showFooter: boolean
  fixedHeader: boolean
  compactMode: boolean
  borderRadius: number
  accordionMenu: boolean
}

interface AppStore extends AppConfig {
  setLayoutMode: (mode: AppConfig['layoutMode']) => void
  toggleSidebar: () => void
  setSidebarWidth: (width: number) => void
  setPrimaryColor: (color: string) => void
  setColorMode: (mode: AppConfig['colorMode']) => void
  setBorderRadius: (radius: number) => void
  setCompactMode: (compact: boolean) => void
  resetConfig: () => void
  getConfigJson: () => string
}

const defaultConfig: AppConfig = {
  layoutMode: 'top',
  sidebarCollapsed: false,
  sidebarWidth: 200,
  primaryColor: '#1890FF',
  colorMode: 'light',
  showBreadcrumb: true,
  showFooter: true,
  fixedHeader: true,
  compactMode: false,
  borderRadius: 6,
  accordionMenu: true,
}

function applyDarkMode(mode: AppConfig['colorMode']): void {
  const root = document.documentElement
  if (mode === 'dark') {
    root.classList.add('dark')
  } else if (mode === 'light') {
    root.classList.remove('dark')
  } else {
    root.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches)
  }
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...defaultConfig,

      setLayoutMode: (mode) => set({ layoutMode: mode }),

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      setSidebarWidth: (width) => set({ sidebarWidth: width }),

      setPrimaryColor: (color) => {
        applyThemeColor(color)
        set({ primaryColor: color })
      },

      setColorMode: (mode) => {
        applyDarkMode(mode)
        set({ colorMode: mode })
      },

      setBorderRadius: (radius) => {
        document.documentElement.style.setProperty('--radius', `${radius / 16}rem`)
        set({ borderRadius: radius })
      },

      setCompactMode: (compact) => {
        document.documentElement.classList.toggle('compact', compact)
        set({ compactMode: compact })
      },

      resetConfig: () => {
        applyThemeColor(defaultConfig.primaryColor)
        document.documentElement.classList.remove('dark', 'compact')
        document.documentElement.style.setProperty('--radius', `${defaultConfig.borderRadius / 16}rem`)
        set(defaultConfig)
      },

      getConfigJson: () => {
        const { layoutMode, sidebarCollapsed, sidebarWidth, primaryColor, colorMode,
          showBreadcrumb, showFooter, fixedHeader, compactMode, borderRadius, accordionMenu } = get()
        return JSON.stringify(
          { layoutMode, sidebarCollapsed, sidebarWidth, primaryColor, colorMode,
            showBreadcrumb, showFooter, fixedHeader, compactMode, borderRadius, accordionMenu },
          null, 2
        )
      },
    }),
    { name: 'app-config' }
  )
)
