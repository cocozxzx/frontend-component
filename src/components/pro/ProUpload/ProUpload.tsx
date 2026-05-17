import {
  useRef, useState, useCallback, type ChangeEvent, type MouseEvent as ReactMouseEvent,
} from 'react'
import { Upload, X, Eye, Loader2, GripVertical, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { DragGrid } from '@/components/advanced/DragGrid'
import { generateId, formatFileSize } from '@/lib/utils'
import { toast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import type { UploadFile } from '@/components/base/AppUpload'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ProUploadProps {
  value?: UploadFile[]
  onChange?: (files: UploadFile[]) => void
  uploadFn: (file: File, onProgress: (percent: number) => void) => Promise<string>
  maxCount?: number
  maxSize?: number
  accept?: string
  multiple?: boolean
  listType?: 'text' | 'picture' | 'picture-card'
  cropable?: boolean
  sortable?: boolean
  previewable?: boolean
  disabled?: boolean
  className?: string
}

// ─── CropDialog (Canvas-based) ─────────────────────────────────────────────────

interface CropRect { x: number; y: number; w: number; h: number }

interface CropDialogProps {
  src: string
  onConfirm: (blob: Blob) => void
  onCancel: () => void
}

function CropDialog({ src, onConfirm, onCancel }: CropDialogProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const CONTAINER_W = 480
  const CONTAINER_H = 320

  const [crop, setCrop] = useState<CropRect>({ x: 60, y: 40, w: 200, h: 150 })
  const [dragging, setDragging] = useState<'move' | 'nw' | 'ne' | 'sw' | 'se' | null>(null)
  const dragStart = useRef({ mx: 0, my: 0, rect: crop })

  function getHitZone(e: ReactMouseEvent, r: CropRect): typeof dragging {
    const el = containerRef.current!.getBoundingClientRect()
    const mx = e.clientX - el.left
    const my = e.clientY - el.top
    const HANDLE = 10
    if (Math.abs(mx - r.x) < HANDLE && Math.abs(my - r.y) < HANDLE) return 'nw'
    if (Math.abs(mx - (r.x + r.w)) < HANDLE && Math.abs(my - r.y) < HANDLE) return 'ne'
    if (Math.abs(mx - r.x) < HANDLE && Math.abs(my - (r.y + r.h)) < HANDLE) return 'sw'
    if (Math.abs(mx - (r.x + r.w)) < HANDLE && Math.abs(my - (r.y + r.h)) < HANDLE) return 'se'
    if (mx > r.x && mx < r.x + r.w && my > r.y && my < r.y + r.h) return 'move'
    return null
  }

  function onMouseDown(e: ReactMouseEvent) {
    const zone = getHitZone(e, crop)
    if (!zone) return
    setDragging(zone)
    dragStart.current = { mx: e.clientX, my: e.clientY, rect: { ...crop } }
    e.preventDefault()
  }

  function onMouseMove(e: ReactMouseEvent) {
    if (!dragging) return
    const dx = e.clientX - dragStart.current.mx
    const dy = e.clientY - dragStart.current.my
    const r = dragStart.current.rect
    const MIN = 40

    setCrop(() => {
      let { x, y, w, h } = r
      if (dragging === 'move') {
        x = Math.max(0, Math.min(CONTAINER_W - w, x + dx))
        y = Math.max(0, Math.min(CONTAINER_H - h, y + dy))
      } else if (dragging === 'nw') {
        x = Math.min(x + dx, r.x + r.w - MIN); y = Math.min(y + dy, r.y + r.h - MIN)
        w = r.w - (x - r.x); h = r.h - (y - r.y)
      } else if (dragging === 'ne') {
        y = Math.min(y + dy, r.y + r.h - MIN)
        w = Math.max(MIN, r.w + dx); h = r.h - (y - r.y)
      } else if (dragging === 'sw') {
        x = Math.min(x + dx, r.x + r.w - MIN)
        w = r.w - (x - r.x); h = Math.max(MIN, r.h + dy)
      } else if (dragging === 'se') {
        w = Math.max(MIN, r.w + dx); h = Math.max(MIN, r.h + dy)
      }
      x = Math.max(0, x); y = Math.max(0, y)
      w = Math.min(w, CONTAINER_W - x); h = Math.min(h, CONTAINER_H - y)
      return { x, y, w, h }
    })
  }

  function onMouseUp() { setDragging(null) }

  function handleConfirm() {
    const img = imgRef.current
    const canvas = canvasRef.current
    if (!img || !canvas) return

    const scaleX = img.naturalWidth / img.width
    const scaleY = img.naturalHeight / img.height

    canvas.width = Math.round(crop.w * scaleX)
    canvas.height = Math.round(crop.h * scaleY)
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(
      img,
      crop.x * scaleX, crop.y * scaleY,
      crop.w * scaleX, crop.h * scaleY,
      0, 0, canvas.width, canvas.height,
    )
    canvas.toBlob((blob) => { if (blob) onConfirm(blob) }, 'image/jpeg', 0.92)
  }

  const handles: Array<{ key: string; style: React.CSSProperties; cursor: string }> = [
    { key: 'nw', style: { top: -5, left: -5 }, cursor: 'nw-resize' },
    { key: 'ne', style: { top: -5, right: -5 }, cursor: 'ne-resize' },
    { key: 'sw', style: { bottom: -5, left: -5 }, cursor: 'sw-resize' },
    { key: 'se', style: { bottom: -5, right: -5 }, cursor: 'se-resize' },
  ]

  return (
    <Dialog open onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="max-w-[560px]">
        <DialogHeader><DialogTitle>裁剪图片</DialogTitle></DialogHeader>
        <div
          ref={containerRef}
          style={{ width: CONTAINER_W, height: CONTAINER_H, position: 'relative', overflow: 'hidden', background: '#000', cursor: dragging ? 'grabbing' : 'default' }}
          className="rounded mx-auto select-none"
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onMouseDown={onMouseDown}
        >
          <img
            ref={imgRef}
            src={src}
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            draggable={false}
          />
          {/* Dark overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', pointerEvents: 'none' }} />
          {/* Crop area */}
          <div
            style={{
              position: 'absolute', left: crop.x, top: crop.y, width: crop.w, height: crop.h,
              border: '2px solid white', boxSizing: 'border-box', cursor: 'move',
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)',
            }}
          >
            {/* Rule-of-thirds grid */}
            {[33.3, 66.6].map((p) => (
              <div key={`h${p}`} style={{ position: 'absolute', left: 0, right: 0, top: `${p}%`, borderTop: '1px dashed rgba(255,255,255,0.4)' }} />
            ))}
            {[33.3, 66.6].map((p) => (
              <div key={`v${p}`} style={{ position: 'absolute', top: 0, bottom: 0, left: `${p}%`, borderLeft: '1px dashed rgba(255,255,255,0.4)' }} />
            ))}
            {/* Corner handles */}
            {handles.map(({ key, style, cursor }) => (
              <div
                key={key}
                style={{
                  position: 'absolute', width: 10, height: 10,
                  background: 'white', borderRadius: 1, cursor,
                  ...style,
                }}
              />
            ))}
          </div>
        </div>
        <canvas ref={canvasRef} className="hidden" />
        <DialogFooter>
          <Button variant="outline" type="button" onClick={onCancel}>取消</Button>
          <Button type="button" onClick={handleConfirm}>确认裁剪</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── File card for picture-card mode ───────────────────────────────────────────

type CardItem = UploadFile & { id: string }

function FileCard({
  file,
  previewable,
  disabled,
  onRemove,
  onPreview,
  sortable,
}: {
  file: CardItem
  previewable: boolean
  disabled: boolean
  onRemove: (uid: string) => void
  onPreview: (url: string) => void
  sortable: boolean
}) {
  const isImg = file.type?.startsWith('image/') || /\.(jpe?g|png|gif|webp|svg)$/i.test(file.name)

  return (
    <div className="group relative w-full aspect-square rounded-lg border border-dashed overflow-hidden bg-muted/30">
      {isImg && (file.thumbUrl ?? file.url) ? (
        <img
          src={file.thumbUrl ?? file.url}
          alt={file.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-1 p-2">
          <span className="text-xs text-muted-foreground truncate max-w-full">{file.name}</span>
        </div>
      )}

      {/* Status overlay */}
      {file.status === 'uploading' && (
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1">
          <Loader2 size={18} className="text-white animate-spin" />
          <Progress value={file.percent} className="w-3/4 h-1" />
        </div>
      )}
      {file.status === 'error' && (
        <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
          <AlertCircle size={18} className="text-destructive" />
        </div>
      )}

      {/* Hover actions */}
      {file.status === 'done' && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          {previewable && (file.url ?? file.thumbUrl) && (
            <button
              type="button"
              className="text-white hover:text-primary-foreground p-1 rounded"
              onClick={() => onPreview(file.url ?? file.thumbUrl ?? '')}
            >
              <Eye size={16} />
            </button>
          )}
          {!disabled && (
            <button
              type="button"
              className="text-white hover:text-destructive-foreground p-1 rounded"
              onClick={() => onRemove(file.uid)}
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Drag handle for sortable */}
      {sortable && (
        <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity text-white">
          <GripVertical size={14} />
        </div>
      )}

      {/* Remove button (always visible for non-done) */}
      {!disabled && file.status !== 'uploading' && file.status !== 'done' && (
        <button
          type="button"
          className="absolute top-1 right-1 bg-background rounded-full p-0.5 shadow hover:text-destructive"
          onClick={() => onRemove(file.uid)}
        >
          <X size={12} />
        </button>
      )}
    </div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────────

export function ProUpload({
  value = [],
  onChange,
  uploadFn,
  maxCount = 9,
  maxSize = 10,
  accept,
  multiple = true,
  listType = 'picture-card',
  cropable = false,
  sortable = false,
  previewable = true,
  disabled = false,
  className,
}: ProUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const cardItems: CardItem[] = value.map((f) => ({ ...f, id: f.uid }))

  // ── Upload a File object ───────────────────────────────────────────────────

  const doUpload = useCallback(async (file: File) => {
    const uid = generateId()
    const thumbUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined

    const newFile: UploadFile = {
      uid, name: file.name, size: file.size, type: file.type,
      status: 'uploading', percent: 0, thumbUrl, originFile: file,
    }

    onChange?.([...value, newFile])

    try {
      const url = await uploadFn(file, (percent) => {
        onChange?.(
          value.concat({ ...newFile, percent }).map((f) =>
            f.uid === uid ? { ...f, percent } : f,
          ),
        )
      })
      onChange?.(
        [...value, newFile].map((f) =>
          f.uid === uid ? { ...f, status: 'done', url, percent: 100 } : f,
        ),
      )
    } catch {
      onChange?.(
        [...value, newFile].map((f) =>
          f.uid === uid ? { ...f, status: 'error' } : f,
        ),
      )
      toast.error(`${file.name} 上传失败`)
    }
  }, [value, onChange, uploadFn])

  // ── Handle file selection ──────────────────────────────────────────────────

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return
    const remaining = maxCount - value.filter((f) => f.status !== 'removed').length

    Array.from(files).slice(0, remaining).forEach((file) => {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        toast.warning(`${file.name} 超过最大大小 ${maxSize}MB`)
        return
      }
      if (cropable && file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file)
        setCropSrc(url)
        setPendingFile(file)
      } else {
        void doUpload(file)
      }
    })
  }, [value, maxCount, maxSize, cropable, doUpload])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    e.target.value = ''
  }

  const handleRemove = (uid: string) => {
    onChange?.(value.filter((f) => f.uid !== uid))
  }

  const handleCropConfirm = useCallback((blob: Blob) => {
    if (!pendingFile || !cropSrc) return
    const croppedFile = new File([blob], pendingFile.name, { type: blob.type })
    setCropSrc(null)
    setPendingFile(null)
    URL.revokeObjectURL(cropSrc)
    void doUpload(croppedFile)
  }, [pendingFile, cropSrc, doUpload])

  const handleCropCancel = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
    setPendingFile(null)
  }

  // ── Add button ─────────────────────────────────────────────────────────────

  const canAdd = !disabled && value.filter((f) => f.status !== 'removed').length < maxCount

  const addButton = canAdd ? (
    <div
      key="__add"
      id="__add"
      className="flex flex-col items-center justify-center w-full aspect-square rounded-lg border-2 border-dashed border-border bg-muted/20 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
      onClick={() => inputRef.current?.click()}
    >
      <Upload size={20} className="text-muted-foreground mb-1" />
      <span className="text-xs text-muted-foreground">上传</span>
    </div>
  ) : null

  // ── Render ─────────────────────────────────────────────────────────────────

  if (listType !== 'picture-card') {
    // Fallback to AppUpload for non-picture-card modes
    return (
      <div className={className}>
        <div className="flex flex-col gap-2">
          {value.map((f) => (
            <div key={f.uid} className="flex items-center gap-2 p-2 border rounded-md text-sm">
              <span className="flex-1 truncate">{f.name}</span>
              {f.size && <span className="text-xs text-muted-foreground">{formatFileSize(f.size)}</span>}
              {f.status === 'uploading' && <Progress value={f.percent} className="w-20 h-1.5" />}
              {f.status === 'error' && <AlertCircle size={14} className="text-destructive" />}
              {!disabled && (
                <button type="button" onClick={() => handleRemove(f.uid)}>
                  <X size={14} className="text-muted-foreground hover:text-destructive" />
                </button>
              )}
            </div>
          ))}
          {canAdd && (
            <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
              <Upload size={14} />
              选择文件
            </Button>
          )}
        </div>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={handleInputChange} />
        {cropSrc && <CropDialog src={cropSrc} onConfirm={handleCropConfirm} onCancel={handleCropCancel} />}
      </div>
    )
  }

  // picture-card mode with optional sortable
  const GRID_COLS = 4
  const GRID_GAP = 12

  const renderCard = (item: CardItem, _index: number, _isDragging: boolean) => (
    <FileCard
      file={item}
      previewable={previewable}
      disabled={disabled}
      onRemove={handleRemove}
      onPreview={(url) => setPreviewUrl(url)}
      sortable={sortable}
    />
  )

  return (
    <div className={className}>
      {sortable && cardItems.length > 0 ? (
        <div>
          <DragGrid
            items={cardItems}
            columns={GRID_COLS}
            gap={GRID_GAP}
            onReorder={(items) => onChange?.(items)}
            renderItem={renderCard}
          />
          {addButton && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                gap: GRID_GAP,
                marginTop: GRID_GAP,
              }}
            >
              {addButton}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gap: GRID_GAP,
          }}
        >
          {cardItems.map((item, i) => (
            <div key={item.uid}>{renderCard(item, i, false)}</div>
          ))}
          {addButton}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Crop dialog */}
      {cropSrc && <CropDialog src={cropSrc} onConfirm={handleCropConfirm} onCancel={handleCropCancel} />}

      {/* Preview dialog */}
      {previewUrl && (
        <Dialog open onOpenChange={(o) => !o && setPreviewUrl(null)}>
          <DialogContent className="max-w-3xl p-2">
            <img src={previewUrl} alt="" className="max-h-[80vh] w-full object-contain rounded" />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
