import { Empty } from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { SearchX, FolderOpen, ShieldOff } from 'lucide-react'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'description', type: 'string', description: '自定义说明文字' },
  { name: 'image', type: 'ReactNode', description: '自定义图片/图标区域' },
  { name: 'action', type: 'ReactNode', description: '操作按钮区域' },
]

export default function EmptyPage() {
  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Empty 空状态"
        description="无数据时的展示占位，提供默认图标和说明文字，支持自定义图标和操作按钮。"
        tags={['基础组件']}
      />

      <DemoSection title="基础空状态">
        <ComponentDemo title="默认样式" code={`<Empty />`}>
          <div className="border rounded-lg p-8">
            <Empty />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="自定义内容">
        <ComponentDemo title="自定义图标、描述、操作按钮" code={`<Empty
  image={<SearchX size={48} className="text-muted-foreground" />}
  description="未找到匹配的搜索结果，请尝试其他关键词"
  action={<Button variant="outline" size="sm">清除筛选</Button>}
/>`}>
          <div className="border rounded-lg p-8">
            <Empty
              image={<SearchX size={48} className="text-muted-foreground" />}
              description="未找到匹配的搜索结果，请尝试其他关键词"
              action={<Button variant="outline" size="sm">清除筛选</Button>}
            />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="业务场景示例">
        <ComponentDemo title="无数据 / 无权限 场景" code={`<Empty image={<FolderOpen />} description="暂无文件" action={<Button>上传文件</Button>} />
<Empty image={<ShieldOff />} description="暂无权限访问此内容" />`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border rounded-lg p-8">
              <Empty
                image={<FolderOpen size={48} className="text-muted-foreground" />}
                description="暂无文件"
                action={<Button size="sm"><span className="text-xs">上传文件</span></Button>}
              />
            </div>
            <div className="border rounded-lg p-8">
              <Empty
                image={<ShieldOff size={48} className="text-muted-foreground" />}
                description="暂无权限访问此内容"
              />
            </div>
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
