"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { useChat } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import { usePathname, useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { Sparkles, ArrowUp, Square, Navigation, User, Users, Megaphone, X, Copy, Check, ArrowDown, RotateCcw } from "lucide-react"

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
  getCampaignPerformance: "Loading campaign", navigateTo: "Navigating to page",
  openPersonProfile: "Opening profile", openAudienceDetail: "Opening audience", openCampaignDetail: "Opening campaign",
}

/* ── Suggested prompts ── */
const suggestions = [
  "Who are our renewal risk members?",
  "Look up Ashley Martinez",
  "How is the Premium Suites campaign?",
  "Take me to analytics",
]

/* ── Tool call card ── */
function ToolCallCard({ name, input, isDone }: { name: string; input: Record<string, unknown>; isDone: boolean }) {
  const Icon = toolIcons[name] || Sparkles
  const detail = String(Object.values(input)[0] || "")
  return (
    <div className="flex items-center gap-2.5 rounded-[10px] border border-white/[0.06] bg-white/[0.025] px-3 py-2 my-2 group">
      <div className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 ${isDone ? "bg-emerald-500/10" : "bg-white/[0.04]"}`}>
        <Icon className={`h-3 w-3 ${isDone ? "text-emerald-400/70" : "text-white/30"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[11.5px] text-white/40">{toolLabels[name] || name}</span>
        <span className="text-[11.5px] text-white/60 ml-1 truncate">{detail}</span>
      </div>
      {isDone ? (
        <span className="text-[9px] text-emerald-400/50 font-medium uppercase tracking-wider">Done</span>
      ) : (
        <div className="h-3 w-3 border-2 border-white/15 border-t-white/40 rounded-full animate-spin" />
      )}
    </div>
  )
}

/* ── Copy button ── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 flex items-center justify-center rounded-md hover:bg-white/[0.06]"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-400/60" /> : <Copy className="h-3 w-3 text-white/25" />}
    </button>
  )
}

/* ── Message parts renderer ── */
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

/* ── Get all text from a message ── */
function getMessageText(msg: UIMessage): string {
  return msg.parts?.filter(p => p.type === "text").map(p => (p as { text: string }).text).join("\n") || ""
}

/* ── Count tool calls in a message ── */
function countTools(msg: UIMessage): number {
  return msg.parts?.filter(p => p.type?.startsWith("tool-")).length || 0
}

export function MinervaChat({ open, onClose, initialMessage }: MinervaChatProps) {
  const pathname = usePathname()
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const sentInitial = useRef(false)
  const [inputValue, setInputValue] = useState("")
  const [showScrollBtn, setShowScrollBtn] = useState(false)

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

  /* Auto-scroll */
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isStreaming])

  /* Track scroll position for scroll-to-bottom button */
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handler = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80
      setShowScrollBtn(!atBottom && messages.length > 0)
    }
    el.addEventListener("scroll", handler)
    return () => el.removeEventListener("scroll", handler)
  }, [messages.length])

  /* Send initial message */
  useEffect(() => {
    if (open && initialMessage && !sentInitial.current && messages.length === 0) {
      sentInitial.current = true
      sendMessage({ text: initialMessage })
    }
  }, [open, initialMessage])

  useEffect(() => { if (!open) sentInitial.current = false }, [open])
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 300) }, [open])

  const handleSend = useCallback((text?: string) => {
    const msg = text || inputValue.trim()
    if (msg && !isStreaming) {
      sendMessage({ text: msg })
      setInputValue("")
    }
  }, [inputValue, isStreaming, sendMessage])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }, [handleSend])

  /* Auto-resize textarea */
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px"
    }
  }, [inputValue])

  /* AI navigation actions */
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
          {isStreaming && <span className="text-[10px] text-white/25 ml-1">streaming...</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/20 font-mono">{pathname}</span>
          <button onClick={onClose} className="text-white/25 hover:text-white/60 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-5 relative" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>
        {/* Empty state with suggestions */}
        {messages.length === 0 && !isStreaming && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-5">
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white/25" />
              </div>
              <p className="text-[13px] text-white/35 max-w-[260px]">Ask about audiences, campaigns, or consumer profiles. I can navigate the dashboard and pull data for you.</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-[320px]">
              {suggestions.map((s) => (
                <button key={s} onClick={() => handleSend(s)}
                  className="text-[11.5px] text-white/50 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg px-3 py-1.5 transition-colors text-left">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={msg.id} className={msg.role === "user" ? "flex justify-end" : "group"}>
            {msg.role === "user" ? (
              <div className="max-w-[85%] rounded-2xl bg-white/[0.06] border border-white/[0.06] px-4 py-2.5 text-[13.5px] text-white/88 leading-relaxed">
                {msg.parts?.map((p, i) => p.type === "text" ? <span key={i}>{p.text}</span> : null)}
              </div>
            ) : (
              <div className="relative">
                {/* AI avatar + tool count */}
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="h-5 w-5 rounded-md bg-white/[0.04] flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white/30" />
                  </div>
                  <span className="text-[10px] text-white/25 font-medium uppercase tracking-wider">Minerva</span>
                  {countTools(msg) > 0 && (
                    <span className="text-[9px] text-white/20 bg-white/[0.04] rounded px-1.5 py-0.5">{countTools(msg)} tool{countTools(msg) > 1 ? "s" : ""}</span>
                  )}
                  {/* Copy button */}
                  <div className="ml-auto"><CopyButton text={getMessageText(msg)} /></div>
                </div>
                {/* Message content */}
                <div className="text-[13.5px] text-white/82 leading-[1.65] pl-[26px]">
                  <MessageParts message={msg} />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Streaming indicator */}
        {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex items-center gap-2 py-2 pl-[26px]">
            <div className="flex gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="h-1.5 w-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="h-1.5 w-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-[11px] text-white/25">Thinking...</span>
          </div>
        )}
      </div>

      {/* Scroll to bottom */}
      {showScrollBtn && (
        <div className="absolute bottom-[80px] left-1/2 -translate-x-1/2 z-20">
          <button onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })}
            className="h-7 w-7 rounded-full bg-white/10 border border-white/[0.08] flex items-center justify-center hover:bg-white/15 transition-colors backdrop-blur-sm">
            <ArrowDown className="h-3.5 w-3.5 text-white/50" />
          </button>
        </div>
      )}

      {/* Progressive blur */}
      <div className="pointer-events-none relative -mt-10 h-10 bg-gradient-to-t from-[#0c0e1a]/80 to-transparent z-10" />

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
            className="flex-1 bg-transparent text-[13.5px] text-white/88 placeholder:text-white/20 px-4 py-3 pr-12 resize-none outline-none leading-relaxed"
            style={{ fontFamily: "'Overused Grotesk', sans-serif", scrollbarWidth: "none", maxHeight: "120px" }}
          />
          {isStreaming ? (
            <button type="button" onClick={() => stop()} className="absolute right-2 bottom-2 h-[30px] w-[30px] flex items-center justify-center rounded-full bg-white/85 text-[#0c0e1a] hover:bg-white/95 transition-all hover:scale-105">
              <Square className="h-3 w-3" />
            </button>
          ) : (
            <button type="button" onClick={() => handleSend()} disabled={!inputValue.trim()} className="absolute right-2 bottom-2 h-[30px] w-[30px] flex items-center justify-center rounded-full bg-white/85 text-[#0c0e1a] hover:bg-white/95 transition-all hover:scale-105 disabled:opacity-20 disabled:hover:scale-100">
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <p className="text-[9px] text-white/15 text-center mt-1.5">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
