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
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-card">
        {/* Search box */}
        <div className="shrink-0 p-3">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索组件..."
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>

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
                    'flex w-full items-center justify-between px-3 py-2 text-left transition-colors',
                    'text-[13px] font-semibold',
                    hasActive ? 'text-primary' : 'text-foreground/80 hover:text-foreground',
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {isOpen
                      ? <ChevronDown size={13} className="shrink-0" />
                      : <ChevronRight size={13} className="shrink-0" />
                    }
                    {group.label}
                    <span className="ml-1 rounded-full bg-muted px-1.5 py-px text-[10px] font-normal text-muted-foreground">
                      {filtered.length}
                    </span>
                  </span>
                </button>

                {/* Child items */}
                {isOpen && (
                  <div className="mb-2 space-y-0.5 pl-3 pr-2">
                    {filtered.map((item) => {
                      const isActive = pathname === item.path
                      return (
                        <Link
                          key={item.key}
                          to={item.path ?? '#'}
                          className={cn(
                            'flex items-center rounded-md px-3 py-1.5 text-[13px] transition-colors',
                            isActive
                              ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary pl-[10px]'
                              : 'text-foreground/60 hover:bg-muted/60 hover:text-foreground',
                          )}
                        >
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
