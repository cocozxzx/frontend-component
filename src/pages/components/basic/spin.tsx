import { useState } from 'react'
import { Spin } from '@/components/ui/spin'
import { Button } from '@/components/ui/button'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'spinning', type: 'boolean', default: 'true', description: '是否显示加载中状态' },
  { name: 'size', type: "'sm'|'md'|'lg'", default: "'md'", description: '图标大小' },
  { name: 'tip', type: 'string', description: '加载提示文字' },
  { name: 'fullscreen', type: 'boolean', default: 'false', description: '全屏 loading 遮罩' },
  { name: 'children', type: 'ReactNode', description: '包裹的内容（内容上方显示遮罩）' },
]

export default function SpinPage() {
  const [spinning, setSpinning] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)

  function triggerFullscreen() {
    setFullscreen(true)
    setTimeout(() => setFullscreen(false), 2000)
  }

  return (
    <div className="preview-page">
      <PageHeader
        title="Spin 加载中"
        description="加载状态指示器。可独立使用或包裹内容，支持全屏遮罩模式。"
        tags={['基础组件']}
      />

      <DemoSection title="基础尺寸">
        <ComponentDemo title="三种尺寸" code={`<Spin size="sm" />
<Spin size="md" />
<Spin size="lg" />`}>
          <div className="flex items-center gap-8">
            {(['sm', 'md', 'lg'] as const).map(size => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Spin size={size} spinning />
                <span className="text-xs text-muted-foreground">{size}</span>
              </div>
            ))}
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="带文字提示">
        <ComponentDemo title="tip 属性" code={`<Spin spinning tip="数据加载中..." />`}>
          <Spin spinning tip="数据加载中，请稍候..." />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="包裹内容">
        <ComponentDemo title="spinning 切换显示遮罩" code={`<Spin spinning={loading}>
  <div>被包裹的内容区域</div>
</Spin>`}>
          <div className="space-y-3">
            <Button variant="outline" size="sm" onClick={() => setSpinning(v => !v)}>
              切换加载状态（当前：{spinning ? '加载中' : '已完成'}）
            </Button>
            <Spin spinning={spinning} tip="加载中...">
              <div className="border rounded-lg p-6 min-h-[120px] space-y-2">
                <p className="text-sm font-medium">内容标题</p>
                <p className="text-sm text-muted-foreground">这是被 Spin 包裹的内容区域，loading 时会显示半透明遮罩。</p>
              </div>
            </Spin>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="全屏 Loading">
        <ComponentDemo title="fullscreen 模式，2s 后自动关闭" code={`<Spin spinning fullscreen tip="全屏加载中..." />`}>
          <div>
            <Button onClick={triggerFullscreen}>触发全屏 Loading（2s）</Button>
            {fullscreen && <Spin spinning fullscreen tip="全屏加载中..." />}
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
