import { format, parse, isValid } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export { formatDate } from '@/lib/utils'

export const LOCALE = zhCN

export const DATE_FORMATS = {
  DATE: 'yyyy-MM-dd',
  DATETIME: 'yyyy-MM-dd HH:mm:ss',
  TIME: 'HH:mm:ss',
  MONTH: 'yyyy-MM',
} as const

export function parseDate(str: string): Date {
  const date = new Date(str)
  if (isValid(date)) return date
  const parsed = parse(str, DATE_FORMATS.DATE, new Date())
  return isValid(parsed) ? parsed : new Date()
}

export function formatDateLocale(
  date: Date | string | number,
  fmt: string = DATE_FORMATS.DATE,
): string {
  return format(new Date(date), fmt, { locale: zhCN })
}
