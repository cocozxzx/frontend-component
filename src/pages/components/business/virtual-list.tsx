import { useState, useCallback } from 'react'
import { VirtualList } from '@/components/display'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'data', type: 'T[]', required: true, description: '列表数据源' },
  { name: 'renderItem', type: '(item: T, index: number) => ReactNode', required: true, description: '列表项渲染函数' },
  { name: 'height', type: 'number', required: true, description: '容器固定高度（px）' },
  { name: 'itemHeight', type: 'number | ((index: number) => number)', required: true, description: '行高（固定数值）或动态高度函数' },
  { name: 'overscan', type: 'number', default: '5', description: '视口外额外渲染的项数' },
  { name: 'onEndReached', type: '() => void', description: '滚动到底部时触发（无限加载）' },
  { name: 'endReachedThreshold', type: 'number', default: '100', description: '触发 onEndReached 的距底距离（px）' },
  { name: 'loading', type: 'boolean', default: 'false', description: '是否显示底部 loading' },
  { name: 'rowKey', type: 'string | ((item: T) => string)', description: '行 key 函数或字段名' },
  { name: 'className', type: 'string', description: '容器样式类' },
]

const FIXED_DATA = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `用户 ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ['管理员', '编辑', '访客'][i % 3],
}))

const VARIABLE_DATA = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  content: `条目 ${i + 1}：${'这是一段描述文字，'.repeat((i % 3) + 1)}展示动态高度虚拟列表的效果。`,
  height: 60 + (i % 3) * 30,
}))

export default function VirtualListPage() {
  const [infiniteData, setInfiniteData] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({ id: i, label: `批次1 - 条目 ${i + 1}` }))
  )
  const [loading, setLoading] = useState(false)
  const [batch, setBatch] = useState(1)

  const handleEndReached = useCallback(() => {
    if (loading) return
    setLoading(true)
    setTimeout(() => {
      setBatch((b) => {
        const nextBatch = b + 1
        setInfiniteData((prev) => [
          ...prev,
          ...Array.from({ length: 20 }, (_, i) => ({
            id: prev.length + i,
            label: `批次${nextBatch} - 条目 ${i + 1}`,
          })),
        ])
        return nextBatch
      })
      setLoading(false)
    }, 800)
  }, [loading])

  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="VirtualList 虚拟列表"
        description="基于 @tanstack/react-virtual，支持固定/动态行高，10000+ 条数据流畅滚动。"
        tags={['业务组件', '数据展示']}
      />

      <DemoSection title="固定高度虚拟列表">
        <ComponentDemo
          title="10000 条数据，固定行高 60px，内存占用极低"
          code={`<VirtualList
  data={items}        // 10000 条
  itemHeight={60}     // 固定行高
  height={400}
  rowKey="id"
  renderItem={(item) => (
    <div className="flex items-center gap-3 px-4 border-b">
      <span>{item.name}</span>
    </div>
  )}
/>`}
        >
          <VirtualList
            data={FIXED_DATA}
            itemHeight={60}
            height={400}
            rowKey="id"
            renderItem={(item) => (
              <div className="flex items-center gap-3 px-4 py-3 border-b hover:bg-muted/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                  {item.name.slice(-1)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.email}</p>
                </div>
                <span className="text-xs text-muted-foreground">{item.role}</span>
              </div>
            )}
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="动态高度虚拟列表">
        <ComponentDemo
          title="itemHeight 传函数时每项高度可不同，组件自动测量"
          code={`<VirtualList
  data={items}
  itemHeight={(index) => items[index].height}  // 动态高度
  height={350}
  renderItem={(item) => <div>{item.content}</div>}
/>`}
        >
          <VirtualList
            data={VARIABLE_DATA}
            itemHeight={(i) => VARIABLE_DATA[i]?.height ?? 60}
            height={350}
            rowKey="id"
            renderItem={(item) => (
              <div className="px-4 py-3 border-b text-sm leading-relaxed hover:bg-muted/30" style={{ minHeight: item.height }}>
                <span className="font-medium text-primary mr-2">#{item.id + 1}</span>
                {item.content}
              </div>
            )}
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="无限加载">
        <ComponentDemo
          title="滚动到底部触发 onEndReached，模拟分批加载（每批 20 条，800ms 延迟）"
          code={`<VirtualList
  data={items}
  itemHeight={48}
  height={350}
  loading={loading}
  onEndReached={handleEndReached}
  renderItem={(item) => <div>{item.label}</div>}
/>`}
        >
          <div>
            <p className="text-xs text-muted-foreground mb-2">已加载 {infiniteData.length} 条，向下滚动加载更多</p>
            <VirtualList
              data={infiniteData}
              itemHeight={48}
              height={350}
              rowKey="id"
              loading={loading}
              onEndReached={handleEndReached}
              renderItem={(item) => (
                <div className="flex items-center px-4 h-12 border-b text-sm hover:bg-muted/30">
                  {item.label}
                </div>
              )}
            />
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
