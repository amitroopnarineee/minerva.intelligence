"use client"

import { useCountUp } from "@/hooks/use-count-up"

interface CountUpProps {
  end: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

export function CountUp({ end, decimals = 0, prefix = "", suffix = "", duration = 1200, className }: CountUpProps) {
  const { ref, display } = useCountUp({ end, decimals, prefix, suffix, duration })
  return <span ref={ref as React.Ref<HTMLSpanElement>} className={className}>{display}</span>
}
