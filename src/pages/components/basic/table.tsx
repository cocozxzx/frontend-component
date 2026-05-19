import { useState } from 'react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { AppTable } from '@/components/base/AppTable'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'
import type { ColumnDef } from '@tanstack/react-table'

interface User { id: number; name: string; email: string; role: string; status: string }

const USERS: User[] = [
  { id: 1, name: '张三', email: 'zhang@example.com', role: '管理员', status: '正常' },
  { id: 2, name: '李四', email: 'li@example.com', role: '编辑', status: '正常' },
  { id: 3, name: '王五', email: 'wang@example.com', role: '访客', status: '禁用' },
  { id: 4, name: '赵六', email: 'zhao@example.com', role: '编辑', status: '正常' },
]

const COLUMNS: ColumnDef<User>[] = [
  { accessorKey: 'id', header: 'ID', size: 60 },
  { accessorKey: 'name', header: '姓名' },
  { accessorKey: 'email', header: '邮箱' },
  { accessorKey: 'role', header: '角色' },
  { accessorKey: 'status', header: '状态',
    cell: ({ getValue }) => {
      const v = getValue() as string
      return <span className={v === '正常' ? 'text-success' : 'text-destructive'}>{v}</span>
    }
  },
]

const PROPS: PropItem[] = [
  { name: 'columns', type: 'ColumnDef<TData>[]', required: true, description: '列定义' },
  { name: 'data', type: 'TData[]', required: true, description: '数据源' },
  { name: 'loading', type: 'boolean', default: 'false', description: '加载状态' },
  { name: 'striped', type: 'boolean', default: 'false', description: '斑马纹' },
  { name: 'bordered', type: 'boolean', default: 'false', description: '显示边框' },
  { name: 'rowSelection', type: 'boolean', default: 'false', description: '行选择（checkbox）' },
  { name: 'size', type: "'sm'|'md'|'lg'", default: "'md'", description: '行高尺寸' },
]

export default function TablePage() {
  const [loading, setLoading] = useState(false)

  function toggleLoading() {
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="preview-page">
      <PageHeader
        title="Table 表格"
        description="展示结构化数据。shadcn Table 提供基础样式；AppTable 封装了排序、行选择、列显隐、loading 等高频功能。"
        tags={['shadcn/ui', '@tanstack/react-table', '基础组件']}
      />

      <DemoSection title="基础 shadcn Table">
        <ComponentDemo title="静态数据表格" code={`<Table>
  <TableHeader>
    <TableRow>
      <TableHead>姓名</TableHead>
      <TableHead>邮箱</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {rows.map(row => (
      <TableRow key={row.id}>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.email}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>姓名</TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead>角色</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {USERS.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">{row.email}</TableCell>
                  <TableCell>{row.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="AppTable 功能">
        <ComponentDemo title="斑马纹 + 行选择 + 列显隐 + Loading" code={`<AppTable
  columns={columns}
  data={users}
  striped
  rowSelection
  columnVisibility
  loading={loading}
/>`}>
          <div className="space-y-3">
            <button onClick={toggleLoading} className="text-sm text-primary underline">
              点击触发 Loading（1.5s）
            </button>
            <AppTable columns={COLUMNS} data={USERS} striped rowSelection columnVisibility loading={loading} />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="空状态 & 边框">
        <ComponentDemo title="bordered + 空数据" code={`<AppTable columns={columns} data={[]} bordered emptyText="暂无数据" />`}>
          <AppTable columns={COLUMNS} data={[]} bordered emptyText="暂无用户数据" />
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
