import { useState, useEffect, useRef, type ReactNode } from 'react'
import { Code2, Copy, Check, Eye, ChevronDown } from 'lucide-react'
import { createLowlight } from 'lowlight'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import { cn } from '@/lib/utils'

// ─── Lowlight ──────────────────────────────────────────────────────────────────

const low = createLowlight()
low.register({ typescript, tsx: typescript, xml, css })

type HastNode =
  | { type: 'root'; children: HastNode[] }
  | { type: 'element'; tagName: string; properties: Record<string, unknown>; children: HastNode[] }
  | { type: 'text'; value: string }
  | { type: string; [key: string]: unknown }

function escape(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function hastToHtml(node: HastNode): string {
  if (node.type === 'text') return escape((node as { value: string }).value ?? '')
  if (node.type === 'element') {
    const el = node as { tagName: string; properties: Record<string, unknown>; children: HastNode[] }
    const rawClass = el.properties?.className
    const classes = Array.isArray(rawClass) ? rawClass.join(' ') : typeof rawClass === 'string' ? rawClass : ''
    const inner = (el.children ?? []).map(hastToHtml).join('')
    return `<${el.tagName}${classes ? ` class="${classes}"` : ''}>${inner}</${el.tagName}>`
  }
  if (node.type === 'root') return ((node as { children: HastNode[] }).children ?? []).map(hastToHtml).join('')
  return ''
}

function highlight(code: string): string {
  try {
    return hastToHtml(low.highlight('tsx', code) as unknown as HastNode)
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
  const [tab, setTab] = useState<'preview' | 'code'>(defaultShowCode ? 'code' : 'preview')
  const [copied, setCopied] = useState(false)
  const [codeExpanded, setCodeExpanded] = useState(false)
  const htmlRef = useRef(highlight(code))
  const lineCount = code.split('\n').length

  useEffect(() => { htmlRef.current = highlight(code) }, [code])

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    }).catch(() => undefined)
  }

  const needsExpand = lineCount > 12 && tab === 'code' && !codeExpanded

  return (
    <div
      className={cn(
        'group overflow-hidden rounded-2xl border border-border/60 bg-card',
        'transition-shadow duration-200 hover:shadow-md',
        className,
      )}
    >
      {/* ── Top bar ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 border-b border-border/50 px-4 py-0">
        {/* Info */}
        <div className="min-w-0 py-3">
          <p className="truncate text-[13px] font-medium">{title}</p>
          {description && (
            <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Tab switcher + Copy */}
        <div className="flex shrink-0 items-center gap-1">
          {/* Preview / Code tabs */}
          <div className="flex items-center rounded-lg bg-muted/60 p-0.5">
            <button
              onClick={() => setTab('preview')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-all',
                tab === 'preview'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Eye size={11} />
              预览
            </button>
            <button
              onClick={() => setTab('code')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-all',
                tab === 'code'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Code2 size={11} />
              代码
            </button>
          </div>

          {/* Copy */}
          <button
            onClick={handleCopy}
            title="复制代码"
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg transition-all',
              copied
                ? 'bg-success/10 text-success'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      {/* ── Preview area ───────────────────────────────────────────────── */}
      {tab === 'preview' && (
        <div
          className="relative p-8"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--border) / 0.6) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            backgroundColor: 'hsl(var(--background))',
          }}
        >
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 40%, hsl(var(--background) / 0.6) 100%)',
            }}
          />
          <div className="relative">
            {children}
          </div>
        </div>
      )}

      {/* ── Code area ──────────────────────────────────────────────────── */}
      {tab === 'code' && (
        <div className="relative">
          <div
            className={cn(
              'overflow-hidden transition-all duration-300',
              !codeExpanded && lineCount > 12 ? 'max-h-[280px]' : 'max-h-none',
            )}
          >
            {/* Line numbers + code */}
            <div className="flex" style={{ background: 'var(--hljs-bg)' }}>
              {/* Line numbers */}
              <div
                className="select-none border-r border-white/5 px-3 py-4 text-right"
                style={{ color: 'var(--hljs-comment)', fontSize: '12px', lineHeight: '1.7' }}
                aria-hidden="true"
              >
                {code.split('\n').map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              {/* Code */}
              <pre
                className="hljs flex-1 overflow-x-auto py-4 pl-4 pr-6 m-0"
                style={{ background: 'var(--hljs-bg)', color: 'var(--hljs-fg)', fontSize: '12.5px', lineHeight: '1.7' }}
              >
                <code
                  dangerouslySetInnerHTML={{ __html: htmlRef.current }}
                  className="font-mono"
                />
              </pre>
            </div>
          </div>

          {/* Expand / collapse */}
          {lineCount > 12 && (
            <div
              className={cn(
                'flex items-center justify-center border-t border-white/5 py-2',
                !codeExpanded && 'absolute bottom-0 inset-x-0 pt-10',
              )}
              style={
                !codeExpanded
                  ? {
                      background: `linear-gradient(to top, var(--hljs-bg) 60%, transparent)`,
                    }
                  : { background: 'var(--hljs-bg)' }
              }
            >
              <button
                onClick={() => setCodeExpanded((v) => !v)}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-medium text-white/50 transition-all hover:bg-white/10 hover:text-white/80"
              >
                <ChevronDown
                  size={12}
                  className={cn('transition-transform duration-200', codeExpanded && 'rotate-180')}
                />
                {codeExpanded ? '收起代码' : `展开全部 ${lineCount} 行`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
