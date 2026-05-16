import { useState } from 'react'
import { Outlet } from 'react-router'
import { useAppStore } from '@/stores/useAppStore'
import { menuConfig } from '@/config/menu'
import { AppHeader } from './AppHeader'
import { AppSidebar } from './AppSidebar'
import { AppFooter } from './AppFooter'

// In Mix mode, derive sidebar items from the active top-level route
function useMixSidebarItems(pathname: string) {
  const activeTop = menuConfig.find(
    (item) => item.path === pathname || pathname.startsWith((item.path ?? '') + '/') || (item.children && pathname.startsWith('/' + item.key)),
  )
  return activeTop?.children ?? []
}

export function AppLayoutContent() {
  const { layoutMode, showFooter } = useAppStore()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  if (layoutMode === 'top') {
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader onMobileMenuToggle={() => setMobileSidebarOpen((o) => !o)} />
        <main className="flex-1 p-4 bg-[hsl(var(--page-bg))]">
          <Outlet />
        </main>
        {showFooter && <AppFooter />}
      </div>
    )
  }

  if (layoutMode === 'side') {
    return (
      <div className="flex min-h-screen">
        <AppSidebar
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AppHeader onMobileMenuToggle={() => setMobileSidebarOpen((o) => !o)} />
          <main className="flex-1 overflow-auto p-4 bg-[hsl(var(--page-bg))]">
            <Outlet />
          </main>
          {showFooter && <AppFooter />}
        </div>
      </div>
    )
  }

  // Mix mode
  return (
    <MixLayout
      mobileSidebarOpen={mobileSidebarOpen}
      onMobileMenuToggle={() => setMobileSidebarOpen((o) => !o)}
      onMobileClose={() => setMobileSidebarOpen(false)}
      showFooter={showFooter}
    />
  )
}

function MixLayout({
  mobileSidebarOpen,
  onMobileMenuToggle,
  onMobileClose,
  showFooter,
}: {
  mobileSidebarOpen: boolean
  onMobileMenuToggle: () => void
  onMobileClose: () => void
  showFooter: boolean
}) {
  // Cannot use useLocation here directly without Outlet; derive from window.location
  const pathname = window.location.pathname
  const sidebarItems = useMixSidebarItems(pathname)

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader onMobileMenuToggle={onMobileMenuToggle} />
      <div className="flex min-h-0 flex-1">
        {sidebarItems.length > 0 && (
          <AppSidebar
            items={sidebarItems}
            mobileOpen={mobileSidebarOpen}
            onMobileClose={onMobileClose}
          />
        )}
        <main className="flex-1 overflow-auto p-4 bg-[hsl(var(--page-bg))]">
          <Outlet />
        </main>
      </div>
      {showFooter && <AppFooter />}
    </div>
  )
}

export default AppLayoutContent
