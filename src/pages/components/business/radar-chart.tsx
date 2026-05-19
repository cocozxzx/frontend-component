import { RadarChart } from '@/components/charts'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'indicators', type: '{ name: string; max: number }[]', required: true, description: '雷达轴指标配置' },
  { name: 'data', type: 'RadarSeriesData[]', required: true, description: '雷达图数据' },
  { name: 'shape', type: "'polygon' | 'circle'", default: "'polygon'", description: '雷达图外形' },
  { name: 'splitNumber', type: 'number', default: '4', description: '雷达轴分割段数' },
  { name: 'filled', type: 'boolean', default: 'true', description: '是否填充面积' },
  { name: 'areaOpacity', type: 'number', default: '0.3', description: '面积透明度' },
  { name: 'title', type: 'string', description: '图表标题' },
  { name: 'height', type: 'number | string', default: '300', description: '图表高度' },
  { name: 'loading', type: 'boolean', default: 'false', description: '加载状态' },
]

const capabilityIndicators = [
  { name: '技术能力', max: 100 },
  { name: '沟通能力', max: 100 },
  { name: '解决问题', max: 100 },
  { name: '团队协作', max: 100 },
  { name: '创新思维', max: 100 },
  { name: '执行力', max: 100 },
]

const singleData = [
  { name: '张三', value: [85, 72, 90, 88, 75, 92] },
]

const multiData = [
  { name: '张三', value: [85, 72, 90, 88, 75, 92] },
  { name: '李四', value: [70, 88, 78, 82, 90, 76] },
]

const productIndicators = [
  { name: '功能完整性', max: 100 },
  { name: '性能', max: 100 },
  { name: '易用性', max: 100 },
  { name: '安全性', max: 100 },
  { name: '可扩展性', max: 100 },
]

const competitorData = [
  { name: '我司产品', value: [88, 92, 85, 90, 78] },
  { name: '竞品 A', value: [75, 80, 90, 72, 88] },
  { name: '竞品 B', value: [82, 70, 75, 85, 92] },
]

export default function RadarChartPage() {
  return (
    <div className="preview-page">
      <PageHeader
        title="RadarChart 雷达图"
        description="基于 ECharts 封装，支持多边形/圆形外框、多系列对比、面积填充，适合多维度评估。"
        tags={['图表', 'ECharts']}
      />

      <DemoSection title="基础雷达图">
        <ComponentDemo
          title="多维度能力评估，每个轴对应一个指标"
          code={`<RadarChart
  indicators={[{ name: '技术能力', max: 100 }, ...]}
  data={[{ name: '张三', value: [85, 72, 90, 88, 75, 92] }]}
  height={350}
/>`}
        >
          <RadarChart indicators={capabilityIndicators} data={singleData} title="员工能力评估" height={350} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="圆形雷达图">
        <ComponentDemo
          title="shape='circle' 时雷达背景为圆形"
          code={`<RadarChart indicators={indicators} data={data} shape="circle" height={350} />`}
        >
          <RadarChart indicators={capabilityIndicators} data={singleData} shape="circle" title="能力评估（圆形）" height={350} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="多系列雷达对比">
        <ComponentDemo
          title="传入多条数据记录，可进行多维度对比分析"
          code={`<RadarChart
  indicators={indicators}
  data={[
    { name: '我司产品', value: [88, 92, 85, 90, 78] },
    { name: '竞品 A', value: [75, 80, 90, 72, 88] },
    { name: '竞品 B', value: [82, 70, 75, 85, 92] },
  ]}
  height={400}
/>`}
        >
          <RadarChart indicators={productIndicators} data={competitorData} title="产品竞品对比" height={400} />
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
