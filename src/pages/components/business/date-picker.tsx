import { useState } from 'react'
import { AppDatePicker } from '@/components/base'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'value', type: 'Date | null', description: '选中的日期（受控）' },
  { name: 'onChange', type: '(date: Date | null) => void', description: '日期变化回调' },
  { name: 'placeholder', type: 'string', default: "'请选择日期'", description: '占位文字' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用状态' },
  { name: 'allowClear', type: 'boolean', default: 'true', description: '是否显示清除按钮' },
  { name: 'showTime', type: 'boolean', default: 'false', description: '是否显示时间选择' },
  { name: 'disabledDate', type: '(date: Date) => boolean', description: '禁用特定日期的函数' },
  { name: 'shortcuts', type: 'DateShortcut[]', description: '左侧快捷选项列表' },
  { name: 'format', type: 'string', default: "'yyyy-MM-dd'", description: '日期格式（date-fns）' },
]

const today = new Date()

export default function DatePickerPage() {
  const [basic, setBasic] = useState<Date | null>(null)
  const [withShortcuts, setWithShortcuts] = useState<Date | null>(null)
  const [disabledDate, setDisabledDate] = useState<Date | null>(null)
  const [withTime, setWithTime] = useState<Date | null>(null)

  const customShortcuts = [
    { label: '今天', value: () => new Date() },
    { label: '明天', value: () => { const d = new Date(); d.setDate(d.getDate() + 1); return d } },
    { label: '下周', value: () => { const d = new Date(); d.setDate(d.getDate() + 7); return d } },
    { label: '本月末', value: () => new Date(today.getFullYear(), today.getMonth() + 1, 0) },
  ]

  return (
    <div className="preview-page">
      <PageHeader
        title="DatePicker 日期选择器"
        description="基于 react-day-picker 封装，支持快捷选项、时间选择、禁用日期等功能。"
        tags={['业务组件', '数据录入']}
      />

      <DemoSection title="基础日期选择">
        <ComponentDemo
          title="点击弹出日历，选择日期后自动关闭"
          code={`<AppDatePicker value={date} onChange={setDate} />`}
        >
          <div className="flex flex-wrap gap-4">
            <AppDatePicker value={basic} onChange={setBasic} />
            {basic && <span className="self-center text-sm text-muted-foreground">已选：{basic.toLocaleDateString('zh-CN')}</span>}
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="快捷选项">
        <ComponentDemo
          title="左侧显示快捷入口，点击直接选中"
          code={`const shortcuts = [
  { label: '今天', value: () => new Date() },
  { label: '明天', value: () => { const d = new Date(); d.setDate(d.getDate() + 1); return d } },
  { label: '下周', value: () => { const d = new Date(); d.setDate(d.getDate() + 7); return d } },
  { label: '本月末', value: () => new Date(today.getFullYear(), today.getMonth() + 1, 0) },
]
<AppDatePicker value={date} onChange={setDate} shortcuts={shortcuts} />`}
        >
          <AppDatePicker value={withShortcuts} onChange={setWithShortcuts} shortcuts={customShortcuts} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="禁用特定日期">
        <ComponentDemo
          title="通过 disabledDate 函数禁用周末"
          code={`<AppDatePicker
  value={date}
  onChange={setDate}
  disabledDate={(date) => date.getDay() === 0 || date.getDay() === 6}
/>`}
        >
          <AppDatePicker
            value={disabledDate}
            onChange={setDisabledDate}
            disabledDate={(d) => d.getDay() === 0 || d.getDay() === 6}
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="日期时间选择">
        <ComponentDemo
          title="showTime=true 时底部显示时分秒输入"
          code={`<AppDatePicker value={date} onChange={setDate} showTime />`}
        >
          <AppDatePicker value={withTime} onChange={setWithTime} showTime />
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
