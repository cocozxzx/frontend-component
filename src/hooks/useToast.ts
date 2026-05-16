import { toast as sonnerToast, type ExternalToast } from 'sonner'

export interface ToastOptions extends ExternalToast {
  description?: string
  action?: { label: string; onClick: () => void }
}

function buildOptions(options?: ToastOptions): ExternalToast | undefined {
  if (!options) return undefined
  const { action, ...rest } = options
  return {
    ...rest,
    action: action ? { label: action.label, onClick: action.onClick } : undefined,
  }
}

export function useToast() {
  return {
    success: (message: string, options?: ToastOptions) =>
      sonnerToast.success(message, buildOptions(options)),

    error: (message: string, options?: ToastOptions) =>
      sonnerToast.error(message, buildOptions(options)),

    warning: (message: string, options?: ToastOptions) =>
      sonnerToast.warning(message, buildOptions(options)),

    info: (message: string, options?: ToastOptions) =>
      sonnerToast.info(message, buildOptions(options)),

    loading: (message: string, options?: ToastOptions) =>
      sonnerToast.loading(message, buildOptions(options)),

    dismiss: (id?: string | number) => sonnerToast.dismiss(id),

    promise: <T>(
      promise: Promise<T>,
      options: {
        loading: string
        success: string | ((data: T) => string)
        error: string | ((err: unknown) => string)
        description?: string
      },
    ) => sonnerToast.promise(promise, options),
  }
}

/** Singleton toast for non-hook contexts (axios interceptors, utils, etc.) */
export const toast = {
  success: (message: string, options?: ToastOptions) =>
    sonnerToast.success(message, buildOptions(options)),
  error: (message: string, options?: ToastOptions) =>
    sonnerToast.error(message, buildOptions(options)),
  warning: (message: string, options?: ToastOptions) =>
    sonnerToast.warning(message, buildOptions(options)),
  info: (message: string, options?: ToastOptions) =>
    sonnerToast.info(message, buildOptions(options)),
  loading: (message: string, options?: ToastOptions) =>
    sonnerToast.loading(message, buildOptions(options)),
  dismiss: (id?: string | number) => sonnerToast.dismiss(id),
}
