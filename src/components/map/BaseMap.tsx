import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/stores/useAppStore'
import { loadAMap, loadPlugin, AMAP_KEY, DEFAULT_CENTER, DEFAULT_ZOOM, resolveIsDark } from '@/lib/amap'
import { cn } from '@/lib/utils'

// ─── Context ───────────────────────────────────────────────────────────────────

interface MapContextValue {
  map: AMap.Map | null
}

export const MapContext = createContext<MapContextValue>({ map: null })
export const useMap = () => useContext(MapContext)

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface BaseMapProps {
  mapKey?: string
  center?: [number, number]
  zoom?: number
  minZoom?: number
  maxZoom?: number
  mapStyle?: string
  showScale?: boolean
  showToolbar?: boolean
  dragEnable?: boolean
  scrollWheel?: boolean
  onMapLoad?: (map: AMap.Map) => void
  onMapClick?: (e: AMap.MapsEvent) => void
  height?: string | number
  width?: string | number
  loading?: boolean
  children?: ReactNode
  className?: string
}

const DARK_STYLE = 'amap://styles/dark'
const NORMAL_STYLE = 'amap://styles/normal'

// ─── Component ─────────────────────────────────────────────────────────────────

export function BaseMap({
  mapKey = AMAP_KEY,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  minZoom,
  maxZoom,
  mapStyle,
  showScale = false,
  showToolbar = false,
  dragEnable = true,
  scrollWheel = true,
  onMapLoad,
  onMapClick,
  height = '400px',
  width = '100%',
  loading: externalLoading,
  children,
  className,
}: BaseMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<AMap.Map | null>(null)
  const [sdkLoading, setSdkLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { colorMode } = useAppStore()

  const h = typeof height === 'number' ? `${height}px` : height
  const w = typeof width === 'number' ? `${width}px` : width

  // Init map — re-runs only when mapKey changes
  useEffect(() => {
    if (!mapKey) {
      setError('未配置高德地图 Key（VITE_AMAP_KEY），请在 .env 中添加该变量')
      setSdkLoading(false)
      return
    }

    let mounted = true

    loadAMap(mapKey)
      .then((AMapSDK) => {
        if (!mounted || !containerRef.current) return

        const dark = resolveIsDark(colorMode)
        const resolvedStyle = mapStyle ?? (dark ? DARK_STYLE : undefined)

        const map = new AMapSDK.Map(containerRef.current, {
          center,
          zoom,
          ...(minZoom !== undefined && { minZoom }),
          ...(maxZoom !== undefined && { maxZoom }),
          ...(resolvedStyle && { mapStyle: resolvedStyle }),
          dragEnable,
          scrollWheel,
        })

        const controlPlugins: string[] = []
        if (showScale) controlPlugins.push('AMap.Scale')
        if (showToolbar) controlPlugins.push('AMap.ToolBar')

        if (controlPlugins.length) {
          loadPlugin(controlPlugins).then(() => {
            if (!mounted) return
            if (showScale) map.addControl(new AMapSDK.Scale())
            if (showToolbar) map.addControl(new AMapSDK.ToolBar())
          }).catch(() => {/* controls are non-critical */})
        }

        if (onMapClick) map.on('click', onMapClick)

        setMapInstance(map)
        setSdkLoading(false)
        onMapLoad?.(map)
      })
      .catch((e: Error) => {
        if (mounted) {
          setError(e.message)
          setSdkLoading(false)
        }
      })

    return () => {
      mounted = false
    }
    // center/zoom/dragEnable etc. are map init options; changes after mount are handled separately
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapKey])

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      setMapInstance((prev) => {
        prev?.destroy()
        return null
      })
    }
  }, [])

  // Sync dark/light style when colorMode changes (or mapInstance becomes available)
  useEffect(() => {
    if (!mapInstance) return
    if (mapStyle) return // explicit style prop takes precedence
    const dark = resolveIsDark(colorMode)
    mapInstance.setMapStyle(dark ? DARK_STYLE : NORMAL_STYLE)
  }, [colorMode, mapStyle, mapInstance])

  const loading = externalLoading ?? sdkLoading

  return (
    <MapContext.Provider value={{ map: mapInstance }}>
      <div className={cn('relative overflow-hidden', className)} style={{ width: w, height: h }}>
        {/* Map container — always in DOM so AMap has a mount target */}
        <div ref={containerRef} className="w-full h-full" />

        {/* Loading overlay */}
        {loading && (
          <Skeleton className="absolute inset-0 rounded-none z-10" />
        )}

        {/* Error overlay */}
        {error && !loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted">
            <p className="text-sm text-muted-foreground px-4 text-center">{error}</p>
          </div>
        )}

        {/* Children rendered after map is ready (they use useMap() to get the instance) */}
        {!loading && !error && children}
      </div>
    </MapContext.Provider>
  )
}
