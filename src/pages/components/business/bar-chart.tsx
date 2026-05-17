import { BarChart } from '@/components/charts'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'data', type: 'Record<string, unknown>[]', required: true, description: '图表数据源' },
  { name: 'xField', type: 'string', required: true, description: 'x 轴字段名' },
  { name: 'yField', type: 'string | string[]', required: true, description: 'y 轴字段名' },
  { name: 'seriesNames', type: 'string[]', description: '各系列图例名称' },
  { name: 'horizontal', type: 'boolean', default: 'false', description: '是否横向柱状图' },
  { name: 'stack', type: 'boolean | string', default: 'false', description: '是否堆叠，传字符串时为堆叠组名' },
  { name: 'showBackground', type: 'boolean', default: 'false', description: '是否显示背景柱' },
  { name: 'showLabel', type: 'boolean', default: 'false', description: '是否显示数据标签' },
  { name: 'barWidth', type: 'number | string', description: '柱子宽度' },
  { name: 'radius', type: 'number', default: '4', description: '柱子圆角半径' },
  { name: 'title', type: 'string', description: '图表标题' },
  { name: 'height', type: 'number | string', default: '300', description: '图表高度' },
  { name: 'loading', type: 'boolean', default: 'false', description: '加载状态' },
]

const categoryData = [
  { category: '电子产品', q1: 1200, q2: 1500, q3: 1800, q4: 2200 },
  { category: '服装', q1: 800, q2: 950, q3: 1100, q4: 1300 },
  { category: '食品', q1: 2000, q2: 2100, q3: 2300, q4: 2600 },
  { category: '家居', q1: 600, q2: 750, q3: 900, q4: 1050 },
  { category: '运动', q1: 400, q2: 520, q3: 680, q4: 810 },
]

const deptData = [
  { dept: '研发', budget: 500, actual: 480 },
  { dept: '销售', budget: 300, actual: 320 },
  { dept: '市场', budget: 200, actual: 185 },
  { dept: '运营', budget: 150, actual: 148 },
  { dept: '人事', budget: 80, actual: 75 },
]

export default function BarChartPage() {
  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="BarChart 柱状图"
        description="基于 ECharts 封装，支持分组、堆叠、横向、带背景柱，自适应主题色。"
        tags={['图表', 'ECharts']}
      />

      <DemoSection title="基础柱状图">
        <ComponentDemo
          title="分组柱状图，多系列并排显示"
          code={`<BarChart
  data={data}
  xField="category"
  yField={['q1', 'q2', 'q3', 'q4']}
  seriesNames={['Q1', 'Q2', 'Q3', 'Q4']}
  height={300}
/>`}
        >
          <BarChart
            data={categoryData}
            xField="category"
            yField={['q1', 'q2', 'q3', 'q4']}
            seriesNames={['Q1', 'Q2', 'Q3', 'Q4']}
            title="各品类季度销售额（万元）"
            height={300}
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="横向柱状图">
        <ComponentDemo
          title="horizontal=true 时 x/y 轴互换，适合标签较长的场景"
          code={`<BarChart data={data} xField="dept" yField={['budget', 'actual']} horizontal height={280} />`}
        >
          <BarChart
            data={deptData}
            xField="dept"
            yField={['budget', 'actual']}
            seriesNames={['预算', '实际']}
            horizontal
            showLabel
            title="各部门预算对比（万元）"
            height={280}
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="堆叠柱状图">
        <ComponentDemo
          title="stack=true 时各系列叠加显示，便于观察占比关系"
          code={`<BarChart
  data={data}
  xField="category"
  yField={['q1', 'q2', 'q3', 'q4']}
  seriesNames={['Q1', 'Q2', 'Q3', 'Q4']}
  stack
  height={300}
/>`}
        >
          <BarChart
            data={categoryData}
            xField="category"
            yField={['q1', 'q2', 'q3', 'q4']}
            seriesNames={['Q1', 'Q2', 'Q3', 'Q4']}
            stack
            title="各品类全年销售额堆叠（万元）"
            height={300}
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="带背景柱状图">
        <ComponentDemo
          title="showBackground=true 时显示浅色背景柱，视觉对比更直观"
          code={`<BarChart data={data} xField="dept" yField="actual" showBackground showLabel height={280} />`}
        >
          <BarChart
            data={deptData}
            xField="dept"
            yField="actual"
            showBackground
            showLabel
            title="各部门实际支出（万元）"
            height={280}
          />
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
