"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp, Brain, Search, Users, BarChart3, Upload, Zap, TrendingUp, TrendingDown, X, ArrowRight } from "lucide-react"

const modes = [
  { id: "discover", label: "Discover", icon: Brain, headline: "What should I focus on today?", placeholder: "Ask about trends, anomalies, or what needs your attention..." },
  { id: "person-search", label: "People", icon: Search, headline: "Find anyone in 260M+ profiles.", placeholder: "Find software engineers in Miami who earn over $150K..." },
  { id: "audiences", label: "Audiences", icon: Users, headline: "Build intelligent audience segments.", placeholder: "Create an audience of families within 30 miles..." },
  { id: "analytics", label: "Analytics", icon: BarChart3, headline: "Understand what's working.", placeholder: "How did our Meta retargeting campaign perform?" },
  { id: "enrich", label: "Enrich", icon: Upload, headline: "Enrich your data at scale.", placeholder: "Enrich my Salesforce contacts with income and interests..." },
  { id: "activate", label: "Activate", icon: Zap, headline: "Push audiences to your channels.", placeholder: "Activate premium suite prospects on Klaviyo and Meta..." },
]

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */
const signals = [
  { label: "ATTENTION", value: "+18%", desc: "Brand awareness up across Instagram, TikTok, and owned web.", cta: "See channel breakdown" },
  { label: "PREMIUM EXPERIENCE", value: "+11%", desc: "Premium messaging creating strongest downstream ticket-intent.", cta: "Analyze in Spectrum →" },
  { label: "FAMILY AUDIENCE", value: "+14%", desc: "Family ticket consideration rose in Miami-Dade and Broward.", cta: "View regional data" },
  { label: "OWNED CONVERSION", value: "-4%", desc: "Social engagement up but owned capture still trails reach.", cta: "See funnel gaps" },
  { label: "SPONSOR RESONANCE", value: "+9%", desc: "Luxury and hospitality narratives driving sponsor value.", cta: "View sponsor data" },
]
const actions = [
  { num: "1", title: "Double down on Family Weekend", desc: "Family +14% — launch a South Florida geo-targeted variant.", urgency: "High" },
  { num: "2", title: "Fix the owned conversion gap", desc: "Attention +18% but owned CTR -4%. Rework short-form CTA.", urgency: "High" },
  { num: "3", title: "Push Premium Suite retargeting", desc: "1,420 high-propensity prospects ready. Refresh + activate.", urgency: "Medium" },
]
const metrics = [
  { label: "Total Reach", value: "284K", delta: "+12%" },
  { label: "Owned CTR", value: "1.8%", delta: "-4%" },
  { label: "Best ROAS", value: "6.1x", delta: "Family Wknd" },
  { label: "Active Segments", value: "5", delta: "15.3K profiles" },
]
const campaigns = [
  { name: "Player Spotlight Series", reach: "142K", ctr: "3.8%", roas: "4.2x", trend: "up" },
  { name: "Family Weekend Promo", reach: "89K", ctr: "5.1%", roas: "6.1x", trend: "up" },
  { name: "Premium Suite Retarget", reach: "34K", ctr: "2.9%", roas: "3.1x", trend: "down" },
  { name: "Season Renewal Email", reach: "12K", ctr: "12.4%", roas: "8.7x", trend: "up" },
]
const movers = [
  { name: "Family Package Buyers", value: "+14%", detail: "3,100 profiles · Miami-Dade & Broward" },
  { name: "Premium Suite Prospects", value: "+8.1%", detail: "1,420 profiles · Income $250K+" },
  { name: "Renewal Risk Members", value: "-2.1%", detail: "700 profiles · Churn score > 40%" },
]
const people = [
  { name: "Carlos Mendez", title: "VP Marketing · Baptist Health", loc: "Miami, FL", score: 94, status: "Season Ticket" },
  { name: "Rachel Torres", title: "Director, Partnerships · Live Nation", loc: "Ft Lauderdale, FL", score: 88, status: "Active Fan" },
  { name: "David Kim", title: "CFO · Citadel Securities", loc: "Miami Beach, FL", score: 91, status: "Premium" },
  { name: "Maria Santos", title: "Head of Events · Hard Rock", loc: "Hollywood, FL", score: 85, status: "Prospect" },
  { name: "James Chen", title: "Managing Director · JP Morgan", loc: "Coral Gables, FL", score: 92, status: "Season Ticket" },
]

/* ═══════════════════════════════════════════════════════════
   FULL-SCREEN DAILY BRIEFING
   ═══════════════════════════════════════════════════════════ */
function DailyBriefing() {
  return (
    <div className="space-y-8 pb-8">
      {/* Hero summary */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
        <p className="text-[10px] font-semibold tracking-widest text-white/25 uppercase mb-3">March 31, 2026 · Monday Morning Brief</p>
        <p className="text-[17px] font-medium text-white/90 leading-relaxed max-w-2xl">
          Good morning, Sarah. <span className="text-sky-400">5 signals</span> surfaced overnight.
          Attention is up strongly, but owned conversion needs immediate focus.
        </p>
      </motion.div>

      {/* Signals — full-width horizontal scroll */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <p className="text-[10px] font-semibold tracking-widest text-white/25 uppercase mb-3">Today's Signals</p>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
          {signals.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}
              className="shrink-0 w-[220px] rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 hover:bg-white/[0.05] transition-colors cursor-pointer group">
              <p className="text-[8px] font-bold tracking-widest text-white/20 uppercase mb-2">{s.label}</p>
              <p className={`text-[26px] font-bold tracking-tight leading-none mb-2 ${s.value.startsWith("+") ? "text-sky-400" : "text-sky-400/50"}`}>{s.value}</p>
              <p className="text-[10.5px] text-white/35 leading-snug mb-3">{s.desc}</p>
              <span className="text-[10px] font-medium text-sky-400/50 group-hover:text-sky-400/80 transition-colors flex items-center gap-1">{s.cta} <ArrowRight className="h-2.5 w-2.5" /></span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Two-column: Priority Actions + Key Metrics */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.5 }}
        className="grid grid-cols-5 gap-4">
        {/* Priority Actions — 3 cols */}
        <div className="col-span-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-5">
          <p className="text-[10px] font-semibold tracking-widest text-white/25 uppercase mb-4">Priority Actions</p>
          <div className="space-y-3">
            {actions.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                className="flex gap-3 items-start py-2.5 border-b border-white/[0.04] last:border-0 cursor-pointer hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors">
                <div className="h-6 w-6 rounded-full bg-sky-400/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[11px] font-bold text-sky-400">{a.num}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-white/85">{a.title}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">{a.desc}</p>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full shrink-0 ${a.urgency === "High" ? "bg-sky-400/10 text-sky-400" : "bg-white/5 text-white/30"}`}>{a.urgency}</span>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Key Metrics — 2 cols */}
        <div className="col-span-2 grid grid-cols-2 gap-3 content-start">
          {metrics.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 + i * 0.06 }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <p className="text-[8px] text-white/20 uppercase tracking-widest mb-1">{m.label}</p>
              <p className="text-[24px] font-bold tracking-tight text-white leading-none">{m.value}</p>
              <p className="text-[10px] text-sky-400/60 mt-1">{m.delta}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Two-column: Campaign Performance + Top Movers */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.5 }}
        className="grid grid-cols-5 gap-4">
        {/* Campaign table — 3 cols */}
        <div className="col-span-3 rounded-xl border border-white/[0.06] bg-white/[0.03] overflow-hidden">
          <div className="px-5 pt-4 pb-2">
            <p className="text-[10px] font-semibold tracking-widest text-white/25 uppercase">Campaign Performance</p>
          </div>
          <table className="w-full text-[11.5px]">
            <thead><tr className="border-b border-white/[0.04]">
              <th className="text-left px-5 py-2 text-[9px] uppercase tracking-widest text-white/20 font-medium">Campaign</th>
              <th className="text-right px-3 py-2 text-[9px] uppercase tracking-widest text-white/20 font-medium">Reach</th>
              <th className="text-right px-3 py-2 text-[9px] uppercase tracking-widest text-white/20 font-medium">CTR</th>
              <th className="text-right px-5 py-2 text-[9px] uppercase tracking-widest text-white/20 font-medium">ROAS</th>
            </tr></thead>
            <tbody>{campaigns.map((c, i) => (
              <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 + i * 0.06 }}
                className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors cursor-pointer">
                <td className="px-5 py-2.5 text-white/70 flex items-center gap-2">
                  {c.trend === "up" ? <TrendingUp className="h-3 w-3 text-sky-400/60" /> : <TrendingDown className="h-3 w-3 text-white/20" />}
                  {c.name}
                </td>
                <td className="text-right px-3 py-2.5 text-white/40 tabular-nums">{c.reach}</td>
                <td className="text-right px-3 py-2.5 text-white/40 tabular-nums">{c.ctr}</td>
                <td className="text-right px-5 py-2.5 font-semibold text-sky-400 tabular-nums">{c.roas}</td>
              </motion.tr>
            ))}</tbody>
          </table>
        </div>

        {/* Top Movers — 2 cols */}
        <div className="col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.03] p-5">
          <p className="text-[10px] font-semibold tracking-widest text-white/25 uppercase mb-4">Top Movers</p>
          <div className="space-y-3">
            {movers.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 + i * 0.08 }}
                className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <div>
                  <p className="text-[12px] font-medium text-white/70">{s.name}</p>
                  <p className="text-[9.5px] text-white/20 mt-0.5">{s.detail}</p>
                </div>
                <span className={`text-[15px] font-bold tabular-nums ${s.value.startsWith("+") ? "text-sky-400" : "text-sky-400/50"}`}>{s.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* People to watch — full width */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2, duration: 0.5 }}>
        <p className="text-[10px] font-semibold tracking-widest text-white/25 uppercase mb-3">People to Watch</p>
        <div className="grid grid-cols-5 gap-2">
          {people.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4 + i * 0.06 }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5 hover:bg-white/[0.05] transition-colors cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-sky-400/20 to-sky-400/5 flex items-center justify-center text-[10px] font-bold text-sky-400">{p.name.split(" ").map(n => n[0]).join("")}</div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-400/10 text-sky-400/70">{p.status}</span>
              </div>
              <p className="text-[12px] font-medium text-white/80 leading-tight">{p.name}</p>
              <p className="text-[9.5px] text-white/25 mt-0.5 leading-snug">{p.title}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
                <span className="text-[9px] text-white/20">{p.loc}</span>
                <span className="text-[13px] font-bold tabular-nums text-white/50">{p.score}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Source attribution */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}
        className="flex items-center gap-3 pt-2">
        <span className="text-[9px] text-white/15 uppercase tracking-widest">Sources</span>
        {["Ticket Sales API", "Meta Ads", "Google Analytics", "CRM"].map((s, i) => (
          <span key={i} className="text-[10px] text-white/25 px-2 py-1 rounded-md border border-white/[0.04] bg-white/[0.02]">{s}</span>
        ))}
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export function HomeContent() {
  const [activeMode, setActiveMode] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const [activeDisplay, setActiveDisplay] = useState<string | null>(null)
  const [displayTitle, setDisplayTitle] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const mode = modes[activeMode]
  const hasDisplay = activeDisplay !== null

  useEffect(() => {
    if (hasDisplay && scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: "smooth" })
  }, [activeDisplay, hasDisplay])

  const triggerDisplay = (modeId: string, title: string) => {
    setDisplayTitle(title)
    setActiveDisplay(modeId)
  }

  const handleSend = () => {
    const text = inputValue.trim()
    if (!text) return
    setInputValue("")
    triggerDisplay(mode.id, text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); handleSend() }
  }

  const handleModeClick = (index: number) => {
    setActiveMode(index)
    setInputValue("")
    triggerDisplay(modes[index].id, modes[index].headline)
  }

  const handleReset = () => {
    setActiveDisplay(null)
    setDisplayTitle("")
    setActiveMode(0)
  }

  return (
    <div className="mn-home flex flex-col h-screen -mt-9 pt-9">

      {/* ═══ DISPLAY AREA — full screen between nav and input ═══ */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative z-10" style={{ scrollbarWidth: "none" }}>
        <AnimatePresence mode="wait">
          {!hasDisplay ? (
            /* ═══ HERO STATE ═══ */
            <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center h-full px-6">
              <AnimatePresence mode="wait">
                <motion.h1 key={mode.id} initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }} className="text-2xl font-bold tracking-tight sm:text-3xl text-white mb-6 text-center">
                  {mode.headline}
                </motion.h1>
              </AnimatePresence>
            </motion.div>
          ) : (
            /* ═══ ACTIVE DISPLAY ═══ */
            <motion.div key="display" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="px-8 pt-6">
              {/* Display header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[14px] font-semibold tracking-tight text-white/60">{displayTitle}</h2>
                <button onClick={handleReset}
                  className="flex items-center gap-1.5 text-[10px] text-white/25 hover:text-white/50 transition-colors">
                  <X className="h-3 w-3" /> New
                </button>
              </div>
              {/* Render the display */}
              {activeDisplay === "discover" && <DailyBriefing />}
              {activeDisplay === "person-search" && <DailyBriefing />}
              {activeDisplay === "audiences" && <DailyBriefing />}
              {activeDisplay === "analytics" && <DailyBriefing />}
              {activeDisplay === "enrich" && <DailyBriefing />}
              {activeDisplay === "activate" && <DailyBriefing />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ PINNED INPUT BAR — always at bottom ═══ */}
      <div className="shrink-0 relative z-10 px-6 pb-4 pt-2">
        {/* Mode pills — only in hero */}
        <AnimatePresence>
          {!hasDisplay && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.25 }}
              className="flex items-center justify-center gap-1 mb-3">
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

        {/* Input */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center rounded-full border bg-white/[0.05] border-white/[0.08] hover:border-white/15 focus-within:border-white/20 backdrop-blur-sm transition-all duration-200 px-5 py-2.5 gap-3">
            <input ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown} placeholder={hasDisplay ? "Ask a follow-up..." : mode.placeholder}
              className="flex-1 bg-transparent border-0 outline-none text-[14px] text-white placeholder:text-white/25" />
            <button onClick={handleSend} disabled={!inputValue.trim()}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${inputValue.trim() ? "bg-white text-black" : "bg-white/8 text-white/20"}`}>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
