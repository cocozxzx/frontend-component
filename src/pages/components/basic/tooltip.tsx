import { Button } from '@/components/ui/button'
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip'
import { Info, HelpCircle } from 'lucide-react'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'side', type: "'top'|'right'|'bottom'|'left'", default: "'top'", description: 'TooltipContent 弹出方向' },
  { name: 'delayDuration', type: 'number', default: '700', description: 'TooltipProvider 延迟显示 ms' },
  { name: 'asChild', type: 'boolean', description: 'TooltipTrigger 传递给子元素' },
]

export default function TooltipPage() {
  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Tooltip 文字提示"
        description="鼠标悬浮时显示的文字提示气泡，基于 Radix UI Tooltip，支持四个方向和延迟显示。"
        tags={['shadcn/ui', 'Radix UI', '基础组件']}
      />

      <DemoSection title="四个方向">
        <ComponentDemo title="top / right / bottom / left" code={`<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent side="top">提示文字</TooltipContent>
  </Tooltip>
</TooltipProvider>`}>
          <TooltipProvider>
            <div className="flex flex-wrap gap-3">
              {(['top', 'right', 'bottom', 'left'] as const).map(side => (
                <Tooltip key={side}>
                  <TooltipTrigger asChild>
                    <Button variant="outline">{side}</Button>
                  </TooltipTrigger>
                  <TooltipContent side={side}>从 {side} 方向弹出的提示</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="图标触发">
        <ComponentDemo title="触发元素为图标（asChild）" code={`<Tooltip>
  <TooltipTrigger asChild>
    <Info size={16} className="cursor-help" />
  </TooltipTrigger>
  <TooltipContent>这是帮助信息</TooltipContent>
</Tooltip>`}>
          <TooltipProvider>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm">
                字段名称
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={14} className="text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>这是字段的详细说明信息</TooltipContent>
                </Tooltip>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle size={18} className="text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>点击这里查看帮助文档</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="延迟显示">
        <ComponentDemo title="delayDuration 控制延迟（ms）" code={`<TooltipProvider delayDuration={100}>
  <Tooltip><TooltipTrigger>快速</TooltipTrigger><TooltipContent>100ms</TooltipContent></Tooltip>
</TooltipProvider>
<TooltipProvider delayDuration={1500}>
  <Tooltip><TooltipTrigger>慢速</TooltipTrigger><TooltipContent>1500ms</TooltipContent></Tooltip>
</TooltipProvider>`}>
          <div className="flex gap-4">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">快速 100ms</Button>
                </TooltipTrigger>
                <TooltipContent>延迟 100ms 显示</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={1500}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">慢速 1500ms</Button>
                </TooltipTrigger>
                <TooltipContent>延迟 1500ms 显示</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
