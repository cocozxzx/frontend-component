import { useReducer, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import {
  ZoomIn, ZoomOut, RotateCounterClockwise, RotateCw,
  Download, X, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ─── State ────────────────────────────────────────────────────────────────────

interface PreviewState {
  scale: number
  rotate: number
  translateX: number
  translateY: number
  isDragging: boolean
  dragStartX: number
  dragStartY: number
  initTX: number
  initTY: number
}

type Action =
  | { type: 'ZOOM_IN' }
  | { type: 'ZOOM_OUT' }
  | { type: 'SET_SCALE'; scale: number }
  | { type: 'ROTATE_LEFT' }
  | { type: 'ROTATE_RIGHT' }
  | { type: 'DRAG_START'; x: number; y: number }
  | { type: 'DRAG_MOVE'; x: number; y: number }
  | { type: 'DRAG_END' }
  | { type: 'RESET' }

const INIT: PreviewState = { scale: 1, rotate: 0, translateX: 0, translateY: 0, isDragging: false, dragStartX: 0, dragStartY: 0, initTX: 0, initTY: 0 }

function reducer(s: PreviewState, a: Action): PreviewState {
  switch (a.type) {
    case 'ZOOM_IN': return { ...s, scale: Math.min(10, s.scale * 1.25) }
    case 'ZOOM_OUT': return { ...s, scale: Math.max(0.1, s.scale / 1.25) }
    case 'SET_SCALE': return { ...s, scale: Math.max(0.1, Math.min(10, a.scale)) }
    case 'ROTATE_LEFT': return { ...s, rotate: s.rotate - 90 }
    case 'ROTATE_RIGHT': return { ...s, rotate: s.rotate + 90 }
    case 'DRAG_START': return { ...s, isDragging: true, dragStartX: a.x, dragStartY: a.y, initTX: s.translateX, initTY: s.translateY }
    case 'DRAG_MOVE': return s.isDragging
      ? { ...s, translateX: s.initTX + a.x - s.dragStartX, translateY: s.initTY + a.y - s.dragStartY }
      : s
    case 'DRAG_END': return { ...s, isDragging: false }
    case 'RESET': return { ...INIT }
    default: return s
  }
}

// ─── ImagePreview ──────────────────────────────────────────────────────────────

export interface ImagePreviewProps {
  visible: boolean
  onClose: () => void
  src: string
  images?: string[]        // multi-image group
  currentIndex?: number
  onIndexChange?: (i: number) => void
}

export function ImagePreview({ visible, onClose, src, images, currentIndex = 0, onIndexChange }: ImagePreviewProps) {
  const [st, dispatch] = useReducer(reducer, INIT)
  const isGroup = !!images?.length
  const activeSrc = isGroup ? (images![currentIndex] ?? src) : src

  // Reset on image change
  useEffect(() => { dispatch({ type: 'RESET' }) }, [activeSrc])

  // Keyboard
  useEffect(() => {
    if (!visible) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (isGroup) {
        if (e.key === 'ArrowLeft') onIndexChange?.(Math.max(0, currentIndex - 1))
        if (e.key === 'ArrowRight') onIndexChange?.(Math.min(images!.length - 1, currentIndex + 1))
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [visible, isGroup, currentIndex, images, onClose, onIndexChange])

  // Wheel zoom
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    dispatch({ type: 'SET_SCALE', scale: st.scale + delta * st.scale })
  }, [st.scale])

  // Drag
  const onMouseDown = (e: React.MouseEvent) => { e.preventDefault(); dispatch({ type: 'DRAG_START', x: e.clientX, y: e.clientY }) }
  const onMouseMove = (e: React.MouseEvent) => { if (st.isDragging) dispatch({ type: 'DRAG_MOVE', x: e.clientX, y: e.clientY }) }
  const onMouseUp = () => dispatch({ type: 'DRAG_END' })

  // Touch pinch
  let initDist = 0, initScale = 1
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      initDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
      initScale = st.scale
    }
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
      dispatch({ type: 'SET_SCALE', scale: initScale * (dist / initDist) })
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = activeSrc
    link.download = 'image'
    link.click()
  }

  if (!visible) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* Image */}
      <img
        src={activeSrc}
        alt="preview"
        draggable={false}
        className="max-h-[80vh] max-w-[80vw] select-none object-contain transition-transform duration-200"
        style={{
          transform: `translate(${st.translateX}px, ${st.translateY}px) scale(${st.scale}) rotate(${st.rotate}deg)`,
          cursor: st.isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onWheel={onWheel}
      />

      {/* Close */}
      <button type="button" onClick={onClose} className="absolute right-4 top-4 text-white/80 hover:text-white">
        <X size={24} />
      </button>

      {/* Group navigation */}
      {isGroup && images!.length > 1 && (
        <>
          <button
            type="button"
            disabled={currentIndex <= 0}
            onClick={() => onIndexChange?.(currentIndex - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            type="button"
            disabled={currentIndex >= images!.length - 1}
            onClick={() => onIndexChange?.(currentIndex + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white disabled:opacity-30"
          >
            <ChevronRight size={32} />
          </button>
          <p className="absolute bottom-16 left-1/2 -translate-x-1/2 text-sm text-white/70">
            {currentIndex + 1} / {images!.length}
          </p>
        </>
      )}

      {/* Toolbar */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/50 px-3 py-2">
        {[
          { icon: ZoomIn, label: '放大', action: () => dispatch({ type: 'ZOOM_IN' }) },
          { icon: ZoomOut, label: '缩小', action: () => dispatch({ type: 'ZOOM_OUT' }) },
          { icon: RotateCounterClockwise, label: '左旋转', action: () => dispatch({ type: 'ROTATE_LEFT' }) },
          { icon: RotateCw, label: '右旋转', action: () => dispatch({ type: 'ROTATE_RIGHT' }) },
          { icon: Download, label: '下载', action: handleDownload },
        ].map(({ icon: Icon, label, action }) => (
          <button key={label} type="button" title={label} onClick={action} className="flex-center h-8 w-8 rounded-full text-white/80 transition-colors hover:bg-white/20 hover:text-white">
            <Icon size={16} />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  )
}

// ─── ImageGroup context ────────────────────────────────────────────────────────

interface GroupCtx {
  register: (src: string) => number
  unregister: (index: number) => void
  open: (index: number) => void
}

export const ImageGroupContext = createContext<GroupCtx | null>(null)
export const useImageGroup = () => useContext(ImageGroupContext)
