import { Progress } from '@/components/ui/progress'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'value', type: 'number', description: '当前进度（0-100）' },
  { name: 'max', type: 'number', default: '100', description: '最大值' },
  { name: 'className', type: 'string', description: '自定义样式' },
]

export default function ProgressPage() {
  return (
    <div className="preview-page">
      <PageHeader
        title="Progress 进度条"
        description="展示任务当前进度的线形进度条，基于 Radix UI Progress。"
        tags={['shadcn/ui', 'Radix UI', '基础组件']}
      />

      <DemoSection title="基础进度条">
        <ComponentDemo title="各 value 展示" code={`<Progress value={30} />
<Progress value={60} />
<Progress value={90} />`}>
          <div className="space-y-4 max-w-md">
            {[0, 25, 50, 75, 100].map((v) => (
              <div key={v} className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>进度</span><span>{v}%</span>
                </div>
                <Progress value={v} />
              </div>
            ))}
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="自定义颜色">
        <ComponentDemo title="通过 className 改变颜色" code={`<Progress value={60} className="[&>div]:bg-success" />
<Progress value={40} className="[&>div]:bg-warning" />
<Progress value={80} className="[&>div]:bg-destructive" />`}>
          <div className="space-y-3 max-w-md">
            <div className="space-y-1"><span className="text-xs text-muted-foreground">成功（绿色）</span><Progress value={60} className="[&>div]:bg-success" /></div>
            <div className="space-y-1"><span className="text-xs text-muted-foreground">警告（橙色）</span><Progress value={40} className="[&>div]:bg-warning" /></div>
            <div className="space-y-1"><span className="text-xs text-muted-foreground">错误（红色）</span><Progress value={20} className="[&>div]:bg-destructive" /></div>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="圆形进度（CSS实现）">
        <ComponentDemo title="SVG stroke-dashoffset 实现圆形进度" code={`// SVG 圆形进度
const r = 36, circumference = 2 * Math.PI * r
const offset = circumference - (percent / 100) * circumference
<svg viewBox="0 0 80 80">
  <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" className="text-muted" />
  <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" className="text-primary"
    strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90 40 40)" />
  <text x="40" y="44" textAnchor="middle" className="text-sm font-medium">{percent}%</text>
</svg>`}>
          <div className="flex flex-wrap gap-6">
            {[25, 60, 80, 100].map((pct) => {
              const r = 36, circumference = 2 * Math.PI * r
              const offset = circumference - (pct / 100) * circumference
              return (
                <div key={pct} className="flex flex-col items-center gap-1">
                  <svg width={80} height={80} viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" strokeWidth={6} className="text-muted" />
                    <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" strokeWidth={6} className="text-primary"
                      strokeDasharray={circumference} strokeDashoffset={offset}
                      strokeLinecap="round" transform="rotate(-90 40 40)" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
                    <text x="40" y="45" textAnchor="middle" fontSize={14} fontWeight={600} fill="currentColor">{pct}%</text>
                  </svg>
                  <span className="text-xs text-muted-foreground">{pct}%</span>
                </div>
              )
            })}
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
