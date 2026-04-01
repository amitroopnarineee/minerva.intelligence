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

const signals = [
  { label: "Attention", value: "+18%", desc: "Brand awareness up across Instagram, TikTok, and owned web." },
  { label: "Premium", value: "+11%", desc: "Premium messaging driving strongest ticket-intent lift." },
  { label: "Family", value: "+14%", desc: "Family consideration rose in Miami-Dade and Broward." },
  { label: "Owned", value: "-4%", desc: "Social engagement up but owned capture trails reach." },
  { label: "Sponsors", value: "+9%", desc: "Luxury narratives creating strongest partner value." },
]
const actions = [
  { title: "Double down on Family Weekend", desc: "Family +14% — launch South Florida geo-targeted variant this week.", tag: "High" },
  { title: "Fix owned conversion gap", desc: "Attention +18% but owned CTR -4%. Rework short-form CTA flow.", tag: "High" },
  { title: "Push Premium Suite retargeting", desc: "1,420 prospects ready. Refresh creative and activate on Meta.", tag: "Medium" },
]
const campaigns = [
  { name: "Player Spotlight Series", reach: "142K", ctr: "3.8%", roas: "4.2x", trend: "up" as const },
  { name: "Family Weekend Promo", reach: "89K", ctr: "5.1%", roas: "6.1x", trend: "up" as const },
  { name: "Premium Suite Retarget", reach: "34K", ctr: "2.9%", roas: "3.1x", trend: "down" as const },
  { name: "Season Renewal Email", reach: "12K", ctr: "12.4%", roas: "8.7x", trend: "up" as const },
]
const movers = [
  { name: "Family Package Buyers", val: "+14%", n: "3,100" },
  { name: "Premium Suite Prospects", val: "+8.1%", n: "1,420" },
  { name: "Renewal Risk Members", val: "-2.1%", n: "700" },
]
const people = [
  { name: "Carlos Mendez", role: "VP Marketing, Baptist Health", score: 94 },
  { name: "Rachel Torres", role: "Dir. Partnerships, Live Nation", score: 88 },
  { name: "David Kim", role: "CFO, Citadel Securities", score: 91 },
  { name: "Maria Santos", role: "Head of Events, Hard Rock", score: 85 },
  { name: "James Chen", role: "MD, JP Morgan", score: 92 },
]

const f = (d: number, dur = 0.4) => ({ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: dur } })

function DailyBriefing() {
  return (
    <div className="max-w-[1100px] mx-auto space-y-6 pb-10">
      {/* ── HEADER ── */}
      <motion.div {...f(0.1)}>
        <p className="text-[10px] tracking-widest text-white/20 uppercase">Monday, March 31 · Morning Brief</p>
        <p className="text-[16px] text-white/80 mt-2 leading-relaxed">Good morning, Sarah. <span className="text-sky-400 font-medium">5 signals</span> surfaced overnight. Attention is up, but owned conversion needs focus.</p>
      </motion.div>

      {/* ── METRICS STRIP ── */}
      <motion.div {...f(0.3)} className="grid grid-cols-4 gap-px rounded-lg overflow-hidden border border-white/[0.06]">
        {[
          { l: "Total Reach", v: "284K", d: "+12% vs last week" },
          { l: "Owned CTR", v: "1.8%", d: "-4% — needs attention" },
          { l: "Best ROAS", v: "6.1x", d: "Family Weekend Promo" },
          { l: "Active Segments", v: "5", d: "15,303 total profiles" },
        ].map((m, i) => (
          <div key={i} className="bg-white/[0.03] px-5 py-4">
            <p className="text-[9px] text-white/20 uppercase tracking-wider">{m.l}</p>
            <p className="text-[22px] font-bold tracking-tight text-white mt-0.5 leading-none">{m.v}</p>
            <p className="text-[10px] text-white/25 mt-1">{m.d}</p>
          </div>
        ))}
      </motion.div>

      {/* ── SIGNALS + ACTIONS — side by side ── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Signals — 2 cols */}
        <motion.div {...f(0.5)} className="col-span-2">
          <p className="text-[9px] tracking-widest text-white/15 uppercase mb-3">Today's Signals</p>
          <div className="grid grid-cols-5 gap-px rounded-lg overflow-hidden border border-white/[0.06]">
            {signals.map((s, i) => (
              <div key={i} className="bg-white/[0.03] px-3 py-3.5 hover:bg-white/[0.05] transition-colors cursor-pointer">
                <p className="text-[8px] text-white/15 uppercase tracking-wider mb-1.5">{s.label}</p>
                <p className={`text-[20px] font-bold tracking-tight leading-none ${s.value.startsWith("-") ? "text-white/40" : "text-sky-400"}`}>{s.value}</p>
                <p className="text-[9px] text-white/20 mt-2 leading-snug">{s.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions — 1 col */}
        <motion.div {...f(0.7)}>
          <p className="text-[9px] tracking-widest text-white/15 uppercase mb-3">Priority Actions</p>
          <div className="rounded-lg border border-white/[0.06] overflow-hidden">
            {actions.map((a, i) => (
              <div key={i} className="bg-white/[0.03] px-4 py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.05] transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[12px] font-medium text-white/80">{a.title}</p>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded shrink-0 ${a.tag === "High" ? "bg-sky-400/10 text-sky-400" : "bg-white/5 text-white/20"}`}>{a.tag}</span>
                </div>
                <p className="text-[10px] text-white/25 mt-1 leading-snug">{a.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── CAMPAIGNS + MOVERS — side by side ── */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div {...f(0.9)} className="col-span-2">
          <p className="text-[9px] tracking-widest text-white/15 uppercase mb-3">Campaign Performance</p>
          <div className="rounded-lg border border-white/[0.06] overflow-hidden">
            <table className="w-full text-[11px]">
              <thead><tr className="bg-white/[0.02]">
                <th className="text-left px-4 py-2 text-[8px] uppercase tracking-widest text-white/15 font-medium">Campaign</th>
                <th className="text-right px-3 py-2 text-[8px] uppercase tracking-widest text-white/15 font-medium">Reach</th>
                <th className="text-right px-3 py-2 text-[8px] uppercase tracking-widest text-white/15 font-medium">CTR</th>
                <th className="text-right px-4 py-2 text-[8px] uppercase tracking-widest text-white/15 font-medium">ROAS</th>
              </tr></thead>
              <tbody>{campaigns.map((c, i) => (
                <tr key={i} className="border-t border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <td className="px-4 py-2.5 text-white/60 flex items-center gap-1.5">
                    {c.trend === "up" ? <TrendingUp className="h-3 w-3 text-sky-400/40" /> : <TrendingDown className="h-3 w-3 text-white/15" />}{c.name}
                  </td>
                  <td className="text-right px-3 py-2.5 text-white/30 tabular-nums">{c.reach}</td>
                  <td className="text-right px-3 py-2.5 text-white/30 tabular-nums">{c.ctr}</td>
                  <td className="text-right px-4 py-2.5 font-semibold text-sky-400 tabular-nums">{c.roas}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </motion.div>

        <motion.div {...f(1.1)}>
          <p className="text-[9px] tracking-widest text-white/15 uppercase mb-3">Segment Movers</p>
          <div className="rounded-lg border border-white/[0.06] overflow-hidden">
            {movers.map((m, i) => (
              <div key={i} className="bg-white/[0.03] px-4 py-3 border-b border-white/[0.04] last:border-0 flex items-center justify-between hover:bg-white/[0.05] transition-colors cursor-pointer">
                <div><p className="text-[12px] text-white/60">{m.name}</p><p className="text-[9px] text-white/15 mt-0.5">{m.n} profiles</p></div>
                <span className={`text-[16px] font-bold tabular-nums ${m.val.startsWith("-") ? "text-white/30" : "text-sky-400"}`}>{m.val}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── PEOPLE ROW ── */}
      <motion.div {...f(1.3)}>
        <p className="text-[9px] tracking-widest text-white/15 uppercase mb-3">People to Watch</p>
        <div className="grid grid-cols-5 gap-px rounded-lg overflow-hidden border border-white/[0.06]">
          {people.map((p, i) => (
            <div key={i} className="bg-white/[0.03] px-3 py-3 hover:bg-white/[0.05] transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-1.5">
                <div className="h-6 w-6 rounded-full bg-sky-400/10 flex items-center justify-center text-[9px] font-bold text-sky-400">{p.name.split(" ").map(n => n[0]).join("")}</div>
                <span className="text-[12px] font-bold tabular-nums text-white/30">{p.score}</span>
              </div>
              <p className="text-[11px] font-medium text-white/70 leading-tight">{p.name}</p>
              <p className="text-[9px] text-white/20 mt-0.5">{p.role}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── SOURCES ── */}
      <motion.div {...f(1.5)} className="flex items-center gap-2">
        <span className="text-[8px] text-white/10 uppercase tracking-widest">Sources</span>
        {["Ticket Sales API", "Meta Ads", "Google Analytics", "CRM"].map((s, i) => (
          <span key={i} className="text-[9px] text-white/15 px-2 py-0.5 rounded border border-white/[0.04]">{s}</span>
        ))}
      </motion.div>
    </div>
  )
}

export function HomeContent() {
  const [activeMode, setActiveMode] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const [activeDisplay, setActiveDisplay] = useState<string | null>(null)
  const [displayTitle, setDisplayTitle] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const mode = modes[activeMode]
  const hasDisplay = activeDisplay !== null

  useEffect(() => { if (hasDisplay && scrollRef.current) scrollRef.current.scrollTo({ top: 0 }) }, [activeDisplay, hasDisplay])

  const trigger = (modeId: string, title: string) => { setDisplayTitle(title); setActiveDisplay(modeId) }
  const handleSend = () => { const t = inputValue.trim(); if (!t) return; setInputValue(""); trigger(mode.id, t) }
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") { e.preventDefault(); handleSend() } }
  const handlePill = (i: number) => { setActiveMode(i); setInputValue(""); trigger(modes[i].id, modes[i].headline) }
  const reset = () => { setActiveDisplay(null); setDisplayTitle(""); setActiveMode(0) }

  return (
    <div className="mn-home flex flex-col h-screen -mt-9 pt-9">
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative z-10" style={{ scrollbarWidth: "none" }}>
        <AnimatePresence mode="wait">
          {!hasDisplay ? (
            <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }} className="flex flex-col items-center justify-center h-full px-6">
              <AnimatePresence mode="wait">
                <motion.h1 key={mode.id} initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={{ duration: 0.25 }} className="text-2xl font-bold tracking-tight sm:text-3xl text-white mb-6 text-center">
                  {mode.headline}
                </motion.h1>
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div key="display" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="px-8 pt-4">
              <div className="flex items-center justify-between mb-5 max-w-[1100px] mx-auto">
                <h2 className="text-[13px] font-medium text-white/40">{displayTitle}</h2>
                <button onClick={reset} className="text-[10px] text-white/20 hover:text-white/40 transition-colors flex items-center gap-1"><X className="h-3 w-3" />New</button>
              </div>
              <DailyBriefing />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── INPUT BAR ── */}
      <div className="shrink-0 relative z-10 px-6 pb-4 pt-2">
        <AnimatePresence>
          {!hasDisplay && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }} className="flex items-center justify-center gap-1 mb-3">
              {modes.map((m, i) => {
                const Icon = m.icon; const on = i === activeMode
                return (
                  <button key={m.id} onClick={() => handlePill(i)}
                    className={`relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${on ? "border-white/25 text-white bg-white/8" : "border-white/8 text-white/30"} hover:text-white/60`}>
                    <Icon className="h-3 w-3" /><span className="hidden sm:inline">{m.label}</span>
                    {on && <motion.div layoutId="pill" className="absolute inset-0 rounded-full border border-white/25" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                  </button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center rounded-full border bg-white/[0.04] border-white/[0.06] hover:border-white/12 focus-within:border-white/18 transition-all duration-200 px-5 py-2.5 gap-3">
            <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown}
              placeholder={hasDisplay ? "Ask a follow-up..." : mode.placeholder}
              className="flex-1 bg-transparent border-0 outline-none text-[14px] text-white placeholder:text-white/20" />
            <button onClick={handleSend} disabled={!inputValue.trim()}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${inputValue.trim() ? "bg-white text-black" : "bg-white/6 text-white/15"}`}>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
