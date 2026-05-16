import { Outlet } from 'react-router'

// 占位布局 — 步骤 5（Layout 系统）中替换为完整实现
export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[hsl(var(--page-bg))]">
      <Outlet />
    </div>
  )
}
