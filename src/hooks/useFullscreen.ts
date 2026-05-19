import { useState, useCallback, useEffect, type RefObject } from 'react'

export function useFullscreen<T extends HTMLElement>(ref?: RefObject<T | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const enter = useCallback(async () => {
    const el = ref?.current ?? document.documentElement
    await el.requestFullscreen?.()
  }, [ref])

  const exit = useCallback(async () => {
    if (document.fullscreenElement) await document.exitFullscreen()
  }, [])

  const toggle = useCallback(() => (isFullscreen ? exit() : enter()), [isFullscreen, enter, exit])

  return { isFullscreen, enter, exit, toggle }
}
