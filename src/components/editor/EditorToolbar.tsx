import { useRef, useState, type ChangeEvent } from 'react'
import type { Editor } from '@tiptap/react'
import {
  Bold, Italic, Underline, Strikethrough, Code,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code2,
  Link as LinkIcon, ImageIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Highlighter, Trash2, Minus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export type ToolbarItem =
  | 'bold' | 'italic' | 'underline' | 'strike' | 'code'
  | 'h1' | 'h2' | 'h3'
  | 'bulletList' | 'orderedList'
  | 'blockquote' | 'codeBlock'
  | 'link' | 'image'
  | 'textAlign' | 'color' | 'highlight' | 'clear' | '|'

const DEFAULT_TOOLBAR: ToolbarItem[] = [
  'bold', 'italic', 'underline', 'strike', '|',
  'h1', 'h2', 'h3', '|',
  'bulletList', 'orderedList', 'blockquote', 'codeBlock', '|',
  'link', 'image', '|',
  'textAlign', 'highlight', 'clear',
]

interface ToolBtn {
  icon: React.ElementType
  tooltip: string
  active?: boolean
  onClick: () => void
}

function ToolbarButton({ icon: Icon, tooltip, active, onClick }: ToolBtn) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn('h-7 w-7', active && 'bg-muted')}
          onClick={onClick}
        >
          <Icon size={14} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

interface EditorToolbarProps {
  editor: Editor
  toolbar?: ToolbarItem[]
  uploadImageFn?: (file: File) => Promise<string>
}

export function EditorToolbar({ editor, toolbar = DEFAULT_TOOLBAR, uploadImageFn }: EditorToolbarProps) {
  const [linkUrl, setLinkUrl] = useState('')
  const imgInputRef = useRef<HTMLInputElement>(null)

  const handleImageFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (uploadImageFn) {
      const url = await uploadImageFn(file)
      editor.chain().focus().setImage({ src: url }).run()
    } else {
      const url = URL.createObjectURL(file)
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const insertLink = (url: string) => {
    if (!url) { editor.chain().focus().unsetLink().run(); return }
    editor.chain().focus().setLink({ href: url }).run()
    setLinkUrl('')
  }

  const renderItem = (item: ToolbarItem, i: number) => {
    if (item === '|') return <Separator key={`sep-${i}`} orientation="vertical" className="mx-1 h-5" />

    const map: Partial<Record<ToolbarItem, ToolBtn>> = {
      bold: { icon: Bold, tooltip: '粗体', active: editor.isActive('bold'), onClick: () => editor.chain().focus().toggleBold().run() },
      italic: { icon: Italic, tooltip: '斜体', active: editor.isActive('italic'), onClick: () => editor.chain().focus().toggleItalic().run() },
      underline: { icon: Underline, tooltip: '下划线', active: editor.isActive('underline'), onClick: () => editor.chain().focus().toggleUnderline().run() },
      strike: { icon: Strikethrough, tooltip: '删除线', active: editor.isActive('strike'), onClick: () => editor.chain().focus().toggleStrike().run() },
      code: { icon: Code, tooltip: '行内代码', active: editor.isActive('code'), onClick: () => editor.chain().focus().toggleCode().run() },
      h1: { icon: Heading1, tooltip: '标题 1', active: editor.isActive('heading', { level: 1 }), onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
      h2: { icon: Heading2, tooltip: '标题 2', active: editor.isActive('heading', { level: 2 }), onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
      h3: { icon: Heading3, tooltip: '标题 3', active: editor.isActive('heading', { level: 3 }), onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
      bulletList: { icon: List, tooltip: '无序列表', active: editor.isActive('bulletList'), onClick: () => editor.chain().focus().toggleBulletList().run() },
      orderedList: { icon: ListOrdered, tooltip: '有序列表', active: editor.isActive('orderedList'), onClick: () => editor.chain().focus().toggleOrderedList().run() },
      blockquote: { icon: Quote, tooltip: '引用', active: editor.isActive('blockquote'), onClick: () => editor.chain().focus().toggleBlockquote().run() },
      codeBlock: { icon: Code2, tooltip: '代码块', active: editor.isActive('codeBlock'), onClick: () => editor.chain().focus().toggleCodeBlock().run() },
      highlight: { icon: Highlighter, tooltip: '高亮', active: editor.isActive('highlight'), onClick: () => editor.chain().focus().toggleHighlight().run() },
      clear: { icon: Trash2, tooltip: '清除格式', active: false, onClick: () => editor.chain().focus().clearNodes().unsetAllMarks().run() },
    }

    // Special items
    if (item === 'image') {
      return (
        <span key={item}>
          <input ref={imgInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
          <ToolbarButton icon={ImageIcon} tooltip="插入图片" onClick={() => imgInputRef.current?.click()} />
        </span>
      )
    }

    if (item === 'link') {
      return (
        <Popover key={item}>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className={cn('h-7 w-7', editor.isActive('link') && 'bg-muted')}>
              <Tooltip><TooltipTrigger asChild><LinkIcon size={14} /></TooltipTrigger><TooltipContent>链接</TooltipContent></Tooltip>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="start">
            <p className="mb-2 text-xs text-muted-foreground">输入链接地址</p>
            <div className="flex gap-2">
              <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://" className="h-8 text-xs" />
              <Button size="sm" onClick={() => insertLink(linkUrl)}>插入</Button>
            </div>
          </PopoverContent>
        </Popover>
      )
    }

    if (item === 'textAlign') {
      return (
        <span key={item} className="flex">
          {[
            { icon: AlignLeft, align: 'left', tooltip: '左对齐' },
            { icon: AlignCenter, align: 'center', tooltip: '居中' },
            { icon: AlignRight, align: 'right', tooltip: '右对齐' },
            { icon: AlignJustify, align: 'justify', tooltip: '两端对齐' },
          ].map(({ icon: Ic, align, tooltip }) => (
            <ToolbarButton
              key={align}
              icon={Ic}
              tooltip={tooltip}
              active={editor.isActive({ textAlign: align })}
              onClick={() => editor.chain().focus().setTextAlign(align).run()}
            />
          ))}
        </span>
      )
    }

    const btn = map[item]
    if (!btn) return null
    return <ToolbarButton key={item} {...btn} />
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1">
        {toolbar.map((item, i) => renderItem(item, i))}
      </div>
    </TooltipProvider>
  )
}

export { DEFAULT_TOOLBAR }
