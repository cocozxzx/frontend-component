import { Alert, AlertDescription } from '@/components/ui/alert'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import { BaseMap } from '@/components/map/BaseMap'
import { MarkerMap } from '@/components/map/MarkerMap'
import { HeatMap } from '@/components/map/HeatMap'
import type { PropItem } from '@/components/preview'
import type { MarkerData } from '@/components/map/MarkerMap'
import type { HeatPoint } from '@/components/map/HeatMap'

const AMAP_KEY = import.meta.env.VITE_AMAP_KEY as string | undefined

const BASE_MAP_PROPS: PropItem[] = [
  { name: 'center', type: '[number, number]', description: '地图中心坐标 [lng, lat]，默认北京' },
  { name: 'zoom', type: 'number', default: '11', description: '初始缩放级别（3-20）' },
  { name: 'showScale', type: 'boolean', default: 'false', description: '是否显示比例尺' },
  { name: 'showToolbar', type: 'boolean', default: 'false', description: '是否显示工具栏' },
  { name: 'height', type: 'string | number', default: '400', description: '地图容器高度' },
  { name: 'className', type: 'string', description: '容器样式类' },
]

const MARKER_PROPS: PropItem[] = [
  { name: 'markers', type: 'MarkerData[]', required: true, description: '标记点数据' },
  { name: 'clusterEnabled', type: 'boolean', default: 'false', description: '是否开启点聚合' },
  { name: 'onMarkerClick', type: '(marker: MarkerData) => void', description: '标记点点击回调' },
]

const BEIJING_CENTER: [number, number] = [116.397428, 39.90923]

const MARKERS: MarkerData[] = [
  { id: '1', lng: 116.397428, lat: 39.90923, title: '天安门', info: '北京的心脏' },
  { id: '2', lng: 116.3912, lat: 39.9161, title: '故宫', info: '世界最大的宫殿群' },
  { id: '3', lng: 116.3883, lat: 39.9289, title: '景山公园', info: '俯瞰故宫全景' },
  { id: '4', lng: 116.4074, lat: 39.9042, title: '王府井', info: '北京著名商业街' },
]

const CLUSTER_MARKERS: MarkerData[] = Array.from({ length: 30 }, (_, i) => ({
  id: String(i + 1),
  lng: 116.3 + Math.random() * 0.3,
  lat: 39.85 + Math.random() * 0.15,
  title: `标记点 ${i + 1}`,
}))

const HEAT_POINTS: HeatPoint[] = Array.from({ length: 60 }, () => ({
  lng: 116.3 + Math.random() * 0.2,
  lat: 39.85 + Math.random() * 0.12,
  weight: Math.random(),
}))

function KeyWarning() {
  return (
    <Alert className="mb-6">
      <AlertDescription>
        <strong>高德地图 Key 未配置</strong>
        <br />
        地图功能需要配置高德地图 API Key。请在项目根目录创建{' '}
        <code className="font-mono text-xs bg-muted px-1 rounded">.env</code> 文件，添加：
        <br />
        <code className="font-mono text-xs bg-muted px-1 rounded mt-1 block">VITE_AMAP_KEY=your_amap_key_here</code>
      </AlertDescription>
    </Alert>
  )
}

export default function MapPage() {
  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Map 地图"
        description="基于高德地图 JS API v2.0，支持标记点、点聚合、热力图，动态加载 SDK。"
        tags={['业务组件', '地图', '高德地图']}
      />

      {!AMAP_KEY && <KeyWarning />}

      <DemoSection title="基础地图">
        <ComponentDemo
          title="BaseMap 组件，支持 light/dark/system 三种样式"
          code={`<BaseMap center={[116.397428, 39.90923]} zoom={11} height={320} />`}
        >
          <BaseMap center={BEIJING_CENTER} zoom={11} height={320} showScale />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="MarkerMap 标记点">
        <ComponentDemo
          title="支持多个标记点，点击显示信息窗口"
          code={`<MarkerMap
  center={[116.397428, 39.90923]}
  zoom={13}
  markers={markers}
  height={320}
/>`}
        >
          <MarkerMap center={BEIJING_CENTER} zoom={13} markers={MARKERS} height={320} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="点聚合地图">
        <ComponentDemo
          title="clusterEnabled=true 时自动对密集点位进行聚合"
          code={`<MarkerMap markers={markers} clusterEnabled height={320} />`}
        >
          <MarkerMap center={BEIJING_CENTER} zoom={11} markers={CLUSTER_MARKERS} clusterEnabled height={320} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="热力图">
        <ComponentDemo
          title="HeatMap 组件，points 传入坐标+权重数组"
          code={`<HeatMap center={[116.4, 39.9]} points={heatPoints} height={320} />`}
        >
          <HeatMap center={[116.4, 39.9]} points={HEAT_POINTS} height={320} />
        </ComponentDemo>
      </DemoSection>

      <PropsTable title="BaseMap Props" data={BASE_MAP_PROPS} />
      <PropsTable title="MarkerMap 额外 Props" data={MARKER_PROPS} />
    </div>
  )
}
