import { useState } from 'react'
import { List, ListItem } from '@/components/display'
import { Button } from '@/components/ui/button'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'dataSource', type: 'T[]', required: true, description: '数据源' },
  { name: 'renderItem', type: '(item: T, index: number) => ReactNode', required: true, description: '列表项渲染函数' },
  { name: 'rowKey', type: 'string | ((item: T) => string)', description: '列表项唯一 key' },
  { name: 'loading', type: 'boolean', default: 'false', description: '加载状态（显示 Skeleton）' },
  { name: 'virtual', type: 'boolean', default: 'false', description: '是否开启虚拟滚动' },
  { name: 'height', type: 'number', description: 'virtual=true 时的容器高度（px）' },
  { name: 'itemHeight', type: 'number', default: '56', description: 'virtual=true 时的行高（px）' },
  { name: 'bordered', type: 'boolean', default: 'false', description: '是否显示外边框' },
  { name: 'divided', type: 'boolean', default: 'true', description: '是否显示分割线' },
  { name: 'pagination', type: 'PaginationConfig', description: '底部分页配置' },
  { name: 'loadMore', type: 'ReactNode', description: '底部加载更多区域' },
  { name: 'header', type: 'ReactNode', description: '列表顶部内容' },
  { name: 'footer', type: 'ReactNode', description: '列表底部内容' },
]

type NewsItem = { id: number; title: string; desc: string; time: string }
type UserItem = { id: number; name: string; email: string; role: string }
type VirtualItem = { id: number; label: string; sub: string }

const NEWS: NewsItem[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  title: `新闻标题 ${i + 1}：这是一篇关于技术前沿的报道`,
  desc: '详细描述文字，介绍新闻的主要内容和背景信息。',
  time: `2026-05-${String(i + 10).padStart(2, '0')}`,
}))

const USERS: UserItem[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `用户 ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ['管理员', '编辑员', '访客'][i % 3],
}))

const VIRTUAL_DATA: VirtualItem[] = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  label: `虚拟列表条目 ${i + 1}`,
  sub: `子标题 ${i + 1}`,
}))

export default function ListPage() {
  const [page, setPage] = useState(1)
  const [loadMoreCount, setLoadMoreCount] = useState(5)
  const [loadMoreLoading, setLoadMoreLoading] = useState(false)
  const pageSize = 10

  const pagedUsers = USERS.slice((page - 1) * pageSize, page * pageSize)

  const handleLoadMore = () => {
    setLoadMoreLoading(true)
    setTimeout(() => {
      setLoadMoreCount((c) => c + 5)
      setLoadMoreLoading(false)
    }, 800)
  }

  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="List 列表"
        description="通用列表组件，支持头像、操作按钮、虚拟滚动（10000条）、分页、加载更多。"
        tags={['业务组件', '数据展示']}
      />

      <DemoSection title="基础列表">
        <ComponentDemo
          title="标准列表项：标题、描述、时间信息"
          code={`<List
  dataSource={news}
  rowKey="id"
  renderItem={(item) => (
    <ListItem extra={<span>{item.time}</span>}>
      <ListItem.Meta title={item.title} description={item.desc} />
    </ListItem>
  )}
/>`}
        >
          <List
            dataSource={NEWS}
            rowKey="id"
            bordered
            renderItem={(item) => (
              <ListItem extra={<span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>}>
                <ListItem.Meta title={item.title} description={item.desc} />
              </ListItem>
            )}
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="带操作按钮">
        <ComponentDemo
          title="通过 ListItem extra 插入操作按钮"
          code={`<List
  dataSource={users}
  rowKey="id"
  renderItem={(user) => (
    <ListItem extra={<Button size="sm">查看</Button>}>
      <ListItem.Meta title={user.name} description={user.email} />
    </ListItem>
  )}
/>`}
        >
          <List
            dataSource={NEWS.slice(0, 3)}
            rowKey="id"
            bordered
            renderItem={(item) => (
              <ListItem
                extra={
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">查看</Button>
                    <Button size="sm" variant="ghost" className="text-destructive">删除</Button>
                  </div>
                }
              >
                <ListItem.Meta title={item.title} description={item.desc} />
              </ListItem>
            )}
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="虚拟滚动列表">
        <ComponentDemo
          title="10000 条数据，virtual=true 开启虚拟滚动，内存占用极低"
          code={`<List
  dataSource={virtualData}  // 10000 条
  rowKey="id"
  virtual
  height={400}
  itemHeight={56}
  renderItem={(item) => (
    <ListItem>
      <ListItem.Meta title={item.label} description={item.sub} />
    </ListItem>
  )}
/>`}
        >
          <List
            dataSource={VIRTUAL_DATA}
            rowKey="id"
            virtual
            height={400}
            itemHeight={56}
            renderItem={(item) => (
              <ListItem>
                <ListItem.Meta title={item.label} description={item.sub} />
              </ListItem>
            )}
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="带分页的列表">
        <ComponentDemo
          title="pagination 配置底部分页器，数据在外部切片"
          code={`<List
  dataSource={pagedUsers}
  rowKey="id"
  renderItem={(user) => (
    <ListItem>
      <ListItem.Meta title={user.name} description={user.email} />
    </ListItem>
  )}
  pagination={{ page, pageSize: 10, total: 100, onChange: setPage }}
/>`}
        >
          <List
            dataSource={pagedUsers}
            rowKey="id"
            bordered
            renderItem={(user) => (
              <ListItem>
                <ListItem.Meta
                  title={user.name}
                  description={`${user.email} · ${user.role}`}
                />
              </ListItem>
            )}
            pagination={{ page, pageSize, total: USERS.length, onChange: setPage }}
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="加载更多">
        <ComponentDemo
          title="loadMore 插槽在底部显示加载更多按钮"
          code={`<List
  dataSource={items.slice(0, count)}
  rowKey="id"
  renderItem={(item) => <ListItem><ListItem.Meta title={item.name} /></ListItem>}
  loadMore={<Button onClick={loadMore}>加载更多</Button>}
/>`}
        >
          <List
            dataSource={USERS.slice(0, loadMoreCount)}
            rowKey="id"
            bordered
            renderItem={(user) => (
              <ListItem>
                <ListItem.Meta title={user.name} description={user.email} />
              </ListItem>
            )}
            loadMore={
              loadMoreCount < USERS.length ? (
                <Button variant="outline" onClick={handleLoadMore} disabled={loadMoreLoading}>
                  {loadMoreLoading ? '加载中...' : `加载更多（还有 ${USERS.length - loadMoreCount} 条）`}
                </Button>
              ) : null
            }
          />
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
