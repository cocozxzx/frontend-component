import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Rate } from '@/components/form'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'value', type: 'number', description: '当前评分值（受控）' },
  { name: 'onChange', type: '(value: number) => void', description: '评分变化回调' },
  { name: 'count', type: 'number', default: '5', description: '总星数' },
  { name: 'allowHalf', type: 'boolean', default: 'false', description: '是否允许半星' },
  { name: 'allowClear', type: 'boolean', default: 'true', description: '点击已选星时是否清除' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '只读/禁用状态' },
  { name: 'character', type: 'ReactNode', description: '自定义评分图标，默认 Star' },
  { name: 'style', type: 'CSSProperties', description: '图标颜色等自定义样式' },
  { name: 'tooltips', type: 'string[]', description: '每颗星的 tooltip 文字' },
  { name: 'size', type: 'number', default: '20', description: '图标尺寸 px' },
]

export default function RatePage() {
  const [basic, setBasic] = useState(3)
  const [half, setHalf] = useState(2.5)
  const [custom, setCustom] = useState(4)
  const [colored, setColored] = useState(3)

  return (
    <div className="preview-page">
      <PageHeader
        title="Rate 评分"
        description="支持半星、只读、自定义图标和颜色、tooltip 提示，可完全键盘操作。"
        tags={['业务组件', '数据录入']}
      />

      <DemoSection title="基础评分">
        <ComponentDemo
          title="可交互评分，点击同分值星时清除"
          code={`<Rate value={rate} onChange={setRate} />`}
        >
          <div className="flex items-center gap-4">
            <Rate value={basic} onChange={setBasic} />
            <span className="text-sm text-muted-foreground">{basic} 分</span>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="半星模式">
        <ComponentDemo
          title="allowHalf=true 时可选 0.5 精度"
          code={`<Rate value={rate} onChange={setRate} allowHalf />`}
        >
          <div className="flex items-center gap-4">
            <Rate value={half} onChange={setHalf} allowHalf />
            <span className="text-sm text-muted-foreground">{half} 分</span>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="只读模式">
        <ComponentDemo
          title="disabled=true 时不可交互，用于展示评分结果"
          code={`<Rate value={4.5} allowHalf disabled />`}
        >
          <Rate value={4.5} allowHalf disabled />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="自定义图标">
        <ComponentDemo
          title="通过 character 传入自定义图标（Heart）"
          code={`<Rate
  value={rate}
  onChange={setRate}
  character={<Heart size={20} />}
  style={{ color: '#ff4d4f' }}
/>`}
        >
          <div className="flex items-center gap-4">
            <Rate value={custom} onChange={setCustom} character={<Heart size={20} />} style={{ color: '#ff4d4f' }} />
            <span className="text-sm text-muted-foreground">{custom} 颗心</span>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="自定义颜色">
        <ComponentDemo
          title="通过 style 修改评分图标颜色"
          code={`<Rate value={rate} onChange={setRate} style={{ color: '#1890ff' }} />`}
        >
          <Rate value={colored} onChange={setColored} style={{ color: '#1890ff' }} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Tooltip 提示">
        <ComponentDemo
          title="tooltips 数组为每颗星设置悬浮提示文字"
          code={`<Rate
  value={rate}
  onChange={setRate}
  tooltips={['极差', '失望', '一般', '满意', '惊喜']}
/>`}
        >
          <Rate value={basic} onChange={setBasic} tooltips={['极差', '失望', '一般', '满意', '惊喜']} />
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
