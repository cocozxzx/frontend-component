import { useEffect, useRef, type MutableRefObject, type ReactElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { loadPlugin } from '@/lib/amap'
import { BaseMap, useMap, type BaseMapProps } from './BaseMap'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface MarkerData {
  id: string | number
  lng: number
  lat: number
  title?: string
  info?: ReactNode | string
  icon?: string
  iconSize?: [number, number]
  color?: string
}

interface MarkerLayerProps {
  markers: MarkerData[]
  onMarkerClick?: (marker: MarkerData, e: AMap.MapsEvent) => void
  showInfoWindow: boolean
  fitMarkers: boolean
  clusterEnabled: boolean
}

export interface MarkerMapProps extends BaseMapProps {
  markers: MarkerData[]
  onMarkerClick?: (marker: MarkerData, e: AMap.MapsEvent) => void
  showInfoWindow?: boolean
  fitMarkers?: boolean
  clusterEnabled?: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function destroyClusterer(
  clustererRef: MutableRefObject<AMap.MarkerClusterer | null>,
  markerInstancesRef: MutableRefObject<AMap.Marker[]>,
  map: AMap.Map,
) {
  if (clustererRef.current) {
    try {
      // AMap v2.0 MarkerClusterer: try common cleanup methods
      const c = clustererRef.current as unknown as Record<string, unknown>
      if (typeof c['setMap'] === 'function') (c['setMap'] as (m: null) => void)(null)
      else if (typeof c['clearMarkers'] === 'function') (c['clearMarkers'] as () => void)()
    } catch { /* ignore API differences across AMap versions */ }
    clustererRef.current = null
  }
  if (markerInstancesRef.current.length) {
    map.remove(markerInstancesRef.current)
    markerInstancesRef.current = []
  }
}

// ─── Internal layer — consumes MapContext ──────────────────────────────────────

function MarkerLayer({ markers, onMarkerClick, showInfoWindow, fitMarkers, clusterEnabled }: MarkerLayerProps) {
  const { map } = useMap()
  const markerInstancesRef = useRef<AMap.Marker[]>([])
  const clustererRef = useRef<AMap.MarkerClusterer | null>(null)
  const infoWindowRef = useRef<AMap.InfoWindow | null>(null)

  useEffect(() => {
    if (!map) return

    // Remove previous markers / cluster
    destroyClusterer(clustererRef, markerInstancesRef, map)
    if (!markers.length) return

    const newMarkers = markers.map((data) => {
      let icon: string | AMap.Icon | undefined
      if (data.icon) {
        icon = data.iconSize
          ? new window.AMap.Icon({
              image: data.icon,
              size: new window.AMap.Size(data.iconSize[0], data.iconSize[1]),
              imageSize: new window.AMap.Size(data.iconSize[0], data.iconSize[1]),
            })
          : data.icon
      }

      const marker = new window.AMap.Marker({
        position: [data.lng, data.lat],
        title: data.title,
        ...(icon && { icon }),
      })
      marker.setExtData(data)

      if (showInfoWindow && data.info !== undefined) {
        marker.on('click', (e: AMap.MapsEvent) => {
          const content =
            typeof data.info === 'string'
              ? data.info
              : renderToStaticMarkup(data.info as ReactElement)

          if (!infoWindowRef.current) {
            infoWindowRef.current = new window.AMap.InfoWindow({
              autoMove: true,
              closeWhenClickMap: true,
              offset: new window.AMap.Pixel(0, -30),
            })
          }
          infoWindowRef.current.setContent(content)
          infoWindowRef.current.open(map, e.lnglat)
        })
      }

      if (onMarkerClick) {
        marker.on('click', (e: AMap.MapsEvent) => onMarkerClick(data, e))
      }

      return marker
    })

    markerInstancesRef.current = newMarkers

    if (clusterEnabled) {
      loadPlugin(['AMap.MarkerClusterer'])
        .then(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const opts: any = {
            gridSize: 60,
            renderClusterMarker: (ctx: { count: number; marker: AMap.Marker }) => {
              const size = Math.min(48, 28 + Math.floor(ctx.count / 5) * 4)
              const div = document.createElement('div')
              div.style.cssText = `width:${size}px;height:${size}px;border-radius:50%;background:rgba(24,144,255,0.85);border:2px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:bold;box-shadow:0 2px 8px rgba(0,0,0,.3);cursor:pointer`
              div.textContent = String(ctx.count)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const m = ctx.marker as any
              m.setContent(div)
              m.setOffset(new window.AMap.Pixel(-size / 2, -size / 2))
            },
          }
          clustererRef.current = new window.AMap.MarkerClusterer(map, newMarkers, opts)
        })
        .catch(() => {
          // Fallback: show markers without clustering
          map.add(newMarkers)
        })
    } else {
      map.add(newMarkers)
    }

    if (fitMarkers) {
      map.setFitView(newMarkers)
    }

    return () => {
      destroyClusterer(clustererRef, markerInstancesRef, map)
    }
  }, [map, markers, onMarkerClick, showInfoWindow, fitMarkers, clusterEnabled])

  return null
}

// ─── Public component ──────────────────────────────────────────────────────────

export function MarkerMap({
  markers,
  onMarkerClick,
  showInfoWindow = true,
  fitMarkers = true,
  clusterEnabled = false,
  children,
  ...baseProps
}: MarkerMapProps) {
  return (
    <BaseMap {...baseProps}>
      <MarkerLayer
        markers={markers}
        onMarkerClick={onMarkerClick}
        showInfoWindow={showInfoWindow}
        fitMarkers={fitMarkers}
        clusterEnabled={clusterEnabled}
      />
      {children}
    </BaseMap>
  )
}
