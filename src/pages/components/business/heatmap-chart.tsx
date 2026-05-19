import { useMemo } from 'react'
import { HeatmapChart } from '@/components/charts'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'
import { format } from 'date-fns'

const PROPS: PropItem[] = [
  { name: 'data', type: 'Array<[string, number]>', required: true, description: "数据数组，格式 ['YYYY-MM-DD', value]" },
  { name: 'year', type: 'number', description: '展示的年份，默认当年' },
  { name: 'colorRange', type: '[string, string]', description: '颜色范围 [最小色, 最大色]，默认使用主题色' },
  { name: 'cellSize', type: 'number', default: '14', description: '每个格子的尺寸（px）' },
  { name: 'cellGap', type: 'number', default: '2', description: '格子间距（px）' },
  { name: 'tooltip', type: 'boolean', default: 'true', description: '是否显示 tooltip' },
  { name: 'months', type: 'string[]', description: '月份标签（12项），默认中文' },
  { name: 'weekdays', type: 'string[]', description: '星期标签（7项），默认中文' },
  { name: 'height', type: 'number | string', description: '图表高度（默认自适应）' },
  { name: 'loading', type: 'boolean', default: 'false', description: '加载状态' },
]

function generateYearData(year: number, maxVal: number): Array<[string, number]> {
  const result: Array<[string, number]> = []
  const start = new Date(year, 0, 1)
  const end = new Date(year, 11, 31)
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (Math.random() > 0.3) {
      result.push([format(new Date(d), 'yyyy-MM-dd'), Math.floor(Math.random() * maxVal) + 1])
    }
  }
  return result
}

export default function HeatmapChartPage() {
  const currentYear = new Date().getFullYear()

  const commitData = useMemo(() => generateYearData(currentYear, 20), [currentYear])
  const customColorData = useMemo(() => generateYearData(currentYear, 100), [currentYear])

  return (
    <div className="preview-page">
      <PageHeader
        title="HeatmapChart 热力图"
        description="年度日历热力图，类似 GitHub 贡献图，支持自定义颜色范围，基于 ECharts 渲染。"
        tags={['图表', 'ECharts']}
      />

      <DemoSection title="年度日历热力图">
        <ComponentDemo
          title="模拟 GitHub 贡献图，颜色深浅表示当天活跃度"
          code={`// 数据格式：[日期字符串, 数值]
const data: Array<[string, number]> = [
  ['2026-01-01', 5],
  ['2026-01-03', 12],
  // ...
]
<HeatmapChart data={data} year={2026} />`}
        >
          <HeatmapChart data={commitData} year={currentYear} />
          <p className="text-xs text-muted-foreground mt-2">
            提交总数：{commitData.length} 天有活动 / {commitData.reduce((s, [, v]) => s + v, 0)} 次提交
          </p>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="自定义颜色范围">
        <ComponentDemo
          title="colorRange 设置从浅到深的颜色区间"
          code={`<HeatmapChart
  data={data}
  year={2026}
  colorRange={['#fff3e0', '#f57c00']}  // 橙色系
/>`}
        >
          <div className="space-y-6">
            <div>
              <p className="text-xs text-muted-foreground mb-2">蓝色系（默认主题色）</p>
              <HeatmapChart data={commitData} year={currentYear} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">橙色系</p>
              <HeatmapChart data={customColorData} year={currentYear} colorRange={['#fff3e0', '#f57c00']} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">绿色系</p>
              <HeatmapChart data={customColorData} year={currentYear} colorRange={['#f0fdf4', '#16a34a']} />
            </div>
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
