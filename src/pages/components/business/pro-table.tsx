import { useRef, useState } from 'react'
import { ProTable } from '@/components/pro/ProTable'
import { Button } from '@/components/ui/button'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'
import type { ProTableRef } from '@/components/pro/ProTable'
import type { ProTableSchema } from '@/types/schema'

const PROPS: PropItem[] = [
  { name: 'schema', type: 'ProTableSchema', required: true, description: 'JSON Schema 配置（列、搜索、工具栏等）' },
  { name: 'dataSource', type: 'Record<string, unknown>[]', description: '本地数据源（与 fetchFn/api 三选一）' },
  { name: 'fetchFn', type: '(params) => Promise<{ list; total }>', description: '数据请求函数' },
  { name: 'onAction', type: '(action: string, row: ...) => void', description: '操作列按钮点击回调' },
  { name: 'onToolbarAction', type: '(action: string, selectedRows: ...) => void', description: '工具栏按钮点击回调' },
  { name: 'renders', type: 'Record<string, (row: ...) => ReactNode>', description: 'type=custom 的自定义渲染函数' },
  { name: 'ref', type: 'ProTableRef', description: '暴露 refresh/reset/getSelectedRows/clearSelection 方法' },
]

type UserRow = Record<string, unknown>

const MOCK_USERS: UserRow[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `用户 ${String(i + 1).padStart(3, '0')}`,
  email: `user${i + 1}@example.com`,
  role: ['管理员', '编辑员', '访客'][i % 3],
  status: ['active', 'inactive', 'banned'][i % 3],
  score: Math.floor(Math.random() * 100),
  avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${i}`,
  createdAt: `2024-${String(Math.floor(i / 10) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
}))

const USER_TABLE_SCHEMA: ProTableSchema = {
  showIndex: true,
  showSelection: true,
  showColumnSetting: true,
  showRefresh: true,
  striped: true,
  columns: [
    { key: 'name', title: '用户名', sortable: true, fixed: 'left', copyable: true },
    { key: 'email', title: '邮箱', ellipsis: true, minWidth: 160 },
    {
      key: 'role', title: '角色', type: 'tag', width: 100,
      tagMap: { 管理员: 'info', 编辑员: 'success', 访客: 'default' },
    },
    {
      key: 'status', title: '状态', type: 'badge', width: 90,
      labelMap: { active: '正常', inactive: '停用', banned: '封禁' },
      tagMap: { active: 'success', inactive: 'default', banned: 'destructive' },
    },
    { key: 'score', title: '评分', type: 'number', width: 80, sortable: true },
    { key: 'createdAt', title: '注册日期', type: 'date', width: 120, sortable: true },
    {
      key: 'action', title: '操作', type: 'action', fixed: 'right', width: 160,
      actions: [
        { label: '查看', icon: 'Eye', action: 'view' },
        { label: '编辑', icon: 'Pencil', action: 'edit', permission: 'user:edit' },
        {
          label: '删除', icon: 'Trash2', type: 'destructive', action: 'delete',
          confirm: { title: '确认删除', content: '此操作不可恢复，是否继续？', type: 'danger' },
        },
      ],
    },
  ],
  searchFields: [
    { field: 'name', label: '用户名', type: 'input', placeholder: '搜索用户名' },
    { field: 'role', label: '角色', type: 'select', options: [{ label: '管理员', value: '管理员' }, { label: '编辑员', value: '编辑员' }, { label: '访客', value: '访客' }] },
    { field: 'status', label: '状态', type: 'select', options: [{ label: '正常', value: 'active' }, { label: '停用', value: 'inactive' }, { label: '封禁', value: 'banned' }] },
    { field: 'createdAt', label: '注册日期', type: 'date-range' },
  ],
  toolbar: [
    { label: '新增用户', icon: 'Plus', type: 'primary', action: 'create' },
    { label: '批量删除', icon: 'Trash2', type: 'destructive', action: 'batchDelete' },
    { label: '导出', icon: 'Download', action: 'export' },
  ],
  pagination: { defaultPageSize: 10, pageSizeOptions: [10, 20, 50] },
}

const TYPE_DEMO_SCHEMA: ProTableSchema = {
  columns: [
    { key: 'text', title: 'text', type: 'text' },
    { key: 'number', title: 'number', type: 'number' },
    { key: 'date', title: 'date', type: 'date' },
    { key: 'tag', title: 'tag', type: 'tag', tagMap: { A: 'info', B: 'success', C: 'warning' } },
    { key: 'badge', title: 'badge', type: 'badge', labelMap: { on: '启用', off: '停用' }, tagMap: { on: 'success', off: 'default' } },
    { key: 'bool', title: 'boolean', type: 'boolean', booleanMap: { true: '是', false: '否' } },
  ],
  pagination: false,
}

const TYPE_DATA: UserRow[] = [
  { text: '示例文本', number: 12345, date: '2024-01-15', tag: 'A', badge: 'on', bool: true },
  { text: '另一行', number: 6789, date: '2024-06-20', tag: 'B', badge: 'off', bool: false },
  { text: '第三行', number: 999, date: '2024-12-31', tag: 'C', badge: 'on', bool: true },
]

export default function ProTablePage() {
  const tableRef = useRef<ProTableRef>(null)
  const [actionLog, setActionLog] = useState<string[]>([])

  const fetchUsers = async (params: Record<string, unknown>) => {
    await new Promise((r) => setTimeout(r, 300))
    const { page = 1, pageSize = 10, name, role, status } = params
    let filtered = [...MOCK_USERS]
    if (name) filtered = filtered.filter((u) => String(u.name).includes(String(name)))
    if (role) filtered = filtered.filter((u) => u.role === role)
    if (status) filtered = filtered.filter((u) => u.status === status)
    const start = (Number(page) - 1) * Number(pageSize)
    return { list: filtered.slice(start, start + Number(pageSize)), total: filtered.length }
  }

  const handleAction = (action: string, row: UserRow) => {
    setActionLog((l) => [`[操作] ${action} → ${row.name}`, ...l.slice(0, 4)])
  }

  const handleToolbar = (action: string, rows: UserRow[]) => {
    setActionLog((l) => [`[工具栏] ${action} → 已选 ${rows.length} 行`, ...l.slice(0, 4)])
  }

  return (
    <div className="p-6 space-y-10 max-w-6xl">
      <PageHeader
        title="ProTable 高级表格"
        description="JSON Schema 驱动，零代码配置搜索栏、工具栏、分页、列设置、操作列。支持权限、确认弹窗、列固定、列排序。"
        tags={['Pro 组件', '数据管理']}
      />

      <DemoSection title="完整 ProTable 示例（用户管理）">
        <ComponentDemo
          title="搜索/分页/操作列/tag列/badge列/列设置，数据由 fetchFn 异步获取"
          code={`const schema: ProTableSchema = {
  showIndex: true,
  showSelection: true,
  showColumnSetting: true,
  columns: [
    { key: 'name', title: '用户名', fixed: 'left', copyable: true },
    { key: 'role', title: '角色', type: 'tag', tagMap: { 管理员: 'info', ... } },
    { key: 'status', title: '状态', type: 'badge', labelMap: { active: '正常', ... } },
    { key: 'action', title: '操作', type: 'action', actions: [
      { label: '编辑', action: 'edit' },
      { label: '删除', type: 'destructive', action: 'delete', confirm: { title: '确认删除?' } },
    ]},
  ],
  searchFields: [
    { field: 'name', label: '用户名', type: 'input' },
    { field: 'role', label: '角色', type: 'select', options: [...] },
  ],
  toolbar: [
    { label: '新增', icon: 'Plus', type: 'primary', action: 'create' },
  ],
}

<ProTable
  schema={schema}
  fetchFn={fetchUsers}
  onAction={(action, row) => console.log(action, row)}
  onToolbarAction={(action, rows) => console.log(action, rows)}
  ref={tableRef}
/>`}
        >
          <div className="space-y-3">
            {actionLog.length > 0 && (
              <div className="text-xs font-mono bg-muted rounded px-3 py-2 space-y-0.5">
                {actionLog.map((log, i) => <div key={i} className="text-muted-foreground">{log}</div>)}
              </div>
            )}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => tableRef.current?.refresh()}>刷新</Button>
              <Button size="sm" variant="outline" onClick={() => tableRef.current?.reset()}>重置搜索</Button>
              <Button size="sm" variant="outline" onClick={() => {
                const rows = tableRef.current?.getSelectedRows() ?? []
                setActionLog((l) => [`已选 ${rows.length} 行`, ...l.slice(0, 4)])
              }}>获取已选行</Button>
            </div>
            <ProTable
              schema={USER_TABLE_SCHEMA}
              fetchFn={fetchUsers}
              onAction={handleAction}
              onToolbarAction={handleToolbar}
              ref={tableRef}
            />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="列类型展示">
        <ComponentDemo
          title="text / number / date / tag / badge / boolean 六种内置列类型"
          code={`{ key: 'tag', title: '标签', type: 'tag', tagMap: { A: 'info', B: 'success' } }
{ key: 'badge', title: '状态', type: 'badge', labelMap: { on: '启用' }, tagMap: { on: 'success' } }
{ key: 'bool', title: '布尔', type: 'boolean', booleanMap: { true: '是', false: '否' } }`}
        >
          <ProTable schema={TYPE_DEMO_SCHEMA} dataSource={TYPE_DATA} />
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
