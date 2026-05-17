import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { CalendarDays } from 'lucide-react'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'open', type: 'boolean', description: '受控显示状态' },
  { name: 'onOpenChange', type: '(open: boolean) => void', description: '显示状态变化回调' },
  { name: 'side', type: "'top'|'right'|'bottom'|'left'", default: "'bottom'", description: 'PopoverContent 弹出方向' },
  { name: 'align', type: "'start'|'center'|'end'", default: "'center'", description: '对齐方式' },
]

export default function PopoverPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Popover & HoverCard"
        description="气泡卡片组件。Popover 点击触发，可包含复杂内容；HoverCard 鼠标悬浮触发，适合预览信息。"
        tags={['shadcn/ui', 'Radix UI', '基础组件']}
      />

      <DemoSection title="基础 Popover">
        <ComponentDemo title="点击触发，包含表单内容" code={`<Popover>
  <PopoverTrigger asChild><Button>打开 Popover</Button></PopoverTrigger>
  <PopoverContent className="w-80">
    <div className="space-y-2">
      <h4 className="font-medium">设置</h4>
      <p className="text-sm text-muted-foreground">在这里配置相关参数。</p>
    </div>
  </PopoverContent>
</Popover>`}>
          <div className="flex flex-wrap gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button>打开 Popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">弹出卡片</h4>
                  <p className="text-sm text-muted-foreground">Popover 支持放置任意复杂内容，如表单、操作列表等。</p>
                  <Button size="sm" className="w-full" onClick={() => setOpen(false)}>确认</Button>
                </div>
              </PopoverContent>
            </Popover>

            {(['top', 'right', 'bottom', 'left'] as const).map(side => (
              <Popover key={side}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">{side}</Button>
                </PopoverTrigger>
                <PopoverContent side={side} className="w-40">
                  <p className="text-xs text-muted-foreground">从 {side} 弹出</p>
                </PopoverContent>
              </Popover>
            ))}
          </div>
          {open && <span className="hidden">{String(open)}</span>}
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="HoverCard">
        <ComponentDemo title="鼠标悬浮触发，适合用户信息预览" code={`<HoverCard>
  <HoverCardTrigger asChild>
    <Button variant="link">@username</Button>
  </HoverCardTrigger>
  <HoverCardContent>
    <div className="flex gap-3">
      <Avatar>...</Avatar>
      <div>用户信息</div>
    </div>
  </HoverCardContent>
</HoverCard>`}>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link" className="px-0">@张三</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-72">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="张三" />
                  <AvatarFallback>张</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">@zhangsan</h4>
                  <p className="text-sm text-muted-foreground">全栈工程师，热爱开源。</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays size={12} />
                    2024年1月加入
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
