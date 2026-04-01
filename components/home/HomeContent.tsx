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
import { toast } from "sonner"
import { Check, Sparkles, Clock, ArrowRight, Send, Flag, BarChart3 } from "lucide-react"
import { ProgressiveBlur } from "@/components/ui/progressive-blur"
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button"
import { SpecialText } from "@/components/ui/special-text"

/* ── Data ── */
const chart7d = kpiHistory.map(k => ({ date: new Date(k.date), revenue: Math.round(k.influencedRevenue / 1000), spend: Math.round(k.paidSpend / 1000) }))
const revD = kpiDelta(currentKpi.influencedRevenue, previousKpi.influencedRevenue)
const roasD = kpiDelta(currentKpi.roas, previousKpi.roas)
const convD = kpiDelta(currentKpi.ticketConversionRate, previousKpi.ticketConversionRate)
const matchD = kpiDelta(currentKpi.dataMatchRate, previousKpi.dataMatchRate)
const topCampaigns = allCampaigns.slice(0, 5)
const topPeople = [...persons].sort((a, b) => b.scores.ticketBuy - a.scores.ticketBuy).slice(0, 5)

const funnelData = [
  { label: "Reached", value: 48200, displayValue: "48.2K", color: "#f5f5f5" },
  { label: "Engaged", value: 12800, displayValue: "12.8K", color: "#f5f5f5" },
  { label: "Converted", value: 3400, displayValue: "3.4K", color: "#f5f5f5" },
  { label: "Revenue", value: 890, displayValue: "$242K", color: "#f5f5f5" },
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
  return <span className={`flex items-center gap-0.5 text-[10px] ${d.direction === "up" ? "text-white/90" : "text-white/30"}`}><I className="h-3 w-3" />{d.value.toFixed(1)}%</span>
}

const statusColors: Record<string, string> = {
  active_fan: "text-emerald-400", season_ticket_holder: "text-white/90",
  lapsed: "text-red-400/70", prospect: "text-amber-400", anonymous: "text-white/30",
}
const typeColors: Record<string, string> = {
  lifecycle: "bg-white/[0.04] text-white/90", predictive: "bg-amber-500/10 text-amber-400",
  sales: "bg-emerald-500/10 text-emerald-400", retargeting: "bg-purple-500/10 text-purple-400",
}

/* ── Data → InsightCard converters ── */
function makeTrendLocal(base: number, delta: number): { date: Date; primary: number; secondary?: number }[] {
  return Array.from({ length: 7 }, (_, i) => ({ date: new Date(Date.now() - (6 - i) * 86400000), primary: Math.round(base * (1 + (i/6) * delta) * (1 + Math.sin(i*2.1)*0.06)) }))
}

function audienceToCard(a: typeof audiences[0]): InsightCard {
  const members = persons.filter(p => p.audiences.includes(a.id))
  const avgTicketBuy = members.length > 0 ? members.reduce((s, p) => s + p.scores.ticketBuy, 0) / members.length : 0
  const estRevenue = Math.round(a.estimatedSize * (a.avgPropensityScore ?? 0) * 150)
  const refreshDate = new Date(a.lastRefreshedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
  const trendArrow = a.valueTrend === "up" ? "↑" : a.valueTrend === "down" ? "↓" : "→"

  // Build member preview table (top 5 by ticket buy score)
  const topMembers = [...members].sort((x, y) => y.scores.ticketBuy - x.scores.ticketBuy).slice(0, 5)
  const memberTable = topMembers.length > 0
    ? { headers: ["Person", "Status", "Ticket Buy", "Premium", "Income"], rows: topMembers.map(m => [`${m.firstName} ${m.lastName}`, m.fanStatus.replace(/_/g, " "), String(Math.round(m.scores.ticketBuy * 100)), String(Math.round(m.scores.premium * 100)), m.household.incomeBand]) }
    : { headers: ["Metric", "Value"], rows: [["Size", a.estimatedSize.toLocaleString()], ["Type", a.type], ["Channel", a.channelRecommendation], ["Email Reach", `${Math.round((a.emailReachRate ?? 0) * 100)}%`], ["Phone Reach", `${Math.round((a.phoneReachRate ?? 0) * 100)}%`]] }

  return {
    id: `aud-${a.id}`, label: a.type.toUpperCase(), mainValue: a.estimatedSize.toLocaleString(), valueColor: "text-white/90",
    copy: a.description, meaning: `${a.businessUnit} · ${a.channelRecommendation} recommended · ${a.isActivationReady ? "Activation ready" : "Not yet ready"} · Trend: ${trendArrow} ${a.valueTrend}`,
    cta: a.isActivationReady ? "Activate segment" : "View segment", color: "border-l-white/[0.15]", category: "Audience",
    relatedAudienceIds: [a.id],
    drillDown: {
      title: a.name, summary: `${a.description}. Business unit: ${a.businessUnit}. Last refreshed: ${refreshDate}.`,
      meaning: `${a.estimatedSize.toLocaleString()} members ${a.memberDelta && a.memberDelta > 0 ? `(+${a.memberDelta} recently)` : a.memberDelta && a.memberDelta < 0 ? `(${a.memberDelta})` : "(stable)"}. Estimated pipeline: ${estRevenue.toLocaleString()} at $150 avg ticket × ${Math.round((a.avgPropensityScore ?? 0) * 100)}% propensity.`,
      metrics: [
        { label: "Size", value: a.estimatedSize.toLocaleString(), context: `${a.memberDelta && a.memberDelta > 0 ? "+" : ""}${a.memberDelta ?? 0} recent change.` },
        { label: "Propensity", value: `${Math.round((a.avgPropensityScore ?? 0) * 100)}`, context: "Average score across segment." },
        { label: "Email Reach", value: `${Math.round((a.emailReachRate ?? 0) * 100)}%`, context: `Phone: ${Math.round((a.phoneReachRate ?? 0) * 100)}%` },
        { label: "Est. Pipeline", value: `${(estRevenue / 1000).toFixed(0)}K`, context: "Size × propensity × $150 avg." },
      ],
      evidence: `${a.name} is a ${a.type} segment in the ${a.businessUnit} unit. ${members.length} matched profiles in the system with avg ticket-buy propensity of ${Math.round(avgTicketBuy * 100)}.`,
      highlight: a.isActivationReady ? `Activation-ready via ${a.channelRecommendation}. Estimated ${Math.round(a.estimatedSize * (a.emailReachRate ?? 0))} reachable by email.` : `Not yet activation-ready. ${Math.round((a.avgPropensityScore ?? 0) * 100)} avg propensity — worth building.`,
      analysis: `Value trend: ${a.valueTrend}. ${a.memberDelta && Math.abs(a.memberDelta) > 50 ? "Significant movement — review segment composition." : "Stable composition."} ${members.length} profiles matched in Minerva with ${topMembers.length > 0 ? `top scorer: ${topMembers[0].firstName} ${topMembers[0].lastName} (${Math.round(topMembers[0].scores.ticketBuy * 100)})` : "no matched profiles"}.`,
      immediateActions: [
        a.isActivationReady ? `Push ${a.estimatedSize.toLocaleString()} profiles to ${a.channelRecommendation}` : "Complete audience enrichment",
        `Review top ${Math.min(topMembers.length, 5)} profiles for outreach priority`,
        "Create campaign brief for this segment",
      ],
      followUpActions: ["Build lookalike audience", "Set up automated refresh", "A/B test messaging variants"],
      sources: ["Minerva Audience Engine", "CRM Data", "Ticketmaster", `Last refresh: ${refreshDate}`],
      table: memberTable,
      actions: ["Activate", "Export CSV", "Build lookalike", "Compare segments"],
      chartData: makeTrendLocal(a.estimatedSize, (a.memberDelta ?? 0) / a.estimatedSize),
      chartLabels: { primary: "Segment Size" },
    },
  }
}

function campaignToCard(c: typeof allCampaigns[0]): InsightCard {
  const costPerConversion = c.conversions > 0 ? Math.round(c.spend / c.conversions) : 0
  const utilization = Math.round(c.spend / c.budget * 100)
  const remainingBudget = c.budget - c.spend
  const trendLabel = c.trend === "up" ? `↑ +${c.trendPct}%` : c.trend === "down" ? `↓ ${c.trendPct}%` : "→ Stable"

  return {
    id: `camp-${c.id}`, label: c.channel.toUpperCase(), mainValue: `${c.roas.toFixed(1)}x`, valueColor: "text-white/90",
    subtitle: c.name, copy: `${c.objective} via ${c.channel} on ${c.platform} · ${utilization}% of budget used · ${trendLabel}`,
    meaning: `${costPerConversion.toLocaleString()} per conversion · ${c.conversions} total · ${(remainingBudget/1000).toFixed(0)}K remaining`,
    cta: "View campaign detail", color: "border-l-white/[0.15]", category: "Campaign",
    relatedAudienceIds: [],
    drillDown: {
      title: c.name, summary: `${c.objective} campaign on ${c.platform} via ${c.channel}. Currently ${c.status}. Budget: ${(c.budget/1000).toFixed(0)}K allocated, ${(c.spend/1000).toFixed(0)}K spent (${utilization}%).`,
      meaning: `ROAS: ${c.roas.toFixed(1)}x · Cost per conversion: ${costPerConversion.toLocaleString()} · Remaining budget: ${(remainingBudget/1000).toFixed(0)}K · Performance trend: ${trendLabel}`,
      metrics: [
        { label: "ROAS", value: `${c.roas.toFixed(1)}x`, context: "Return on ad spend." },
        { label: "Cost/Conv", value: `${costPerConversion}`, context: `${c.conversions} conversions on ${(c.spend/1000).toFixed(0)}K.` },
        { label: "Utilization", value: `${utilization}%`, context: `${(remainingBudget/1000).toFixed(0)}K remaining of ${(c.budget/1000).toFixed(0)}K.` },
        { label: "Trend", value: trendLabel, context: "Recent performance direction." },
      ],
      evidence: `${c.name} is a ${c.status} ${c.channel} campaign on ${c.platform} targeting ${c.objective}. ${c.conversions} conversions at ${costPerConversion} each. ${utilization}% of budget consumed.`,
      highlight: c.roas >= 4 ? `Strong performer: ${c.roas.toFixed(1)}x ROAS is above the 4x benchmark.` : c.roas >= 3 ? `Solid: ${c.roas.toFixed(1)}x ROAS. Room to scale.` : `Below benchmark: ${c.roas.toFixed(1)}x ROAS needs optimization.`,
      analysis: `${c.name} is ${c.trend === "up" ? "trending upward — consider scaling budget" : c.trend === "down" ? "declining — review targeting and creative" : "performing steadily"}. At current pace, remaining ${(remainingBudget/1000).toFixed(0)}K will sustain ~${Math.round(remainingBudget / (c.spend / 30))} more days. ${c.conversions > 200 ? "High conversion volume — strong signal." : "Moderate volume — needs more data."}`,
      immediateActions: [
        c.trend === "up" ? `Scale budget by 20% (+${Math.round(c.budget * 0.2 / 1000)}K)` : "Audit targeting and creative performance",
        `Export ${c.conversions} converters as a segment for lookalike`,
        c.roas < 3 ? "Pause underperforming ad sets" : "Expand to new placements",
      ],
      followUpActions: ["Build lookalike from converter profiles", "Test 3 creative variants", "Plan next campaign flight"],
      sources: [c.platform, "Minerva Campaign Table", "Conversion Tracking", "Budget Planner"],
      table: { headers: ["Metric", "Value", "Context"], rows: [
        ["Platform", c.platform, c.channel],
        ["Objective", c.objective, c.status],
        ["Budget", `${(c.budget/1000).toFixed(0)}K`, `${utilization}% used`],
        ["Spend", `${(c.spend/1000).toFixed(0)}K`, `${(remainingBudget/1000).toFixed(0)}K left`],
        ["ROAS", `${c.roas.toFixed(1)}x`, c.roas >= 4 ? "Above benchmark" : "Below 4x"],
        ["Conversions", String(c.conversions), `${costPerConversion}/each`],
      ] },
      actions: [`Scale budget +20%`, "Pause campaign", "Export converters", "A/B test creative"],
      chartData: makeTrendLocal(c.spend / 7000, c.trend === "up" ? 0.15 : -0.08),
      chartLabels: { primary: "Daily Spend" },
    },
  }
}

function personToCard(p: Person): InsightCard {
  const primaryEmail = p.contacts.find(c => c.type === "email" && c.isPrimary)
  const primaryPhone = p.contacts.find(c => c.type === "phone" && c.isPrimary)
  const totalRevenue = p.tickets.reduce((s, t) => s + t.revenue, 0)
  const segmentNames = p.audiences.map(id => audiences.find(a => a.id === id)?.name ?? id).join(", ")
  const topAffinities = p.affinities.slice(0, 4).map(a => `${a.name} (${Math.round(a.score * 100)})`).join(", ")
  const daysSinceFirst = Math.round((Date.now() - new Date(p.firstSeenAt).getTime()) / 86400000)
  const daysSinceLast = Math.round((Date.now() - new Date(p.lastSeenAt).getTime()) / 86400000)

  // Build ticket spending chart (or propensity-based fallback)
  const ticketChart = p.tickets.length > 0
    ? p.tickets.map(t => ({ date: new Date(t.date), primary: t.revenue })).sort((a, b) => a.date.getTime() - b.date.getTime())
    : makeTrendLocal(Math.round(p.scores.ticketBuy * 100), 0.05)

  // Build rich data table — ticket history if available, else profile details
  const tableData = p.tickets.length > 0
    ? { headers: ["Date", "Product", "Seat", "Revenue", "Premium"], rows: p.tickets.map(t => [t.date.split("T")[0], t.product, t.seatCategory, `${t.revenue.toLocaleString()}`, t.isPremium ? "✦" : "—"]) }
    : { headers: ["Detail", "Value"], rows: [["Age", String(p.age)], ["Gender", p.gender], ["Location", `${p.city}, ${p.state} ${p.zip}`], ["Homeownership", p.household.homeownership], ["Household Size", String(p.household.householdSize)], ["Distance", `${p.household.distanceToStadium.toFixed(1)} mi`]] }

  return {
    id: `person-${p.id}`, label: p.fanStatus.replace(/_/g, " ").toUpperCase(), mainValue: `${Math.round(p.scores.ticketBuy * 100)}`, valueColor: "text-white/90",
    subtitle: `${p.firstName} ${p.lastName}`, copy: `${p.jobTitle} at ${p.company} · ${p.city}, ${p.state} · ${p.household.incomeBand}`,
    meaning: `${p.fanStatus.replace(/_/g, " ")} · Fan for ${daysSinceFirst}d · Last seen ${daysSinceLast}d ago · ${segmentNames}`,
    cta: "Contact with AI", color: "border-l-white/[0.15]", category: "Audience",
    relatedAudienceIds: p.audiences,
    drillDown: {
      title: `${p.firstName} ${p.lastName}`,
      summary: `${p.jobTitle} at ${p.company}. ${p.city}, ${p.state}. ${p.household.incomeBand} income, ${p.household.netWorthBand} net worth. ${p.household.homeownership}${p.household.hasChildren ? ", has children" : ""}. ${p.household.distanceToStadium.toFixed(1)} mi from stadium.`,
      meaning: `Identity confidence: ${Math.round(p.identityConfidence * 100)}% · Profile completeness: ${Math.round(p.profileCompleteness * 100)}% · Known status: ${p.knownStatus}${primaryEmail ? ` · ${primaryEmail.value}` : ""}${primaryPhone ? ` · ${primaryPhone.value}` : ""}`,
      metrics: [
        { label: "Ticket Buy", value: String(Math.round(p.scores.ticketBuy * 100)), context: "Propensity to purchase tickets." },
        { label: "Premium", value: String(Math.round(p.scores.premium * 100)), context: "Propensity for premium upgrade." },
        { label: "Renewal", value: String(Math.round(p.scores.renewal * 100)), context: "Likelihood to renew." },
        { label: "Churn Risk", value: String(Math.round(p.scores.churn * 100)), context: p.scores.churn > 0.5 ? "High risk — needs attention." : "Low risk." },
      ],
      evidence: `${p.firstName} is a ${p.fanStatus.replace(/_/g, " ")} in the ${p.lifecycleStage} stage. ${p.tickets.length > 0 ? `${p.tickets.length} ticket purchases totaling ${totalRevenue.toLocaleString()}.` : "No ticket purchases yet — acquisition opportunity."} Affinities: ${topAffinities || "None recorded"}.`,
      highlight: p.tickets.length > 0
        ? `${totalRevenue.toLocaleString()} total revenue · ${p.tickets.filter(t => t.isPremium).length} premium purchases · Most recent: ${p.tickets[0]?.product ?? "—"}`
        : `High-value prospect: ${p.household.incomeBand} income, ${p.household.netWorthBand} net worth. ${Math.round(p.scores.premium * 100)} premium propensity.`,
      analysis: `Segments: ${segmentNames}. Household: ${p.household.householdSize} people, ${p.household.homeownership}. Contact: ${p.contacts.length} channels (${p.contacts.map(c => `${c.type} ${Math.round(c.score * 100)}%`).join(", ")}). Age ${p.age}, ${p.gender}.`,
      immediateActions: [
        primaryEmail ? `Send personalized email to ${primaryEmail.value}` : "Enrich contact data",
        p.scores.churn > 0.5 ? "Flag for retention outreach" : "Add to upsell segment",
        p.scores.premium > 0.7 ? "Route to premium sales team" : "Include in next campaign",
      ],
      followUpActions: ["Build lookalike audience from this profile", "Track engagement weekly", "Review for VIP program"],
      sources: ["Minerva Profile Engine", "CRM", "Ticketmaster", "Identity Graph"],
      table: tableData,
      actions: ["Contact with AI", "Generate personalized email", "Add to segment", "Export profile"],
      chartData: ticketChart,
      chartLabels: { primary: p.tickets.length > 0 ? "Ticket Revenue" : "Propensity Score" },
    },
  }
}

/* ── KPI → InsightCard converter ── */
function kpiToCard(label: string, value: number, formatted: string, delta: { value: number; direction: string }, history: number[]): InsightCard {
  const trend = history.map((v, i) => ({ date: new Date(Date.now() - (history.length - 1 - i) * 86400000), primary: v }))
  return {
    id: `kpi-${label.toLowerCase().replace(/\s/g, "-")}`, label: "KPI", mainValue: formatted, valueColor: "text-white/90",
    subtitle: label, copy: `${label} is ${delta.direction === "up" ? "trending up" : delta.direction === "down" ? "trending down" : "stable"} at ${formatted}.`,
    meaning: `${delta.direction === "up" ? "+" : ""}${delta.value.toFixed(1)}% vs previous period.`,
    cta: "View daily breakdown", color: "border-l-white/[0.15]", category: "Signal",
    relatedAudienceIds: [],
    drillDown: {
      title: `${label} — Daily Breakdown`,
      summary: `Current ${label.toLowerCase()}: ${formatted}. ${delta.direction === "up" ? "Trending upward" : delta.direction === "down" ? "Declining" : "Stable"} with ${delta.value.toFixed(1)}% change.`,
      meaning: `This KPI ${delta.direction === "up" ? "is improving — momentum is positive." : delta.direction === "down" ? "needs attention — negative trend." : "is holding steady."}`,
      metrics: [
        { label: "Current", value: formatted, context: "Latest value." },
        { label: "Change", value: `${delta.direction === "up" ? "+" : ""}${delta.value.toFixed(1)}%`, context: "vs previous period." },
        { label: "7d High", value: String(Math.round(Math.max(...history))), context: "Best day this week." },
        { label: "7d Low", value: String(Math.round(Math.min(...history))), context: "Weakest day this week." },
      ],
      evidence: `${label} has been tracked over 7 days with ${delta.direction === "up" ? "positive" : delta.direction === "down" ? "negative" : "neutral"} trajectory.`,
      highlight: `Current value ${formatted} is ${delta.direction === "up" ? "above" : delta.direction === "down" ? "below" : "at"} the 7-day average.`,
      analysis: `Review the daily trend to identify which days drove the ${delta.direction === "up" ? "improvement" : delta.direction === "down" ? "decline" : "stability"} and correlate with campaign activity.`,
      immediateActions: [delta.direction === "down" ? "Investigate root cause of decline" : "Maintain current strategy", "Compare with campaign timing", "Share report with team"],
      followUpActions: ["Set up automated alerts for this KPI", "Build weekly review cadence", "Correlate with audience changes"],
      sources: ["Minerva Analytics Pipeline", "Daily KPI Tracker"],
      table: { headers: ["Day", "Value"], rows: history.slice(-7).map((v, i) => [new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }), String(Math.round(v))]) },
      actions: ["Export CSV", "Set alert threshold", "Compare periods", "Share with team"],
      chartData: trend,
      chartLabels: { primary: label },
    },
  }
}

/* ═══ MAIN COMPONENT ═══ */
export function HomeContent() {
  const router = useRouter()

  const [activeSection, setActiveSection] = useState("briefing")
  const [activeMode, setActiveMode] = useState(0)
  const [showCanvas, setShowCanvas] = useState(false)
  const [activeCard, setActiveCard] = useState<InsightCard | null>(null)
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set())
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  const markAction = useCallback((id: string) => {
    setCompletedActions(prev => new Set(prev).add(id))
  }, [])

  const enterCanvas = useCallback((sectionId: string) => {
    setActiveSection(sectionId)
    setShowCanvas(true)
    window.dispatchEvent(new CustomEvent('minerva-nav-section', { detail: sectionId }))
  }, [])

  // Auto-cycle headlines on welcome screen
  useEffect(() => {
    if (showCanvas) return
    const interval = setInterval(() => {
      setActiveMode(prev => (prev + 1) % sections.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [showCanvas])

  // Listen for logo "go home" event
  useEffect(() => {
    const goHome = () => { setShowCanvas(false); setActiveCard(null) }
    window.addEventListener('minerva-go-home', goHome)
    return () => window.removeEventListener('minerva-go-home', goHome)
  }, [])

  // Listen for notch section navigation
  useEffect(() => {
    const navSection = (e: Event) => {
      const section = (e as CustomEvent).detail
      setShowCanvas(true)
      setActiveSection(section)
    }
    window.addEventListener('minerva-nav-section', navSection)
    return () => window.removeEventListener('minerva-nav-section', navSection)
  }, [])



  return (
    <div className="mn-home flex flex-col h-full">
      <AnimatePresence mode="wait">
      {!showCanvas ? (
        /* ═══ HERO LANDING ═══ */
        <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }} className="mn-hero flex-1 flex flex-col items-center justify-center px-6">
          <AnimatePresence mode="wait">
            <motion.h1 key={sections[activeMode].id} initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: "easeInOut" }} className="mn-hero-headline text-2xl sm:text-3xl tracking-tight text-white mb-10 text-center">
              {sections[activeMode].headline}
            </motion.h1>
          </AnimatePresence>

          {/* Liquid metal Enter button */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <LiquidMetalButton label="Enter" onClick={() => enterCanvas("briefing")} />
          </motion.div>

          {/* Footer credit */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="mn-hero-credit absolute bottom-6 left-0 right-0 text-center text-[11px] text-white/15 tracking-wide">
            Minerva<sup className="text-[7px]">™</sup> Intelligence. By Amit Roopnarine.
          </motion.p>
        </motion.div>
      ) : (
        /* ═══ CANVAS VIEW ═══ */
        <motion.div key="canvas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
          className="mn-canvas flex-1 flex flex-col min-h-0 relative">

      {/* Sticky header: briefing + tabs */}
      <div className="mn-canvas-header shrink-0 px-6 pt-4 pb-0 max-w-[1100px] mx-auto w-full">
        <motion.div {...f(0.05)}>
          <p className="mn-briefing-date text-[10px] tracking-widest text-white/20 uppercase">Tuesday, April 1 · Morning Briefing</p>
          <AnimatePresence mode="wait">
            <motion.p key={activeSection} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}
              className="mn-briefing-copy text-[15px] text-white/70 mt-2 leading-relaxed max-w-3xl">
              {activeSection === "briefing" && (<>
                <span className="text-white/90">Good morning, Sarah.</span> Revenue is <span className="text-white/90">${(currentKpi.influencedRevenue/1000).toFixed(0)}K</span> with ROAS at <span className="text-white/90">{currentKpi.roas.toFixed(1)}x</span>. Family audience is surging. <span className="text-white/40">3 actions ready to execute.</span>
              </>)}
              {activeSection === "insights" && (<>
                <span className="text-white/90">3 positive signals</span>, <span className="text-white/90">1 declining metric</span>, and <span className="text-white/90">1 weekend opportunity</span>. Family audience consideration is the strongest trend — up 14% across Miami-Dade and Broward. Owned conversion is your biggest gap. <span className="text-white/40">Minerva suggests prioritizing the conversion funnel audit.</span>
              </>)}
              {activeSection === "audiences" && (<>
                <span className="text-white/90">{audiences.length} segments</span> across lifecycle, predictive, and behavioral types. <span className="text-white/90">{audiences.filter(a=>a.isActivationReady).length} are activation-ready</span> with a combined pipeline of <span className="text-white/90">${Math.round(audiences.reduce((s,a) => s + a.estimatedSize * (a.avgPropensityScore ?? 0) * 150, 0) / 1000)}K</span>. <span className="text-white/40">Seatmap Retargeting Pool grew +142 this week.</span>
              </>)}
              {activeSection === "people" && (<>
                <span className="text-white/90">Marcus Johnson</span> is your highest-value contact — $8.4K total revenue, 97 ticket-buy propensity. <span className="text-white/90">Sofia Reyes</span> has a 78 churn risk — retention outreach recommended. <span className="text-white/40">2 prospects are ready for premium sales routing.</span>
              </>)}
            </motion.p>
          </AnimatePresence>

          {/* Inline tab bar — FILTERS, not scroll anchors */}
          <div className="mn-inline-tabs flex items-center gap-1 mt-4 mb-5">
            {sections.map((s) => {
              const on = activeSection === s.id
              return (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={`mn-inline-tab text-[12px] px-3 py-1.5 rounded-lg transition-all ${
                    on ? "bg-white text-black font-medium shadow-sm" : "text-white/30 hover:text-white/60 hover:bg-white/[0.04]"
                  }`}>
                  {s.label}
                </button>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Scrollable content — only the active section */}
      <div ref={scrollRef} className="mn-canvas-scroll flex-1 overflow-y-auto relative z-10" style={{ scrollbarWidth: "none" }}>
        <div className="mn-canvas-inner px-6 pb-20 max-w-[1100px] mx-auto">

        <AnimatePresence mode="wait">
        {activeSection === "briefing" && (
          <motion.section key="briefing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="mn-section mn-briefing space-y-5">

            {/* AI Recommendation */}
            <motion.div {...f(0.08)} className="mn-ai-rec rounded-lg border border-white/[0.06] bg-white/[0.03] p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-white/90 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="mn-ai-rec-label text-[9px] tracking-widest text-white/30 uppercase mb-1">Minerva recommends</p>
                  <p className="mn-ai-rec-copy text-[13px] text-white/70 leading-relaxed">
                    Scale <span className="text-white/90">Family Ticket Bundle</span> budget by 20% and activate <span className="text-white/90">Seatmap Retargeting Pool</span> (900 profiles). Combined estimated lift: <span className="text-white/90">+$34K revenue</span> this week.
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    {!completedActions.has('ai-rec-1') ? (
                      <button onClick={() => { markAction('ai-rec-1'); toast.success('Executed: Budget scaled +20% and retargeting pool activated', { description: 'Both actions queued. Estimated lift: +$34K.' }) }}
                        className="mn-ai-rec-btn text-[11px] font-medium text-white/90 bg-white/[0.06] hover:bg-white/[0.1] px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5">
                        <ArrowRight className="h-3 w-3" /> Execute both
                      </button>
                    ) : (
                      <span className="mn-ai-rec-done text-[11px] text-white/50 flex items-center gap-1.5"><Check className="h-3 w-3" /> Executed · Budget scaled · Retargeting activated</span>
                    )}
                    <span className="text-[10px] text-white/15 flex items-center gap-1"><Clock className="h-3 w-3" /> Generated 12 min ago · 91% confidence</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* KPI Strip */}
            <motion.div {...f(0.12)} className="mn-kpi-strip grid grid-cols-4 gap-px rounded-lg overflow-hidden border border-white/[0.06]">
              {[
                { l:"Revenue",n:currentKpi.influencedRevenue/1000,dec:0,pre:"$",suf:"K",d:revD,s:kpiHistory.map(k=>k.influencedRevenue) },
                { l:"ROAS",n:currentKpi.roas,dec:1,pre:"",suf:"x",d:roasD,s:kpiHistory.map(k=>k.roas) },
                { l:"Conv Rate",n:currentKpi.ticketConversionRate*100,dec:1,pre:"",suf:"%",d:convD,s:kpiHistory.map(k=>k.ticketConversionRate) },
                { l:"Match Rate",n:currentKpi.dataMatchRate*100,dec:0,pre:"",suf:"%",d:matchD,s:kpiHistory.map(k=>k.dataMatchRate) },
              ].map((m,i)=>(
                <div key={i} onClick={() => setActiveCard(kpiToCard(m.l, m.n, `${m.pre}${m.n.toFixed(m.dec)}${m.suf}`, m.d, m.s))} className="mn-kpi-cell bg-black/60 px-4 py-3.5 hover:bg-white/[0.04] transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-1"><p className="mn-kpi-label text-[8px] text-white/15 uppercase tracking-widest">{m.l}</p><Sparkline data={m.s} width={44} height={14} showArea={false} showDot={false} /></div>
                  <div className="mn-kpi-row flex items-end justify-between"><p className="mn-kpi-value text-[20px] tracking-tight text-white leading-none"><CountUp end={m.n} decimals={m.dec} prefix={m.pre} suffix={m.suf} /></p><Tr d={m.d} /></div>
                </div>))}
            </motion.div>

            {/* Funnel + Chart row */}
            <div className="mn-briefing-charts grid grid-cols-3 gap-4">
              <motion.div {...f(0.2)} className="mn-funnel-card rounded-lg border border-white/[0.06] p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
                <Lbl>Conversion Funnel</Lbl>
                <FunnelChart data={funnelData} color="#f5f5f5" layers={2} edges="straight" gap={2}
                  showPercentage={false} showValues={true} showLabels={true}
                  className="h-[100px]" style={{ aspectRatio: "unset" }} />
              </motion.div>
              <motion.div {...f(0.25)} className="mn-revenue-card col-span-2 rounded-lg border border-white/[0.06] p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
                <div className="flex items-center justify-between mb-2">
                  <Lbl>Revenue vs Spend · 7d</Lbl>
                  <div className="flex items-center gap-4 text-[9px] text-white/25">
                    <span className="flex items-center gap-1"><span className="inline-block w-3 h-[1.5px] bg-white/50" /> Revenue</span>
                    <span className="flex items-center gap-1"><span className="inline-block w-3 h-[1.5px] bg-white/20" /> Spend</span>
                  </div>
                </div>
                {/* Y-axis labels */}
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[8px] text-white/20 tabular-nums z-10">
                    <span>${Math.round(Math.max(...chart7d.map(d=>d.revenue)))}K</span>
                    <span>${Math.round((Math.max(...chart7d.map(d=>d.revenue)) + Math.min(...chart7d.map(d=>d.spend))) / 2)}K</span>
                    <span>${Math.round(Math.min(...chart7d.map(d=>d.spend)))}K</span>
                  </div>
                  <div className="ml-8">
                    <VisxAreaChart data={chart7d} xDataKey="date" aspectRatio="3 / 1" margin={{top:8,right:8,bottom:24,left:4}}>
                      <VisxGrid horizontal numTicksRows={3} strokeDasharray="2,4" strokeOpacity={0.1} />
                      <VisxArea dataKey="revenue" fill="rgba(245,245,245,0.06)" stroke="rgba(245,245,245,0.5)" strokeWidth={1.5} />
                      <VisxArea dataKey="spend" fill="rgba(245,245,245,0.02)" stroke="rgba(245,245,245,0.15)" strokeWidth={1} />
                      <VisxXAxis numTicks={5} />
                    </VisxAreaChart>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Top campaigns */}
            <motion.div {...f(0.3)} className="mn-campaign-table-wrap rounded-lg border border-white/[0.06] overflow-hidden">
              <table className="mn-campaign-table w-full text-[11.5px]">
                <thead><tr className="mn-campaign-thead bg-white/[0.02]">
                  <th className="mn-campaign-th text-left px-3.5 py-2 text-white/15 text-[8px] uppercase tracking-widest">Campaign</th>
                  <th className="text-left px-3 py-2 text-white/15 text-[8px] uppercase tracking-widest">Platform</th>
                  <th className="text-right px-3 py-2 text-white/15 text-[8px] uppercase tracking-widest">Spend</th>
                  <th className="text-right px-3 py-2 text-white/15 text-[8px] uppercase tracking-widest">ROAS</th>
                  <th className="text-right px-3.5 py-2 text-white/15 text-[8px] uppercase tracking-widest">Conv</th>
                </tr></thead>
                <tbody>{topCampaigns.map(c=>(
                  <tr key={c.id} onClick={() => setActiveCard(campaignToCard(c))} className="mn-campaign-row border-t border-white/[0.03] hover:bg-white/[0.02] cursor-pointer">
                    <td className="mn-campaign-name px-3.5 py-2 text-white/50 flex items-center gap-1.5">{c.trend==="up"?<TrendingUp className="h-3 w-3 text-white/30"/>:<TrendingDown className="h-3 w-3 text-white/15"/>}{c.name}</td>
                    <td className="mn-campaign-platform px-3 py-2 text-white/20">{c.platform}</td>
                    <td className="mn-campaign-spend text-right px-3 py-2 text-white/25 tabular-nums">${(c.spend/1000).toFixed(0)}K</td>
                    <td className="mn-campaign-roas text-right px-3 py-2 text-white/90 tabular-nums">{c.roas.toFixed(1)}x</td>
                    <td className="mn-campaign-conv text-right px-3.5 py-2 text-white/30 tabular-nums">{c.conversions}</td>
                  </tr>))}</tbody>
              </table>
            </motion.div>
            {/* Next best actions queue */}
            <motion.div {...f(0.35)} className="mn-actions-queue space-y-2">
              <Lbl>Next best actions</Lbl>
              {[
                { id: 'nba-1', label: 'Activate Seatmap Retargeting Pool', detail: '900 profiles · paid channel · $99K pipeline', icon: Send },
                { id: 'nba-2', label: 'Send renewal reminder to 700 at-risk members', detail: 'Renewal Risk Members · email · 94% reach', icon: Send },
                { id: 'nba-3', label: 'Route Marcus Johnson to premium sales', detail: 'Ticket Buy: 97 · Premium: 88 · $8.4K revenue', icon: Flag },
              ].map((a) => (
                <div key={a.id} className="mn-nba-item flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.015] px-4 py-3 group">
                  <a.icon className="h-3.5 w-3.5 text-white/15 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="mn-nba-label text-[12px] text-white/60">{a.label}</p>
                    <p className="mn-nba-detail text-[10px] text-white/20">{a.detail}</p>
                  </div>
                  {!completedActions.has(a.id) ? (
                    <button onClick={() => { markAction(a.id); toast.success(`Done: ${a.label}`) }}
                      className="mn-nba-btn text-[10px] text-white/25 hover:text-white/90 transition-colors shrink-0 flex items-center gap-1">
                      Execute <ArrowRight className="h-3 w-3" />
                    </button>
                  ) : (
                    <span className="mn-nba-done text-[10px] text-white/40 flex items-center gap-1 shrink-0"><Check className="h-3 w-3" /> Done</span>
                  )}
                </div>
              ))}
            </motion.div>

            {/* Data sources */}
            <motion.div {...f(0.4)} className="mn-sources flex items-center gap-4 text-[10px] text-white/15">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Last sync: 8:12 AM</span>
              <span>Ticketmaster · Klaviyo · Meta · Salesforce · Identity Graph</span>
              <span className="text-white/90/30">5 sources connected</span>
            </motion.div>
          </motion.section>
        )}

        {activeSection === "insights" && (
          <motion.section key="insights" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="mn-section mn-insights">
            <motion.div {...f(0.05)} className="mn-insights-header flex items-center justify-between mb-4">
              <Lbl>Signals</Lbl>
              <span className="mn-insights-count text-[10px] text-white/15">{insightCardsFull.length} detected · sorted by impact</span>
            </motion.div>
            <div className="mn-insights-grid grid grid-cols-4 gap-3">
              {insightCardsFull.map((card, idx) => (
                <motion.div key={card.id} {...f(0.05 + idx * 0.04)}
                  whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCard(card)}
                  className="mn-insight-card rounded-lg border border-white/[0.04] p-4 flex flex-col cursor-pointer hover:bg-white/[0.02] transition-all" style={{ background: 'rgba(0,0,0,0.4)' }}>
                  <span className="mn-insight-label text-[8px] tracking-widest text-white/20 uppercase">{card.label}</span>
                  {card.mainValue && <span className="mn-insight-value text-[22px] font-bold tracking-tight leading-none mt-1 text-white/90">{card.mainValue}</span>}
                  {card.subtitle && <span className="mn-insight-subtitle text-[15px] font-semibold tracking-tight leading-tight mt-1">{card.subtitle}</span>}
                  <p className="mn-insight-copy text-[11px] text-white/40 leading-snug mt-2 flex-1">{card.copy}</p>
                  <span className="mn-insight-cta text-[10px] text-white/20 mt-3">{card.cta}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {activeSection === "audiences" && (
          <motion.section key="audiences" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="mn-section mn-audiences">
            {/* Audience summary stats */}
            <motion.div {...f(0)} className="mn-aud-summary grid grid-cols-4 gap-px rounded-lg overflow-hidden border border-white/[0.04] mb-5">
              {[
                { l: 'Total Profiles', v: audiences.reduce((s,a) => s+a.estimatedSize, 0).toLocaleString() },
                { l: 'Activation Ready', v: `${audiences.filter(a=>a.isActivationReady).length} of ${audiences.length}` },
                { l: 'Est. Pipeline', v: `${(audiences.reduce((s,a) => s + a.estimatedSize * (a.avgPropensityScore ?? 0) * 150, 0) / 1000).toFixed(0)}K` },
                { l: 'Net Growth', v: `+${audiences.reduce((s,a) => s + Math.max(a.memberDelta ?? 0, 0), 0).toLocaleString()}` },
              ].map((s,i) => (
                <div key={i} className="bg-white/[0.015] px-4 py-3">
                  <p className="text-[8px] text-white/15 uppercase tracking-widest mb-1">{s.l}</p>
                  <p className="text-[16px] text-white/70 font-medium tracking-tight">{s.v}</p>
                </div>
              ))}
            </motion.div>

            <motion.div {...f(0.05)} className="mn-audiences-header flex items-center justify-between mb-4">
              <Lbl>Segments</Lbl>
              <span className="text-[10px] text-white/15">{audiences.length} segments · {audiences.filter(a=>a.isActivationReady).length} ready to activate</span>
            </motion.div>
            <div className="mn-audiences-grid grid grid-cols-3 gap-4">
              {audiences.map((a, idx) => (
                <motion.div key={a.id} {...f(0.03 + idx * 0.04)}
                  onClick={() => setActiveCard(audienceToCard(a))}
                  className="mn-audience-card mn-glass-card rounded-xl p-5 cursor-pointer hover:bg-white/[0.04] transition-colors group">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[8px] mn-audience-type tracking-widest uppercase font-medium ${typeColors[a.type]?.split(" ")[1] ?? "text-white/20"}`}>{a.type}</span>
                    {a.isActivationReady && (
                      <span className="mn-audience-badge text-[9px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/90 font-medium flex items-center gap-1">
                        <Zap className="h-2.5 w-2.5" /> Ready
                      </span>
                    )}
                  </div>
                  <p className="mn-audience-name text-[13px] font-medium text-white/80 mb-0.5">{a.name}</p>
                  <p className="mn-audience-size text-[22px] font-bold tracking-tight text-white leading-none mb-1.5">{a.estimatedSize.toLocaleString()}</p>
                  {/* Propensity bar */}
                  <div className="mn-audience-propensity-bar w-full h-1 rounded-full bg-white/[0.04] mb-2">
                    <div className="h-full rounded-full bg-white/[0.15]" style={{ width: `${(a.avgPropensityScore ?? 0) * 100}%` }} />
                  </div>
                  <div className="mn-audience-meta flex items-center gap-3 text-[10px] text-white/25">
                    <span>${Math.round(a.estimatedSize * (a.avgPropensityScore ?? 0) * 150 / 1000)}K pipeline</span>
                    <span>{a.channelRecommendation}</span>
                    {a.memberDelta != null && a.memberDelta !== 0 && (
                      <span className={a.memberDelta > 0 ? "text-white/40" : "text-white/20"}>
                        {a.memberDelta > 0 ? "+" : ""}{a.memberDelta}
                      </span>
                    )}
                  </div>
                  {a.isActivationReady && (
                    <button className="mn-audience-cta mt-3 text-[10px] text-white/50 group-hover:text-white/90 transition-colors flex items-center gap-1">
                      Activate <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {activeSection === "people" && (
          <motion.section key="people" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="mn-section mn-people">
            <motion.div {...f(0.05)} className="mn-people-header flex items-center justify-between mb-4">
              <Lbl>Top profiles</Lbl>
              <span className="text-[10px] text-white/15">{persons.length} matched · sorted by ticket-buy propensity</span>
            </motion.div>
            <motion.div {...f(0.05)} className="mn-people-table-wrap rounded-lg border border-white/[0.06] overflow-hidden">
              <table className="mn-people-table w-full text-[12px]">
                <thead><tr className="mn-people-thead bg-white/[0.02]">
                  <th className="mn-people-th text-left px-3.5 py-2.5 text-white/15 text-[8px] uppercase tracking-widest">Person</th>
                  <th className="text-left px-3 py-2.5 text-white/15 text-[8px] uppercase tracking-widest">Status</th>
                  <th className="text-left px-3 py-2.5 text-white/15 text-[8px] uppercase tracking-widest w-[120px]">Propensity</th>
                  <th className="text-left px-3 py-2.5 text-white/15 text-[8px] uppercase tracking-widest">AI Reason</th>
                  <th className="text-right px-3.5 py-2.5 text-white/15 text-[8px] uppercase tracking-widest">Action</th>
                </tr></thead>
                <tbody>{topPeople.map(p=>(
                  <tr key={p.id} onClick={() => setActiveCard(personToCard(p))}
                    className="mn-people-row border-t border-white/[0.03] hover:bg-white/[0.03] cursor-pointer transition-colors">
                    <td className="px-3.5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar name={`${p.firstName} ${p.lastName}`} size={28} />
                        <div>
                          <p className="mn-person-name text-[12px] font-medium text-white/80">{p.firstName} {p.lastName}</p>
                          <p className="mn-person-location text-[10px] text-white/25">{p.city}, {p.state}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`mn-person-status text-[10px] ${statusColors[p.fanStatus] ?? "text-white/30"}`}>
                        {p.fanStatus.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="mn-propensity-bar w-16 h-1.5 rounded-full bg-white/[0.04]">
                          <div className="h-full rounded-full bg-white/[0.2]" style={{ width: `${p.scores.ticketBuy * 100}%` }} />
                        </div>
                        <span className="text-[10px] text-white/40 tabular-nums">{Math.round(p.scores.ticketBuy * 100)}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="mn-ai-reason text-[10px] text-white/30">
                        {p.scores.churn > 0.5 ? 'Churn risk — needs retention' : p.scores.premium > 0.7 ? 'Premium sales candidate' : p.tickets.length === 0 ? 'Acquisition opportunity' : `${p.tickets.reduce((s,t)=>s+t.revenue,0).toLocaleString()} revenue`}
                      </span>
                    </td>
                    <td className="text-right px-3.5 py-2.5">
                      {!completedActions.has(`contact-${p.id}`) ? (
                        <button onClick={(e) => { e.stopPropagation(); markAction(`contact-${p.id}`); toast.success(`Outreach queued: ${p.firstName} ${p.lastName}`) }}
                          className="mn-row-action text-[10px] text-white/20 hover:text-white/90 transition-colors">
                          Contact
                        </button>
                      ) : (
                        <span className="text-[10px] text-white/40 flex items-center justify-end gap-1"><Check className="h-3 w-3" /> Sent</span>
                      )}
                    </td>
                  </tr>))}</tbody>
              </table>
            </motion.div>
          </motion.section>
        )}
        </AnimatePresence>

        </div>
      </div>

      {/* ═══ BOTTOM FADE ═══ */}
      <div className="mn-canvas-fade pointer-events-none absolute bottom-0 left-0 right-0 h-32 z-[5]" style={{
        background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.4) 60%, transparent 100%)',
      }} />
        </motion.div>
      )}
      </AnimatePresence>



      <AnimatePresence>
        {activeCard && (
          <DrillDownModal card={activeCard} onClose={() => setActiveCard(null)}
            onPersonClick={(personId) => {
              const p = persons.find(x => x.id === personId)
              if (p) setActiveCard(personToCard(p))
            }} />
        )}
      </AnimatePresence>
    </div>
  )
}
