import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/useToast'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'toast.success(msg)', type: 'function', description: '成功提示' },
  { name: 'toast.error(msg)', type: 'function', description: '错误提示' },
  { name: 'toast.warning(msg)', type: 'function', description: '警告提示' },
  { name: 'toast.info(msg)', type: 'function', description: '信息提示' },
  { name: 'toast.loading(msg)', type: 'function', description: '加载提示（返回 toastId）' },
  { name: 'toast.promise(promise, opts)', type: 'function', description: 'Promise 状态自动切换' },
]

export default function ToastPage() {
  function handlePromise() {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      { loading: '处理中...', success: '操作成功！', error: '操作失败' },
    )
  }

  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Toast 消息提示"
        description="全局轻量级消息反馈，基于 Sonner。useToast 封装了 success/error/warning/info/loading/promise 六种方法。"
        tags={['Sonner', '基础组件']}
      />

      <DemoSection title="各类型提示">
        <ComponentDemo title="六种消息类型" code={`import { toast } from '@/hooks/useToast'

toast.success('操作成功！')
toast.error('请求失败，请重试')
toast.warning('库存即将耗尽')
toast.info('系统将于 23:00 维护')
toast.loading('加载中...')
toast.promise(fetchData(), { loading: '加载', success: '完成', error: '失败' })`}>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => toast.success('操作成功！')} variant="outline" size="sm" className="text-success border-success/30">success</Button>
            <Button onClick={() => toast.error('请求失败，请重试')} variant="outline" size="sm" className="text-destructive border-destructive/30">error</Button>
            <Button onClick={() => toast.warning('库存即将耗尽')} variant="outline" size="sm" className="text-warning border-warning/30">warning</Button>
            <Button onClick={() => toast.info('系统将于 23:00 维护')} variant="outline" size="sm">info</Button>
            <Button onClick={() => toast.loading('数据加载中...')} variant="outline" size="sm">loading</Button>
            <Button onClick={handlePromise} variant="default" size="sm">promise（2s）</Button>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="带描述的提示">
        <ComponentDemo title="title + description" code={`toast.success('文件上传成功', {
  description: 'avatar.png (2.4 MB) 已上传到云存储',
})`}>
          <Button variant="outline" size="sm" onClick={() =>
            toast.success('文件上传成功', { description: 'avatar.png (2.4 MB) 已上传到云存储' })
          }>
            带描述的 success
          </Button>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} title="useToast 方法" />
    </div>
  )
}
