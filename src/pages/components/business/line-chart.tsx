import { LineChart } from '@/components/charts'

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
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">LineChart 折线图</h1>
        <p className="mt-1 text-muted-foreground text-sm">基于 ECharts 封装，支持多系列、面积图、平滑曲线。</p>
      </div>

      <section className="space-y-2">
        <h2 className="font-medium">基础折线图</h2>
        <div className="border rounded-xl p-4">
          <LineChart
            data={monthData}
            xField="month"
            yField="sales"
            title="月销售额"
            height={300}
          />
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">多系列折线图</h2>
        <div className="border rounded-xl p-4">
          <LineChart
            data={monthData}
            xField="month"
            yField={['sales', 'profit', 'cost']}
            seriesNames={['销售额', '利润', '成本']}
            title="多指标对比"
            height={300}
          />
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">平滑曲线 + 显示数据点</h2>
        <div className="border rounded-xl p-4">
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
        </div>
      </section>
    </div>
  )
}
