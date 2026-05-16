import {
  useState, useEffect, useCallback, useRef,
} from 'react'
import { debounce, throttle } from '@/lib/utils'

// Module-level cache shared across hook instances
const requestCache = new Map<string, { data: unknown; ts: number }>()

export interface UseRequestOptions<T, P extends unknown[]> {
  manual?: boolean
  defaultParams?: P
  initialData?: T
  onSuccess?: (data: T, params: P) => void
  onError?: (error: Error, params: P) => void
  onFinally?: (params: P) => void
  refreshDeps?: unknown[]
  debounceWait?: number
  throttleWait?: number
  retryCount?: number
  retryInterval?: number
  cacheKey?: string
  loadingDelay?: number
}

export interface UseRequestResult<T, P extends unknown[]> {
  data: T | undefined
  loading: boolean
  error: Error | undefined
  run: (...params: P) => Promise<T>
  runAsync: (...params: P) => Promise<T>
  refresh: () => Promise<T>
  cancel: () => void
  mutate: (data: T | ((old: T | undefined) => T)) => void
}

export function useRequest<T, P extends unknown[] = unknown[]>(
  service: (...params: P) => Promise<T>,
  options: UseRequestOptions<T, P> = {},
): UseRequestResult<T, P> {
  const {
    manual = false,
    defaultParams,
    initialData,
    onSuccess,
    onError,
    onFinally,
    refreshDeps,
    debounceWait,
    throttleWait,
    retryCount = 0,
    retryInterval = 1000,
    cacheKey,
    loadingDelay = 0,
  } = options

  const cachedData = cacheKey ? (requestCache.get(cacheKey)?.data as T | undefined) : undefined
  const [data, setData] = useState<T | undefined>(cachedData ?? initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()

  const requestIdRef = useRef(0)
  const lastParamsRef = useRef<P | undefined>(defaultParams)
  const canceledRef = useRef(false)

  const runAsync = useCallback(
    async (...params: P): Promise<T> => {
      const currentId = ++requestIdRef.current
      canceledRef.current = false
      lastParamsRef.current = params

      // Loading delay
      let loadingTimer: ReturnType<typeof setTimeout> | undefined
      if (loadingDelay > 0) {
        loadingTimer = setTimeout(() => {
          if (currentId === requestIdRef.current) setLoading(true)
        }, loadingDelay)
      } else {
        setLoading(true)
      }

      setError(undefined)

      let attempts = 0
      const maxAttempts = retryCount + 1

      while (attempts < maxAttempts) {
        try {
          const result = await service(...params)

          if (canceledRef.current || currentId !== requestIdRef.current) {
            clearTimeout(loadingTimer)
            return result
          }

          clearTimeout(loadingTimer)
          setLoading(false)
          setData(result)
          if (cacheKey) requestCache.set(cacheKey, { data: result, ts: Date.now() })
          onSuccess?.(result, params)
          onFinally?.(params)
          return result
        } catch (err) {
          attempts++
          if (attempts < maxAttempts) {
            await new Promise((r) => setTimeout(r, retryInterval))
            continue
          }

          clearTimeout(loadingTimer)
          if (!canceledRef.current && currentId === requestIdRef.current) {
            const e = err instanceof Error ? err : new Error(String(err))
            setLoading(false)
            setError(e)
            onError?.(e, params)
            onFinally?.(params)
            throw e
          }
          throw err
        }
      }
      throw new Error('Unreachable')
    },
    [service, cacheKey, loadingDelay, retryCount, retryInterval, onSuccess, onError, onFinally],
  )

  // Wrap with debounce or throttle if requested
  const wrappedRun = useCallback(
    (...params: P): Promise<T> => {
      if (debounceWait) {
        return new Promise((resolve, reject) => {
          const fn = debounce((...p: P) => runAsync(...p).then(resolve).catch(reject), debounceWait)
          fn(...params)
        })
      }
      if (throttleWait) {
        return new Promise((resolve, reject) => {
          const fn = throttle((...p: P) => runAsync(...p).then(resolve).catch(reject), throttleWait)
          fn(...params)
        })
      }
      return runAsync(...params)
    },
    [runAsync, debounceWait, throttleWait],
  )

  const cancel = useCallback(() => {
    canceledRef.current = true
    ++requestIdRef.current
    setLoading(false)
  }, [])

  const refresh = useCallback(() => {
    const params = lastParamsRef.current ?? (defaultParams as P)
    return runAsync(...(params ?? ([] as unknown as P)))
  }, [runAsync, defaultParams])

  const mutate = useCallback((updater: T | ((old: T | undefined) => T)) => {
    setData((prev) => typeof updater === 'function' ? (updater as (o: T | undefined) => T)(prev) : updater)
  }, [])

  // Auto-run on mount (if not manual)
  useEffect(() => {
    if (!manual) {
      runAsync(...((defaultParams ?? []) as unknown as P))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-run on refreshDeps change
  useEffect(() => {
    if (refreshDeps !== undefined) {
      runAsync(...((lastParamsRef.current ?? defaultParams ?? []) as unknown as P))
    }
  }, refreshDeps ?? []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    loading,
    error,
    run: wrappedRun,
    runAsync,
    refresh,
    cancel,
    mutate,
  }
}
