import {
  LayoutDashboard, Puzzle, Box, Briefcase, Palette,
  type LucideIcon, type LucideProps,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Puzzle,
  Box,
  Briefcase,
  Palette,
}

interface DynamicIconProps extends LucideProps {
  name: string
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const Icon = iconMap[name]
  if (!Icon) return null
  return <Icon {...props} />
}
