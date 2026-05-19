import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutDashboard, Settings, User } from 'lucide-react'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'defaultValue', type: 'string', description: '默认激活的 tab key' },
  { name: 'value', type: 'string', description: '受控模式下的当前 tab' },
  { name: 'onValueChange', type: '(value: string) => void', description: 'tab 切换回调' },
]

export default function TabsPage() {
  return (
    <div className="preview-page">
      <PageHeader
        title="Tabs 标签页"
        description="内容切换组件。基于 Radix UI Tabs，支持受控/非受控模式，可添加图标和禁用特定标签。"
        tags={['shadcn/ui', 'Radix UI', '基础组件']}
      />

      <DemoSection title="基础用法">
        <ComponentDemo title="三个 Tab 切换" code={`<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">概览</TabsTrigger>
    <TabsTrigger value="tab2">详情</TabsTrigger>
    <TabsTrigger value="tab3">设置</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">概览内容</TabsContent>
</Tabs>`}>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="detail">详情</TabsTrigger>
              <TabsTrigger value="settings">设置</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <p className="text-sm text-muted-foreground">这是概览标签页的内容区域。</p>
            </TabsContent>
            <TabsContent value="detail" className="mt-4">
              <p className="text-sm text-muted-foreground">这是详情标签页的内容区域。</p>
            </TabsContent>
            <TabsContent value="settings" className="mt-4">
              <p className="text-sm text-muted-foreground">这是设置标签页的内容区域。</p>
            </TabsContent>
          </Tabs>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="带图标的 Tab">
        <ComponentDemo title="TabsTrigger 内嵌 Lucide 图标" code={`<TabsTrigger value="dashboard">
  <LayoutDashboard size={14} />
  仪表盘
</TabsTrigger>`}>
          <Tabs defaultValue="dashboard">
            <TabsList>
              <TabsTrigger value="dashboard" className="gap-1.5">
                <LayoutDashboard size={14} />仪表盘
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-1.5">
                <User size={14} />个人中心
              </TabsTrigger>
              <TabsTrigger value="config" className="gap-1.5">
                <Settings size={14} />配置
              </TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="mt-4">
              <Card><CardHeader><CardTitle className="text-sm">仪表盘内容</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">数据概览区域</p></CardContent></Card>
            </TabsContent>
            <TabsContent value="profile" className="mt-4">
              <Card><CardHeader><CardTitle className="text-sm">个人中心内容</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">用户信息区域</p></CardContent></Card>
            </TabsContent>
            <TabsContent value="config" className="mt-4">
              <Card><CardHeader><CardTitle className="text-sm">配置内容</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">系统设置区域</p></CardContent></Card>
            </TabsContent>
          </Tabs>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="禁用某个 Tab">
        <ComponentDemo title="disabled prop" code={`<TabsTrigger value="locked" disabled>已锁定</TabsTrigger>`}>
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">正常</TabsTrigger>
              <TabsTrigger value="normal2">正常 2</TabsTrigger>
              <TabsTrigger value="locked" disabled>已禁用</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4">
              <p className="text-sm text-muted-foreground">当前激活的标签页内容</p>
            </TabsContent>
            <TabsContent value="normal2" className="mt-4">
              <p className="text-sm text-muted-foreground">第二个标签页内容</p>
            </TabsContent>
          </Tabs>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
