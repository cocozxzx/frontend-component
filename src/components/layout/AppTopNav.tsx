import { useNavigate, useLocation } from 'react-router'
import { cn } from '@/lib/utils'
import { menuConfig, isMenuActive, flatMenuLeaves, type MenuItem } from '@/config/menu'
import { DynamicIcon } from './DynamicIcon'

function NavItem({ item }: { item: MenuItem }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const active = isMenuActive(item, pathname)

  // Resolve the navigation path: use item.path if available, otherwise first leaf
  const targetPath = item.path ?? flatMenuLeaves(item.children ?? []).at(0)?.path

  return (
    <button
      className={cn(
        'relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors rounded-md cursor-pointer select-none',
        active
          ? 'text-primary after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-[2px] after:bg-primary after:rounded-full'
          : 'text-foreground/70 hover:text-foreground hover:bg-muted/50',
      )}
      onClick={() => targetPath && navigate(targetPath)}
    >
      {item.icon && <DynamicIcon name={item.icon} size={15} />}
      {item.label}
    </button>
  )
}

export function AppTopNav() {
  return (
    <nav className="flex items-center gap-1">
      {menuConfig.map((item) => (
        <NavItem key={item.key} item={item} />
      ))}
    </nav>
  )
}
