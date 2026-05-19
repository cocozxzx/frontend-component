# React Admin Scaffold

## 简介

基于 **React 19 + shadcn/ui + Tailwind CSS 4** 的产品级后台脚手架。

- 109 个组件（含 47 个 shadcn/ui 原生组件）
- 支持主题色动态切换 & 亮/暗色模式
- ProTable / ProForm Schema 驱动，减少重复代码
- 新项目 fork 即用，5 步完成品牌定制

---

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| React | ^19.0.0 | UI 框架 |
| TypeScript | ~5.7.2 | 类型系统 |
| Vite | ^6.3.5 | 构建工具 |
| Tailwind CSS | ^4.3.0 | 原子化 CSS |
| shadcn/ui | — | 无样式组件库（基于 Radix UI） |
| React Router | ^7.15.1 | 路由 |
| Zustand | ^5.0.13 | 状态管理 |
| React Hook Form | ^7.76.0 | 表单 |
| Zod | ^4.4.3 | 数据校验 |
| TanStack Table | ^8.21.3 | 表格引擎 |
| TanStack Virtual | ^3.13.24 | 虚拟滚动 |
| ECharts | ^6.0.0 | 图表 |
| Tiptap | ^3.23.4 | 富文本编辑器 |
| Axios | ^1.16.1 | HTTP 客户端 |
| SWR | ^2.4.1 | 数据请求 |
| date-fns | ^4.1.0 | 日期处理 |
| lucide-react | ^1.16.0 | 图标库 |
| next-themes | ^0.4.6 | 暗色模式 |
| dnd-kit | ^6.3.1 | 拖拽 |
| chroma-js | ^3.2.0 | 主题色阶算法 |

---

## 快速开始

```bash
# 1. 克隆项目
git clone https://github.com/cocozxzx/frontend-component.git
cd frontend-component

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env，填写 API 地址和高德地图 Key

# 4. 启动开发服务器
npm run dev

# 5. 构建生产版本
npm run build
```

---

## 目录结构

```
react-admin-scaffold/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/                        # A类：47个 shadcn/ui 原生组件
│   │   ├── base/                      # B类：16个业务封装组件
│   │   │   ├── AppButton.tsx
│   │   │   ├── AppInput.tsx
│   │   │   ├── AppSelect.tsx
│   │   │   ├── AppModal.tsx
│   │   │   ├── AppDrawer.tsx
│   │   │   ├── AppTable.tsx
│   │   │   ├── AppForm.tsx
│   │   │   ├── FormField.tsx
│   │   │   ├── AppPagination.tsx
│   │   │   ├── AppDatePicker.tsx
│   │   │   ├── AppDateRangePicker.tsx
│   │   │   ├── AppUpload.tsx
│   │   │   ├── AppBadge.tsx
│   │   │   ├── Watermark.tsx
│   │   │   ├── ModalContainer.tsx
│   │   │   ├── PermissionGuard.tsx
│   │   │   └── index.ts
│   │   ├── form/                      # C类：表单增强
│   │   │   ├── Rate.tsx
│   │   │   ├── ColorPicker.tsx
│   │   │   ├── TimePicker.tsx
│   │   │   ├── DateTimePicker.tsx
│   │   │   └── index.ts
│   │   ├── display/                   # C类：数据展示
│   │   │   ├── Timeline.tsx
│   │   │   ├── Statistic.tsx
│   │   │   ├── Descriptions.tsx
│   │   │   ├── Steps.tsx
│   │   │   ├── Image.tsx
│   │   │   ├── Carousel.tsx
│   │   │   ├── QRCode.tsx
│   │   │   └── index.ts
│   │   ├── charts/                    # C类：ECharts图表（11个）
│   │   │   ├── BaseChart.tsx
│   │   │   ├── chartTheme.ts
│   │   │   ├── LineChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   ├── PieChart.tsx
│   │   │   ├── AreaChart.tsx
│   │   │   ├── RadarChart.tsx
│   │   │   ├── ScatterChart.tsx
│   │   │   ├── GaugeChart.tsx
│   │   │   ├── HeatmapChart.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── index.ts
│   │   ├── map/                       # C类：高德地图
│   │   │   ├── BaseMap.tsx
│   │   │   ├── MarkerMap.tsx
│   │   │   ├── HeatMap.tsx
│   │   │   ├── PolylineMap.tsx
│   │   │   └── index.ts
│   │   ├── editor/                    # C类：富文本
│   │   │   └── RichEditor.tsx
│   │   ├── advanced/                  # C类：高级组件
│   │   │   ├── DragList.tsx
│   │   │   ├── DragGrid.tsx
│   │   │   ├── VirtualSelect.tsx
│   │   │   ├── TagsInput.tsx
│   │   │   └── index.ts
│   │   ├── pro/                       # D类：Pro复合组件
│   │   │   ├── ProTable/
│   │   │   ├── ProForm/
│   │   │   └── ProUpload/
│   │   ├── layout/                    # 布局组件
│   │   │   ├── AppLayout.tsx
│   │   │   ├── AppHeader.tsx
│   │   │   ├── AppSidebar.tsx
│   │   │   ├── PageContainer.tsx
│   │   │   └── index.ts
│   │   └── preview/                   # 预览页公共组件
│   ├── pages/
│   │   ├── dashboard/index.tsx        # 示例 Dashboard
│   │   ├── components/                # 组件预览页（59个）
│   │   └── error/                     # 403 / 404 / 500
│   ├── hooks/                         # 自定义 Hooks
│   ├── stores/                        # Zustand 状态
│   ├── router/                        # 路由配置
│   ├── styles/index.css               # Tailwind + CSS 变量
│   ├── types/
│   │   ├── schema.ts                  # ProTable/ProForm Schema 类型
│   │   └── api.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── request.ts
│   │   └── theme-utils.ts
│   ├── config/menu.ts
│   └── main.tsx
├── docs/
│   ├── ai-prompts.md
│   ├── schema-spec.md
│   └── theme-guide.md
├── .github/FORK_GUIDE.md
├── .env.example
├── components.json
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 环境变量说明

| 变量名 | 示例值 | 说明 |
|--------|--------|------|
| `VITE_API_BASE_URL` | `http://localhost:8080/api` | 后端 API 根路径 |
| `VITE_AMAP_KEY` | `你的Key` | 高德地图 JS API Key（地图组件必填） |

---

## 主题定制

### 修改主色

编辑 `src/styles/index.css`，修改 `:root` 中的 `--primary` 变量（HSL 格式）：

```css
:root {
  --primary: 210 100% 56%;  /* 科技蓝，改成你的品牌色 */
}
```

也可以在运行时通过主题面板动态切换，主题色会同步更新所有组件和图表颜色。

详细说明见 [docs/theme-guide.md](docs/theme-guide.md)。

### Fork 新项目

fork 后的改造步骤见 [.github/FORK_GUIDE.md](.github/FORK_GUIDE.md)。

---

## 组件使用规范

### Import 路径约定

```ts
// shadcn/ui 原生组件
import { Button } from '@/components/ui/button'

// 业务封装组件（B类）
import { AppTable } from '@/components/base'

// 数据展示组件（C类）
import { Timeline, TimelineItem } from '@/components/display'

// 图表组件（C类）
import { LineChart, StatCard } from '@/components/charts'

// Pro 复合组件（D类）
import { ProTable } from '@/components/pro/ProTable'
import { ProForm } from '@/components/pro/ProForm'

// 布局组件
import { PageContainer } from '@/components/layout/PageContainer'
```

### 命名规范

| 类别 | 前缀 / 约定 | 示例 |
|------|------------|------|
| shadcn/ui 原生 | 无前缀 | `Button`, `Input`, `Badge` |
| 业务封装 | `App` 前缀 | `AppTable`, `AppModal` |
| Pro 复合 | `Pro` 前缀 | `ProTable`, `ProForm` |
| 页面组件 | `Page` 后缀 | `UserListPage`, `DashboardPage` |
| 自定义 Hooks | `use` 前缀 | `useTable`, `useModal` |
| Store | `use` + `Store` | `useAppStore`, `useUserStore` |
