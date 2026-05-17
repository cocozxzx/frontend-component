// AMap v2.0 global type declarations (subset used by this project)
declare namespace AMap {
  // ─── Primitives ────────────────────────────────────────────────
  class LngLat {
    constructor(lng: number, lat: number)
    getLng(): number
    getLat(): number
  }

  class Size {
    constructor(width: number, height: number)
  }

  class Pixel {
    constructor(x: number, y: number)
  }

  class Icon {
    constructor(opts: { image: string; size?: Size; imageSize?: Size; imageOffset?: Pixel })
  }

  interface MapsEvent {
    lnglat: LngLat
    pixel: { x: number; y: number }
    target: unknown
    type: string
  }

  // ─── Overlay base ──────────────────────────────────────────────
  // Used as a common type for map.add / map.remove / setFitView
  interface Overlay {}

  // ─── Map ───────────────────────────────────────────────────────
  interface MapOptions {
    center?: [number, number] | LngLat
    zoom?: number
    minZoom?: number
    maxZoom?: number
    mapStyle?: string
    dragEnable?: boolean
    scrollWheel?: boolean
    features?: string[]
  }

  class Map {
    constructor(container: string | HTMLElement, opts?: MapOptions)
    destroy(): void
    setCenter(center: [number, number] | LngLat): void
    setZoom(zoom: number): void
    setMapStyle(style: string): void
    setFitView(overlays?: Overlay[], immediately?: boolean, avoid?: number[], maxZoom?: number): void
    add(overlay: Overlay | Overlay[]): void
    remove(overlay: Overlay | Overlay[]): void
    on(event: string, handler: (e: MapsEvent) => void): void
    off(event: string, handler: (e: MapsEvent) => void): void
    addControl(control: Scale | ToolBar): void
  }

  // ─── Marker ────────────────────────────────────────────────────
  interface MarkerOptions {
    position?: [number, number] | LngLat
    title?: string
    icon?: string | Icon
    offset?: Pixel
    map?: Map
  }

  class Marker implements Overlay {
    constructor(opts?: MarkerOptions)
    setMap(map: Map | null): void
    getPosition(): LngLat | null
    on(event: string, handler: (e: MapsEvent) => void): void
    off(event: string, handler: (e: MapsEvent) => void): void
    setExtData(data: unknown): void
    getExtData<T = unknown>(): T
  }

  // ─── InfoWindow ────────────────────────────────────────────────
  interface InfoWindowOptions {
    content?: string | HTMLElement
    offset?: Pixel
    autoMove?: boolean
    closeWhenClickMap?: boolean
    anchor?: string
  }

  class InfoWindow {
    constructor(opts?: InfoWindowOptions)
    open(map: Map, position: [number, number] | LngLat): void
    close(): void
    setContent(content: string | HTMLElement): void
  }

  // ─── Polyline ──────────────────────────────────────────────────
  interface PolylineOptions {
    path?: Array<[number, number] | LngLat>
    strokeColor?: string
    strokeWeight?: number
    strokeOpacity?: number
    strokeStyle?: 'solid' | 'dashed'
    map?: Map
  }

  class Polyline implements Overlay {
    constructor(opts?: PolylineOptions)
    setMap(map: Map | null): void
    on(event: string, handler: (e: MapsEvent) => void): void
    off(event: string, handler: (e: MapsEvent) => void): void
    setExtData(data: unknown): void
    getExtData<T = unknown>(): T
  }

  // ─── Polygon ───────────────────────────────────────────────────
  interface PolygonOptions {
    path?: Array<[number, number] | LngLat>
    strokeColor?: string
    strokeWeight?: number
    fillColor?: string
    fillOpacity?: number
    map?: Map
  }

  class Polygon implements Overlay {
    constructor(opts?: PolygonOptions)
    setMap(map: Map | null): void
    on(event: string, handler: (e: MapsEvent) => void): void
    off(event: string, handler: (e: MapsEvent) => void): void
    setExtData(data: unknown): void
    getExtData<T = unknown>(): T
  }

  // ─── Controls ──────────────────────────────────────────────────
  class Scale {
    constructor(opts?: { position?: string })
  }

  class ToolBar {
    constructor(opts?: { position?: string })
  }

  // ─── HeatMap plugin ────────────────────────────────────────────
  interface HeatMapDataSet {
    data: Array<{ lng: number; lat: number; count?: number }>
    max?: number
  }

  interface HeatMapOptions {
    radius?: number
    opacity?: [number, number]
    gradient?: Record<string, string>
    blur?: number
  }

  class HeatMap {
    constructor(map: Map, opts?: HeatMapOptions)
    setDataSet(data: HeatMapDataSet): void
    show(): void
    hide(): void
  }

  // ─── MarkerClusterer plugin ────────────────────────────────────
  interface MarkerClustererOptions {
    gridSize?: number
    maxZoom?: number
    averageCenter?: boolean
    minimumClusterSize?: number
  }

  class MarkerClusterer {
    constructor(map: Map, markers: Marker[], opts?: MarkerClustererOptions)
    clearMarkers(): void
    addMarkers(markers: Marker[]): void
    removeMarkers(markers: Marker[]): void
  }

  // ─── Plugin loader ─────────────────────────────────────────────
  function plugin(plugins: string | string[], callback: () => void): void
}

interface Window {
  AMap: typeof AMap
}
