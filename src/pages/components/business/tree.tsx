import { useState } from 'react'
import { Tree } from '@/components/display'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'
import type { TreeNodeData } from '@/components/display'

const PROPS: PropItem[] = [
  { name: 'data', type: 'TreeNodeData[]', required: true, description: '树形数据源' },
  { name: 'expandedKeys', type: 'string[]', description: '展开的节点 key（受控）' },
  { name: 'onExpand', type: '(keys: string[]) => void', description: '展开/折叠回调' },
  { name: 'selectedKeys', type: 'string[]', description: '选中的节点 key（受控）' },
  { name: 'onSelect', type: '(keys: string[]) => void', description: '选中回调' },
  { name: 'checkable', type: 'boolean', default: 'false', description: '是否显示复选框' },
  { name: 'checkedKeys', type: 'string[]', description: '复选框选中的节点 key（受控）' },
  { name: 'onCheck', type: '(keys: string[]) => void', description: '复选框变化回调' },
  { name: 'loadData', type: '(node: TreeNodeData) => Promise<void>', description: '异步加载子节点函数' },
  { name: 'filterTreeNode', type: '(node: TreeNodeData) => boolean', description: '过滤节点的函数' },
  { name: 'showLine', type: 'boolean', default: 'false', description: '是否显示连接线' },
  { name: 'draggable', type: 'boolean', default: 'false', description: '是否可拖拽排序' },
  { name: 'virtual', type: 'boolean', default: 'false', description: '是否启用虚拟滚动（大数据量）' },
]

const treeData: TreeNodeData[] = [
  {
    key: '1', title: '前端组',
    children: [
      { key: '1-1', title: 'React 项目', children: [
        { key: '1-1-1', title: 'PC 管理后台' },
        { key: '1-1-2', title: 'H5 移动端' },
      ]},
      { key: '1-2', title: 'Vue 项目', children: [
        { key: '1-2-1', title: '官网门户' },
      ]},
    ],
  },
  {
    key: '2', title: '后端组',
    children: [
      { key: '2-1', title: 'Java 微服务', children: [
        { key: '2-1-1', title: '用户服务' },
        { key: '2-1-2', title: '订单服务' },
        { key: '2-1-3', title: '支付服务' },
      ]},
      { key: '2-2', title: 'Go 服务', children: [
        { key: '2-2-1', title: '日志聚合' },
      ]},
    ],
  },
  {
    key: '3', title: '运维组',
    children: [
      { key: '3-1', title: 'DevOps 工具链' },
      { key: '3-2', title: '监控报警' },
    ],
  },
]

const asyncData: TreeNodeData[] = [
  { key: 'async-1', title: '部门 A（点击展开异步加载）', isLeaf: false },
  { key: 'async-2', title: '部门 B（点击展开异步加载）', isLeaf: false },
  { key: 'async-3', title: '部门 C（叶子节点）', isLeaf: true },
]

export default function TreePage() {
  const [expandedKeys, setExpandedKeys] = useState(['1', '2'])
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [asyncTreeData, setAsyncTreeData] = useState(asyncData)

  const filterFn = searchValue
    ? (node: TreeNodeData) => String(node.title).includes(searchValue)
    : undefined

  const loadData = async (node: TreeNodeData) => {
    await new Promise((r) => setTimeout(r, 500))
    setAsyncTreeData((prev) => {
      const addChildren = (nodes: TreeNodeData[]): TreeNodeData[] =>
        nodes.map((n) =>
          n.key === node.key
            ? { ...n, children: [
                { key: `${n.key}-child-1`, title: `${n.title} - 成员 1`, isLeaf: true },
                { key: `${n.key}-child-2`, title: `${n.title} - 成员 2`, isLeaf: true },
              ]}
            : n.children ? { ...n, children: addChildren(n.children) } : n
        )
      return addChildren(prev)
    })
  }

  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Tree 树形组件"
        description="支持展开/折叠、复选框、异步懒加载、搜索过滤、连接线、拖拽排序，可开启虚拟滚动。"
        tags={['业务组件', '数据展示']}
      />

      <DemoSection title="基础树形展示">
        <ComponentDemo
          title="点击箭头展开/折叠，支持受控和非受控"
          code={`<Tree
  data={treeData}
  expandedKeys={expandedKeys}
  onExpand={setExpandedKeys}
/>`}
        >
          <div className="border rounded-xl p-4">
            <Tree data={treeData} expandedKeys={expandedKeys} onExpand={setExpandedKeys} />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="复选框模式">
        <ComponentDemo
          title="checkable=true 时显示复选框，父子节点联动"
          code={`<Tree
  data={treeData}
  checkable
  checkedKeys={checkedKeys}
  onCheck={setCheckedKeys}
/>`}
        >
          <div className="border rounded-xl p-4">
            <Tree
              data={treeData}
              checkable
              checkedKeys={checkedKeys}
              onCheck={setCheckedKeys}
              expandedKeys={expandedKeys}
              onExpand={setExpandedKeys}
            />
            {checkedKeys.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">已选：{checkedKeys.join(', ')}</p>
            )}
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="异步懒加载">
        <ComponentDemo
          title="loadData 展开时触发，返回 Promise，自动显示 loading"
          code={`<Tree
  data={treeData}
  loadData={async (node) => {
    await fetch('/api/children?id=' + node.key)
    // 更新 treeData
  }}
/>`}
        >
          <div className="border rounded-xl p-4">
            <Tree data={asyncTreeData} loadData={loadData} />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="搜索过滤">
        <ComponentDemo
          title="filterTreeNode 匹配的节点高亮，祖先节点自动展开"
          code={`<input value={search} onChange={(e) => setSearch(e.target.value)} />
<Tree
  data={treeData}
  filterTreeNode={(node) => node.title.includes(search)}
/>`}
        >
          <div className="space-y-2">
            <input
              className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="输入关键字过滤..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <div className="border rounded-xl p-4">
              <Tree data={treeData} filterTreeNode={filterFn} expandedKeys={expandedKeys} onExpand={setExpandedKeys} />
            </div>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="带连接线">
        <ComponentDemo
          title="showLine=true 时在节点间显示连接线"
          code={`<Tree data={treeData} showLine expandedKeys={['1', '2']} />`}
        >
          <div className="border rounded-xl p-4">
            <Tree data={treeData} showLine expandedKeys={['1', '2']} onExpand={() => {}} />
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
