"use client"

import { useEffect } from "react"
import { AgentChat, createAgentChat } from "@21st-sdk/nextjs"
import { useChat } from "@ai-sdk/react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import theme from "@/app/minerva-theme.json"

const chat = createAgentChat({
  agent: "minerva-intelligence",
  tokenUrl: "/api/an-token",
})

interface MinervaChatProps {
  open: boolean
  onClose: () => void
  initialMessage?: string | null
}

export function MinervaChat({ open, onClose, initialMessage }: MinervaChatProps) {
  const pathname = usePathname()
  const { messages, sendMessage, status, stop, error } = useChat({ chat })

  // Send initial message when panel opens with one
  useEffect(() => {
    if (open && initialMessage && messages.length === 0) {
      sendMessage({
        role: "user",
        parts: [{ type: "text", text: initialMessage }],
      })
    }
  }, [open, initialMessage])

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent className="mn-chat-panel w-full sm:max-w-[420px] p-0 border-l border-white/[0.06] bg-transparent backdrop-blur-xl" side="right">
        <div className="h-full flex flex-col">
          <div className="mn-chat-header flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[13px] font-medium text-white/80">Minerva AI</span>
            </div>
            <span className="text-[10px] text-white/25 font-mono">{pathname}</span>
          </div>
          <div className="mn-chat-body flex-1 overflow-hidden">
            <AgentChat
              messages={messages}
              onSend={(message) =>
                sendMessage({
                  role: "user",
                  parts: [{ type: "text", text: message.content }],
                })
              }
              status={status}
              onStop={stop}
              error={error ?? undefined}
              theme={theme}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
