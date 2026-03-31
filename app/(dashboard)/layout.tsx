"use client"

import { MinervaMenuBar } from "@/components/shared/MinervaMenuBar"
import { GlobalBackground } from "@/components/shared/GlobalBackground"
import { CommandPalette } from "@/components/shared/CommandPalette"
import { MinervaChat } from "@/components/shared/MinervaChat"
import { useState, useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    const handler = () => setChatOpen((o) => !o)
    window.addEventListener("minerva-chat-toggle", handler)
    return () => window.removeEventListener("minerva-chat-toggle", handler)
  }, [])

  return (
    <div className="mn-root h-screen relative overflow-hidden">
      <GlobalBackground />
      <div className="mn-shell relative z-10 h-full flex flex-col">
        <MinervaMenuBar />
        <main className="mn-main flex-1 overflow-y-auto pt-9">
          {children}
        </main>
      </div>
      <CommandPalette />
      <MinervaChat open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  )
}
