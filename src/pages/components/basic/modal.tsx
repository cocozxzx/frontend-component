import { useState } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AppModal } from '@/components/base/AppModal'
import { useModal } from '@/hooks/useModal'
import { toast } from '@/hooks/useToast'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'open', type: 'boolean', description: 'AppModal 受控显示' },
  { name: 'title', type: 'string', description: '弹窗标题' },
  { name: 'width', type: 'string | number', default: "'lg'", description: 'AppModal 宽度' },
  { name: 'onConfirm', type: '() => void | Promise<void>', description: 'AppModal 确认回调（支持 async）' },
  { name: 'onCancel', type: '() => void', description: '取消/关闭回调' },
  { name: 'maskClosable', type: 'boolean', default: 'true', description: '点击蒙层关闭' },
  { name: 'footer', type: 'ReactNode | null', description: 'null 时不显示底部栏' },
]

function ConfirmDemo() {
  const { confirm } = useModal()
  async function handleConfirm() {
    const ok = await confirm({ title: '确认删除', content: '此操作不可恢复，确认继续？', type: 'danger' })
    if (ok) toast.success('已删除')
    else toast.info('已取消')
  }
  return <Button variant="destructive" onClick={handleConfirm}>命令式 confirm</Button>
}

function AlertDemo() {
  const { alert } = useModal()
  return (
    <div className="flex flex-wrap gap-2">
      {(['success', 'error', 'warning', 'info'] as const).map(type => (
        <Button key={type} variant="outline" onClick={() => alert({ title: `${type} 提示`, content: `这是一条 ${type} 类型的提示信息。`, type })}>
          {type}
        </Button>
      ))}
    </div>
  )
}

export default function ModalPage() {
  const [open, setOpen] = useState(false)
  const [appOpen, setAppOpen] = useState(false)

  async function handleAppConfirm() {
    await new Promise<void>((r) => setTimeout(r, 1500))
    toast.success('异步操作完成')
    setAppOpen(false)
  }

  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Modal 弹窗"
        description="对话框交互组件。shadcn Dialog 提供基础弹窗；AppModal 增加了宽度控制和异步 onConfirm；useModal 提供命令式 API。"
        tags={['shadcn/ui', '基础组件']}
      />

      <DemoSection title="基础 Dialog">
        <ComponentDemo title="shadcn Dialog 基础用法" code={`<Dialog>
  <DialogTrigger asChild>
    <Button>打开弹窗</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>弹窗标题</DialogTitle></DialogHeader>
    <p>弹窗内容区域</p>
    <DialogFooter>
      <Button>确认</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>打开 Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>基础弹窗</DialogTitle></DialogHeader>
              <p className="text-sm text-muted-foreground">这是 shadcn Dialog 的基础用法，支持 ESC 关闭和点击蒙层关闭。</p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>取消</Button>
                <Button onClick={() => setOpen(false)}>确认</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="AppModal — 异步确认">
        <ComponentDemo title="onConfirm 支持 async，确认期间自动 loading" code={`<AppModal
  open={open}
  title="异步操作"
  onConfirm={async () => { await api.delete(id) }}
  onCancel={() => setOpen(false)}
>
  确认执行此操作？
</AppModal>`}>
          <Button onClick={() => setAppOpen(true)}>打开 AppModal（异步 1.5s）</Button>
          <AppModal
            open={appOpen}
            title="异步确认示例"
            onConfirm={handleAppConfirm}
            onCancel={() => setAppOpen(false)}
          >
            <p className="text-sm text-muted-foreground">点击确认后将执行异步操作（1.5秒），确认按钮自动进入 loading 状态。</p>
          </AppModal>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="命令式 API">
        <ComponentDemo title="useModal hook — confirm / alert" code={`const { confirm, alert } = useModal()
const ok = await confirm({ title: '确认删除', type: 'danger' })
await alert({ title: '操作成功', type: 'success' })`}>
          <div className="space-y-4">
            <ConfirmDemo />
            <AlertDemo />
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
