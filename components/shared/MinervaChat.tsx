"use client"

import { useState, useEffect } from "react"
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
}

export function MinervaChat({ open, onClose }: MinervaChatProps) {
  const pathname = usePathname()
  const { messages, sendMessage, status, stop, error } = useChat({ chat })

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent className="mn-chat-panel w-full sm:max-w-md p-0 border-l border-border/30 bg-[#0c0e1c]">
        <div className="h-full flex flex-col">
          <div className="mn-chat-header flex items-center justify-between px-4 py-3 border-b border-border/20">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-medium">Minerva AI</span>
            </div>
            <span className="text-[10px] text-muted-foreground">{pathname}</span>
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
