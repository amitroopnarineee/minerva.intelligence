"use client"

import { useState } from "react"
import { MinervaMenuBar } from "@/components/shared/MinervaMenuBar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [light, setLight] = useState(true)
  return (
    <div className={`${light ? 'mn-light-mode' : ''} h-screen bg-black overflow-hidden`} style={{ fontFamily: "'Overused Grotesk', ui-sans-serif, system-ui, sans-serif" }}>
      <MinervaMenuBar onToggleTheme={() => setLight(p => { const next = !p; document.querySelectorAll('iframe').forEach(f => f.contentWindow?.postMessage({ type: 'minerva-theme', light: next }, '*')); return next })} isLight={light} />
      {children}
    </div>
  )
}
