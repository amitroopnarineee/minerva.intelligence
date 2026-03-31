"use client"

import { MinervaMenuBar } from "@/components/shared/MinervaMenuBar"
import { GlobalBackground } from "@/components/shared/GlobalBackground"
import { CommandPalette } from "@/components/shared/CommandPalette"
import { MinervaChat } from "@/components/shared/MinervaChat"
import { SelectionToolbar } from "@/components/shared/SelectionToolbar"
import { DragSelect } from "@/components/shared/DragSelect"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [chatOpen, setChatOpen] = useState(false)
  const [initialMessage, setInitialMessage] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const toggleHandler = () => setChatOpen((o) => !o)
    const openWithMessage = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail?.message) {
        setInitialMessage(detail.message)
        setChatOpen(true)
      }
    }
    const actionHandler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (!detail) return
      switch (detail.type) {
        case "navigate":
          router.push(detail.route)
          break
        case "openPerson":
          router.push("/person-search")
          setTimeout(() => window.dispatchEvent(new CustomEvent("minerva-open-person", { detail: { personId: detail.personId } })), 500)
          break
        case "openAudience":
          router.push("/")
          setTimeout(() => window.dispatchEvent(new CustomEvent("minerva-open-audience", { detail: { audienceId: detail.audienceId } })), 500)
          break
        case "openCampaign":
          router.push("/")
          setTimeout(() => window.dispatchEvent(new CustomEvent("minerva-open-campaign", { detail: { campaignId: detail.campaignId } })), 500)
          break
      }
    }

    window.addEventListener("minerva-chat-toggle", toggleHandler)
    window.addEventListener("minerva-chat-send", openWithMessage)
    window.addEventListener("minerva-action", actionHandler)
    return () => {
      window.removeEventListener("minerva-chat-toggle", toggleHandler)
      window.removeEventListener("minerva-chat-send", openWithMessage)
      window.removeEventListener("minerva-action", actionHandler)
    }
  }, [router])

  const handleClose = () => {
    setChatOpen(false)
    setInitialMessage(null)
  }

  const handleAIRequest = useCallback((text: string) => {
    setInitialMessage(text)
    setChatOpen(true)
  }, [])

  return (
    <div className="mn-root h-screen relative overflow-hidden">
      <GlobalBackground />

      {/* Main flex row — content + chat side by side */}
      <div className="relative z-10 h-full flex">
        {/* Left: full app shell (menu bar + content) */}
        <div className="flex-1 min-w-0 flex flex-col transition-all duration-300 ease-out">
          <MinervaMenuBar />
          <main className="mn-main flex-1 overflow-y-auto pt-9" onClick={() => { if (chatOpen) setChatOpen(false) }}>
            {children}
          </main>
        </div>

        {/* Right: chat panel — inline, not overlay */}
        <div
          className="shrink-0 transition-all duration-300 ease-out overflow-hidden"
          style={{ width: chatOpen ? 380 : 0 }}
        >
          <div className="w-[380px] h-full">
            <MinervaChat open={chatOpen} onClose={handleClose} initialMessage={initialMessage} />
          </div>
        </div>
      </div>

      <CommandPalette />
      <SelectionToolbar onAskAI={handleAIRequest} />
      <DragSelect onAnalyze={handleAIRequest} />
    </div>
  )
}
