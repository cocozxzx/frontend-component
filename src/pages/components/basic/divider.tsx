import { Divider } from '@/components/ui/divider'
import { Separator } from '@/components/ui/separator'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'children', type: 'ReactNode', description: 'Divider 中间文字/内容' },
  { name: 'orientation', type: "'left'|'center'|'right'", default: "'center'", description: '文字对齐方向' },
  { name: 'dashed', type: 'boolean', default: 'false', description: '虚线样式' },
  { name: 'vertical', type: 'boolean', default: 'false', description: '垂直分割线' },
]

export default function DividerPage() {
  return (
    <div className="preview-page">
      <PageHeader
        title="Divider 分割线"
        description="用于内容区域的分隔。Divider 支持带文字的分割线；shadcn Separator 适合简单分隔。"
        tags={['基础组件']}
      />

      <DemoSection title="基础分割线">
        <ComponentDemo title="水平分割线" code={`<Divider />
<Separator />`}>
          <div className="space-y-4 max-w-md">
            <p className="text-sm">上方内容</p>
            <Divider />
            <p className="text-sm">下方内容</p>
            <p className="text-xs text-muted-foreground">shadcn Separator：</p>
            <Separator />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="带文字的分割线">
        <ComponentDemo title="文字居中 / 居左 / 居右" code={`<Divider>OR</Divider>
<Divider orientation="left">左对齐</Divider>
<Divider orientation="right">右对齐</Divider>`}>
          <div className="space-y-4 max-w-md">
            <Divider>OR</Divider>
            <Divider orientation="left">登录方式</Divider>
            <Divider orientation="right">其他选项</Divider>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="虚线">
        <ComponentDemo title="dashed=true" code={`<Divider dashed />
<Divider dashed>虚线分割</Divider>`}>
          <div className="space-y-4 max-w-md">
            <Divider dashed />
            <Divider dashed>分隔内容</Divider>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="垂直分割线">
        <ComponentDemo title="vertical=true，内联使用" code={`<span>链接A</span>
<Divider vertical />
<span>链接B</span>
<Divider vertical />
<span>链接C</span>`}>
          <div className="flex items-center gap-0 text-sm">
            <span className="text-primary cursor-pointer hover:underline">主页</span>
            <Divider vertical className="mx-3" />
            <span className="text-primary cursor-pointer hover:underline">关于</span>
            <Divider vertical className="mx-3" />
            <span className="text-primary cursor-pointer hover:underline">联系我们</span>
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
