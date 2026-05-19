import { Badge } from '@/components/ui/badge'
import { AppBadge } from '@/components/base/AppBadge'
import { Button } from '@/components/ui/button'
import { Bell, Mail, ShoppingCart } from 'lucide-react'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'variant', type: "'default'|'secondary'|'outline'|'destructive'", default: "'default'", description: 'Badge 变体' },
  { name: 'count', type: 'number', description: 'AppBadge 数字徽标' },
  { name: 'dot', type: 'boolean', default: 'false', description: 'AppBadge 红点模式' },
  { name: 'status', type: "'default'|'processing'|'success'|'warning'|'error'", description: 'AppBadge 状态徽标' },
  { name: 'overflowCount', type: 'number', default: '99', description: 'AppBadge 数字溢出显示 +' },
]

export default function BadgePage() {
  return (
    <div className="preview-page">
      <PageHeader
        title="Badge 徽标"
        description="数字或状态标记。shadcn Badge 用于文字标签；AppBadge 用于包裹图标/按钮，支持数字、红点和状态模式。"
        tags={['shadcn/ui', '基础组件']}
      />

      <DemoSection title="shadcn Badge 变体">
        <ComponentDemo title="四种内置变体" code={`<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>`}>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="AppBadge 数字徽标">
        <ComponentDemo title="包裹按钮 / 图标，超出显示 +" code={`<AppBadge count={5}><Button variant="outline">消息</Button></AppBadge>
<AppBadge count={100} overflowCount={99}><Bell /></AppBadge>`}>
          <div className="flex flex-wrap gap-6 items-center">
            <AppBadge count={5}>
              <Button variant="outline" size="icon"><Bell size={16} /></Button>
            </AppBadge>
            <AppBadge count={100} overflowCount={99}>
              <Button variant="outline" size="icon"><Mail size={16} /></Button>
            </AppBadge>
            <AppBadge count={3}>
              <Button variant="outline"><ShoppingCart size={16} />购物车</Button>
            </AppBadge>
            <AppBadge count={0}>
              <Button variant="outline">无徽标（count=0）</Button>
            </AppBadge>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="红点模式">
        <ComponentDemo title="dot=true 显示小红点，无数字" code={`<AppBadge dot><Button>通知</Button></AppBadge>`}>
          <div className="flex flex-wrap gap-6 items-center">
            <AppBadge dot>
              <Button variant="outline">有新消息</Button>
            </AppBadge>
            <AppBadge dot>
              <Bell size={20} />
            </AppBadge>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="状态徽标">
        <ComponentDemo title="status 模式（processing 有波纹动画）" code={`<AppBadge status="processing" />
<AppBadge status="success" />`}>
          <div className="flex flex-wrap gap-6 items-center">
            {(['default', 'processing', 'success', 'warning', 'error'] as const).map(status => (
              <div key={status} className="flex items-center gap-2">
                <AppBadge status={status} />
                <span className="text-sm text-muted-foreground">{status}</span>
              </div>
            ))}
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
