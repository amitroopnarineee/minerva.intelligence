"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { useChat } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import { usePathname, useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { Sparkles, ArrowUp, Square, Navigation, User, Users, Megaphone, X, Copy, Check, ArrowDown } from "lucide-react"
import { findDemoResponse, DemoResponsePlayer, type DemoResponse } from "@/components/chat/DemoResponses"

interface MinervaChatProps {
  open: boolean
  onClose: () => void
  initialMessage?: string | null
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content?: string
  demo?: DemoResponse      // pre-built rich response
  parts?: UIMessage["parts"] // live API response
}

const suggestions = [
  "What should I focus on today?",
  "Look up Marcus Johnson",
  "How is the Premium Suites campaign?",
  "Who are our renewal risk members?",
]

/* ── Live API message parts (fallback) ── */
function LiveMessageParts({ message }: { message: UIMessage }) {
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
            const detail = String(Object.values(p.input)[0] || "")
            const isDone = p.state === "result"
            return (
              <div key={i} className="flex items-center gap-2.5 rounded-[10px] border border-white/[0.06] bg-white/[0.025] px-3 py-2 my-1.5">
                <div className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 ${isDone ? "bg-emerald-500/10" : "bg-white/[0.04]"}`}>
                  {isDone ? <Check className="h-3 w-3 text-emerald-400/70" /> : <Sparkles className="h-3 w-3 text-white/30" />}
                </div>
                <span className="text-[11.5px] text-white/45 truncate">{p.toolName}: <span className="text-white/60">{detail}</span></span>
                {isDone ? <span className="ml-auto text-[9px] text-emerald-400/50 font-medium uppercase tracking-wider">Done</span> : <div className="ml-auto h-3 w-3 border-2 border-white/15 border-t-white/40 rounded-full animate-spin" />}
              </div>
            )
          }
        }
        return null
      })}
    </>
  )
}

/* ── Copy button ── */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 flex items-center justify-center rounded-md hover:bg-white/[0.06]">
      {copied ? <Check className="h-3 w-3 text-emerald-400/60" /> : <Copy className="h-3 w-3 text-white/25" />}
    </button>
  )
}

export function MinervaChat({ open, onClose, initialMessage }: MinervaChatProps) {
  const pathname = usePathname()
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const sentInitial = useRef(false)
  const [inputValue, setInputValue] = useState("")
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  // Dual message list: demo + live
  const [demoMessages, setDemoMessages] = useState<ChatMessage[]>([])

  // Live API chat (fallback)
  const { messages: liveMessages, sendMessage: liveSend, status: liveStatus, stop: liveStop } = useChat({
    onToolCall: ({ toolCall }) => {
      const tc = toolCall as unknown as { toolName: string; input: Record<string, unknown> }
      const args = tc.input || {}
      if (tc.toolName === "navigateTo" && args.route) router.push(args.route as string)
      if (tc.toolName === "openPersonProfile" && args.personId) {
        router.push("/person-search")
        setTimeout(() => window.dispatchEvent(new CustomEvent("minerva-open-person", { detail: { personId: args.personId } })), 500)
      }
    },
  })

  const isStreaming = liveStatus === "streaming" || liveStatus === "submitted"

  // Combined message list: demo messages first, then any live API messages
  const allMessages: ChatMessage[] = [...demoMessages]
  // Add live messages that aren't already tracked
  liveMessages.forEach(lm => {
    if (!allMessages.find(m => m.id === lm.id)) {
      allMessages.push({ id: lm.id, role: lm.role as "user" | "assistant", parts: lm.parts })
    }
  })

  /* Auto-scroll */
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [allMessages.length, isStreaming, demoMessages])

  /* Scroll button */
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handler = () => setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 80)
    el.addEventListener("scroll", handler)
    return () => el.removeEventListener("scroll", handler)
  }, [allMessages.length])

  /* Send initial message */
  useEffect(() => {
    if (open && initialMessage && !sentInitial.current && allMessages.length === 0) {
      sentInitial.current = true
      handleSend(initialMessage)
    }
  }, [open, initialMessage])

  useEffect(() => { if (!open) sentInitial.current = false }, [open])
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 300) }, [open])

  /* Auto-resize textarea */
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px"
    }
  }, [inputValue])

  const handleSend = useCallback((text?: string) => {
    const msg = text || inputValue.trim()
    if (!msg || isStreaming) return
    setInputValue("")

    // Check for demo response first
    const demo = findDemoResponse(msg)

    if (demo) {
      const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: "user", content: msg }
      const aiMsg: ChatMessage = { id: `ai-${Date.now()}`, role: "assistant", demo }
      setDemoMessages(prev => [...prev, userMsg, aiMsg])

      // Fire navigation/actions
      if (demo.navigate) {
        setTimeout(() => router.push(demo.navigate!), 800)
      }
      if (demo.actions) {
        demo.actions.forEach((action, i) => {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("minerva-action", { detail: { type: action.type, personId: action.id, audienceId: action.id, campaignId: action.id } }))
          }, 1500 + i * 600)
        })
      }
    } else {
      // Fallback to live API
      const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: "user", content: msg }
      setDemoMessages(prev => [...prev, userMsg])
      liveSend({ text: msg })
    }
  }, [inputValue, isStreaming, liveSend, router])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }, [handleSend])

  if (!open) return null

  return (
    <div className="mn-chat-panel mn-chat-root h-full flex flex-col border-l border-white/[0.06] bg-[#0c0e1a]/60 backdrop-blur-xl">
      {/* Header */}
      <div className="mn-chat-header flex items-center justify-between px-4 py-3 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2">
          <div className="mn-chat-status-dot h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="mn-chat-title text-[13px] font-medium text-white/80 tracking-[-0.01em]" style={{ fontFamily: "'Overused Grotesk', sans-serif" }}>Minerva AI</span>
          {isStreaming && <span className="mn-chat-streaming-indicator text-[10px] text-white/25 ml-1">streaming...</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/20 font-mono">{pathname}</span>
          <button onClick={onClose} className="mn-chat-close-btn text-white/25 hover:text-white/60 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="mn-chat-messages flex-1 overflow-y-auto px-4 py-4 space-y-5" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>
        {/* Empty state */}
        {allMessages.length === 0 && !isStreaming && (
          <div className="mn-chat-empty flex flex-col items-center justify-center h-full text-center gap-5">
            <div className="flex flex-col items-center gap-2">
              <div className="mn-chat-empty-icon h-10 w-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white/25" />
              </div>
              <p className="text-[13px] text-white/35 max-w-[260px]">Ask about audiences, campaigns, or consumer profiles. I can navigate the dashboard for you.</p>
            </div>
            <div className="mn-chat-suggestions flex flex-wrap gap-2 justify-center max-w-[320px]">
              {suggestions.map((s) => (
                <button key={s} onClick={() => handleSend(s)}
                  className="mn-chat-suggestion-chip text-[11.5px] text-white/50 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg px-3 py-1.5 transition-colors text-left">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {allMessages.map((msg) => (
          <div key={msg.id} className={msg.role === "user" ? "flex justify-end" : "group"}>
            {msg.role === "user" ? (
              <div className="mn-chat-user-msg max-w-[85%] rounded-2xl bg-white/[0.06] border border-white/[0.06] px-4 py-2.5 text-[13.5px] text-white/88 leading-relaxed">
                {msg.content || msg.parts?.filter(p => p.type === "text").map((p, i) => <span key={i}>{(p as {text:string}).text}</span>)}
              </div>
            ) : (
              <div className="mn-chat-ai-msg relative">
                <div className="mn-chat-ai-header flex items-center gap-1.5 mb-2">
                  <div className="mn-chat-ai-avatar h-5 w-5 rounded-md bg-white/[0.04] flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white/30" />
                  </div>
                  <span className="mn-chat-ai-label text-[10px] text-white/25 font-medium uppercase tracking-wider">Minerva</span>
                  <div className="ml-auto"><CopyBtn text="" /></div>
                </div>
                <div className="mn-chat-ai-content pl-[26px]">
                  {msg.demo ? (
                    <DemoResponsePlayer blocks={msg.demo.blocks} />
                  ) : msg.parts ? (
                    <div className="text-[13.5px] text-white/82 leading-[1.65]">
                      {msg.parts.map((part, i) => {
                        if (part.type === "text" && part.text) return <div key={i} className="mn-chat-markdown"><ReactMarkdown>{part.text}</ReactMarkdown></div>
                        if (part.type?.startsWith("tool-")) {
                          const p = part as unknown as { toolName?: string; state?: string; input?: Record<string, unknown> }
                          if (p.toolName && p.input) {
                            const isDone = p.state === "result"
                            return (
                              <div key={i} className="flex items-center gap-2 rounded-[10px] border border-white/[0.06] bg-white/[0.025] px-3 py-2 my-1.5">
                                <Sparkles className={`h-3 w-3 ${isDone ? "text-emerald-400/70" : "text-white/30"}`} />
                                <span className="text-[11px] text-white/45">{p.toolName}: {String(Object.values(p.input)[0])}</span>
                                {isDone ? <span className="ml-auto text-[9px] text-emerald-400/50">Done</span> : <div className="ml-auto h-3 w-3 border-2 border-white/15 border-t-white/40 rounded-full animate-spin" />}
                              </div>
                            )
                          }
                        }
                        return null
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        ))}

        {isStreaming && allMessages[allMessages.length - 1]?.role !== "assistant" && (
          <div className="mn-chat-thinking flex items-center gap-2 py-2 pl-[26px]">
            <div className="flex gap-1">
              <div className="mn-chat-thinking-dot h-1.5 w-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="mn-chat-thinking-dot h-1.5 w-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="mn-chat-thinking-dot h-1.5 w-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-[11px] text-white/25">Thinking...</span>
          </div>
        )}
      </div>

      {/* Scroll to bottom */}
      {showScrollBtn && (
        <div className="absolute bottom-[80px] right-8 z-20">
          <button onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })}
            className="mn-chat-scroll-btn h-7 w-7 rounded-full bg-white/10 border border-white/[0.08] flex items-center justify-center hover:bg-white/15 transition-colors backdrop-blur-sm">
            <ArrowDown className="h-3.5 w-3.5 text-white/50" />
          </button>
        </div>
      )}

      {/* Progressive blur */}
      <div className="mn-chat-blur pointer-events-none relative -mt-10 h-10 bg-gradient-to-t from-[#0c0e1a]/80 to-transparent z-10" />

      {/* Input */}
      <div className="mn-chat-input-area shrink-0 px-3 pb-3 pt-1 relative z-20">
        <div className="mn-chat-input-box relative flex items-end rounded-[14px] border border-white/[0.08] bg-white/[0.04] transition-colors focus-within:border-white/[0.15]">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Minerva anything..."
            rows={1}
            className="mn-chat-textarea flex-1 bg-transparent text-[13.5px] text-white/88 placeholder:text-white/20 px-4 py-3 pr-12 resize-none outline-none leading-relaxed"
            style={{ fontFamily: "'Overused Grotesk', sans-serif", scrollbarWidth: "none", maxHeight: "120px" }}
          />
          {isStreaming ? (
            <button type="button" onClick={() => liveStop()} className="absolute right-2 bottom-2 h-[30px] w-[30px] flex items-center justify-center rounded-full bg-white/85 text-[#0c0e1a] hover:bg-white/95 transition-all hover:scale-105">
              <Square className="h-3 w-3" />
            </button>
          ) : (
            <button type="button" onClick={() => handleSend()} disabled={!inputValue.trim()} className="absolute right-2 bottom-2 h-[30px] w-[30px] flex items-center justify-center rounded-full bg-white/85 text-[#0c0e1a] hover:bg-white/95 transition-all hover:scale-105 disabled:opacity-20 disabled:hover:scale-100">
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <p className="mn-chat-hint text-[9px] text-white/15 text-center mt-1.5">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
