"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { MinervaLogo } from "@/components/shared/MinervaLogo"

// To use the Dolphins logo:
// 1. Export from Illustrator as PNG with transparent background
// 2. Save white version as /public/dolphins-white.png
// 3. Save dark version as /public/dolphins-dark.png (or use CSS invert)
// 4. Set useDolphinsLogo = true below

const useDolphinsLogo = false // flip to true when PNGs are ready

export function ClientLogo({ className = "" }: { className?: string }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = !mounted || resolvedTheme === "dark"

  if (!useDolphinsLogo) {
    return <MinervaLogo className={className} />
  }

  // When Dolphins PNGs are ready, this renders the logo
  // White version for dark mode, inverted for light mode
  return (
    <img
      src="/dolphins-white.png"
      alt="Miami Dolphins"
      className={`${className} ${isDark ? "" : "invert"}`}
      style={{ objectFit: "contain" }}
    />
  )
}
