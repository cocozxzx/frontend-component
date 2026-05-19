import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import {
  Search, Maximize, Minimize, Bell, Sun, Moon, Settings, Menu,
  LogOut, User, KeyRound,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/useAppStore'
import { useUserStore } from '@/stores/useUserStore'
import { useTheme } from '@/hooks/useTheme'
import { menuConfig, flatMenuLeaves } from '@/config/menu'
import { AppLogo } from './AppLogo'
import { AppTopNav } from './AppTopNav'
import { AppBreadcrumb } from './AppBreadcrumb'
import { ThemeDrawer } from './ThemeDrawer'

const NOTIFICATION_COUNT = 5

interface AppHeaderProps {
  onMobileMenuToggle?: () => void
}

export function AppHeader({ onMobileMenuToggle }: AppHeaderProps) {
  const navigate = useNavigate()
  const { layoutMode, fixedHeader } = useAppStore()
  const { user, logout } = useUserStore()
  const { colorMode, setColorMode, isDark } = useTheme()

  const [commandOpen, setCommandOpen] = useState(false)
  const [themeDrawerOpen, setThemeDrawerOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Fullscreen tracking
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  // Cmd+K shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const toggleDark = () => setColorMode(isDark ? 'light' : 'dark')

  const allLeaves = flatMenuLeaves(menuConfig)

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const isSideMode = layoutMode === 'side'

  return (
    <>
      <header
        className={cn(
          'flex h-14 shrink-0 items-center border-b border-border/60 bg-card/95 px-4 z-50 backdrop-blur-sm',
          fixedHeader && 'sticky top-0',
        )}
      >
        {/* Left */}
        <div className="flex flex-1 items-center gap-3">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMobileMenuToggle}
          >
            <Menu size={18} />
          </Button>

          {isSideMode ? (
            /* Side mode: Logo only (sidebar has collapse button) */
            <AppLogo size="md" />
          ) : (
            /* Top / Mix mode: Logo + horizontal nav */
            <>
              <AppLogo size="md" className="mr-2" />
              <div className="hidden md:flex">
                <AppTopNav />
              </div>
            </>
          )}

          {/* Breadcrumb for side mode */}
          {isSideMode && (
            <div className="hidden md:block">
              <AppBreadcrumb />
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <Button variant="ghost" size="icon" onClick={() => setCommandOpen(true)}>
            <Search size={17} />
          </Button>

          {/* Fullscreen */}
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={17} />
            {NOTIFICATION_COUNT > 0 && (
              <Badge className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px]">
                {NOTIFICATION_COUNT}
              </Badge>
            )}
          </Button>

          {/* Dark mode toggle */}
          <Button variant="ghost" size="icon" onClick={toggleDark}>
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </Button>

          {/* Theme settings */}
          <Button variant="ghost" size="icon" onClick={() => setThemeDrawerOpen(true)}>
            <Settings size={17} />
          </Button>

          {/* User avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="font-normal">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User size={14} className="mr-2" />
                个人中心
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/password')}>
                <KeyRound size={14} className="mr-2" />
                修改密码
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => { logout(); navigate('/login') }}
              >
                <LogOut size={14} className="mr-2" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Theme drawer */}
      <ThemeDrawer open={themeDrawerOpen} onOpenChange={setThemeDrawerOpen} />

      {/* Command search dialog */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="搜索页面或功能...（Ctrl+K）" />
        <CommandList>
          <CommandEmpty>未找到匹配结果</CommandEmpty>
          <CommandGroup heading="页面">
            {allLeaves.map((item) => (
              <CommandItem
                key={item.key}
                value={item.label}
                onSelect={() => {
                  if (item.path) navigate(item.path)
                  setCommandOpen(false)
                }}
              >
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
