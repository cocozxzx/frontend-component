import React, { Suspense, type ComponentType } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import { AuthGuard } from './guards'

// ─── Loading fallback ───
function PageLoading() {
  return (
    <div className="flex-center min-h-[400px]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
    </div>
  )
}

// ─── Suspense 包装器 ───
function withSuspense(Component: ComponentType) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Component />
    </Suspense>
  )
}

// ─── 真实页面（懒加载） ───
const AppLayout = React.lazy(() => import('@/layouts/AppLayout'))
const ComponentsLayout = React.lazy(() => import('@/layouts/ComponentsLayout'))
const DashboardPage = React.lazy(() => import('@/pages/dashboard'))
const BasicComponentsIndex = React.lazy(() => import('@/pages/components/basic'))
const BusinessComponentsIndex = React.lazy(() => import('@/pages/components/business'))
const Error403Page = React.lazy(() => import('@/pages/error/403'))
const Error404Page = React.lazy(() => import('@/pages/error/404'))
const Error500Page = React.lazy(() => import('@/pages/error/500'))

// ─── 占位页工厂（后续步骤替换为真实 import） ───
function placeholder(name: string): ComponentType {
  const P = () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="mt-2 text-sm text-muted-foreground">开发中，敬请期待...</p>
    </div>
  )
  P.displayName = name
  return P
}

function lazyPlaceholder(name: string) {
  const P = placeholder(name)
  return React.lazy(() => Promise.resolve({ default: P }))
}

// 基础组件占位页
const ButtonPage = lazyPlaceholder('Button 按钮')
const InputPage = lazyPlaceholder('Input 输入框')
const SelectPage = lazyPlaceholder('Select 选择器')
const FormPage = lazyPlaceholder('Form 表单')
const TablePage = lazyPlaceholder('Table 表格')
const ModalPage = lazyPlaceholder('Modal 弹窗')
const DrawerPage = lazyPlaceholder('Drawer 抽屉')
const TabsPage = lazyPlaceholder('Tabs 标签页')
const CardPage = lazyPlaceholder('Card 卡片')
const BadgePage = lazyPlaceholder('Badge 徽标')
const AvatarPage = lazyPlaceholder('Avatar 头像')
const TooltipPage = lazyPlaceholder('Tooltip 文字提示')
const PopoverPage = lazyPlaceholder('Popover 弹出框')
const AlertPage = lazyPlaceholder('Alert 警告提示')
const ToastPage = lazyPlaceholder('Toast 消息提示')
const ProgressPage = lazyPlaceholder('Progress 进度条')
const SkeletonPage = lazyPlaceholder('Skeleton 骨架屏')
const EmptyPage = lazyPlaceholder('Empty 空状态')
const ResultPage = lazyPlaceholder('Result 结果页')
const SpinPage = lazyPlaceholder('Spin 加载中')
const PaginationPage = lazyPlaceholder('Pagination 分页')
const BreadcrumbPage = lazyPlaceholder('Breadcrumb 面包屑')
const StepsPage = lazyPlaceholder('Steps 步骤条')
const CollapsePage = lazyPlaceholder('Collapse 折叠面板')
const DividerPage = lazyPlaceholder('Divider 分割线')
const TagPage = lazyPlaceholder('Tag 标签')
const TypographyPage = lazyPlaceholder('Typography 排版')
const IconPage = lazyPlaceholder('Icon 图标')
const ScrollAreaPage = lazyPlaceholder('ScrollArea 滚动区域')
const WatermarkPage = lazyPlaceholder('Watermark 水印')

// 业务组件占位页
const DatePickerPage = lazyPlaceholder('DatePicker 日期选择')
const TimePickerPage = lazyPlaceholder('TimePicker 时间选择')
const DateRangePage = lazyPlaceholder('DateRange 日期范围')
const UploadPage = lazyPlaceholder('Upload 文件上传')
const RichEditorPage = lazyPlaceholder('RichEditor 富文本编辑器')
const RatePage = lazyPlaceholder('Rate 评分')
const ColorPickerPage = lazyPlaceholder('ColorPicker 颜色选择器')
const VirtualListPage = lazyPlaceholder('VirtualList 虚拟列表')
const DragPage = lazyPlaceholder('Drag 拖拽排序')
const TreePage = lazyPlaceholder('Tree 树形组件')
const ListPage = lazyPlaceholder('List 列表')
const TimelinePage = lazyPlaceholder('Timeline 时间轴')
const StatisticPage = lazyPlaceholder('Statistic 统计数值')
const DescriptionsPage = lazyPlaceholder('Descriptions 描述列表')
const ImagePage = lazyPlaceholder('Image 图片预览')
const CarouselPage = lazyPlaceholder('Carousel 轮播图')
const QRCodePage = lazyPlaceholder('QRCode 二维码')
const AnchorPage = lazyPlaceholder('Anchor 锚点')
const LineChartPage = lazyPlaceholder('LineChart 折线图')
const BarChartPage = lazyPlaceholder('BarChart 柱状图')
const PieChartPage = lazyPlaceholder('PieChart 饼图')
const AreaChartPage = lazyPlaceholder('AreaChart 面积图')
const RadarChartPage = lazyPlaceholder('RadarChart 雷达图')
const GaugeChartPage = lazyPlaceholder('GaugeChart 仪表盘')
const HeatmapChartPage = lazyPlaceholder('HeatmapChart 热力图')
const StatCardPage = lazyPlaceholder('StatCard 统计卡片')
const MapPage = lazyPlaceholder('Map 地图')
const ProTablePage = lazyPlaceholder('ProTable 高级表格')
const ProFormPage = lazyPlaceholder('ProForm 高级表单')
const ProUploadPage = lazyPlaceholder('ProUpload 高级上传')

// ─── 路由配置 ───
export const router = createBrowserRouter([
  // 根重定向
  { index: true, path: '/', element: <Navigate to="/dashboard" replace /> },

  // 主布局路由
  {
    element: withSuspense(AppLayout),
    children: [
      {
        element: <AuthGuard />,
        children: [
          // 仪表盘
          { path: 'dashboard', element: withSuspense(DashboardPage) },

          // 组件预览（含左侧菜单布局）
          {
            path: 'components',
            element: withSuspense(ComponentsLayout),
            children: [
              { index: true, element: <Navigate to="/components/basic" replace /> },

              // 基础组件
              {
                path: 'basic',
                children: [
                  { index: true, element: withSuspense(BasicComponentsIndex) },
                  { path: 'button', element: withSuspense(ButtonPage) },
                  { path: 'input', element: withSuspense(InputPage) },
                  { path: 'select', element: withSuspense(SelectPage) },
                  { path: 'form', element: withSuspense(FormPage) },
                  { path: 'table', element: withSuspense(TablePage) },
                  { path: 'modal', element: withSuspense(ModalPage) },
                  { path: 'drawer', element: withSuspense(DrawerPage) },
                  { path: 'tabs', element: withSuspense(TabsPage) },
                  { path: 'card', element: withSuspense(CardPage) },
                  { path: 'badge', element: withSuspense(BadgePage) },
                  { path: 'avatar', element: withSuspense(AvatarPage) },
                  { path: 'tooltip', element: withSuspense(TooltipPage) },
                  { path: 'popover', element: withSuspense(PopoverPage) },
                  { path: 'alert', element: withSuspense(AlertPage) },
                  { path: 'toast', element: withSuspense(ToastPage) },
                  { path: 'progress', element: withSuspense(ProgressPage) },
                  { path: 'skeleton', element: withSuspense(SkeletonPage) },
                  { path: 'empty', element: withSuspense(EmptyPage) },
                  { path: 'result', element: withSuspense(ResultPage) },
                  { path: 'spin', element: withSuspense(SpinPage) },
                  { path: 'pagination', element: withSuspense(PaginationPage) },
                  { path: 'breadcrumb', element: withSuspense(BreadcrumbPage) },
                  { path: 'steps', element: withSuspense(StepsPage) },
                  { path: 'collapse', element: withSuspense(CollapsePage) },
                  { path: 'divider', element: withSuspense(DividerPage) },
                  { path: 'tag', element: withSuspense(TagPage) },
                  { path: 'typography', element: withSuspense(TypographyPage) },
                  { path: 'icon', element: withSuspense(IconPage) },
                  { path: 'scroll-area', element: withSuspense(ScrollAreaPage) },
                  { path: 'watermark', element: withSuspense(WatermarkPage) },
                ],
              },

              // 业务组件
              {
                path: 'business',
                children: [
                  { index: true, element: withSuspense(BusinessComponentsIndex) },
                  { path: 'date-picker', element: withSuspense(DatePickerPage) },
                  { path: 'time-picker', element: withSuspense(TimePickerPage) },
                  { path: 'date-range', element: withSuspense(DateRangePage) },
                  { path: 'upload', element: withSuspense(UploadPage) },
                  { path: 'rich-editor', element: withSuspense(RichEditorPage) },
                  { path: 'rate', element: withSuspense(RatePage) },
                  { path: 'color-picker', element: withSuspense(ColorPickerPage) },
                  { path: 'virtual-list', element: withSuspense(VirtualListPage) },
                  { path: 'drag', element: withSuspense(DragPage) },
                  { path: 'tree', element: withSuspense(TreePage) },
                  { path: 'list', element: withSuspense(ListPage) },
                  { path: 'timeline', element: withSuspense(TimelinePage) },
                  { path: 'statistic', element: withSuspense(StatisticPage) },
                  { path: 'descriptions', element: withSuspense(DescriptionsPage) },
                  { path: 'image', element: withSuspense(ImagePage) },
                  { path: 'carousel', element: withSuspense(CarouselPage) },
                  { path: 'qrcode', element: withSuspense(QRCodePage) },
                  { path: 'anchor', element: withSuspense(AnchorPage) },
                  { path: 'line-chart', element: withSuspense(LineChartPage) },
                  { path: 'bar-chart', element: withSuspense(BarChartPage) },
                  { path: 'pie-chart', element: withSuspense(PieChartPage) },
                  { path: 'area-chart', element: withSuspense(AreaChartPage) },
                  { path: 'radar-chart', element: withSuspense(RadarChartPage) },
                  { path: 'gauge-chart', element: withSuspense(GaugeChartPage) },
                  { path: 'heatmap-chart', element: withSuspense(HeatmapChartPage) },
                  { path: 'stat-card', element: withSuspense(StatCardPage) },
                  { path: 'map', element: withSuspense(MapPage) },
                  { path: 'pro-table', element: withSuspense(ProTablePage) },
                  { path: 'pro-form', element: withSuspense(ProFormPage) },
                  { path: 'pro-upload', element: withSuspense(ProUploadPage) },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 独立错误页（无 AppLayout）
  { path: '/403', element: withSuspense(Error403Page) },
  { path: '/404', element: withSuspense(Error404Page) },
  { path: '/500', element: withSuspense(Error500Page) },

  // 未匹配路由 → 404
  { path: '*', element: <Navigate to="/404" replace /> },
])
