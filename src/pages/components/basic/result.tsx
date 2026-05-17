import { Result } from '@/components/ui/result'
import { Button } from '@/components/ui/button'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'status', type: "'success'|'error'|'warning'|'info'|'403'|'404'|'500'", required: true, description: '结果状态类型' },
  { name: 'title', type: 'string', required: true, description: '标题文字' },
  { name: 'subTitle', type: 'string', description: '描述文字（subTitle）' },
  { name: 'extra', type: 'ReactNode', description: '底部操作区域' },
]

const STATUS_SUBTITLES: Record<string, string> = {
  success: '您的申请已提交成功，请耐心等待审核。',
  error: '网络异常，请稍后重试。',
  warning: '此操作存在风险，请确认后继续。',
  '403': '您没有权限访问此页面，请联系管理员。',
  '404': '您访问的页面不存在或已被删除。',
  '500': '服务器内部错误，请稍后重试或联系技术支持。',
}

const STATUS_TITLES: Record<string, string> = {
  success: '操作成功',
  error: '操作失败',
  warning: '注意事项',
  '403': '403 无权限',
  '404': '404 页面不存在',
  '500': '500 服务器错误',
}

export default function ResultPage() {
  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Result 结果页"
        description="操作结果反馈页面，支持 success / error / warning / info 和 403 / 404 / 500 七种状态类型。"
        tags={['基础组件']}
      />

      <DemoSection title="操作结果">
        <ComponentDemo
          title="success / error / warning"
          code={`<Result
  status="success"
  title="操作成功"
  subTitle="您的申请已提交成功，请耐心等待审核。"
  extra={<Button>返回列表</Button>}
/>`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(['success', 'error', 'warning'] as const).map((status) => (
              <div key={status} className="border rounded-lg overflow-hidden">
                <Result
                  status={status}
                  title={STATUS_TITLES[status]}
                  subTitle={STATUS_SUBTITLES[status]}
                  extra={<Button variant="outline" size="sm">返回</Button>}
                />
              </div>
            ))}
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="错误页面类型">
        <ComponentDemo
          title="403 / 404 / 500"
          code={`<Result status="403" title="403 无权限" subTitle="您没有权限访问此页面。" />
<Result status="404" title="404 页面不存在" subTitle="您访问的页面不存在或已被删除。" />
<Result status="500" title="500 服务器错误" subTitle="服务器内部错误，请稍后重试。" />`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(['403', '404', '500'] as const).map((status) => (
              <div key={status} className="border rounded-lg overflow-hidden">
                <Result
                  status={status}
                  title={STATUS_TITLES[status]}
                  subTitle={STATUS_SUBTITLES[status]}
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
