import { useState } from 'react'
import { ShoppingCart, Users, TrendingUp, DollarSign } from 'lucide-react'
import { StatCard } from '@/components/charts'
import { Button } from '@/components/ui/button'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'title', type: 'string', required: true, description: '卡片标题' },
  { name: 'value', type: 'number | string', required: true, description: '核心数值' },
  { name: 'prefix', type: 'ReactNode', description: '数值前缀（如 ¥）' },
  { name: 'suffix', type: 'ReactNode', description: '数值后缀（如 万元）' },
  { name: 'precision', type: 'number', default: '0', description: '小数位数' },
  { name: 'trend', type: "'up' | 'down'", description: '趋势箭头方向' },
  { name: 'trendValue', type: 'string', description: '趋势变化值文字' },
  { name: 'trendDesc', type: 'string', description: '趋势描述文字' },
  { name: 'miniChart', type: "{ type: 'line' | 'bar'; data: number[] }", description: '右侧迷你图配置' },
  { name: 'icon', type: 'ReactNode', description: '左侧图标' },
  { name: 'iconBg', type: 'string', description: '图标背景色（默认使用主题色）' },
  { name: 'loading', type: 'boolean', default: 'false', description: '加载状态' },
  { name: 'onClick', type: '() => void', description: '点击卡片回调（有回调时显示 hover 效果）' },
]

const miniLineData = [820, 932, 901, 1290, 1330, 1320, 1450, 1280, 1560, 1820]
const miniBarData = [60, 80, 75, 95, 88, 72, 90, 85, 78, 92]

export default function StatCardPage() {
  const [loading, setLoading] = useState(false)

  const toggleLoading = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="preview-page">
      <PageHeader
        title="StatCard 统计卡片"
        description="仪表盘核心指标卡，支持趋势箭头、迷你折线/柱状图、图标、countUp 动画。"
        tags={['图表', '数据展示']}
      />

      <DemoSection title="网格布局（4个指标卡）">
        <ComponentDemo
          title="销售额/订单量/用户数/转化率四卡并排"
          code={`<div className="grid grid-cols-4 gap-4">
  <StatCard title="月销售额" value={128600} prefix="¥" trend="up" trendValue="+12.5%" />
  <StatCard title="本月订单" value={8846} suffix="笔" trend="up" trendValue="+8%" />
  <StatCard title="活跃用户" value={23560} trend="up" trendValue="+5.2%" />
  <StatCard title="转化率" value={68.5} suffix="%" precision={1} trend="down" trendValue="-2.1%" />
</div>`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="月销售额" value={128600} prefix="¥" trend="up" trendValue="+12.5%" trendDesc="较上月" />
            <StatCard title="本月订单" value={8846} suffix="笔" trend="up" trendValue="+8.0%" trendDesc="较上月" />
            <StatCard title="活跃用户" value={23560} trend="up" trendValue="+5.2%" trendDesc="较上月" />
            <StatCard title="转化率" value={68.5} suffix="%" precision={1} trend="down" trendValue="-2.1%" trendDesc="较上月" />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="带迷你折线图">
        <ComponentDemo
          title="miniChart.type='line' 右侧显示趋势折线图"
          code={`<StatCard
  title="月销售额"
  value={128600}
  prefix="¥"
  miniChart={{ type: 'line', data: [820, 932, 901, 1290, 1330, 1320, 1450] }}
/>`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              title="月销售额"
              value={128600}
              prefix="¥"
              trend="up"
              trendValue="+12.5%"
              miniChart={{ type: 'line', data: miniLineData }}
            />
            <StatCard
              title="活跃用户"
              value={23560}
              trend="up"
              trendValue="+5.2%"
              miniChart={{ type: 'line', data: miniLineData.map((v) => Math.floor(v / 50)) }}
            />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="带迷你柱状图">
        <ComponentDemo
          title="miniChart.type='bar' 右侧显示近期柱状图"
          code={`<StatCard
  title="本月订单"
  value={8846}
  miniChart={{ type: 'bar', data: [60, 80, 75, 95, 88, 72, 90] }}
/>`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              title="本月订单"
              value={8846}
              suffix="笔"
              trend="up"
              trendValue="+8.0%"
              miniChart={{ type: 'bar', data: miniBarData }}
            />
            <StatCard
              title="转化率"
              value={68.5}
              suffix="%"
              precision={1}
              trend="down"
              trendValue="-2.1%"
              miniChart={{ type: 'bar', data: miniBarData.map((v) => v - 5 + Math.random() * 10) }}
            />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="带图标">
        <ComponentDemo
          title="icon 属性传入 ReactNode，iconBg 设置背景色"
          code={`<StatCard
  title="月销售额"
  value={128600}
  prefix="¥"
  icon={<DollarSign size={24} />}
  iconBg="#1890ff"
/>`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="月销售额" value={128600} prefix="¥" icon={<DollarSign size={22} />} iconBg="#1890ff" trend="up" trendValue="+12.5%" />
            <StatCard title="本月订单" value={8846} icon={<ShoppingCart size={22} />} iconBg="#52c41a" trend="up" trendValue="+8%" />
            <StatCard title="活跃用户" value={23560} icon={<Users size={22} />} iconBg="#722ed1" trend="up" trendValue="+5.2%" />
            <StatCard title="转化率" value={68.5} suffix="%" precision={1} icon={<TrendingUp size={22} />} iconBg="#fa8c16" trend="down" trendValue="-2.1%" />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Loading 状态">
        <ComponentDemo
          title="loading=true 时显示 Skeleton 骨架屏"
          code={`<StatCard title="销售额" value={128600} loading={loading} />`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="月销售额" value={128600} prefix="¥" loading={loading} trend="up" trendValue="+12.5%" />
              <StatCard title="本月订单" value={8846} loading={loading} trend="up" trendValue="+8%" />
              <StatCard title="活跃用户" value={23560} loading={loading} trend="up" trendValue="+5.2%" />
              <StatCard title="转化率" value={68.5} suffix="%" precision={1} loading={loading} trend="down" trendValue="-2.1%" />
            </div>
            <Button variant="outline" size="sm" onClick={toggleLoading}>模拟加载（2s）</Button>
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
