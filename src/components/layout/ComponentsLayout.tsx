import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { menuConfig } from '@/config/menu'

// Extract component groups from menu config
const componentsMenu = menuConfig.find((m) => m.key === 'components')
const groups = componentsMenu?.children ?? []

export function ComponentsLayoutContent() {
  const { pathname } = useLocation()
  const [search, setSearch] = useState('')
  const lower = search.toLowerCase()

  return (
    <div className="flex min-h-0 flex-1">
      {/* Left sidebar — 220px */}
      <aside className="w-[220px] shrink-0 border-r border-border bg-card">
        <div className="flex h-full flex-col">
          {/* Search */}
          <div className="p-3">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索组件..."
                className="h-8 pl-8 text-xs"
              />
            </div>
          </div>
          <Separator />

          {/* Menu groups */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {groups.map((group, gi) => {
                const filtered = group.children?.filter((item) =>
                  item.label.toLowerCase().includes(lower),
                ) ?? []

                if (filtered.length === 0) return null

                return (
                  <div key={group.key} className={cn(gi > 0 && 'mt-4')}>
                    <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.label}
                    </p>
                    <div className="space-y-0.5">
                      {filtered.map((item) => {
                        const isActive = pathname === item.path
                        return (
                          <Link
                            key={item.key}
                            to={item.path ?? '#'}
                            className={cn(
                              'block rounded-md px-3 py-1.5 text-sm transition-colors',
                              isActive
                                ? 'bg-primary text-primary-foreground font-medium'
                                : 'text-foreground/70 hover:bg-muted hover:text-foreground',
                            )}
                          >
                            {item.label}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </aside>

      {/* Right content */}
      <main className="min-w-0 flex-1 overflow-auto p-4 bg-[hsl(var(--page-bg))]">
        <Outlet />
      </main>
    </div>
  )
}

// Default export for layouts/ComponentsLayout.tsx re-export
export default ComponentsLayoutContent
