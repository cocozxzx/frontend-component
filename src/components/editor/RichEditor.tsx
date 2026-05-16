import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import UnderlineExtension from '@tiptap/extension-underline'
import TextAlignExtension from '@tiptap/extension-text-align'
import ColorExtension from '@tiptap/extension-color'
import HighlightExtension from '@tiptap/extension-highlight'
import PlaceholderExtension from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { createLowlight } from 'lowlight'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { debounce } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { EditorToolbar, type ToolbarItem } from './EditorToolbar'

const lowlight = createLowlight()
lowlight.register({ javascript, typescript, css, xml, json, python, bash })

export interface RichEditorProps {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
  readonly?: boolean
  minHeight?: string
  maxHeight?: string
  maxLength?: number
  uploadImageFn?: (file: File) => Promise<string>
  toolbar?: ToolbarItem[]
  className?: string
}

export function RichEditor({
  value,
  onChange,
  placeholder = '请输入内容...',
  readonly = false,
  minHeight = '200px',
  maxHeight,
  maxLength,
  uploadImageFn,
  toolbar,
  className,
}: RichEditorProps) {
  const debouncedOnChange = debounce((html: string) => onChange?.(html), 300)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      UnderlineExtension,
      TextAlignExtension.configure({ types: ['heading', 'paragraph'] }),
      ColorExtension,
      HighlightExtension.configure({ multicolor: true }),
      PlaceholderExtension.configure({ placeholder }),
      ...(maxLength ? [CharacterCount.configure({ limit: maxLength })] : []),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: value ?? '',
    editable: !readonly,
    onUpdate: ({ editor: e }) => {
      debouncedOnChange(e.getHTML())
    },
  })

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value, false)
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync editable state
  useEffect(() => {
    editor?.setEditable(!readonly)
  }, [editor, readonly])

  const charCount = editor?.storage.characterCount?.characters?.() ?? 0

  return (
    <div className={cn('rounded-md border border-border bg-background', className)}>
      {!readonly && editor && (
        <EditorToolbar editor={editor} toolbar={toolbar} uploadImageFn={uploadImageFn} />
      )}

      <EditorContent
        editor={editor}
        className={cn(
          'prose prose-sm max-w-none px-4 py-3 focus-within:outline-none',
          'dark:prose-invert',
          '[&_.ProseMirror]:outline-none',
          '[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground',
          '[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
          '[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left',
          '[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none',
          '[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0',
          maxHeight && 'overflow-y-auto',
        )}
        style={{ minHeight, maxHeight: maxHeight ?? undefined }}
      />

      {maxLength && (
        <div className="flex justify-end border-t border-border px-4 py-1.5">
          <span className={cn('text-xs text-muted-foreground', charCount >= maxLength && 'text-destructive')}>
            {charCount} / {maxLength}
          </span>
        </div>
      )}
    </div>
  )
}
