import { useNavigate, useLocation } from 'react-router'
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { menuConfig, isMenuActive, type MenuItem } from '@/config/menu'
import { DynamicIcon } from './DynamicIcon'

function NavItem({ item }: { item: MenuItem }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const active = isMenuActive(item, pathname)

  const baseClass = cn(
    'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors rounded-md',
    'relative cursor-pointer select-none',
    active ? 'text-primary' : 'text-foreground/70 hover:text-foreground hover:bg-muted/50',
  )

  if (!item.children?.length) {
    return (
      <button
        className={cn(baseClass, active && 'after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-[2px] after:bg-primary after:rounded-full')}
        onClick={() => item.path && navigate(item.path)}
      >
        {item.icon && <DynamicIcon name={item.icon} size={15} />}
        {item.label}
      </button>
    )
  }

  // Flatten first-level children for the dropdown
  const dropdownItems = item.children.flatMap((child) =>
    child.children?.length
      ? child.children.map((c) => ({ ...c, groupLabel: child.label }))
      : [{ ...child, groupLabel: undefined }],
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(baseClass, active && 'text-primary')}
        >
          {item.icon && <DynamicIcon name={item.icon} size={15} />}
          {item.label}
          <ChevronDown size={13} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-80 overflow-y-auto">
        {dropdownItems.slice(0, 20).map((child) => (
          <DropdownMenuItem
            key={child.key}
            onClick={() => child.path && navigate(child.path)}
          >
            {child.label}
          </DropdownMenuItem>
        ))}
        {dropdownItems.length > 20 && (
          <DropdownMenuItem disabled className="text-muted-foreground text-xs">
            还有 {dropdownItems.length - 20} 项...
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
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
