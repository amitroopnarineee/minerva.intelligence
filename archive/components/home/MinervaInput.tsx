"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, ArrowUp, Sparkles, Search, Users, BarChart3, Zap, Upload, Target, Brain } from "lucide-react"

interface MinervaMode {
  id: string
  label: string
  icon: React.ElementType
  headline: string
  placeholder: string
}

const modes: MinervaMode[] = [
  { id: "discover", label: "Discover", icon: Brain, headline: "What matters today?", placeholder: "Ask about trends, anomalies, or what needs your attention..." },
  { id: "person-search", label: "People", icon: Search, headline: "260M+ profiles.", placeholder: "Find software engineers in Miami who earn over $150K and attended a Dolphins game..." },
  { id: "audiences", label: "Audiences", icon: Users, headline: "Intelligent audience segments.", placeholder: "Create an audience of families within 30 miles who've browsed ticket pages..." },
  { id: "analytics", label: "Analytics", icon: BarChart3, headline: "Understand what's working.", placeholder: "How did our Meta retargeting campaign perform vs last month?" },
  { id: "enrich", label: "Enrich", icon: Upload, headline: "Enrich your data at scale.", placeholder: "Enrich my Salesforce contacts with income, interests, and purchase behavior..." },
  { id: "activate", label: "Activate", icon: Zap, headline: "Push audiences to your channels.", placeholder: "Activate the premium suite prospects segment on Klaviyo and Meta Ads..." },
]

interface MinervaInputProps {
  onSend?: (message: string, mode: string) => void
  onModeChange?: (modeId: string) => void
}

export function MinervaInput({ onSend, onModeChange }: MinervaInputProps) {
  const [message, setMessage] = useState("")
  const [activeMode, setActiveMode] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const mode = modes[activeMode]

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px"
    }
  }, [message])

  const handleSend = () => {
    if (!message.trim()) return
    onSend?.(message, mode.id)
    setMessage("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleModeClick = (index: number) => {
    setActiveMode(index)
    setMessage("")
    onModeChange?.(modes[index].id)
  }

  const hasContent = message.trim().length > 0
  const bg = "bg-white/[0.08] border-white/[0.12] hover:border-white/20 focus-within:border-white/25"
  const textColor = "text-white placeholder:text-white/30"
  const iconMuted = "text-white/40 hover:text-white/70"
  const sendActive = "bg-white text-black"
  const sendInactive = "bg-white/10 text-white/30"
  const pillBase = "border-white/10 text-white/40"
  const pillActive = "border-white/30 text-white bg-white/10"

  return (
    <div className="mn-input-container w-full max-w-2xl mx-auto">
      {/* Animated headline */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode.id}
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
          transition={{ duration: 0.3 }}
          className="mn-input-center-1 text-center mb-6"
        >
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">
            {mode.headline}
          </h1>
        </motion.div>
      </AnimatePresence>

      {/* Input */}
      <div className={`mn-input-box flex flex-col rounded-2xl border backdrop-blur-sm transition-all duration-200 ${bg}`}>
        <div className="mn-input-group-2 flex flex-col px-4 pt-4 pb-3 gap-2">
          <AnimatePresence mode="wait">
            <motion.div key={mode.id + "-input"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: 0.1 }} className="mn-input-el-3 min-h-[2.5rem]">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={mode.placeholder}
                className={`w-full bg-transparent border-0 outline-none text-[15px] resize-none overflow-hidden leading-relaxed ${textColor}`}
                rows={1}
                style={{ minHeight: "1.5em" }}
              />
            </motion.div>
          </AnimatePresence>
          <div className="mn-input-row-4 flex items-center justify-between">
            <div className="mn-input-group-5 flex items-center gap-1">
              <button className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${iconMuted}`}><Plus className="h-5 w-5" /></button>
              <button className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${iconMuted}`}><Sparkles className="h-4 w-4" /></button>
            </div>
            <button onClick={handleSend} disabled={!hasContent} className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${hasContent ? sendActive : sendInactive}`}>
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mode switcher */}
      <div className="mn-input-group-6 flex items-center justify-center gap-1 mt-5">
        {modes.map((m, i) => {
          const Icon = m.icon
          const isActive = i === activeMode
          return (
            <button
              key={m.id}
              onClick={() => handleModeClick(i)}
              className={`relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 ${isActive ? pillActive : pillBase} hover:opacity-100`}
            >
              <Icon className="h-3 w-3" />
              <span className="mn-input-el-7 hidden sm:inline">{m.label}</span>
              {isActive && (
                <motion.div
                  layoutId="mode-indicator"
                  className="absolute inset-0 rounded-full border border-white/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
