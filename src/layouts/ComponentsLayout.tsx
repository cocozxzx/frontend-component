import { Outlet } from 'react-router'

// 占位布局 — 步骤 5 中替换为带左侧分类菜单的完整实现
export default function ComponentsLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  )
}
