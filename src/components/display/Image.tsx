import {
  useState, useEffect, useRef, useCallback,
  useReducer, createContext, type ReactNode, type CSSProperties,
} from 'react'
import { Eye } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { ImagePreview, ImageGroupContext, useImageGroup } from './ImagePreview'
import { cn } from '@/lib/utils'

// ─── ImagePreviewConfig ───────────────────────────────────────────────────────

export interface ImagePreviewConfig {
  visible?: boolean
  onVisibleChange?: (visible: boolean) => void
  src?: string
  mask?: ReactNode
  maskClassName?: string
}

// ─── Image ────────────────────────────────────────────────────────────────────

export interface ImageProps {
  src: string
  alt?: string
  width?: number | string
  height?: number | string
  fit?: CSSProperties['objectFit']
  lazy?: boolean
  placeholder?: ReactNode
  fallback?: string | ReactNode
  preview?: boolean | ImagePreviewConfig
  borderRadius?: string | number
  className?: string
}

export function Image({
  src,
  alt = '',
  width,
  height,
  fit = 'cover',
  lazy = true,
  placeholder,
  fallback,
  preview = true,
  borderRadius,
  className,
}: ImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [inView, setInView] = useState(!lazy)
  const [hovered, setHovered] = useState(false)
  const [selfVisible, setSelfVisible] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)
  const group = useImageGroup()

  // Register in group
  const groupIndexRef = useRef(-1)
  useEffect(() => {
    if (!group) return
    groupIndexRef.current = group.register(src)
    return () => { if (groupIndexRef.current !== -1) group.unregister(groupIndexRef.current) }
  }, [group, src])

  // IntersectionObserver lazy load
  useEffect(() => {
    if (!lazy || inView) return
    const el = imgRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect() }
    }, { rootMargin: '100px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [lazy, inView])

  const previewEnabled = preview !== false
  const previewCfg: ImagePreviewConfig = typeof preview === 'object' ? preview : {}

  const handleClick = () => {
    if (!previewEnabled) return
    if (group) { group.open(groupIndexRef.current); return }
    if (previewCfg.onVisibleChange) { previewCfg.onVisibleChange(true); return }
    setSelfVisible(true)
  }

  const wStyle: CSSProperties = {
    width, height,
    borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-flex',
  }

  const maskContent = previewCfg.mask ?? (
    <div className="flex-center flex-col gap-1 text-white">
      <Eye size={20} />
      <span className="text-xs">预览</span>
    </div>
  )

  return (
    <>
      <div
        ref={imgRef}
        className={cn('relative overflow-hidden bg-muted', className)}
        style={wStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
      >
        {/* Loading placeholder */}
        {!loaded && !error && (
          placeholder ?? <Skeleton className="absolute inset-0 rounded-none" />
        )}

        {/* Error fallback */}
        {error && (
          typeof fallback === 'string'
            ? <img src={fallback} alt={alt} className="h-full w-full" style={{ objectFit: fit }} />
            : fallback ?? (
              <div className="flex-center h-full w-full bg-muted text-xs text-muted-foreground">
                加载失败
              </div>
            )
        )}

        {/* Actual image */}
        {inView && !error && (
          <img
            src={src}
            alt={alt}
            className={cn('h-full w-full transition-opacity duration-300', loaded ? 'opacity-100' : 'opacity-0')}
            style={{ objectFit: fit }}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        )}

        {/* Preview hover mask */}
        {previewEnabled && loaded && !error && (
          <div
            className={cn(
              'absolute inset-0 flex-center cursor-pointer bg-black/40 transition-opacity duration-200',
              hovered ? 'opacity-100' : 'opacity-0',
              previewCfg.maskClassName,
            )}
          >
            {maskContent}
          </div>
        )}
      </div>

      {/* Self preview (no group) */}
      {!group && (
        <ImagePreview
          visible={previewCfg.visible ?? selfVisible}
          onClose={() => { previewCfg.onVisibleChange?.(false); setSelfVisible(false) }}
          src={previewCfg.src ?? src}
        />
      )}
    </>
  )
}

// ─── ImageGroup ────────────────────────────────────────────────────────────────

export function ImageGroup({ children }: { children: ReactNode }) {
  const images = useRef<string[]>([])
  const [previewState, setPreviewState] = useReducer(
    (_: { visible: boolean; index: number }, next: { visible: boolean; index: number }) => next,
    { visible: false, index: 0 },
  )

  const register = useCallback((src: string) => {
    images.current.push(src)
    return images.current.length - 1
  }, [])

  const unregister = useCallback((index: number) => {
    images.current.splice(index, 1)
  }, [])

  const open = useCallback((index: number) => {
    setPreviewState({ visible: true, index })
  }, [])

  return (
    <ImageGroupContext.Provider value={{ register, unregister, open }}>
      {children}
      <ImagePreview
        visible={previewState.visible}
        onClose={() => setPreviewState({ visible: false, index: previewState.index })}
        src={images.current[previewState.index] ?? ''}
        images={images.current}
        currentIndex={previewState.index}
        onIndexChange={(i) => setPreviewState({ visible: true, index: i })}
      />
    </ImageGroupContext.Provider>
  )
}
