import { useState, useEffect, type ReactNode } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type VisibilityState,
} from '@tanstack/react-table'
import { ArrowUpDown, ArrowUp, ArrowDown, Settings2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table'
import { Spin } from '@/components/ui/spin'
import { Empty } from '@/components/ui/empty'
import { cn } from '@/lib/utils'

const cellPadding = { sm: 'py-1 px-3', md: 'py-2 px-4', lg: 'py-3 px-4' }

export interface AppTableProps<TData> {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  loading?: boolean
  rowKey?: string
  striped?: boolean
  bordered?: boolean
  size?: 'sm' | 'md' | 'lg'
  emptyText?: string
  emptyImage?: ReactNode
  rowSelection?: boolean
  onRowSelectionChange?: (rows: TData[]) => void
  onRowClick?: (row: TData) => void
  stickyHeader?: boolean
  maxHeight?: string | number
  columnVisibility?: boolean
  className?: string
}

export function AppTable<TData,>({
  columns,
  data,
  loading = false,
  rowKey = 'id',
  striped = false,
  bordered = false,
  size = 'md',
  emptyText,
  emptyImage,
  rowSelection: enableRowSelection = false,
  onRowSelectionChange,
  onRowClick,
  stickyHeader = false,
  maxHeight,
  columnVisibility: showColumnVisibility = false,
  className,
}: AppTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelectionState, setRowSelectionState] = useState<RowSelectionState>({})
  const [columnVisibilityState, setColumnVisibilityState] = useState<VisibilityState>({})

  // Prepend checkbox column when row selection is enabled
  const allColumns: ColumnDef<TData, unknown>[] = enableRowSelection
    ? [
        {
          id: '_select',
          size: 40,
          header: ({ table }) => (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')
              }
              onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              onCheckedChange={(v) => row.toggleSelected(!!v)}
              onClick={(e) => e.stopPropagation()}
            />
          ),
        },
        ...columns,
      ]
    : columns

  const table = useReactTable({
    data,
    columns: allColumns,
    state: { sorting, rowSelection: rowSelectionState, columnVisibility: columnVisibilityState },
    enableRowSelection,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelectionState,
    onColumnVisibilityChange: setColumnVisibilityState,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row, i) => {
      const r = row as Record<string, unknown>
      return String(r[rowKey] ?? i)
    },
  })

  useEffect(() => {
    if (!onRowSelectionChange) return
    const selected = table.getSelectedRowModel().rows.map((r) => r.original)
    onRowSelectionChange(selected)
  }, [rowSelectionState]) // eslint-disable-line react-hooks/exhaustive-deps

  const isSticky = stickyHeader || !!maxHeight
  const maxH = maxHeight ? (typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight) : undefined

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {showColumnVisibility && (
        <div className="flex justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings2 size={14} className="mr-1.5" />
                列配置
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48 p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">显示 / 隐藏列</p>
              <div className="space-y-2">
                {table.getAllLeafColumns().filter((c) => c.id !== '_select').map((col) => (
                  <div key={col.id} className="flex items-center justify-between">
                    <span className="text-sm">{String(col.columnDef.header ?? col.id)}</span>
                    <Switch
                      checked={col.getIsVisible()}
                      onCheckedChange={(v) => col.toggleVisibility(v)}
                    />
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      <div
        className={cn(
          'relative overflow-auto rounded-md border border-border',
          bordered && '[&_td]:border-r [&_th]:border-r',
        )}
        style={maxH ? { maxHeight: maxH } : undefined}
      >
        <Spin spinning={loading}>
          <Table>
            <TableHeader className={cn(isSticky && 'sticky top-0 z-10 bg-card')}>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => {
                    const canSort = header.column.getCanSort()
                    const sortDir = header.column.getIsSorted()
                    return (
                      <TableHead
                        key={header.id}
                        style={{ width: header.getSize() }}
                        className={cn(canSort && 'cursor-pointer select-none')}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center gap-1">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {canSort && (
                              sortDir === 'asc' ? (
                                <ArrowUp size={13} className="text-primary" />
                              ) : sortDir === 'desc' ? (
                                <ArrowDown size={13} className="text-primary" />
                              ) : (
                                <ArrowUpDown size={13} className="opacity-40" />
                              )
                            )}
                          </div>
                        )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={allColumns.length} className="py-0">
                    <Empty title={emptyText} image={emptyImage} />
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? 'selected' : undefined}
                    onClick={() => onRowClick?.(row.original)}
                    className={cn(
                      onRowClick && 'cursor-pointer',
                      striped && i % 2 !== 0 && 'bg-muted/30',
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className={cellPadding[size]}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Spin>
      </div>
    </div>
  )
}
