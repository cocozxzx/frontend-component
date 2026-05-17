import { useMemo } from 'react'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { AppSelect } from '@/components/base/AppSelect'
import { VirtualSelect } from '@/components/advanced/VirtualSelect'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const BASIC_OPTIONS = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' },
  { label: '深圳', value: 'shenzhen' },
  { label: '杭州', value: 'hangzhou' },
]

const PROPS: PropItem[] = [
  { name: 'value', type: 'string | number', description: '当前选中值' },
  { name: 'onChange', type: '(value) => void', description: '选择回调' },
  { name: 'options', type: 'SelectOption[]', description: '(AppSelect) 选项列表' },
  { name: 'allowSearch', type: 'boolean', default: 'false', description: '(AppSelect) 本地搜索过滤' },
  { name: 'remote', type: 'boolean', default: 'false', description: '(AppSelect) 远程搜索模式' },
  { name: 'onSearch', type: '(kw) => Promise<Option[]>', description: '(AppSelect) 远程搜索函数' },
  { name: 'virtual', type: 'boolean', default: 'auto', description: '(AppSelect) 强制虚拟滚动' },
  { name: 'multiple', type: 'boolean', default: 'false', description: '(VirtualSelect) 多选模式' },
]

async function mockRemoteSearch(keyword: string) {
  await new Promise((r) => setTimeout(r, 500))
  return BASIC_OPTIONS.filter((o) => o.label.includes(keyword))
}

export default function SelectPage() {
  const bigOptions = useMemo(() =>
    Array.from({ length: 10000 }, (_, i) => ({
      label: `选项 ${i + 1}`,
      value: i + 1,
    })), [])

  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Select 选择器"
        description="下拉选择组件。AppSelect 封装了本地搜索、远程搜索、虚拟滚动；VirtualSelect 支持10万条数据流畅渲染和多选。"
        tags={['shadcn/ui', '表单', '基础组件']}
      />

      <DemoSection title="基础 shadcn Select">
        <ComponentDemo
          title="原生 Select 组件"
          code={`<Select>
  <SelectTrigger className="w-48">
    <SelectValue placeholder="请选择城市" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="beijing">北京</SelectItem>
    <SelectItem value="shanghai">上海</SelectItem>
  </SelectContent>
</Select>`}
        >
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="请选择城市" />
            </SelectTrigger>
            <SelectContent>
              {BASIC_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="AppSelect — 本地搜索">
        <ComponentDemo
          title="allowSearch=true 本地过滤"
          code={`<AppSelect options={cities} allowSearch placeholder="搜索城市" />`}
        >
          <div className="max-w-xs">
            <AppSelect options={BASIC_OPTIONS} allowSearch placeholder="搜索城市" onChange={() => {}} />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="AppSelect — 远程搜索">
        <ComponentDemo
          title="remote=true + onSearch（模拟 500ms 延迟）"
          code={`<AppSelect
  remote
  onSearch={async (kw) => fetchCities(kw)}
  placeholder="输入关键词搜索"
/>`}
        >
          <div className="max-w-xs">
            <AppSelect remote onSearch={mockRemoteSearch} placeholder="输入关键词搜索" onChange={() => {}} />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="VirtualSelect — 万级数据">
        <ComponentDemo
          title="10000 条数据虚拟滚动（单选 / 多选）"
          code={`// 10000 条数据，流畅滚动
<VirtualSelect options={bigOptions} searchable placeholder="单选" />
<VirtualSelect options={bigOptions} multiple placeholder="多选" />`}
        >
          <div className="grid grid-cols-2 gap-4 max-w-xl">
            <VirtualSelect options={bigOptions} searchable placeholder="单选（10000 条）" />
            <VirtualSelect options={bigOptions} multiple searchable placeholder="多选（10000 条）" />
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
