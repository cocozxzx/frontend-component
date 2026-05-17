import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'className', type: 'string', description: '通过 className 控制宽高和形状' },
]

export default function SkeletonPage() {
  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Skeleton 骨架屏"
        description="内容加载时的占位效果，用于提升用户感知性能。通过 className 控制尺寸和形状。"
        tags={['shadcn/ui', '基础组件']}
      />

      <DemoSection title="文字骨架">
        <ComponentDemo title="模拟段落文字加载" code={`<Skeleton className="h-4 w-3/4" />
<Skeleton className="h-4 w-full" />
<Skeleton className="h-4 w-1/2" />`}>
          <div className="space-y-2 max-w-md">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="卡片骨架">
        <ComponentDemo title="模拟文章卡片列表" code={`<div className="flex gap-3">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="flex-1 space-y-2">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
</div>`}>
          <div className="space-y-4 max-w-md">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="表格骨架">
        <ComponentDemo title="模拟表格行加载" code={`{rows.map(i => (
  <div key={i} className="flex gap-4 py-2 border-b">
    <Skeleton className="h-4 w-12" />
    <Skeleton className="h-4 flex-1" />
    <Skeleton className="h-4 w-24" />
  </div>
))}`}>
          <div className="border rounded-lg overflow-hidden max-w-lg">
            <div className="flex gap-4 px-4 py-2 bg-muted/50 border-b">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            {[1,2,3,4].map(i => (
              <div key={i} className="flex gap-4 px-4 py-3 border-b last:border-0">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
