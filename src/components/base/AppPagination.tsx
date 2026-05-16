import { useState, type KeyboardEvent } from 'react'
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface AppPaginationProps {
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
  showTotal?: boolean
  showQuickJump?: boolean
  showPageSize?: boolean
  disabled?: boolean
  className?: string
}

function getPageRange(page: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const pages: (number | 'ellipsis')[] = [1]
  if (page > 3) pages.push('ellipsis')
  const start = Math.max(2, page - 1)
  const end = Math.min(totalPages - 1, page + 1)
  for (let p = start; p <= end; p++) pages.push(p)
  if (page < totalPages - 2) pages.push('ellipsis')
  pages.push(totalPages)
  return pages
}

export function AppPagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showTotal = true,
  showQuickJump = true,
  showPageSize = true,
  disabled = false,
  className,
}: AppPaginationProps) {
  const [jumpValue, setJumpValue] = useState('')
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const goTo = (p: number) => {
    const clamped = Math.min(totalPages, Math.max(1, p))
    if (clamped !== page) onPageChange(clamped)
  }

  const handleJump = () => {
    const num = parseInt(jumpValue, 10)
    if (!isNaN(num)) goTo(num)
    setJumpValue('')
  }

  const handleJumpKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleJump()
  }

  const pageRange = getPageRange(page, totalPages)

  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-3 text-sm', className)}>
      {/* Left: total */}
      {showTotal && (
        <span className="text-muted-foreground">
          共 <span className="font-medium text-foreground">{total}</span> 条
        </span>
      )}

      {/* Center: page buttons */}
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => goTo(page - 1)}
              className={cn(
                (page <= 1 || disabled) && 'pointer-events-none opacity-50',
              )}
            />
          </PaginationItem>

          {pageRange.map((p, i) =>
            p === 'ellipsis' ? (
              <PaginationItem key={`e-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={p === page}
                  onClick={() => !disabled && goTo(p)}
                  className={cn(disabled && 'pointer-events-none opacity-50')}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => goTo(page + 1)}
              className={cn(
                (page >= totalPages || disabled) && 'pointer-events-none opacity-50',
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Right: pageSize + quick jump */}
      <div className="flex items-center gap-2">
        {showPageSize && onPageSizeChange && (
          <Select
            value={String(pageSize)}
            onValueChange={(v) => { onPageSizeChange(Number(v)); goTo(1) }}
            disabled={disabled}
          >
            <SelectTrigger className="h-8 w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((opt) => (
                <SelectItem key={opt} value={String(opt)}>
                  {opt} 条/页
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {showQuickJump && (
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">跳至</span>
            <Input
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value)}
              onKeyDown={handleJumpKeyDown}
              onBlur={handleJump}
              disabled={disabled}
              className="h-8 w-14 text-center"
              placeholder={String(page)}
            />
            <span className="text-muted-foreground">页</span>
          </div>
        )}
      </div>
    </div>
  )
}
