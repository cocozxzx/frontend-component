import { useState, useMemo } from 'react'
import * as LucideIcons from 'lucide-react'
import { type LucideIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Search, CheckCheck, Copy } from 'lucide-react'
import { toast } from '@/hooks/useToast'
import { PageHeader } from '@/components/preview'

// Filter to icon components only
const ALL_ICONS = Object.entries(LucideIcons).filter(
  ([name, value]) =>
    typeof value === 'function' &&
    /^[A-Z]/.test(name) &&
    name !== 'createLucideIcon' &&
    name !== 'default',
) as [string, LucideIcon][]

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
    <div className="p-6 space-y-6 max-w-5xl">
      <PageHeader
        title="Icon 图标"
        description={`基于 lucide-react 的图标库，共 ${ALL_ICONS.length} 个图标。搜索并点击图标复制组件代码。`}
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
        找到 {filtered.length} 个图标 · 点击复制 <code className="bg-muted px-1 rounded text-xs">{`<IconName size={16} />`}</code>
      </p>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {filtered.map(([name, Icon]) => (
          <button
            key={name}
            type="button"
            onClick={() => handleCopy(name)}
            className="group flex flex-col items-center gap-1.5 p-2 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-all"
            title={name}
          >
            <div className="relative">
              {copied === name
                ? <CheckCheck size={18} className="text-success" />
                : <Icon size={18} className="text-foreground group-hover:text-primary transition-colors" />
              }
            </div>
            <span className="text-[10px] text-muted-foreground truncate w-full text-center leading-tight">
              {name}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Copy size={32} className="mx-auto mb-2 opacity-30" />
          <p>没有找到 "{search}" 相关图标</p>
        </div>
      )}
    </div>
  )
}
