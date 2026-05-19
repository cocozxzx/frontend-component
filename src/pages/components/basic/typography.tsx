import {
  H1, H2, H3, H4, P, Blockquote, InlineCode, Lead, Large, Small, Muted,
} from '@/components/ui/typography'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'H1-H4', type: 'ReactNode', description: '标题组件，对应 h1-h4 语义标签' },
  { name: 'P', type: 'ReactNode', description: '段落文字' },
  { name: 'Lead', type: 'ReactNode', description: '导语文字（较大）' },
  { name: 'Large', type: 'ReactNode', description: '大号文字' },
  { name: 'Small', type: 'ReactNode', description: '小号文字' },
  { name: 'Muted', type: 'ReactNode', description: '静音（灰色）文字' },
  { name: 'Blockquote', type: 'ReactNode', description: '引用块' },
  { name: 'InlineCode', type: 'ReactNode', description: '行内代码' },
]

export default function TypographyPage() {
  return (
    <div className="preview-page">
      <PageHeader
        title="Typography 排版"
        description="文字样式规范组件，提供一致的文字层级和视觉样式，基于 Tailwind CSS 的字体规范构建。"
        tags={['shadcn/ui', '基础组件']}
      />

      <DemoSection title="标题层级">
        <ComponentDemo title="H1 - H4" code={`<H1>一级标题 Heading 1</H1>
<H2>二级标题 Heading 2</H2>
<H3>三级标题 Heading 3</H3>
<H4>四级标题 Heading 4</H4>`}>
          <div className="space-y-3">
            <H1>一级标题 Heading 1</H1>
            <H2>二级标题 Heading 2</H2>
            <H3>三级标题 Heading 3</H3>
            <H4>四级标题 Heading 4</H4>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="段落与文字变体">
        <ComponentDemo title="Lead / Large / P / Small / Muted" code={`<Lead>导语文字，较大的引导性段落</Lead>
<Large>大号文字，用于强调</Large>
<P>正文段落，标准阅读字号</P>
<Small>小号文字，辅助信息</Small>
<Muted>静音文字，次要信息</Muted>`}>
          <div className="space-y-2">
            <Lead>导语文字，较大的引导性段落，用于页面简介</Lead>
            <Large>大号文字，用于重要说明</Large>
            <P>正文段落，标准阅读字号，用于主要内容的展示。</P>
            <Small>小号文字，用于辅助信息、版权说明等</Small>
            <Muted>静音文字，次要信息，视觉权重最低</Muted>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="特殊样式">
        <ComponentDemo title="Blockquote / InlineCode" code={`<Blockquote>这是一段引用文字，用于引用他人观点或重要内容。</Blockquote>
<P>使用 <InlineCode>npm install</InlineCode> 安装依赖</P>`}>
          <div className="space-y-4">
            <Blockquote>
              "设计是解决问题的过程，优秀的设计让复杂的事情看起来很简单。" —— Steve Jobs
            </Blockquote>
            <P>
              使用 <InlineCode>npm install</InlineCode> 安装依赖，
              或者运行 <InlineCode>pnpm dev</InlineCode> 启动开发服务器。
            </P>
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
