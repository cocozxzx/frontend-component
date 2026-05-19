import { Carousel } from '@/components/display'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'
import type { CarouselItem } from '@/components/display'

const PROPS: PropItem[] = [
  { name: 'items', type: 'CarouselItem[]', description: '轮播数据源（与 children 二选一）' },
  { name: 'children', type: 'ReactNode', description: '自定义轮播内容（与 items 二选一）' },
  { name: 'autoplay', type: 'boolean', default: 'false', description: '是否自动播放' },
  { name: 'autoplayInterval', type: 'number', default: '3000', description: '自动播放间隔（ms）' },
  { name: 'loop', type: 'boolean', default: 'true', description: '是否循环播放' },
  { name: 'showDots', type: 'boolean', default: 'true', description: '是否显示底部指示点' },
  { name: 'showArrows', type: 'boolean', default: 'true', description: '是否显示左右箭头' },
  { name: 'slidesPerView', type: 'number', default: '1', description: '每次显示的幻灯片数量' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: '滚动方向' },
  { name: 'spacing', type: 'number', default: '16', description: '幻灯片间距（px）' },
  { name: 'className', type: 'string', description: '容器样式类' },
]

const COLORS = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500']
const TITLES = ['智慧城市管理平台', '工业互联网解决方案', '数字孪生可视化', '能源管理优化']
const DESCS = ['全面感知、智能决策、高效运营', '连接设备、打通数据、赋能生产', '三维建模、实时监控、精准仿真', '节能降耗、绿色生产、智能调度']

const IMAGE_ITEMS: CarouselItem[] = TITLES.map((title, i) => ({
  key: String(i + 1),
  content: (
    <div className={`${COLORS[i]} text-white rounded-xl flex flex-col items-center justify-center h-64`}>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-white/80 text-sm">{DESCS[i]}</p>
    </div>
  ),
}))

const CARD_ITEMS: CarouselItem[] = Array.from({ length: 6 }, (_, i) => ({
  key: String(i + 1),
  content: (
    <div className="border rounded-xl p-4 h-36 flex flex-col justify-center bg-card">
      <h4 className="font-semibold text-sm">目标 {i + 1}</h4>
      <p className="mt-1 text-xs text-muted-foreground">第 {i + 1} 季度核心指标与计划说明</p>
    </div>
  ),
}))

const VERTICAL_ITEMS: CarouselItem[] = TITLES.slice(0, 3).map((title, i) => ({
  key: String(i + 1),
  content: (
    <div className={`${COLORS[i]} text-white rounded-xl flex items-center justify-center h-64`}>
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
  ),
}))

export default function CarouselPage() {
  return (
    <div className="preview-page">
      <PageHeader
        title="Carousel 轮播图"
        description="基于 embla-carousel-react，支持自动播放、多项显示、垂直模式、页面切换动效。"
        tags={['业务组件', '媒体展示']}
      />

      <DemoSection title="基础轮播">
        <ComponentDemo
          title="带箭头和指示点，点击箭头或指示点切换"
          code={`<Carousel items={items} />`}
        >
          <Carousel items={IMAGE_ITEMS} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="自动播放">
        <ComponentDemo
          title="autoplay=true 时每 3s 自动切换，鼠标悬停暂停，页面隐藏时暂停"
          code={`<Carousel items={items} autoplay autoplayInterval={3000} />`}
        >
          <Carousel items={IMAGE_ITEMS} autoplay autoplayInterval={3000} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="多项显示">
        <ComponentDemo
          title="slidesPerView=3 时同时显示 3 张，适合卡片式展示"
          code={`<Carousel items={items} slidesPerView={3} autoplay />`}
        >
          <Carousel items={CARD_ITEMS} slidesPerView={3} autoplay />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="垂直轮播">
        <ComponentDemo
          title="orientation='vertical' 时上下滚动切换"
          code={`<Carousel items={items} orientation="vertical" autoplay />`}
        >
          <div className="max-w-sm">
            <Carousel items={VERTICAL_ITEMS} orientation="vertical" autoplay />
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
