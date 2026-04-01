"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp, Brain, Search, Users, BarChart3, Upload, Zap, TrendingUp, TrendingDown, X, Minus } from "lucide-react"
import { useRouter } from "next/navigation"
import { kpiHistory, currentKpi, previousKpi, kpiDelta } from "@/lib/data/kpis"
import { insights } from "@/lib/data/insights"
import { campaigns as allCampaigns } from "@/lib/data/campaigns"
import { opportunities } from "@/lib/data/opportunities"
import { persons } from "@/lib/data/persons"
import { audiences } from "@/lib/data/audiences"
import { Sparkline } from "@/components/shared/Sparkline"
import { FunnelChart } from "@/components/shared/FunnelChart"
import { AreaChart as VisxAreaChart, Area as VisxArea, Grid as VisxGrid, XAxis as VisxXAxis } from "@/components/ui/area-chart"

const modes = [
  { id: "discover", label: "Discover", icon: Brain, headline: "What should I focus on today?", placeholder: "Ask about trends, anomalies, or what needs your attention..." },
  { id: "people", label: "People", icon: Search, headline: "Find anyone in 260M+ profiles.", placeholder: "Find software engineers in Miami who earn over $150K..." },
  { id: "audiences", label: "Audiences", icon: Users, headline: "Build intelligent audience segments.", placeholder: "Create an audience of families within 30 miles..." },
  { id: "analytics", label: "Analytics", icon: BarChart3, headline: "Understand what's working.", placeholder: "How did our Meta retargeting campaign perform?" },
  { id: "enrich", label: "Enrich", icon: Upload, headline: "Enrich your data at scale.", placeholder: "Enrich my Salesforce contacts with income and interests..." },
  { id: "activate", label: "Activate", icon: Zap, headline: "Push audiences to your channels.", placeholder: "Activate premium suite prospects on Klaviyo and Meta..." },
]

/* ── Derived ── */
const chart7d = kpiHistory.map(k => ({ date: new Date(k.date), revenue: Math.round(k.influencedRevenue / 1000), spend: Math.round(k.paidSpend / 1000) }))
const revD = kpiDelta(currentKpi.influencedRevenue, previousKpi.influencedRevenue)
const roasD = kpiDelta(currentKpi.roas, previousKpi.roas)
const convD = kpiDelta(currentKpi.ticketConversionRate, previousKpi.ticketConversionRate)
const matchD = kpiDelta(currentKpi.dataMatchRate, previousKpi.dataMatchRate)
const topInsights = insights.slice(0, 4)
const activeCampaigns = allCampaigns.filter(c => c.status === "active").slice(0, 4)
const topOpps = opportunities.filter(o => o.status === "open").slice(0, 3)

const f = (d: number) => ({ initial: { opacity: 0, y: 10 } as const, animate: { opacity: 1, y: 0 } as const, transition: { delay: d, duration: 0.4 } })
function Dl({ label }: { label: string }) { return <p className="text-[9px] tracking-widest text-white/20 uppercase mb-2.5">{label}</p> }
function Tr({ d }: { d: { value: number; direction: "up"|"down"|"stable" } }) {
  const I = d.direction === "up" ? TrendingUp : d.direction === "down" ? TrendingDown : Minus
  return <span className={`flex items-center gap-0.5 text-[10px] ${d.direction === "up" ? "text-sky-400" : "text-white/30"}`}><I className="h-3 w-3" />{d.value.toFixed(1)}%</span>
}

/* ═══ DISCOVER — Morning Brief ═══ */
const funnelData = [
  { label: "Reached", value: 48200, displayValue: "48.2K", color: "#38bdf8" },
  { label: "Engaged", value: 12800, displayValue: "12.8K", color: "#38bdf8" },
  { label: "Converted", value: 3400, displayValue: "3.4K", color: "#38bdf8" },
  { label: "Revenue", value: 890, displayValue: "$242K", color: "#38bdf8" },
]

function DiscoverDisplay() {
  const router = useRouter()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null)
  return (
    <div className="max-w-[1100px] mx-auto space-y-5 pb-10">
      <motion.div {...f(0.1)}>
        <p className="text-[10px] tracking-widest text-white/20 uppercase">Monday, March 31 · Morning Brief</p>
        <p className="text-[15px] text-white/70 mt-2 leading-relaxed max-w-2xl">Good morning, Sarah. <span className="text-sky-400">{topInsights.length} insights</span> surfaced overnight. Revenue is <span className="text-white/90">${(currentKpi.influencedRevenue/1000).toFixed(0)}K</span> with ROAS at <span className="text-white/90">{currentKpi.roas.toFixed(1)}x</span>.</p>
      </motion.div>
      <motion.div {...f(0.2)} className="grid grid-cols-4 gap-px rounded-lg overflow-hidden border border-white/[0.06]">
        {[{ l:"Revenue",v:`$${(currentKpi.influencedRevenue/1000).toFixed(0)}K`,d:revD,s:kpiHistory.map(k=>k.influencedRevenue)},{l:"ROAS",v:`${currentKpi.roas.toFixed(1)}x`,d:roasD,s:kpiHistory.map(k=>k.roas)},{l:"Conv Rate",v:`${(currentKpi.ticketConversionRate*100).toFixed(1)}%`,d:convD,s:kpiHistory.map(k=>k.ticketConversionRate)},{l:"Match Rate",v:`${(currentKpi.dataMatchRate*100).toFixed(0)}%`,d:matchD,s:kpiHistory.map(k=>k.dataMatchRate)}].map((m,i)=>(
          <div key={i} className="bg-white/[0.025] px-4 py-3.5 hover:bg-white/[0.04] transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-1"><p className="text-[8px] text-white/15 uppercase tracking-widest">{m.l}</p><Sparkline data={m.s} width={44} height={14} showArea={false} showDot={false} /></div>
            <div className="flex items-end justify-between"><p className="text-[20px] tracking-tight text-white leading-none">{m.v}</p><Tr d={m.d} /></div>
          </div>))}
      </motion.div>
      {/* Funnel */}
      <motion.div {...f(0.3)} className="rounded-lg border border-white/[0.06] bg-white/[0.025] p-4">
        <Dl label="Conversion Funnel · This Week" />
        <FunnelChart data={funnelData} color="#38bdf8" layers={2} edges="straight" gap={2}
          showPercentage={false} showValues={true} showLabels={true}
          className="h-[100px]" style={{ aspectRatio: "unset" }} />
      </motion.div>

      <div className="grid grid-cols-3 gap-4">
        <motion.div {...f(0.4)} className="col-span-2 rounded-lg border border-white/[0.06] bg-white/[0.025] p-4">
          <div className="flex items-center justify-between mb-2"><Dl label="Revenue vs Spend · 7d" /><p className="text-[9px] text-white/15">Daily</p></div>
          <VisxAreaChart data={chart7d} xDataKey="date" aspectRatio="3 / 1" margin={{top:8,right:8,bottom:24,left:8}}>
            <VisxGrid horizontal numTicksRows={3} strokeDasharray="2,4" strokeOpacity={0.15} />
            <VisxArea dataKey="revenue" fill="#38bdf8" fillOpacity={0.15} stroke="#38bdf8" strokeWidth={1} />
            <VisxArea dataKey="spend" fill="#38bdf8" fillOpacity={0.05} stroke="#38bdf850" strokeWidth={1} />
            <VisxXAxis numTicks={7} />
          </VisxAreaChart>
        </motion.div>
        <motion.div {...f(0.45)}><Dl label="Insights" />
          <div className="rounded-lg border border-white/[0.06] overflow-hidden">{topInsights.map(ins=>(
            <div key={ins.id} onClick={()=>setExpanded(expanded===ins.id?null:ins.id)} className="bg-white/[0.025] px-3.5 py-2.5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.04] transition-colors cursor-pointer">
              <div className="flex items-start justify-between gap-2"><p className="text-[11px] text-white/60 leading-snug">{ins.title}</p><span className={`text-[8px] px-1.5 py-0.5 rounded shrink-0 ${ins.severity==="high"?"bg-sky-400/8 text-sky-400":"bg-white/4 text-white/20"}`}>{ins.severity}</span></div>
              {expanded===ins.id && <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mt-2 pt-2 border-t border-white/[0.04]"><p className="text-[10px] text-white/35 leading-relaxed">{ins.summary}</p>
                <button onClick={e=>{e.stopPropagation();router.push("/command-center")}} className="text-[9px] text-sky-400/50 hover:text-sky-400 mt-2 transition-colors">Open in Command Center →</button></motion.div>}
            </div>))}</div>
        </motion.div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <motion.div {...f(0.55)} className="col-span-2"><Dl label="Active Campaigns" />
          <div className="rounded-lg border border-white/[0.06] overflow-hidden"><table className="w-full text-[11px]">
            <thead><tr className="bg-white/[0.015]"><th className="text-left px-3.5 py-2 text-[8px] uppercase tracking-widest text-white/15">Campaign</th><th className="text-left px-3 py-2 text-[8px] uppercase tracking-widest text-white/15">Platform</th><th className="text-right px-3 py-2 text-[8px] uppercase tracking-widest text-white/15">Spend</th><th className="text-right px-3 py-2 text-[8px] uppercase tracking-widest text-white/15">ROAS</th><th className="text-right px-3.5 py-2 text-[8px] uppercase tracking-widest text-white/15">Conv</th></tr></thead>
            <tbody>{activeCampaigns.map(c=>{const isExp=expandedCampaign===c.id;return(<>
                <tr key={c.id} onClick={()=>setExpandedCampaign(isExp?null:c.id)} className="border-t border-white/[0.03] hover:bg-white/[0.02] cursor-pointer"><td className="px-3.5 py-2 text-white/50 flex items-center gap-1.5">{c.trend==="up"?<TrendingUp className="h-3 w-3 text-sky-400/40"/>:<TrendingDown className="h-3 w-3 text-white/15"/>}{c.name}</td><td className="px-3 py-2 text-white/20">{c.platform}</td><td className="text-right px-3 py-2 text-white/25 tabular-nums">${(c.spend/1000).toFixed(0)}K</td><td className="text-right px-3 py-2 text-sky-400 tabular-nums">{c.roas.toFixed(1)}x</td><td className="text-right px-3.5 py-2 text-white/30 tabular-nums">{c.conversions}</td></tr>
                {isExp&&<tr key={c.id+"-detail"}><td colSpan={5} className="px-3.5 py-3 bg-white/[0.015]">
                  <div className="flex items-center gap-6 text-[10px]">
                    <div><span className="text-white/15">Budget</span><p className="text-white/40 mt-0.5">${(c.budget/1000).toFixed(0)}K</p></div>
                    <div><span className="text-white/15">Spend</span><p className="text-white/40 mt-0.5">${(c.spend/1000).toFixed(0)}K ({Math.round(c.spend/c.budget*100)}%)</p></div>
                    <div><span className="text-white/15">Objective</span><p className="text-white/40 mt-0.5 capitalize">{c.objective.replace(/_/g," ")}</p></div>
                    <div><span className="text-white/15">Trend</span><p className={`mt-0.5 capitalize ${c.trend==="up"?"text-sky-400/60":"text-white/30"}`}>{c.trend} {c.trendPct}%</p></div>
                  </div>
                </td></tr>}
              </>)})}</tbody>
          </table></div>
        </motion.div>
        <motion.div {...f(0.65)}><Dl label="Recommended Actions" />
          <div className="rounded-lg border border-white/[0.06] overflow-hidden">{topOpps.map(o=>(
            <div key={o.id} className="bg-white/[0.025] px-3.5 py-3 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.04] cursor-pointer"><p className="text-[11px] text-white/60 leading-snug">{o.recommendedAction}</p>
              <div className="flex items-center gap-3 mt-1.5"><span className="text-[9px] text-white/15">{o.recommendedChannel}</span><span className="text-[9px] text-sky-400/50">+{o.expectedLiftPct}% lift</span><span className="text-[9px] text-white/15">${(o.expectedRevenue/1000).toFixed(0)}K</span></div>
            </div>))}</div>
        </motion.div>
      </div>
      <motion.div {...f(0.75)} className="flex items-center gap-2"><span className="text-[8px] text-white/8 uppercase tracking-widest">Sources</span>{["Ticket Sales","Meta Ads","GA4","Klaviyo","CRM"].map((s,i)=>(<span key={i} className="text-[8px] text-white/10 px-1.5 py-0.5 rounded border border-white/[0.03]">{s}</span>))}</motion.div>
    </div>
  )
}

/* ═══ PEOPLE — Prospect Directory ═══ */
function PeopleDisplay() {
  const router = useRouter()
  return (
    <div className="max-w-[1100px] mx-auto space-y-5 pb-10">
      <motion.div {...f(0.1)}><p className="text-[15px] text-white/70 leading-relaxed">Found <span className="text-sky-400">{persons.length} profiles</span> matching your criteria. Sorted by propensity score.</p></motion.div>
      <motion.div {...f(0.2)} className="rounded-lg border border-white/[0.06] overflow-hidden">
        <table className="w-full text-[11px]">
          <thead><tr className="bg-white/[0.015]"><th className="text-left px-3.5 py-2 text-[8px] uppercase tracking-widest text-white/15">Person</th><th className="text-left px-3 py-2 text-[8px] uppercase tracking-widest text-white/15">Title</th><th className="text-left px-3 py-2 text-[8px] uppercase tracking-widest text-white/15">Location</th><th className="text-left px-3 py-2 text-[8px] uppercase tracking-widest text-white/15">Status</th><th className="text-right px-3 py-2 text-[8px] uppercase tracking-widest text-white/15">Score</th></tr></thead>
          <tbody>{persons.map((p,i)=>(<motion.tr key={p.id} {...f(0.3+i*0.04)} onClick={()=>router.push(`/person-search/person/${p.id}`)} className="border-t border-white/[0.03] hover:bg-white/[0.03] cursor-pointer transition-colors">
            <td className="px-3.5 py-2"><div className="flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-sky-400/10 flex items-center justify-center text-[9px] text-sky-400">{p.firstName[0]}{p.lastName[0]}</div><span className="text-white/60">{p.firstName} {p.lastName}</span></div></td>
            <td className="px-3 py-2 text-white/30">{p.jobTitle}</td>
            <td className="px-3 py-2 text-white/20">{p.city}, {p.state}</td>
            <td className="px-3 py-2"><span className="text-[8px] px-1.5 py-0.5 rounded bg-sky-400/8 text-sky-400/50">{p.fanStatus?.replace(/_/g," ")||"prospect"}</span></td>
            <td className="text-right px-3 py-2 tabular-nums text-white/40">{Math.round(p.scores.ticketBuy*100)}</td>
          </motion.tr>))}</tbody>
        </table>
      </motion.div>
    </div>
  )
}

/* ═══ AUDIENCES — Segment Overview ═══ */
function AudiencesDisplay() {
  const router = useRouter()
  return (
    <div className="max-w-[1100px] mx-auto space-y-5 pb-10">
      <motion.div {...f(0.1)}><p className="text-[15px] text-white/70 leading-relaxed"><span className="text-sky-400">{audiences.length} audience segments</span> across lifecycle, lookalike, and behavioral types.</p></motion.div>
      <motion.div {...f(0.2)} className="grid grid-cols-3 gap-px rounded-lg overflow-hidden border border-white/[0.06]">
        {audiences.map((a,i)=>(
          <motion.div key={a.id} {...f(0.25+i*0.05)} onClick={()=>router.push("/person-search")}
            className="bg-white/[0.025] p-4 hover:bg-white/[0.04] cursor-pointer transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[8px] uppercase tracking-widest text-white/15">{a.type}</span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded ${a.isActivationReady?"bg-sky-400/8 text-sky-400/50":"bg-white/4 text-white/20"}`}>{a.isActivationReady?"Ready":"Draft"}</span>
            </div>
            <p className="text-[13px] text-white/70 mb-1">{a.name}</p>
            <p className="text-[18px] tracking-tight text-white leading-none">{a.estimatedSize.toLocaleString()}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[9px] text-white/15">{a.channelRecommendation}</span>
              <span className={`text-[9px] ${(a.memberDelta||0)>=0?"text-sky-400/50":"text-white/25"}`}>{(a.memberDelta||0)>=0?"+":""}{a.memberDelta||0}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

/* ═══ ANALYTICS — Campaign Performance ═══ */
function AnalyticsDisplay() {
  return (
    <div className="max-w-[1100px] mx-auto space-y-5 pb-10">
      <motion.div {...f(0.1)}><p className="text-[15px] text-white/70 leading-relaxed"><span className="text-sky-400">{allCampaigns.length} campaigns</span> tracked. Total spend <span className="text-white/90">${(allCampaigns.reduce((a,c)=>a+c.spend,0)/1000).toFixed(0)}K</span> with avg ROAS <span className="text-white/90">{(allCampaigns.reduce((a,c)=>a+c.roas,0)/allCampaigns.length).toFixed(1)}x</span>.</p></motion.div>
      <motion.div {...f(0.2)} className="rounded-lg border border-white/[0.06] bg-white/[0.025] p-4">
        <Dl label="Revenue vs Spend · 7 Day" />
        <VisxAreaChart data={chart7d} xDataKey="date" aspectRatio="3.5 / 1" margin={{top:8,right:8,bottom:24,left:8}}>
          <VisxGrid horizontal numTicksRows={3} strokeDasharray="2,4" strokeOpacity={0.15} />
          <VisxArea dataKey="revenue" fill="#38bdf8" fillOpacity={0.15} stroke="#38bdf8" strokeWidth={1} />
          <VisxArea dataKey="spend" fill="#38bdf8" fillOpacity={0.05} stroke="#38bdf850" strokeWidth={1} />
          <VisxXAxis numTicks={7} />
        </VisxAreaChart>
      </motion.div>
      <motion.div {...f(0.35)} className="rounded-lg border border-white/[0.06] overflow-hidden">
        <table className="w-full text-[11px]"><thead><tr className="bg-white/[0.015]"><th className="text-left px-3.5 py-2 text-[8px] uppercase tracking-widest text-white/15">Campaign</th><th className="text-left px-3 py-2 text-[8px] uppercase tracking-widest text-white/15">Objective</th><th className="text-left px-3 py-2 text-[8px] uppercase tracking-widest text-white/15">Platform</th><th className="text-right px-3 py-2 text-[8px] uppercase tracking-widest text-white/15">Budget</th><th className="text-right px-3 py-2 text-[8px] uppercase tracking-widest text-white/15">Spend</th><th className="text-right px-3 py-2 text-[8px] uppercase tracking-widest text-white/15">ROAS</th><th className="text-right px-3.5 py-2 text-[8px] uppercase tracking-widest text-white/15">Conv</th></tr></thead>
        <tbody>{allCampaigns.map((c,i)=>(<motion.tr key={c.id} {...f(0.4+i*0.04)} className="border-t border-white/[0.03] hover:bg-white/[0.02] cursor-pointer">
          <td className="px-3.5 py-2 text-white/50 flex items-center gap-1.5">{c.trend==="up"?<TrendingUp className="h-3 w-3 text-sky-400/40"/>:c.trend==="down"?<TrendingDown className="h-3 w-3 text-white/15"/>:<Minus className="h-3 w-3 text-white/10"/>}{c.name}</td>
          <td className="px-3 py-2 text-white/20 capitalize">{c.objective.replace(/_/g," ")}</td><td className="px-3 py-2 text-white/20">{c.platform}</td>
          <td className="text-right px-3 py-2 text-white/15 tabular-nums">${(c.budget/1000).toFixed(0)}K</td><td className="text-right px-3 py-2 text-white/30 tabular-nums">${(c.spend/1000).toFixed(0)}K</td>
          <td className="text-right px-3 py-2 text-sky-400 tabular-nums">{c.roas.toFixed(1)}x</td><td className="text-right px-3.5 py-2 text-white/30 tabular-nums">{c.conversions}</td>
        </motion.tr>))}</tbody></table>
      </motion.div>
    </div>
  )
}

/* ═══ ENRICH — Data enrichment preview ═══ */
function EnrichDisplay() {
  const fields = [{l:"Income Band",m:94},{l:"Home Ownership",m:91},{l:"Purchase Intent",m:87},{l:"Interest Graph",m:82},{l:"Social Presence",m:78},{l:"Net Worth Band",m:74},{l:"Education Level",m:70}]
  return (
    <div className="max-w-[1100px] mx-auto space-y-5 pb-10">
      <motion.div {...f(0.1)}><p className="text-[15px] text-white/70 leading-relaxed">Ready to enrich <span className="text-sky-400">{persons.length} contacts</span> with <span className="text-white/90">{fields.length} consumer data fields</span>. Preview match rates below.</p></motion.div>
      <motion.div {...f(0.2)} className="rounded-lg border border-white/[0.06] overflow-hidden">
        {fields.map((fi,i)=>(<motion.div key={i} {...f(0.25+i*0.04)} className="bg-white/[0.025] px-4 py-3 border-b border-white/[0.03] last:border-0 flex items-center justify-between">
          <span className="text-[12px] text-white/50">{fi.l}</span>
          <div className="flex items-center gap-3"><div className="w-24 h-1 rounded-full bg-white/[0.06] overflow-hidden"><div className="h-full rounded-full bg-sky-400/40" style={{width:`${fi.m}%`}} /></div><span className="text-[10px] text-white/30 tabular-nums w-8 text-right">{fi.m}%</span></div>
        </motion.div>))}
      </motion.div>
      <motion.div {...f(0.6)} className="flex gap-3">
        <button className="px-4 py-2 rounded-lg bg-sky-400/10 text-sky-400 text-[12px] hover:bg-sky-400/15 transition-colors">Start Enrichment</button>
        <button className="px-4 py-2 rounded-lg bg-white/[0.04] text-white/40 text-[12px] hover:bg-white/[0.06] transition-colors">Preview Sample</button>
      </motion.div>
    </div>
  )
}

/* ═══ ACTIVATE — Channel sync status ═══ */
function ActivateDisplay() {
  const channels = [{name:"Meta Ads",n:1420,status:"Syncing",pct:65},{name:"Klaviyo Email",n:1420,status:"Queued",pct:0},{name:"Google Ads",n:890,status:"Complete",pct:100},{name:"TikTok Ads",n:600,status:"Pending",pct:0}]
  const readyAudiences = audiences.filter(a => a.isActivationReady)
  return (
    <div className="max-w-[1100px] mx-auto space-y-5 pb-10">
      <motion.div {...f(0.1)}><p className="text-[15px] text-white/70 leading-relaxed">Activating <span className="text-sky-400">{readyAudiences.length} ready segments</span> across {channels.length} channels. {channels.filter(c=>c.pct===100).length} complete, {channels.filter(c=>c.pct>0&&c.pct<100).length} syncing.</p></motion.div>
      <div className="grid grid-cols-2 gap-px rounded-lg overflow-hidden border border-white/[0.06]">
        {channels.map((ch,i)=>(<motion.div key={i} {...f(0.2+i*0.06)} className="bg-white/[0.025] p-4 hover:bg-white/[0.04] cursor-pointer transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-white/60">{ch.name}</span>
            <span className={`text-[8px] px-1.5 py-0.5 rounded ${ch.status==="Complete"?"bg-sky-400/8 text-sky-400":"bg-white/4 text-white/20"}`}>{ch.status}</span>
          </div>
          <p className="text-[9px] text-white/15 mb-2">{ch.n.toLocaleString()} profiles</p>
          <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden"><motion.div initial={{width:0}} animate={{width:`${ch.pct}%`}} transition={{delay:0.5+i*0.15,duration:0.8,ease:"easeOut"}} className="h-full rounded-full bg-sky-400/50" /></div>
        </motion.div>))}
      </div>
      <motion.div {...f(0.55)}><Dl label="Activation-Ready Segments" />
        <div className="rounded-lg border border-white/[0.06] overflow-hidden">{readyAudiences.map(a=>(
          <div key={a.id} className="bg-white/[0.025] px-3.5 py-2.5 border-b border-white/[0.03] last:border-0 flex items-center justify-between hover:bg-white/[0.04] cursor-pointer">
            <div><p className="text-[11px] text-white/50">{a.name}</p><p className="text-[9px] text-white/15">{a.estimatedSize.toLocaleString()} profiles · {a.channelRecommendation}</p></div>
            <span className="text-[9px] text-sky-400/50">Activate →</span>
          </div>))}</div>
      </motion.div>
    </div>
  )
}

/* ═══ MAIN ═══ */
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

  const renderDisplay = () => {
    switch (activeDisplay) {
      case "discover": return <DiscoverDisplay />
      case "people": return <PeopleDisplay />
      case "audiences": return <AudiencesDisplay />
      case "analytics": return <AnalyticsDisplay />
      case "enrich": return <EnrichDisplay />
      case "activate": return <ActivateDisplay />
      default: return <DiscoverDisplay />
    }
  }

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
                  transition={{ duration: 0.25 }} className="text-2xl tracking-tight sm:text-3xl text-white mb-6 text-center">
                  {mode.headline}
                </motion.h1>
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div key={activeDisplay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }} className="px-8 pt-4">
              <div className="flex items-center justify-between mb-4 max-w-[1100px] mx-auto">
                <h2 className="text-[13px] text-white/30">{displayTitle}</h2>
                <button onClick={reset} className="text-[10px] text-white/15 hover:text-white/40 transition-colors flex items-center gap-1"><X className="h-3 w-3" />New</button>
              </div>
              {renderDisplay()}
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
                    className={`relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all duration-200 ${on ? "border-white/25 text-white bg-white/8" : "border-white/8 text-white/30"} hover:text-white/60`}>
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
