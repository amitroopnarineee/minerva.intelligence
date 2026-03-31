"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { useChat } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import { usePathname, useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { Sparkles, ArrowUp, Square, Navigation, User, Users, Megaphone, X } from "lucide-react"

interface MinervaChatProps {
  open: boolean
  onClose: () => void
  initialMessage?: string | null
}

const toolIcons: Record<string, typeof Sparkles> = {
  lookupPerson: User, getAudienceStats: Users, getCampaignPerformance: Megaphone,
  navigateTo: Navigation, openPersonProfile: User, openAudienceDetail: Users, openCampaignDetail: Megaphone,
}
const toolLabels: Record<string, string> = {
  lookupPerson: "Looking up person", getAudienceStats: "Fetching audience",
  getCampaignPerformance: "Loading campaign", navigateTo: "Navigating",
  openPersonProfile: "Opening profile", openAudienceDetail: "Opening audience", openCampaignDetail: "Opening campaign",
}

function ToolCallCard({ name, input, isDone }: { name: string; input: Record<string, unknown>; isDone: boolean }) {
  const Icon = toolIcons[name] || Sparkles
  const detail = String(Object.values(input)[0] || "")
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 my-1.5">
      <Icon className="h-3.5 w-3.5 text-white/35 shrink-0" />
      <span className="text-[11.5px] text-white/45 truncate">{toolLabels[name] || name}: <span className="text-white/60">{detail}</span></span>
      {isDone ? <span className="ml-auto text-[10px] text-emerald-400/60">✓</span> : null}
    </div>
  )
}

function MessageParts({ message }: { message: UIMessage }) {
  if (!message.parts?.length) return null
  return (
    <>
      {message.parts.map((part, i) => {
        if (part.type === "text" && part.text) {
          return <div key={i} className="mn-chat-markdown"><ReactMarkdown>{part.text}</ReactMarkdown></div>
        }
        if (part.type?.startsWith("tool-")) {
          const p = part as unknown as { type: string; toolName?: string; state?: string; input?: Record<string, unknown> }
          if (p.toolName && p.input) {
            return <ToolCallCard key={i} name={p.toolName} input={p.input} isDone={p.state === "result"} />
          }
        }
        return null
      })}
    </>
  )
}

export function MinervaChat({ open, onClose, initialMessage }: MinervaChatProps) {
  const pathname = usePathname()
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const sentInitial = useRef(false)
  const [inputValue, setInputValue] = useState("")

  const { messages, sendMessage, status, stop } = useChat({
    onToolCall: ({ toolCall }) => {
      const tc = toolCall as unknown as { toolName: string; input: Record<string, unknown> }
      const args = tc.input || {}
      if (tc.toolName === "navigateTo" && args.route) {
        window.dispatchEvent(new CustomEvent("minerva-action", { detail: { type: "navigate", route: args.route } }))
      }
      if (tc.toolName === "openPersonProfile" && args.personId) {
        window.dispatchEvent(new CustomEvent("minerva-action", { detail: { type: "openPerson", personId: args.personId } }))
      }
      if (tc.toolName === "openAudienceDetail" && args.audienceId) {
        window.dispatchEvent(new CustomEvent("minerva-action", { detail: { type: "openAudience", audienceId: args.audienceId } }))
      }
      if (tc.toolName === "openCampaignDetail" && args.campaignId) {
        window.dispatchEvent(new CustomEvent("minerva-action", { detail: { type: "openCampaign", campaignId: args.campaignId } }))
      }
    },
  })

  const isStreaming = status === "streaming" || status === "submitted"

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    if (open && initialMessage && !sentInitial.current && messages.length === 0) {
      sentInitial.current = true
      sendMessage({ text: initialMessage })
    }
  }, [open, initialMessage])

  useEffect(() => { if (!open) sentInitial.current = false }, [open])
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 300) }, [open])

  const handleSend = useCallback(() => {
    if (inputValue.trim() && !isStreaming) {
      sendMessage({ text: inputValue.trim() })
      setInputValue("")
    }
  }, [inputValue, isStreaming, sendMessage])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }, [handleSend])

  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent).detail
      if (d?.type === "navigate" && d.route) router.push(d.route)
    }
    window.addEventListener("minerva-action", handler)
    return () => window.removeEventListener("minerva-action", handler)
  }, [router])

  if (!open) return null

  return (
    <div className="mn-chat-panel h-full flex flex-col border-l border-white/[0.06] bg-[#0c0e1a]/60 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[13px] font-medium text-white/80 tracking-[-0.01em]" style={{ fontFamily: "'Overused Grotesk', sans-serif" }}>Minerva AI</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/20 font-mono">{pathname}</span>
          <button onClick={onClose} className="text-white/25 hover:text-white/60 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>
        {messages.length === 0 && !isStreaming && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 opacity-40">
            <Sparkles className="h-6 w-6 text-white/30" />
            <p className="text-[13px] text-white/40 max-w-[240px]">Ask about audiences, campaigns, or people. I can navigate the dashboard for you.</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={msg.role === "user" ? "flex justify-end" : ""}>
            {msg.role === "user" ? (
              <div className="max-w-[85%] rounded-2xl bg-white/[0.06] border border-white/[0.06] px-4 py-2.5 text-[13.5px] text-white/88 leading-relaxed">
                {msg.parts?.map((p, i) => p.type === "text" ? <span key={i}>{p.text}</span> : null)}
              </div>
            ) : (
              <div className="text-[13.5px] text-white/82 leading-[1.65]">
                <MessageParts message={msg} />
              </div>
            )}
          </div>
        ))}
        {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex items-center gap-2 py-2">
            <div className="flex gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="h-1.5 w-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="h-1.5 w-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-[11px] text-white/25">Thinking...</span>
          </div>
        )}
      </div>

      {/* Progressive blur */}
      <div className="pointer-events-none relative -mt-12 h-12 bg-gradient-to-t from-[#0c0e1a]/80 to-transparent z-10" />

      {/* Input */}
      <div className="shrink-0 px-3 pb-3 pt-1 relative z-20">
        <div className="relative flex items-end rounded-[14px] border border-white/[0.08] bg-white/[0.04] transition-colors focus-within:border-white/[0.15]">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Minerva anything..."
            rows={1}
            className="flex-1 bg-transparent text-[13.5px] text-white/88 placeholder:text-white/20 px-4 py-3 pr-12 resize-none outline-none max-h-[120px] leading-relaxed"
            style={{ fontFamily: "'Overused Grotesk', sans-serif", scrollbarWidth: "none" }}
          />
          {isStreaming ? (
            <button type="button" onClick={() => stop()} className="absolute right-2 bottom-2 h-[30px] w-[30px] flex items-center justify-center rounded-full bg-white/85 text-[#0c0e1a] hover:bg-white/95 transition-all hover:scale-105">
              <Square className="h-3 w-3" />
            </button>
          ) : (
            <button type="button" onClick={handleSend} disabled={!inputValue.trim()} className="absolute right-2 bottom-2 h-[30px] w-[30px] flex items-center justify-center rounded-full bg-white/85 text-[#0c0e1a] hover:bg-white/95 transition-all hover:scale-105 disabled:opacity-20 disabled:hover:scale-100">
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
