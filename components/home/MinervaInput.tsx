"use client"

import React, { useState, useRef, useEffect } from "react"
import { Plus, ArrowUp, Sparkles, Search, Users, BarChart3, Zap } from "lucide-react"

interface MinervaInputProps {
  onSend?: (message: string) => void
  isDark?: boolean
}

export function MinervaInput({ onSend, isDark = true }: MinervaInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px"
    }
  }, [message])

  const handleSend = () => {
    if (!message.trim()) return
    onSend?.(message)
    setMessage("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const hasContent = message.trim().length > 0

  const bg = isDark ? "bg-white/[0.08] border-white/[0.12] hover:border-white/20 focus-within:border-white/25" : "bg-black/[0.04] border-black/[0.08] hover:border-black/15 focus-within:border-black/20"
  const textColor = isDark ? "text-white placeholder:text-white/30" : "text-black placeholder:text-black/30"
  const iconMuted = isDark ? "text-white/40 hover:text-white/70" : "text-black/30 hover:text-black/60"
  const sendActive = isDark ? "bg-white text-black" : "bg-black text-white"
  const sendInactive = isDark ? "bg-white/10 text-white/30" : "bg-black/10 text-black/30"

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className={`flex flex-col rounded-2xl border backdrop-blur-sm transition-all duration-200 ${bg}`}>
        <div className="flex flex-col px-4 pt-4 pb-3 gap-2">
          {/* Textarea */}
          <div className="min-h-[2.5rem]">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Minerva anything about your audiences..."
              className={`w-full bg-transparent border-0 outline-none text-[15px] resize-none overflow-hidden leading-relaxed ${textColor}`}
              rows={1}
              style={{ minHeight: "1.5em" }}
            />
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${iconMuted}`}>
                <Plus className="h-5 w-5" />
              </button>
              <button className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${iconMuted}`}>
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleSend}
              disabled={!hasContent}
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${hasContent ? sendActive : sendInactive}`}
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-wrap justify-center gap-2 mt-5">
        {[
          { icon: Search, label: "Find high-value fans" },
          { icon: Users, label: "Build an audience" },
          { icon: BarChart3, label: "Analyze campaigns" },
          { icon: Zap, label: "Activate a segment" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            onClick={() => setMessage(label)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-all ${
              isDark
                ? "border-white/10 text-white/50 hover:text-white/80 hover:border-white/25 hover:bg-white/[0.05]"
                : "border-black/10 text-black/40 hover:text-black/70 hover:border-black/20 hover:bg-black/[0.03]"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
