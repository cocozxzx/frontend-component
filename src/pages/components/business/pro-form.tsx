import { useRef } from 'react'
import { ProForm } from '@/components/pro/ProForm'
import { Button } from '@/components/ui/button'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'
import type { ProFormRef } from '@/components/pro/ProForm'
import type { ProFormSchema } from '@/types/schema'

const PROPS: PropItem[] = [
  { name: 'schema', type: 'ProFormSchema', required: true, description: 'JSON Schema 配置（字段、分组、布局等）' },
  { name: 'initialValues', type: 'Record<string, unknown>', description: '表单初始值' },
  { name: 'onSubmit', type: '(values: Record<string, unknown>) => void | Promise<void>', description: '表单提交回调（支持 async 自动 loading）' },
  { name: 'onValuesChange', type: '(values: Record<string, unknown>) => void', description: '字段变化监听' },
  { name: 'renders', type: 'Record<string, FieldRenderFn>', description: 'type=custom 的自定义渲染函数' },
  { name: 'ref', type: 'ProFormRef', description: '暴露 submit/reset/setValue/getValue/getErrors 方法' },
]

const DEVICE_SCHEMA: ProFormSchema = {
  columns: 2,
  layout: 'horizontal',
  submitPosition: 'center',
  submitText: '新增设备',
  fields: [
    { field: 'name', label: '设备名称', type: 'input', required: true, rules: { minLength: 2, maxLength: 50 }, placeholder: '请输入设备名称', span: 12 },
    { field: 'code', label: '设备编号', type: 'input', required: true, rules: { pattern: '^[A-Z0-9-]+$', patternMessage: '只允许大写字母、数字和连字符' }, placeholder: 'DEV-001', span: 12 },
    { field: 'type', label: '设备类型', type: 'select', required: true, span: 12, options: [
      { label: '温度传感器', value: 'temp' },
      { label: '压力传感器', value: 'pressure' },
      { label: '流量计', value: 'flow' },
      { label: '振动传感器', value: 'vibration' },
    ]},
    { field: 'location', label: '安装位置', type: 'input', placeholder: '如：3号厂房西北角', span: 12 },
    { field: 'description', label: '备注说明', type: 'textarea', placeholder: '可选填写设备备注...', span: 24, props: { rows: 3 } },
    { field: 'installDate', label: '安装日期', type: 'date', span: 12 },
    { field: 'enabled', label: '启用状态', type: 'switch', defaultValue: true, span: 12 },
    { field: 'alertThreshold', label: '告警阈值', type: 'number', span: 12, hidden: "values.type !== 'temp'", placeholder: '温度超过此值告警（℃）' },
    { field: 'tags', label: '标签', type: 'tags-input', span: 24, placeholder: '回车添加标签...' },
    { field: 'score', label: '重要程度', type: 'rate', defaultValue: 3, span: 12 },
  ],
}

const GROUP_SCHEMA: ProFormSchema = {
  submitPosition: 'left',
  groups: [
    {
      title: '基本信息',
      description: '填写设备的基础标识信息',
      columns: 2,
      fields: [
        { field: 'name', label: '设备名称', type: 'input', required: true },
        { field: 'code', label: '设备编号', type: 'input', required: true },
        { field: 'type', label: '设备类型', type: 'select', options: [{ label: '传感器', value: 'sensor' }, { label: '控制器', value: 'controller' }] },
        { field: 'brand', label: '品牌', type: 'input' },
      ],
    },
    {
      title: '安装信息',
      description: '填写设备的部署位置和时间',
      columns: 2,
      collapsible: true,
      fields: [
        { field: 'location', label: '安装位置', type: 'input' },
        { field: 'installDate', label: '安装日期', type: 'date' },
        { field: 'maintainer', label: '维护人员', type: 'input' },
        { field: 'period', label: '维护周期', type: 'select', options: [{ label: '每月', value: 'monthly' }, { label: '每季', value: 'quarterly' }, { label: '每年', value: 'yearly' }] },
      ],
    },
    {
      title: '监控配置',
      collapsible: true,
      defaultCollapsed: true,
      columns: 2,
      fields: [
        { field: 'minAlert', label: '告警下限', type: 'number' },
        { field: 'maxAlert', label: '告警上限', type: 'number' },
        { field: 'interval', label: '采集间隔(s)', type: 'number', defaultValue: 60 },
        { field: 'enabled', label: '启用监控', type: 'switch', defaultValue: true },
      ],
    },
  ],
}

export default function ProFormPage() {
  const formRef = useRef<ProFormRef>(null)
  const groupFormRef = useRef<ProFormRef>(null)

  return (
    <div className="preview-page">
      <PageHeader
        title="ProForm 高级表单"
        description="JSON Schema 驱动，22 种字段类型，支持条件显示/禁用、分组（可折叠）、表单联动。"
        tags={['Pro 组件', '数据录入']}
      />

      <DemoSection title="完整 ProForm 示例（设备新增）">
        <ComponentDemo
          title="10+ 种字段类型，条件显示（设备类型为温度传感器时才显示告警阈值）"
          code={`const schema: ProFormSchema = {
  columns: 2,
  layout: 'horizontal',
  fields: [
    { field: 'name', label: '设备名称', type: 'input', required: true },
    { field: 'type', label: '设备类型', type: 'select', options: [...] },
    // 条件显示：type === 'temp' 时才出现
    { field: 'alertThreshold', label: '告警阈值', type: 'number',
      hidden: "values.type !== 'temp'" },
    { field: 'installDate', label: '安装日期', type: 'date' },
    { field: 'enabled', label: '启用状态', type: 'switch', defaultValue: true },
    { field: 'tags', label: '标签', type: 'tags-input' },
    { field: 'score', label: '重要程度', type: 'rate' },
  ],
}

<ProForm schema={schema} onSubmit={async (values) => {
  await saveDevice(values)
}} />`}
        >
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => formRef.current?.submit()}>外部触发提交</Button>
              <Button size="sm" variant="outline" onClick={() => formRef.current?.reset()}>外部触发重置</Button>
              <Button size="sm" variant="outline" onClick={() => formRef.current?.setValue('name', '示例设备-001')}>
                设置设备名称
              </Button>
            </div>
            <ProForm
              ref={formRef}
              schema={DEVICE_SCHEMA}
              onSubmit={async (values) => {
                await new Promise((r) => setTimeout(r, 1000))
                alert(`提交数据：\n${JSON.stringify(values, null, 2)}`)
              }}
            />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="分组表单（FormGroup，可折叠）">
        <ComponentDemo
          title="groups 配置分组标题、描述、collapsible（可折叠）"
          code={`const schema: ProFormSchema = {
  groups: [
    { title: '基本信息', columns: 2, fields: [...] },
    { title: '安装信息', collapsible: true, fields: [...] },
    { title: '监控配置', collapsible: true, defaultCollapsed: true, fields: [...] },
  ],
}`}
        >
          <ProForm
            ref={groupFormRef}
            schema={GROUP_SCHEMA}
            onSubmit={async (values) => {
              await new Promise((r) => setTimeout(r, 800))
              alert(`分组表单提交：\n${JSON.stringify(values, null, 2)}`)
            }}
          />
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
