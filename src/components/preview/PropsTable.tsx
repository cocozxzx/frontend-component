import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table'
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
      <h3 className="text-base font-semibold">{title}</h3>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-40 font-medium">属性名</TableHead>
              <TableHead className="font-medium">类型</TableHead>
              <TableHead className="w-28 font-medium">默认值</TableHead>
              <TableHead className="w-16 font-medium text-center">必填</TableHead>
              <TableHead className="font-medium">说明</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.name} className="hover:bg-muted/30">
                <TableCell>
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px]">
                    {item.name}
                  </code>
                </TableCell>
                <TableCell>
                  <code className="font-mono text-[13px] text-primary">
                    {item.type}
                  </code>
                </TableCell>
                <TableCell>
                  {item.default ? (
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-muted-foreground">
                      {item.default}
                    </code>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {item.required ? (
                    <span className="text-destructive font-semibold text-base leading-none">*</span>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {item.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
