import { useState } from 'react'
import { AppPagination } from '@/components/base/AppPagination'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'total', type: 'number', required: true, description: '总数据条数' },
  { name: 'page', type: 'number', required: true, description: '当前页码' },
  { name: 'pageSize', type: 'number', required: true, description: '每页条数' },
  { name: 'onPageChange', type: '(page: number) => void', required: true, description: '页码变化回调' },
  { name: 'onPageSizeChange', type: '(size: number) => void', description: '每页条数变化回调' },
  { name: 'pageSizeOptions', type: 'number[]', default: '[10,20,50]', description: '每页条数选项' },
]

export default function PaginationPage() {
  const [page1, setPage1] = useState(1)
  const [page2, setPage2] = useState(1)
  const [size, setSize] = useState(10)

  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Pagination 分页"
        description="数据分页控件，支持页码导航、每页条数切换、快速跳转。AppPagination 基于 shadcn Pagination 封装。"
        tags={['shadcn/ui', '基础组件']}
      />

      <DemoSection title="基础分页">
        <ComponentDemo title="total=100，pageSize=10" code={`<AppPagination
  total={100}
  page={page}
  pageSize={10}
  onPageChange={setPage}
/>`}>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">当前第 {page1} 页</p>
            <AppPagination total={100} page={page1} pageSize={10} onPageChange={setPage1} />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="完整功能">
        <ComponentDemo title="页码 + 每页条数 + 跳转，total=1000" code={`<AppPagination
  total={1000}
  page={page}
  pageSize={pageSize}
  pageSizeOptions={[10, 20, 50, 100]}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
/>`}>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">第 {page2} 页，每页 {size} 条，共 1000 条</p>
            <AppPagination
              total={1000}
              page={page2}
              pageSize={size}
              pageSizeOptions={[10, 20, 50, 100]}
              onPageChange={setPage2}
              onPageSizeChange={(s) => { setSize(s); setPage2(1) }}
            />
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
