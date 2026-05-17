import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/charts'
import { TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const STAT_DATA = [
  { title: '总销售额', value: 124580, prefix: '¥', trend: 12.5, trendLabel: '较上月', color: '#1890FF', sparklineData: [80,95,110,100,120,115,125] },
  { title: '用户总数', value: 8842, trend: 5.2, trendLabel: '较上月', color: '#52C41A', sparklineData: [70,75,72,80,85,82,88] },
  { title: '订单量', value: 2350, trend: -3.1, trendLabel: '较上月', color: '#FA8C16', sparklineData: [90,85,88,82,80,78,76] },
  { title: '平均客单价', value: 53, prefix: '¥', suffix: '元', trend: 8.8, trendLabel: '较上月', color: '#722ED1', sparklineData: [40,45,48,50,52,51,53] },
]

const PROPS: PropItem[] = [
  { name: 'className', type: 'string', description: '自定义 CSS 类名' },
  { name: 'CardHeader', type: 'ReactNode', description: '卡片头部插槽（CardHeader 子组件）' },
  { name: 'CardContent', type: 'ReactNode', description: '卡片内容插槽' },
  { name: 'CardFooter', type: 'ReactNode', description: '卡片底部插槽' },
]

export default function CardPage() {
  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Card 卡片"
        description="通用内容容器。shadcn Card 提供 Header/Content/Footer 三个区域；StatCard 是专用于数据展示的数值卡片。"
        tags={['shadcn/ui', '基础组件']}
      />

      <DemoSection title="基础卡片">
        <ComponentDemo title="带 Header / Content / Footer 的完整卡片" code={`<Card>
  <CardHeader>
    <CardTitle>卡片标题</CardTitle>
    <CardDescription>卡片描述信息</CardDescription>
  </CardHeader>
  <CardContent>内容区域</CardContent>
  <CardFooter>
    <Button>操作按钮</Button>
  </CardFooter>
</Card>`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>项目概览</CardTitle>
                <CardDescription>查看当前项目的整体进度和状态</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">内容区域，可放置任意 React 组件。</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm">取消</Button>
                <Button size="sm">保存</Button>
              </CardFooter>
            </Card>
            <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-primary" />
                  可点击卡片
                </CardTitle>
                <CardDescription>hover 时有上浮和阴影效果</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">通过 CSS transition 实现平滑的 hover 动效。</p>
              </CardContent>
            </Card>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="StatCard 数值卡片">
        <ComponentDemo title="四个 StatCard 并排，含迷你趋势图" code={`<StatCard
  title="总销售额" value={124580} prefix="¥"
  trend={12.5} trendLabel="较上月"
  sparklineData={[80,95,110,100,120,115,125]}
/>`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {STAT_DATA.map((item) => (
              <StatCard key={item.title} {...item} />
            ))}
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="无 Header 纯内容卡片">
        <ComponentDemo title="仅 CardContent" code={`<Card><CardContent className="pt-6">仅内容区域的简洁卡片</CardContent></Card>`}>
          <div className="grid grid-cols-3 gap-4">
            {[Users, ShoppingCart, DollarSign].map((Icon, i) => (
              <Card key={i} className="text-center">
                <CardContent className="pt-6 pb-4">
                  <Icon size={32} className="text-primary mx-auto mb-2" />
                  <p className="font-semibold">{['用户', '订单', '收入'][i]}</p>
                  <p className="text-sm text-muted-foreground mt-1">查看详情</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
