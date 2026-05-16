import { Outlet } from 'react-router'

// 当前阶段直接放行，后续接入真实 token 校验时在此处启用重定向
export function AuthGuard() {
  return <Outlet />
}
