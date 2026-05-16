import { useState, useEffect, useCallback, type ReactNode } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CarouselItem {
  key: string | number
  content: ReactNode
}

export interface CarouselProps {
  items?: CarouselItem[]
  children?: ReactNode
  autoplay?: boolean
  autoplayInterval?: number
  loop?: boolean
  showArrows?: boolean
  showDots?: boolean
  slidesPerView?: number
  spacing?: number
  align?: 'start' | 'center' | 'end'
  orientation?: 'horizontal' | 'vertical'
  onSlideChange?: (index: number) => void
  className?: string
}

export function Carousel({
  items,
  children,
  autoplay = false,
  autoplayInterval = 3000,
  loop = true,
  showArrows = true,
  showDots = true,
  slidesPerView = 1,
  spacing = 16,
  align = 'center',
  orientation = 'horizontal',
  onSlideChange,
  className,
}: CarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const autoplayPlugin = autoplay
    ? Autoplay({ delay: autoplayInterval, stopOnInteraction: false })
    : undefined

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop,
      align,
      axis: orientation === 'vertical' ? 'y' : 'x',
      slidesToScroll: 1,
    },
    autoplayPlugin ? [autoplayPlugin] : [],
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    const idx = emblaApi.selectedScrollSnap()
    setSelectedIndex(idx)
    onSlideChange?.(idx)
  }, [emblaApi, onSlideChange])

  useEffect(() => {
    if (!emblaApi) return
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    onSelect()
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  // Pause autoplay when page is hidden
  useEffect(() => {
    if (!autoplay || !emblaApi) return
    const handler = () => {
      const ap = emblaApi.plugins().autoplay as { stop?: () => void; play?: () => void } | undefined
      if (document.hidden) ap?.stop?.()
      else ap?.play?.()
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [autoplay, emblaApi])

  // Pause on hover
  const handleMouseEnter = () => {
    if (!autoplay) return
    const ap = emblaApi?.plugins().autoplay as { stop?: () => void } | undefined
    ap?.stop?.()
  }
  const handleMouseLeave = () => {
    if (!autoplay) return
    const ap = emblaApi?.plugins().autoplay as { play?: () => void } | undefined
    ap?.play?.()
  }

  const slides = items
    ? items.map((item) => (
        <div
          key={item.key}
          className="min-w-0 shrink-0"
          style={{ flex: `0 0 ${100 / slidesPerView}%`, paddingLeft: spacing / 2, paddingRight: spacing / 2 }}
        >
          {item.content}
        </div>
      ))
    : null

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div
          className="flex"
          style={{
            flexDirection: orientation === 'vertical' ? 'column' : 'row',
            marginLeft: -spacing / 2,
            marginRight: -spacing / 2,
          }}
        >
          {slides ?? children}
        </div>
      </div>

      {/* Arrows */}
      {showArrows && (
        <>
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex-center h-8 w-8 rounded-full bg-black/40 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100 [.relative:hover_&]:opacity-100"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex-center h-8 w-8 rounded-full bg-black/40 text-white opacity-0 transition-opacity hover:bg-black/60 [.relative:hover_&]:opacity-100"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && scrollSnaps.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-200',
                i === selectedIndex ? 'w-4 bg-primary' : 'w-1.5 bg-white/60',
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
