import { useState } from 'react'
import { Plus, Search, Download, Trash2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppButton } from '@/components/base/AppButton'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'variant', type: "'default'|'destructive'|'outline'|'secondary'|'ghost'|'link'", default: "'default'", description: '按钮变体' },
  { name: 'size', type: "'default'|'sm'|'lg'|'icon'", default: "'default'", description: '按钮尺寸' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用状态' },
  { name: 'loading', type: 'boolean', default: 'false', description: '(AppButton) 显示加载状态' },
  { name: 'throttleTime', type: 'number', default: '0', description: '(AppButton) 点击节流时间 ms' },
  { name: 'permission', type: 'string | string[]', description: '(AppButton) 权限标识，无权限时禁用' },
  { name: 'hideOnNoPermission', type: 'boolean', default: 'false', description: '(AppButton) 无权限时隐藏' },
]

export default function ButtonPage() {
  const [asyncLoading, setAsyncLoading] = useState(false)

  async function handleAsync() {
    setAsyncLoading(true)
    await new Promise((r) => setTimeout(r, 2000))
    setAsyncLoading(false)
  }

  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Button 按钮"
        description="触发即时操作的基础交互组件。AppButton 在 shadcn Button 基础上增加了 loading、节流、权限控制能力。"
        tags={['shadcn/ui', '基础组件']}
      />

      <DemoSection title="变体 Variant">
        <ComponentDemo
          title="六种内置变体"
          code={`<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>`}
        >
          <div className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="尺寸 Size">
        <ComponentDemo
          title="四种尺寸"
          code={`<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Plus size={16} /></Button>`}
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon"><Plus size={16} /></Button>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="图标按钮">
        <ComponentDemo
          title="左侧图标 / 右侧图标 / 纯图标"
          code={`<Button><Search size={15} />搜索</Button>
<Button variant="outline"><Download size={15} />导出</Button>
<Button variant="destructive"><Trash2 size={15} />删除</Button>
<Button variant="secondary"><Send size={15} /></Button>`}
        >
          <div className="flex flex-wrap gap-3">
            <Button><Search size={15} />搜索</Button>
            <Button variant="outline"><Download size={15} />导出</Button>
            <Button variant="destructive"><Trash2 size={15} />删除</Button>
            <Button size="icon" variant="secondary"><Send size={15} /></Button>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="AppButton 扩展">
        <ComponentDemo
          title="异步 Loading + 节流 + 权限控制"
          code={`// Loading 自动跟随 async 函数
<AppButton loading={loading} onClick={handleAsync}>异步提交</AppButton>

// 节流 2s，防止重复点击
<AppButton throttleTime={2000} onClick={handler}>节流按钮</AppButton>

// 无权限时禁用 / 隐藏
<AppButton permission="admin:write">需要权限</AppButton>
<AppButton permission="admin:write" hideOnNoPermission>无权限时隐藏</AppButton>`}
        >
          <div className="flex flex-wrap gap-3">
            <AppButton loading={asyncLoading} onClick={handleAsync}>
              {asyncLoading ? '提交中...' : '异步提交'}
            </AppButton>
            <AppButton throttleTime={2000} onClick={() => alert('点击！再点需等 2s')}>
              节流 2s
            </AppButton>
            <AppButton disabled>禁用状态</AppButton>
            <AppButton permission="admin:write">需要 admin:write 权限</AppButton>
            <AppButton permission="admin:write" hideOnNoPermission>无权限时隐藏</AppButton>
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
