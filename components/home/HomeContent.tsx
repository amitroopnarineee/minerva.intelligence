"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Lightbulb, Users, UserSearch, TrendingUp, TrendingDown, Minus, Zap, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { insights as insightCardsFull, DrillDownModal, type InsightCard } from "@/components/shared/InsightDrillDown"
import { kpiHistory, currentKpi, previousKpi, kpiDelta } from "@/lib/data/kpis"
import { campaigns as allCampaigns } from "@/lib/data/campaigns"
import { persons, type Person } from "@/lib/data/persons"
import { audiences } from "@/lib/data/audiences"
import { Sparkline } from "@/components/shared/Sparkline"
import { CountUp } from "@/components/shared/CountUp"
import { FunnelChart } from "@/components/shared/FunnelChart"
import { UserAvatar } from "@/components/shared/UserAvatar"
import { PersonProfileSheet } from "@/components/shared/PersonProfileSheet"
import { AreaChart as VisxAreaChart, Area as VisxArea, Grid as VisxGrid, XAxis as VisxXAxis } from "@/components/ui/area-chart"

/* ── Data ── */
const chart7d = kpiHistory.map(k => ({ date: new Date(k.date), revenue: Math.round(k.influencedRevenue / 1000), spend: Math.round(k.paidSpend / 1000) }))
const revD = kpiDelta(currentKpi.influencedRevenue, previousKpi.influencedRevenue)
const roasD = kpiDelta(currentKpi.roas, previousKpi.roas)
const convD = kpiDelta(currentKpi.ticketConversionRate, previousKpi.ticketConversionRate)
const matchD = kpiDelta(currentKpi.dataMatchRate, previousKpi.dataMatchRate)
const topCampaigns = allCampaigns.slice(0, 5)
const topPeople = [...persons].sort((a, b) => b.scores.ticketBuy - a.scores.ticketBuy).slice(0, 5)

const funnelData = [
  { label: "Reached", value: 48200, displayValue: "48.2K", color: "#38bdf8" },
  { label: "Engaged", value: 12800, displayValue: "12.8K", color: "#38bdf8" },
  { label: "Converted", value: 3400, displayValue: "3.4K", color: "#38bdf8" },
  { label: "Revenue", value: 890, displayValue: "$242K", color: "#38bdf8" },
]

const insightCards = [
  { id: "1", label: "Attention", value: "+18%", copy: "Player-led content drove a broad lift in brand visibility.", cta: "See channel breakdown" },
  { id: "2", label: "Premium Experience", value: "+11%", copy: "Premium game-day messaging is outperforming general hype.", cta: "Analyze in Audience Spectrum" },
  { id: "3", label: "Family Audience", value: "+14%", copy: "Family ticket consideration rose across Miami-Dade and Broward.", cta: "View regional data" },
  { id: "4", label: "Owned Conversion", value: "-4%", copy: "Social engagement rose, but lifecycle capture still trails.", cta: "See funnel gaps" },
  { id: "5", label: "Sponsor Resonance", value: "+9%", copy: "Luxury and hospitality narratives are winning.", cta: "View sponsor data" },
  { id: "6", label: "Top Campaign", value: "", subtitle: "Player Spotlight Series", copy: "Strongest awareness driver — but underperforming on owned action.", cta: "See campaign performance" },
  { id: "7", label: "Audience Shift", value: "+340", copy: "Renewal Risk segment grew 340 net new members.", cta: "Explore in Audience Spectrum" },
  { id: "8", label: "Weekend Action", value: "3 ready", subtitle: "Weekend opportunities", copy: "Three high-confidence actions ready to deploy.", cta: "View recommendations" },
]

const sections = [
  { id: "briefing", label: "Briefing", icon: Brain },
  { id: "insights", label: "Insights", icon: Lightbulb },
  { id: "audiences", label: "Audiences", icon: Users },
  { id: "people", label: "People", icon: UserSearch },
]

/* ── Helpers ── */
const f = (d: number) => ({ initial: { opacity: 0, y: 12 } as const, animate: { opacity: 1, y: 0 } as const, transition: { delay: d, duration: 0.45 } })
function Lbl({ children }: { children: string }) { return <p className="text-[9px] tracking-widest text-white/20 uppercase mb-2.5">{children}</p> }
function Tr({ d }: { d: { value: number; direction: "up"|"down"|"stable" } }) {
  const I = d.direction === "up" ? TrendingUp : d.direction === "down" ? TrendingDown : Minus
  return <span className={`flex items-center gap-0.5 text-[10px] ${d.direction === "up" ? "text-sky-400" : "text-white/30"}`}><I className="h-3 w-3" />{d.value.toFixed(1)}%</span>
}

const statusColors: Record<string, string> = {
  active_fan: "text-emerald-400", season_ticket_holder: "text-sky-400",
  lapsed: "text-red-400/70", prospect: "text-amber-400", anonymous: "text-white/30",
}
const typeColors: Record<string, string> = {
  lifecycle: "bg-sky-500/10 text-sky-400", predictive: "bg-amber-500/10 text-amber-400",
  sales: "bg-emerald-500/10 text-emerald-400", retargeting: "bg-purple-500/10 text-purple-400",
}

/* ═══ MAIN COMPONENT ═══ */
export function HomeContent() {
  const router = useRouter()
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [activeSection, setActiveSection] = useState("briefing")
  const [showCanvas, setShowCanvas] = useState(false)
  const [activeCard, setActiveCard] = useState<InsightCard | null>(null)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  const enterCanvas = useCallback((sectionId: string) => {
    setActiveSection(sectionId)
    setShowCanvas(true)
    setTimeout(() => sectionRefs.current[sectionId]?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
  }, [])

  // IntersectionObserver for scroll-anchor pills
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    sections.forEach(({ id }) => {
      const el = sectionRefs.current[id]
      if (!el) return
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setActiveSection(id)
      }, { root: scrollRef.current, threshold: 0.3 })
      io.observe(el)
      observers.push(io)
    })
    return () => observers.forEach(io => io.disconnect())
  }, [])

  const scrollTo = useCallback((id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  return (
    <div className="mn-home flex flex-col h-screen -mt-9 pt-9">
      <AnimatePresence mode="wait">
      {!showCanvas ? (
        /* ═══ HERO LANDING ═══ */
        <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }} className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl tracking-tight text-white mb-8 text-center">What should I focus on today?</motion.h1>
          <div className="flex items-center gap-2">
            {sections.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.button key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }} onClick={() => enterCanvas(s.id)}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-[13px] text-white/50 hover:text-white hover:border-white/25 hover:bg-white/[0.06] transition-all">
                  <Icon className="h-3.5 w-3.5" /> {s.label}
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      ) : (
        /* ═══ CANVAS VIEW ═══ */
        <motion.div key="canvas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
          className="flex-1 flex flex-col min-h-0">
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative z-10 scroll-smooth" style={{ scrollbarWidth: "none" }}>
        <div className="px-6 pt-4 pb-20 max-w-[1100px] mx-auto space-y-14">

          {/* ═══ SECTION 1: BRIEFING ═══ */}
          <section ref={(el) => { sectionRefs.current.briefing = el }} id="briefing" className="scroll-mt-6 space-y-5">
            <motion.div {...f(0.05)}>
              <p className="text-[10px] tracking-widest text-white/20 uppercase">Tuesday, April 1 · Morning Briefing</p>
              <p className="text-[15px] text-white/70 mt-2 leading-relaxed max-w-2xl">
                Good morning, Sarah. <span className="text-sky-400">5 insights</span> surfaced overnight.
                Revenue is <span className="text-white/90">${(currentKpi.influencedRevenue/1000).toFixed(0)}K</span> with
                ROAS at <span className="text-white/90">{currentKpi.roas.toFixed(1)}x</span>. Family audience is surging.
              </p>
            </motion.div>

            {/* KPI Strip */}
            <motion.div {...f(0.12)} className="grid grid-cols-4 gap-px rounded-lg overflow-hidden border border-white/[0.06]">
              {[
                { l:"Revenue",n:currentKpi.influencedRevenue/1000,dec:0,pre:"$",suf:"K",d:revD,s:kpiHistory.map(k=>k.influencedRevenue) },
                { l:"ROAS",n:currentKpi.roas,dec:1,pre:"",suf:"x",d:roasD,s:kpiHistory.map(k=>k.roas) },
                { l:"Conv Rate",n:currentKpi.ticketConversionRate*100,dec:1,pre:"",suf:"%",d:convD,s:kpiHistory.map(k=>k.ticketConversionRate) },
                { l:"Match Rate",n:currentKpi.dataMatchRate*100,dec:0,pre:"",suf:"%",d:matchD,s:kpiHistory.map(k=>k.dataMatchRate) },
              ].map((m,i)=>(
                <div key={i} className="bg-white/[0.025] px-4 py-3.5 hover:bg-white/[0.04] transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-1"><p className="text-[8px] text-white/15 uppercase tracking-widest">{m.l}</p><Sparkline data={m.s} width={44} height={14} showArea={false} showDot={false} /></div>
                  <div className="flex items-end justify-between"><p className="text-[20px] tracking-tight text-white leading-none"><CountUp end={m.n} decimals={m.dec} prefix={m.pre} suffix={m.suf} /></p><Tr d={m.d} /></div>
                </div>))}
            </motion.div>

            {/* Funnel + Chart row */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div {...f(0.2)} className="rounded-lg border border-white/[0.06] bg-white/[0.025] p-4">
                <Lbl>Conversion Funnel</Lbl>
                <FunnelChart data={funnelData} color="#38bdf8" layers={2} edges="straight" gap={2}
                  showPercentage={false} showValues={true} showLabels={true}
                  className="h-[100px]" style={{ aspectRatio: "unset" }} />
              </motion.div>
              <motion.div {...f(0.25)} className="col-span-2 rounded-lg border border-white/[0.06] bg-white/[0.025] p-4">
                <Lbl>Revenue vs Spend · 7d</Lbl>
                <VisxAreaChart data={chart7d} xDataKey="date" aspectRatio="3 / 1" margin={{top:8,right:8,bottom:24,left:8}}>
                  <VisxGrid horizontal numTicksRows={3} strokeDasharray="2,4" strokeOpacity={0.15} />
                  <VisxArea dataKey="revenue" fill="rgba(56,189,248,0.08)" stroke="rgba(56,189,248,0.5)" strokeWidth={1.5} />
                  <VisxArea dataKey="spend" fill="rgba(56,189,248,0.03)" stroke="rgba(56,189,248,0.2)" strokeWidth={1} />
                  <VisxXAxis dataKey="date" tickFormat={(d: Date) => d.toLocaleDateString("en-US",{month:"short",day:"numeric"})} />
                </VisxAreaChart>
              </motion.div>
            </div>

            {/* Top campaigns */}
            <motion.div {...f(0.3)} className="rounded-lg border border-white/[0.06] overflow-hidden">
              <table className="w-full text-[11.5px]">
                <thead><tr className="bg-white/[0.02]">
                  <th className="text-left px-3.5 py-2 text-white/15 text-[8px] uppercase tracking-widest">Campaign</th>
                  <th className="text-left px-3 py-2 text-white/15 text-[8px] uppercase tracking-widest">Platform</th>
                  <th className="text-right px-3 py-2 text-white/15 text-[8px] uppercase tracking-widest">Spend</th>
                  <th className="text-right px-3 py-2 text-white/15 text-[8px] uppercase tracking-widest">ROAS</th>
                  <th className="text-right px-3.5 py-2 text-white/15 text-[8px] uppercase tracking-widest">Conv</th>
                </tr></thead>
                <tbody>{topCampaigns.map(c=>(
                  <tr key={c.id} className="border-t border-white/[0.03] hover:bg-white/[0.02] cursor-pointer">
                    <td className="px-3.5 py-2 text-white/50 flex items-center gap-1.5">{c.trend==="up"?<TrendingUp className="h-3 w-3 text-sky-400/40"/>:<TrendingDown className="h-3 w-3 text-white/15"/>}{c.name}</td>
                    <td className="px-3 py-2 text-white/20">{c.platform}</td>
                    <td className="text-right px-3 py-2 text-white/25 tabular-nums">${(c.spend/1000).toFixed(0)}K</td>
                    <td className="text-right px-3 py-2 text-sky-400 tabular-nums">{c.roas.toFixed(1)}x</td>
                    <td className="text-right px-3.5 py-2 text-white/30 tabular-nums">{c.conversions}</td>
                  </tr>))}</tbody>
              </table>
            </motion.div>
          </section>

          {/* ═══ SECTION 2: INSIGHTS ═══ */}
          <section ref={(el) => { sectionRefs.current.insights = el }} id="insights" className="scroll-mt-6">
            <motion.div {...f(0)} className="flex items-center justify-between mb-4">
              <div>
                <Lbl>What needs your attention</Lbl>
                <p className="text-[15px] text-white/70">5 signals surfaced overnight. Click any card to explore.</p>
              </div>
              <span className="text-[11px] text-white/15">{insightCardsFull.length} signals</span>
            </motion.div>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2" style={{ scrollbarWidth: "none" }}>
              {insightCardsFull.map((card, idx) => (
                <motion.div key={card.id} {...f(0.05 + idx * 0.04)}
                  whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCard(card)}
                  className="mn-glass-card snap-start shrink-0 w-[260px] h-[210px] rounded-xl border-l-[3px] border-l-sky-400/40 backdrop-blur-sm p-5 flex flex-col cursor-pointer hover:shadow-lg transition-shadow">
                  <span className="mn-glass-label text-[8px] tracking-widest text-white/25 uppercase">{card.label}</span>
                  {card.mainValue && <span className="text-[28px] font-bold tracking-tight leading-none mt-1 text-sky-400">{card.mainValue}</span>}
                  {card.subtitle && <span className="text-[15px] font-semibold tracking-tight leading-tight mt-1">{card.subtitle}</span>}
                  <p className="text-[11px] text-white/40 leading-snug mt-2 flex-1">{card.copy}</p>
                  <div className="pt-3 border-t border-white/[0.06] mt-auto">
                    <span className="text-[11px] font-medium text-sky-400/60">{card.cta}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ═══ SECTION 3: AUDIENCES ═══ */}
          <section ref={(el) => { sectionRefs.current.audiences = el }} id="audiences" className="scroll-mt-6">
            <motion.div {...f(0)} className="flex items-center justify-between mb-4">
              <div>
                <Lbl>Your segments</Lbl>
                <p className="text-[15px] text-white/70"><span className="text-sky-400">{audiences.length} audience segments</span> across lifecycle, predictive, and behavioral types.</p>
              </div>
              <button onClick={() => router.push("/person-search")} className="text-[11px] text-sky-400/60 hover:text-sky-400 transition-colors flex items-center gap-1">
                Manage <ChevronRight className="h-3 w-3" />
              </button>
            </motion.div>
            <div className="grid grid-cols-3 gap-4">
              {audiences.map((a, idx) => (
                <motion.div key={a.id} {...f(0.03 + idx * 0.04)}
                  className="mn-glass-card rounded-xl p-5 cursor-pointer hover:bg-white/[0.04] transition-colors group">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[8px] tracking-widest uppercase font-medium ${typeColors[a.type]?.split(" ")[1] ?? "text-white/20"}`}>{a.type}</span>
                    {a.isActivationReady && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-sky-400/10 text-sky-400 font-medium flex items-center gap-1">
                        <Zap className="h-2.5 w-2.5" /> Ready
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] font-medium text-white/80 mb-0.5">{a.name}</p>
                  <p className="text-[22px] font-bold tracking-tight text-white leading-none mb-2">{a.estimatedSize.toLocaleString()}</p>
                  <div className="flex items-center gap-3 text-[10px] text-white/25">
                    <span>{a.channelRecommendation}</span>
                    {a.memberDelta !== 0 && (
                      <span className={a.memberDelta > 0 ? "text-sky-400/50" : "text-white/20"}>
                        {a.memberDelta > 0 ? "+" : ""}{a.memberDelta}
                      </span>
                    )}
                  </div>
                  {a.isActivationReady && (
                    <button className="mt-3 text-[10px] text-sky-400/60 group-hover:text-sky-400 transition-colors flex items-center gap-1">
                      Activate <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          {/* ═══ SECTION 4: PEOPLE ═══ */}
          <section ref={(el) => { sectionRefs.current.people = el }} id="people" className="scroll-mt-6">
            <motion.div {...f(0)} className="flex items-center justify-between mb-4">
              <div>
                <Lbl>Top profiles to act on</Lbl>
                <p className="text-[15px] text-white/70">Highest-propensity people across your segments.</p>
              </div>
              <button onClick={() => router.push("/people")} className="text-[11px] text-sky-400/60 hover:text-sky-400 transition-colors flex items-center gap-1">
                All people <ChevronRight className="h-3 w-3" />
              </button>
            </motion.div>
            <motion.div {...f(0.05)} className="rounded-lg border border-white/[0.06] overflow-hidden">
              <table className="w-full text-[12px]">
                <thead><tr className="bg-white/[0.02]">
                  <th className="text-left px-3.5 py-2.5 text-white/15 text-[8px] uppercase tracking-widest">Person</th>
                  <th className="text-left px-3 py-2.5 text-white/15 text-[8px] uppercase tracking-widest">Status</th>
                  <th className="text-right px-3 py-2.5 text-white/15 text-[8px] uppercase tracking-widest">Ticket Buy</th>
                  <th className="text-right px-3 py-2.5 text-white/15 text-[8px] uppercase tracking-widest">Premium</th>
                  <th className="text-right px-3 py-2.5 text-white/15 text-[8px] uppercase tracking-widest">Churn</th>
                  <th className="text-right px-3.5 py-2.5 text-white/15 text-[8px] uppercase tracking-widest">Income</th>
                </tr></thead>
                <tbody>{topPeople.map(p=>(
                  <tr key={p.id} onClick={() => setSelectedPerson(p)}
                    className="border-t border-white/[0.03] hover:bg-white/[0.03] cursor-pointer transition-colors">
                    <td className="px-3.5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar name={`${p.firstName} ${p.lastName}`} size={28} />
                        <div>
                          <p className="text-[12px] font-medium text-white/80">{p.firstName} {p.lastName}</p>
                          <p className="text-[10px] text-white/25">{p.city}, {p.state}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[10px] ${statusColors[p.fanStatus] ?? "text-white/30"}`}>
                        {p.fanStatus.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="text-right px-3 py-2.5 text-white/60 tabular-nums font-medium">{Math.round(p.scores.ticketBuy * 100)}</td>
                    <td className="text-right px-3 py-2.5 text-white/60 tabular-nums font-medium">{Math.round(p.scores.premium * 100)}</td>
                    <td className={`text-right px-3 py-2.5 tabular-nums font-medium ${p.scores.churn > 0.5 ? "text-red-400/60" : "text-white/30"}`}>{Math.round(p.scores.churn * 100)}</td>
                    <td className="text-right px-3.5 py-2.5 text-white/25">{p.household.incomeBand}</td>
                  </tr>))}</tbody>
              </table>
            </motion.div>
          </section>

        </div>
      </div>

      {/* ═══ TAB BAR ═══ */}
      <div className="shrink-0 relative z-10 flex justify-center pb-4 pt-2">
        <div className="flex items-center gap-1 rounded-xl bg-white/[0.04] border border-white/[0.06] p-1 backdrop-blur-sm">
          {sections.map((s) => {
            const on = activeSection === s.id
            return (
              <button key={s.id} onClick={() => scrollTo(s.id)}
                className={`text-[12px] px-3.5 py-1.5 rounded-lg transition-all ${
                  on ? "bg-white text-black font-medium shadow-sm" : "text-white/40 hover:text-white/70 hover:bg-white/[0.06]"
                }`}>
                {s.label}
              </button>
            )
          })}
        </div>
      </div>
        </motion.div>
      )}
      </AnimatePresence>

      <PersonProfileSheet person={selectedPerson} open={!!selectedPerson} onClose={() => setSelectedPerson(null)} />

      <AnimatePresence>
        {activeCard && (
          <DrillDownModal card={activeCard} onClose={() => setActiveCard(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
