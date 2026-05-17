import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, XCircle, AlertTriangle, Info, Terminal } from 'lucide-react'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'variant', type: "'default'|'destructive'", default: "'default'", description: 'shadcn Alert 变体' },
  { name: 'className', type: 'string', description: '自定义样式（用于扩展更多变体）' },
]

export default function AlertPage() {
  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Alert 警告提示"
        description="页内非打扰式提示信息。shadcn Alert 提供 default 和 destructive 两种变体，可通过 className 扩展颜色。"
        tags={['shadcn/ui', '基础组件']}
      />

      <DemoSection title="内置变体">
        <ComponentDemo title="default / destructive" code={`<Alert><AlertTitle>提示</AlertTitle><AlertDescription>这是一条默认提示。</AlertDescription></Alert>
<Alert variant="destructive"><AlertTitle>错误</AlertTitle><AlertDescription>操作失败。</AlertDescription></Alert>`}>
          <div className="space-y-3 max-w-xl">
            <Alert>
              <Terminal size={14} />
              <AlertTitle>提示信息</AlertTitle>
              <AlertDescription>这是一条默认风格的提示信息，适用于一般说明。</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <XCircle size={14} />
              <AlertTitle>操作失败</AlertTitle>
              <AlertDescription>数据保存失败，请检查网络连接后重试。</AlertDescription>
            </Alert>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="扩展语义色（通过 className）">
        <ComponentDemo title="success / warning / info 自定义颜色" code={`<Alert className="border-success/30 bg-success/10 text-success">
  <CheckCircle size={14} />
  <AlertTitle>操作成功</AlertTitle>
</Alert>`}>
          <div className="space-y-3 max-w-xl">
            <Alert className="border-success/30 bg-success/10 [&>svg]:text-success">
              <CheckCircle size={14} />
              <AlertTitle className="text-success">操作成功</AlertTitle>
              <AlertDescription>数据已成功保存，更改将在下次登录后生效。</AlertDescription>
            </Alert>
            <Alert className="border-warning/30 bg-warning/10 [&>svg]:text-warning">
              <AlertTriangle size={14} />
              <AlertTitle className="text-warning">注意事项</AlertTitle>
              <AlertDescription>此操作将影响所有关联数据，请确认后继续。</AlertDescription>
            </Alert>
            <Alert className="border-info/30 bg-info/10 [&>svg]:text-info">
              <Info size={14} />
              <AlertTitle className="text-info">提示</AlertTitle>
              <AlertDescription>系统将于今晚 23:00 进行例行维护，预计持续 30 分钟。</AlertDescription>
            </Alert>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="仅描述（无标题）">
        <ComponentDemo title="只使用 AlertDescription" code={`<Alert><AlertDescription>无标题的简洁提示</AlertDescription></Alert>`}>
          <div className="space-y-3 max-w-xl">
            <Alert>
              <Info size={14} />
              <AlertDescription>没有标题的简洁提示，适合简短的说明性文字。</AlertDescription>
            </Alert>
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
