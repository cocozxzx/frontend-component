import { useEffect, useRef, type ReactElement, type ReactNode } from 'react'
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

// ─── Internal layer — consumes MapContext ──────────────────────────────────────

function MarkerLayer({ markers, onMarkerClick, showInfoWindow, fitMarkers, clusterEnabled }: MarkerLayerProps) {
  const { map } = useMap()
  const markerInstancesRef = useRef<AMap.Marker[]>([])
  const clustererRef = useRef<AMap.MarkerClusterer | null>(null)
  const infoWindowRef = useRef<AMap.InfoWindow | null>(null)

  useEffect(() => {
    if (!map) return

    // Remove previous markers / cluster
    if (clustererRef.current) {
      clustererRef.current.clearMarkers()
      clustererRef.current = null
    }
    if (markerInstancesRef.current.length) {
      map.remove(markerInstancesRef.current)
      markerInstancesRef.current = []
    }
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
          clustererRef.current = new window.AMap.MarkerClusterer(map, newMarkers, { gridSize: 60 })
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
      if (clustererRef.current) {
        clustererRef.current.clearMarkers()
        clustererRef.current = null
      }
      if (markerInstancesRef.current.length) {
        map.remove(markerInstancesRef.current)
        markerInstancesRef.current = []
      }
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
