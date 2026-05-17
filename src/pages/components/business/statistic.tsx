import { useState } from 'react'
import { Statistic } from '@/components/display'
import { Button } from '@/components/ui/button'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'title', type: 'ReactNode', required: true, description: '统计项标题' },
  { name: 'value', type: 'number | string', required: true, description: '统计数值' },
  { name: 'prefix', type: 'ReactNode', description: '数值前缀' },
  { name: 'suffix', type: 'ReactNode', description: '数值后缀' },
  { name: 'precision', type: 'number', default: '0', description: '小数位数' },
  { name: 'countUp', type: 'boolean', default: 'true', description: '是否开启 countUp 数字动画' },
  { name: 'countUpDuration', type: 'number', default: '2', description: 'countUp 动画时长（秒）' },
  { name: 'trend', type: "'up' | 'down'", description: '趋势方向，显示箭头图标' },
  { name: 'trendValue', type: 'string', description: '趋势变化值文字（如 +12.5%）' },
  { name: 'loading', type: 'boolean', default: 'false', description: '加载状态（Skeleton）' },
  { name: 'formatter', type: '(value: number | string) => ReactNode', description: '自定义数值格式化函数' },
  { name: 'className', type: 'string', description: '容器样式类' },
]

export default function StatisticPage() {
  const [countKey, setCountKey] = useState(0)
  const [loading, setLoading] = useState(false)

  const replayCountUp = () => setCountKey((k) => k + 1)

  const toggleLoading = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Statistic 统计数值"
        description="展示重要数值，支持 countUp 动画（默认开启）、趋势箭头、前后缀、loading 状态。"
        tags={['业务组件', '数据展示']}
      />

      <DemoSection title="基础数值展示">
        <ComponentDemo
          title="4 个统计卡片并排，展示核心业务数据"
          code={`<div className="grid grid-cols-4 gap-4">
  <Statistic title="月销售额" value={128600} prefix="¥" />
  <Statistic title="订单总量" value={8846} suffix="笔" />
  <Statistic title="活跃用户" value={2356} />
  <Statistic title="转化率" value={68.5} precision={1} suffix="%" />
</div>`}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Statistic title="月销售额" value={128600} prefix="¥" />
            <Statistic title="订单总量" value={8846} suffix="笔" />
            <Statistic title="活跃用户" value={2356} />
            <Statistic title="转化率" value={68.5} precision={1} suffix="%" />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="countUp 数字动画">
        <ComponentDemo
          title="countUp 默认开启，value 变化时触发滚动动画，按钮重新播放"
          code={`<Statistic title="访问量" value={98765} />`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Statistic key={countKey} title="今日 PV" value={98765} />
              <Statistic key={countKey + 1} title="今日 UV" value={12350} />
              <Statistic key={countKey + 2} title="新注册用户" value={3210} />
            </div>
            <Button variant="outline" size="sm" onClick={replayCountUp}>重新播放动画</Button>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="带趋势箭头">
        <ComponentDemo
          title="trend='up'/'down' 显示绿色/红色趋势箭头，trendValue 显示变化幅度"
          code={`<Statistic title="销售额" value={128600} trend="up" trendValue="+12.5%" />
<Statistic title="退款率" value={2.3} suffix="%" trend="down" trendValue="-0.8%" />`}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Statistic title="月销售额" value={128600} prefix="¥" trend="up" trendValue="+12.5%" />
            <Statistic title="新用户" value={3860} trend="up" trendValue="+8.2%" />
            <Statistic title="退款率" value={2.3} suffix="%" precision={1} trend="down" trendValue="-0.8%" />
            <Statistic title="客诉量" value={45} trend="down" trendValue="-15%" />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="带前后缀">
        <ComponentDemo
          title="prefix 和 suffix 可传任意 ReactNode"
          code={`<Statistic title="总收入" value={99800} prefix="¥" suffix="元" />
<Statistic title="完成度" value={85} suffix="%" />
<Statistic title="平均评分" value={4.7} prefix="⭐" precision={1} suffix="/5.0" />`}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Statistic title="总收入" value={99800} prefix="¥" suffix="元" />
            <Statistic title="完成度" value={85} suffix="%" />
            <Statistic title="平均评分" value={4.7} prefix="⭐" precision={1} suffix="/5.0" />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Loading 状态">
        <ComponentDemo
          title="loading=true 时显示 Skeleton 骨架屏"
          code={`<Statistic title="销售额" value={128600} loading={loading} />`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Statistic title="月销售额" value={128600} prefix="¥" loading={loading} />
              <Statistic title="订单量" value={8846} loading={loading} />
              <Statistic title="活跃用户" value={2356} loading={loading} />
              <Statistic title="转化率" value={68.5} suffix="%" precision={1} loading={loading} />
            </div>
            <Button variant="outline" size="sm" onClick={toggleLoading}>模拟加载（2s）</Button>
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
