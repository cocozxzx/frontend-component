import { useState, useMemo, type ReactNode } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from './input'
import { Button } from './button'
import { Spin } from './spin'
import { Empty } from './empty'
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from './table'
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
  PaginationEllipsis,
} from './pagination'

export interface DataTableColumn<T = Record<string, unknown>> {
  key: string
  title: string
  sortable?: boolean
  width?: number | string
  align?: 'left' | 'center' | 'right'
  render?: (value: unknown, record: T, index: number) => ReactNode
}

interface PaginationConfig {
  total: number
  page: number
  pageSize: number
  onChange: (page: number, pageSize: number) => void
}

interface DataTableProps<T = Record<string, unknown>> {
  columns: DataTableColumn<T>[]
  data: T[]
  rowKey?: keyof T | ((record: T) => string)
  loading?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  pagination?: PaginationConfig
  className?: string
  emptyText?: string
}

type SortOrder = 'asc' | 'desc' | null

function getNestedValue(obj: Record<string, unknown>, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, k) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[k]
    return undefined
  }, obj)
}

function getRowKey<T>(record: T, rowKey?: DataTableProps<T>['rowKey'], index?: number): string {
  if (!rowKey) return String(index)
  if (typeof rowKey === 'function') return rowKey(record)
  return String((record as Record<string, unknown>)[rowKey as string])
}

export function DataTable<T = Record<string, unknown>>({
  columns,
  data,
  rowKey,
  loading = false,
  searchable = false,
  searchPlaceholder = '搜索...',
  pagination,
  className,
  emptyText,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)
  const [searchText, setSearchText] = useState('')

  const handleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key)
      setSortOrder('asc')
    } else if (sortOrder === 'asc') {
      setSortOrder('desc')
    } else {
      setSortKey(null)
      setSortOrder(null)
    }
  }

  const processed = useMemo(() => {
    let result = [...data]

    // Client-side search (across all string/number values)
    if (searchable && searchText.trim()) {
      const lower = searchText.toLowerCase()
      result = result.filter((row) =>
        columns.some((col) => {
          const val = getNestedValue(row as Record<string, unknown>, col.key)
          return String(val ?? '').toLowerCase().includes(lower)
        }),
      )
    }

    // Client-side sort
    if (sortKey && sortOrder) {
      result = [...result].sort((a, b) => {
        const av = getNestedValue(a as Record<string, unknown>, sortKey)
        const bv = getNestedValue(b as Record<string, unknown>, sortKey)
        if (av === bv) return 0
        const cmp = String(av ?? '') < String(bv ?? '') ? -1 : 1
        return sortOrder === 'asc' ? cmp : -cmp
      })
    }

    return result
  }, [data, searchable, searchText, sortKey, sortOrder, columns])

  // Pagination (client-side if no server pagination provided)
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 1

  const currentPage = pagination?.page ?? 1
  const pageSize = pagination?.pageSize ?? processed.length

  const pageData = pagination
    ? processed
    : processed.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const SortIcon = ({ col }: { col: DataTableColumn<T> }) => {
    if (!col.sortable) return null
    if (sortKey !== col.key) return <ArrowUpDown size={13} className="ml-1 opacity-40" />
    if (sortOrder === 'asc') return <ArrowUp size={13} className="ml-1 text-primary" />
    return <ArrowDown size={13} className="ml-1 text-primary" />
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {searchable && (
        <div className="relative w-64">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-8 pl-8 text-sm"
          />
        </div>
      )}

      <div className="relative overflow-auto rounded-md border border-border">
        <Spin spinning={loading}>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    style={{ width: col.width, textAlign: col.align }}
                    className={cn(col.sortable && 'cursor-pointer select-none hover:bg-muted/50')}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div
                      className={cn(
                        'flex items-center',
                        col.align === 'center' && 'justify-center',
                        col.align === 'right' && 'justify-end',
                      )}
                    >
                      {col.title}
                      <SortIcon col={col} />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="py-0">
                    <Empty title={emptyText} />
                  </TableCell>
                </TableRow>
              ) : (
                pageData.map((record, i) => (
                  <TableRow key={getRowKey(record, rowKey, i)}>
                    {columns.map((col) => {
                      const val = getNestedValue(record as Record<string, unknown>, col.key)
                      return (
                        <TableCell
                          key={col.key}
                          style={{ textAlign: col.align }}
                        >
                          {col.render ? col.render(val, record, i) : String(val ?? '')}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Spin>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex justify-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && pagination.onChange(currentPage - 1, pageSize)}
                  className={cn(currentPage <= 1 && 'pointer-events-none opacity-50')}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis')
                  acc.push(p)
                  return acc
                }, [])
                .map((p, i) =>
                  p === 'ellipsis' ? (
                    <PaginationItem key={`e-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === currentPage}
                        onClick={() => pagination.onChange(p, pageSize)}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && pagination.onChange(currentPage + 1, pageSize)}
                  className={cn(currentPage >= totalPages && 'pointer-events-none opacity-50')}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
