"use client"

import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MinervaInput } from "@/components/home/MinervaInput"

export function HomeContent() {
  const { resolvedTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = !mounted || resolvedTheme === "dark"
  const textTertiary = isDark ? "text-white/25" : "text-black/20"

  const handleSend = (message: string, mode: string) => {
    const routes: Record<string, string> = {
      "discover": "/",
      "person-search": "/person-search",
      "audiences": "/prospecting",
      "analytics": "/analytics",
      "enrich": "/bulk-enrich",
      "activate": "/owned-audience",
    }
    router.push(routes[mode] ?? "/")
  }

  return (
    <div className="mn-home flex flex-col -mt-9 min-h-screen">
      <div className="mn-home-content relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-9">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="mn-home-center flex flex-col items-center text-center w-full max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="w-full">
            <MinervaInput isDark={isDark} onSend={handleSend} />
          </motion.div>
        </motion.div>
      </div>
      <div className="mn-home-footer relative z-10 pb-6 pt-4">
        <p className={`text-center text-[11px] ${textTertiary}`}>© 2026 Minerva Intelligence. All rights reserved.</p>
      </div>
    </div>
  )
}
