import { LineChart } from '@/components/charts'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'data', type: 'Record<string, unknown>[]', required: true, description: '图表数据源' },
  { name: 'xField', type: 'string', required: true, description: 'x 轴字段名' },
  { name: 'yField', type: 'string | string[]', required: true, description: 'y 轴字段名（多系列传数组）' },
  { name: 'seriesNames', type: 'string[]', description: '各系列的图例名称' },
  { name: 'smooth', type: 'boolean', default: 'false', description: '是否平滑曲线' },
  { name: 'area', type: 'boolean', default: 'false', description: '是否显示面积填充' },
  { name: 'showSymbol', type: 'boolean', default: 'false', description: '是否显示数据点' },
  { name: 'showLabel', type: 'boolean', default: 'false', description: '是否显示数据标签' },
  { name: 'title', type: 'string', description: '图表标题' },
  { name: 'legend', type: 'boolean', default: 'true', description: '是否显示图例' },
  { name: 'height', type: 'number | string', default: '300', description: '图表高度' },
  { name: 'loading', type: 'boolean', default: 'false', description: '加载状态' },
  { name: 'className', type: 'string', description: '容器样式类' },
]

const monthData = [
  { month: '1月', sales: 820, profit: 300, cost: 520 },
  { month: '2月', sales: 932, profit: 380, cost: 552 },
  { month: '3月', sales: 901, profit: 350, cost: 551 },
  { month: '4月', sales: 1290, profit: 580, cost: 710 },
  { month: '5月', sales: 1330, profit: 600, cost: 730 },
  { month: '6月', sales: 1320, profit: 590, cost: 730 },
  { month: '7月', sales: 1450, profit: 700, cost: 750 },
]

export default function LineChartPage() {
  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="LineChart 折线图"
        description="基于 ECharts 封装，支持单/多系列、平滑曲线、面积填充、数据标签，自适应主题色。"
        tags={['图表', 'ECharts']}
      />

      <DemoSection title="单系列折线">
        <ComponentDemo
          title="最简使用：指定 xField、yField 即可"
          code={`<LineChart data={data} xField="month" yField="sales" title="月销售额" height={300} />`}
        >
          <LineChart data={monthData} xField="month" yField="sales" title="月销售额" height={300} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="多系列折线">
        <ComponentDemo
          title="yField 传数组，配合 seriesNames 设置图例名"
          code={`<LineChart
  data={data}
  xField="month"
  yField={['sales', 'profit', 'cost']}
  seriesNames={['销售额', '利润', '成本']}
  height={300}
/>`}
        >
          <LineChart
            data={monthData}
            xField="month"
            yField={['sales', 'profit', 'cost']}
            seriesNames={['销售额', '利润', '成本']}
            title="多指标对比"
            height={300}
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="平滑折线">
        <ComponentDemo
          title="smooth=true 曲线更圆滑，showSymbol=true 显示数据点"
          code={`<LineChart
  data={data}
  xField="month"
  yField={['sales', 'profit']}
  seriesNames={['销售额', '利润']}
  smooth showSymbol showLabel
  height={300}
/>`}
        >
          <LineChart
            data={monthData}
            xField="month"
            yField={['sales', 'profit']}
            seriesNames={['销售额', '利润']}
            smooth
            showSymbol
            showLabel
            height={300}
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="带数据标签">
        <ComponentDemo
          title="showLabel=true 时在折点上方显示数值"
          code={`<LineChart data={data} xField="month" yField="sales" showLabel height={280} />`}
        >
          <LineChart data={monthData} xField="month" yField="sales" showLabel height={280} />
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
