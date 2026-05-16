import { create } from 'zustand'

interface UserInfo {
  name: string
  email: string
  avatar?: string
  role: string
}

interface UserStore {
  user: UserInfo
  setUser: (user: Partial<UserInfo>) => void
  logout: () => void
}

const defaultUser: UserInfo = {
  name: 'Admin',
  email: 'admin@example.com',
  role: '超级管理员',
}

export const useUserStore = create<UserStore>()((set) => ({
  user: defaultUser,
  setUser: (user) => set((s) => ({ user: { ...s.user, ...user } })),
  logout: () => set({ user: defaultUser }),
}))
