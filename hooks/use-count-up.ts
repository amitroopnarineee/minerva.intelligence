"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface UseCountUpOptions {
  end: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  startOnView?: boolean
}

export function useCountUp({ end, duration = 1200, decimals = 0, prefix = "", suffix = "", startOnView = true }: UseCountUpOptions) {
  const [display, setDisplay] = useState(`${prefix}${end.toFixed(decimals)}${suffix}`)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLElement | null>(null)
  const rafRef = useRef<number>(0)

  const animate = useCallback(() => {
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * end
      setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`)
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [end, duration, decimals, prefix, suffix])

  useEffect(() => {
    if (!startOnView) { animate(); return }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) { setStarted(true); animate(); io.disconnect() }
    }, { threshold: 0.3 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(rafRef.current) }
  }, [animate, started, startOnView])

  return { ref, display }
}
