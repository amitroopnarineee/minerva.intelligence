"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MinervaLogo } from "@/components/shared/MinervaLogo"
import AnimatedGradientBackground from "@/components/shared/AnimatedGradientBackground"

// Dark: matches the reference image exactly — deep black center, blue → pink → orange → yellow → green → blue edges
const darkColors = ["#0A0A0A", "#2979FF", "#FF80AB", "#FF6D00", "#FFD600", "#00E676", "#3D5AFE"]
const darkStops = [35, 50, 60, 70, 80, 90, 100]

// Light: inverted — white center, softer pastel versions of the same hues at edges
const lightColors = ["#FFFFFF", "#90CAF9", "#F8BBD0", "#FFCC80", "#FFF9C4", "#C8E6C9", "#C5CAE9"]
const lightStops = [35, 50, 60, 70, 80, 90, 100]

export function HomeContent() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = !mounted || resolvedTheme === "dark"
  const gradientColors = isDark ? darkColors : lightColors
  const gradientStops = isDark ? darkStops : lightStops
  const bg = isDark ? "#0A0A0A" : "#FFFFFF"
  const textPrimary = isDark ? "text-white" : "text-black"
  const textSecondary = isDark ? "text-white/60" : "text-black/50"
  const textTertiary = isDark ? "text-white/40" : "text-black/30"
  const borderColor = isDark ? "border-white/10" : "border-black/10"
  const btnFill = isDark
    ? "border-white bg-white text-black hover:bg-white/90"
    : "border-black bg-black text-white hover:bg-black/90"
  const btnGhost = isDark
    ? "border-white/20 text-white/70 hover:text-white hover:border-white/50"
    : "border-black/20 text-black/50 hover:text-black hover:border-black/50"

  return (
    <div className="flex flex-1 flex-col relative" style={{ backgroundColor: bg }}>
      {/* Animated gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatedGradientBackground
          key={isDark ? "dark" : "light"}
          startingGap={125}
          Breathing={true}
          breathingRange={5}
          animationSpeed={0.02}
          topOffset={0}
          gradientColors={gradientColors}
          gradientStops={gradientStops}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col items-center text-center max-w-lg"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <MinervaLogo className={`h-16 w-16 mb-8 ${textPrimary}`} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className={`text-4xl font-bold tracking-tight sm:text-5xl ${textPrimary}`}
          >
            Good morning, Sarah.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className={`mt-4 text-base max-w-md leading-relaxed ${textSecondary}`}
          >
            Minerva has analyzed 48,200 consumer signals overnight.
            3 new opportunities are ready for activation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-3"
          >
            <a href="/" className={`inline-flex items-center justify-center rounded-none border px-8 py-3 text-sm font-semibold transition-all ${btnFill}`}>
              Open Command Center
            </a>
            <a href="/person-search" className={`inline-flex items-center justify-center rounded-none border px-8 py-3 text-sm font-medium transition-all ${btnGhost}`}>
              Person Search
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className={`relative z-10 border-t ${borderColor}`}>
        <div className="mx-auto flex flex-col md:flex-row justify-between w-full gap-4 pb-6 pt-6 px-6 max-w-6xl">
          <div className="space-y-2">
            <ul className="flex flex-wrap gap-4">
              {["Terms & Policies", "Privacy Policy", "Security"].map((l) => (
                <li key={l}><span className={`text-xs ${textTertiary} hover:opacity-70 transition-opacity cursor-pointer`}>{l}</span></li>
              ))}
            </ul>
            <p className={`text-xs ${textTertiary}`}>© 2026 Minerva Intelligence. All rights reserved.</p>
          </div>
          <ul className="flex flex-wrap gap-4">
            {["Documentation", "API Reference", "Help Center", "Status"].map((l) => (
              <li key={l}><span className={`text-xs ${textTertiary} hover:opacity-70 transition-opacity cursor-pointer`}>{l}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
