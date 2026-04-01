"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp, Brain, Search, Users, BarChart3, Upload, Zap, TrendingUp, TrendingDown, X } from "lucide-react"
import ReactMarkdown from "react-markdown"

/* ═══════════════════════════════════════════════════════════
   MODE DEFINITIONS
   ═══════════════════════════════════════════════════════════ */
const modes = [
  { id: "discover", label: "Discover", icon: Brain, headline: "What should I focus on today?", placeholder: "Ask about trends, anomalies, or what needs your attention...", autoPrompt: "What should I focus on today?" },
  { id: "person-search", label: "People", icon: Search, headline: "Find anyone in 260M+ profiles.", placeholder: "Find software engineers in Miami who earn over $150K...", autoPrompt: "Find high-value prospects in South Florida" },
  { id: "audiences", label: "Audiences", icon: Users, headline: "Build intelligent audience segments.", placeholder: "Create an audience of families within 30 miles...", autoPrompt: "Show me my audience segments" },
  { id: "analytics", label: "Analytics", icon: BarChart3, headline: "Understand what's working.", placeholder: "How did our Meta retargeting campaign perform?", autoPrompt: "How are our campaigns performing this week?" },
  { id: "enrich", label: "Enrich", icon: Upload, headline: "Enrich your data at scale.", placeholder: "Enrich my Salesforce contacts with income and interests...", autoPrompt: "Enrich my contact list with consumer data" },
  { id: "activate", label: "Activate", icon: Zap, headline: "Push audiences to your channels.", placeholder: "Activate premium suite prospects on Klaviyo and Meta...", autoPrompt: "Activate premium prospects on Meta and Klaviyo" },
]

/* ═══════════════════════════════════════════════════════════
   INSIGHT CARDS DATA (from Command Center)
   ═══════════════════════════════════════════════════════════ */
const insightCards = [
  { label: "ATTENTION", value: "+18%", meaning: "Brand awareness is up meaningfully — top-of-funnel signal.", cta: "See channel breakdown" },
  { label: "PREMIUM EXPERIENCE", value: "+11%", meaning: "Strongest near-term revenue opportunity in the dataset.", cta: "Analyze in Spectrum →" },
  { label: "FAMILY AUDIENCE", value: "+14%", meaning: "Fastest-rising high-intent audience segment.", cta: "View regional data" },
  { label: "OWNED CONVERSION", value: "-4%", meaning: "Clear conversion gap between attention and owned value.", cta: "See funnel gaps" },
  { label: "SPONSOR RESONANCE", value: "+9%", meaning: "Strongest partner narrative right now.", cta: "View sponsor data" },
]

const mockPeople = [
  { name: "Carlos Mendez", title: "VP Marketing · Baptist Health", location: "Miami, FL", score: 94, status: "Season Ticket" },
  { name: "Rachel Torres", title: "Director, Partnerships · Live Nation", location: "Fort Lauderdale, FL", score: 88, status: "Active Fan" },
  { name: "David Kim", title: "CFO · Citadel Securities", location: "Miami Beach, FL", score: 91, status: "Premium Suite" },
  { name: "Maria Santos", title: "Head of Events · Hard Rock", location: "Hollywood, FL", score: 85, status: "Prospect" },
  { name: "James Chen", title: "Managing Director · JP Morgan", location: "Coral Gables, FL", score: 92, status: "Season Ticket" },
]

const mockSegments = [
  { name: "Miami Dolphins Fan Base", count: "9,193", status: "Active", change: "+3.2%" },
  { name: "Premium Upgrade Prospects", count: "1,420", status: "Active", change: "+8.1%" },
  { name: "Family Package Buyers", count: "3,100", status: "Active", change: "+14%" },
  { name: "Renewal Risk Members", count: "700", status: "Warning", change: "-2.1%" },
  { name: "High Net Worth Prospects", count: "890", status: "Active", change: "+5.4%" },
]

const mockCampaigns = [
  { name: "Player Spotlight Series", reach: "142K", ctr: "3.8%", conv: "1.2%", roas: "4.2x", trend: "up" },
  { name: "Family Weekend Promo", reach: "89K", ctr: "5.1%", conv: "2.8%", roas: "6.1x", trend: "up" },
  { name: "Premium Suite Retarget", reach: "34K", ctr: "2.9%", conv: "0.8%", roas: "3.1x", trend: "down" },
  { name: "Season Renewal Email", reach: "12K", ctr: "12.4%", conv: "4.2%", roas: "8.7x", trend: "up" },
]

/* ═══════════════════════════════════════════════════════════
   RICH CARD COMPONENTS — rendered inline in chat
   ═══════════════════════════════════════════════════════════ */

function InsightCarousel() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2" style={{ scrollbarWidth: "none" }}>
      {insightCards.map((card, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
          className="shrink-0 w-[240px] rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-sm hover:bg-white/[0.06] transition-colors cursor-pointer">
          <p className="text-[9px] font-semibold tracking-wider text-white/40 uppercase mb-2">{card.label}</p>
          <p className={`text-[28px] font-bold tracking-tight leading-none mb-3 ${card.value.startsWith("+") ? "text-sky-400" : "text-sky-400/60"}`}>{card.value}</p>
          <p className="text-[11px] text-white/50 leading-snug mb-3">{card.meaning}</p>
          <div className="pt-2 border-t border-white/[0.06]">
            <span className="text-[11px] font-medium text-sky-400/70">{card.cta}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function PeopleCards() {
  return (
    <div className="space-y-2">
      {mockPeople.map((p, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 + i * 0.08, duration: 0.35 }}
          className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 hover:bg-white/[0.06] transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-sky-400/20 to-sky-400/5 flex items-center justify-center text-[13px] font-semibold text-sky-400">{p.name.split(" ").map(n => n[0]).join("")}</div>
            <div>
              <p className="text-[13px] font-medium text-white/90">{p.name}</p>
              <p className="text-[11px] text-white/40">{p.title} · {p.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-400/10 text-sky-400">{p.status}</span>
            <span className="text-[13px] font-bold tabular-nums text-white/70">{p.score}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function SegmentCards() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {mockSegments.map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + i * 0.08, duration: 0.35 }}
          className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 hover:bg-white/[0.06] transition-colors cursor-pointer">
          <p className="text-[13px] font-medium text-white/90 mb-1">{s.name}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[22px] font-bold tracking-tight text-white">{s.count}</span>
            <span className={`text-[12px] font-medium ${s.change.startsWith("+") ? "text-sky-400" : "text-sky-400/60"}`}>{s.change}</span>
          </div>
          <span className={`text-[10px] px-1.5 py-0.5 rounded mt-2 inline-block ${s.status === "Active" ? "bg-sky-400/10 text-sky-400" : "bg-amber-400/10 text-amber-400"}`}>{s.status}</span>
        </motion.div>
      ))}
    </div>
  )
}

function CampaignTable() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }}
      className="rounded-xl border border-white/[0.08] bg-white/[0.04] overflow-hidden">
      <table className="w-full text-[12px]">
        <thead><tr className="border-b border-white/[0.06]">
          <th className="text-left px-4 py-2.5 text-[10px] uppercase tracking-wider text-white/30 font-medium">Campaign</th>
          <th className="text-right px-3 py-2.5 text-[10px] uppercase tracking-wider text-white/30 font-medium">Reach</th>
          <th className="text-right px-3 py-2.5 text-[10px] uppercase tracking-wider text-white/30 font-medium">CTR</th>
          <th className="text-right px-3 py-2.5 text-[10px] uppercase tracking-wider text-white/30 font-medium">Conv</th>
          <th className="text-right px-3 py-2.5 text-[10px] uppercase tracking-wider text-white/30 font-medium">ROAS</th>
        </tr></thead>
        <tbody>{mockCampaigns.map((c, i) => (
          <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 + i * 0.08 }}
            className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors cursor-pointer">
            <td className="px-4 py-2.5 font-medium text-white/80 flex items-center gap-2">
              {c.trend === "up" ? <TrendingUp className="h-3 w-3 text-sky-400" /> : <TrendingDown className="h-3 w-3 text-sky-400/50" />}{c.name}
            </td>
            <td className="text-right px-3 py-2.5 text-white/60 tabular-nums">{c.reach}</td>
            <td className="text-right px-3 py-2.5 text-white/60 tabular-nums">{c.ctr}</td>
            <td className="text-right px-3 py-2.5 text-white/60 tabular-nums">{c.conv}</td>
            <td className="text-right px-3 py-2.5 font-semibold text-sky-400 tabular-nums">{c.roas}</td>
          </motion.tr>
        ))}</tbody>
      </table>
    </motion.div>
  )
}

function EnrichCard() {
  const fields = [
    { label: "Income Band", match: "94%", icon: "💰" },
    { label: "Home Ownership", match: "91%", icon: "🏠" },
    { label: "Purchase Intent", match: "87%", icon: "🛒" },
    { label: "Interest Graph", match: "82%", icon: "🎯" },
    { label: "Social Presence", match: "78%", icon: "📱" },
  ]
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }}
      className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-4">
        <div><p className="text-[14px] font-semibold text-white/90">Enrichment Preview</p>
          <p className="text-[11px] text-white/40 mt-0.5">2,340 contacts · 5 new fields</p></div>
        <div className="px-3 py-1.5 rounded-lg bg-sky-400/10 text-sky-400 text-[12px] font-medium">Ready to enrich</div>
      </div>
      <div className="space-y-2">{fields.map((f, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.06 }}
          className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
          <div className="flex items-center gap-2"><span>{f.icon}</span><span className="text-[13px] text-white/70">{f.label}</span></div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 rounded-full bg-white/[0.06] overflow-hidden"><div className="h-full rounded-full bg-sky-400/50" style={{ width: f.match }} /></div>
            <span className="text-[11px] text-white/50 tabular-nums w-8 text-right">{f.match}</span>
          </div>
        </motion.div>
      ))}</div>
    </motion.div>
  )
}

function ActivateCard() {
  const channels = [
    { name: "Meta Ads", count: "1,420", status: "Syncing", pct: 65 },
    { name: "Klaviyo", count: "1,420", status: "Queued", pct: 0 },
    { name: "Google Ads", count: "890", status: "Ready", pct: 100 },
  ]
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }}
      className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-4">
        <div><p className="text-[14px] font-semibold text-white/90">Activation Status</p>
          <p className="text-[11px] text-white/40 mt-0.5">Premium Suite Prospects · 1,420 profiles</p></div>
      </div>
      <div className="space-y-3">{channels.map((ch, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.1 }}
          className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-medium text-white/80">{ch.name}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded ${ch.status === "Syncing" ? "bg-sky-400/10 text-sky-400" : ch.status === "Ready" ? "bg-emerald-400/10 text-emerald-400" : "bg-white/5 text-white/40"}`}>{ch.status} · {ch.count}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${ch.pct}%` }} transition={{ delay: 0.9 + i * 0.15, duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-sky-400/60" />
          </div>
        </motion.div>
      ))}</div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MOCK RESPONSES — per mode
   ═══════════════════════════════════════════════════════════ */
interface ChatMsg { id: string; role: "user" | "assistant"; text?: string; widget?: React.ReactNode }

const mockResponses: Record<string, { text: string; widget?: () => React.ReactNode }> = {
  discover: {
    text: "Here's your morning intelligence brief. **5 signals** surfaced overnight — attention is up strongly, but owned conversion needs work. The family audience is your fastest-growing segment.",
    widget: () => <InsightCarousel />,
  },
  "person-search": {
    text: "Found **5 high-value prospects** in South Florida matching your criteria. Each scored above 85 on purchase propensity. Here are the top matches:",
    widget: () => <PeopleCards />,
  },
  audiences: {
    text: "You have **5 active audience segments** totaling 15,303 profiles. Family Package Buyers (+14%) and Premium Upgrade Prospects (+8.1%) are your fastest movers this week.",
    widget: () => <SegmentCards />,
  },
  analytics: {
    text: "Campaign performance this week shows **Family Weekend Promo** leading on ROAS at 6.1x. Season Renewal Email has the highest CTR at 12.4%. Premium Suite retargeting is underperforming — consider refreshing creative.",
    widget: () => <CampaignTable />,
  },
  enrich: {
    text: "I've prepared an enrichment preview for your 2,340 Salesforce contacts. **5 new consumer fields** are available with high match rates across the board.",
    widget: () => <EnrichCard />,
  },
  activate: {
    text: "Activating **Premium Suite Prospects** (1,420 profiles) across your connected channels. Google Ads is ready, Meta is syncing now, and Klaviyo is queued next.",
    widget: () => <ActivateCard />,
  },
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export function HomeContent() {
  const [activeMode, setActiveMode] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const mode = modes[activeMode]
  const hasChat = chatMessages.length > 0

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages, isTyping])

  const sendMock = useCallback((userText: string, modeId: string) => {
    const uid = "u-" + Date.now()
    setChatMessages(prev => [...prev, { id: uid, role: "user", text: userText }])
    setIsTyping(true)

    // Simulate streaming delay
    setTimeout(() => {
      const resp = mockResponses[modeId] || mockResponses.discover
      const aid = "a-" + Date.now()
      setChatMessages(prev => [...prev, { id: aid, role: "assistant", text: resp.text, widget: resp.widget?.() }])
      setIsTyping(false)
    }, 1200)
  }, [])

  const handleSend = useCallback(() => {
    const text = inputValue.trim()
    if (!text) return
    setInputValue("")

    sendMock(text, mode.id)
  }, [inputValue, sendMock, mode.id])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleModeClick = (index: number) => {
    setActiveMode(index)
    setInputValue("")
    // Auto-send the mode's prompt
    const m = modes[index]
    sendMock(m.autoPrompt, m.id)
  }

  const hasContent = inputValue.trim().length > 0

  return (
    <div className="mn-home flex flex-col min-h-screen -mt-9">
      <div className={`mn-home-content relative z-10 flex flex-1 flex-col px-6 transition-all duration-700 ${hasChat ? "pt-6" : "items-center justify-center pt-9"}`}>

        {/* ═══ HERO ═══ */}
        <AnimatePresence>
          {!hasChat && (
            <motion.div key="hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center w-full max-w-2xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.h1 key={mode.id} initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }} className="text-2xl font-bold tracking-tight sm:text-3xl text-white mb-6">
                  {mode.headline}
                </motion.h1>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ CHAT MESSAGES ═══ */}
        <AnimatePresence>
          {hasChat && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 overflow-y-auto w-full max-w-3xl mx-auto pb-4 space-y-5" style={{ scrollbarWidth: "none" }}>
              {chatMessages.map((msg, i) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i === chatMessages.length - 1 ? 0.1 : 0 }}>
                  {msg.role === "user" ? (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl bg-white/[0.08] border border-white/[0.08] px-4 py-3 text-[14px] text-white/90 leading-relaxed">{msg.text}</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-[14px] text-white/80 leading-relaxed prose prose-invert prose-sm prose-p:my-1.5 prose-strong:text-white/95">
                        <ReactMarkdown>{msg.text || ""}</ReactMarkdown>
                      </div>
                      {msg.widget && <div className="mt-3">{msg.widget}</div>}
                    </div>
                  )}
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1.5 py-2 px-1">
                  {[0, 1, 2].map((j) => (
                    <motion.div key={j} className="h-1.5 w-1.5 rounded-full bg-white/30"
                      animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: j * 0.2 }} />
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
          {hasChat && (
            <div className="flex justify-center mb-2">
              <button onClick={() => { setChatMessages([]); setActiveMode(0) }}
                className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors">
                <X className="h-3 w-3" /> New conversation
              </button>
            </div>
          )}
          <div className="flex items-center rounded-full border bg-white/[0.06] border-white/[0.10] hover:border-white/20 focus-within:border-white/25 backdrop-blur-sm transition-all duration-200 px-5 py-3 gap-3">
            <input ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown} placeholder={hasChat ? "Ask a follow-up..." : mode.placeholder}
              className="mn-chat-textarea flex-1 bg-transparent border-0 outline-none text-[15px] text-white placeholder:text-white/30" />
            <button onClick={handleSend} disabled={!hasContent}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all ${hasContent ? "bg-white text-black" : "bg-white/10 text-white/30"}`}>
              <ArrowUp className="h-4 w-4" />
            </button>
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
    </div>
  )
}
