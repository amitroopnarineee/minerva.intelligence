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
  const [initialMessage, setInitialMessage] = useState<string | null>(null)

  useEffect(() => {
    const toggleHandler = () => setChatOpen((o) => !o)
    const openWithMessage = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail?.message) {
        setInitialMessage(detail.message)
        setChatOpen(true)
      }
    }
    window.addEventListener("minerva-chat-toggle", toggleHandler)
    window.addEventListener("minerva-chat-send", openWithMessage)
    return () => {
      window.removeEventListener("minerva-chat-toggle", toggleHandler)
      window.removeEventListener("minerva-chat-send", openWithMessage)
    }
  }, [])

  const handleClose = () => {
    setChatOpen(false)
    setInitialMessage(null)
  }

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
      <MinervaChat open={chatOpen} onClose={handleClose} initialMessage={initialMessage} />
    </div>
  )
}
