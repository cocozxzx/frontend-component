import { Link } from 'react-router'
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage as BreadcrumbCurrent, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { AppBreadcrumb } from '@/components/layout/AppBreadcrumb'
import { Home, ChevronRight } from 'lucide-react'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'BreadcrumbLink', type: 'ReactNode', description: '可链接的面包屑项' },
  { name: 'BreadcrumbPage', type: 'ReactNode', description: '当前页（最后一项，不可链接）' },
  { name: 'BreadcrumbSeparator', type: 'ReactNode', description: '分隔符，默认 /' },
]

export default function BreadcrumbPage() {
  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Breadcrumb 面包屑"
        description="显示当前页面在层级结构中的位置。shadcn Breadcrumb 提供基础组件；AppBreadcrumb 自动根据当前路由生成。"
        tags={['shadcn/ui', '导航', '基础组件']}
      />

      <DemoSection title="基础面包屑">
        <ComponentDemo title="三级导航" code={`<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">首页</Link></BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbLink asChild><Link to="/components">组件</Link></BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbCurrent>面包屑</BreadcrumbCurrent></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/">首页</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/components">组件</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbCurrent>面包屑</BreadcrumbCurrent>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="带图标">
        <ComponentDemo title="首页使用 Home 图标" code={`<BreadcrumbItem>
  <BreadcrumbLink asChild>
    <Link to="/"><Home size={14} /></Link>
  </BreadcrumbLink>
</BreadcrumbItem>`}>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/"><Home size={14} /></Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator><ChevronRight size={14} /></BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/components">组件库</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator><ChevronRight size={14} /></BreadcrumbSeparator>
              <BreadcrumbItem><BreadcrumbCurrent>面包屑</BreadcrumbCurrent></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="AppBreadcrumb（路由自动生成）">
        <ComponentDemo title="根据当前 pathname 自动生成面包屑" code={`// 自动根据路由路径生成，无需手动配置
<AppBreadcrumb />`}>
          <div className="border rounded-lg px-4 py-3 bg-muted/30">
            <p className="text-xs text-muted-foreground mb-2">当前页面实际面包屑：</p>
            <AppBreadcrumb />
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
