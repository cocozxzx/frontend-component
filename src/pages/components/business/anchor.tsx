import { Anchor, AnchorLink } from '@/components/display'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'affix', type: 'boolean', default: 'true', description: '是否固定在视口右侧（sticky 定位）' },
  { name: 'offsetTop', type: 'number', default: '80', description: 'affix=true 时距顶部的偏移量' },
  { name: 'targetOffset', type: 'number', default: '80', description: '滚动激活时距视口顶部的偏移' },
  { name: 'onChange', type: '(href: string) => void', description: '锚点激活变化回调' },
  { name: 'className', type: 'string', description: '容器样式类' },
]

const LINK_PROPS: PropItem[] = [
  { name: 'href', type: 'string', required: true, description: '锚点目标（页面内 #id 或 URL）' },
  { name: 'title', type: 'ReactNode', required: true, description: '锚点文字' },
]

function ContentSection({ id, title, color }: { id: string; title: string; color: string }) {
  return (
    <section id={id} className={`rounded-xl p-6 ${color} min-h-[200px]`}>
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <p className="text-sm leading-relaxed opacity-80">
        这是"{title}"区域的内容。锚点会在滚动到此区域时自动高亮对应的锚点链接。
        滚动页面可以观察右侧（或下方）锚点的激活状态变化。这里有足够多的文字来撑开区域高度，
        方便演示锚点滚动效果。每个区域都有独特的背景色，方便区分不同的内容段落。
      </p>
      <p className="text-sm leading-relaxed opacity-80 mt-3">
        用户可以点击锚点链接直接滚动到对应区域，也可以手动滚动页面，锚点会自动跟随激活。
        支持平滑滚动（smooth scrollIntoView），体验流畅自然。
      </p>
    </section>
  )
}

export default function AnchorPage() {
  return (
    <div className="preview-page">
      <PageHeader
        title="Anchor 锚点"
        description="页面内锚点导航，支持自动跟随滚动激活、affix 固定定位、嵌套锚点层级。"
        tags={['业务组件', '导航']}
      />

      <DemoSection title="内嵌模式（affix=false）">
        <ComponentDemo
          title="将 Anchor 放在侧边栏，配合页面内容区域使用"
          code={`<div className="flex gap-6">
  <div className="flex-1 space-y-6">
    <section id="section-1">...</section>
    <section id="section-2">...</section>
  </div>
  <Anchor affix={false} className="w-32">
    <AnchorLink href="#section-1" title="区域一" />
    <AnchorLink href="#section-2" title="区域二" />
  </Anchor>
</div>`}
        >
          <div className="flex gap-6">
            <div className="flex-1 space-y-4">
              <ContentSection id="s-intro" title="项目介绍" color="bg-blue-50 dark:bg-blue-950/30" />
              <ContentSection id="s-feature" title="核心功能" color="bg-green-50 dark:bg-green-950/30" />
              <ContentSection id="s-arch" title="技术架构" color="bg-purple-50 dark:bg-purple-950/30" />
              <ContentSection id="s-deploy" title="部署说明" color="bg-orange-50 dark:bg-orange-950/30" />
            </div>
            <div className="w-36 flex-shrink-0">
              <Anchor affix={false} targetOffset={100}>
                <AnchorLink href="#s-intro" title="项目介绍" />
                <AnchorLink href="#s-feature" title="核心功能" />
                <AnchorLink href="#s-arch" title="技术架构" />
                <AnchorLink href="#s-deploy" title="部署说明" />
              </Anchor>
            </div>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="嵌套锚点（二级）">
        <ComponentDemo
          title="AnchorLink 嵌套使用，实现二级锚点导航树"
          code={`<Anchor affix={false}>
  <AnchorLink href="#section-1" title="第一章">
    <AnchorLink href="#section-1-1" title="1.1 小节" />
    <AnchorLink href="#section-1-2" title="1.2 小节" />
  </AnchorLink>
  <AnchorLink href="#section-2" title="第二章">
    <AnchorLink href="#section-2-1" title="2.1 小节" />
  </AnchorLink>
</Anchor>`}
        >
          <div className="flex gap-6">
            <div className="flex-1 space-y-4">
              <section id="ch1" className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 min-h-[120px]">
                <h3 className="font-semibold mb-2">第一章：系统概述</h3>
                <section id="ch1-1" className="mt-3 pl-3 border-l-2 border-blue-200">
                  <h4 className="text-sm font-medium">1.1 背景介绍</h4>
                  <p className="text-xs text-muted-foreground mt-1">介绍系统开发的背景和动机...</p>
                </section>
                <section id="ch1-2" className="mt-3 pl-3 border-l-2 border-blue-200">
                  <h4 className="text-sm font-medium">1.2 设计目标</h4>
                  <p className="text-xs text-muted-foreground mt-1">系统需要达到的核心目标...</p>
                </section>
              </section>
              <section id="ch2" className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4 min-h-[120px]">
                <h3 className="font-semibold mb-2">第二章：技术选型</h3>
                <section id="ch2-1" className="mt-3 pl-3 border-l-2 border-green-200">
                  <h4 className="text-sm font-medium">2.1 前端技术栈</h4>
                  <p className="text-xs text-muted-foreground mt-1">React 19 + TypeScript + Vite 6...</p>
                </section>
              </section>
            </div>
            <div className="w-40 flex-shrink-0">
              <Anchor affix={false} targetOffset={100}>
                <AnchorLink href="#ch1" title="第一章">
                  <AnchorLink href="#ch1-1" title="1.1 背景介绍" />
                  <AnchorLink href="#ch1-2" title="1.2 设计目标" />
                </AnchorLink>
                <AnchorLink href="#ch2" title="第二章">
                  <AnchorLink href="#ch2-1" title="2.1 前端技术栈" />
                </AnchorLink>
              </Anchor>
            </div>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="affix 固定模式说明">
        <ComponentDemo
          title="affix=true 时 Anchor 固定在页面右侧，随页面滚动自动激活"
          code={`// 在页面布局层使用，不在 DemoSection 内演示
<Anchor affix offsetTop={80}>
  <AnchorLink href="#section-1" title="区域一" />
  <AnchorLink href="#section-2" title="区域二" />
</Anchor>`}
        >
          <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground">
            affix=true（默认）模式适合固定在页面右侧作为全局目录，
            本 Demo 演示页采用了内嵌模式（affix=false），
            实际项目中可在 Layout 层添加 affix 锚点导航。
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable title="Anchor Props" data={PROPS} />
      <PropsTable title="AnchorLink Props" data={LINK_PROPS} />
    </div>
  )
}
