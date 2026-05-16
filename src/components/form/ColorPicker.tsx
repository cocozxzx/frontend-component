import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react'
import chroma from 'chroma-js'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface ColorObject {
  hex: string
  rgb: { r: number; g: number; b: number; a: number }
  hsl: { h: number; s: number; l: number; a: number }
}

export interface ColorPickerProps {
  value?: string
  onChange?: (color: string, colorObj: ColorObject) => void
  format?: 'hex' | 'rgb' | 'hsl'
  presets?: string[]
  showPresets?: boolean
  showAlpha?: boolean
  disabled?: boolean
  trigger?: ReactNode
  className?: string
}

const DEFAULT_PRESETS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#1890FF', '#52C41A', '#FA8C16', '#722ED1',
]

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

function parseColor(str: string): { h: number; s: number; v: number; a: number } | null {
  try {
    const c = chroma(str)
    const [h, s, v] = c.hsv()
    const a = c.alpha()
    return { h: isNaN(h) ? 0 : h, s: s * 100, v: v * 100, a }
  } catch {
    return null
  }
}

function buildColorObj(h: number, s: number, v: number, a: number): ColorObject {
  const c = chroma.hsv(h, s / 100, v / 100).alpha(a)
  const [r, g, b] = c.rgb()
  const [lh, ls, ll] = c.hsl()
  return {
    hex: a < 1 ? c.hex('rgba') : c.hex(),
    rgb: { r: Math.round(r), g: Math.round(g), b: Math.round(b), a },
    hsl: { h: Math.round(lh ?? 0), s: Math.round(ls * 100), l: Math.round(ll * 100), a },
  }
}

export function ColorPicker({
  value = '#1890FF',
  onChange,
  format = 'hex',
  presets = DEFAULT_PRESETS,
  showPresets = true,
  showAlpha = false,
  disabled = false,
  trigger,
  className,
}: ColorPickerProps) {
  const parsed = parseColor(value) ?? { h: 210, s: 100, v: 100, a: 1 }
  const [hue, setHue] = useState(parsed.h)
  const [sat, setSat] = useState(parsed.s)
  const [val, setVal] = useState(parsed.v)
  const [alpha, setAlpha] = useState(parsed.a)
  const [hexInput, setHexInput] = useState(value)

  const panelRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)
  const alphaRef = useRef<HTMLDivElement>(null)
  const dragging = useRef<'panel' | 'hue' | 'alpha' | null>(null)

  const emit = useCallback((h: number, s: number, v: number, a: number) => {
    const obj = buildColorObj(h, s, v, a)
    setHexInput(obj.hex)
    const out = format === 'rgb'
      ? `rgb(${obj.rgb.r},${obj.rgb.g},${obj.rgb.b})`
      : format === 'hsl'
      ? `hsl(${obj.hsl.h},${obj.hsl.s}%,${obj.hsl.l}%)`
      : obj.hex
    onChange?.(out, obj)
  }, [format, onChange])

  const currentHex = buildColorObj(hue, sat, val, alpha).hex
  const hueColor = `hsl(${hue},100%,50%)`

  // Global mousemove / mouseup for drag
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current === 'panel' && panelRef.current) {
        const { left, top, width, height } = panelRef.current.getBoundingClientRect()
        const s = clamp(((e.clientX - left) / width) * 100, 0, 100)
        const v = clamp((1 - (e.clientY - top) / height) * 100, 0, 100)
        setSat(s); setVal(v)
        emit(hue, s, v, alpha)
      } else if (dragging.current === 'hue' && hueRef.current) {
        const { left, width } = hueRef.current.getBoundingClientRect()
        const h = clamp(((e.clientX - left) / width) * 360, 0, 360)
        setHue(h); emit(h, sat, val, alpha)
      } else if (dragging.current === 'alpha' && alphaRef.current) {
        const { left, width } = alphaRef.current.getBoundingClientRect()
        const a = clamp((e.clientX - left) / width, 0, 1)
        setAlpha(a); emit(hue, sat, val, a)
      }
    }
    const onUp = () => { dragging.current = null }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  }, [hue, sat, val, alpha, emit])

  const handleHexInput = (v: string) => {
    setHexInput(v)
    const p = parseColor(v)
    if (p) { setHue(p.h); setSat(p.s); setVal(p.v); setAlpha(p.a); emit(p.h, p.s, p.v, p.a) }
  }

  const handlePreset = (color: string) => {
    const p = parseColor(color)
    if (!p) return
    setHue(p.h); setSat(p.s); setVal(p.v); setAlpha(p.a)
    setHexInput(color); emit(p.h, p.s, p.v, p.a)
  }

  const startDrag = (type: 'panel' | 'hue' | 'alpha') => (e: React.MouseEvent) => {
    e.preventDefault()
    dragging.current = type
  }

  const defaultTrigger = (
    <div
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-md border border-input px-2 py-1 text-sm hover:bg-muted/50 transition-colors',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <span
        className="h-4 w-4 rounded-sm border border-border shadow-sm"
        style={{ background: currentHex }}
      />
      <span className="tabular-nums text-muted-foreground">{hexInput}</span>
    </div>
  )

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild disabled={disabled}>
          {trigger ?? defaultTrigger}
        </PopoverTrigger>

        <PopoverContent align="start" className="w-64 p-3 space-y-3">
          {/* 2D saturation/brightness panel */}
          <div
            ref={panelRef}
            className="relative h-36 w-full cursor-crosshair select-none rounded-sm overflow-hidden"
            style={{ background: `linear-gradient(to right, white, ${hueColor})` }}
            onMouseDown={startDrag('panel')}
          >
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, black)' }} />
            {/* Indicator */}
            <div
              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md pointer-events-none"
              style={{ left: `${sat}%`, top: `${100 - val}%`, background: currentHex }}
            />
          </div>

          {/* Hue slider */}
          <div
            ref={hueRef}
            className="relative h-3 w-full cursor-pointer select-none rounded-full"
            style={{ background: 'linear-gradient(to right,hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(180,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%))' }}
            onMouseDown={startDrag('hue')}
          >
            <div
              className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md pointer-events-none"
              style={{ left: `${(hue / 360) * 100}%`, background: hueColor }}
            />
          </div>

          {/* Alpha slider */}
          {showAlpha && (
            <div
              ref={alphaRef}
              className="relative h-3 w-full cursor-pointer select-none rounded-full overflow-hidden"
              style={{
                backgroundImage: 'repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%)',
                backgroundSize: '8px 8px',
              }}
              onMouseDown={startDrag('alpha')}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: `linear-gradient(to right, transparent, ${currentHex})` }}
              />
              <div
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md pointer-events-none"
                style={{ left: `${alpha * 100}%`, background: currentHex }}
              />
            </div>
          )}

          {/* HEX input */}
          <div className="flex items-center gap-2">
            <span
              className="h-6 w-6 shrink-0 rounded-sm border border-border"
              style={{ background: currentHex }}
            />
            <Input
              value={hexInput}
              onChange={(e) => handleHexInput(e.target.value)}
              className="h-7 font-mono text-xs"
              placeholder="#000000"
            />
          </div>

          {/* Presets */}
          {showPresets && presets.length > 0 && (
            <div>
              <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">预设颜色</p>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((color) => (
                  <button
                    key={color}
                    type="button"
                    title={color}
                    onClick={() => handlePreset(color)}
                    className={cn(
                      'h-5 w-5 rounded-full border-2 transition-transform hover:scale-110',
                      currentHex.toLowerCase() === color.toLowerCase()
                        ? 'border-foreground shadow-sm'
                        : 'border-transparent',
                    )}
                    style={{ background: color }}
                  />
                ))}
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
