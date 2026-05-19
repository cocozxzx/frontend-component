// Excel / CSV / JSON 导出工具

// ─── CSV ─────────────────────────────────────────────────────────────────────

function escapeCell(val: unknown): string {
  const str = val == null ? '' : String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function exportCsv(
  data: Record<string, unknown>[],
  columns: { key: string; title: string }[],
  filename = 'export',
) {
  const header = columns.map((c) => c.title).join(',')
  const rows = data.map((row) => columns.map((c) => escapeCell(row[c.key])).join(','))
  const csv = [header, ...rows].join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, `${filename}.csv`)
}

// ─── JSON ─────────────────────────────────────────────────────────────────────

export function exportJson(data: unknown, filename = 'export') {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
  downloadBlob(blob, `${filename}.json`)
}

// ─── Excel（xlsx via SheetJS，按需动态加载）──────────────────────────────────

export async function exportExcel(
  data: Record<string, unknown>[],
  columns: { key: string; title: string }[],
  filename = 'export',
) {
  const XLSX = await import('xlsx').catch(() => {
    throw new Error('请先安装 xlsx：npm install xlsx')
  })

  const header = columns.map((c) => c.title)
  const rows = data.map((row) => columns.map((c) => row[c.key] ?? ''))
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

// ─── 打印 ─────────────────────────────────────────────────────────────────────

export function printElement(el: HTMLElement, title = '') {
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>body { font-family: sans-serif; } table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; }</style>
      </head>
      <body>${el.outerHTML}</body>
    </html>
  `)
  win.document.close()
  win.focus()
  win.print()
  win.close()
}

// ─── 内部工具 ─────────────────────────────────────────────────────────────────

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
