import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { throttle } from '@/lib/utils'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AnchorLinkConfig {
  href: string
  title: ReactNode
  children?: AnchorLinkConfig[]
}

// ─── AnchorLink (child component) ────────────────────────────────────────────

export interface AnchorLinkProps extends AnchorLinkConfig {
  activeHref: string
  onClick: (href: string) => void
  depth?: number
}

export function AnchorLink({ href, title, children, activeHref, onClick, depth = 0 }: AnchorLinkProps) {
  const isActive = activeHref === href

  return (
    <div>
      <button
        type="button"
        onClick={() => onClick(href)}
        className={cn(
          'flex w-full border-l-[3px] px-3 py-1 text-left text-sm transition-colors',
          isActive
            ? 'border-l-primary font-medium text-primary'
            : 'border-l-transparent text-muted-foreground hover:text-foreground',
        )}
        style={{ paddingLeft: depth * 12 + 12 }}
      >
        {title}
      </button>
      {children?.map((child) => (
        <AnchorLink
          key={child.href}
          {...child}
          activeHref={activeHref}
          onClick={onClick}
          depth={depth + 1}
        />
      ))}
    </div>
  )
}

// ─── Anchor ───────────────────────────────────────────────────────────────────

export interface AnchorProps {
  items?: AnchorLinkConfig[]
  offsetTop?: number
  targetOffset?: number
  affix?: boolean
  showInkInFixed?: boolean
  onChange?: (currentHref: string) => void
  children?: ReactNode
  className?: string
}

function flattenItems(items: AnchorLinkConfig[]): AnchorLinkConfig[] {
  return items.flatMap((item) => [item, ...(item.children ? flattenItems(item.children) : [])])
}

export function Anchor({
  items = [],
  offsetTop = 0,
  targetOffset,
  affix = true,
  onChange,
  children,
  className,
}: AnchorProps) {
  const [activeHref, setActiveHref] = useState('')
  const threshold = targetOffset ?? offsetTop

  const updateActive = useCallback(
    throttle(() => {
      const allItems = flattenItems(items)
      let active = ''

      for (const item of allItems) {
        const id = item.href.replace('#', '')
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top - threshold <= 0) {
          active = item.href
        }
      }

      if (active !== activeHref) {
        setActiveHref(active)
        onChange?.(active)
      }
    }, 100),
    [items, threshold, activeHref, onChange],
  )

  useEffect(() => {
    window.addEventListener('scroll', updateActive, { passive: true })
    updateActive()
    return () => window.removeEventListener('scroll', updateActive)
  }, [updateActive])

  const handleClick = (href: string) => {
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - offsetTop
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    window.history.pushState(null, '', href)
    setActiveHref(href)
    onChange?.(href)
  }

  const nav = (
    <nav
      className={cn(
        'w-40 border-l border-border py-2',
        affix && 'sticky',
        className,
      )}
      style={affix ? { top: offsetTop } : undefined}
    >
      {items.map((item) => (
        <AnchorLink
          key={item.href}
          {...item}
          activeHref={activeHref}
          onClick={handleClick}
        />
      ))}
      {children}
    </nav>
  )

  return nav
}
