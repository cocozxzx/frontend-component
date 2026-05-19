import { useState } from 'react'
import { Steps } from '@/components/display/Steps'
import { Button } from '@/components/ui/button'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const STEP_ITEMS = [
  { title: '填写信息', description: '填写基本信息和联系方式' },
  { title: '上传资料', description: '上传身份证和营业执照' },
  { title: '审核中', description: '等待人工审核（1-3个工作日）' },
  { title: '完成', description: '审核通过，开通服务' },
]

const PROPS: PropItem[] = [
  { name: 'items', type: 'StepItem[]', required: true, description: '步骤数据列表' },
  { name: 'current', type: 'number', default: '0', description: '当前步骤索引（从 0 开始）' },
  { name: 'direction', type: "'horizontal'|'vertical'", default: "'horizontal'", description: '排列方向' },
  { name: 'onChange', type: '(index: number) => void', description: '点击步骤的回调（跳转）' },
  { name: 'size', type: "'default'|'sm'", default: "'default'", description: '小尺寸' },
]

export default function StepsPage() {
  const [current, setCurrent] = useState(1)

  return (
    <div className="preview-page">
      <PageHeader
        title="Steps 步骤条"
        description="引导用户按步骤完成任务。支持水平/垂直方向，可点击已完成步骤切换。"
        tags={['展示组件', '基础组件']}
      />

      <DemoSection title="水平步骤条">
        <ComponentDemo title="可点击切换当前步骤" code={`<Steps
  items={steps}
  current={current}
  onChange={(i) => setCurrent(i)}
/>`}>
          <div className="space-y-4">
            <Steps items={STEP_ITEMS} current={current} onChange={setCurrent} />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={current === 0} onClick={() => setCurrent(c => c - 1)}>上一步</Button>
              <Button size="sm" disabled={current === STEP_ITEMS.length - 1} onClick={() => setCurrent(c => c + 1)}>下一步</Button>
            </div>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="垂直步骤条">
        <ComponentDemo title="direction='vertical'" code={`<Steps items={steps} current={2} direction="vertical" />`}>
          <Steps
            items={STEP_ITEMS}
            current={2}
            direction="vertical"
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="小尺寸">
        <ComponentDemo title="size='sm'" code={`<Steps items={steps} current={1} size="sm" />`}>
          <Steps items={STEP_ITEMS} current={1} size="sm" />
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
