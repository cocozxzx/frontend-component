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

// ─── 基础组件页（真实 import） ───
const ButtonPage = React.lazy(() => import('@/pages/components/basic/button'))
const InputPage = React.lazy(() => import('@/pages/components/basic/input'))
const SelectPage = React.lazy(() => import('@/pages/components/basic/select'))
const FormPage = React.lazy(() => import('@/pages/components/basic/form'))
const TablePage = React.lazy(() => import('@/pages/components/basic/table'))
const ModalPage = React.lazy(() => import('@/pages/components/basic/modal'))
const DrawerPage = React.lazy(() => import('@/pages/components/basic/drawer'))
const TabsPage = React.lazy(() => import('@/pages/components/basic/tabs'))
const CardPage = React.lazy(() => import('@/pages/components/basic/card'))
const BadgePage = React.lazy(() => import('@/pages/components/basic/badge'))
const AvatarPage = React.lazy(() => import('@/pages/components/basic/avatar'))
const TooltipPage = React.lazy(() => import('@/pages/components/basic/tooltip'))
const PopoverPage = React.lazy(() => import('@/pages/components/basic/popover'))
const AlertPage = React.lazy(() => import('@/pages/components/basic/alert'))
const ToastPage = React.lazy(() => import('@/pages/components/basic/toast'))
const ProgressPage = React.lazy(() => import('@/pages/components/basic/progress'))
const SkeletonPage = React.lazy(() => import('@/pages/components/basic/skeleton'))
const EmptyPage = React.lazy(() => import('@/pages/components/basic/empty'))
const ResultPage = React.lazy(() => import('@/pages/components/basic/result'))
const SpinPage = React.lazy(() => import('@/pages/components/basic/spin'))
const PaginationPage = React.lazy(() => import('@/pages/components/basic/pagination'))
const BreadcrumbPage = React.lazy(() => import('@/pages/components/basic/breadcrumb'))
const StepsPage = React.lazy(() => import('@/pages/components/basic/steps'))
const CollapsePage = React.lazy(() => import('@/pages/components/basic/collapse'))
const DividerPage = React.lazy(() => import('@/pages/components/basic/divider'))
const TagPage = React.lazy(() => import('@/pages/components/basic/tag'))
const TypographyPage = React.lazy(() => import('@/pages/components/basic/typography'))
const IconPage = React.lazy(() => import('@/pages/components/basic/icon'))
const ScrollAreaPage = React.lazy(() => import('@/pages/components/basic/scroll-area'))
const WatermarkPage = React.lazy(() => import('@/pages/components/basic/watermark'))

// ─── 业务组件页（真实 import） ───
const DatePickerPage = React.lazy(() => import('@/pages/components/business/date-picker'))
const TimePickerPage = React.lazy(() => import('@/pages/components/business/time-picker'))
const DateRangePage = React.lazy(() => import('@/pages/components/business/date-range'))
const UploadPage = React.lazy(() => import('@/pages/components/business/upload'))
const RichEditorPage = React.lazy(() => import('@/pages/components/business/rich-editor'))
const RatePage = React.lazy(() => import('@/pages/components/business/rate'))
const ColorPickerPage = React.lazy(() => import('@/pages/components/business/color-picker'))
const VirtualListPage = React.lazy(() => import('@/pages/components/business/virtual-list'))
const DragPage = React.lazy(() => import('@/pages/components/business/drag'))
const TreePage = React.lazy(() => import('@/pages/components/business/tree'))
const ListPage = React.lazy(() => import('@/pages/components/business/list'))
const TimelinePage = React.lazy(() => import('@/pages/components/business/timeline'))
const StatisticPage = React.lazy(() => import('@/pages/components/business/statistic'))
const DescriptionsPage = React.lazy(() => import('@/pages/components/business/descriptions'))
const ImagePage = React.lazy(() => import('@/pages/components/business/image'))
const CarouselPage = React.lazy(() => import('@/pages/components/business/carousel'))
const QRCodePage = React.lazy(() => import('@/pages/components/business/qrcode'))
const AnchorPage = React.lazy(() => import('@/pages/components/business/anchor'))
const LineChartPage = React.lazy(() => import('@/pages/components/business/line-chart'))
const BarChartPage = React.lazy(() => import('@/pages/components/business/bar-chart'))
const PieChartPage = React.lazy(() => import('@/pages/components/business/pie-chart'))
const AreaChartPage = React.lazy(() => import('@/pages/components/business/area-chart'))
const RadarChartPage = React.lazy(() => import('@/pages/components/business/radar-chart'))
const GaugeChartPage = React.lazy(() => import('@/pages/components/business/gauge-chart'))
const HeatmapChartPage = React.lazy(() => import('@/pages/components/business/heatmap-chart'))
const StatCardPage = React.lazy(() => import('@/pages/components/business/stat-card'))
const MapPage = React.lazy(() => import('@/pages/components/business/map'))
const ProTablePage = React.lazy(() => import('@/pages/components/business/pro-table'))
const ProFormPage = React.lazy(() => import('@/pages/components/business/pro-form'))
const ProUploadPage = React.lazy(() => import('@/pages/components/business/pro-upload'))

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
