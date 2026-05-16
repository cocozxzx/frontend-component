import {
  useRef, useState, useCallback, type DragEvent, type ChangeEvent,
} from 'react'
import axios from 'axios'
import {
  Upload, X, FileText, File, Eye, Loader2, CheckCircle2, AlertCircle,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { generateId } from '@/lib/utils'
import { formatFileSize } from '@/lib/utils'
import { toast } from '@/hooks/useToast'

export interface UploadFile {
  uid: string
  name: string
  size?: number
  type?: string
  status: 'uploading' | 'done' | 'error' | 'removed'
  percent?: number
  url?: string
  thumbUrl?: string
  error?: string
  originFile?: File
}

export interface AppUploadProps {
  value?: UploadFile[]
  onChange?: (files: UploadFile[]) => void
  action?: string
  uploadFn?: (file: File, onProgress: (percent: number) => void) => Promise<string>
  accept?: string
  maxCount?: number
  maxSize?: number
  multiple?: boolean
  drag?: boolean
  listType?: 'text' | 'picture' | 'picture-card'
  disabled?: boolean
  beforeUpload?: (file: File) => boolean | Promise<boolean>
  onRemove?: (file: UploadFile) => boolean | Promise<boolean>
  className?: string
}

function getFileIcon(file: UploadFile) {
  const type = file.type ?? ''
  if (type.startsWith('image/')) return null
  if (type.includes('pdf') || type.includes('text')) return <FileText size={20} />
  return <File size={20} />
}

function isImageFile(file: UploadFile) {
  return file.type?.startsWith('image/') || /\.(png|jpg|jpeg|gif|webp|svg|bmp)$/i.test(file.name)
}

export function AppUpload({
  value,
  onChange,
  action,
  uploadFn,
  accept,
  maxCount,
  maxSize = 10,
  multiple = false,
  drag = false,
  listType = 'text',
  disabled = false,
  beforeUpload,
  onRemove,
  className,
}: AppUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [internalFiles, setInternalFiles] = useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const files = value ?? internalFiles

  const setFiles = useCallback(
    (next: UploadFile[] | ((prev: UploadFile[]) => UploadFile[])) => {
      const resolved = typeof next === 'function' ? next(files) : next
      if (value === undefined) setInternalFiles(resolved)
      onChange?.(resolved)
    },
    [files, value, onChange],
  )

  const updateFile = (uid: string, patch: Partial<UploadFile>) => {
    setFiles((prev) => prev.map((f) => (f.uid === uid ? { ...f, ...patch } : f)))
  }

  const doUpload = useCallback(
    async (file: File) => {
      const uid = generateId('upload_')
      const isImg = file.type.startsWith('image/')
      const thumbUrl = isImg ? URL.createObjectURL(file) : undefined

      const newFile: UploadFile = {
        uid, name: file.name, size: file.size, type: file.type,
        status: 'uploading', percent: 0, thumbUrl, originFile: file,
      }

      setFiles((prev) => [...prev, newFile])

      const onProgress = (percent: number) =>
        updateFile(uid, { percent: Math.min(99, percent) })

      try {
        let url: string
        if (uploadFn) {
          url = await uploadFn(file, onProgress)
        } else if (action) {
          const formData = new FormData()
          formData.append('file', file)
          const resp = await axios.post<{ url?: string; data?: { url?: string } }>(action, formData, {
            onUploadProgress: (e) => {
              if (e.total) onProgress(Math.round((e.loaded / e.total) * 100))
            },
          })
          url = resp.data.url ?? resp.data.data?.url ?? ''
        } else {
          // No upload mechanism — just mark as done with object URL
          url = thumbUrl ?? ''
        }
        updateFile(uid, { status: 'done', percent: 100, url })
      } catch (err) {
        updateFile(uid, { status: 'error', error: String(err) })
      }
    },
    [uploadFn, action, setFiles],
  )

  const handleFiles = useCallback(
    async (rawFiles: FileList | File[]) => {
      const fileArr = Array.from(rawFiles)
      const active = files.filter((f) => f.status !== 'removed')

      for (const file of fileArr) {
        if (maxSize && file.size > maxSize * 1024 * 1024) {
          toast.error(`文件 "${file.name}" 超出大小限制（最大 ${maxSize} MB）`)
          continue
        }
        if (maxCount && active.length >= maxCount) {
          toast.error(`最多只能上传 ${maxCount} 个文件`)
          break
        }

        if (beforeUpload) {
          const allow = await beforeUpload(file)
          if (!allow) continue
        }

        await doUpload(file)
      }
    },
    [files, maxSize, maxCount, beforeUpload, doUpload],
  )

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files)
    e.target.value = ''
  }

  const handleRemove = async (file: UploadFile) => {
    if (onRemove) {
      const allow = await onRemove(file)
      if (!allow) return
    }
    setFiles((prev) => prev.map((f) => f.uid === file.uid ? { ...f, status: 'removed' } : f))
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }
  const handleDragLeave = () => setIsDragging(false)
  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!disabled && e.dataTransfer.files) handleFiles(e.dataTransfer.files)
  }

  const visibleFiles = files.filter((f) => f.status !== 'removed')
  const canAdd = !maxCount || visibleFiles.length < maxCount

  // ─── Trigger / upload area ────────────────────────────────────────────────

  const TriggerArea = () => (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors',
        drag ? 'min-h-32 gap-2 py-6' : 'h-9 flex-row gap-2 px-4',
        isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/60',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <Upload size={drag ? 24 : 16} className="text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        {drag ? '拖拽文件至此，或点击上传' : '点击上传'}
      </span>
      {drag && <span className="text-xs text-muted-foreground/60">支持 {accept ?? '所有文件'}</span>}
    </div>
  )

  // ─── Text / Picture list ──────────────────────────────────────────────────

  const FileListText = () => (
    <div className="mt-2 space-y-1">
      {visibleFiles.map((file) => (
        <div key={file.uid} className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
          {listType === 'picture' && (
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded">
              {isImageFile(file) && file.thumbUrl ? (
                <img src={file.thumbUrl} alt={file.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex-center h-full bg-muted text-muted-foreground">{getFileIcon(file)}</div>
              )}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {listType === 'text' && <File size={14} className="shrink-0 text-muted-foreground" />}
              <span className="truncate text-sm">{file.name}</span>
              {file.size && (
                <span className="shrink-0 text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
              )}
              {file.status === 'done' && <CheckCircle2 size={13} className="shrink-0 text-success" />}
              {file.status === 'error' && <AlertCircle size={13} className="shrink-0 text-destructive" />}
              {file.status === 'uploading' && <Loader2 size={13} className="shrink-0 animate-spin text-primary" />}
            </div>
            {file.status === 'uploading' && (
              <Progress value={file.percent ?? 0} className="mt-1 h-1" />
            )}
            {file.status === 'error' && file.error && (
              <p className="text-xs text-destructive">{file.error}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleRemove(file)}
            className="shrink-0 text-muted-foreground/60 hover:text-destructive"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )

  // ─── Picture-card grid ────────────────────────────────────────────────────

  if (listType === 'picture-card') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={handleInputChange} />

        {visibleFiles.map((file) => (
          <div
            key={file.uid}
            className="group relative h-20 w-20 overflow-hidden rounded-md border border-border bg-muted"
          >
            {isImageFile(file) && file.thumbUrl ? (
              <img src={file.thumbUrl} alt={file.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex-center h-full flex-col gap-1 text-muted-foreground">
                {getFileIcon(file) ?? <File size={20} />}
                <span className="w-16 truncate text-center text-[10px]">{file.name}</span>
              </div>
            )}

            {file.status === 'uploading' && (
              <div className="absolute inset-0 flex-center flex-col gap-1 bg-black/50">
                <Loader2 size={16} className="animate-spin text-white" />
                <span className="text-xs text-white">{file.percent ?? 0}%</span>
              </div>
            )}

            {file.status !== 'uploading' && (
              <div className="absolute inset-0 hidden flex-center gap-2 bg-black/50 group-hover:flex">
                {isImageFile(file) && (file.thumbUrl || file.url) && (
                  <button
                    type="button"
                    onClick={() => setPreviewUrl(file.url ?? file.thumbUrl ?? null)}
                    className="text-white hover:text-primary"
                  >
                    <Eye size={16} />
                  </button>
                )}
                <button type="button" onClick={() => handleRemove(file)} className="text-white hover:text-destructive">
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        ))}

        {canAdd && !disabled && (
          <div
            onClick={() => inputRef.current?.click()}
            className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
          >
            <Upload size={18} />
            <span className="text-xs">上传</span>
          </div>
        )}

        {/* Preview dialog */}
        <Dialog open={!!previewUrl} onOpenChange={(o) => !o && setPreviewUrl(null)}>
          <DialogContent className="max-w-3xl p-2">
            {previewUrl && (
              <img src={previewUrl} alt="preview" className="max-h-[80vh] w-full object-contain" />
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // ─── Text / Picture mode ──────────────────────────────────────────────────

  return (
    <div className={cn('w-full', className)}>
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={handleInputChange} />
      {canAdd && <TriggerArea />}
      {visibleFiles.length > 0 && <FileListText />}
    </div>
  )
}
