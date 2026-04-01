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
  { id: "briefing", label: "Briefing", icon: Brain, headline: "What should I focus on today?", placeholder: "Ask about trends, anomalies, or what needs your attention..." },
  { id: "insights", label: "Insights", icon: Lightbulb, headline: "What's happening right now?", placeholder: "Ask about signals, campaigns, or audience shifts..." },
  { id: "audiences", label: "Audiences", icon: Users, headline: "Build intelligent audience segments.", placeholder: "Find high-value families within 30 miles of the stadium..." },
  { id: "people", label: "People", icon: UserSearch, headline: "Find anyone in 260M+ profiles.", placeholder: "Search for software engineers in Miami earning over $150K..." },
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

/* ── Data → InsightCard converters ── */
function makeTrendLocal(base: number, delta: number): { date: Date; primary: number; secondary?: number }[] {
  return Array.from({ length: 7 }, (_, i) => ({ date: new Date(Date.now() - (6 - i) * 86400000), primary: Math.round(base * (1 + (i/6) * delta) * (1 + Math.sin(i*2.1)*0.06)) }))
}

function audienceToCard(a: typeof audiences[0]): InsightCard {
  return {
    id: `aud-${a.id}`, label: a.type.toUpperCase(), mainValue: a.estimatedSize.toLocaleString(), valueColor: "text-sky-400",
    copy: a.description, meaning: `${a.name} — ${a.channelRecommendation} recommended. ${a.isActivationReady ? "Ready to activate." : "Not yet activation-ready."}`,
    cta: a.isActivationReady ? "Activate segment" : "View segment", color: "border-l-sky-400/40", category: "Audience",
    relatedAudienceIds: [a.id],
    drillDown: {
      title: a.name, summary: a.description,
      meaning: `This ${a.type} segment has ${a.estimatedSize.toLocaleString()} members. ${a.memberDelta && a.memberDelta > 0 ? `Growing by +${a.memberDelta} recently.` : "Stable size."}`,
      metrics: [
        { label: "Size", value: a.estimatedSize.toLocaleString(), context: "Total profiles in segment." },
        { label: "Channel", value: a.channelRecommendation, context: "Recommended activation channel." },
        { label: "Email Reach", value: `${Math.round((a.emailReachRate ?? 0) * 100)}%`, context: "Email deliverability rate." },
        { label: "Propensity", value: `${Math.round((a.avgPropensityScore ?? 0) * 100)}`, context: "Average propensity score." },
      ],
      evidence: `${a.name} is a ${a.type} segment in the ${a.businessUnit} business unit.`,
      highlight: a.memberDelta && a.memberDelta > 0 ? `Segment grew by +${a.memberDelta} members recently.` : `Segment has ${a.estimatedSize.toLocaleString()} stable members.`,
      analysis: `This audience is ${a.isActivationReady ? "activation-ready" : "not yet ready"} via ${a.channelRecommendation}.`,
      immediateActions: [a.isActivationReady ? `Activate via ${a.channelRecommendation}` : "Complete audience setup", "Review member profiles", "Compare with similar segments"],
      followUpActions: ["Build lookalike audience", "Set up automated refresh", "Create campaign brief"],
      sources: ["Minerva Audience Engine", "CRM Data", "Ticketmaster"],
      table: { headers: ["Metric", "Value"], rows: [["Size", a.estimatedSize.toLocaleString()], ["Type", a.type], ["Channel", a.channelRecommendation], ["Email Reach", `${Math.round((a.emailReachRate ?? 0)*100)}%`], ["Phone Reach", `${Math.round((a.phoneReachRate ?? 0)*100)}%`]] },
      actions: ["Activate", "Export", "Compare", "Edit"],
      chartData: makeTrendLocal(a.estimatedSize, (a.memberDelta ?? 0) / a.estimatedSize),
      chartLabels: { primary: "Segment Size" },
    },
  }
}

function campaignToCard(c: typeof allCampaigns[0]): InsightCard {
  return {
    id: `camp-${c.id}`, label: "CAMPAIGN", mainValue: `${c.roas.toFixed(1)}x`, valueColor: "text-sky-400",
    subtitle: c.name, copy: `${c.objective} campaign on ${c.platform}. Spend: ${(c.spend/1000).toFixed(0)}K of ${(c.budget/1000).toFixed(0)}K budget.`,
    meaning: `ROAS ${c.roas.toFixed(1)}x with ${c.conversions} conversions.`,
    cta: "View campaign detail", color: "border-l-sky-400/40", category: "Campaign",
    relatedAudienceIds: [],
    drillDown: {
      title: c.name, summary: `${c.objective} campaign running on ${c.platform}. Currently ${c.status}.`,
      meaning: `This campaign has a ${c.roas.toFixed(1)}x return on ad spend with ${c.conversions} conversions to date.`,
      metrics: [
        { label: "ROAS", value: `${c.roas.toFixed(1)}x`, context: "Return on ad spend." },
        { label: "Conversions", value: String(c.conversions), context: "Total conversions to date." },
        { label: "Spend", value: `${(c.spend/1000).toFixed(0)}K`, context: `Of ${(c.budget/1000).toFixed(0)}K budget.` },
        { label: "Trend", value: c.trend === "up" ? `+${c.trendPct}%` : c.trend === "down" ? `-${c.trendPct}%` : "Stable", context: "Recent performance trend." },
      ],
      evidence: `Campaign is ${c.status} on ${c.platform} targeting ${c.objective}.`,
      highlight: `${c.roas.toFixed(1)}x ROAS on ${(c.spend/1000).toFixed(0)}K spend — ${c.conversions} conversions.`,
      analysis: `${c.name} is ${c.trend === "up" ? "trending upward" : c.trend === "down" ? "declining" : "stable"}. Budget utilization is ${Math.round(c.spend/c.budget*100)}%.`,
      immediateActions: [c.trend === "up" ? "Increase budget allocation" : "Review targeting", "Export performance report", "Compare with other campaigns"],
      followUpActions: ["Build lookalike from converters", "Test creative variants", "Plan next flight"],
      sources: ["Meta Ads Manager", "Klaviyo", "Minerva Campaign Table"],
      table: { headers: ["Metric", "Value"], rows: [["Platform", c.platform], ["Objective", c.objective], ["Budget", `${(c.budget/1000).toFixed(0)}K`], ["Spend", `${(c.spend/1000).toFixed(0)}K`], ["ROAS", `${c.roas.toFixed(1)}x`], ["Conversions", String(c.conversions)]] },
      actions: ["Adjust budget", "Pause campaign", "Export report", "Create variant"],
      chartData: makeTrendLocal(c.spend / 7000, c.trend === "up" ? 0.15 : -0.08),
      chartLabels: { primary: "Daily Spend" },
    },
  }
}

function personToCard(p: Person): InsightCard {
  return {
    id: `person-${p.id}`, label: p.fanStatus.replace(/_/g, " ").toUpperCase(), mainValue: `${Math.round(p.scores.ticketBuy * 100)}`, valueColor: "text-sky-400",
    subtitle: `${p.firstName} ${p.lastName}`, copy: `${p.jobTitle} at ${p.company}. ${p.city}, ${p.state}.`,
    meaning: `Ticket Buy: ${Math.round(p.scores.ticketBuy*100)} · Premium: ${Math.round(p.scores.premium*100)} · Churn: ${Math.round(p.scores.churn*100)}`,
    cta: "View full profile", color: "border-l-sky-400/40", category: "Audience",
    relatedAudienceIds: p.audiences,
    drillDown: {
      title: `${p.firstName} ${p.lastName}`, summary: `${p.jobTitle} at ${p.company}. Located in ${p.city}, ${p.state}. ${p.household.incomeBand} income band.`,
      meaning: `${p.fanStatus.replace(/_/g, " ")} with ${Math.round(p.identityConfidence*100)}% identity confidence and ${Math.round(p.profileCompleteness*100)}% profile completeness.`,
      metrics: [
        { label: "Ticket Buy", value: String(Math.round(p.scores.ticketBuy*100)), context: "Propensity to purchase tickets." },
        { label: "Premium", value: String(Math.round(p.scores.premium*100)), context: "Propensity for premium upgrade." },
        { label: "Renewal", value: String(Math.round(p.scores.renewal*100)), context: "Likelihood to renew." },
        { label: "Churn Risk", value: String(Math.round(p.scores.churn*100)), context: p.scores.churn > 0.5 ? "High risk — needs attention." : "Low risk." },
      ],
      evidence: `${p.firstName} is a ${p.fanStatus.replace(/_/g, " ")} in the ${p.lifecycleStage} stage. ${p.tickets.length} ticket purchases on record.`,
      highlight: p.tickets.length > 0 ? `Total ticket revenue: ${p.tickets.reduce((s,t)=>s+t.revenue,0).toLocaleString()}` : "No ticket purchases yet — acquisition opportunity.",
      analysis: `Household: ${p.household.incomeBand} income, ${p.household.netWorthBand} net worth. ${p.household.hasChildren ? "Has children." : ""} ${p.household.distanceToStadium.toFixed(1)} mi from stadium.`,
      immediateActions: ["Send personalized outreach", "Add to priority segment", "Schedule follow-up"],
      followUpActions: ["Build similar audience", "Track engagement over time", "Review ticket history"],
      sources: ["Minerva Profile Engine", "CRM", "Ticketmaster"],
      table: { headers: ["Detail", "Value"], rows: [["Age", String(p.age)], ["Location", `${p.city}, ${p.state}`], ["Income", p.household.incomeBand], ["Net Worth", p.household.netWorthBand], ["Distance", `${p.household.distanceToStadium.toFixed(1)} mi`], ["Tickets", String(p.tickets.length)]] },
      actions: ["Contact with AI", "Add to segment", "View ticket history", "Export profile"],
    },
  }
}

/* ═══ MAIN COMPONENT ═══ */
export function HomeContent() {
  const router = useRouter()

  const [activeSection, setActiveSection] = useState("briefing")
  const [activeMode, setActiveMode] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const [showCanvas, setShowCanvas] = useState(false)
  const [activeCard, setActiveCard] = useState<InsightCard | null>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  const enterCanvas = useCallback((sectionId: string) => {
    setActiveSection(sectionId)
    setShowCanvas(true)
    setTimeout(() => sectionRefs.current[sectionId]?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
  }, [])

  // Listen for logo "go home" event
  useEffect(() => {
    const goHome = () => { setShowCanvas(false); setActiveCard(null) }
    window.addEventListener('minerva-go-home', goHome)
    return () => window.removeEventListener('minerva-go-home', goHome)
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
          transition={{ duration: 0.3 }} className="mn-hero flex-1 flex flex-col items-center justify-center px-6">
          <AnimatePresence mode="wait">
            <motion.h1 key={sections[activeMode].id} initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.25 }} className="mn-hero-headline text-2xl sm:text-3xl tracking-tight text-white mb-8 text-center">
              {sections[activeMode].headline}
            </motion.h1>
          </AnimatePresence>

          {/* Input bar */}
          <div className="mn-hero-input-wrap max-w-2xl w-full mb-6">
            <div className="mn-hero-input-bar flex items-center rounded-full border bg-white/[0.04] border-white/[0.06] hover:border-white/12 focus-within:border-white/18 transition-all duration-200 px-5 py-2.5 gap-3">
              <input value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && inputValue.trim()) { e.preventDefault(); enterCanvas(sections[activeMode].id) } }}
                placeholder={sections[activeMode].placeholder}
                className="mn-hero-input flex-1 bg-transparent border-0 outline-none text-[14px] text-white placeholder:text-white/20" />
              <button onClick={() => { if (inputValue.trim()) enterCanvas(sections[activeMode].id) }}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${inputValue.trim() ? "bg-white text-black" : "bg-white/6 text-white/15"}`}>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Pills — swap title, don't open canvas */}
          <div className="mn-hero-pills flex items-center gap-2">
            {sections.map((s, i) => {
              const Icon = s.icon; const on = i === activeMode
              return (
                <motion.button key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }} onClick={() => { setActiveMode(i); setInputValue("") }}
                  className={`relative flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] transition-all duration-200 ${on ? "border-white/25 text-white bg-white/[0.08]" : "border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"}`}>
                  <Icon className="h-3.5 w-3.5" /> {s.label}
                  {on && <motion.div layoutId="hero-pill" className="absolute inset-0 rounded-full border border-white/25" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      ) : (
        /* ═══ CANVAS VIEW ═══ */
        <motion.div key="canvas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
          className="mn-canvas flex-1 flex flex-col min-h-0">
      <div ref={scrollRef} className="mn-canvas-scroll flex-1 overflow-y-auto relative z-10 scroll-smooth" style={{ scrollbarWidth: "none" }}>
        <div className="mn-canvas-inner px-6 pt-4 pb-20 max-w-[1100px] mx-auto space-y-14">

          {/* ═══ SECTION 1: BRIEFING ═══ */}
          <section ref={(el) => { sectionRefs.current.briefing = el }} id="briefing" className="mn-section mn-briefing scroll-mt-6 space-y-5">
            <motion.div {...f(0.05)}>
              <p className="mn-briefing-date text-[10px] tracking-widest text-white/20 uppercase">Tuesday, April 1 · Morning Briefing</p>
              <p className="mn-briefing-copy text-[15px] text-white/70 mt-2 leading-relaxed max-w-2xl">
                Good morning, Sarah. <span className="text-sky-400">5 insights</span> surfaced overnight.
                Revenue is <span className="text-white/90">${(currentKpi.influencedRevenue/1000).toFixed(0)}K</span> with
                ROAS at <span className="text-white/90">{currentKpi.roas.toFixed(1)}x</span>. Family audience is surging.
              </p>
            </motion.div>

            {/* KPI Strip */}
            <motion.div {...f(0.12)} className="mn-kpi-strip grid grid-cols-4 gap-px rounded-lg overflow-hidden border border-white/[0.06]">
              {[
                { l:"Revenue",n:currentKpi.influencedRevenue/1000,dec:0,pre:"$",suf:"K",d:revD,s:kpiHistory.map(k=>k.influencedRevenue) },
                { l:"ROAS",n:currentKpi.roas,dec:1,pre:"",suf:"x",d:roasD,s:kpiHistory.map(k=>k.roas) },
                { l:"Conv Rate",n:currentKpi.ticketConversionRate*100,dec:1,pre:"",suf:"%",d:convD,s:kpiHistory.map(k=>k.ticketConversionRate) },
                { l:"Match Rate",n:currentKpi.dataMatchRate*100,dec:0,pre:"",suf:"%",d:matchD,s:kpiHistory.map(k=>k.dataMatchRate) },
              ].map((m,i)=>(
                <div key={i} className="mn-kpi-cell bg-white/[0.025] px-4 py-3.5 hover:bg-white/[0.04] transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-1"><p className="text-[8px] text-white/15 uppercase tracking-widest">{m.l}</p><Sparkline data={m.s} width={44} height={14} showArea={false} showDot={false} /></div>
                  <div className="flex items-end justify-between"><p className="text-[20px] tracking-tight text-white leading-none"><CountUp end={m.n} decimals={m.dec} prefix={m.pre} suffix={m.suf} /></p><Tr d={m.d} /></div>
                </div>))}
            </motion.div>

            {/* Funnel + Chart row */}
            <div className="mn-briefing-charts grid grid-cols-3 gap-4">
              <motion.div {...f(0.2)} className="mn-funnel-card rounded-lg border border-white/[0.06] bg-white/[0.025] p-4">
                <Lbl>Conversion Funnel</Lbl>
                <FunnelChart data={funnelData} color="#38bdf8" layers={2} edges="straight" gap={2}
                  showPercentage={false} showValues={true} showLabels={true}
                  className="h-[100px]" style={{ aspectRatio: "unset" }} />
              </motion.div>
              <motion.div {...f(0.25)} className="mn-revenue-card col-span-2 rounded-lg border border-white/[0.06] bg-white/[0.025] p-4">
                <Lbl>Revenue vs Spend · 7d</Lbl>
                <VisxAreaChart data={chart7d} xDataKey="date" aspectRatio="3 / 1" margin={{top:8,right:8,bottom:24,left:8}}>
                  <VisxGrid horizontal numTicksRows={3} strokeDasharray="2,4" strokeOpacity={0.15} />
                  <VisxArea dataKey="revenue" fill="rgba(56,189,248,0.08)" stroke="rgba(56,189,248,0.5)" strokeWidth={1.5} />
                  <VisxArea dataKey="spend" fill="rgba(56,189,248,0.03)" stroke="rgba(56,189,248,0.2)" strokeWidth={1} />
                  <VisxXAxis numTicks={5} />
                </VisxAreaChart>
              </motion.div>
            </div>

            {/* Top campaigns */}
            <motion.div {...f(0.3)} className="mn-campaign-table-wrap rounded-lg border border-white/[0.06] overflow-hidden">
              <table className="mn-campaign-table w-full text-[11.5px]">
                <thead><tr className="bg-white/[0.02]">
                  <th className="text-left px-3.5 py-2 text-white/15 text-[8px] uppercase tracking-widest">Campaign</th>
                  <th className="text-left px-3 py-2 text-white/15 text-[8px] uppercase tracking-widest">Platform</th>
                  <th className="text-right px-3 py-2 text-white/15 text-[8px] uppercase tracking-widest">Spend</th>
                  <th className="text-right px-3 py-2 text-white/15 text-[8px] uppercase tracking-widest">ROAS</th>
                  <th className="text-right px-3.5 py-2 text-white/15 text-[8px] uppercase tracking-widest">Conv</th>
                </tr></thead>
                <tbody>{topCampaigns.map(c=>(
                  <tr key={c.id} onClick={() => setActiveCard(campaignToCard(c))} className="border-t border-white/[0.03] hover:bg-white/[0.02] cursor-pointer">
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
          <section ref={(el) => { sectionRefs.current.insights = el }} id="insights" className="mn-section mn-insights scroll-mt-6">
            <motion.div {...f(0)} className="mn-insights-header flex items-center justify-between mb-4">
              <div>
                <Lbl>What needs your attention</Lbl>
                <p className="text-[15px] text-white/70">5 signals surfaced overnight. Click any card to explore.</p>
              </div>
              <span className="text-[11px] text-white/15">{insightCardsFull.length} signals</span>
            </motion.div>
            <div className="mn-insights-scroll flex gap-4 overflow-x-auto pb-2 -mx-2 px-2" style={{ scrollbarWidth: "none" }}>
              {insightCardsFull.map((card, idx) => (
                <motion.div key={card.id} {...f(0.05 + idx * 0.04)}
                  whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCard(card)}
                  className="mn-insight-card mn-glass-card snap-start shrink-0 w-[260px] h-[210px] rounded-xl border-l-[3px] border-l-sky-400/40 backdrop-blur-sm p-5 flex flex-col cursor-pointer hover:shadow-lg transition-shadow">
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
          <section ref={(el) => { sectionRefs.current.audiences = el }} id="audiences" className="mn-section mn-audiences scroll-mt-6">
            <motion.div {...f(0)} className="mn-audiences-header flex items-center justify-between mb-4">
              <div>
                <Lbl>Your segments</Lbl>
                <p className="text-[15px] text-white/70"><span className="text-sky-400">{audiences.length} audience segments</span> across lifecycle, predictive, and behavioral types.</p>
              </div>
              <button onClick={() => router.push("/person-search")} className="text-[11px] text-sky-400/60 hover:text-sky-400 transition-colors flex items-center gap-1">
                Manage <ChevronRight className="h-3 w-3" />
              </button>
            </motion.div>
            <div className="mn-audiences-grid grid grid-cols-3 gap-4">
              {audiences.map((a, idx) => (
                <motion.div key={a.id} {...f(0.03 + idx * 0.04)}
                  onClick={() => setActiveCard(audienceToCard(a))}
                  className="mn-audience-card mn-glass-card rounded-xl p-5 cursor-pointer hover:bg-white/[0.04] transition-colors group">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[8px] mn-audience-type tracking-widest uppercase font-medium ${typeColors[a.type]?.split(" ")[1] ?? "text-white/20"}`}>{a.type}</span>
                    {a.isActivationReady && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-sky-400/10 text-sky-400 font-medium flex items-center gap-1">
                        <Zap className="h-2.5 w-2.5" /> Ready
                      </span>
                    )}
                  </div>
                  <p className="mn-audience-name text-[13px] font-medium text-white/80 mb-0.5">{a.name}</p>
                  <p className="mn-audience-size text-[22px] font-bold tracking-tight text-white leading-none mb-2">{a.estimatedSize.toLocaleString()}</p>
                  <div className="mn-audience-meta flex items-center gap-3 text-[10px] text-white/25">
                    <span>{a.channelRecommendation}</span>
                    {a.memberDelta != null && a.memberDelta !== 0 && (
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
          <section ref={(el) => { sectionRefs.current.people = el }} id="people" className="mn-section mn-people scroll-mt-6">
            <motion.div {...f(0)} className="mn-people-header flex items-center justify-between mb-4">
              <div>
                <Lbl>Top profiles to act on</Lbl>
                <p className="text-[15px] text-white/70">Highest-propensity people across your segments.</p>
              </div>
              <button onClick={() => router.push("/people")} className="text-[11px] text-sky-400/60 hover:text-sky-400 transition-colors flex items-center gap-1">
                All people <ChevronRight className="h-3 w-3" />
              </button>
            </motion.div>
            <motion.div {...f(0.05)} className="mn-people-table-wrap rounded-lg border border-white/[0.06] overflow-hidden">
              <table className="mn-people-table w-full text-[12px]">
                <thead><tr className="mn-people-thead bg-white/[0.02]">
                  <th className="mn-people-th text-left px-3.5 py-2.5 text-white/15 text-[8px] uppercase tracking-widest">Person</th>
                  <th className="text-left px-3 py-2.5 text-white/15 text-[8px] uppercase tracking-widest">Status</th>
                  <th className="text-right px-3 py-2.5 text-white/15 text-[8px] uppercase tracking-widest">Ticket Buy</th>
                  <th className="text-right px-3 py-2.5 text-white/15 text-[8px] uppercase tracking-widest">Premium</th>
                  <th className="text-right px-3 py-2.5 text-white/15 text-[8px] uppercase tracking-widest">Churn</th>
                  <th className="text-right px-3.5 py-2.5 text-white/15 text-[8px] uppercase tracking-widest">Income</th>
                </tr></thead>
                <tbody>{topPeople.map(p=>(
                  <tr key={p.id} onClick={() => setActiveCard(personToCard(p))}
                    className="mn-people-row border-t border-white/[0.03] hover:bg-white/[0.03] cursor-pointer transition-colors">
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
      <div className="mn-tabbar-wrap shrink-0 relative z-10 flex justify-center pb-4 pt-2">
        <div className="mn-tabbar flex items-center gap-1 rounded-xl bg-white/[0.04] border border-white/[0.06] p-1 backdrop-blur-sm">
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



      <AnimatePresence>
        {activeCard && (
          <DrillDownModal card={activeCard} onClose={() => setActiveCard(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
