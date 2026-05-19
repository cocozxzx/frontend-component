import { useRef } from 'react'
import { z } from 'zod'
import { toast } from '@/hooks/useToast'
import { AppForm } from '@/components/base/AppForm'
import { FormField } from '@/components/base/FormField'
import { AppInput } from '@/components/base/AppInput'
import { ProForm } from '@/components/pro/ProForm'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'
import type { ProFormRef } from '@/components/pro/ProForm'
import type { ProFormSchema } from '@/types/schema'

const loginSchema = z.object({
  username: z.string().min(3, '用户名至少 3 位'),
  password: z.string().min(6, '密码至少 6 位'),
})

const cityOptions = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' },
]

const proSchema: ProFormSchema = {
  columns: 2,
  fields: [
    { field: 'name', label: '姓名', type: 'input', required: true, span: 12, rules: { minLength: 2 } },
    { field: 'age', label: '年龄', type: 'number', span: 12, rules: { min: 1, max: 120 } },
    { field: 'email', label: '邮箱', type: 'input', span: 24, rules: { email: true } },
    { field: 'city', label: '城市', type: 'select', span: 12, options: cityOptions },
    { field: 'bio', label: '简介', type: 'textarea', span: 24 },
    { field: 'notify', label: '接收通知', type: 'switch', span: 12 },
    { field: 'score', label: '满意度', type: 'rate', span: 12 },
  ],
  submitText: '提交注册',
}

const PROPS: PropItem[] = [
  { name: 'schema', type: 'z.ZodType', required: true, description: '(AppForm) Zod 校验 schema' },
  { name: 'onSubmit', type: '(values) => void', required: true, description: '提交回调' },
  { name: 'layout', type: "'vertical'|'horizontal'", default: "'vertical'", description: 'ProForm 布局方向' },
  { name: 'columns', type: 'number', default: '1', description: 'ProForm 列数（24栅格分列）' },
  { name: 'fields', type: 'FormField[]', description: 'ProForm 平铺字段配置' },
  { name: 'groups', type: 'FormGroup[]', description: 'ProForm 分组字段配置' },
  { name: 'formRef', type: 'RefObject<ProFormRef>', description: 'ProForm 命令式引用' },
]

export default function FormPage() {
  const proRef = useRef<ProFormRef | null>(null)

  return (
    <div className="preview-page">
      <PageHeader
        title="Form 表单"
        description="数据录入与校验容器。AppForm 使用 react-hook-form + Zod；ProForm 传入 JSON Schema 自动渲染完整表单。"
        tags={['react-hook-form', 'Zod', '基础组件']}
      />

      <DemoSection title="AppForm — Zod 校验">
        <ComponentDemo
          title="基础登录表单"
          code={`const schema = z.object({
  username: z.string().min(3, '用户名至少 3 位'),
  password: z.string().min(6, '密码至少 6 位'),
})
<AppForm schema={schema} onSubmit={handleSubmit}>
  {({ control }) => (
    <>
      <FormField control={control} name="username" label="用户名" required>
        <AppInput placeholder="请输入用户名" />
      </FormField>
      <FormField control={control} name="password" label="密码" required>
        <AppInput type="password" placeholder="请输入密码" />
      </FormField>
    </>
  )}
</AppForm>`}
        >
          <div className="max-w-sm">
            <AppForm schema={loginSchema} onSubmit={(v) => toast.success(`提交：${JSON.stringify(v)}`)}>
              {({ control }) => (
                <>
                  <FormField control={control} name="username" label="用户名" required>
                    <AppInput placeholder="用户名（至少 3 位）" />
                  </FormField>
                  <FormField control={control} name="password" label="密码" required>
                    <AppInput type="password" placeholder="密码（至少 6 位）" />
                  </FormField>
                </>
              )}
            </AppForm>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="ProForm — Schema 驱动">
        <ComponentDemo
          title="JSON Schema 渲染完整表单（含 8 种字段类型）"
          code={`const schema: ProFormSchema = {
  columns: 2,
  fields: [
    { field: 'name', label: '姓名', type: 'input', required: true, span: 12 },
    { field: 'age', label: '年龄', type: 'number', span: 12 },
    { field: 'email', label: '邮箱', type: 'input', rules: { email: true }, span: 24 },
    { field: 'city', label: '城市', type: 'select', options: cityList, span: 12 },
    { field: 'bio', label: '简介', type: 'textarea', span: 24 },
    { field: 'notify', label: '接收通知', type: 'switch', span: 12 },
    { field: 'score', label: '满意度', type: 'rate', span: 12 },
  ],
}
<ProForm schema={schema} onSubmit={handleSubmit} formRef={proRef} />`}
        >
          <ProForm
            schema={proSchema}
            formRef={proRef}
            onSubmit={(v) => toast.success(`提交成功！\n${JSON.stringify(v, null, 2)}`)}
          />
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
