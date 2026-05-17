import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const FAQ = [
  { q: '如何重置密码？', a: '进入账户设置页面，点击"安全"选项卡，选择"修改密码"。需要验证原密码或绑定的手机号。' },
  { q: '如何导出数据？', a: '在数据列表页面点击右上角"导出"按钮，选择导出格式（Excel/CSV）和数据范围，点击确认即可。' },
  { q: '支持哪些支付方式？', a: '支持微信支付、支付宝、银行卡转账等多种支付方式，企业用户还支持对公转账。' },
]

const PROPS: PropItem[] = [
  { name: 'type', type: "'single'|'multiple'", default: "'single'", description: '单个展开/多个同时展开' },
  { name: 'collapsible', type: 'boolean', default: 'false', description: 'single 模式下是否允许全部折叠' },
  { name: 'defaultValue', type: 'string | string[]', description: '默认展开的 item value' },
]

export default function CollapsePage() {
  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Collapse 折叠面板"
        description="将内容区域折叠/展开。基于 Radix UI Accordion，支持单选模式（手风琴）和多选模式。"
        tags={['shadcn/ui', 'Radix UI', '基础组件']}
      />

      <DemoSection title="基础（单选模式）">
        <ComponentDemo title="accordion type=single，默认第一项展开" code={`<Accordion type="single" defaultValue="item-1" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>标题一</AccordionTrigger>
    <AccordionContent>内容一</AccordionContent>
  </AccordionItem>
</Accordion>`}>
          <Accordion type="single" defaultValue="item-0" collapsible className="max-w-xl">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="多选模式">
        <ComponentDemo title="type=multiple，多个同时展开" code={`<Accordion type="multiple" defaultValue={['item-0', 'item-1']}>`}>
          <Accordion type="multiple" defaultValue={['item-0', 'item-2']} className="max-w-xl">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
