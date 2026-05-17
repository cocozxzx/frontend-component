import { Search, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { AppInput } from '@/components/base/AppInput'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'value', type: 'string', description: '受控值' },
  { name: 'onChange', type: '(e: ChangeEvent) => void', description: '值变化回调' },
  { name: 'placeholder', type: 'string', description: '占位文字' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用' },
  { name: 'prefix', type: 'ReactNode', description: '(AppInput) 前置图标/内容' },
  { name: 'suffix', type: 'ReactNode', description: '(AppInput) 后置图标/内容' },
  { name: 'allowClear', type: 'boolean', default: 'false', description: '(AppInput) 显示清除按钮' },
  { name: 'showCount', type: 'boolean', default: 'false', description: '(AppInput) 显示字数统计' },
  { name: 'maxLength', type: 'number', description: '(AppInput) 最大字符数' },
  { name: 'loading', type: 'boolean', default: 'false', description: '(AppInput) 后置加载状态' },
]

export default function InputPage() {
  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Input 输入框"
        description="单行文本输入框。AppInput 在 shadcn Input 基础上增加了前后缀、清除按钮、字数统计、loading 状态。"
        tags={['shadcn/ui', '表单', '基础组件']}
      />

      <DemoSection title="基础用法">
        <ComponentDemo title="基础输入框" code={`<Input placeholder="请输入内容" />
<Input placeholder="禁用状态" disabled />`}>
          <div className="max-w-sm space-y-3">
            <Input placeholder="请输入内容" />
            <Input placeholder="禁用状态" disabled />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="前后缀">
        <ComponentDemo
          title="prefix / suffix 插槽"
          code={`<AppInput prefix={<Search size={15} />} placeholder="搜索..." />
<AppInput suffix={<Eye size={15} />} placeholder="密码" type="password" />`}
        >
          <div className="max-w-sm space-y-3">
            <AppInput prefix={<Search size={15} className="text-muted-foreground" />} placeholder="搜索..." />
            <AppInput suffix={<Eye size={15} className="text-muted-foreground" />} placeholder="密码" type="password" />
            <AppInput
              prefix={<span className="text-muted-foreground text-sm">https://</span>}
              suffix={<span className="text-muted-foreground text-sm">.com</span>}
              placeholder="域名"
            />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="清除 & 字数统计">
        <ComponentDemo
          title="allowClear + showCount"
          code={`<AppInput allowClear placeholder="可清除" />
<AppInput showCount maxLength={50} placeholder="最多 50 字" />`}
        >
          <div className="max-w-sm space-y-3">
            <AppInput allowClear placeholder="输入内容后显示清除按钮" />
            <AppInput showCount maxLength={50} placeholder="最多 50 个字符" />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Loading 状态">
        <ComponentDemo title="后置 loading spinner" code={`<AppInput loading placeholder="数据加载中..." />`}>
          <div className="max-w-sm">
            <AppInput loading placeholder="数据加载中..." />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="组合示例">
        <ComponentDemo
          title="前缀 + 清除 + 字数统计"
          code={`<AppInput prefix={<Search size={15} />} allowClear showCount maxLength={100} />`}
        >
          <div className="max-w-sm space-y-3">
            <AppInput prefix={<Search size={15} className="text-muted-foreground" />} allowClear showCount maxLength={100} placeholder="前缀+清除+计数" />
            <AppInput suffix={<EyeOff size={15} className="text-muted-foreground" />} type="password" allowClear placeholder="密码（后缀+清除）" />
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
