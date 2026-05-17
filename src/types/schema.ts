// ── Column types ────────────────────────────────────────────────────────────────

export type ColumnType =
  | 'text' | 'number' | 'date' | 'datetime'
  | 'tag'  | 'badge'  | 'image' | 'link'
  | 'boolean' | 'action' | 'custom'

export type TagVariant = 'default' | 'success' | 'warning' | 'destructive' | 'info'

/** boolean | JS expression string (variable `row` is in scope) */
export type ActionCondition = boolean | string

export interface ActionButton {
  label: string
  type?: 'default' | 'primary' | 'destructive' | 'warning'
  icon?: string
  permission?: string | string[]
  hidden?: ActionCondition
  disabled?: ActionCondition
  confirm?: {
    title: string
    content?: string
    type?: 'default' | 'warning' | 'danger'
  }
  action: string
}

export interface TableColumn {
  key: string
  title: string
  type?: ColumnType
  width?: number | string
  minWidth?: number
  fixed?: 'left' | 'right'
  sortable?: boolean
  filterable?: boolean
  hidden?: boolean
  ellipsis?: boolean
  align?: 'left' | 'center' | 'right'
  copyable?: boolean
  tagMap?: Record<string, TagVariant>
  labelMap?: Record<string, string>
  booleanMap?: { true: string; false: string }
  dateFormat?: string
  linkConfig?: {
    href: string | ((row: Record<string, unknown>) => string)
    target?: string
  }
  actions?: ActionButton[]
  renderKey?: string
}

// ── Search field types ───────────────────────────────────────────────────────────

export type SearchFieldType =
  | 'input' | 'select' | 'date' | 'date-range'
  | 'number-range' | 'radio' | 'checkbox' | 'custom'

export interface SearchField {
  field: string
  label: string
  type: SearchFieldType
  placeholder?: string
  options?: Array<{ label: string; value: string | number }>
  span?: 6 | 8 | 12 | 24
  defaultValue?: unknown
  remote?: boolean
  /** Key into remoteSearch prop (for remote select) or renders prop (for custom) */
  onSearch?: string
}

// ── Toolbar ──────────────────────────────────────────────────────────────────────

export interface ToolbarButton {
  label: string
  type?: 'default' | 'primary' | 'destructive'
  icon?: string
  permission?: string | string[]
  action: string
}

// ── ProTable Schema ──────────────────────────────────────────────────────────────

export interface ProTableSchema {
  columns: TableColumn[]
  searchFields?: SearchField[]
  toolbar?: ToolbarButton[]
  rowKey?: string
  showIndex?: boolean
  showSelection?: boolean
  showColumnSetting?: boolean
  showRefresh?: boolean
  pagination?: boolean | {
    defaultPageSize?: number
    pageSizeOptions?: number[]
  }
  api?: string
  defaultParams?: Record<string, unknown>
  bordered?: boolean
  striped?: boolean
  size?: 'sm' | 'md' | 'lg'
}
