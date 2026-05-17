import { useEffect, useRef, type ReactNode } from 'react'
import { BaseMap, useMap, type BaseMapProps } from './BaseMap'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface PolylineData {
  id: string | number
  path: Array<[number, number]>
  strokeColor?: string
  strokeWeight?: number
  strokeOpacity?: number
  strokeStyle?: 'solid' | 'dashed'
}

export interface PolygonData {
  id: string | number
  path: Array<[number, number]>
  strokeColor?: string
  fillColor?: string
  fillOpacity?: number
}

interface OverlayLayerProps {
  polylines: PolylineData[]
  polygons: PolygonData[]
  onPolylineClick?: (data: PolylineData) => void
  onPolygonClick?: (data: PolygonData) => void
}

export interface PolylineMapProps extends BaseMapProps {
  polylines?: PolylineData[]
  polygons?: PolygonData[]
  onPolylineClick?: (data: PolylineData) => void
  onPolygonClick?: (data: PolygonData) => void
  children?: ReactNode
}

// ─── Internal layer — consumes MapContext ──────────────────────────────────────

function OverlayLayer({ polylines, polygons, onPolylineClick, onPolygonClick }: OverlayLayerProps) {
  const { map } = useMap()
  const polylineInstancesRef = useRef<AMap.Polyline[]>([])
  const polygonInstancesRef = useRef<AMap.Polygon[]>([])

  useEffect(() => {
    if (!map) return

    // Clear previous overlays
    if (polylineInstancesRef.current.length) {
      map.remove(polylineInstancesRef.current)
      polylineInstancesRef.current = []
    }
    if (polygonInstancesRef.current.length) {
      map.remove(polygonInstancesRef.current)
      polygonInstancesRef.current = []
    }

    const newPolylines = polylines.map((data) => {
      const pl = new window.AMap.Polyline({
        path: data.path,
        strokeColor: data.strokeColor,
        strokeWeight: data.strokeWeight ?? 4,
        strokeOpacity: data.strokeOpacity ?? 0.8,
        strokeStyle: data.strokeStyle ?? 'solid',
      })
      pl.setExtData(data)
      if (onPolylineClick) {
        pl.on('click', () => onPolylineClick(data))
      }
      return pl
    })

    const newPolygons = polygons.map((data) => {
      const pg = new window.AMap.Polygon({
        path: data.path,
        strokeColor: data.strokeColor,
        fillColor: data.fillColor,
        fillOpacity: data.fillOpacity ?? 0.3,
      })
      pg.setExtData(data)
      if (onPolygonClick) {
        pg.on('click', () => onPolygonClick(data))
      }
      return pg
    })

    polylineInstancesRef.current = newPolylines
    polygonInstancesRef.current = newPolygons

    if (newPolylines.length) map.add(newPolylines)
    if (newPolygons.length) map.add(newPolygons)

    return () => {
      if (polylineInstancesRef.current.length) {
        map.remove(polylineInstancesRef.current)
        polylineInstancesRef.current = []
      }
      if (polygonInstancesRef.current.length) {
        map.remove(polygonInstancesRef.current)
        polygonInstancesRef.current = []
      }
    }
  }, [map, polylines, polygons, onPolylineClick, onPolygonClick])

  return null
}

// ─── Public component ──────────────────────────────────────────────────────────

export function PolylineMap({
  polylines = [],
  polygons = [],
  onPolylineClick,
  onPolygonClick,
  children,
  ...baseProps
}: PolylineMapProps) {
  return (
    <BaseMap {...baseProps}>
      <OverlayLayer
        polylines={polylines}
        polygons={polygons}
        onPolylineClick={onPolylineClick}
        onPolygonClick={onPolygonClick}
      />
      {children}
    </BaseMap>
  )
}
