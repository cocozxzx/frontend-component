import { cn } from '@/lib/utils'

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

export function PropsTable({ data, title = 'Props', className }: PropsTableProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* API 区分隔 */}
      <div className="flex items-center gap-4 pt-2">
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50">
            API 参考
          </span>
          <span className="rounded-full bg-muted/80 px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground/60">
            {data.length} 个属性
          </span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-border/60 to-transparent" />
      </div>

      {/* Table card */}
      <div
        className="overflow-hidden rounded-2xl border border-border/60"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <table className="w-full table-fixed border-collapse text-sm">
          <colgroup>
            <col style={{ width: '148px' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '17%' }} />
            <col style={{ width: '66px' }} />
            <col />
          </colgroup>

          <thead>
            <tr className="border-b border-border/40 bg-muted/25">
              {[
                { label: '属性名', cls: '' },
                { label: '类型', cls: '' },
                { label: '默认值', cls: '' },
                { label: '必填', cls: 'text-center' },
                { label: '说明', cls: '' },
              ].map(({ label, cls }) => (
                <th
                  key={label}
                  className={cn(
                    'px-4 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground/50',
                    cls,
                  )}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item, i) => (
              <tr
                key={item.name}
                className={cn(
                  'border-b border-border/25 transition-colors last:border-0',
                  'hover:bg-primary/[0.025]',
                  i % 2 !== 0 && 'bg-muted/[0.12]',
                )}
              >
                {/* 属性名 */}
                <td className="px-4 py-3 align-top">
                  <code className="inline-block max-w-full break-all rounded-md bg-primary/[0.08] px-2 py-0.5 font-mono text-[12px] font-semibold text-primary">
                    {item.name}
                  </code>
                </td>

                {/* 类型 */}
                <td className="px-4 py-3 align-top">
                  <code className="inline-block max-w-full break-all rounded-md bg-violet-500/[0.07] px-2 py-0.5 font-mono text-[11.5px] leading-relaxed text-violet-600 dark:text-violet-400">
                    {item.type}
                  </code>
                </td>

                {/* 默认值 */}
                <td className="px-4 py-3 align-top">
                  {item.default ? (
                    <code className="inline-block max-w-full break-all rounded-md bg-amber-500/[0.07] px-2 py-0.5 font-mono text-[11.5px] leading-relaxed text-amber-600 dark:text-amber-400">
                      {item.default}
                    </code>
                  ) : (
                    <span className="select-none text-muted-foreground/25">—</span>
                  )}
                </td>

                {/* 必填 */}
                <td className="px-4 py-3 text-center align-top">
                  {item.required ? (
                    <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
                      必填
                    </span>
                  ) : (
                    <span className="select-none text-muted-foreground/25">—</span>
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
