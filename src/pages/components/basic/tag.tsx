import { useState } from 'react'
import { Tag } from '@/components/ui/tag'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'variant', type: "'default'|'success'|'warning'|'destructive'|'info'|'outline'", default: "'default'", description: '颜色变体' },
  { name: 'size', type: "'sm'|'md'", default: "'md'", description: '尺寸' },
  { name: 'closable', type: 'boolean', default: 'false', description: '显示关闭按钮' },
  { name: 'onClose', type: '() => void', description: '关闭按钮点击回调' },
]

const VARIANTS: Array<'default' | 'success' | 'warning' | 'destructive' | 'info' | 'outline'> = [
  'default', 'success', 'warning', 'destructive', 'info', 'outline',
]

export default function TagPage() {
  const [tags, setTags] = useState(['前端', 'React', 'TypeScript'])
  const [inputVal, setInputVal] = useState('')

  function addTag() {
    const t = inputVal.trim()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setInputVal('')
  }

  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Tag 标签"
        description="用于标记和分类的内联标签，支持六种颜色变体、两种尺寸和可关闭模式。"
        tags={['基础组件']}
      />

      <DemoSection title="所有变体">
        <ComponentDemo title="六种颜色变体" code={`<Tag variant="default">默认</Tag>
<Tag variant="success">成功</Tag>
<Tag variant="warning">警告</Tag>
<Tag variant="destructive">错误</Tag>
<Tag variant="info">信息</Tag>
<Tag variant="outline">描边</Tag>`}>
          <div className="flex flex-wrap gap-2">
            {VARIANTS.map(v => (
              <Tag key={v} variant={v}>{v}</Tag>
            ))}
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="尺寸">
        <ComponentDemo title="sm / md 两种尺寸" code={`<Tag size="sm">Small</Tag>
<Tag size="md">Medium</Tag>`}>
          <div className="flex items-center gap-3">
            {VARIANTS.slice(0, 3).map(v => (
              <div key={v} className="flex items-center gap-1.5">
                <Tag variant={v} size="sm">{v}</Tag>
                <Tag variant={v} size="md">{v}</Tag>
              </div>
            ))}
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="可关闭（动态增删）">
        <ComponentDemo title="closable=true + 动态添加" code={`const [tags, setTags] = useState(['React', 'TypeScript'])
{tags.map(tag => (
  <Tag key={tag} closable onClose={() => setTags(prev => prev.filter(t => t !== tag))}>
    {tag}
  </Tag>
))}`}>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Tag key={tag} variant="default" closable onClose={() => setTags(prev => prev.filter(t => t !== tag))}>
                  {tag}
                </Tag>
              ))}
            </div>
            <div className="flex gap-2 max-w-xs">
              <Input value={inputVal} onChange={e => setInputVal(e.target.value)}
                placeholder="输入新标签"
                onKeyDown={e => e.key === 'Enter' && addTag()}
                className="h-8 text-sm"
              />
              <Button size="sm" onClick={addTag} className="shrink-0"><Plus size={14} /></Button>
            </div>
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
