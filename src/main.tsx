import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { Toaster } from '@/components/ui/sonner'
import '@/styles/index.css'
import { router } from '@/router'
import { useTheme } from '@/hooks/useTheme'

// 在 RouterProvider 之外调用 useTheme，确保主题在路由渲染前初始化
function Root() {
  useTheme()
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
