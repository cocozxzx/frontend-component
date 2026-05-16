import { useState } from 'react'
import { z } from 'zod'
import { AppForm } from '@/components/base/AppForm'
import { FormField } from '@/components/base/FormField'
import { AppInput } from '@/components/base/AppInput'
import { AppSelect } from '@/components/base/AppSelect'
import { AppButton } from '@/components/base/AppButton'
import { toast } from '@/hooks/useToast'

const schema = z.object({
  name: z.string().min(2, '姓名至少 2 个字'),
  email: z.string().email('请输入有效邮箱'),
  role: z.string().min(1, '请选择角色'),
  intro: z.string().max(100, '简介不超过 100 字').optional(),
})

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '编辑者', value: 'editor' },
  { label: '观察者', value: 'viewer' },
]

export default function FormPage() {
  const [result, setResult] = useState<string>('')

  return (
    <div className="p-6 space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Form 表单</h1>
        <p className="mt-1 text-muted-foreground text-sm">AppForm 基于 react-hook-form + zod，支持垂直/水平布局、异步提交。</p>
      </div>

      <section className="space-y-4">
        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">垂直布局（默认）</h2>
        <div className="border rounded-xl p-6">
          <AppForm
            schema={schema}
            defaultValues={{ name: '', email: '', role: '' }}
            onSubmit={async (v) => {
              await new Promise((r) => setTimeout(r, 1000))
              setResult(JSON.stringify(v, null, 2))
              toast.success('提交成功')
            }}
          >
            {(form) => (
              <div className="space-y-4">
                <FormField form={form} name="name" label="姓名" required>
                  <AppInput placeholder="请输入姓名" />
                </FormField>
                <FormField form={form} name="email" label="邮箱" required>
                  <AppInput placeholder="请输入邮箱" />
                </FormField>
                <FormField form={form} name="role" label="角色" required>
                  <AppSelect options={roleOptions} placeholder="请选择角色" className="w-full" />
                </FormField>
                <FormField form={form} name="intro" label="简介">
                  <AppInput placeholder="选填简介（最多 100 字）" maxLength={100} showCount />
                </FormField>
                <div className="flex gap-2 pt-2">
                  <AppButton type="submit" loading={form.formState.isSubmitting}>
                    提交
                  </AppButton>
                  <AppButton type="button" variant="outline" onClick={() => form.reset()}>
                    重置
                  </AppButton>
                </div>
              </div>
            )}
          </AppForm>
        </div>
        {result && (
          <pre className="bg-muted rounded-lg p-4 text-xs overflow-auto">{result}</pre>
        )}
      </section>
    </div>
  )
}
