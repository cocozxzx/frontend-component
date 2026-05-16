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
        'flex w-full items-center gap-2.5 border-l-[3px] py-2 text-sm transition-colors',
        collapsed ? 'justify-center px-2' : 'pr-3',
        active
          ? 'border-l-sidebar-accent bg-sidebar-accent/15 font-medium text-sidebar-accent'
          : 'border-l-transparent text-sidebar-foreground hover:bg-white/[0.08]',
      )}
    >
      {item.icon && <DynamicIcon name={item.icon} size={16} className="shrink-0" />}
      {!collapsed && (
        <>
          <span className="flex-1 truncate text-left">{item.label}</span>
          {hasChildren && (
            <ChevronDown
              size={13}
              className={cn('shrink-0 transition-transform duration-200', isExpanded && 'rotate-180')}
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
        <ScrollArea className="flex-1 px-2 py-2">
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
        <div className="border-t border-sidebar-border p-2">
          <button
            onClick={() => !collapsed && toggleSidebar() || collapsed && toggleSidebar()}
            className="flex w-full items-center justify-center rounded py-2 text-sidebar-foreground/60 transition-colors hover:bg-white/[0.08] hover:text-sidebar-foreground"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
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
