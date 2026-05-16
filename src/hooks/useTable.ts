import { useState, useCallback, useRef, useEffect } from 'react'

export interface UseTableOptions<
  T,
  P extends Record<string, unknown> = Record<string, unknown>,
> {
  fetchFn: (params: { page: number; pageSize: number } & P) => Promise<{ list: T[]; total: number }>
  defaultParams?: Partial<P>
  defaultPageSize?: number
  /** Auto-fetch on mount (default true) */
  immediate?: boolean
}

export function useTable<
  T,
  P extends Record<string, unknown> = Record<string, unknown>,
>({
  fetchFn,
  defaultParams = {},
  defaultPageSize = 10,
  immediate = true,
}: UseTableOptions<T, P>) {
  const [data, setData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [searchParams, setSearchParamsState] = useState<Partial<P>>(defaultParams)
  const [selectedRows, setSelectedRows] = useState<T[]>([])

  // Refs to always hold current values without causing stale closures
  const pageRef = useRef(page)
  const pageSizeRef = useRef(pageSize)
  const searchParamsRef = useRef(searchParams)
  const requestIdRef = useRef(0)

  pageRef.current = page
  pageSizeRef.current = pageSize
  searchParamsRef.current = searchParams

  const load = useCallback(
    async (extraParams?: Partial<P>) => {
      const currentId = ++requestIdRef.current
      setLoading(true)
      try {
        const params = {
          page: pageRef.current,
          pageSize: pageSizeRef.current,
          ...searchParamsRef.current,
          ...extraParams,
        } as { page: number; pageSize: number } & P

        const result = await fetchFn(params)

        // Ignore stale responses (later request arrived first)
        if (currentId !== requestIdRef.current) return

        setData(result.list)
        setTotal(result.total)
      } catch {
        if (currentId === requestIdRef.current) {
          setData([])
          setTotal(0)
        }
      } finally {
        if (currentId === requestIdRef.current) setLoading(false)
      }
    },
    [fetchFn],
  )

  const search = useCallback(
    async (params?: Partial<P>) => {
      const merged = { ...searchParamsRef.current, ...params } as Partial<P>
      setSearchParamsState(merged)
      searchParamsRef.current = merged
      setPage(1)
      pageRef.current = 1
      await load()
    },
    [load],
  )

  const reset = useCallback(async () => {
    setSearchParamsState(defaultParams as Partial<P>)
    searchParamsRef.current = defaultParams as Partial<P>
    setPage(1)
    pageRef.current = 1
    await load()
  }, [load, defaultParams])

  const onPageChange = useCallback(
    (newPage: number) => {
      setPage(newPage)
      pageRef.current = newPage
      load()
    },
    [load],
  )

  const onPageSizeChange = useCallback(
    (newSize: number) => {
      setPageSize(newSize)
      pageSizeRef.current = newSize
      setPage(1)
      pageRef.current = 1
      load()
    },
    [load],
  )

  const setSearchParams = useCallback((params: Partial<P>) => {
    setSearchParamsState(params)
    searchParamsRef.current = params
  }, [])

  const clearSelection = useCallback(() => setSelectedRows([]), [])

  useEffect(() => {
    if (immediate) load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    total,
    loading,
    page,
    pageSize,
    searchParams,
    selectedRows,
    isEmpty: !loading && data.length === 0,
    setSelectedRows,
    load,
    search,
    reset,
    onPageChange,
    onPageSizeChange,
    setSearchParams,
    clearSelection,
  }
}
