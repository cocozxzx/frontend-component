import { useState } from 'react'
import { AppDateRangePicker } from '@/components/base'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'value', type: '[Date | null, Date | null]', description: '当前选中的日期范围（受控）' },
  { name: 'onChange', type: '(range: [Date | null, Date | null]) => void', description: '范围变化回调' },
  { name: 'placeholder', type: '[string, string]', description: '开始/结束日期占位文字' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用状态' },
  { name: 'allowClear', type: 'boolean', default: 'true', description: '是否显示清除按钮' },
  { name: 'disabledDate', type: '(date: Date) => boolean', description: '禁用特定日期的函数' },
  { name: 'shortcuts', type: 'RangeShortcut[]', description: '左侧快捷选项列表' },
]

type DateRange = [Date | null, Date | null]

export default function DateRangePage() {
  const [basic, setBasic] = useState<DateRange>([null, null])
  const [withShortcuts, setWithShortcuts] = useState<DateRange>([null, null])
  const [disabledRange, setDisabledRange] = useState<DateRange>([null, null])

  const today = new Date()

  const recentShortcuts = [
    {
      label: '最近 7 天',
      value: (): DateRange => {
        const start = new Date()
        start.setDate(start.getDate() - 6)
        return [start, today]
      },
    },
    {
      label: '最近 30 天',
      value: (): DateRange => {
        const start = new Date()
        start.setDate(start.getDate() - 29)
        return [start, today]
      },
    },
    {
      label: '本月',
      value: (): DateRange => {
        return [new Date(today.getFullYear(), today.getMonth(), 1), new Date(today.getFullYear(), today.getMonth() + 1, 0)]
      },
    },
    {
      label: '上月',
      value: (): DateRange => {
        return [new Date(today.getFullYear(), today.getMonth() - 1, 1), new Date(today.getFullYear(), today.getMonth(), 0)]
      },
    },
  ]

  return (
    <div className="preview-page">
      <PageHeader
        title="DateRange 日期范围选择"
        description="双月视图日期范围选择器，支持快捷选项、禁用日期区间。"
        tags={['业务组件', '数据录入']}
      />

      <DemoSection title="基础日期范围">
        <ComponentDemo
          title="双月视图，hover 高亮选择区间"
          code={`<AppDateRangePicker value={range} onChange={setRange} />`}
        >
          <div className="flex flex-wrap gap-4">
            <AppDateRangePicker value={basic} onChange={setBasic} />
            {basic[0] && basic[1] && (
              <span className="self-center text-sm text-muted-foreground">
                {basic[0].toLocaleDateString('zh-CN')} ~ {basic[1].toLocaleDateString('zh-CN')}
              </span>
            )}
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="快捷选项">
        <ComponentDemo
          title="左侧提供最近 7 天、30 天、本月、上月快捷入口"
          code={`const shortcuts = [
  { label: '最近 7 天', value: () => [start7, today] },
  { label: '最近 30 天', value: () => [start30, today] },
  { label: '本月', value: () => [monthStart, monthEnd] },
  { label: '上月', value: () => [lastMonthStart, lastMonthEnd] },
]
<AppDateRangePicker value={range} onChange={setRange} shortcuts={shortcuts} />`}
        >
          <AppDateRangePicker value={withShortcuts} onChange={setWithShortcuts} shortcuts={recentShortcuts} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="禁用日期范围">
        <ComponentDemo
          title="通过 disabledDate 禁用未来日期"
          code={`<AppDateRangePicker
  value={range}
  onChange={setRange}
  disabledDate={(date) => date > new Date()}
/>`}
        >
          <AppDateRangePicker
            value={disabledRange}
            onChange={setDisabledRange}
            disabledDate={(d) => d > new Date()}
          />
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
