import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/router/routes'

// ─── Icon mark colors per category ─────────────────────────────────────────────

const MARK_STYLES = [
  { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' },
  { bg: 'bg-violet-500/10', text: 'text-violet-500', border: 'border-violet-500/20' },
  { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' },
  { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/20' },
  { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20' },
  { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500/20' },
  { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
  { bg: 'bg-pink-500/10', text: 'text-pink-500', border: 'border-pink-500/20' },
  { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500/20' },
  { bg: 'bg-teal-500/10', text: 'text-teal-500', border: 'border-teal-500/20' },
  { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20' },
  { bg: 'bg-lime-500/10', text: 'text-lime-500', border: 'border-lime-500/20' },
]

function markStyle(index: number) {
  return MARK_STYLES[index % MARK_STYLES.length]
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

// ─── Card ───────────────────────────────────────────────────────────────────────

function CompCard({ item, index }: { item: CompItem; index: number }) {
  const style = markStyle(index)
  return (
    <Link
      to={item.route}
      className={cn(
        'group relative flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-4',
        'transition-all duration-200 hover:-translate-y-0.5',
      )}
      style={{ boxShadow: 'var(--shadow-card)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card-hover)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)' }}
    >
      <div className="flex items-center justify-between">
        {/* Icon mark */}
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold', style.bg, style.text, style.border)}>
          {item.name.charAt(0)}
        </div>
        <ArrowUpRight
          size={14}
          className="text-muted-foreground/30 transition-all group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>

      <div>
        <p className="text-[13px] font-semibold leading-tight">{item.name}</p>
        <p className="text-[11px] text-muted-foreground/70 mt-0.5">{item.en}</p>
      </div>

      <p className="text-[12px] text-muted-foreground leading-relaxed flex-1 line-clamp-2">
        {item.desc}
      </p>
    </Link>
  )
}

// ─── Section ────────────────────────────────────────────────────────────────────

function CompSection({ title, badge, items, colorOffset = 0 }: {
  title: string
  badge: string
  items: CompItem[]
  colorOffset?: number
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <span
          className="inline-flex h-5 w-1 rounded-full shrink-0"
          style={{ background: 'linear-gradient(180deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.3) 100%)' }}
        />
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
        <span className="rounded-full bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary/70">
          {badge}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {items.map((item, i) => (
          <CompCard key={item.route} item={item} index={colorOffset + i} />
        ))}
      </div>
    </section>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function ComponentsIndexPage() {
  return (
    <div className="p-6 space-y-10 max-w-[1400px] mx-auto">
      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight" style={{ letterSpacing: '-0.02em' }}>
          组件库
        </h1>
        <p className="text-[14px] text-muted-foreground leading-relaxed max-w-xl">
          覆盖 60 个高频业务场景的完整组件体系，基于 shadcn/ui + Radix UI + Tailwind CSS 构建。
        </p>
      </div>

      <CompSection
        title="基础组件"
        badge={`${BASIC_COMPONENTS.length} 个`}
        items={BASIC_COMPONENTS}
        colorOffset={0}
      />
      <CompSection
        title="业务组件"
        badge={`${BUSINESS_COMPONENTS.length} 个`}
        items={BUSINESS_COMPONENTS}
        colorOffset={BASIC_COMPONENTS.length}
      />
    </div>
  )
}
