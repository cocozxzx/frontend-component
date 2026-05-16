import chroma from 'chroma-js'

export function getChartColors(primaryColor: string): string[] {
  try {
    const base = chroma(primaryColor)
    return Array.from({ length: 8 }, (_, i) =>
      base.set('hsl.h', `+${i * 40}`).hex(),
    )
  } catch {
    return ['#1890FF', '#52C41A', '#FA8C16', '#722ED1', '#EB2F96', '#13C2C2', '#FAAD14', '#F5222D']
  }
}

export type ColorMode = 'light' | 'dark' | 'system'

export function isDarkMode(colorMode: ColorMode): boolean {
  if (colorMode === 'dark') return true
  if (colorMode === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches
  return false
}

export function getBaseOption(primaryColor: string, colorMode: ColorMode) {
  const dark = isDarkMode(colorMode)
  const colors = getChartColors(primaryColor)

  return {
    color: colors,
    backgroundColor: 'transparent',
    textStyle: { color: dark ? '#aaaaaa' : '#666666', fontFamily: 'inherit' },
    grid: { borderColor: dark ? 'rgba(255,255,255,0.1)' : '#f0f0f0' },
    xAxis: {
      axisLine: { lineStyle: { color: dark ? 'rgba(255,255,255,0.2)' : '#d9d9d9' } },
      axisLabel: { color: dark ? '#aaa' : '#666' },
      splitLine: { lineStyle: { color: dark ? 'rgba(255,255,255,0.1)' : '#f0f0f0' } },
    },
    yAxis: {
      axisLine: { lineStyle: { color: dark ? 'rgba(255,255,255,0.2)' : '#d9d9d9' } },
      axisLabel: { color: dark ? '#aaa' : '#666' },
      splitLine: { lineStyle: { color: dark ? 'rgba(255,255,255,0.1)' : '#f0f0f0' } },
    },
    legend: { textStyle: { color: dark ? '#aaa' : '#666' } },
    tooltip: {
      backgroundColor: dark ? 'rgba(30,30,40,0.95)' : 'rgba(255,255,255,0.97)',
      borderColor: dark ? 'rgba(255,255,255,0.1)' : '#e8e8e8',
      textStyle: { color: dark ? '#eee' : '#333' },
      extraCssText: 'box-shadow:0 4px 12px rgba(0,0,0,0.15);border-radius:8px;',
    },
  } as const
}
