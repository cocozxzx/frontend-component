import { useEffect, useRef, type ReactNode } from 'react'
import QRCodeLib from 'qrcode'
import { RefreshCw, Download } from 'lucide-react'
import { Spin } from '@/components/ui/spin'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface QRCodeProps {
  value: string
  size?: number
  color?: string
  bgColor?: string
  errorLevel?: 'L' | 'M' | 'Q' | 'H'
  icon?: string
  iconSize?: number
  iconBorderRadius?: number
  bordered?: boolean
  status?: 'active' | 'expired' | 'loading'
  expiredText?: string
  onRefresh?: () => void
  downloadFilename?: string
  className?: string
}

export function QRCode({
  value,
  size = 128,
  color = '#000000',
  bgColor = '#FFFFFF',
  errorLevel = 'M',
  icon,
  iconSize,
  iconBorderRadius = 4,
  bordered = true,
  status = 'active',
  expiredText = '二维码已过期',
  onRefresh,
  downloadFilename,
  className,
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    QRCodeLib.toCanvas(canvas, value || ' ', {
      width: size,
      margin: 2,
      color: { dark: color, light: bgColor },
      errorCorrectionLevel: errorLevel,
    }).then(() => {
      if (!icon) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const iSize = iconSize ?? Math.round(size * 0.2)
      const x = (size - iSize) / 2
      const y = (size - iSize) / 2
      const pad = 4

      const img = document.createElement('img')
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        // White background rounded rect
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        if (ctx.roundRect) {
          ctx.roundRect(x - pad, y - pad, iSize + pad * 2, iSize + pad * 2, iconBorderRadius)
        } else {
          ctx.rect(x - pad, y - pad, iSize + pad * 2, iSize + pad * 2)
        }
        ctx.fill()
        ctx.drawImage(img, x, y, iSize, iSize)
      }
      img.src = icon
    })
  }, [value, size, color, bgColor, errorLevel, icon, iconSize, iconBorderRadius])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = downloadFilename ?? 'qrcode.png'
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  return (
    <div className={cn('inline-flex flex-col items-center gap-2', className)}>
      <div
        className={cn(
          'relative inline-block',
          bordered && 'rounded-lg border border-border p-2',
        )}
      >
        <canvas ref={canvasRef} width={size} height={size} />

        {/* Status overlays */}
        {status === 'loading' && (
          <div className="absolute inset-0 flex-center rounded-lg bg-white/80">
            <Spin size="md" spinning />
          </div>
        )}

        {status === 'expired' && (
          <div className="absolute inset-0 flex-center flex-col gap-2 rounded-lg bg-white/90">
            <p className="text-sm text-muted-foreground">{expiredText}</p>
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw size={13} className="mr-1.5" />
                刷新
              </Button>
            )}
          </div>
        )}
      </div>

      {downloadFilename && status === 'active' && (
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download size={13} className="mr-1.5" />
          下载
        </Button>
      )}
    </div>
  )
}
