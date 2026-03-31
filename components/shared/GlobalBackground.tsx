"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import AnimatedGradientBackground from "@/components/shared/AnimatedGradientBackground"

const darkColors = ["#13100E", "#6B5B73", "#C49080", "#8A7568", "#B89285", "#7A6E82", "#4A3F3A"]
const darkStops = [25, 40, 55, 65, 75, 85, 100]
const lightColors = ["#FAF8F6", "#E8D5CC", "#D4BFB8", "#C9B8C4", "#E2D3CA", "#D8CCC0", "#C4B8AD"]
const lightStops = [25, 40, 55, 65, 75, 85, 100]

export function GlobalBackground() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = !mounted || resolvedTheme === "dark"

  return (
    <div className="mn-global-bg fixed inset-0 z-0 pointer-events-none">
      <AnimatedGradientBackground
        key={isDark ? "dark" : "light"}
        startingGap={125} Breathing={true} breathingRange={5} animationSpeed={0.02} topOffset={0}
        gradientColors={isDark ? darkColors : lightColors}
        gradientStops={isDark ? darkStops : lightStops}
      />
    </div>
  )
}
