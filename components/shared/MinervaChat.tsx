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
      <SheetContent
        className="mn-chat-panel w-full sm:max-w-[420px] p-0 border-l border-white/[0.06] bg-[#0c0e1a]/80 backdrop-blur-2xl [&>button]:hidden"
        side="right"
      >
        <div className="h-full flex flex-col relative">
          {/* Header */}
          <div className="mn-chat-header flex items-center justify-between px-4 py-3 border-b border-white/[0.06] shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[13px] font-medium text-white/80 tracking-[-0.01em]" style={{ fontFamily: "'Overused Grotesk', sans-serif" }}>Minerva AI</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/20 font-mono">{pathname}</span>
              <button onClick={onClose} className="text-white/20 hover:text-white/50 transition-colors text-[18px] leading-none">×</button>
            </div>
          </div>

          {/* Chat body with progressive blur */}
          <div className="mn-chat-body flex-1 overflow-hidden relative">
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
            {/* Progressive blur fade at bottom */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0c0e1a]/95 via-[#0c0e1a]/60 to-transparent" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
