import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router'
import { Search, ChevronDown, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { menuConfig } from '@/config/menu'

const componentsMenu = menuConfig.find((m) => m.key === 'components')
const groups = componentsMenu?.children ?? []

export function ComponentsLayoutContent() {
  const { pathname } = useLocation()
  const [search, setSearch] = useState('')
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(groups.map((g) => [g.key, true])),
  )
  const lower = search.toLowerCase()
  const isSearching = lower.length > 0

  function toggleGroup(key: string) {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    // -m-4 cancels AppLayout's p-4 so we fill edge-to-edge.
    // height = viewport - header(h-14 = 3.5rem), giving both panels a fixed
    // container so each overflow-y-auto scrolls independently.
    <div
      className="flex overflow-hidden -m-4"
      style={{ height: 'calc(100dvh - 3.5rem)' }}
    >
      {/* ── Left sidebar ──────────────────────────────────────────────── */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-border/60 bg-card">
        {/* Search box */}
        <div className="shrink-0 px-3 py-2.5">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索组件..."
              className="h-7 pl-8 text-xs bg-muted/40 border-border/50 focus-visible:ring-1 focus-visible:ring-primary/30"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/50 mx-3" />

        {/* Scrollable menu — independent scroll */}
        <div className="flex-1 overflow-y-auto py-2">
          {groups.map((group) => {
            const filtered = group.children?.filter((item) =>
              item.label.toLowerCase().includes(lower),
            ) ?? []
            if (filtered.length === 0) return null

            const isOpen = isSearching || openGroups[group.key]
            const hasActive = filtered.some((item) => pathname === item.path)

            return (
              <div key={group.key} className="mb-1">
                {/* Group header — parent button */}
                <button
                  onClick={() => toggleGroup(group.key)}
                  className={cn(
                    'flex w-full items-center gap-1.5 px-3 py-1.5 text-left transition-colors',
                    'text-[11px] font-semibold uppercase tracking-wider',
                    hasActive ? 'text-primary' : 'text-muted-foreground/70 hover:text-muted-foreground',
                  )}
                >
                  {isOpen
                    ? <ChevronDown size={11} className="shrink-0" />
                    : <ChevronRight size={11} className="shrink-0" />
                  }
                  {group.label}
                  <span className="ml-auto rounded-full bg-muted/80 px-1.5 py-px text-[10px] font-normal normal-case tracking-normal text-muted-foreground/60">
                    {filtered.length}
                  </span>
                </button>

                {/* Child items */}
                {isOpen && (
                  <div className="mb-2 space-y-px px-2">
                    {filtered.map((item) => {
                      const isActive = pathname === item.path
                      return (
                        <Link
                          key={item.key}
                          to={item.path ?? '#'}
                          className={cn(
                            'relative flex items-center rounded-lg px-3 py-1.5 text-[12.5px] transition-all duration-150',
                            isActive
                              ? 'font-medium text-primary'
                              : 'text-foreground/55 hover:bg-muted/50 hover:text-foreground',
                          )}
                          style={isActive ? {
                            background: 'linear-gradient(90deg, hsl(var(--primary) / 0.1) 0%, hsl(var(--primary) / 0.04) 100%)',
                          } : undefined}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2.5px] h-4 rounded-r-full bg-primary" />
                          )}
                          {item.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </aside>

      {/* ── Right content — independent scroll ────────────────────────── */}
      <main className="min-w-0 flex-1 overflow-y-auto bg-[hsl(var(--page-bg))] p-4">
        <Outlet />
      </main>
    </div>
  )
}

export default ComponentsLayoutContent
