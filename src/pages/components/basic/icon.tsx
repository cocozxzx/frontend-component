import { useState, useMemo } from 'react'
import { icons } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Search, CheckCheck, Copy } from 'lucide-react'
import { toast } from '@/hooks/useToast'
import { PageHeader } from '@/components/preview'
import type { LucideIcon } from 'lucide-react'

// lucide-react exports a dedicated `icons` Record<string, LucideIcon> for enumeration
const ALL_ICONS = Object.entries(icons) as [string, LucideIcon][]

export default function IconPage() {
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return ALL_ICONS
    const lower = search.toLowerCase()
    return ALL_ICONS.filter(([name]) => name.toLowerCase().includes(lower))
  }, [search])

  function handleCopy(name: string) {
    const code = `<${name} size={16} />`
    navigator.clipboard.writeText(code).then(() => {
      setCopied(name)
      toast.success(`已复制：${code}`)
      setTimeout(() => setCopied(null), 1500)
    }).catch(() => undefined)
  }

  return (
    <div className="preview-page">
      <PageHeader
        title="Icon 图标"
        description={`基于 lucide-react，共 ${ALL_ICONS.length} 个图标。搜索并点击图标复制组件代码。`}
        tags={['lucide-react', '基础组件']}
      />

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索图标名称..."
          className="pl-8"
        />
      </div>

      <p className="text-sm text-muted-foreground">
        显示 {filtered.length} / {ALL_ICONS.length} 个图标 · 点击复制{' '}
        <code className="rounded bg-muted px-1 text-xs">{`<IconName size={16} />`}</code>
      </p>

      <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
        {filtered.map(([name, Icon]) => (
          <button
            key={name}
            type="button"
            onClick={() => handleCopy(name)}
            title={`${name} — 点击复制`}
            className="group flex flex-col items-center gap-1 rounded-lg border border-transparent p-2 transition-colors hover:border-border hover:bg-muted/50"
          >
            {copied === name
              ? <CheckCheck size={16} className="text-success" />
              : <Icon size={16} className="text-foreground transition-colors group-hover:text-primary" />
            }
            <span className="w-full truncate text-center text-[9px] leading-tight text-muted-foreground">
              {name}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
          <Copy size={32} className="opacity-30" />
          <p className="text-sm">没有找到「{search}」相关图标</p>
        </div>
      )}
    </div>
  )
}
