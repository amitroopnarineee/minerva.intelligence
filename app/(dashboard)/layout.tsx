"use client"

import { useState } from "react"
import { MinervaMenuBar } from "@/components/shared/MinervaMenuBar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [light, setLight] = useState(true)
  return (
    <div className={`${light ? 'mn-light-mode' : ''} h-screen bg-black overflow-hidden`} style={{ fontFamily: "'Overused Grotesk', ui-sans-serif, system-ui, sans-serif" }}>
      <MinervaMenuBar onToggleTheme={() => setLight(p => !p)} isLight={light} />
      {children}
    </div>
  )
}
