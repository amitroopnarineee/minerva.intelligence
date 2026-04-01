"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp, Brain, Search, Users, BarChart3, Upload, Zap, TrendingUp, TrendingDown, X, ArrowRight, Minus } from "lucide-react"
import { useRouter } from "next/navigation"
import { kpiHistory, currentKpi, previousKpi, kpiDelta } from "@/lib/data/kpis"
import { insights } from "@/lib/data/insights"
import { campaigns } from "@/lib/data/campaigns"
import { opportunities } from "@/lib/data/opportunities"
import { persons } from "@/lib/data/persons"
import { Sparkline } from "@/components/shared/Sparkline"
import { AreaChart as VisxAreaChart, Area as VisxArea, Grid as VisxGrid, XAxis as VisxXAxis } from "@/components/ui/area-chart"

const modes = [
  { id: "discover", label: "Discover", icon: Brain, headline: "What should I focus on today?", placeholder: "Ask about trends, anomalies, or what needs your attention..." },
  { id: "person-search", label: "People", icon: Search, headline: "Find anyone in 260M+ profiles.", placeholder: "Find software engineers in Miami who earn over $150K..." },
  { id: "audiences", label: "Audiences", icon: Users, headline: "Build intelligent audience segments.", placeholder: "Create an audience of families within 30 miles..." },
  { id: "analytics", label: "Analytics", icon: BarChart3, headline: "Understand what's working.", placeholder: "How did our Meta retargeting campaign perform?" },
  { id: "enrich", label: "Enrich", icon: Upload, headline: "Enrich your data at scale.", placeholder: "Enrich my Salesforce contacts with income and interests..." },
  { id: "activate", label: "Activate", icon: Zap, headline: "Push audiences to your channels.", placeholder: "Activate premium suite prospects on Klaviyo and Meta..." },
]

/* ── Derived data ── */
const revenueChart = kpiHistory.map(k => ({ date: new Date(k.date), revenue: Math.round(k.influencedRevenue / 1000), spend: Math.round(k.paidSpend / 1000) }))
const revDelta = kpiDelta(currentKpi.influencedRevenue, previousKpi.influencedRevenue)
const roasDelta = kpiDelta(currentKpi.roas, previousKpi.roas)
const convDelta = kpiDelta(currentKpi.ticketConversionRate, previousKpi.ticketConversionRate)
const matchDelta = kpiDelta(currentKpi.dataMatchRate, previousKpi.dataMatchRate)
const topInsights = insights.slice(0, 4)
const topCampaigns = campaigns.filter(c => c.status === "active").slice(0, 4)
const topOpps = opportunities.filter(o => o.status === "open").slice(0, 3)
const topPeople = persons.slice(0, 5)

const f = (d: number) => ({ initial: { opacity: 0, y: 10 } as const, animate: { opacity: 1, y: 0 } as const, transition: { delay: d, duration: 0.4 } })

function Dl({ label }: { label: string }) {
  return <p className="text-[9px] tracking-widest text-white/15 uppercase mb-2.5">{label}</p>
}

function TrendBadge({ delta }: { delta: { value: number; direction: "up"|"down"|"stable" } }) {
  const Icon = delta.direction === "up" ? TrendingUp : delta.direction === "down" ? TrendingDown : Minus
  return (
    <span className={`flex items-center gap-0.5 text-[10px] font-medium ${delta.direction === "up" ? "text-sky-400" : delta.direction === "down" ? "text-white/30" : "text-white/20"}`}>
      <Icon className="h-3 w-3" />{delta.value.toFixed(1)}%
    </span>
  )
}

function DailyBriefing() {
  const router = useRouter()
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null)
  return (
    <div className="max-w-[1100px] mx-auto space-y-5 pb-10">
      {/* ── HEADER ── */}
      <motion.div {...f(0.1)}>
        <p className="text-[10px] tracking-widest text-white/20 uppercase">Monday, March 31 · Morning Brief</p>
        <p className="text-[16px] text-white/80 mt-2 leading-relaxed max-w-2xl">
          Good morning, Sarah. <span className="text-sky-400 font-medium">{topInsights.length} insights</span> surfaced overnight.
          Revenue is <span className="font-medium">${(currentKpi.influencedRevenue/1000).toFixed(0)}K</span> today with ROAS at <span className="font-medium">{currentKpi.roas.toFixed(1)}x</span>.
        </p>
      </motion.div>

      {/* ── KPI STRIP with real sparklines ── */}
      <motion.div {...f(0.25)} className="grid grid-cols-4 gap-px rounded-lg overflow-hidden border border-white/[0.06]">
        {[
          { l: "Influenced Revenue", v: `$${(currentKpi.influencedRevenue/1000).toFixed(0)}K`, d: revDelta, spark: kpiHistory.map(k => k.influencedRevenue) },
          { l: "ROAS", v: `${currentKpi.roas.toFixed(1)}x`, d: roasDelta, spark: kpiHistory.map(k => k.roas) },
          { l: "Ticket Conv. Rate", v: `${(currentKpi.ticketConversionRate*100).toFixed(1)}%`, d: convDelta, spark: kpiHistory.map(k => k.ticketConversionRate) },
          { l: "Data Match Rate", v: `${(currentKpi.dataMatchRate*100).toFixed(0)}%`, d: matchDelta, spark: kpiHistory.map(k => k.dataMatchRate) },
        ].map((m, i) => (
          <div key={i} className="bg-white/[0.025] px-4 py-3.5 hover:bg-white/[0.04] transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[8px] text-white/15 uppercase tracking-widest">{m.l}</p>
              <Sparkline data={m.spark} width={44} height={14} showArea={false} showDot={false} />
            </div>
            <div className="flex items-end justify-between">
              <p className="text-[20px] font-bold tracking-tight text-white leading-none">{m.v}</p>
              <TrendBadge delta={m.d} />
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── REVENUE CHART + INSIGHTS — 2:1 split ── */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div {...f(0.4)} className="col-span-2 rounded-lg border border-white/[0.06] bg-white/[0.025] p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[9px] tracking-widest text-white/15 uppercase">Revenue vs Spend · 7 Day</p>
            <p className="text-[10px] text-white/20">Daily</p>
          </div>
          <div>
            <VisxAreaChart data={revenueChart} xDataKey="date" aspectRatio="3 / 1" margin={{ top: 8, right: 8, bottom: 24, left: 8 }}>
              <VisxGrid horizontal numTicksRows={3} strokeDasharray="2,4" strokeOpacity={0.15} />
              <VisxArea dataKey="revenue" fill="#38bdf8" fillOpacity={0.15} stroke="#38bdf8" strokeWidth={1.5} />
              <VisxArea dataKey="spend" fill="#38bdf8" fillOpacity={0.05} stroke="#38bdf850" strokeWidth={1} />
              <VisxXAxis numTicks={7} />
            </VisxAreaChart>
          </div>
        </motion.div>

        <motion.div {...f(0.5)}>
          <Dl label="Insights" />
          <div className="rounded-lg border border-white/[0.06] overflow-hidden">
            {topInsights.map((ins) => (
              <div key={ins.id} onClick={() => setExpandedInsight(expandedInsight === ins.id ? null : ins.id)}
                className="bg-white/[0.025] px-3.5 py-2.5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.04] transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] text-white/70 leading-snug">{ins.title}</p>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${ins.severity === "high" ? "bg-sky-400/10 text-sky-400" : "bg-white/5 text-white/20"}`}>{ins.severity}</span>
                </div>
                {expandedInsight === ins.id ? (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2 pt-2 border-t border-white/[0.04]">
                    <p className="text-[10px] text-white/40 leading-relaxed">{ins.summary}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[8px] text-white/15">{ins.confidenceScore ? `${(ins.confidenceScore*100).toFixed(0)}% confidence` : ""}</span>
                      <button onClick={(e) => { e.stopPropagation(); router.push("/command-center") }}
                        className="text-[9px] text-sky-400/60 hover:text-sky-400 transition-colors">View in Command Center →</button>
                    </div>
                  </motion.div>
                ) : (
                  <p className="text-[9px] text-white/15 mt-1">{ins.confidenceScore ? `${(ins.confidenceScore*100).toFixed(0)}% confidence` : ""}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── CAMPAIGNS + OPPORTUNITIES — 2:1 split ── */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div {...f(0.6)} className="col-span-2">
          <Dl label="Active Campaigns" />
          <div className="rounded-lg border border-white/[0.06] overflow-hidden">
            <table className="w-full text-[11px]">
              <thead><tr className="bg-white/[0.015]">
                <th className="text-left px-3.5 py-2 text-[8px] uppercase tracking-widest text-white/12 font-medium">Campaign</th>
                <th className="text-left px-3 py-2 text-[8px] uppercase tracking-widest text-white/12 font-medium">Channel</th>
                <th className="text-right px-3 py-2 text-[8px] uppercase tracking-widest text-white/12 font-medium">Spend</th>
                <th className="text-right px-3 py-2 text-[8px] uppercase tracking-widest text-white/12 font-medium">ROAS</th>
                <th className="text-right px-3.5 py-2 text-[8px] uppercase tracking-widest text-white/12 font-medium">Conv</th>
              </tr></thead>
              <tbody>{topCampaigns.map((c) => (
                <tr key={c.id} className="border-t border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <td className="px-3.5 py-2 text-white/60 flex items-center gap-1.5">
                    {c.trend === "up" ? <TrendingUp className="h-3 w-3 text-sky-400/40" /> : c.trend === "down" ? <TrendingDown className="h-3 w-3 text-white/15" /> : <Minus className="h-3 w-3 text-white/10" />}
                    {c.name}
                  </td>
                  <td className="px-3 py-2 text-white/25 capitalize">{c.platform}</td>
                  <td className="text-right px-3 py-2 text-white/30 tabular-nums">${(c.spend/1000).toFixed(0)}K</td>
                  <td className="text-right px-3 py-2 font-semibold text-sky-400 tabular-nums">{c.roas.toFixed(1)}x</td>
                  <td className="text-right px-3.5 py-2 text-white/40 tabular-nums">{c.conversions}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </motion.div>

        <motion.div {...f(0.7)}>
          <Dl label="Recommended Actions" />
          <div className="rounded-lg border border-white/[0.06] overflow-hidden">
            {topOpps.map((o, i) => (
              <div key={o.id} className="bg-white/[0.025] px-3.5 py-3 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.04] transition-colors cursor-pointer">
                <p className="text-[11px] text-white/70 leading-snug">{o.recommendedAction}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[9px] text-white/15">{o.recommendedChannel}</span>
                  <span className="text-[9px] text-sky-400/60 font-medium">+{o.expectedLiftPct}% lift</span>
                  <span className="text-[9px] text-white/20">${(o.expectedRevenue/1000).toFixed(0)}K rev</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── PEOPLE ROW ── */}
      <motion.div {...f(0.85)}>
        <Dl label="People to Watch" />
        <div className="grid grid-cols-5 gap-px rounded-lg overflow-hidden border border-white/[0.06]">
          {topPeople.map((p) => (
            <div key={p.id} onClick={() => router.push(`/person-search/person/${p.id}`)}
              className="bg-white/[0.025] px-3 py-3 hover:bg-white/[0.05] transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="h-6 w-6 rounded-full bg-sky-400/10 flex items-center justify-center text-[9px] font-bold text-sky-400">{p.firstName[0]}{p.lastName[0]}</div>
                <span className="text-[11px] font-bold tabular-nums text-white/20">{Math.round(p.scores.ticketBuy * 100)}</span>
              </div>
              <p className="text-[11px] font-medium text-white/65 leading-tight group-hover:text-white/90 transition-colors">{p.firstName} {p.lastName}</p>
              <p className="text-[9px] text-white/15 mt-0.5">{p.jobTitle}</p>
              <p className="text-[8px] text-white/10 mt-0.5">{p.city}, {p.state}</p>
              <div className="mt-1.5 pt-1.5 border-t border-white/[0.04] flex items-center justify-between">
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-sky-400/8 text-sky-400/50">{p.fanStatus?.replace(/_/g, " ") || "prospect"}</span>
                <span className="text-[8px] text-sky-400/40 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── SOURCES ── */}
      <motion.div {...f(1.0)} className="flex items-center gap-2 pt-1">
        <span className="text-[8px] text-white/8 uppercase tracking-widest">Sources</span>
        {["Ticket Sales API", "Meta Ads", "Google Analytics", "Klaviyo", "CRM"].map((s, i) => (
          <span key={i} className="text-[8px] text-white/12 px-1.5 py-0.5 rounded border border-white/[0.03]">{s}</span>
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
            <motion.div key="display" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }} className="px-8 pt-4">
              <div className="flex items-center justify-between mb-4 max-w-[1100px] mx-auto">
                <h2 className="text-[13px] font-medium text-white/35">{displayTitle}</h2>
                <button onClick={reset} className="text-[10px] text-white/15 hover:text-white/40 transition-colors flex items-center gap-1"><X className="h-3 w-3" />New</button>
              </div>
              <DailyBriefing />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
