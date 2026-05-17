import { useEffect, useRef, type ReactNode } from 'react'
import { loadPlugin } from '@/lib/amap'
import { BaseMap, useMap, type BaseMapProps } from './BaseMap'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface HeatPoint {
  lng: number
  lat: number
  weight?: number
}

interface HeatMapLayerProps {
  points: HeatPoint[]
  radius: number
  opacity: [number, number]
  gradient?: Record<string, string>
  blur: number
}

export interface HeatMapProps extends BaseMapProps {
  points: HeatPoint[]
  radius?: number
  opacity?: [number, number]
  gradient?: Record<string, string>
  blur?: number
  children?: ReactNode
}

const DEFAULT_GRADIENT: Record<string, string> = {
  '0.4': '#0000ff',
  '0.65': '#00ff00',
  '0.85': '#ffff00',
  '1.0': '#ff0000',
}

// ─── Internal layer — consumes MapContext ──────────────────────────────────────

function HeatMapLayer({ points, radius, opacity, gradient, blur }: HeatMapLayerProps) {
  const { map } = useMap()
  const heatmapRef = useRef<AMap.HeatMap | null>(null)
  // Keep a ref to latest points so plugin callback always uses current data
  const latestPointsRef = useRef<HeatPoint[]>(points)
  latestPointsRef.current = points

  // Init heatmap once when map is ready or options change
  useEffect(() => {
    if (!map) return
    let mounted = true

    loadPlugin(['AMap.HeatMap'])
      .then(() => {
        if (!mounted) return
        if (heatmapRef.current) {
          heatmapRef.current.hide()
          heatmapRef.current = null
        }
        const hm = new window.AMap.HeatMap(map, { radius, opacity, gradient, blur })
        hm.setDataSet({
          data: latestPointsRef.current.map((p) => ({
            lng: p.lng,
            lat: p.lat,
            count: p.weight ?? 1,
          })),
        })
        heatmapRef.current = hm
      })
      .catch(() => {/* plugin load failure is non-critical */})

    return () => {
      mounted = false
      heatmapRef.current?.hide()
      heatmapRef.current = null
    }
  // radius/opacity/gradient/blur are initialization options — recreate heatmap on change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, radius, blur, JSON.stringify(opacity), JSON.stringify(gradient)])

  // Update dataset when points change (heatmap already initialized)
  useEffect(() => {
    if (!heatmapRef.current) return
    heatmapRef.current.setDataSet({
      data: points.map((p) => ({ lng: p.lng, lat: p.lat, count: p.weight ?? 1 })),
    })
  }, [points])

  return null
}

// ─── Public component ──────────────────────────────────────────────────────────

export function HeatMap({
  points,
  radius = 25,
  opacity = [0, 0.8],
  gradient = DEFAULT_GRADIENT,
  blur = 35,
  children,
  ...baseProps
}: HeatMapProps) {
  return (
    <BaseMap {...baseProps}>
      <HeatMapLayer
        points={points}
        radius={radius}
        opacity={opacity}
        gradient={gradient}
        blur={blur}
      />
      {children}
    </BaseMap>
  )
}
