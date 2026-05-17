import { CheckCircle, Clock, AlertCircle, Star } from 'lucide-react'
import { Timeline, TimelineItem } from '@/components/display'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'mode', type: "'left' | 'right' | 'alternate'", default: "'left'", description: '时间轴对齐模式' },
  { name: 'pending', type: 'boolean | ReactNode', default: 'false', description: '最后一项显示进行中状态（Loader2）' },
  { name: 'reverse', type: 'boolean', default: 'false', description: '是否倒序排列' },
  { name: 'className', type: 'string', description: '容器样式类' },
]

const ITEM_PROPS: PropItem[] = [
  { name: 'color', type: 'string', default: "'primary'", description: '节点颜色（CSS 颜色值或预设 primary/success/warning/error）' },
  { name: 'dot', type: 'ReactNode', description: '自定义节点图标' },
  { name: 'label', type: 'ReactNode', description: 'alternate 模式下另一侧的标签内容' },
]

const deploySteps = [
  { time: '10:00', title: '提交代码', desc: '推送到 feature/login 分支', color: 'success' as const },
  { time: '10:05', title: 'CI 构建', desc: 'GitHub Actions 触发构建，耗时 2m30s', color: 'primary' as const },
  { time: '10:08', title: '代码审查', desc: '同事完成 Code Review 并 Approve', color: 'primary' as const },
  { time: '10:15', title: '合并主干', desc: 'Squash and Merge 到 main 分支', color: 'success' as const },
  { time: '10:20', title: '部署生产', desc: 'Kubernetes 滚动发布中...', color: 'warning' as const },
]

export default function TimelinePage() {
  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Timeline 时间轴"
        description="支持 left / alternate 对齐模式，自定义节点颜色和图标，pending 进行中状态。"
        tags={['业务组件', '数据展示']}
      />

      <DemoSection title="基础时间线（left 模式）">
        <ComponentDemo
          title="节点在左侧对齐，内容在右侧"
          code={`<Timeline>
  <TimelineItem color="success">提交代码 - 推送到分支</TimelineItem>
  <TimelineItem color="primary">CI 构建 - 触发 Actions</TimelineItem>
  <TimelineItem color="warning">部署生产 - 滚动发布</TimelineItem>
</Timeline>`}
        >
          <Timeline>
            {deploySteps.map((s) => (
              <TimelineItem key={s.time} color={s.color} label={s.time}>
                <p className="font-medium text-sm">{s.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
              </TimelineItem>
            ))}
          </Timeline>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="alternate 模式（左右交替）">
        <ComponentDemo
          title="奇偶项交替显示在时间轴左右两侧"
          code={`<Timeline mode="alternate">
  <TimelineItem label="2024-01">里程碑 A</TimelineItem>
  <TimelineItem label="2024-03">里程碑 B</TimelineItem>
  <TimelineItem label="2024-06">里程碑 C</TimelineItem>
</Timeline>`}
        >
          <Timeline mode="alternate">
            {deploySteps.map((s) => (
              <TimelineItem key={s.time} color={s.color} label={s.time}>
                <p className="font-medium text-sm">{s.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
              </TimelineItem>
            ))}
          </Timeline>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="自定义节点颜色和图标">
        <ComponentDemo
          title="通过 dot 插入自定义 ReactNode 图标"
          code={`<Timeline>
  <TimelineItem dot={<CheckCircle size={16} className="text-green-500" />}>成功</TimelineItem>
  <TimelineItem dot={<AlertCircle size={16} className="text-yellow-500" />}>警告</TimelineItem>
  <TimelineItem dot={<Star size={16} className="text-blue-500" />}>重要</TimelineItem>
</Timeline>`}
        >
          <Timeline>
            <TimelineItem dot={<CheckCircle size={16} className="text-green-500" />}>
              <p className="font-medium text-sm">需求评审通过</p>
              <p className="text-xs text-muted-foreground mt-0.5">产品、研发、设计三方确认</p>
            </TimelineItem>
            <TimelineItem dot={<Clock size={16} className="text-blue-500" />}>
              <p className="font-medium text-sm">开发阶段</p>
              <p className="text-xs text-muted-foreground mt-0.5">预计完成时间：2026-06-01</p>
            </TimelineItem>
            <TimelineItem dot={<AlertCircle size={16} className="text-yellow-500" />}>
              <p className="font-medium text-sm">测试发现阻塞问题</p>
              <p className="text-xs text-muted-foreground mt-0.5">登录页面在 Safari 下样式异常</p>
            </TimelineItem>
            <TimelineItem dot={<Star size={16} className="text-purple-500" />}>
              <p className="font-medium text-sm">修复并上线</p>
              <p className="text-xs text-muted-foreground mt-0.5">完成里程碑 v1.0</p>
            </TimelineItem>
          </Timeline>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="pending 进行中状态">
        <ComponentDemo
          title="pending=true 时最后一项显示旋转的 Loader2 图标"
          code={`<Timeline pending>
  <TimelineItem>已完成步骤 1</TimelineItem>
  <TimelineItem>已完成步骤 2</TimelineItem>
</Timeline>`}
        >
          <Timeline pending>
            <TimelineItem color="success">
              <p className="font-medium text-sm">代码提交</p>
              <p className="text-xs text-muted-foreground mt-0.5">已完成</p>
            </TimelineItem>
            <TimelineItem color="success">
              <p className="font-medium text-sm">自动化测试</p>
              <p className="text-xs text-muted-foreground mt-0.5">全部通过</p>
            </TimelineItem>
            <TimelineItem color="primary">
              <p className="font-medium text-sm">生产部署</p>
              <p className="text-xs text-muted-foreground mt-0.5">正在进行中...</p>
            </TimelineItem>
          </Timeline>
        </ComponentDemo>
      </DemoSection>

      <PropsTable title="Timeline Props" data={PROPS} />
      <PropsTable title="TimelineItem Props" data={ITEM_PROPS} />
    </div>
  )
}
