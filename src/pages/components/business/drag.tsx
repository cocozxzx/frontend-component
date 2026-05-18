import { useState } from 'react'
import { DragList, DragGrid, TagsInput } from '@/components/advanced'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const DRAG_LIST_PROPS: PropItem[] = [
  { name: 'items', type: 'T[]', required: true, description: '数据源，每项需包含唯一 id' },
  { name: 'onChange', type: '(items: T[]) => void', required: true, description: '排序后的新顺序回调' },
  { name: 'renderItem', type: '(item: T) => ReactNode', required: true, description: '列表项渲染函数' },
  { name: 'handle', type: 'boolean', default: 'false', description: '是否仅限把手区域触发拖拽' },
  { name: 'direction', type: "'vertical' | 'horizontal'", default: "'vertical'", description: '拖拽方向' },
  { name: 'className', type: 'string', description: '容器样式类' },
]

const TAGS_INPUT_PROPS: PropItem[] = [
  { name: 'value', type: 'string[]', description: '当前标签数组（受控）' },
  { name: 'onChange', type: '(tags: string[]) => void', description: '标签变化回调' },
  { name: 'placeholder', type: 'string', description: '输入框占位文字' },
  { name: 'separator', type: "string | string[]", default: "'Enter'", description: '触发新增标签的按键或字符' },
  { name: 'max', type: 'number', description: '最大标签数量' },
  { name: 'validator', type: '(tag: string) => string | null', description: '标签校验函数，返回错误信息' },
  { name: 'suggestions', type: 'string[]', description: '建议候选词列表' },
  { name: 'draggable', type: 'boolean', default: 'false', description: '是否支持拖拽排序标签' },
]

type ListItem = { id: string; label: string; desc: string }
type GridItem = { id: string; title: string; color: string }

const initialList: ListItem[] = [
  { id: '1', label: '需求分析', desc: '收集并整理用户需求' },
  { id: '2', label: 'UI 设计', desc: '输出交互稿和视觉稿' },
  { id: '3', label: '前端开发', desc: '按设计稿实现功能' },
  { id: '4', label: '后端接口', desc: 'RESTful API 开发' },
  { id: '5', label: '联调测试', desc: '前后端联合调试' },
  { id: '6', label: '上线发布', desc: '部署并验证生产环境' },
]

const initialGrid: GridItem[] = [
  { id: '1', title: '销售额', color: 'bg-blue-500' },
  { id: '2', title: '订单量', color: 'bg-green-500' },
  { id: '3', title: '用户数', color: 'bg-purple-500' },
  { id: '4', title: '转化率', color: 'bg-orange-500' },
  { id: '5', title: '退款率', color: 'bg-red-500' },
  { id: '6', title: '客单价', color: 'bg-yellow-500' },
]

export default function DragPage() {
  const [list, setList] = useState(initialList)
  const [listHandle, setListHandle] = useState(initialList)
  const [grid, setGrid] = useState(initialGrid)
  const [tags, setTags] = useState(['React', 'TypeScript', 'Tailwind'])

  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Drag 拖拽排序"
        description="基于 @dnd-kit 封装，提供 DragList（垂直/水平排序）、DragGrid（网格排序）、TagsInput（可拖拽标签）。"
        tags={['业务组件', '交互增强']}
      />

      <DemoSection title="DragList 垂直拖拽排序">
        <ComponentDemo
          title="任意区域拖拽触发排序"
          code={`<DragList
  items={items}
  onChange={setItems}
  renderItem={(item) => <div>{item.label}</div>}
/>`}
        >
          <DragList
            items={list}
            onReorder={setList}
            renderItem={(item) => (
              <div className="flex items-center gap-3 px-4 py-3 bg-card border rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            )}
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="DragList 把手拖拽">
        <ComponentDemo
          title="handle=true 时只有拖拽把手图标区域可触发"
          code={`<DragList items={items} onChange={setItems} handle renderItem={(item) => <div>{item.label}</div>} />`}
        >
          <DragList
            items={listHandle}
            onReorder={setListHandle}
            handle
            renderItem={(item) => (
              <div className="flex items-center gap-3 px-4 py-3 bg-card border rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            )}
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="DragGrid 网格拖拽">
        <ComponentDemo
          title="网格布局中自由拖拽重排"
          code={`<DragGrid
  items={items}
  onChange={setItems}
  columns={3}
  renderItem={(item) => <div>{item.title}</div>}
/>`}
        >
          <DragGrid
            items={grid}
            onReorder={setGrid}
            columns={3}
            gap={12}
            renderItem={(item) => (
              <div className={`${item.color} text-white rounded-xl p-4 h-24 flex items-center justify-center font-medium`}>
                {item.title}
              </div>
            )}
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="TagsInput 可拖拽标签">
        <ComponentDemo
          title="输入后回车添加标签，支持拖拽重新排序"
          code={`<TagsInput
  value={tags}
  onChange={setTags}
  draggable
  placeholder="输入后回车添加..."
  suggestions={['Vue', 'Angular', 'Svelte']}
/>`}
        >
          <TagsInput
            value={tags}
            onChange={setTags}
            draggable
            placeholder="输入后回车添加..."
            suggestions={['Vue', 'Angular', 'Svelte', 'Next.js', 'Vite']}
          />
        </ComponentDemo>
      </DemoSection>

      <PropsTable title="DragList Props" data={DRAG_LIST_PROPS} />
      <PropsTable title="TagsInput Props" data={TAGS_INPUT_PROPS} />
    </div>
  )
}
