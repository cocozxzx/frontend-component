import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AppDrawer } from '@/components/base/AppDrawer'
import { toast } from '@/hooks/useToast'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'open', type: 'boolean', required: true, description: '受控显示状态' },
  { name: 'onOpenChange', type: '(open: boolean) => void', required: true, description: 'Sheet 开关回调（X 按钮 / 遮罩点击均会触发）' },
  { name: 'title', type: 'string', description: '抽屉标题' },
  { name: 'side', type: "'right'|'left'|'top'|'bottom'", default: "'right'", description: '弹出方向' },
  { name: 'size', type: "'sm'|'md'|'lg'|'full'", default: "'md'", description: '抽屉宽/高' },
  { name: 'onConfirm', type: '() => void | Promise<void>', description: '确认回调，支持 async（自动处理 loading）' },
  { name: 'onCancel', type: '() => void', description: '取消按钮回调（同时会调用 onOpenChange(false)）' },
]

type Side = 'right' | 'left' | 'top' | 'bottom'
type Size = 'sm' | 'md' | 'lg' | 'full'

export default function DrawerPage() {
  // 四个方向 Demo — 独立状态
  const [directionSide, setDirectionSide] = useState<Side>('right')
  const [directionOpen, setDirectionOpen] = useState(false)

  // 四种尺寸 Demo — 独立状态
  const [sizeValue, setSizeValue] = useState<Size>('md')
  const [sizeOpen, setSizeOpen] = useState(false)

  // 异步确认 Demo — 独立状态
  const [loadingOpen, setLoadingOpen] = useState(false)

  return (
    <div className="preview-page">
      <PageHeader
        title="Drawer 抽屉"
        description="从边缘滑入的抽屉面板。AppDrawer 基于 shadcn Sheet 封装，支持四个方向、四种尺寸和异步确认。"
        tags={['shadcn/ui', '基础组件']}
      />

      <DemoSection title="四个方向">
        <ComponentDemo
          title="right / left / top / bottom"
          code={`<AppDrawer
  side="right"
  open={open}
  onOpenChange={setOpen}
  title="右侧抽屉"
  onCancel={() => setOpen(false)}
>
  内容
</AppDrawer>`}
        >
          <div className="flex flex-wrap gap-2">
            {(['right', 'left', 'top', 'bottom'] as Side[]).map((s) => (
              <Button
                key={s}
                variant="outline"
                onClick={() => { setDirectionSide(s); setDirectionOpen(true) }}
              >
                {s}
              </Button>
            ))}
          </div>
          <AppDrawer
            side={directionSide}
            open={directionOpen}
            onOpenChange={setDirectionOpen}
            title={`${directionSide} 方向抽屉`}
            onCancel={() => setDirectionOpen(false)}
          >
            <p className="text-sm text-muted-foreground">
              这是从 <strong>{directionSide}</strong> 方向弹出的抽屉内容区域。
            </p>
          </AppDrawer>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="四种尺寸">
        <ComponentDemo
          title="sm / md / lg / full"
          code={`<AppDrawer
  size="lg"
  open={open}
  onOpenChange={setOpen}
  title="大尺寸抽屉"
  onCancel={() => setOpen(false)}
/>`}
        >
          <div className="flex flex-wrap gap-2">
            {(['sm', 'md', 'lg', 'full'] as Size[]).map((s) => (
              <Button
                key={s}
                variant="outline"
                onClick={() => { setSizeValue(s); setSizeOpen(true) }}
              >
                {s}
              </Button>
            ))}
          </div>
          <AppDrawer
            size={sizeValue}
            open={sizeOpen}
            onOpenChange={setSizeOpen}
            title={`${sizeValue} 尺寸抽屉`}
            onCancel={() => setSizeOpen(false)}
          >
            <p className="text-sm text-muted-foreground">当前尺寸：<strong>{sizeValue}</strong></p>
          </AppDrawer>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="异步确认 Loading">
        <ComponentDemo
          title="onConfirm 为 async 时确认按钮自动 loading"
          code={`<AppDrawer
  open={open}
  onOpenChange={setOpen}
  title="保存配置"
  onConfirm={async () => {
    await save()   // 自动处理 loading 状态
    setOpen(false)
  }}
  onCancel={() => setOpen(false)}
/>`}
        >
          <Button onClick={() => setLoadingOpen(true)}>打开带确认按钮的抽屉</Button>
          <AppDrawer
            open={loadingOpen}
            onOpenChange={setLoadingOpen}
            title="保存配置"
            onConfirm={async () => {
              await new Promise<void>((r) => setTimeout(r, 1500))
              toast.success('保存成功')
              setLoadingOpen(false)
            }}
            onCancel={() => setLoadingOpen(false)}
          >
            <p className="text-sm text-muted-foreground">
              点击确认后异步保存（1.5s），按钮自动进入 loading 状态。
            </p>
          </AppDrawer>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
