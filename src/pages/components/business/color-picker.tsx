import { useState } from 'react'
import { ColorPicker } from '@/components/form'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'
import type { ColorObject } from '@/components/form'

const PROPS: PropItem[] = [
  { name: 'value', type: 'string', description: '当前颜色值（受控，CSS 颜色字符串）' },
  { name: 'onChange', type: '(color: ColorObject) => void', description: '颜色变化回调' },
  { name: 'showAlpha', type: 'boolean', default: 'false', description: '是否显示透明度滑块' },
  { name: 'presets', type: 'string[]', description: '预设颜色列表' },
  { name: 'format', type: "'hex' | 'rgb' | 'hsl'", default: "'hex'", description: '颜色格式' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用状态' },
  { name: 'className', type: 'string', description: '容器样式类' },
]

const PRESET_COLORS = [
  '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1',
  '#13c2c2', '#eb2f96', '#fa8c16', '#a0d911', '#2f54eb',
]

export default function ColorPickerPage() {
  const [basic, setBasic] = useState('#1890ff')
  const [withAlpha, setWithAlpha] = useState('rgba(24,144,255,0.8)')
  const [withPreset, setWithPreset] = useState('#52c41a')

  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="ColorPicker 颜色选择器"
        description="HSB 色域面板，支持透明度、预设色板、HEX/RGB/HSL 多格式输入输出。"
        tags={['业务组件', '数据录入']}
      />

      <DemoSection title="基础颜色选择">
        <ComponentDemo
          title="HSB 色域面板 + 色相滑块 + HEX 输入"
          code={`<ColorPicker value={color} onChange={(c) => setColor(c.hex)} />`}
        >
          <div className="flex items-center gap-4">
            <ColorPicker value={basic} onChange={(c: ColorObject) => setBasic(c.hex)} />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border" style={{ backgroundColor: basic }} />
              <code className="text-sm font-mono">{basic}</code>
            </div>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="带透明度">
        <ComponentDemo
          title="showAlpha=true 时显示透明度滑块"
          code={`<ColorPicker value={color} onChange={(c) => setColor(c.rgba)} showAlpha />`}
        >
          <div className="flex items-center gap-4">
            <ColorPicker value={withAlpha} onChange={(c: ColorObject) => setWithAlpha(c.rgba)} showAlpha />
            <code className="text-sm font-mono">{withAlpha}</code>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="预设颜色">
        <ComponentDemo
          title="presets 数组显示在面板底部，点击快速选色"
          code={`const presets = ['#1890ff', '#52c41a', '#faad14', ...]
<ColorPicker value={color} onChange={(c) => setColor(c.hex)} presets={presets} />`}
        >
          <div className="flex items-center gap-4">
            <ColorPicker value={withPreset} onChange={(c: ColorObject) => setWithPreset(c.hex)} presets={PRESET_COLORS} />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border" style={{ backgroundColor: withPreset }} />
              <code className="text-sm font-mono">{withPreset}</code>
            </div>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="颜色格式展示">
        <ComponentDemo
          title="ColorObject 同时包含 hex / rgb / rgba / hsl 格式"
          code={`<ColorPicker value={color} onChange={(c) => {
  console.log(c.hex)  // #1890ff
  console.log(c.rgb)  // rgb(24, 144, 255)
  console.log(c.hsl)  // hsl(209, 100%, 55%)
}} />`}
        >
          <div className="flex flex-col gap-2">
            <ColorPicker value={basic} onChange={(c: ColorObject) => setBasic(c.hex)} />
            <div className="mt-2 grid grid-cols-3 gap-2 text-sm font-mono">
              <div className="bg-muted rounded p-2">HEX: {basic}</div>
              <div className="bg-muted rounded p-2">RGB: 可从 onChange 获取</div>
              <div className="bg-muted rounded p-2">HSL: 可从 onChange 获取</div>
            </div>
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
