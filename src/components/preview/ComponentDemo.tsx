import { useState, useEffect, useRef, type ReactNode } from 'react'
import { Code, Copy, CheckCheck, ChevronUp } from 'lucide-react'
import { createLowlight } from 'lowlight'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ─── Lowlight setup ────────────────────────────────────────────────────────────

const low = createLowlight()
low.register({ typescript, tsx: typescript, xml, css })

// ─── Hast → HTML string ────────────────────────────────────────────────────────

type HastNode =
  | { type: 'root'; children: HastNode[] }
  | { type: 'element'; tagName: string; properties: Record<string, unknown>; children: HastNode[] }
  | { type: 'text'; value: string }
  | { type: string; [key: string]: unknown }

function escape(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function hastToHtml(node: HastNode): string {
  if (node.type === 'text') return escape((node as { value: string }).value ?? '')

  if (node.type === 'element') {
    const el = node as { tagName: string; properties: Record<string, unknown>; children: HastNode[] }
    const rawClass = el.properties?.className
    const classes = Array.isArray(rawClass) ? rawClass.join(' ') : typeof rawClass === 'string' ? rawClass : ''
    const classAttr = classes ? ` class="${classes}"` : ''
    const inner = (el.children ?? []).map(hastToHtml).join('')
    return `<${el.tagName}${classAttr}>${inner}</${el.tagName}>`
  }

  if (node.type === 'root') {
    return ((node as { children: HastNode[] }).children ?? []).map(hastToHtml).join('')
  }

  return ''
}

function highlight(code: string): string {
  try {
    // Detect language: jsx/tsx files use typescript highlighter
    const result = low.highlight('tsx', code)
    return hastToHtml(result as unknown as HastNode)
  } catch {
    return escape(code)
  }
}

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ComponentDemoProps {
  title: string
  description?: string
  code: string
  children: ReactNode
  defaultShowCode?: boolean
  className?: string
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ComponentDemo({
  title,
  description,
  code,
  children,
  defaultShowCode = false,
  className,
}: ComponentDemoProps) {
  const [showCode, setShowCode] = useState(defaultShowCode)
  const [copied, setCopied] = useState(false)
  const htmlRef = useRef(highlight(code))

  // Re-highlight when code changes
  useEffect(() => { htmlRef.current = highlight(code) }, [code])

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }).catch(() => undefined)
  }

  return (
    <div className={cn('rounded-lg border overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3 border-b bg-muted/30">
        <div>
          <p className="font-medium text-sm">{title}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-4 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleCopy}
            title="复制代码"
          >
            {copied ? <CheckCheck size={14} className="text-success" /> : <Copy size={14} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setShowCode((v) => !v)}
            title={showCode ? '收起代码' : '展开代码'}
          >
            {showCode ? <ChevronUp size={14} /> : <Code size={14} />}
          </Button>
        </div>
      </div>

      {/* Preview area */}
      <div className="p-6 bg-background">
        {children}
      </div>

      {/* Code block */}
      {showCode && (
        <div className="border-t">
          <pre
            className="hljs overflow-x-auto text-[13px] leading-relaxed p-4 m-0"
            style={{ background: 'var(--hljs-bg)', color: 'var(--hljs-fg)' }}
          >
            <code
              dangerouslySetInnerHTML={{ __html: htmlRef.current }}
              className="font-mono"
            />
          </pre>
        </div>
      )}
    </div>
  )
}

