import { useState } from 'react'
import { GaugeChart } from '@/components/charts'
import { Slider } from '@/components/ui/slider'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'value', type: 'number', required: true, description: '当前数值' },
  { name: 'min', type: 'number', default: '0', description: '最小值' },
  { name: 'max', type: 'number', default: '100', description: '最大值' },
  { name: 'title', type: 'string', description: '仪表盘标题' },
  { name: 'unit', type: 'string', default: "''", description: '数值单位（显示在数字后）' },
  { name: 'thresholds', type: '{ value: number; color: string }[]', description: '颜色阈值，value 为占比（0-1）' },
  { name: 'splitNumber', type: 'number', default: '10', description: '刻度分割段数' },
  { name: 'height', type: 'number | string', default: '300', description: '图表高度' },
  { name: 'loading', type: 'boolean', default: 'false', description: '加载状态' },
]

const THREE_COLOR_THRESHOLDS = [
  { value: 0.6, color: '#52C41A' },
  { value: 0.8, color: '#FAAD14' },
  { value: 1, color: '#F5222D' },
]

export default function GaugeChartPage() {
  const [dynamicValue, setDynamicValue] = useState(65)

  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="GaugeChart 仪表盘"
        description="基于 ECharts 封装，支持自定义颜色阈值（三段色）、单位、动态数值。"
        tags={['图表', 'ECharts']}
      />

      <DemoSection title="基础仪表盘">
        <ComponentDemo
          title="展示单一数值的完成度或状态"
          code={`<GaugeChart value={75} title="CPU 使用率" unit="%" height={300} />`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GaugeChart value={75} title="CPU 使用率" unit="%" height={260} />
            <GaugeChart value={42} title="内存占用" unit="%" height={260} />
            <GaugeChart value={89} title="磁盘使用" unit="%" height={260} />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="自定义颜色阈值（三段色）">
        <ComponentDemo
          title="thresholds 定义多段颜色：60% 以下绿色，60-80% 黄色，80% 以上红色"
          code={`<GaugeChart
  value={72}
  title="系统负载"
  unit="%"
  thresholds={[
    { value: 0.6, color: '#52C41A' },  // 0-60% 绿色
    { value: 0.8, color: '#FAAD14' },  // 60-80% 黄色
    { value: 1,   color: '#F5222D' },  // 80-100% 红色
  ]}
  height={300}
/>`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GaugeChart value={45} title="低负载" unit="%" thresholds={THREE_COLOR_THRESHOLDS} height={260} />
            <GaugeChart value={72} title="中等负载" unit="%" thresholds={THREE_COLOR_THRESHOLDS} height={260} />
            <GaugeChart value={91} title="高负载" unit="%" thresholds={THREE_COLOR_THRESHOLDS} height={260} />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="动态数值（Slider 控制）">
        <ComponentDemo
          title="拖动 Slider 实时更新仪表盘数值"
          code={`const [value, setValue] = useState(65)
<Slider value={[value]} onValueChange={([v]) => setValue(v)} />
<GaugeChart value={value} thresholds={colorThresholds} />`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm w-20">当前值：{dynamicValue}</span>
              <Slider
                className="flex-1 max-w-xs"
                min={0}
                max={100}
                step={1}
                value={[dynamicValue]}
                onValueChange={([v]) => setDynamicValue(v)}
              />
            </div>
            <GaugeChart
              value={dynamicValue}
              title="实时数值"
              unit="%"
              thresholds={THREE_COLOR_THRESHOLDS}
              height={300}
            />
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
