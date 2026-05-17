import { useState } from 'react'
import { Watermark } from '@/components/base/Watermark'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'text', type: 'string | string[]', required: true, description: '水印文字（多行传数组）' },
  { name: 'fontSize', type: 'number', default: '14', description: '字体大小' },
  { name: 'opacity', type: 'number', default: '0.15', description: '透明度（0-1）' },
  { name: 'rotate', type: 'number', default: '-22', description: '旋转角度' },
  { name: 'fullscreen', type: 'boolean', default: 'false', description: '全屏水印（fixed 定位）' },
  { name: 'gap', type: '[number, number]', default: '[100, 100]', description: '水印间距 [x, y]' },
]

export default function WatermarkPage() {
  const [text, setText] = useState('机密文件')
  const [opacity, setOpacity] = useState(0.15)
  const [rotate, setRotate] = useState(-22)
  const [fullscreen, setFullscreen] = useState(false)

  function toggleFullscreen() {
    setFullscreen(true)
    setTimeout(() => setFullscreen(false), 3000)
  }

  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Watermark 水印"
        description="在内容区域添加水印防止截图传播。使用 Canvas 绘制，MutationObserver 防止 DOM 篡改。"
        tags={['基础组件']}
      />

      <DemoSection title="文字水印">
        <ComponentDemo title="基础水印" code={`<Watermark text="内部资料">
  <div className="h-48 border rounded-lg" />
</Watermark>`}>
          <Watermark text="内部资料">
            <div className="h-48 border rounded-lg bg-muted/10 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">受保护的内容区域</p>
            </div>
          </Watermark>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="多行水印">
        <ComponentDemo title="text 传数组实现多行" code={`<Watermark text={['机密文件', 'CONFIDENTIAL', '禁止传播']}>
  <div className="h-48 border rounded-lg" />
</Watermark>`}>
          <Watermark text={['机密文件', 'CONFIDENTIAL', '请勿外传']}>
            <div className="h-48 border rounded-lg bg-muted/10 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">多行水印内容区域</p>
            </div>
          </Watermark>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="自定义参数">
        <ComponentDemo title="交互式调整文字、透明度、角度" code={`<Watermark
  text={text}
  opacity={opacity}
  rotate={rotate}
>
  <div className="h-48" />
</Watermark>`}>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">水印文字</Label>
                <Input value={text} onChange={e => setText(e.target.value)} className="h-8 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">透明度 {opacity.toFixed(2)}</Label>
                <Slider value={[opacity]} onValueChange={([v]) => setOpacity(v)} min={0.05} max={0.5} step={0.01} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">角度 {rotate}°</Label>
                <Slider value={[rotate]} onValueChange={([v]) => setRotate(v)} min={-45} max={0} step={1} />
              </div>
            </div>
            <Watermark text={text} opacity={opacity} rotate={rotate}>
              <div className="h-48 border rounded-lg bg-muted/10 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">动态调整水印参数</p>
              </div>
            </Watermark>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="全屏水印">
        <ComponentDemo title="fullscreen=true（3s 后自动关闭）" code={`<Watermark text="机密文件" fullscreen />`}>
          <div>
            <Button variant="outline" onClick={toggleFullscreen}>
              触发全屏水印（3s）
            </Button>
            {fullscreen && <Watermark text={['机密文件', 'CONFIDENTIAL']} fullscreen opacity={0.1} />}
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
