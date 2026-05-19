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
  return (
    <div className="preview-page">
      <PageHeader
        title="Popover & HoverCard"
        description="气泡卡片组件。Popover 点击触发可包含任意内容；HoverCard 鼠标悬浮触发，适合用户信息预览。"
        tags={['shadcn/ui', 'Radix UI', '基础组件']}
      />

      <DemoSection title="基础 Popover">
        <ComponentDemo
          title="点击触发，四个方向"
          code={`<Popover>
  <PopoverTrigger asChild>
    <Button>打开 Popover</Button>
  </PopoverTrigger>
  <PopoverContent className="w-64">
    <p className="text-sm text-muted-foreground">弹出内容</p>
  </PopoverContent>
</Popover>`}
        >
          <div className="flex flex-wrap gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button>默认（下方）</Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">弹出卡片</h4>
                  <p className="text-sm text-muted-foreground">Popover 支持放置任意复杂内容，如表单、操作列表等。</p>
                </div>
              </PopoverContent>
            </Popover>

            {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
              <Popover key={side}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">{side}</Button>
                </PopoverTrigger>
                <PopoverContent side={side} className="w-36">
                  <p className="text-xs text-muted-foreground">从 {side} 方向弹出</p>
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="带操作按钮的 Popover">
        <ComponentDemo
          title="受控模式，内部有确认按钮"
          code={`<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button variant="outline">设置</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>确认执行此操作？</p>
    <Button onClick={() => setOpen(false)}>确认</Button>
  </PopoverContent>
</Popover>`}
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">配置选项</Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">快速设置</h4>
                <p className="text-xs text-muted-foreground">点击关闭按钮或点击外部区域关闭。</p>
                <div className="flex justify-end">
                  <PopoverTrigger asChild>
                    <Button size="sm">关闭</Button>
                  </PopoverTrigger>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="HoverCard 悬浮卡片">
        <ComponentDemo
          title="鼠标悬浮触发，适合用户信息预览"
          code={`<HoverCard>
  <HoverCardTrigger asChild>
    <Button variant="link">@张三</Button>
  </HoverCardTrigger>
  <HoverCardContent className="w-72">
    <div className="flex gap-3">
      <Avatar>...</Avatar>
      <div>用户详细信息</div>
    </div>
  </HoverCardContent>
</HoverCard>`}
        >
          <div className="flex gap-4">
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

            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className="px-0">@李四</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-72">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/150?img=2" alt="李四" />
                    <AvatarFallback>李</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">@lisi</h4>
                    <p className="text-sm text-muted-foreground">UI 设计师，专注用户体验。</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarDays size={12} />
                      2023年6月加入
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
