import { useState } from 'react'
import { RichEditor } from '@/components/form'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'value', type: 'string', description: 'HTML 内容（受控）' },
  { name: 'onChange', type: '(html: string) => void', description: '内容变化回调（防抖 300ms）' },
  { name: 'placeholder', type: 'string', default: "'请输入内容...'", description: '占位文字' },
  { name: 'readOnly', type: 'boolean', default: 'false', description: '只读模式，隐藏工具栏' },
  { name: 'maxLength', type: 'number', description: '最大字数限制，超出时显示警告' },
  { name: 'toolbarItems', type: 'ToolbarItem[]', description: '工具栏项，不传则显示全部工具' },
  { name: 'minHeight', type: 'string', default: "'200px'", description: '编辑区最小高度' },
  { name: 'className', type: 'string', description: '外层容器样式类' },
]

const INITIAL_HTML = '<p>这是一段<strong>富文本</strong>内容，支持 <em>斜体</em>、<u>下划线</u>等格式。</p>'

const MINIMAL_TOOLBAR = ['bold', 'italic', 'bulletList', 'orderedList', 'link']

export default function RichEditorPage() {
  const [full, setFull] = useState(INITIAL_HTML)
  const [custom, setCustom] = useState('')
  const [limited, setLimited] = useState('')

  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="RichEditor 富文本编辑器"
        description="基于 TipTap v3 封装，支持完整工具栏、自定义工具栏、只读渲染、字数限制。"
        tags={['业务组件', '数据录入', 'TipTap']}
      />

      <DemoSection title="完整工具栏">
        <ComponentDemo
          title="18 种工具：粗体/斜体/下划线/删除线/标题/引用/代码块/列表/链接/图片/对齐等"
          code={`<RichEditor value={html} onChange={setHtml} />`}
        >
          <RichEditor value={full} onChange={setFull} minHeight="220px" />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="自定义工具栏">
        <ComponentDemo
          title="只保留常用工具：粗体/斜体/无序列表/有序列表/链接"
          code={`<RichEditor
  value={html}
  onChange={setHtml}
  toolbarItems={['bold', 'italic', 'bulletList', 'orderedList', 'link']}
/>`}
        >
          <RichEditor value={custom} onChange={setCustom} toolbarItems={MINIMAL_TOOLBAR} minHeight="160px" />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="只读模式">
        <ComponentDemo
          title="readOnly=true 时隐藏工具栏，仅渲染 HTML 内容"
          code={`<RichEditor value={html} readOnly />`}
        >
          <RichEditor value={INITIAL_HTML} readOnly />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="字数限制">
        <ComponentDemo
          title="maxLength=200 时底部显示字数计数，超限时警告色"
          code={`<RichEditor value={html} onChange={setHtml} maxLength={200} />`}
        >
          <RichEditor value={limited} onChange={setLimited} maxLength={200} minHeight="160px" />
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
