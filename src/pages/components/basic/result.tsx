import { Result } from '@/components/ui/result'
import { Button } from '@/components/ui/button'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'status', type: "'success'|'error'|'warning'|'info'|'403'|'404'|'500'", required: true, description: '结果状态类型' },
  { name: 'title', type: 'string', description: '标题文字' },
  { name: 'description', type: 'string', description: '描述文字' },
  { name: 'extra', type: 'ReactNode', description: '底部操作区域' },
]

export default function ResultPage() {
  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Result 结果页"
        description="操作结果反馈页面，支持 success/error/warning/info 和 403/404/500 七种状态类型。"
        tags={['基础组件']}
      />

      <DemoSection title="操作结果">
        <ComponentDemo title="success / error / warning" code={`<Result status="success" title="提交成功" description="您的申请已提交，请等待审核。"
  extra={<Button>返回列表</Button>} />
<Result status="error" title="提交失败" description="网络异常，请稍后重试。" />`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(['success', 'error', 'warning'] as const).map(status => (
              <div key={status} className="border rounded-lg">
                <Result
                  status={status}
                  title={{ success: '操作成功', error: '操作失败', warning: '注意事项' }[status]}
                  description={{ success: '您的申请已提交成功。', error: '网络异常，请重试。', warning: '操作存在风险，请确认。' }[status]}
                  extra={<Button variant="outline" size="sm">返回</Button>}
                />
              </div>
            ))}
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="错误页面类型">
        <ComponentDemo title="403 / 404 / 500" code={`<Result status="403" title="403" description="无权访问此页面" />
<Result status="404" title="404" description="页面不存在" />
<Result status="500" title="500" description="服务器错误" />`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(['403', '404', '500'] as const).map(status => (
              <div key={status} className="border rounded-lg">
                <Result
                  status={status}
                  title={status}
                  description={{ '403': '无权访问此页面', '404': '页面不存在', '500': '服务器内部错误' }[status]}
                  extra={<Button variant="outline" size="sm">返回首页</Button>}
                />
              </div>
            ))}
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
