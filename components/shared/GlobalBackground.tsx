"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import AnimatedGradientBackground from "@/components/shared/AnimatedGradientBackground"

const darkColors = ["#0A0A0A", "#2979FF", "#FF80AB", "#FF6D00", "#FFD600", "#00E676", "#3D5AFE"]
const darkStops = [35, 50, 60, 70, 80, 90, 100]
const lightColors = ["#FFFFFF", "#90CAF9", "#F8BBD0", "#FFCC80", "#FFF9C4", "#C8E6C9", "#C5CAE9"]
const lightStops = [35, 50, 60, 70, 80, 90, 100]

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
