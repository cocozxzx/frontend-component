import { useState } from 'react'
import { QRCode } from '@/components/display'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'value', type: 'string', required: true, description: '二维码内容（URL 或文本）' },
  { name: 'size', type: 'number', default: '160', description: '二维码尺寸（px）' },
  { name: 'color', type: 'string', default: "'#000000'", description: '前景色（深色部分）' },
  { name: 'bgColor', type: 'string', default: "'#ffffff'", description: '背景色' },
  { name: 'logo', type: 'string', description: '中心 Logo 图片 URL' },
  { name: 'logoSize', type: 'number', default: '40', description: 'Logo 尺寸（px）' },
  { name: 'status', type: "'active' | 'loading' | 'expired'", default: "'active'", description: '二维码状态' },
  { name: 'onRefresh', type: '() => void', description: '过期状态下点击刷新的回调' },
  { name: 'errorLevel', type: "'L' | 'M' | 'Q' | 'H'", default: "'M'", description: '容错级别（越高容错越强，码越密）' },
  { name: 'downloadName', type: 'string', description: '下载时的文件名' },
]

export default function QRCodePage() {
  const [expired, setExpired] = useState(false)
  const [size, setSize] = useState(160)

  const handleExpire = () => setExpired(true)
  const handleRefresh = () => {
    setTimeout(() => setExpired(false), 500)
  }

  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="QRCode 二维码"
        description="基于 qrcode 库，Canvas 渲染，支持自定义颜色、中心 Logo、过期状态、一键下载。"
        tags={['业务组件', '数据展示']}
      />

      <DemoSection title="基础二维码">
        <ComponentDemo
          title="扫码可访问对应 URL"
          code={`<QRCode value="https://example.com" size={160} />`}
        >
          <div className="flex flex-wrap gap-6 items-end">
            <div className="text-center">
              <QRCode value="https://example.com" size={160} />
              <p className="text-xs text-muted-foreground mt-2">https://example.com</p>
            </div>
            <div className="text-center">
              <QRCode value="Hello, QRCode! 中文测试" size={160} />
              <p className="text-xs text-muted-foreground mt-2">中文文本内容</p>
            </div>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="自定义颜色">
        <ComponentDemo
          title="通过 color 和 bgColor 修改前景色和背景色"
          code={`<QRCode value={url} color="#1890ff" bgColor="#e6f7ff" />
<QRCode value={url} color="#52c41a" bgColor="#f6ffed" />
<QRCode value={url} color="#722ed1" bgColor="#f9f0ff" />`}
        >
          <div className="flex flex-wrap gap-6">
            <QRCode value="https://example.com/blue" size={140} color="#1890ff" bgColor="#e6f7ff" />
            <QRCode value="https://example.com/green" size={140} color="#52c41a" bgColor="#f6ffed" />
            <QRCode value="https://example.com/purple" size={140} color="#722ed1" bgColor="#f9f0ff" />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="带 Logo（中心图片）">
        <ComponentDemo
          title="logo 属性传入图片 URL，自动叠加在二维码中心"
          code={`<QRCode
  value="https://example.com"
  logo="https://example.com/logo.png"
  logoSize={40}
  errorLevel="H"  // 带 logo 建议高容错
/>`}
        >
          <QRCode
            value="https://example.com"
            size={180}
            logo="https://api.dicebear.com/7.x/identicon/svg?seed=logo"
            logoSize={44}
            errorLevel="H"
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="过期状态（点击刷新）">
        <ComponentDemo
          title="status='expired' 时显示蒙层和刷新按钮，onRefresh 回调处理刷新逻辑"
          code={`<QRCode
  value={url}
  status={expired ? 'expired' : 'active'}
  onRefresh={() => fetchNewQRCode()}
/>`}
        >
          <div className="flex flex-wrap gap-6 items-end">
            <div>
              <QRCode
                value="https://example.com/refresh"
                size={160}
                status={expired ? 'expired' : 'active'}
                onRefresh={handleRefresh}
              />
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={handleExpire}>模拟过期</Button>
              </div>
            </div>
            <div>
              <QRCode value="https://example.com/loading" size={160} status="loading" />
              <p className="text-xs text-muted-foreground mt-2 text-center">loading 状态</p>
            </div>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="下载二维码">
        <ComponentDemo
          title="downloadName 属性设置文件名，组件内置下载按钮"
          code={`<QRCode value={url} downloadName="my-qrcode" />`}
        >
          <QRCode value="https://example.com/download" size={160} downloadName="example-qrcode" />
          <p className="text-xs text-muted-foreground mt-2">右下角下载按钮（hover 显示）</p>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="不同容错级别">
        <ComponentDemo
          title="L(7%) / M(15%) / Q(25%) / H(30%)，级别越高码越密集但更耐损坏"
          code={`<QRCode value={url} errorLevel="L" />
<QRCode value={url} errorLevel="M" />
<QRCode value={url} errorLevel="H" />`}
        >
          <div className="flex flex-wrap gap-6">
            {(['L', 'M', 'Q', 'H'] as const).map((level) => (
              <div key={level} className="text-center">
                <QRCode value="https://example.com/error-level" size={120} errorLevel={level} />
                <p className="text-xs text-muted-foreground mt-1">容错 {level}</p>
              </div>
            ))}
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="动态尺寸">
        <ComponentDemo
          title="通过 Slider 动态调整二维码尺寸"
          code={`const [size, setSize] = useState(160)
<QRCode value={url} size={size} />`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm w-16">尺寸：{size}px</span>
              <Slider
                className="flex-1 max-w-xs"
                min={80}
                max={300}
                step={10}
                value={[size]}
                onValueChange={([v]) => setSize(v)}
              />
            </div>
            <QRCode value="https://example.com/dynamic" size={size} />
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
