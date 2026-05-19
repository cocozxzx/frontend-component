import { AreaChart } from '@/components/charts'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'data', type: 'Record<string, unknown>[]', required: true, description: '图表数据源' },
  { name: 'xField', type: 'string', required: true, description: 'x 轴字段名' },
  { name: 'yField', type: 'string | string[]', required: true, description: 'y 轴字段名' },
  { name: 'seriesNames', type: 'string[]', description: '各系列图例名称' },
  { name: 'smooth', type: 'boolean', default: 'true', description: '是否平滑曲线' },
  { name: 'stack', type: 'boolean', default: 'false', description: '是否堆叠面积' },
  { name: 'areaOpacity', type: 'number', default: '0.3', description: '面积填充透明度' },
  { name: 'showSymbol', type: 'boolean', default: 'false', description: '是否显示数据点' },
  { name: 'title', type: 'string', description: '图表标题' },
  { name: 'height', type: 'number | string', default: '300', description: '图表高度' },
  { name: 'loading', type: 'boolean', default: 'false', description: '加载状态' },
]

const uvPvData = [
  { date: '1/1', uv: 820, pv: 3200, clicks: 1800 },
  { date: '1/2', uv: 932, pv: 3800, clicks: 2100 },
  { date: '1/3', uv: 901, pv: 3500, clicks: 1950 },
  { date: '1/4', uv: 1290, pv: 5800, clicks: 3100 },
  { date: '1/5', uv: 1330, pv: 6000, clicks: 3400 },
  { date: '1/6', uv: 1320, pv: 5900, clicks: 3200 },
  { date: '1/7', uv: 1450, pv: 7000, clicks: 3800 },
  { date: '1/8', uv: 1280, pv: 6200, clicks: 3350 },
  { date: '1/9', uv: 1100, pv: 5400, clicks: 2900 },
  { date: '1/10', uv: 1560, pv: 7800, clicks: 4100 },
]

export default function AreaChartPage() {
  return (
    <div className="preview-page">
      <PageHeader
        title="AreaChart 面积图"
        description="基于 ECharts 封装，支持单/多系列面积图、堆叠面积图，自带渐变填充效果。"
        tags={['图表', 'ECharts']}
      />

      <DemoSection title="基础面积图">
        <ComponentDemo
          title="单系列面积图，带渐变填充"
          code={`<AreaChart data={data} xField="date" yField="uv" title="日活用户" height={300} />`}
        >
          <AreaChart data={uvPvData} xField="date" yField="uv" title="日活用户（UV）" height={300} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="多系列面积图">
        <ComponentDemo
          title="多系列叠加显示，各系列使用不同颜色"
          code={`<AreaChart
  data={data}
  xField="date"
  yField={['uv', 'clicks']}
  seriesNames={['UV', '点击量']}
  height={300}
/>`}
        >
          <AreaChart
            data={uvPvData}
            xField="date"
            yField={['uv', 'clicks']}
            seriesNames={['UV', '点击量']}
            title="用户行为趋势"
            height={300}
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="堆叠面积图">
        <ComponentDemo
          title="stack=true 时各系列面积叠加，适合展示总量和占比关系"
          code={`<AreaChart
  data={data}
  xField="date"
  yField={['uv', 'pv', 'clicks']}
  seriesNames={['UV', 'PV', '点击量']}
  stack
  height={300}
/>`}
        >
          <AreaChart
            data={uvPvData}
            xField="date"
            yField={['uv', 'pv', 'clicks']}
            seriesNames={['UV', 'PV', '点击量']}
            stack
            title="网站流量堆叠趋势"
            height={300}
          />
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
