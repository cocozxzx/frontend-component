# AI 协作 Prompt 模板

> 基于 React Admin Scaffold（React 19 + shadcn/ui + Tailwind CSS 4）的 AI 辅助开发模板。
> 所有类型定义见 `src/types/schema.ts`。

---

## 生成列表页

````
我使用 React Admin Scaffold（React 19 + shadcn/ui），使用 ProTable 组件。
ProTable 接收 ProTableSchema 类型的 schema prop（类型定义见 src/types/schema.ts）。

请帮我生成一个「[页面名称]」的 ProTableSchema JSON，要求：

- 字段：[列出字段，格式：字段名 / 标题 / 类型，例如：id/ID/text、name/姓名/text、status/状态/tag]
- 搜索：[搜索条件，格式：字段名/标签/类型，例如：name/关键字/input、status/状态/select]
- 操作列：[操作按钮，注明权限，例如：编辑(user:edit)、删除(user:delete，需二次确认)]
- API 路径：[GET 接口路径，例如：/user/list]

请直接输出 JSON，不需要其他解释。
````

**示例输出**

```json
{
  "api": "/user/list",
  "rowKey": "id",
  "showIndex": true,
  "showSelection": true,
  "showColumnSetting": true,
  "showRefresh": true,
  "pagination": { "defaultPageSize": 20 },
  "searchFields": [
    { "field": "name", "label": "关键字", "type": "input", "placeholder": "请输入姓名" },
    { "field": "status", "label": "状态", "type": "select",
      "options": [{ "label": "启用", "value": 1 }, { "label": "禁用", "value": 0 }] }
  ],
  "toolbar": [
    { "label": "新增", "type": "primary", "icon": "Plus", "permission": "user:add", "action": "add" }
  ],
  "columns": [
    { "key": "id", "title": "ID", "type": "text", "width": 80 },
    { "key": "name", "title": "姓名", "type": "text" },
    { "key": "status", "title": "状态", "type": "tag",
      "tagMap": { "1": "success", "0": "destructive" },
      "labelMap": { "1": "启用", "0": "禁用" } },
    { "key": "_action", "title": "操作", "type": "action", "fixed": "right", "width": 160,
      "actions": [
        { "label": "编辑", "type": "primary", "permission": "user:edit", "action": "edit" },
        { "label": "删除", "type": "destructive", "permission": "user:delete",
          "confirm": { "title": "确认删除？", "content": "删除后不可恢复", "type": "danger" },
          "action": "delete" }
      ]}
  ]
}
```

---

## 生成表单页

````
我使用 React Admin Scaffold，使用 ProForm 组件。
ProForm 接收 ProFormSchema 类型的 schema prop（类型定义见 src/types/schema.ts）。

请帮我生成一个「[表单名称]」的 ProFormSchema JSON，要求：

- 字段：[列出所有字段及类型，格式：字段名/标签/类型，例如：name/姓名/input、role/角色/select]
- 校验：[列出校验规则，例如：name 必填最多50字、email 必填邮箱格式]
- 布局：[vertical 或 horizontal，几列，例如：vertical 2列]

请直接输出 JSON。
````

**示例输出**

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
        { "field": "role", "label": "角色", "type": "select", "required": true,
          "options": [{ "label": "管理员", "value": "admin" }, { "label": "普通用户", "value": "user" }] },
        { "field": "status", "label": "状态", "type": "switch", "defaultValue": true, "span": 24 }
      ]
    },
    {
      "title": "扩展信息",
      "collapsible": true,
      "defaultCollapsed": true,
      "fields": [
        { "field": "remark", "label": "备注", "type": "textarea", "span": 24,
          "props": { "rows": 4 }, "placeholder": "请输入备注" }
      ]
    }
  ]
}
```

---

## 生成 Dashboard 页

````
我使用 React Admin Scaffold，请帮我生成一个 Dashboard 页面（src/pages/dashboard/index.tsx）。

页面要求：
- 顶部统计卡片：[描述卡片内容，例如：4个，分别是用户数/订单数/营业额/在线率]
- 图表区：[描述图表，例如：左侧折线图展示近7天访问趋势，右侧环形图展示流量来源]
- 下方：[描述表格和时间轴，例如：最新订单表格 + 系统动态时间轴]

数据全部用模拟常量，不发请求。
使用以下组件（均已在项目中实现）：
- PageContainer（@/components/layout/PageContainer）
- StatCard（@/components/charts/StatCard）
- LineChart / PieChart（@/components/charts）
- AppTable（@/components/base/AppTable）
- Timeline / TimelineItem（@/components/display/Timeline）
- Card / CardContent / CardHeader / CardTitle（@/components/ui/card）
````

---

## 生成图表组件代码

````
我使用 React Admin Scaffold，图表基于 ECharts（echarts-for-react）封装。

可用图表组件（均在 @/components/charts）：
- LineChart：折线图 / 面积图，props: data/xField/yField/seriesNames/smooth/area/height
- BarChart：柱状图，props: data/xField/yField/seriesNames/horizontal/stack/height
- PieChart：饼图 / 环形图，props: data/donut/innerRadius/outerRadius/height
- AreaChart：面积图（渐变），props: 同 LineChart
- RadarChart：雷达图，props: data/indicators/height
- GaugeChart：仪表盘，props: value/min/max/title/height
- HeatmapChart：热力图，props: data/xAxis/yAxis/height
- ScatterChart：散点图，props: data/xField/yField/height
- StatCard：统计卡片，props: title/value/trend/trendValue/miniChart

请帮我生成一段展示「[图表类型和数据说明]」的 React 代码，数据使用模拟常量。
````

---

## 扩展新组件

````
我使用 React Admin Scaffold，需要新增一个「[组件名称]」组件，放在 src/components/[目录]/ 下。

组件要求：
- 功能：[描述组件功能]
- Props：[列出 props 及类型]
- 样式：使用 Tailwind CSS + shadcn/ui 风格，支持亮/暗色模式
- 主题：颜色应使用 CSS 变量（--primary / --card / --border 等），不要写死颜色值

请生成组件代码和对应的 TypeScript 类型定义。
````

---

## 修改主题色

````
我使用 React Admin Scaffold，主题色通过 src/styles/index.css 中的 CSS 变量控制。

当前主色（科技蓝）：--primary: 210 100% 56%

请帮我将主题色修改为「[品牌色名称或十六进制值]」，并：
1. 给出 HSL 格式的 --primary 值
2. 给出对应的 --primary-foreground（确保文字对比度 ≥ 4.5:1）
3. 给出暗色模式下的对应值
4. 同步更新 --sidebar 和 --ring

请直接输出需要替换的 CSS 变量片段。
````
