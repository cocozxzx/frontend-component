import { useState } from 'react'
import { TimePicker } from '@/components/form'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'value', type: 'string', description: "当前时间值，格式 'HH:mm:ss'" },
  { name: 'onChange', type: '(value: string) => void', description: '时间变化回调' },
  { name: 'placeholder', type: 'string', default: "'请选择时间'", description: '占位文字' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用状态' },
  { name: 'allowClear', type: 'boolean', default: 'true', description: '是否显示清除按钮' },
  { name: 'use12Hours', type: 'boolean', default: 'false', description: '使用 12 小时制' },
  { name: 'hourStep', type: 'number', default: '1', description: '小时步进值' },
  { name: 'minuteStep', type: 'number', default: '1', description: '分钟步进值' },
  { name: 'secondStep', type: 'number', default: '1', description: '秒步进值' },
  { name: 'disabledTime', type: 'DisabledTime', description: '禁用特定时间范围的函数' },
  { name: 'showSecond', type: 'boolean', default: 'true', description: '是否显示秒选择列' },
]

export default function TimePickerPage() {
  const [basic, setBasic] = useState('')
  const [use12, setUse12] = useState('')
  const [step, setStep] = useState('')
  const [disabled, setDisabled] = useState('')

  return (
    <div className="preview-page">
      <PageHeader
        title="TimePicker 时间选择器"
        description="三列滚动选择器，支持 12/24 小时制、步进配置、禁用时间段。"
        tags={['业务组件', '数据录入']}
      />

      <DemoSection title="基础时间选择">
        <ComponentDemo
          title="三列滚动选择时、分、秒"
          code={`<TimePicker value={time} onChange={setTime} />`}
        >
          <div className="flex flex-wrap gap-4">
            <TimePicker value={basic} onChange={setBasic} />
            {basic && <span className="self-center text-sm text-muted-foreground">已选：{basic}</span>}
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="12 小时制">
        <ComponentDemo
          title="use12Hours=true 时显示 AM/PM 切换"
          code={`<TimePicker value={time} onChange={setTime} use12Hours />`}
        >
          <TimePicker value={use12} onChange={setUse12} use12Hours />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="步进配置">
        <ComponentDemo
          title="minuteStep=15 时分钟列只显示 0/15/30/45"
          code={`<TimePicker value={time} onChange={setTime} minuteStep={15} />`}
        >
          <TimePicker value={step} onChange={setStep} minuteStep={15} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="禁用时间">
        <ComponentDemo
          title="通过 disabledTime 禁用 22:00 之后的时间"
          code={`<TimePicker
  value={time}
  onChange={setTime}
  disabledTime={() => ({
    disabledHours: () => Array.from({ length: 24 }, (_, i) => i).filter(h => h >= 22),
  })}
/>`}
        >
          <TimePicker
            value={disabled}
            onChange={setDisabled}
            disabledTime={() => ({
              disabledHours: () => Array.from({ length: 24 }, (_, i) => i).filter((h) => h >= 22),
            })}
          />
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
