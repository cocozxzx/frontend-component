# ProTable / ProForm Schema 规范

> 所有类型定义见 `src/types/schema.ts`，本文档为完整说明和示例。

---

## ProTableSchema

ProTable 的顶层配置对象，通过 `schema` prop 传入。

```ts
interface ProTableSchema {
  columns: TableColumn[]
  searchFields?: SearchField[]
  toolbar?: ToolbarButton[]
  rowKey?: string
  showIndex?: boolean
  showSelection?: boolean
  showColumnSetting?: boolean
  showRefresh?: boolean
  pagination?: boolean | { defaultPageSize?: number; pageSizeOptions?: number[] }
  api?: string
  defaultParams?: Record<string, unknown>
  bordered?: boolean
  striped?: boolean
  size?: 'sm' | 'md' | 'lg'
}
```

### 字段说明

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | `TableColumn[]` | 必填 | 列配置，详见下方 |
| `searchFields` | `SearchField[]` | — | 搜索栏字段配置 |
| `toolbar` | `ToolbarButton[]` | — | 工具栏按钮 |
| `rowKey` | `string` | `'id'` | 行唯一标识字段 |
| `showIndex` | `boolean` | `false` | 显示序号列 |
| `showSelection` | `boolean` | `false` | 显示多选列 |
| `showColumnSetting` | `boolean` | `false` | 显示列设置按钮 |
| `showRefresh` | `boolean` | `false` | 显示刷新按钮 |
| `pagination` | `boolean \| object` | `true` | 分页配置，`false` 关闭分页 |
| `api` | `string` | — | GET 接口路径，自动携带分页和搜索参数 |
| `defaultParams` | `object` | — | 接口的固定默认参数 |
| `bordered` | `boolean` | `false` | 显示列边框 |
| `striped` | `boolean` | `false` | 斑马纹 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 表格尺寸 |

---

## TableColumn

单列配置对象。

```ts
interface TableColumn {
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
  linkConfig?: { href: string | ((row) => string); target?: string }
  actions?: ActionButton[]
  renderKey?: string
}
```

### ColumnType 详解

| 类型 | 说明 | 额外配置 |
|------|------|---------|
| `text` | 纯文本（默认） | `copyable`、`ellipsis` |
| `number` | 数字 | — |
| `date` | 日期格式化 | `dateFormat`（默认 `yyyy-MM-dd`） |
| `datetime` | 日期时间格式化 | `dateFormat`（默认 `yyyy-MM-dd HH:mm:ss`） |
| `tag` | 彩色标签 | `tagMap`（值→variant）、`labelMap`（值→文字） |
| `badge` | 状态徽标 | `tagMap`、`labelMap` |
| `image` | 图片缩略图 | — |
| `link` | 超链接 | `linkConfig.href`（字符串或函数）、`linkConfig.target` |
| `boolean` | 布尔值展示 | `booleanMap`（`{ true: '是', false: '否' }`） |
| `action` | 操作按钮列 | `actions`（ActionButton[]） |
| `custom` | 自定义渲染 | `renderKey`（对应 `renders` prop 中的函数名） |

### TagVariant

```ts
type TagVariant = 'default' | 'success' | 'warning' | 'destructive' | 'info'
```

### ActionButton

```ts
interface ActionButton {
  label: string
  type?: 'default' | 'primary' | 'destructive' | 'warning'
  icon?: string                          // lucide-react 图标名
  permission?: string | string[]         // 权限码，无权限时自动隐藏
  hidden?: boolean | string              // true 或 JS 表达式（row 变量可用）
  disabled?: boolean | string
  confirm?: {
    title: string
    content?: string
    type?: 'default' | 'warning' | 'danger'
  }
  action: string                         // 传递给 onAction 回调的标识符
}
```

**示例**

```json
{
  "key": "_action",
  "title": "操作",
  "type": "action",
  "fixed": "right",
  "width": 180,
  "actions": [
    { "label": "编辑", "type": "primary", "icon": "Pencil", "permission": "user:edit", "action": "edit" },
    {
      "label": "删除",
      "type": "destructive",
      "permission": "user:delete",
      "hidden": "row.status === 'protected'",
      "confirm": { "title": "确认删除？", "content": "删除后不可恢复", "type": "danger" },
      "action": "delete"
    }
  ]
}
```

---

## SearchField

搜索栏字段配置。

```ts
interface SearchField {
  field: string
  label: string
  type: SearchFieldType
  placeholder?: string
  options?: Array<{ label: string; value: string | number }>
  span?: 6 | 8 | 12 | 24
  defaultValue?: unknown
  remote?: boolean
  onSearch?: string
}
```

### SearchFieldType 详解

| 类型 | 说明 | 额外配置 |
|------|------|---------|
| `input` | 文本输入框 | `placeholder` |
| `select` | 下拉选择 | `options`；远程搜索：`remote: true`、`onSearch` |
| `date` | 日期选择 | — |
| `date-range` | 日期范围 | — |
| `number-range` | 数字范围 | — |
| `radio` | 单选按钮组 | `options` |
| `checkbox` | 多选框组 | `options` |
| `custom` | 自定义 | `onSearch`（对应 `remoteSearch` prop） |

`span` 控制栅格宽度（24列制）：`6`=1/4、`8`=1/3、`12`=1/2、`24`=整行。默认 `8`。

---

## ToolbarButton

工具栏按钮配置。

```ts
interface ToolbarButton {
  label: string
  type?: 'default' | 'primary' | 'destructive'
  icon?: string
  permission?: string | string[]
  action: string
}
```

---

## ProFormSchema

ProForm 的顶层配置对象。

```ts
interface ProFormSchema {
  fields?: FormField[]            // 平铺字段（与 groups 二选一）
  groups?: FormGroup[]            // 分组字段
  layout?: 'vertical' | 'horizontal'
  labelWidth?: string | number    // horizontal 模式下 label 宽度
  columns?: number                // 默认列数（1-4），字段 span 可覆盖
  submitText?: string
  resetText?: string
  showSubmit?: boolean
  showReset?: boolean
  submitPosition?: 'left' | 'center' | 'right'
}
```

---

## FormGroup

字段分组配置。

```ts
interface FormGroup {
  title?: string
  description?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
  fields: FormField[]
  columns?: number
}
```

---

## FormField

单个表单字段配置。

```ts
interface FormField {
  field: string
  label?: string
  type: FormFieldType
  placeholder?: string
  defaultValue?: unknown
  disabled?: boolean | string     // true 或 JS 表达式（values 变量可用）
  hidden?: boolean | string
  required?: boolean
  rules?: ZodRuleConfig
  options?: FormFieldOption[]
  remote?: { api: string; labelField?: string; valueField?: string; params?: object }
  span?: 6 | 8 | 12 | 24
  props?: Record<string, unknown>  // 透传给底层组件的额外 props
  renderKey?: string
  help?: string
  tooltip?: string
}
```

### FormFieldType 详解

| 类型 | 对应组件 | 说明 |
|------|---------|------|
| `input` | AppInput | 单行文本 |
| `textarea` | Textarea | 多行文本，`props.rows` 控制行数 |
| `number` | Input(number) | 数字输入 |
| `password` | Input(password) | 密码框 |
| `select` | AppSelect | 单选下拉，支持 `remote` |
| `multi-select` | AppSelect(multiple) | 多选下拉 |
| `virtual-select` | VirtualSelect | 大数据量下拉（虚拟滚动） |
| `checkbox` | Checkbox | 单个复选框（布尔值） |
| `checkbox-group` | CheckboxGroup | 多选框组，需提供 `options` |
| `radio` | RadioGroup | 单选按钮组，需提供 `options` |
| `switch` | Switch | 开关 |
| `slider` | Slider | 滑块，`props.min/max/step` |
| `rate` | Rate | 评分，`props.count` 控制星数 |
| `date` | AppDatePicker | 日期选择 |
| `datetime` | DateTimePicker | 日期时间选择 |
| `date-range` | AppDateRangePicker | 日期范围 |
| `time` | TimePicker | 时间选择 |
| `color` | ColorPicker | 颜色选择 |
| `upload` | AppUpload | 文件上传，`props.multiple/accept/maxSize` |
| `rich-editor` | RichEditor | 富文本（Tiptap） |
| `tags-input` | TagsInput | 标签输入 |
| `custom` | — | 自定义渲染，`renderKey` 对应 `renders` prop |

### ZodRuleConfig

```ts
interface ZodRuleConfig {
  min?: number           // 数字最小值
  max?: number           // 数字最大值
  minLength?: number     // 字符串最小长度
  maxLength?: number     // 字符串最大长度
  pattern?: string       // 正则表达式字符串
  patternMessage?: string
  email?: boolean        // 邮箱格式校验
  url?: boolean          // URL 格式校验
  custom?: string        // 自定义校验 JS 表达式（value 变量可用，返回 true 或错误信息字符串）
}
```

---

## 完整示例

### ProTableSchema 示例（用户管理）

```json
{
  "api": "/user/list",
  "rowKey": "id",
  "showIndex": true,
  "showSelection": true,
  "showColumnSetting": true,
  "showRefresh": true,
  "striped": true,
  "pagination": { "defaultPageSize": 20, "pageSizeOptions": [10, 20, 50, 100] },
  "searchFields": [
    { "field": "name", "label": "姓名", "type": "input", "placeholder": "请输入姓名", "span": 8 },
    { "field": "status", "label": "状态", "type": "select", "span": 8,
      "options": [{ "label": "启用", "value": 1 }, { "label": "禁用", "value": 0 }] },
    { "field": "createdAt", "label": "创建时间", "type": "date-range", "span": 8 }
  ],
  "toolbar": [
    { "label": "新增用户", "type": "primary", "icon": "UserPlus", "permission": "user:add", "action": "add" },
    { "label": "批量删除", "type": "destructive", "icon": "Trash2", "permission": "user:delete", "action": "batchDelete" }
  ],
  "columns": [
    { "key": "id", "title": "ID", "type": "text", "width": 80, "sortable": true },
    { "key": "name", "title": "姓名", "type": "text", "copyable": true },
    { "key": "email", "title": "邮箱", "type": "text", "ellipsis": true },
    { "key": "status", "title": "状态", "type": "tag",
      "tagMap": { "1": "success", "0": "destructive" },
      "labelMap": { "1": "启用", "0": "禁用" } },
    { "key": "createdAt", "title": "创建时间", "type": "datetime", "sortable": true },
    { "key": "_action", "title": "操作", "type": "action", "fixed": "right", "width": 160,
      "actions": [
        { "label": "编辑", "type": "primary", "permission": "user:edit", "action": "edit" },
        { "label": "删除", "type": "destructive", "permission": "user:delete",
          "confirm": { "title": "确认删除该用户？", "type": "danger" }, "action": "delete" }
      ]}
  ]
}
```

### ProFormSchema 示例（用户编辑表单）

```json
{
  "layout": "vertical",
  "columns": 2,
  "submitText": "保存",
  "resetText": "重置",
  "submitPosition": "center",
  "groups": [
    {
      "title": "基本信息",
      "fields": [
        { "field": "name", "label": "姓名", "type": "input", "required": true,
          "rules": { "maxLength": 50 }, "placeholder": "请输入姓名" },
        { "field": "email", "label": "邮箱", "type": "input", "required": true,
          "rules": { "email": true }, "placeholder": "请输入邮箱" },
        { "field": "phone", "label": "手机号", "type": "input",
          "rules": { "pattern": "^1[3-9]\\d{9}$", "patternMessage": "请输入有效手机号" } },
        { "field": "role", "label": "角色", "type": "select", "required": true,
          "options": [{ "label": "管理员", "value": "admin" }, { "label": "编辑", "value": "editor" }, { "label": "访客", "value": "guest" }] }
      ]
    },
    {
      "title": "账号设置",
      "collapsible": true,
      "fields": [
        { "field": "status", "label": "启用状态", "type": "switch", "defaultValue": true },
        { "field": "expireAt", "label": "有效期", "type": "date",
          "hidden": "values.status === false", "tooltip": "不填则永不过期" },
        { "field": "remark", "label": "备注", "type": "textarea", "span": 24,
          "props": { "rows": 3 }, "placeholder": "请输入备注信息" }
      ]
    }
  ]
}
```
