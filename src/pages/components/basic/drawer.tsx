import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AppDrawer } from '@/components/base/AppDrawer'
import { toast } from '@/hooks/useToast'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'open', type: 'boolean', required: true, description: '受控显示状态' },
  { name: 'title', type: 'string', description: '抽屉标题' },
  { name: 'side', type: "'right'|'left'|'top'|'bottom'", default: "'right'", description: '弹出方向' },
  { name: 'size', type: "'sm'|'md'|'lg'|'full'", default: "'md'", description: '抽屉宽/高' },
  { name: 'onConfirm', type: '() => void | Promise<void>', description: '确认回调，支持 async' },
  { name: 'onCancel', type: '() => void', description: '取消/关闭回调' },
]

type Side = 'right' | 'left' | 'top' | 'bottom'
type Size = 'sm' | 'md' | 'lg' | 'full'

export default function DrawerPage() {
  const [side, setSide] = useState<Side>('right')
  const [size, setSize] = useState<Size>('md')
  const [open, setOpen] = useState(false)
  const [loadingOpen, setLoadingOpen] = useState(false)

  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Drawer 抽屉"
        description="从边缘滑入的抽屉面板。AppDrawer 基于 shadcn Sheet 封装，支持四个方向、四种尺寸和异步确认。"
        tags={['shadcn/ui', '基础组件']}
      />

      <DemoSection title="四个方向">
        <ComponentDemo title="right / left / top / bottom" code={`<AppDrawer side="right" open={open} title="右侧抽屉" onCancel={() => setOpen(false)}>
  内容
</AppDrawer>`}>
          <div className="flex flex-wrap gap-2">
            {(['right', 'left', 'top', 'bottom'] as Side[]).map((s) => (
              <Button key={s} variant="outline" onClick={() => { setSide(s); setOpen(true) }}>
                {s}
              </Button>
            ))}
          </div>
          <AppDrawer side={side} open={open} title={`${side} 方向抽屉`} onCancel={() => setOpen(false)}>
            <p className="text-sm text-muted-foreground">这是从 {side} 方向弹出的抽屉内容区域。</p>
          </AppDrawer>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="四种尺寸">
        <ComponentDemo title="sm / md / lg / full" code={`<AppDrawer size="lg" open={open} title="大尺寸抽屉" onCancel={() => setOpen(false)} />`}>
          <div className="flex flex-wrap gap-2">
            {(['sm', 'md', 'lg', 'full'] as Size[]).map((s) => (
              <Button key={s} variant="outline" onClick={() => { setSize(s); setOpen(true) }}>
                {s}
              </Button>
            ))}
          </div>
          <AppDrawer size={size} open={open} title={`${size} 尺寸抽屉`} onCancel={() => setOpen(false)}>
            <p className="text-sm text-muted-foreground">当前尺寸：{size}</p>
          </AppDrawer>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="异步确认 Loading">
        <ComponentDemo title="onConfirm 为 async 时自动 loading" code={`<AppDrawer onConfirm={async () => { await save(); setOpen(false) }} />`}>
          <Button onClick={() => setLoadingOpen(true)}>打开带确认按钮的抽屉</Button>
          <AppDrawer
            open={loadingOpen}
            title="保存配置"
            onConfirm={async () => {
              await new Promise<void>((r) => setTimeout(r, 1500))
              toast.success('保存成功')
              setLoadingOpen(false)
            }}
            onCancel={() => setLoadingOpen(false)}
          >
            <p className="text-sm text-muted-foreground">点击确认后异步保存（1.5s），按钮自动 loading。</p>
          </AppDrawer>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
