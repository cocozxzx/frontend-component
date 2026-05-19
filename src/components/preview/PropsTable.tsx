import { cn } from '@/lib/utils'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface PropItem {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

export interface PropsTableProps {
  data: PropItem[]
  title?: string
  className?: string
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function PropsTable({ data, title = 'Props', className }: PropsTableProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Title row */}
      <div className="flex items-center gap-2">
        <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {data.length} 个属性
        </span>
      </div>

      {/* Use a real <table> with table-layout:fixed so columns never overflow */}
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full table-fixed border-collapse text-sm">
          <colgroup>
            <col style={{ width: '148px' }} />  {/* 属性名 */}
            <col style={{ width: '22%' }} />     {/* 类型 */}
            <col style={{ width: '18%' }} />     {/* 默认值 */}
            <col style={{ width: '64px' }} />    {/* 必填 */}
            <col />                              {/* 说明 — 剩余宽度 */}
          </colgroup>

          <thead>
            <tr className="border-b border-border bg-muted/40">
              {(['属性名', '类型', '默认值', '必填', '说明'] as const).map((h) => (
                <th
                  key={h}
                  className={cn(
                    'px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground',
                    h === '必填' && 'text-center',
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {data.map((item, i) => (
              <tr
                key={item.name}
                className={cn(
                  'transition-colors hover:bg-primary/5',
                  i % 2 === 0 ? 'bg-card' : 'bg-muted/20',
                )}
              >
                {/* 属性名 */}
                <td className="px-4 py-3 align-top">
                  <code className="inline-block max-w-full break-all rounded-md bg-primary/8 px-2 py-0.5 font-mono text-[12px] font-medium text-primary">
                    {item.name}
                  </code>
                </td>

                {/* 类型 */}
                <td className="px-4 py-3 align-top">
                  <code className="inline-block max-w-full break-all rounded-md bg-violet-50 px-2 py-0.5 font-mono text-[12px] leading-relaxed text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
                    {item.type}
                  </code>
                </td>

                {/* 默认值 */}
                <td className="px-4 py-3 align-top">
                  {item.default ? (
                    <code className="inline-block max-w-full break-all rounded-md bg-amber-50 px-2 py-0.5 font-mono text-[12px] leading-relaxed text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                      {item.default}
                    </code>
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )}
                </td>

                {/* 必填 */}
                <td className="px-4 py-3 text-center align-top">
                  {item.required ? (
                    <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
                      必填
                    </span>
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )}
                </td>

                {/* 说明 */}
                <td className="px-4 py-3 align-top">
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
