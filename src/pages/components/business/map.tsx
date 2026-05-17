import { Alert, AlertDescription } from '@/components/ui/alert'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const AMAP_KEY = import.meta.env.VITE_AMAP_KEY as string | undefined

const BASE_MAP_PROPS: PropItem[] = [
  { name: 'center', type: '[number, number]', description: '地图中心坐标 [lng, lat]，默认北京' },
  { name: 'zoom', type: 'number', default: '11', description: '初始缩放级别（3-20）' },
  { name: 'colorMode', type: "'light' | 'dark' | 'system'", default: "'light'", description: '地图样式，system 跟随系统主题' },
  { name: 'showScale', type: 'boolean', default: 'true', description: '是否显示比例尺' },
  { name: 'showToolbar', type: 'boolean', default: 'true', description: '是否显示工具栏' },
  { name: 'height', type: 'string | number', default: '400', description: '地图容器高度' },
  { name: 'className', type: 'string', description: '容器样式类' },
]

const MARKER_PROPS: PropItem[] = [
  { name: 'markers', type: 'MarkerData[]', required: true, description: '标记点数据' },
  { name: 'clusterEnabled', type: 'boolean', default: 'false', description: '是否开启点聚合' },
  { name: 'onMarkerClick', type: '(marker: MarkerData) => void', description: '标记点点击回调' },
]

function KeyWarning() {
  return (
    <Alert className="mb-6">
      <AlertDescription>
        <strong>高德地图 Key 未配置</strong>
        <br />
        地图功能需要配置高德地图 API Key。请在项目根目录创建 <code className="font-mono text-xs bg-muted px-1 rounded">.env.local</code> 文件，添加：
        <br />
        <code className="font-mono text-xs bg-muted px-1 rounded mt-1 block">VITE_AMAP_KEY=your_amap_key_here</code>
        <br />
        在 <a href="https://lbs.amap.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">高德开放平台</a> 免费申请 Web JS API Key（Web端(JS API)类型）。
      </AlertDescription>
    </Alert>
  )
}

function MapDemo({ title, description, code, children }: {
  title: string
  description?: string
  code: string
  children: React.ReactNode
}) {
  if (!AMAP_KEY) {
    return (
      <div className="border rounded-xl p-4 bg-muted/30 text-sm text-muted-foreground text-center py-16">
        请配置 VITE_AMAP_KEY 后查看地图效果
      </div>
    )
  }
  return <>{children}</>
}

export default function MapPage() {
  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Map 地图"
        description="基于高德地图 JS API v2.0，支持标记点、点聚合、热力图、折线/多边形叠加层，动态加载 SDK。"
        tags={['业务组件', '地图', '高德地图']}
      />

      {!AMAP_KEY && <KeyWarning />}

      <DemoSection title="基础地图">
        <ComponentDemo
          title="BaseMap 组件，支持 light/dark/system 三种样式"
          code={`import { BaseMap } from '@/components/map'

<BaseMap
  center={[116.397428, 39.90923]}  // 北京天安门
  zoom={11}
  colorMode="system"               // 跟随系统主题
  height={400}
/>`}
        >
          <MapDemo title="基础地图" code="">
            {/* 实际渲染需要 AMAP_KEY */}
            <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl flex items-center justify-center border">
              <span className="text-muted-foreground text-sm">地图加载区域（已配置 Key 后显示）</span>
            </div>
          </MapDemo>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="MarkerMap 标记点">
        <ComponentDemo
          title="支持多个标记点，点击显示信息窗口，clusterEnabled 开启聚合"
          code={`import { MarkerMap } from '@/components/map'

const markers = [
  { id: '1', position: [116.397428, 39.90923], title: '天安门', content: '北京的心脏' },
  { id: '2', position: [116.404, 39.915], title: '故宫', content: '世界最大的宫殿群' },
]

<MarkerMap
  center={[116.397428, 39.90923]}
  zoom={13}
  markers={markers}
  clusterEnabled={false}
  height={400}
/>`}
        >
          <div className="bg-muted/30 rounded-xl p-4 text-sm font-mono text-muted-foreground">
            {`<MarkerMap\n  center={[116.397428, 39.90923]}\n  markers={markers}  // 10个标记点\n  clusterEnabled={false}\n  height={400}\n/>`}
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="点聚合地图">
        <ComponentDemo
          title="clusterEnabled=true 时自动对密集点位进行聚合，提升性能"
          code={`<MarkerMap
  markers={hundredMarkers}   // 100个随机点
  clusterEnabled={true}
  height={400}
/>`}
        >
          <div className="bg-muted/30 rounded-xl p-4 text-sm font-mono text-muted-foreground">
            {`<MarkerMap\n  markers={randomMarkers}  // 100个随机点\n  clusterEnabled={true}\n  height={400}\n/>`}
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="热力图">
        <ComponentDemo
          title="HeatMap 组件，points 传入坐标+权重数组"
          code={`import { HeatMap } from '@/components/map'

const points = Array.from({ length: 50 }, () => ({
  lng: 116.3 + Math.random() * 0.2,
  lat: 39.85 + Math.random() * 0.1,
  weight: Math.random(),
}))

<HeatMap center={[116.4, 39.9]} points={points} height={400} />`}
        >
          <div className="bg-muted/30 rounded-xl p-4 text-sm font-mono text-muted-foreground">
            {`<HeatMap\n  center={[116.4, 39.9]}\n  points={heatPoints}  // 50个随机热力点\n  height={400}\n/>`}
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable title="BaseMap Props" data={BASE_MAP_PROPS} />
      <PropsTable title="MarkerMap 额外 Props" data={MARKER_PROPS} />
    </div>
  )
}
