import { toast } from 'sonner'
import {
  LayoutTemplate, PanelLeft, LayoutDashboard,
  Sun, Moon, Monitor, RotateCcw, Copy,
} from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/useAppStore'
import { ThemeColorPicker } from './ThemeColorPicker'

interface ThemeDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ─── Small section heading ────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  )
}

// ─── Switch row ───────────────────────────────────────────────────────────────
function SwitchRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

// ─── ThemeDrawer ──────────────────────────────────────────────────────────────
export function ThemeDrawer({ open, onOpenChange }: ThemeDrawerProps) {
  const {
    layoutMode, setLayoutMode,
    colorMode, setColorMode,
    primaryColor, setPrimaryColor,
    fixedHeader, showBreadcrumb, showFooter, compactMode, accordionMenu, updateConfig,
    sidebarWidth, setSidebarWidth,
    borderRadius, setBorderRadius,
    resetConfig, getConfigJson,
  } = useAppStore()

  const layoutOptions = [
    { value: 'top', label: '顶部导航', icon: LayoutTemplate },
    { value: 'side', label: '侧边导航', icon: PanelLeft },
    { value: 'mix', label: '混合导航', icon: LayoutDashboard },
  ] as const

  const colorModeOptions = [
    { value: 'light', label: '亮色', icon: Sun },
    { value: 'dark', label: '暗色', icon: Moon },
    { value: 'system', label: '跟随系统', icon: Monitor },
  ] as const

  const handleCopyConfig = async () => {
    try {
      await navigator.clipboard.writeText(getConfigJson())
      toast.success('配置已复制', { description: '可粘贴到配置文件中使用' })
    } catch {
      toast.error('复制失败', { description: '请手动复制' })
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-[320px] flex-col gap-0 p-0"
      >
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle>主题配置</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* 导航布局 */}
          <div>
            <SectionTitle>导航布局</SectionTitle>
            <div className="grid grid-cols-3 gap-2">
              {layoutOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setLayoutMode(value)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-lg border-2 py-3 text-xs transition-colors',
                    layoutMode === value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-muted-foreground/40',
                  )}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* 整体风格 */}
          <div>
            <SectionTitle>整体风格</SectionTitle>
            <div className="grid grid-cols-3 gap-2">
              {colorModeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setColorMode(value)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-lg border-2 py-3 text-xs transition-colors',
                    colorMode === value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-muted-foreground/40',
                  )}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* 主题色 */}
          <div>
            <SectionTitle>主题色</SectionTitle>
            <ThemeColorPicker
              value={primaryColor}
              onChange={setPrimaryColor}
            />
          </div>

          <Separator />

          {/* 界面设置 */}
          <div>
            <SectionTitle>界面设置</SectionTitle>
            <div className="divide-y divide-border">
              <SwitchRow
                label="固定顶栏"
                checked={fixedHeader}
                onCheckedChange={(v) => updateConfig({ fixedHeader: v })}
              />
              <SwitchRow
                label="显示面包屑"
                checked={showBreadcrumb}
                onCheckedChange={(v) => updateConfig({ showBreadcrumb: v })}
              />
              <SwitchRow
                label="显示页脚"
                checked={showFooter}
                onCheckedChange={(v) => updateConfig({ showFooter: v })}
              />
              <SwitchRow
                label="紧凑模式"
                checked={compactMode}
                onCheckedChange={(v) => {
                  document.documentElement.classList.toggle('compact', v)
                  updateConfig({ compactMode: v })
                }}
              />
              <SwitchRow
                label="手风琴菜单"
                checked={accordionMenu}
                onCheckedChange={(v) => updateConfig({ accordionMenu: v })}
              />
            </div>
          </div>

          <Separator />

          {/* 尺寸调节 */}
          <div>
            <SectionTitle>尺寸调节</SectionTitle>
            <div className="space-y-5">
              {/* 菜单宽度 — 仅 side/mix 模式显示 */}
              {(layoutMode === 'side' || layoutMode === 'mix') && (
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>菜单宽度</span>
                    <span className="tabular-nums text-muted-foreground">{sidebarWidth}px</span>
                  </div>
                  <Slider
                    min={160}
                    max={280}
                    step={10}
                    value={[sidebarWidth]}
                    onValueChange={([v]) => setSidebarWidth(v)}
                  />
                </div>
              )}

              {/* 全局圆角 */}
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>全局圆角</span>
                  <span className="tabular-nums text-muted-foreground">{borderRadius}px</span>
                </div>
                <Slider
                  min={0}
                  max={16}
                  step={2}
                  value={[borderRadius]}
                  onValueChange={([v]) => setBorderRadius(v)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作区 */}
        <div className="border-t border-border px-5 py-4">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={resetConfig}
            >
              <RotateCcw size={14} className="mr-1.5" />
              重置配置
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCopyConfig}
            >
              <Copy size={14} className="mr-1.5" />
              复制配置
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
