"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import AnimatedGradientBackground from "@/components/shared/AnimatedGradientBackground"
import { MinervaInput } from "@/components/home/MinervaInput"

const darkColors = ["#0A0A0A", "#2979FF", "#FF80AB", "#FF6D00", "#FFD600", "#00E676", "#3D5AFE"]
const darkStops = [35, 50, 60, 70, 80, 90, 100]
const lightColors = ["#FFFFFF", "#90CAF9", "#F8BBD0", "#FFCC80", "#FFF9C4", "#C8E6C9", "#C5CAE9"]
const lightStops = [35, 50, 60, 70, 80, 90, 100]

export function HomeContent() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = !mounted || resolvedTheme === "dark"
  const bg = isDark ? "#0A0A0A" : "#FFFFFF"
  const textTertiary = isDark ? "text-white/25" : "text-black/20"

  return (
    <div className="flex flex-col relative -mt-9 min-h-screen" style={{ backgroundColor: bg }}>
      <div className="absolute inset-0 overflow-hidden">
        <AnimatedGradientBackground
          key={isDark ? "dark" : "light"}
          startingGap={125} Breathing={true} breathingRange={5} animationSpeed={0.02} topOffset={0}
          gradientColors={isDark ? darkColors : lightColors}
          gradientStops={isDark ? darkStops : lightStops}
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-9">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center text-center w-full max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="w-full">
            <MinervaInput isDark={isDark} onSend={() => { window.location.href = "/" }} />
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-10 pb-6 pt-4">
        <p className={`text-center text-[11px] ${textTertiary}`}>© 2026 Minerva Intelligence. All rights reserved.</p>
      </div>
    </div>
  )
}
