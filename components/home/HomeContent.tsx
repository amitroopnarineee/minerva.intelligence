"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useChat } from "@ai-sdk/react"
import { Plus, ArrowUp, Brain, Search, Users, BarChart3, Upload, Zap, Sparkles } from "lucide-react"
import { AudienceSpectrum } from "@/components/shared/AudienceSpectrum"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"

const modes = [
  { id: "discover", label: "Discover", icon: Brain, headline: "What should I focus on today?", placeholder: "Ask about trends, anomalies, or what needs your attention..." },
  { id: "person-search", label: "People", icon: Search, headline: "Find anyone in 260M+ profiles.", placeholder: "Find software engineers in Miami who earn over $150K..." },
  { id: "audiences", label: "Audiences", icon: Users, headline: "Build intelligent audience segments.", placeholder: "Create an audience of families within 30 miles..." },
  { id: "analytics", label: "Analytics", icon: BarChart3, headline: "Understand what's working.", placeholder: "How did our Meta retargeting campaign perform?" },
  { id: "enrich", label: "Enrich", icon: Upload, headline: "Enrich your data at scale.", placeholder: "Enrich my Salesforce contacts with income and interests..." },
  { id: "activate", label: "Activate", icon: Zap, headline: "Push audiences to your channels.", placeholder: "Activate premium suite prospects on Klaviyo and Meta..." },
]

export function HomeContent() {
  const [activeMode, setActiveMode] = useState(0)
  const [showSpectrum, setShowSpectrum] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const mode = modes[activeMode]

  const { messages, sendMessage, status } = useChat()
  const hasChat = messages.length > 0
  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px"
    }
  }, [inputValue])

  useEffect(() => {
    if (hasChat) chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, hasChat])

  const handleSend = useCallback(() => {
    const text = inputValue.trim()
    if (!text) return
    setInputValue("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
    sendMessage({ text })
  }, [inputValue, sendMessage])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleModeClick = (index: number) => {
    setActiveMode(index)
    setInputValue("")
    if (modes[index].id === "audiences") setShowSpectrum(true)
  }

  const handleSpectrumSave = useCallback(() => {
    toast.success("Segment saved", { description: "Your audience segment has been saved.", duration: 4000 })
  }, [])

  const hasContent = inputValue.trim().length > 0

  return (
    <div className="mn-home flex flex-col min-h-screen -mt-9">
      <div className={`mn-home-content relative z-10 flex flex-1 flex-col px-6 transition-all duration-700 ${hasChat ? "pt-6" : "items-center justify-center pt-9"}`}>

        {/* ═══ HERO — fades up and out on first send ═══ */}
        <AnimatePresence>
          {!hasChat && (
            <motion.div key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center w-full max-w-2xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.h1 key={mode.id}
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-bold tracking-tight sm:text-3xl text-white mb-6">
                  {mode.headline}
                </motion.h1>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ CHAT MESSAGES — inline stream ═══ */}
        <AnimatePresence>
          {hasChat && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto pb-4 space-y-5"
              style={{ scrollbarWidth: "none" }}>
              {messages.map((msg, i) => (
                <motion.div key={msg.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i === messages.length - 1 ? 0.1 : 0 }}
                  className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  {msg.role === "user" ? (
                    <div className="max-w-[80%] rounded-2xl bg-white/[0.08] border border-white/[0.08] px-4 py-3 text-[14px] text-white/90 leading-relaxed">
                      {msg.parts?.filter((p: any) => p.type === "text").map((p: any, j: number) => <span key={j}>{p.text}</span>)}
                    </div>
                  ) : (
                    <div className="max-w-[90%] text-[14px] text-white/80 leading-relaxed prose prose-invert prose-sm prose-p:my-1.5 prose-headings:text-white prose-strong:text-white/95">
                      {msg.parts?.filter((p: any) => p.type === "text").map((p: any, j: number) => <ReactMarkdown key={j}>{p.text}</ReactMarkdown>)}
                    </div>
                  )}
                </motion.div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1.5 py-2 px-1">
                  {[0, 1, 2].map((j) => (
                    <motion.div key={j} className="h-1.5 w-1.5 rounded-full bg-white/30"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: j * 0.2 }} />
                  ))}
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ INPUT BAR ═══ */}
        <motion.div layout transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full max-w-2xl mx-auto ${hasChat ? "shrink-0 pb-4 pt-2" : ""}`}>
          <div className="flex flex-col rounded-2xl border bg-white/[0.08] border-white/[0.12] hover:border-white/20 focus-within:border-white/25 backdrop-blur-sm transition-all duration-200">
            <div className="flex flex-col px-4 pt-4 pb-3 gap-2">
              <div className="min-h-[1.5em]">
                <textarea ref={textareaRef} value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown}
                  placeholder={hasChat ? "Ask a follow-up..." : mode.placeholder}
                  className="mn-chat-textarea w-full bg-transparent border-0 outline-none text-[15px] resize-none overflow-hidden leading-relaxed text-white placeholder:text-white/30"
                  rows={1} style={{ minHeight: "1.5em" }} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white/70 transition-colors"><Plus className="h-5 w-5" /></button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white/70 transition-colors"><Sparkles className="h-4 w-4" /></button>
                </div>
                <button onClick={handleSend} disabled={!hasContent}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${hasContent ? "bg-white text-black" : "bg-white/10 text-white/30"}`}>
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mode chips — hero only */}
          <AnimatePresence>
            {!hasChat && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}
                className="flex items-center justify-center gap-1 mt-5">
                {modes.map((m, i) => {
                  const Icon = m.icon
                  const isActive = i === activeMode
                  return (
                    <button key={m.id} onClick={() => handleModeClick(i)}
                      className={`relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 ${isActive ? "border-white/30 text-white bg-white/10" : "border-white/10 text-white/40"} hover:opacity-100`}>
                      <Icon className="h-3 w-3" />
                      <span className="hidden sm:inline">{m.label}</span>
                      {isActive && <motion.div layoutId="mode-pill" className="absolute inset-0 rounded-full border border-white/30" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                    </button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Footer — hero only */}
      <AnimatePresence>
        {!hasChat && (
          <motion.div exit={{ opacity: 0 }} className="relative z-10 pb-6 pt-4">
            <p className="text-center text-[11px] text-white/25">© 2026 Minerva Intelligence. All rights reserved.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {showSpectrum && <AudienceSpectrum onClose={() => setShowSpectrum(false)} onSave={handleSpectrumSave} />}
    </div>
  )
}
