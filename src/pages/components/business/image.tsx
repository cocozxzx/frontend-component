import { Image, ImageGroup } from '@/components/display'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'src', type: 'string', required: true, description: '图片 URL' },
  { name: 'alt', type: 'string', description: '图片描述文字' },
  { name: 'width', type: 'number | string', description: '图片宽度' },
  { name: 'height', type: 'number | string', description: '图片高度' },
  { name: 'fit', type: "'contain' | 'cover' | 'fill' | 'none' | 'scale-down'", default: "'cover'", description: 'object-fit 模式' },
  { name: 'lazy', type: 'boolean', default: 'true', description: '是否懒加载（IntersectionObserver）' },
  { name: 'preview', type: 'boolean', default: 'true', description: '是否支持点击预览放大' },
  { name: 'fallback', type: 'ReactNode', description: '加载失败时的占位内容' },
  { name: 'placeholder', type: 'ReactNode', description: '加载中的占位内容' },
  { name: 'className', type: 'string', description: '容器样式类' },
]

const IMAGES = [
  'https://picsum.photos/seed/a/800/600',
  'https://picsum.photos/seed/b/800/600',
  'https://picsum.photos/seed/c/800/600',
  'https://picsum.photos/seed/d/800/600',
  'https://picsum.photos/seed/e/800/600',
  'https://picsum.photos/seed/f/800/600',
]

export default function ImagePage() {
  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Image 图片"
        description="懒加载、点击预览（缩放/旋转/拖拽/下载）、加载失败占位、ImageGroup 多图切换。"
        tags={['业务组件', '媒体展示']}
      />

      <DemoSection title="基础图片（懒加载）">
        <ComponentDemo
          title="图片进入视口才开始加载（IntersectionObserver），加载中显示 Skeleton"
          code={`<Image src="https://picsum.photos/seed/a/800/600" width={300} height={200} alt="示例图片" />`}
        >
          <div className="flex flex-wrap gap-4">
            <Image src={IMAGES[0]} width={280} height={180} alt="示例图片1" />
            <Image src={IMAGES[1]} width={280} height={180} alt="示例图片2" />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="图片预览">
        <ComponentDemo
          title="点击图片弹出全屏预览，支持放大/缩小/旋转/拖拽/下载，按 ESC 关闭"
          code={`<Image src={url} preview />
// 预览工具栏：放大 缩小 旋转 下载 关闭`}
        >
          <div className="flex flex-wrap gap-4">
            {IMAGES.slice(0, 3).map((src, i) => (
              <Image key={i} src={src} width={220} height={160} alt={`预览图 ${i + 1}`} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">点击图片后可缩放、旋转、下载，按 ESC 或点击背景关闭</p>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="加载失败占位">
        <ComponentDemo
          title="src 404 时显示自定义 fallback 内容"
          code={`<Image
  src="https://invalid-url.example/404.jpg"
  width={200} height={160}
  fallback={<div>图片加载失败</div>}
/>`}
        >
          <Image
            src="https://invalid-url.example/404.jpg"
            width={200}
            height={160}
            alt="失败示例"
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="ImageGroup（多图预览）">
        <ComponentDemo
          title="ImageGroup 包裹多张图片，预览时可用左右键或点击箭头切换"
          code={`<ImageGroup>
  {images.map((src, i) => (
    <Image key={i} src={src} width={160} height={120} />
  ))}
</ImageGroup>`}
        >
          <ImageGroup>
            <div className="flex flex-wrap gap-3">
              {IMAGES.map((src, i) => (
                <Image key={i} src={src} width={160} height={120} alt={`相册图 ${i + 1}`} />
              ))}
            </div>
          </ImageGroup>
          <p className="text-xs text-muted-foreground mt-2">点击任一图片进入预览，左右箭头或键盘方向键切换</p>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="不同 fit 模式">
        <ComponentDemo
          title="contain / cover / fill 三种 object-fit 效果对比（固定容器尺寸）"
          code={`<Image src={url} width={200} height={150} fit="contain" />
<Image src={url} width={200} height={150} fit="cover" />
<Image src={url} width={200} height={150} fit="fill" />`}
        >
          <div className="grid grid-cols-3 gap-4">
            {(['contain', 'cover', 'fill'] as const).map((fit) => (
              <div key={fit}>
                <p className="text-xs text-center text-muted-foreground mb-1">fit="{fit}"</p>
                <Image src={IMAGES[0]} width={200} height={150} fit={fit} alt={fit} />
              </div>
            ))}
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
