import { useState } from 'react'
import { Download, Plus, Search, Trash2 } from 'lucide-react'
import { AppButton } from '@/components/base/AppButton'
import { Button } from '@/components/ui/button'

export default function ButtonPage() {
  const [loading, setLoading] = useState(false)

  const handleAsync = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 2000))
    setLoading(false)
  }

  return (
    <div className="p-6 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold">Button 按钮</h1>
        <p className="mt-1 text-muted-foreground text-sm">常用的操作按钮，AppButton 在原生基础上增加了 loading、节流、权限控制。</p>
      </div>

      <section className="space-y-3">
        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">变体 Variant</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">尺寸 Size</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon"><Plus size={16} /></Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">带图标</h2>
        <div className="flex flex-wrap gap-3">
          <Button><Plus size={16} className="mr-1" />新增</Button>
          <Button variant="outline"><Search size={16} className="mr-1" />搜索</Button>
          <Button variant="secondary"><Download size={16} className="mr-1" />导出</Button>
          <Button variant="destructive"><Trash2 size={16} className="mr-1" />删除</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">AppButton — Loading & 节流</h2>
        <div className="flex flex-wrap gap-3">
          <AppButton loading={loading} onClick={handleAsync}>
            {loading ? '提交中...' : '异步提交'}
          </AppButton>
          <AppButton throttleTime={2000} onClick={() => alert('点击了！再点需等 2s')}>
            节流 2s
          </AppButton>
          <AppButton loading>强制 Loading</AppButton>
          <AppButton disabled>禁用</AppButton>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">AppButton — 权限控制</h2>
        <div className="flex flex-wrap gap-3">
          <AppButton permission="admin:write">有权限才可点击</AppButton>
          <AppButton permission="admin:write" hideOnNoPermission>无权限时隐藏</AppButton>
        </div>
        <p className="text-xs text-muted-foreground">（当前用户无 admin:write 权限，按钮为禁用/隐藏状态）</p>
      </section>
    </div>
  )
}
