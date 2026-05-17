import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const TAGS = Array.from({ length: 50 }, (_, i) => `标签 ${i + 1}`)
const LONG_LIST = Array.from({ length: 1000 }, (_, i) => ({ id: i + 1, name: `列表项 ${i + 1}`, desc: `这是第 ${i + 1} 条数据的描述信息` }))

const PROPS: PropItem[] = [
  { name: 'className', type: 'string', description: '控制滚动区域高度和宽度' },
  { name: 'type', type: "'auto'|'always'|'scroll'|'hover'", default: "'hover'", description: '滚动条显示时机' },
]

export default function ScrollAreaPage() {
  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="ScrollArea 滚动区域"
        description="提供自定义滚动条样式的容器，基于 Radix UI ScrollArea，兼容所有浏览器。"
        tags={['shadcn/ui', 'Radix UI', '基础组件']}
      />

      <DemoSection title="垂直滚动">
        <ComponentDemo title="固定高度内的列表滚动" code={`<ScrollArea className="h-64 rounded-md border">
  <div className="p-4">
    {items.map(item => <div key={item.id}>{item.name}</div>)}
  </div>
</ScrollArea>`}>
          <ScrollArea className="h-64 rounded-md border max-w-xs">
            <div className="p-4 space-y-1">
              {LONG_LIST.slice(0, 50).map(item => (
                <div key={item.id} className="flex items-center justify-between py-1.5 border-b last:border-0">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">#{item.id}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="水平滚动">
        <ComponentDemo title="横向滚动的标签列表" code={`<ScrollArea className="w-full whitespace-nowrap rounded-md border">
  <div className="flex gap-2 p-4">
    {tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
  </div>
  <ScrollBar orientation="horizontal" />
</ScrollArea>`}>
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <div className="flex gap-2 p-4">
              {TAGS.map(tag => (
                <div key={tag} className="shrink-0 rounded-md bg-muted px-3 py-1 text-sm">
                  {tag}
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="大数据量（1000条）">
        <ComponentDemo title="1000 行数据流畅滚动" code={`<ScrollArea className="h-80">
  {Array.from({ length: 1000 }).map((_, i) => (
    <div key={i} className="px-4 py-2 border-b text-sm">列表项 {i + 1}</div>
  ))}
</ScrollArea>`}>
          <ScrollArea className="h-80 rounded-md border max-w-md">
            {LONG_LIST.map(item => (
              <div key={item.id}>
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-sm">{item.name}</span>
                  <span className="text-xs text-muted-foreground">{item.desc}</span>
                </div>
                <Separator />
              </div>
            ))}
          </ScrollArea>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
