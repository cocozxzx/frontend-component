import chroma from 'chroma-js'

export interface ColorScale {
  primary: string
  primaryLight: string
  primaryDark: string
  primaryHover: string
  primaryActive: string
}

export const PRESET_COLORS = [
  { name: '科技蓝', value: '#1890FF' },
  { name: '活力橙', value: '#FA8C16' },
  { name: '翡翠绿', value: '#52C41A' },
  { name: '紫罗兰', value: '#722ED1' },
  { name: '玫瑰红', value: '#EB2F96' },
] as const

export function hexToHsl(hex: string): string {
  const [h, s, l] = chroma(hex).hsl()
  return `${Math.round(h ?? 0)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

export function generateColorScale(hex: string): ColorScale {
  const base = chroma(hex)
  return {
    primary: hexToHsl(hex),
    // 主色与白色 90% 混合 → 10% 透明度等效的浅背景色
    primaryLight: hexToHsl(chroma.mix(hex, '#ffffff', 0.9, 'rgb').hex()),
    primaryDark: hexToHsl(base.darken(1).hex()),
    primaryHover: hexToHsl(base.brighten(0.5).hex()),
    primaryActive: hexToHsl(base.darken(0.5).hex()),
  }
}

export function applyThemeColor(hex: string): void {
  const scale = generateColorScale(hex)
  const root = document.documentElement
  root.style.setProperty('--primary', scale.primary)
  root.style.setProperty('--primary-light', scale.primaryLight)
  root.style.setProperty('--primary-dark', scale.primaryDark)
  root.style.setProperty('--primary-hover', scale.primaryHover)
  root.style.setProperty('--primary-active', scale.primaryActive)
  // 同步更新衍生变量
  root.style.setProperty('--ring', scale.primary)
  root.style.setProperty('--info', scale.primary)
  root.style.setProperty('--sidebar-accent', scale.primary)
  root.style.setProperty('--sidebar-primary', scale.primary)
  root.style.setProperty('--sidebar-ring', scale.primary)
}
