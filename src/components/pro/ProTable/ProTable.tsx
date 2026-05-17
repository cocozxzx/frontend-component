import {
  useState,
  useMemo,
  useCallback,
  useImperativeHandle,
  type ReactNode,
  type CSSProperties,
} from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type ColumnPinningState,
} from '@tanstack/react-table'
import {
  RotateCw, Plus, Download, Trash2, Edit2, Send,
  ArrowUp, ArrowDown, ArrowUpDown, type LucideIcon,
} from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Spin } from '@/components/ui/spin'
import { Empty } from '@/components/ui/empty'
import { AppPagination } from '@/components/base/AppPagination'
import { usePermissionStore } from '@/stores/usePermissionStore'
import { useTable } from '@/hooks/useTable'
import { get } from '@/lib/request'
import { cn } from '@/lib/utils'
import type { ProTableSchema, SearchField, TableColumn } from '@/types/schema'
import { renderCell, type CellRenderFn } from './renderCell'
import { ActionColumn } from './ActionColumn'
import { SearchBar } from './SearchBar'
import { ColumnSetting, type PinDirection } from './ColumnSetting'

// ─── Icon map for toolbar ───────────────────────────────────────────────────────

const TOOLBAR_ICON_MAP: Record<string, LucideIcon> = {
  Plus, Add: Plus, add: Plus, create: Plus,
  Download, download: Download,
  Trash: Trash2, Trash2, delete: Trash2, remove: Trash2,
  Edit: Edit2, Edit2, edit: Edit2,
  Send, send: Send,
}

function ToolbarIcon({ name, size = 15 }: { name: string; size?: number }) {
  const Icon = TOOLBAR_ICON_MAP[name]
  return Icon ? <Icon size={size} /> : null
}

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ProTableRef {
  refresh: () => void
  reset: () => void
  getSelectedRows: () => Record<string, unknown>[]
  clearSelection: () => void
}

export interface ProTableProps {
  schema: ProTableSchema
  fetchFn?: (params: Record<string, unknown>) => Promise<{ list: Record<string, unknown>[]; total: number }>
  dataSource?: Record<string, unknown>[]
  onAction?: (action: string, row: Record<string, unknown>) => void
  onToolbarAction?: (action: string, selectedRows: Record<string, unknown>[]) => void
  renders?: Record<string, CellRenderFn>
  searchRenders?: Record<string, (field: SearchField) => ReactNode>
  remoteSearch?: Record<string, (keyword: string) => Promise<Array<{ label: string; value: string | number }>>>
  tableRef?: React.RefObject<ProTableRef | null>
  className?: string
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function resolvePageConfig(schema: ProTableSchema): { defaultPageSize: number; pageSizeOptions: number[] } {
  if (schema.pagination === false) return { defaultPageSize: 99999, pageSizeOptions: [] }
  if (schema.pagination && typeof schema.pagination === 'object') {
    return {
      defaultPageSize: schema.pagination.defaultPageSize ?? 10,
      pageSizeOptions: schema.pagination.pageSizeOptions ?? [10, 20, 50, 100],
    }
  }
  return { defaultPageSize: 10, pageSizeOptions: [10, 20, 50, 100] }
}

// ─── Sticky column style ───────────────────────────────────────────────────────

function getStickyStyle(pinned: PinDirection, offset: number): CSSProperties {
  if (!pinned) return {}
  return {
    position: 'sticky',
    [pinned === 'left' ? 'left' : 'right']: offset,
    zIndex: 1,
    backgroundColor: 'hsl(var(--background))',
  }
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ProTable({
  schema,
  fetchFn,
  dataSource,
  onAction,
  onToolbarAction,
  renders,
  searchRenders,
  remoteSearch,
  tableRef,
  className,
}: ProTableProps) {
  const hasPermission = usePermissionStore((s) => s.hasPermission)
  const { defaultPageSize, pageSizeOptions } = resolvePageConfig(schema)
  const rowKey = schema.rowKey ?? 'id'
  const showPagination = schema.pagination !== false

  // ── Column state ───────────────────────────────────────────────────────────

  const [orderedColumns, setOrderedColumns] = useState<TableColumn[]>(schema.columns)

  const [visibleKeys, setVisibleKeys] = useState<string[]>(() =>
    schema.columns.filter((c) => !c.hidden).map((c) => c.key),
  )

  const [pinning, setPinning] = useState<Record<string, PinDirection>>(() => {
    const init: Record<string, PinDirection> = {}
    schema.columns.forEach((c) => { if (c.fixed) init[c.key] = c.fixed })
    return init
  })

  const columnPinningState = useMemo<ColumnPinningState>(() => ({
    left: Object.entries(pinning).filter(([, v]) => v === 'left').map(([k]) => k),
    right: Object.entries(pinning).filter(([, v]) => v === 'right').map(([k]) => k),
  }), [pinning])

  // ── Data fetching ──────────────────────────────────────────────────────────

  const localFetchFn = useCallback(
    async (params: { page: number; pageSize: number }) => {
      const src = dataSource ?? []
      const start = (params.page - 1) * params.pageSize
      return { list: src.slice(start, start + params.pageSize), total: src.length }
    },
    [dataSource],
  )

  const apiFetchFn = useCallback(
    async (params: Record<string, unknown>) =>
      get<{ list: Record<string, unknown>[]; total: number }>(schema.api!, { params }),
    [schema.api],
  )

  const resolvedFetchFn = fetchFn ?? (schema.api ? apiFetchFn : localFetchFn)

  const tableHook = useTable<Record<string, unknown>>({
    fetchFn: resolvedFetchFn as Parameters<typeof useTable>[0]['fetchFn'],
    defaultParams: schema.defaultParams,
    defaultPageSize,
  })

  // ── Table state ────────────────────────────────────────────────────────────

  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  // ── Column defs ────────────────────────────────────────────────────────────

  const columnDefs = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
    const defs: ColumnDef<Record<string, unknown>>[] = []

    if (schema.showSelection) {
      defs.push({
        id: '__selection',
        size: 48,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
          />
        ),
      })
    }

    if (schema.showIndex) {
      defs.push({
        id: '__index',
        size: 64,
        header: '#',
        cell: ({ row }) =>
          (tableHook.page - 1) * tableHook.pageSize + row.index + 1,
      })
    }

    const visibleOrdered = orderedColumns.filter((c) => visibleKeys.includes(c.key))

    visibleOrdered.forEach((col) => {
      defs.push({
        id: col.key,
        accessorKey: col.key,
        header: col.title,
        size: typeof col.width === 'number' ? col.width : undefined,
        minSize: col.minWidth,
        enableSorting: col.sortable ?? false,
        cell: ({ row, getValue }) => {
          if (col.type === 'action' && col.actions) {
            return (
              <ActionColumn
                actions={col.actions}
                row={row.original}
                onAction={onAction ?? (() => undefined)}
              />
            )
          }
          return renderCell(col, getValue(), row.original, row.index, {
            renders,
            onAction,
            page: tableHook.page,
            pageSize: tableHook.pageSize,
          })
        },
      })
    })

    return defs
  }, [
    schema.showSelection, schema.showIndex,
    orderedColumns, visibleKeys,
    tableHook.page, tableHook.pageSize,
    renders, onAction,
  ])

  // ── useReactTable ──────────────────────────────────────────────────────────

  const table = useReactTable({
    data: tableHook.data,
    columns: columnDefs,
    state: { sorting, rowSelection, columnPinning: columnPinningState },
    enableColumnPinning: true,
    enableRowSelection: schema.showSelection ?? false,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => String(row[rowKey] ?? Math.random()),
  })

  // ── ProTableRef ────────────────────────────────────────────────────────────

  useImperativeHandle(tableRef, () => ({
    refresh: () => { void tableHook.load() },
    reset: () => { void tableHook.reset(); setRowSelection({}) },
    getSelectedRows: () => table.getSelectedRowModel().rows.map((r) => r.original),
    clearSelection: () => setRowSelection({}),
  }), [tableHook, table])

  // ── Derived selected rows for toolbar ──────────────────────────────────────

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original)

  // ── Column setting reset ───────────────────────────────────────────────────

  function handleColumnReset() {
    setOrderedColumns(schema.columns)
    setVisibleKeys(schema.columns.filter((c) => !c.hidden).map((c) => c.key))
    const initPin: Record<string, PinDirection> = {}
    schema.columns.forEach((c) => { if (c.fixed) initPin[c.key] = c.fixed })
    setPinning(initPin)
  }

  // ── Pin offset calculation ─────────────────────────────────────────────────

  function getPinOffset(colId: string, direction: 'left' | 'right'): number {
    const pinnedCols = direction === 'left'
      ? (columnPinningState.left ?? [])
      : (columnPinningState.right ?? [])
    const idx = pinnedCols.indexOf(colId)
    if (idx < 0) return 0
    let offset = 0
    for (let i = 0; i < idx; i++) {
      const c = schema.columns.find((col) => col.key === pinnedCols[i])
      offset += (typeof c?.width === 'number' ? c.width : 120)
    }
    return offset
  }

  // ── Size config ────────────────────────────────────────────────────────────

  const sizeClass = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }[schema.size ?? 'md']
  const cellPad = { sm: 'py-1 px-2', md: 'py-2 px-3', lg: 'py-3 px-4' }[schema.size ?? 'md']

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className={cn('flex flex-col gap-0', className)}>

      {/* Search bar */}
      {schema.searchFields && schema.searchFields.length > 0 && (
        <SearchBar
          fields={schema.searchFields}
          loading={tableHook.loading}
          renders={searchRenders}
          remoteSearch={remoteSearch}
          onSearch={(values) => { void tableHook.search(values as Record<string, unknown>) }}
          onReset={() => { void tableHook.reset() }}
        />
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          {schema.toolbar?.map((btn) => {
            if (btn.permission && !hasPermission(btn.permission)) return null
            const variant =
              btn.type === 'primary' ? 'default'
              : btn.type === 'destructive' ? 'destructive'
              : 'outline'
            return (
              <Button
                key={btn.action}
                variant={variant}
                size="sm"
                onClick={() => onToolbarAction?.(btn.action, selectedRows)}
              >
                {btn.icon && <ToolbarIcon name={btn.icon} />}
                {btn.label}
              </Button>
            )
          })}
          {selectedRows.length > 0 && (
            <span className="text-sm text-muted-foreground">已选 {selectedRows.length} 项</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {(schema.showRefresh ?? true) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { void tableHook.load() }}
              title="刷新"
            >
              <RotateCw size={15} className={cn(tableHook.loading && 'animate-spin')} />
            </Button>
          )}
          {(schema.showColumnSetting ?? true) && (
            <ColumnSetting
              columns={orderedColumns}
              visibleKeys={visibleKeys}
              pinning={pinning}
              onVisibilityChange={setVisibleKeys}
              onOrderChange={setOrderedColumns}
              onPinChange={(key, dir) =>
                setPinning((prev) => ({ ...prev, [key]: dir }))
              }
              onReset={handleColumnReset}
            />
          )}
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-auto rounded-md border">
        <Spin spinning={tableHook.loading} tip="加载中...">
          <Table className={cn(schema.bordered && 'border-collapse [&_td]:border [&_th]:border', sizeClass)}>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => {
                    const pinned = pinning[header.id] ?? false
                    const offset = pinned ? getPinOffset(header.id, pinned) : 0
                    const canSort = header.column.getCanSort()

                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          width: header.getSize(),
                          ...getStickyStyle(pinned, offset),
                        }}
                        className={cn(
                          cellPad,
                          pinned && 'shadow-[inset_-1px_0_0_hsl(var(--border))]',
                          canSort && 'cursor-pointer select-none',
                          header.column.columnDef.id === '__selection' && 'text-center',
                        )}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      >
                        <span className="inline-flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            header.column.getIsSorted() === 'asc'
                              ? <ArrowUp size={12} />
                              : header.column.getIsSorted() === 'desc'
                                ? <ArrowDown size={12} />
                                : <ArrowUpDown size={12} className="opacity-40" />
                          )}
                        </span>
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length === 0 && !tableHook.loading ? (
                <TableRow>
                  <TableCell colSpan={columnDefs.length} className="h-32 p-0">
                    <Empty />
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row, rowIdx) => (
                  <TableRow
                    key={row.id}
                    className={cn(
                      schema.striped && rowIdx % 2 === 1 && 'bg-muted/30',
                      row.getIsSelected() && 'bg-primary/5',
                    )}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const pinned = pinning[cell.column.id] ?? false
                      const offset = pinned ? getPinOffset(cell.column.id, pinned) : 0
                      const colDef = schema.columns.find((c) => c.key === cell.column.id)

                      return (
                        <TableCell
                          key={cell.id}
                          style={{
                            width: cell.column.getSize(),
                            ...getStickyStyle(pinned, offset),
                          }}
                          className={cn(
                            cellPad,
                            pinned && 'shadow-[inset_-1px_0_0_hsl(var(--border))]',
                            colDef?.align === 'center' && 'text-center',
                            colDef?.align === 'right' && 'text-right',
                            colDef?.ellipsis && 'max-w-[200px]',
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
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

      {/* Pagination */}
      {showPagination && (
        <div className="flex justify-end mt-3">
          <AppPagination
            total={tableHook.total}
            page={tableHook.page}
            pageSize={tableHook.pageSize}
            pageSizeOptions={pageSizeOptions}
            onPageChange={tableHook.onPageChange}
            onPageSizeChange={tableHook.onPageSizeChange}
          />
        </div>
      )}
    </div>
  )
}
