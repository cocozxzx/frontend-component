import { useEffect, useRef, useState, type ReactNode } from 'react'

interface WatermarkConfig {
  content?: string | string[]
  image?: string
  width: number
  height: number
  rotate: number
  opacity: number
  fontSize: number
  fontColor: string
  gap: [number, number]
}

function buildWatermarkUrl(cfg: WatermarkConfig): Promise<string> {
  return new Promise((resolve) => {
    const { width, height, rotate, opacity, fontSize, fontColor, gap, content, image } = cfg
    const canvas = document.createElement('canvas')
    const ratio = window.devicePixelRatio || 1
    const W = (width + gap[0]) * ratio
    const H = (height + gap[1]) * ratio
    canvas.width = W
    canvas.height = H

    const ctx = canvas.getContext('2d')
    if (!ctx) { resolve(''); return }

    ctx.scale(ratio, ratio)
    ctx.globalAlpha = opacity
    ctx.translate((width + gap[0]) / 2, (height + gap[1]) / 2)
    ctx.rotate((rotate * Math.PI) / 180)
    ctx.translate(-(width + gap[0]) / 2, -(height + gap[1]) / 2)

    if (image) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        ctx.drawImage(img, gap[0] / 2, gap[1] / 2, width, height)
        resolve(canvas.toDataURL('image/png'))
      }
      img.onerror = () => resolve('')
      img.src = image
    } else {
      const lines = Array.isArray(content) ? content : content ? [content] : ['Watermark']
      ctx.font = `${fontSize}px sans-serif`
      ctx.fillStyle = fontColor
      const lineH = fontSize + 4
      const totalH = lines.length * lineH
      const startY = gap[1] / 2 + (height - totalH) / 2 + fontSize
      lines.forEach((line, i) => {
        const w = ctx.measureText(line).width
        ctx.fillText(line, gap[0] / 2 + (width - w) / 2, startY + i * lineH)
      })
      resolve(canvas.toDataURL('image/png'))
    }
  })
}

export interface WatermarkProps {
  content?: string | string[]
  image?: string
  width?: number
  height?: number
  rotate?: number
  opacity?: number
  fontSize?: number
  fontColor?: string
  zIndex?: number
  gap?: [number, number]
  children?: ReactNode
  fullscreen?: boolean
}

export function Watermark({
  content = 'Watermark',
  image,
  width = 120,
  height = 64,
  rotate = -22,
  opacity = 0.15,
  fontSize = 14,
  fontColor = 'rgba(0,0,0,0.15)',
  zIndex = 9,
  gap = [100, 100],
  children,
  fullscreen = false,
}: WatermarkProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const wmRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<MutationObserver | null>(null)
  const [bgUrl, setBgUrl] = useState('')

  // Generate watermark image
  useEffect(() => {
    buildWatermarkUrl({ content, image, width, height, rotate, opacity, fontSize, fontColor, gap })
      .then(setBgUrl)
  }, [content, image, width, height, rotate, opacity, fontSize, fontColor, gap])

  // Apply background + MutationObserver tamper protection
  useEffect(() => {
    if (!bgUrl || !wrapperRef.current) return

    const bgValue = `url(${bgUrl})`
    const bgSize = `${width + gap[0]}px ${height + gap[1]}px`

    // Create or update watermark div
    if (!wmRef.current) {
      wmRef.current = document.createElement('div')
    }
    const wm = wmRef.current
    Object.assign(wm.style, {
      position: fullscreen ? 'fixed' : 'absolute',
      inset: '0',
      pointerEvents: 'none',
      zIndex: String(zIndex),
      backgroundImage: bgValue,
      backgroundSize: bgSize,
      backgroundRepeat: 'repeat',
    })

    if (!wrapperRef.current.contains(wm)) {
      wrapperRef.current.appendChild(wm)
    }

    // MutationObserver: re-insert if watermark is removed or its style is modified
    observerRef.current?.disconnect()
    observerRef.current = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          for (const node of m.removedNodes) {
            if (node === wm) wrapperRef.current?.appendChild(wm)
          }
        }
        if (m.type === 'attributes' && m.target === wm) {
          wm.style.backgroundImage = bgValue
          wm.style.backgroundSize = bgSize
        }
      }
    })
    observerRef.current.observe(wrapperRef.current, {
      childList: true,
      subtree: false,
      attributes: true,
      attributeFilter: ['style'],
    })

    return () => {
      observerRef.current?.disconnect()
      observerRef.current = null
    }
  }, [bgUrl, fullscreen, zIndex, width, height, gap])

  // Cleanup on unmount
  useEffect(() => () => {
    observerRef.current?.disconnect()
    wmRef.current?.remove()
  }, [])

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={fullscreen ? { position: 'fixed', inset: 0, pointerEvents: 'none', zIndex } : undefined}
    >
      {children}
    </div>
  )
}
