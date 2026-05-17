import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/router/routes'

// ─── Card color palette (fixed per index) ──────────────────────────────────────

const COLORS = [
  'bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-orange-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-amber-500', 'bg-pink-500',
  'bg-indigo-500', 'bg-teal-500', 'bg-red-500', 'bg-lime-500',
]

function cardColor(index: number): string {
  return COLORS[index % COLORS.length]
}

// ─── Component data ─────────────────────────────────────────────────────────────

interface CompItem {
  name: string
  en: string
  desc: string
  route: string
}

const BASIC_COMPONENTS: CompItem[] = [
  { name: 'Button', en: '按钮', desc: '触发操作的基础按钮', route: ROUTES.COMP_BUTTON },
  { name: 'Input', en: '输入框', desc: '单行文本输入', route: ROUTES.COMP_INPUT },
  { name: 'Select', en: '选择器', desc: '下拉选择数据', route: ROUTES.COMP_SELECT },
  { name: 'Form', en: '表单', desc: '数据录入与校验容器', route: ROUTES.COMP_FORM },
  { name: 'Table', en: '表格', desc: '展示结构化数据', route: ROUTES.COMP_TABLE },
  { name: 'Modal', en: '弹窗', desc: '对话框交互', route: ROUTES.COMP_MODAL },
  { name: 'Drawer', en: '抽屉', desc: '侧滑抽屉面板', route: ROUTES.COMP_DRAWER },
  { name: 'Tabs', en: '标签页', desc: '内容切换', route: ROUTES.COMP_TABS },
  { name: 'Card', en: '卡片', desc: '内容容器', route: ROUTES.COMP_CARD },
  { name: 'Badge', en: '徽标', desc: '数字或状态标记', route: ROUTES.COMP_BADGE },
  { name: 'Avatar', en: '头像', desc: '用户头像展示', route: ROUTES.COMP_AVATAR },
  { name: 'Tooltip', en: '文字提示', desc: '悬浮文字提示', route: ROUTES.COMP_TOOLTIP },
  { name: 'Popover', en: '气泡卡片', desc: '悬浮卡片', route: ROUTES.COMP_POPOVER },
  { name: 'Alert', en: '警告', desc: '页内警告信息', route: ROUTES.COMP_ALERT },
  { name: 'Toast', en: '消息', desc: '全局提示消息', route: ROUTES.COMP_TOAST },
  { name: 'Progress', en: '进度条', desc: '任务进度', route: ROUTES.COMP_PROGRESS },
  { name: 'Skeleton', en: '骨架屏', desc: '内容加载占位', route: ROUTES.COMP_SKELETON },
  { name: 'Empty', en: '空状态', desc: '无数据展示', route: ROUTES.COMP_EMPTY },
  { name: 'Result', en: '结果页', desc: '操作结果反馈', route: ROUTES.COMP_RESULT },
  { name: 'Spin', en: '加载中', desc: '加载状态', route: ROUTES.COMP_SPIN },
  { name: 'Pagination', en: '分页', desc: '数据分页', route: ROUTES.COMP_PAGINATION },
  { name: 'Breadcrumb', en: '面包屑', desc: '页面层级导航', route: ROUTES.COMP_BREADCRUMB },
  { name: 'Steps', en: '步骤条', desc: '引导操作步骤', route: ROUTES.COMP_STEPS },
  { name: 'Collapse', en: '折叠面板', desc: '内容折叠展开', route: ROUTES.COMP_COLLAPSE },
  { name: 'Divider', en: '分割线', desc: '内容分隔', route: ROUTES.COMP_DIVIDER },
  { name: 'Tag', en: '标签', desc: '标记和分类', route: ROUTES.COMP_TAG },
  { name: 'Typography', en: '排版', desc: '文字样式规范', route: ROUTES.COMP_TYPOGRAPHY },
  { name: 'Icon', en: '图标', desc: '图标库展示', route: ROUTES.COMP_ICON },
  { name: 'ScrollArea', en: '滚动区域', desc: '自定义滚动条', route: ROUTES.COMP_SCROLL_AREA },
  { name: 'Watermark', en: '水印', desc: '页面水印', route: ROUTES.COMP_WATERMARK },
]

const BUSINESS_COMPONENTS: CompItem[] = [
  { name: 'DatePicker', en: '日期选择', desc: '日期录入', route: ROUTES.COMP_DATE_PICKER },
  { name: 'TimePicker', en: '时间选择', desc: '时间录入', route: ROUTES.COMP_TIME_PICKER },
  { name: 'DateRange', en: '日期范围', desc: '范围日期选择', route: ROUTES.COMP_DATE_RANGE },
  { name: 'Upload', en: '上传', desc: '文件上传', route: ROUTES.COMP_UPLOAD },
  { name: 'RichEditor', en: '富文本', desc: '内容编辑器', route: ROUTES.COMP_RICH_EDITOR },
  { name: 'Rate', en: '评分', desc: '星级评分', route: ROUTES.COMP_RATE },
  { name: 'ColorPicker', en: '颜色', desc: '颜色选择器', route: ROUTES.COMP_COLOR_PICKER },
  { name: 'VirtualList', en: '虚拟列表', desc: '大数据量列表', route: ROUTES.COMP_VIRTUAL_LIST },
  { name: 'DragDrop', en: '拖拽', desc: '拖拽排序', route: ROUTES.COMP_DRAG },
  { name: 'Tree', en: '树形', desc: '层级数据展示', route: ROUTES.COMP_TREE },
  { name: 'List', en: '列表', desc: '数据列表', route: ROUTES.COMP_LIST },
  { name: 'Timeline', en: '时间线', desc: '时序内容', route: ROUTES.COMP_TIMELINE },
  { name: 'Statistic', en: '统计', desc: '数值展示', route: ROUTES.COMP_STATISTIC },
  { name: 'Descriptions', en: '描述', desc: '键值对展示', route: ROUTES.COMP_DESCRIPTIONS },
  { name: 'Image', en: '图片', desc: '图片展示与预览', route: ROUTES.COMP_IMAGE },
  { name: 'Carousel', en: '轮播', desc: '内容轮播', route: ROUTES.COMP_CAROUSEL },
  { name: 'QRCode', en: '二维码', desc: '二维码生成', route: ROUTES.COMP_QRCODE },
  { name: 'Anchor', en: '锚点', desc: '页内导航', route: ROUTES.COMP_ANCHOR },
  { name: 'LineChart', en: '折线图', desc: '趋势数据', route: ROUTES.COMP_LINE_CHART },
  { name: 'BarChart', en: '柱状图', desc: '对比数据', route: ROUTES.COMP_BAR_CHART },
  { name: 'PieChart', en: '饼图', desc: '占比数据', route: ROUTES.COMP_PIE_CHART },
  { name: 'AreaChart', en: '面积图', desc: '趋势面积', route: ROUTES.COMP_AREA_CHART },
  { name: 'RadarChart', en: '雷达图', desc: '多维对比', route: ROUTES.COMP_RADAR_CHART },
  { name: 'GaugeChart', en: '仪表盘', desc: '进度指标', route: ROUTES.COMP_GAUGE_CHART },
  { name: 'HeatmapChart', en: '热力图', desc: '日历热力', route: ROUTES.COMP_HEATMAP_CHART },
  { name: 'StatCard', en: '数值卡片', desc: '关键指标', route: ROUTES.COMP_STAT_CARD },
  { name: 'Map', en: '地图', desc: '地理信息展示', route: ROUTES.COMP_MAP },
  { name: 'ProTable', en: '高级表格', desc: 'Schema 驱动列表', route: ROUTES.COMP_PRO_TABLE },
  { name: 'ProForm', en: '高级表单', desc: 'Schema 驱动表单', route: ROUTES.COMP_PRO_FORM },
  { name: 'ProUpload', en: '高级上传', desc: '裁剪排序上传', route: ROUTES.COMP_PRO_UPLOAD },
]

// ─── Card component ─────────────────────────────────────────────────────────────

function CompCard({ item, colorClass }: { item: CompItem; colorClass: string }) {
  return (
    <Link
      to={item.route}
      className={cn(
        'group flex flex-col gap-3 rounded-xl border bg-card p-5',
        'transition-all duration-200 hover:border-primary hover:shadow-md hover:-translate-y-0.5',
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('w-8 h-8 rounded-lg shrink-0', colorClass)} />
        <div className="min-w-0">
          <p className="font-semibold text-sm leading-tight">{item.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{item.en}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{item.desc}</p>
      <div className="flex items-center gap-1 text-xs text-primary font-medium group-hover:gap-2 transition-all">
        查看详情 <ArrowRight size={12} />
      </div>
    </Link>
  )
}

// ─── Section ────────────────────────────────────────────────────────────────────

function CompSection({
  title,
  items,
  colorOffset = 0,
}: {
  title: string
  items: CompItem[]
  colorOffset?: number
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-[3px] h-5 rounded-full bg-primary shrink-0" />
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm text-muted-foreground">({items.length} 个)</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {items.map((item, i) => (
          <CompCard key={item.route} item={item} colorClass={cardColor(colorOffset + i)} />
        ))}
      </div>
    </section>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function ComponentsIndexPage() {
  return (
    <div className="p-6 space-y-10 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight">组件库</h1>
        <p className="text-muted-foreground text-sm">
          覆盖 60 个高频业务场景的完整组件体系，基于 shadcn/ui + Radix UI + Tailwind CSS 构建。
        </p>
      </div>

      <CompSection title="基础组件" items={BASIC_COMPONENTS} colorOffset={0} />
      <CompSection title="业务组件" items={BUSINESS_COMPONENTS} colorOffset={BASIC_COMPONENTS.length} />
    </div>
  )
}
