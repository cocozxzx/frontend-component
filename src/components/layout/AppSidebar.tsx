import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/useAppStore'
import { menuConfig, isMenuActive, type MenuItem } from '@/config/menu'
import { DynamicIcon } from './DynamicIcon'
import { useMediaQuery } from '@/hooks/useMediaQuery'

// ─── MenuItem ───────────────────────────────────────────────────────────────

interface SidebarMenuItemProps {
  item: MenuItem
  depth: number
  collapsed: boolean
  pathname: string
  expandedKeys: string[]
  onToggleExpand: (key: string) => void
}

function SidebarMenuItem({
  item,
  depth,
  collapsed,
  pathname,
  expandedKeys,
  onToggleExpand,
}: SidebarMenuItemProps) {
  const navigate = useNavigate()
  const active = isMenuActive(item, pathname)
  const hasChildren = !!item.children?.length
  const isExpanded = expandedKeys.includes(item.key)

  const handleClick = () => {
    if (hasChildren) {
      onToggleExpand(item.key)
    } else if (item.path) {
      navigate(item.path)
    }
  }

  const paddingLeft = collapsed ? undefined : `${depth * 12 + 12}px`

  const button = (
    <button
      onClick={handleClick}
      style={{ paddingLeft }}
      className={cn(
        'group relative flex w-full items-center gap-2.5 rounded-lg py-2 text-[13px] transition-all duration-150',
        collapsed ? 'justify-center px-2 mx-0' : 'pr-3 mx-1',
        active
          ? 'font-medium text-sidebar-accent-foreground'
          : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-white/[0.06]',
      )}
      style={active ? {
        background: 'linear-gradient(90deg, hsl(var(--sidebar-accent) / 0.22) 0%, hsl(var(--sidebar-accent) / 0.08) 100%)',
      } : undefined}
    >
      {/* Active indicator stripe */}
      {active && !collapsed && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
          style={{ background: 'hsl(var(--sidebar-accent))' }}
        />
      )}
      {item.icon && (
        <DynamicIcon
          name={item.icon}
          size={15}
          className={cn('shrink-0 transition-colors', active ? 'text-sidebar-accent' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80')}
        />
      )}
      {!collapsed && (
        <>
          <span className="flex-1 truncate text-left">{item.label}</span>
          {hasChildren && (
            <ChevronDown
              size={12}
              className={cn('shrink-0 text-sidebar-foreground/40 transition-transform duration-200', isExpanded && 'rotate-180')}
            />
          )}
        </>
      )}
    </button>
  )

  return (
    <div>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={4}>
            {item.label}
          </TooltipContent>
        </Tooltip>
      ) : (
        button
      )}

      {/* Children — only when expanded and sidebar is not collapsed */}
      {hasChildren && !collapsed && isExpanded && (
        <div className="mt-0.5 space-y-0.5">
          {item.children!.map((child) => (
            <SidebarMenuItem
              key={child.key}
              item={child}
              depth={depth + 1}
              collapsed={collapsed}
              pathname={pathname}
              expandedKeys={expandedKeys}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Sidebar body ─────────────────────────────────────────────────────────────

interface SidebarBodyProps {
  collapsed: boolean
  items: MenuItem[]
}

function SidebarBody({ collapsed, items }: SidebarBodyProps) {
  const { pathname } = useLocation()
  const { toggleSidebar } = useAppStore()

  // Initialize expanded keys from current active path
  const [expandedKeys, setExpandedKeys] = useState<string[]>(() => {
    const keys: string[] = []
    function collect(list: MenuItem[]) {
      for (const item of list) {
        if (item.children && isMenuActive(item, pathname)) {
          keys.push(item.key)
          collect(item.children)
        }
      }
    }
    collect(items)
    return keys
  })

  const onToggleExpand = (key: string) => {
    if (collapsed) {
      // Auto-expand sidebar when clicking a parent icon
      toggleSidebar()
      setExpandedKeys((prev) => (prev.includes(key) ? prev : [...prev, key]))
    } else {
      setExpandedKeys((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
      )
    }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-full flex-col" style={{ backgroundColor: 'hsl(var(--sidebar))' }}>
        {/* Menu */}
        <ScrollArea className="flex-1 py-3 px-2">
          <div className="space-y-0.5">
            {items.map((item) => (
              <SidebarMenuItem
                key={item.key}
                item={item}
                depth={0}
                collapsed={collapsed}
                pathname={pathname}
                expandedKeys={expandedKeys}
                onToggleExpand={onToggleExpand}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Collapse toggle */}
        <div className="border-t border-sidebar-border/60 p-2">
          <button
            onClick={() => toggleSidebar()}
            className="flex w-full items-center justify-center rounded-lg py-2 text-sidebar-foreground/40 transition-all hover:bg-white/[0.06] hover:text-sidebar-foreground/70"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </div>
    </TooltipProvider>
  )
}

// ─── AppSidebar (exported) ───────────────────────────────────────────────────

interface AppSidebarProps {
  /** Items to display. Pass menuConfig root for Side, filtered sub-tree for Mix. */
  items?: MenuItem[]
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function AppSidebar({
  items = menuConfig,
  mobileOpen = false,
  onMobileClose,
}: AppSidebarProps) {
  const { sidebarCollapsed, sidebarWidth } = useAppStore()
  const isMobile = useMediaQuery('(max-width: 767px)')

  const width = sidebarCollapsed ? 64 : sidebarWidth

  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={(open) => !open && onMobileClose?.()}>
        <SheetContent side="left" className="w-[240px] p-0">
          <SidebarBody collapsed={false} items={items} />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside
      className="relative shrink-0 overflow-hidden transition-all duration-200 ease-in-out"
      style={{ width: `${width}px` }}
    >
      <div className="absolute inset-0">
        <SidebarBody collapsed={sidebarCollapsed} items={items} />
      </div>
    </aside>
  )
}
