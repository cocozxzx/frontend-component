import { create } from 'zustand'
import { generateId } from '@/lib/utils'
import type { ReactNode } from 'react'

export type ModalType = 'default' | 'warning' | 'danger' | 'success' | 'error' | 'info'

export interface ModalConfig {
  type: 'confirm' | 'alert'
  modalType?: ModalType
  title: string
  content?: ReactNode
  confirmText?: string
  cancelText?: string
  resolve: (value: boolean) => void
}

export interface ModalItem extends ModalConfig {
  id: string
}

interface ModalStore {
  modals: ModalItem[]
  push: (config: ModalConfig) => void
  remove: (id: string) => void
}

export const useModalStore = create<ModalStore>()((set) => ({
  modals: [],
  push: (config) =>
    set((s) => ({ modals: [...s.modals, { ...config, id: generateId('modal_') }] })),
  remove: (id) =>
    set((s) => ({ modals: s.modals.filter((m) => m.id !== id) })),
}))
