export interface MenuItem {
  key: string
  label: string
  icon?: string
  path?: string
  children?: MenuItem[]
}

export const menuConfig: MenuItem[] = [
  { key: 'dashboard', label: '首页', icon: 'LayoutDashboard', path: '/dashboard' },
  {
    key: 'components',
    label: '组件库',
    icon: 'Puzzle',
    path: '/components/basic/button',
    children: [
      {
        key: 'basic',
        label: '基础组件',
        icon: 'Box',
        children: [
          { key: 'button', label: 'Button 按钮', path: '/components/basic/button' },
          { key: 'input', label: 'Input 输入框', path: '/components/basic/input' },
          { key: 'select', label: 'Select 选择器', path: '/components/basic/select' },
          { key: 'form', label: 'Form 表单', path: '/components/basic/form' },
          { key: 'table', label: 'Table 表格', path: '/components/basic/table' },
          { key: 'modal', label: 'Modal 弹窗', path: '/components/basic/modal' },
          { key: 'drawer', label: 'Drawer 抽屉', path: '/components/basic/drawer' },
          { key: 'tabs', label: 'Tabs 标签页', path: '/components/basic/tabs' },
          { key: 'card', label: 'Card 卡片', path: '/components/basic/card' },
          { key: 'badge', label: 'Badge 徽标', path: '/components/basic/badge' },
          { key: 'avatar', label: 'Avatar 头像', path: '/components/basic/avatar' },
          { key: 'tooltip', label: 'Tooltip 提示', path: '/components/basic/tooltip' },
          { key: 'popover', label: 'Popover 气泡', path: '/components/basic/popover' },
          { key: 'alert', label: 'Alert 警告', path: '/components/basic/alert' },
          { key: 'toast', label: 'Toast 消息', path: '/components/basic/toast' },
          { key: 'progress', label: 'Progress 进度', path: '/components/basic/progress' },
          { key: 'skeleton', label: 'Skeleton 骨架', path: '/components/basic/skeleton' },
          { key: 'empty', label: 'Empty 空状态', path: '/components/basic/empty' },
          { key: 'result', label: 'Result 结果页', path: '/components/basic/result' },
          { key: 'spin', label: 'Spin 加载', path: '/components/basic/spin' },
          { key: 'pagination', label: 'Pagination 分页', path: '/components/basic/pagination' },
          { key: 'breadcrumb', label: 'Breadcrumb 面包屑', path: '/components/basic/breadcrumb' },
          { key: 'steps', label: 'Steps 步骤条', path: '/components/basic/steps' },
          { key: 'collapse', label: 'Collapse 折叠', path: '/components/basic/collapse' },
          { key: 'divider', label: 'Divider 分割线', path: '/components/basic/divider' },
          { key: 'tag', label: 'Tag 标签', path: '/components/basic/tag' },
          { key: 'typography', label: 'Typography 排版', path: '/components/basic/typography' },
          { key: 'icon', label: 'Icon 图标', path: '/components/basic/icon' },
          { key: 'scroll-area', label: 'ScrollArea 滚动', path: '/components/basic/scroll-area' },
          { key: 'watermark', label: 'Watermark 水印', path: '/components/basic/watermark' },
        ],
      },
      {
        key: 'business',
        label: '业务组件',
        icon: 'Briefcase',
        children: [
          { key: 'date-picker', label: 'DatePicker 日期', path: '/components/business/date-picker' },
          { key: 'time-picker', label: 'TimePicker 时间', path: '/components/business/time-picker' },
          { key: 'date-range', label: 'DateRange 日期范围', path: '/components/business/date-range' },
          { key: 'upload', label: 'Upload 上传', path: '/components/business/upload' },
          { key: 'rich-editor', label: 'RichEditor 富文本', path: '/components/business/rich-editor' },
          { key: 'rate', label: 'Rate 评分', path: '/components/business/rate' },
          { key: 'color-picker', label: 'ColorPicker 颜色', path: '/components/business/color-picker' },
          { key: 'virtual-list', label: 'VirtualList 虚拟列表', path: '/components/business/virtual-list' },
          { key: 'drag', label: 'DragDrop 拖拽', path: '/components/business/drag' },
          { key: 'tree', label: 'Tree 树形', path: '/components/business/tree' },
          { key: 'list', label: 'List 列表', path: '/components/business/list' },
          { key: 'timeline', label: 'Timeline 时间线', path: '/components/business/timeline' },
          { key: 'statistic', label: 'Statistic 统计', path: '/components/business/statistic' },
          { key: 'descriptions', label: 'Descriptions 描述', path: '/components/business/descriptions' },
          { key: 'image', label: 'Image 图片', path: '/components/business/image' },
          { key: 'carousel', label: 'Carousel 轮播', path: '/components/business/carousel' },
          { key: 'qrcode', label: 'QRCode 二维码', path: '/components/business/qrcode' },
          { key: 'anchor', label: 'Anchor 锚点', path: '/components/business/anchor' },
          { key: 'line-chart', label: 'LineChart 折线图', path: '/components/business/line-chart' },
          { key: 'bar-chart', label: 'BarChart 柱状图', path: '/components/business/bar-chart' },
          { key: 'pie-chart', label: 'PieChart 饼图', path: '/components/business/pie-chart' },
          { key: 'area-chart', label: 'AreaChart 面积图', path: '/components/business/area-chart' },
          { key: 'radar-chart', label: 'RadarChart 雷达图', path: '/components/business/radar-chart' },
          { key: 'gauge-chart', label: 'GaugeChart 仪表盘', path: '/components/business/gauge-chart' },
          { key: 'heatmap-chart', label: 'HeatmapChart 热力', path: '/components/business/heatmap-chart' },
          { key: 'stat-card', label: 'StatCard 数值卡片', path: '/components/business/stat-card' },
          { key: 'map', label: 'Map 地图', path: '/components/business/map' },
          { key: 'pro-table', label: 'ProTable 高级表格', path: '/components/business/pro-table' },
          { key: 'pro-form', label: 'ProForm 高级表单', path: '/components/business/pro-form' },
          { key: 'pro-upload', label: 'ProUpload 高级上传', path: '/components/business/pro-upload' },
        ],
      },
    ],
  },
  { key: 'theme', label: '主题配置', icon: 'Palette', path: '/theme' },
]

/** 递归判断菜单项是否与当前路径匹配 */
export function isMenuActive(item: MenuItem, pathname: string): boolean {
  if (item.path) return pathname === item.path || pathname.startsWith(item.path + '/')
  return item.children?.some((c) => isMenuActive(c, pathname)) ?? false
}

/** 递归收集所有有 path 的叶子节点（用于搜索） */
export function flatMenuLeaves(items: MenuItem[]): MenuItem[] {
  return items.flatMap((item) => [
    ...(item.path ? [item] : []),
    ...(item.children ? flatMenuLeaves(item.children) : []),
  ])
}

/** 根据路径查找面包屑链 */
export function findBreadcrumbs(
  items: MenuItem[],
  pathname: string,
  parents: MenuItem[] = [],
): MenuItem[] | null {
  for (const item of items) {
    if (item.path && (pathname === item.path || pathname.startsWith(item.path + '/'))) {
      return [...parents, item]
    }
    if (item.children) {
      const found = findBreadcrumbs(item.children, pathname, [...parents, item])
      if (found) return found
    }
  }
  return null
}
