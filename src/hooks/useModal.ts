import { useCallback } from 'react'
import { useModalStore, type ModalType } from '@/stores/useModalStore'
import type { ReactNode } from 'react'

export interface ConfirmOptions {
  title: string
  content?: ReactNode
  type?: 'default' | 'warning' | 'danger'
  confirmText?: string
  cancelText?: string
}

export interface AlertOptions {
  title: string
  content?: ReactNode
  type?: 'success' | 'error' | 'warning' | 'info'
  confirmText?: string
}

// ─── Hook usage ──────────────────────────────────────────────────────────────

export function useModal() {
  const push = useModalStore((s) => s.push)

  const confirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        push({
          type: 'confirm',
          modalType: (options.type ?? 'default') as ModalType,
          title: options.title,
          content: options.content,
          confirmText: options.confirmText,
          cancelText: options.cancelText,
          resolve,
        })
      })
    },
    [push],
  )

  const alert = useCallback(
    (options: AlertOptions): Promise<void> => {
      return new Promise<void>((resolve) => {
        push({
          type: 'alert',
          modalType: (options.type ?? 'info') as ModalType,
          title: options.title,
          content: options.content,
          confirmText: options.confirmText,
          resolve: () => resolve(),
        })
      })
    },
    [push],
  )

  return { confirm, alert }
}

// ─── Plain object for non-hook usage (axios interceptors, etc.) ───────────────

export const modal = {
  confirm: (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      useModalStore.getState().push({
        type: 'confirm',
        modalType: (options.type ?? 'default') as ModalType,
        title: options.title,
        content: options.content,
        confirmText: options.confirmText,
        cancelText: options.cancelText,
        resolve,
      })
    })
  },

  alert: (options: AlertOptions): Promise<void> => {
    return new Promise<void>((resolve) => {
      useModalStore.getState().push({
        type: 'alert',
        modalType: (options.type ?? 'info') as ModalType,
        title: options.title,
        content: options.content,
        confirmText: options.confirmText,
        resolve: () => resolve(),
      })
    })
  },
}
