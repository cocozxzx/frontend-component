import { LineChart, type LineChartProps } from './LineChart'

export type AreaChartProps = Omit<LineChartProps, 'area' | 'areaOpacity' | 'smooth'> & {
  area?: boolean
  areaOpacity?: number
  smooth?: boolean
}

export function AreaChart({
  area = true,
  areaOpacity = 0.4,
  smooth = true,
  ...rest
}: AreaChartProps) {
  return <LineChart {...rest} area={area} areaOpacity={areaOpacity} smooth={smooth} />
}
