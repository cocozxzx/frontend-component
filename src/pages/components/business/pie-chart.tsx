import { PieChart } from '@/components/charts'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'data', type: '{ name: string; value: number }[]', required: true, description: '饼图数据' },
  { name: 'donut', type: 'boolean', default: 'false', description: '是否环形图' },
  { name: 'innerRadius', type: 'string', default: "'55%'", description: '环形图内径（donut=true 时生效）' },
  { name: 'outerRadius', type: 'string', default: "'70%'", description: '外径' },
  { name: 'roseType', type: 'boolean', default: 'false', description: '是否南丁格尔玫瑰图' },
  { name: 'centerText', type: 'ReactNode', description: '环形图中心文字（donut=true 时显示）' },
  { name: 'showLabel', type: 'boolean', default: 'true', description: '是否显示标签' },
  { name: 'legend', type: 'boolean', default: 'true', description: '是否显示图例' },
  { name: 'title', type: 'string', description: '图表标题' },
  { name: 'height', type: 'number | string', default: '300', description: '图表高度' },
  { name: 'loading', type: 'boolean', default: 'false', description: '加载状态' },
]

const trafficData = [
  { name: '自然搜索', value: 4350 },
  { name: '直接访问', value: 2850 },
  { name: '社交媒体', value: 1920 },
  { name: '邮件营销', value: 1180 },
  { name: '付费广告', value: 980 },
  { name: '其他', value: 520 },
]

const marketData = [
  { name: '华东', value: 4500 },
  { name: '华南', value: 3200 },
  { name: '华北', value: 2800 },
  { name: '西南', value: 1500 },
  { name: '西北', value: 800 },
]

export default function PieChartPage() {
  return (
    <div className="preview-page">
      <PageHeader
        title="PieChart 饼图"
        description="基于 ECharts 封装，支持普通饼图、环形图、南丁格尔玫瑰图、环形图中心文字。"
        tags={['图表', 'ECharts']}
      />

      <DemoSection title="基础饼图">
        <ComponentDemo
          title="带图例和标签，鼠标悬停显示 tooltip"
          code={`<PieChart data={trafficData} title="流量来源" height={350} />`}
        >
          <PieChart data={trafficData} title="流量来源" height={350} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="环形图">
        <ComponentDemo
          title="donut=true 中间留空，适合配合中心文字展示核心数值"
          code={`<PieChart data={data} donut height={350} />`}
        >
          <PieChart data={trafficData} donut title="流量来源（环形）" height={350} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="南丁格尔玫瑰图">
        <ComponentDemo
          title="roseType=true 时扇区半径表示数值大小"
          code={`<PieChart data={data} roseType height={350} />`}
        >
          <PieChart data={marketData} roseType title="区域销售额玫瑰图（万元）" height={350} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="环形图中心文字">
        <ComponentDemo
          title="centerText 传入 ReactNode，显示在环形图中心"
          code={`<PieChart
  data={data}
  donut
  centerText={
    <div className="text-center">
      <div className="text-2xl font-bold">15,800</div>
      <div className="text-sm text-muted-foreground">总访问量</div>
    </div>
  }
  height={350}
/>`}
        >
          <PieChart
            data={trafficData}
            donut
            centerText={
              <div className="text-center leading-tight">
                <div className="text-2xl font-bold">15,800</div>
                <div className="text-xs text-muted-foreground">总访问量</div>
              </div>
            }
            title="流量分布"
            height={350}
          />
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
