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

// ═══════════════════════════════════════════════════════════════════════════════
// ProForm Types
// ═══════════════════════════════════════════════════════════════════════════════

export type FormFieldType =
  | 'input' | 'textarea' | 'number' | 'password'
  | 'select' | 'multi-select' | 'virtual-select'
  | 'checkbox' | 'checkbox-group' | 'radio' | 'switch'
  | 'slider' | 'rate' | 'date' | 'datetime' | 'date-range'
  | 'time' | 'color' | 'upload' | 'rich-editor' | 'tags-input'
  | 'custom'

export interface FormFieldOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface ZodRuleConfig {
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: string
  patternMessage?: string
  email?: boolean
  url?: boolean
  custom?: string
}

export interface FormField {
  field: string
  label?: string
  type: FormFieldType
  placeholder?: string
  defaultValue?: unknown
  /** boolean or JS expression with `values` in scope */
  disabled?: boolean | string
  /** boolean or JS expression with `values` in scope */
  hidden?: boolean | string
  required?: boolean
  rules?: ZodRuleConfig
  options?: FormFieldOption[]
  remote?: {
    api: string
    labelField?: string
    valueField?: string
    params?: Record<string, unknown>
  }
  span?: 6 | 8 | 12 | 24
  /** Extra props passed through to the underlying component */
  props?: Record<string, unknown>
  renderKey?: string
  help?: string
  tooltip?: string
}

export interface FormGroup {
  title?: string
  description?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
  fields: FormField[]
  columns?: number
}

export interface ProFormSchema {
  fields?: FormField[]
  groups?: FormGroup[]
  layout?: 'vertical' | 'horizontal'
  labelWidth?: string | number
  columns?: number
  submitText?: string
  resetText?: string
  showSubmit?: boolean
  showReset?: boolean
  submitPosition?: 'left' | 'center' | 'right'
}
