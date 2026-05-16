import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PRESET_COLORS } from '@/lib/theme-utils'

interface ThemeColorPickerProps {
  value: string
  onChange: (color: string) => void
}

export function ThemeColorPicker({ value, onChange }: ThemeColorPickerProps) {
  const normalizedValue = value.toLowerCase()

  return (
    <div className="flex flex-wrap items-center gap-2">
      {PRESET_COLORS.map((preset) => {
        const isActive = normalizedValue === preset.value.toLowerCase()
        return (
          <button
            key={preset.value}
            title={preset.name}
            onClick={() => onChange(preset.value)}
            className={cn(
              'relative flex h-7 w-7 items-center justify-center rounded-full transition-transform hover:scale-110',
              isActive && 'ring-2 ring-offset-2 ring-offset-card ring-primary',
            )}
            style={{ backgroundColor: preset.value }}
          >
            {isActive && <Check size={14} className="text-white" strokeWidth={3} />}
          </button>
        )
      })}

      {/* Custom color picker */}
      <label
        title="自定义颜色"
        className="relative flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border transition-transform hover:scale-110 hover:border-primary"
        style={{
          background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)',
        }}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </label>
    </div>
  )
}
