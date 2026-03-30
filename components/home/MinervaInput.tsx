"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, ArrowUp, Sparkles, Search, Users, BarChart3, Zap, Upload, Target, Brain } from "lucide-react"

interface MinervaMode {
  id: string
  label: string
  icon: React.ElementType
  headline: string
  subtitle: string
  placeholder: string
  chips: { icon: React.ElementType; label: string }[]
}

const modes: MinervaMode[] = [
  {
    id: "discover",
    label: "Discover",
    icon: Brain,
    headline: "What should I focus on today?",
    subtitle: "Minerva will surface the most important signals, opportunities, and actions from your data.",
    placeholder: "Ask about trends, anomalies, or what needs your attention...",
    chips: [
      { icon: Sparkles, label: "What changed overnight?" },
      { icon: Target, label: "Top revenue opportunities" },
      { icon: BarChart3, label: "Campaign health check" },
      { icon: Users, label: "At-risk audience segments" },
    ],
  },
  {
    id: "person-search",
    label: "People",
    icon: Search,
    headline: "Find anyone in 260M+ profiles.",
    subtitle: "Search by demographics, career, interests, financials, and more. AI-powered natural language queries.",
    placeholder: "Find software engineers in Miami who earn over $150K and attended a Dolphins game...",
    chips: [
      { icon: Search, label: "High earners near Hard Rock Stadium" },
      { icon: Users, label: "Corporate decision-makers in South Florida" },
      { icon: Target, label: "Lapsed season ticket holders" },
      { icon: Sparkles, label: "Lookalikes of top 100 spenders" },
    ],
  },
  {
    id: "audiences",
    label: "Audiences",
    icon: Users,
    headline: "Build intelligent audience segments.",
    subtitle: "Create predictive, behavioral, and lookalike audiences from your first-party and enriched data.",
    placeholder: "Create an audience of families within 30 miles who've browsed ticket pages...",
    chips: [
      { icon: Users, label: "Premium suite prospects" },
      { icon: Target, label: "Lookalike from top spenders" },
      { icon: Zap, label: "Win-back: 6+ month lapsed fans" },
      { icon: Sparkles, label: "High-propensity new buyers" },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    headline: "Understand what's working.",
    subtitle: "Deep-dive into campaign performance, audience ROI, channel attribution, and conversion trends.",
    placeholder: "How did our Meta retargeting campaign perform vs last month?",
    chips: [
      { icon: BarChart3, label: "ROAS by channel this week" },
      { icon: Target, label: "Best performing audience" },
      { icon: Sparkles, label: "Revenue attribution breakdown" },
      { icon: Zap, label: "Underperforming campaigns" },
    ],
  },
  {
    id: "enrich",
    label: "Enrich",
    icon: Upload,
    headline: "Enrich your data at scale.",
    subtitle: "Upload a CSV or connect your CRM. Minerva appends 300+ attributes from our consumer graph.",
    placeholder: "Enrich my Salesforce contacts with income, interests, and purchase behavior...",
    chips: [
      { icon: Upload, label: "Upload CSV for enrichment" },
      { icon: Users, label: "Enrich CRM contacts" },
      { icon: Sparkles, label: "Append lifestyle attributes" },
      { icon: Target, label: "Score propensity to buy" },
    ],
  },
  {
    id: "activate",
    label: "Activate",
    icon: Zap,
    headline: "Push audiences to your channels.",
    subtitle: "Send segments directly to Klaviyo, Meta, Google, Twilio, or any connected destination.",
    placeholder: "Activate the premium suite prospects segment on Klaviyo and Meta Ads...",
    chips: [
      { icon: Zap, label: "Sync to Klaviyo" },
      { icon: Target, label: "Push to Meta Ads" },
      { icon: Users, label: "Send to Twilio SMS" },
      { icon: Sparkles, label: "Multi-channel activation" },
    ],
  },
]

interface MinervaInputProps {
  onSend?: (message: string, mode: string) => void
  isDark?: boolean
}

export function MinervaInput({ onSend, isDark = true }: MinervaInputProps) {
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

  const hasContent = message.trim().length > 0

  // Theme-aware colors
  const bg = isDark ? "bg-white/[0.08] border-white/[0.12] hover:border-white/20 focus-within:border-white/25" : "bg-black/[0.04] border-black/[0.08] hover:border-black/15 focus-within:border-black/20"
  const textColor = isDark ? "text-white placeholder:text-white/30" : "text-black placeholder:text-black/30"
  const iconMuted = isDark ? "text-white/40 hover:text-white/70" : "text-black/30 hover:text-black/60"
  const sendActive = isDark ? "bg-white text-black" : "bg-black text-white"
  const sendInactive = isDark ? "bg-white/10 text-white/30" : "bg-black/10 text-black/30"
  const pillBase = isDark ? "border-white/10 text-white/40" : "border-black/10 text-black/30"
  const pillActive = isDark ? "border-white/30 text-white bg-white/10" : "border-black/30 text-black bg-black/[0.06]"
  const chipStyle = isDark
    ? "border-white/10 text-white/50 hover:text-white/80 hover:border-white/25 hover:bg-white/[0.05]"
    : "border-black/10 text-black/40 hover:text-black/70 hover:border-black/20 hover:bg-black/[0.03]"

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Mode switcher */}
      <div className="flex items-center justify-center gap-1 mb-6">
        {modes.map((m, i) => {
          const Icon = m.icon
          const isActive = i === activeMode
          return (
            <button
              key={m.id}
              onClick={() => { setActiveMode(i); setMessage("") }}
              className={`relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 ${isActive ? pillActive : pillBase} hover:opacity-100`}
            >
              <Icon className="h-3 w-3" />
              <span className="hidden sm:inline">{m.label}</span>
              {isActive && (
                <motion.div
                  layoutId="mode-indicator"
                  className={`absolute inset-0 rounded-full border ${isDark ? "border-white/30" : "border-black/25"}`}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Animated headline + subtitle */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode.id}
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8"
        >
          <h2 className={`text-xl font-semibold tracking-tight sm:text-2xl ${isDark ? "text-white" : "text-black"}`}>
            {mode.headline}
          </h2>
          <p className={`mt-2 text-sm max-w-md mx-auto leading-relaxed ${isDark ? "text-white/50" : "text-black/40"}`}>
            {mode.subtitle}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Input */}
      <div className={`flex flex-col rounded-2xl border backdrop-blur-sm transition-all duration-200 ${bg}`}>
        <div className="flex flex-col px-4 pt-4 pb-3 gap-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode.id + "-input"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="min-h-[2.5rem]"
            >
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

      {/* Animated chips */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode.id + "-chips"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="flex flex-wrap justify-center gap-2 mt-5"
        >
          {mode.chips.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setMessage(label)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-all ${chipStyle}`}
            >
              <Icon className="h-3 w-3" />
              {label}
            </button>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
