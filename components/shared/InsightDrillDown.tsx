"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { persons } from "@/lib/data/persons"
import { SevenSegmentDisplay } from "@/components/ui/seven-segment"
import { UserAvatar } from "@/components/shared/UserAvatar"
import { AreaChart as VisxAreaChart, Area as VisxArea, Grid as VisxGrid, ChartTooltip as VisxTooltip } from "@/components/ui/area-chart"
import { PlatformIcon } from "@/components/shared/PlatformIcon"

export interface InsightCard {
  id: string
  label: string
  mainValue: string
  valueColor: string
  copy: string
  meaning: string
  subtitle?: string
  pill?: string
  cta: string
  color: string
  category: string
  openSpectrum?: true
  relatedAudienceIds: string[]
  drillDown: {
    title: string
    subtext?: string
    headline?: string
    supportingContext?: string
    analysis?: string
    projectedScale?: string
    projectedInaction?: string
    confidence?: { score: number; reason: string }
    metrics: { label: string; value: string; context: string }[]
    evidence: string
    highlight: string
    table: { headers: string[]; rows: string[][]; deltaCol?: number }
    recommendedActions?: string[]
    watchConditions?: string[]
    sources: string[]
    actions: string[]
    chartData?: { date: Date; primary: number; secondary?: number }[]
    chartLabels?: { primary: string; secondary?: string }
    // legacy compat
    summary?: string
    meaning?: string
    immediateActions?: string[]
    followUpActions?: string[]
  }
}

const categories = ["All", "Signal", "Audience", "Campaign", "Action"]

function makeTrend(base: number, delta: number, noise = 0.08): { date: Date; primary: number; secondary?: number }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const t = i / 6
    const jitter = 1 + (Math.sin(i * 2.1) * noise)
    return {
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
      primary: Math.round(base * (1 + t * delta) * jitter),
      secondary: Math.round(base * 0.6 * (1 + t * delta * 0.5) * jitter),
    }
  })
}

const insights: InsightCard[] = [
  {
    id: "1", label: "Attention", mainValue: "+18%", valueColor: "text-white/90",
    copy: "Awareness way up — but still mostly top-of-funnel.",
    meaning: "Top-of-funnel signal. Not converting to owned value yet, but the reach foundation is strong.",
    cta: "See channel breakdown", color: "border-l-white/[0.15]", category: "Signal",
    relatedAudienceIds: ["aud_001", "aud_010", "aud_007"],
    drillDown: {
      title: "Brand Attention Increased",
      subtext: "Multi-channel signal · Awareness lift · Active",
      headline: "Attention spike is real but shallow — owned capture needs to catch up",
      supportingContext: "Attention up 18% (76 → 90 in 24h), driven by player content and premium messaging. Social reach growing 3× faster than owned capture. IG +32%, TikTok +38%, but owned click-through flat.",
      analysis: "Player-led content drove broad reach with younger demos — owned capture didn't keep pace. The gap between social engagement and owned action is the primary opportunity. TikTok has the widest disconnect at 7.4pts.",
      projectedScale: "Adding CTAs to top 5 posts could convert 2–4% of current social reach into owned action, generating ~800 incremental app opens this week.",
      projectedInaction: "Without CTA optimization, the attention lift decays in 3–5 days with no downstream value captured.",
      confidence: { score: 72, reason: "Strong signal volume, moderate conversion data" },
      metrics: [
        { label: "Attention delta", value: "+18%", context: "76 → 90 in 24h" },
        { label: "Top channels", value: "IG · TikTok · Web", context: "Drove most of the reach lift" },
        { label: "Top audience", value: "Younger Fans", context: "Youth drove reach. Families drove intent" },
        { label: "Search lift", value: "+12%", context: "Schedule, ticket, premium queries all up" },
      ],
      evidence: "Player content and premium messaging (Mar 30–31) drove the biggest movement.",
      highlight: "Social reach is growing 3× faster than owned capture. That's the gap to close.",
      table: { headers: ["Channel", "Yesterday", "Today", "Delta"], rows: [["Instagram", "18.2k", "24.1k", "+32%"], ["TikTok", "12.6k", "17.4k", "+38%"], ["Owned Web", "8.9k", "10.2k", "+15%"], ["Search", "6.4k", "7.2k", "+12%"]], deltaCol: 3 },
      recommendedActions: ["Review top 5 posts for CTA gaps", "Add ticket links to next content drop", "Brief social team on the conversion gap"],
      watchConditions: ["Owned click-through drops below 1.0%", "Attention delta reverses within 48h"],
      sources: ["Instagram Insights", "TikTok Analytics", "Google Search Console", "Engagement Pipeline"],
      actions: ["View top contributing posts", "Compare by audience", "Export attention summary", "Ask Minerva why it rose"],
      chartData: makeTrend(76, 0.18), chartLabels: { primary: "Attention", secondary: "Owned Capture" },
    },
  },
  {
    id: "2", label: "Premium Experience", mainValue: "+11%", valueColor: "text-white/90",
    copy: "Premium game-day messaging is beating general hype on ticket intent — strongest downstream lift.",
    meaning: "Strongest near-term revenue play in the data.",
    cta: "Analyze in Audience Spectrum →", color: "border-l-white/[0.15]", category: "Signal",
    openSpectrum: true,
    relatedAudienceIds: ["aud_002", "aud_006"],
    drillDown: {
      title: "Premium Experience: Strongest Revenue Signal",
      subtext: "Paid Meta campaign · Premium lead acquisition · Active",
      headline: "Strong performance, under-scaled — increase spend while efficiency holds",
      supportingContext: "Premium messaging 28% more efficient than generic hype on owned action. Intent 54 → 60 among high-value audiences. Premium Seating Push: 3.2% owned action — ~2× general hype.",
      analysis: "Performance improving with stable CPA ($1,028) and no signs of saturation. Volume remains moderate (87 conversions), so results are directionally strong but not fully stabilized. The 28% efficiency gap vs general hype suggests high-intent audiences self-select.",
      projectedScale: "Increasing budget +20–30% expected to maintain ROAS between 3.5–4.0× and generate +18–25 additional conversions this week.",
      projectedInaction: "At current pace, remaining budget ($62K) sustains ~21 days with no additional lift. Momentum window is ~7 days.",
      confidence: { score: 78, reason: "Improving trend, moderate data volume" },
      metrics: [
        { label: "Ticket intent lift", value: "+11%", context: "Intent 54 → 60 among high-value audiences" },
        { label: "Best audience", value: "Premium Buyers", context: "Club, suite, hospitality wins here" },
        { label: "Vs general hype", value: "+28%", context: "Premium creative 28% more efficient on owned action" },
        { label: "Top campaign", value: "Premium Seating", context: "Top conversion driver in the mix" },
      ],
      evidence: "Premium messaging consistently beats generic hype on clickthrough, ticket intent, and owned conversion.",
      highlight: "Premium Seating Push: 3.2% owned action — ~2× general hype.",
      table: { headers: ["Campaign", "CTR", "Intent Lift", "Owned Action"], rows: [["Premium Seating Push", "4.8%", "+16%", "3.2%"], ["Club Access Campaign", "4.1%", "+13%", "2.9%"], ["General Game Hype", "3.0%", "+6%", "1.8%"], ["Player Spotlight CTA", "3.4%", "+7%", "2.0%"]], deltaCol: 2 },
      recommendedActions: ["Scale Premium Seating Push +30%", "Build lookalike from 87 premium converters", "Share deck with VP Premium Sales"],
      watchConditions: ["CPA exceeds $1,150 → indicates saturation", "ROAS drops below 3.5× → pause scaling"],
      sources: ["Meta Ads Manager", "Campaign Table", "Ticketmaster Premium Sales API", "CRM Suite Holder Data"],
      actions: ["Generate premium sales brief", "Send to ticketing team", "Expand winning creative", "Compare with general hype"],
      chartData: makeTrend(54, 0.11, 0.06), chartLabels: { primary: "Ticket Intent", secondary: "Owned Action" },
    },
  },
  {
    id: "3", label: "Family Audience", mainValue: "+14%", valueColor: "text-white/90",
    copy: "Family consideration up 14%. Strongest in Dade + Broward — tied to weekend and planning messaging.",
    meaning: "Fastest-rising high-intent segment.",
    cta: "View regional data", color: "border-l-white/[0.15]", category: "Audience",
    relatedAudienceIds: ["aud_003"],
    drillDown: {
      title: "Family Ticket Interest Rising in South FL",
      subtext: "Audience signal · Regional lift · Active",
      headline: "Concentrated and actionable — launch Dade + Broward family campaign now",
      supportingContext: "Family consideration up 14% (44 → 50 in 24h). Miami-Dade +19% — strongest county lift. Convenience messaging beats excitement every time in this segment. Dade + Broward = 85% of lift.",
      analysis: "Weekend planning and ease-of-entry messaging drove the strongest family consideration and clickthrough. The lift is concentrated enough to run a targeted geo campaign with high confidence.",
      projectedScale: "Geo-targeted family campaign in Dade + Broward could reach ~12K families at 4.1% conversion — est. 490 ticket sales this month.",
      projectedInaction: "Family consideration peaks decay within 7–10 days without activation. Palm Beach is 2 weeks behind — window exists to expand.",
      confidence: { score: 81, reason: "Strong regional data, consistent trend" },
      metrics: [
        { label: "Family consideration", value: "+14%", context: "Segment score 44 → 50 in 24h" },
        { label: "Top counties", value: "Dade · Broward", context: "85% of total lift concentrated here" },
        { label: "Best message", value: "Ease + planning", context: "Convenience beats excitement" },
        { label: "Top campaign", value: "Family Weekend", context: "Top consideration lift in the set" },
      ],
      evidence: "Weekend planning and ease-of-entry messaging drove the strongest family consideration and clickthrough.",
      highlight: "Miami-Dade +19% — strongest county lift in the data.",
      table: { headers: ["Region", "Yesterday", "Today", "Delta"], rows: [["Miami-Dade", "21", "25", "+19%"], ["Broward", "18", "21", "+17%"], ["Palm Beach", "12", "13", "+8%"], ["South FL Total", "51", "59", "+14%"]], deltaCol: 3 },
      recommendedActions: ["Launch family campaign in Dade + Broward", "Build weekend planning email sequence", "Brief lifecycle team on family opportunity"],
      watchConditions: ["Family consideration drops below +8%", "Palm Beach fails to lift within 14 days"],
      sources: ["Audience Table", "Regional Sales Data", "Email Platform Analytics", "Geo Pipeline"],
      actions: ["Build campaign brief for segment", "Launch regional variant", "Assign to lifecycle team", "Compare vs premium"],
      chartData: makeTrend(44, 0.14, 0.07), chartLabels: { primary: "Family Consideration", secondary: "Regional Lift" },
    },
  },
  {
    id: "4", label: "Owned Conversion", mainValue: "-4%", valueColor: "text-white/50",
    copy: "Social engagement surged, but app opens, ticketing, and lifecycle capture aren't keeping up.",
    meaning: "Clear gap between attention and owned value.",
    cta: "See funnel gaps", color: "border-l-white/[0.15]", category: "Signal",
    relatedAudienceIds: ["aud_010", "aud_001"],
    drillDown: {
      title: "Owned Conversion Still Lagging",
      subtext: "Funnel signal · Conversion gap · Needs attention",
      headline: "The opportunity isn't more reach — it's better CTAs and clearer paths from social to app",
      supportingContext: "Owned action efficiency down 4%. Biggest leak: social engagement → owned clickthrough. TikTok: 8.6% engagement, 1.2% owned click — 7.4pt gap. Reach outpacing owned conversion.",
      analysis: "TikTok drives 38% more reach than any other channel but converts at 1.2% — the lowest owned action rate in the mix. The issue isn't content quality — it's the absence of clear owned pathways from social to app.",
      projectedScale: "Adding swipe-up CTAs to top 10 posts could close 2–3pts of the TikTok gap, converting ~400 incremental app opens.",
      projectedInaction: "Without CTA fixes, the attention/conversion gap widens each week as reach grows and capture stays flat.",
      confidence: { score: 85, reason: "High data volume, clear funnel pattern" },
      metrics: [
        { label: "Efficiency delta", value: "-4%", context: "Reach outpacing owned conversion" },
        { label: "Biggest drop-off", value: "Social → owned", context: "Biggest leak is post-engagement" },
        { label: "Most affected", value: "Younger + casual", context: "High engagement, action isn't following" },
        { label: "Worst gap", value: "TikTok", context: "Highest reach, weakest follow-through" },
      ],
      evidence: "Engagement up, but app opens, ticket clicks, and email capture lagging. TikTok gap is widest.",
      highlight: "TikTok: 8.6% engagement, 1.2% owned click — 7.4pt gap.",
      table: { headers: ["Channel", "Engagement", "Owned Click", "Gap"], rows: [["TikTok", "8.6%", "1.2%", "-7.4"], ["Instagram", "6.9%", "1.7%", "-5.2"], ["Email", "3.1%", "2.6%", "-0.5"], ["Owned Web", "4.2%", "3.4%", "-0.8"]], deltaCol: 3 },
      recommendedActions: ["Audit TikTok CTAs", "Add swipe-ups to next 5 IG stories", "Build landing page for social traffic"],
      watchConditions: ["Owned click-through drops below 1.0% on any channel", "Gap widens >8pts on TikTok"],
      sources: ["TikTok Analytics", "Instagram Insights", "App Store Connect", "Funnel Pipeline"],
      actions: ["Create CTA test", "Generate conversion brief", "Assign to performance team", "Create experiment"],
      chartData: makeTrend(82, -0.04, 0.05), chartLabels: { primary: "Engagement", secondary: "Owned Conversion" },
    },
  },
  {
    id: "5", label: "Sponsor Resonance", mainValue: "+9%", valueColor: "text-white/90",
    copy: "Luxury, hospitality, and Miami-lifestyle narratives are driving the strongest sponsor value right now.",
    meaning: "Strongest partner narrative right now.",
    cta: "View sponsor data", color: "border-l-white/[0.15]", category: "Signal",
    relatedAudienceIds: ["aud_002", "aud_007"],
    drillDown: {
      title: "Luxury + Hospitality Narratives Winning",
      subtext: "Partnership signal · Sponsor value · Active",
      headline: "Miami Lifestyle indexes 4× higher on sponsor lift — lock this into Q2 partner strategy",
      supportingContext: "Sponsor resonance up 9% (66 → 72). Miami Lifestyle: +12% sponsor lift — 4× general hype. Luxury and hospitality storytelling outperformed every other partnership narrative.",
      analysis: "Sponsor resonance is a leading indicator for partnership revenue. Miami Lifestyle indexes 4× higher on sponsor lift than general hype. Not the best ticketing driver — but the best partner story.",
      projectedScale: "Locking Miami Lifestyle into Q2 content calendar could increase sponsor value by 15–20% and support 2 new co-brand partnerships.",
      projectedInaction: "Sponsor attention decays faster than fan attention. Without reinforcement, the narrative advantage erodes in ~3 weeks.",
      confidence: { score: 74, reason: "Strong directional signal, limited sponsor volume data" },
      metrics: [
        { label: "Sponsor resonance", value: "+9%", context: "Narrative score 66 → 72" },
        { label: "Top narrative", value: "Miami Lifestyle", context: "Best brand-partner alignment" },
        { label: "Best audience", value: "Lifestyle premium", context: "Best response to luxury framing" },
        { label: "Top asset", value: "Lifestyle Content", context: "Highest sponsor lift" },
      ],
      evidence: "Luxury and hospitality storytelling outperformed every other partnership narrative on engagement quality and sponsor value.",
      highlight: "Miami Lifestyle: +12% sponsor lift — 4× general hype.",
      table: { headers: ["Narrative", "Engagement", "Sponsor Lift", "Sentiment"], rows: [["Miami Lifestyle", "5.4%", "+12%", "84"], ["Premium Game-Day", "4.8%", "+9%", "82"], ["Player Excitement", "7.1%", "+3%", "79"], ["General Hype", "4.0%", "+2%", "75"]], deltaCol: 2 },
      recommendedActions: ["Generate sponsor memo with lifestyle data", "ID top 3 sponsor-aligned content", "Share narrative comp with partnerships"],
      watchConditions: ["Sponsor lift drops below +6%", "Lifestyle sentiment drops below 80"],
      sources: ["Narrative Analysis", "Sponsor Tracking Platform", "Brand Sentiment Pipeline", "Social Listening Tools"],
      actions: ["Generate sponsor memo", "Export to partnerships", "Build partner summary", "Compare narratives"],
      chartData: makeTrend(66, 0.09, 0.06), chartLabels: { primary: "Sponsor Resonance", secondary: "Brand Lift" },
    },
  },
  {
    id: "6", label: "Top Campaign", mainValue: "", valueColor: "",
    subtitle: "Player Spotlight Series", pill: "High reach · low CTA",
    copy: "Biggest attention lift — but trails premium and family on owned conversion.",
    meaning: "Best for reach, not for conversion.",
    cta: "See campaign performance", color: "border-l-white/[0.15]", category: "Campaign",
    relatedAudienceIds: ["aud_001", "aud_010", "aud_007"],
    drillDown: {
      title: "Player Spotlight: Top Awareness Driver",
      subtext: "Content campaign · Awareness · Active",
      headline: "Don't replace it — add an owned-action layer to high-reach content",
      supportingContext: "Spotlight: 8.9% engagement, 1.6% owned action. Premium Seating: 4.8% / 3.2%. 34% of total social attention lift. Spotlight is doing its job — massive awareness.",
      analysis: "Player Spotlight is doing its job — massive awareness. Add CTAs to high-reach content, don't replace it. The 8.9% engagement rate is the highest in the mix, but the 1.6% owned action rate is 2× below Premium Seating.",
      projectedScale: "Adding CTA overlays to top 3 Spotlights could convert 1.5–2.5% of current engagement into owned action — ~500 incremental clicks.",
      projectedInaction: "Spotlight continues generating awareness with no downstream capture. The attention value decays without owned pathways.",
      confidence: { score: 82, reason: "High engagement volume, clear performance pattern" },
      metrics: [
        { label: "Attention impact", value: "34%", context: "34% of total social attention lift" },
        { label: "Best channels", value: "TikTok · IG", context: "Strongest on short-form social" },
        { label: "Engagement", value: "Very High", context: "Comments, saves, shares all up" },
        { label: "Owned action", value: "Med-Low", context: "CTA gap is the weak point" },
      ],
      evidence: "Best awareness tool. Not a conversion tool.",
      highlight: "Spotlight: 8.9% engagement, 1.6% owned action. Premium Seating: 4.8% / 3.2%.",
      table: { headers: ["Asset", "Reach", "Engagement", "Owned Action"], rows: [["Player Spotlight 01", "18.4k", "8.9%", "1.6%"], ["Player Spotlight 02", "16.8k", "8.1%", "1.5%"], ["Premium Seating Push", "11.2k", "4.8%", "3.2%"], ["Family Weekend Push", "9.6k", "5.2%", "2.8%"]], deltaCol: 3 },
      recommendedActions: ["Create CTA overlays for top 3 Spotlights", "Add ticket end-card to next video", "Build Spotlight → ticket attribution"],
      watchConditions: ["Engagement drops below 6%", "Owned action drops below 1.0%"],
      sources: ["TikTok Creator Studio", "Instagram Insights", "Campaign Table", "Content Management System"],
      actions: ["Generate CTA-enhanced variants", "Route to content team", "Compare against premium", "Ask Minerva how to improve"],
      chartData: makeTrend(42, 0.06, 0.1), chartLabels: { primary: "Reach", secondary: "Owned Action" },
    },
  },
  {
    id: "7", label: "Audience Shift", mainValue: "", valueColor: "",
    subtitle: "Families up · Gen Z flat",
    copy: "Families and premium buyers now outvalue broad Gen Z reach.",
    meaning: "Value is moving to intent, not just reach.",
    cta: "Analyze in Audience Spectrum →", color: "border-l-white/[0.15]", category: "Audience",
    openSpectrum: true,
    relatedAudienceIds: ["aud_003", "aud_002"],
    drillDown: {
      title: "Audience Value Shifting to Families + Premium",
      subtext: "Audience signal · Structural shift · Active",
      headline: "Structural, not a blip — rebalance media mix toward family + premium now",
      supportingContext: "Gen Z: 74 attention / 19 owned. Families: 61 / 41 — 1.5× more valuable. Premium Buyers: 46 owned action vs Gen Z's 19 — 2.4× gap. Families converting higher than broad audiences.",
      analysis: "This is a structural shift, not a blip. Casual Gen Z audiences generate high attention but low owned action. Families and premium buyers create more valuable intent and stronger owned follow-through. Real opportunity, not vanity.",
      projectedScale: "Shifting 20% of Gen Z media spend to family + premium could increase owned action by 30–40% with minimal reach loss.",
      projectedInaction: "Continuing to optimize for Gen Z reach will produce diminishing returns on owned value. The efficiency gap widens each week.",
      confidence: { score: 76, reason: "Clear structural pattern, 7-day trend stable" },
      metrics: [
        { label: "Families", value: "+14%", context: "Top consideration lift in the set" },
        { label: "Premium buyers", value: "+11%", context: "Most efficient downstream value per impression" },
        { label: "Casual Gen Z", value: "Flat", context: "High engagement, action isn't following" },
        { label: "Core fans", value: "Stable", context: "Healthy owned retention, lower growth" },
      ],
      evidence: "Casual still wins attention, but families and premium drive stronger intent and owned follow-through.",
      highlight: "Premium Buyers: 46 owned action vs Gen Z's 19 — 2.4× gap.",
      table: { headers: ["Audience", "Attention", "Intent", "Owned Action"], rows: [["Families", "61", "59", "41"], ["Premium Buyers", "54", "63", "46"], ["Casual Gen Z", "74", "38", "19"], ["Core Fans", "58", "56", "44"]], deltaCol: 3 },
      recommendedActions: ["Rebalance media mix → family + premium", "Build family retargeting audience", "Brief media buyer on efficiency data"],
      watchConditions: ["Gen Z owned action drops below 15", "Family attention drops below 55"],
      sources: ["Audience Scoring", "Media Mix Model", "CRM Engagement Data", "Ticketmaster Purchase History"],
      actions: ["Create audience brief", "Compare segments", "Build campaign recommendation", "Export"],
      chartData: makeTrend(50, 0.08, 0.09), chartLabels: { primary: "Family Intent", secondary: "Premium Intent" },
    },
  },
  {
    id: "8", label: "Priority", mainValue: "", valueColor: "",
    subtitle: "Turn reach into owned capture", pill: "3 actions ready",
    copy: "Shift weight to premium. Launch a family variant. Fix the short-form CTA gap.",
    meaning: "Signal quality supports all three.",
    cta: "View priority actions", color: "border-l-white/[0.15]", category: "Action",
    relatedAudienceIds: ["aud_002", "aud_003", "aud_010", "aud_001"],
    drillDown: {
      title: "Priority Actions",
      subtext: "Synthesized recommendation · 3 actions · Ready to execute",
      headline: "All three ready to execute today — premium is the revenue engine, families are the growth engine, CTAs are the conversion engine",
      supportingContext: "These three are connected. Premium is the revenue engine, families are the growth engine, CTAs are the conversion engine. All three ready to execute today.",
      analysis: "The strongest business path is the combination of premium performance, family audience growth, and the owned capture gap. Each priority reinforces the others — premium converts attention, families expand addressable market, CTAs close the leak.",
      projectedScale: "Executing all three this week could generate +$34K incremental revenue and 600+ new owned contacts.",
      projectedInaction: "Without action, the attention window closes in 5–7 days. Family lift decays. Premium momentum flattens.",
      confidence: { score: 88, reason: "Multiple converging signals, high data confidence" },
      metrics: [
        { label: "Premium", value: "High", context: "Highest revenue opportunity right now" },
        { label: "Families", value: "High", context: "Fastest-rising high-intent segment" },
        { label: "CTAs", value: "Med-High", context: "Main friction point" },
        { label: "Readiness", value: "High", context: "Signal quality supports all three" },
      ],
      evidence: "The strongest business path is the combination of premium performance, family growth, and the conversion gap.",
      highlight: "All three ready to execute today.",
      table: { headers: ["Action", "Impact", "Evidence", "Status"], rows: [["Shift budget → premium", "High", "Premium Seating Push", "Ready"], ["Launch family FL variant", "High", "Family Weekend Push", "Ready"], ["Test social CTA layer", "Med-High", "Conversion Gap", "Needs test"], ["Sponsor lifestyle memo", "Medium", "Luxury Narrative", "Ready"]], deltaCol: 1 },
      recommendedActions: ["Shift 30% of hype budget → premium", "Launch family campaign in Dade + Broward", "Fix CTAs on top 10 social posts"],
      watchConditions: ["Premium CPA exceeds $1,150", "Family consideration drops below +8%", "CTA gap widens >8pts"],
      sources: ["All Pipelines", "Campaign Performance Data", "Audience Scoring Models", "Funnel Analytics"],
      actions: ["Create premium brief", "Create family task", "Create CTA experiment", "Export to leadership", "Assign owners"],
      chartData: makeTrend(60, 0.12, 0.07), chartLabels: { primary: "Signal Strength", secondary: "Readiness" },
    },
  },
]

/* ── Helpers ── */
function deltaColor(val: string): string {
  if (val.startsWith("+")) return "text-white/90"
  if (val.startsWith("-")) return "text-white/50"
  return "text-foreground/60"
}

function DrillDownModal({ card, onClose, onOpenSpectrum, onNav, onPersonClick }: { card: InsightCard; onClose: () => void; onOpenSpectrum?: () => void; onNav?: (dir: -1 | 1) => void; onPersonClick?: (personId: string) => void }) {
  const dd = card.drillDown
  const [rightTab, setRightTab] = useState<"detail" | "people" | "minerva">("detail")
  const [expandedPerson, setExpandedPerson] = useState<typeof persons[0] | null>(null)
  const [selectedPeople, setSelectedPeople] = useState<Set<string>>(new Set())
  const [actionsOpen, setActionsOpen] = useState(false)

  const relatedPeople = card.relatedAudienceIds.length > 0
    ? persons.filter(p => p.audiences.some(a => card.relatedAudienceIds.includes(a)))
    : [...persons].sort((a, b) => b.scores.ticketBuy - a.scores.ticketBuy).slice(0, 5)

  useEffect(() => { setRightTab("detail"); setActionsOpen(false) }, [card.id])
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); onNav?.(-1) }
      if (e.key === "ArrowRight") { e.preventDefault(); onNav?.(1) }
      if (e.key === "Escape") { e.preventDefault(); onClose() }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onNav, onClose])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
      className="mn-cc-modal fixed inset-0 z-50 bg-black/60 backdrop-blur-md" onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mn-cc-modal-content absolute inset-4 top-12 rounded-2xl overflow-hidden shadow-2xl border border-white/[0.06]"
        style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)" }}
        onClick={(e) => e.stopPropagation()}>

        <button onClick={onClose} className="absolute top-4 right-4 z-10 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all">
          <X className="h-4 w-4" />
        </button>

        <div className="h-full grid grid-cols-2">

          {/* ═══ LEFT: Intelligence Surface ═══ */}
          <div className="border-r border-white/[0.06] p-10 flex flex-col gap-6 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>
            {/* Title + subtext */}
            <div>
              <h2 className="text-[22px] font-semibold tracking-tight leading-tight">{dd.title}</h2>
              {dd.subtext && <p className="text-[12px] text-muted-foreground mt-1">{dd.subtext}</p>}
            </div>

            {/* Hero value */}
            {card.mainValue ? (
              <div>
                <div className="flex items-end gap-2">
                  <SevenSegmentDisplay value={card.mainValue.replace(/[^0-9.]/g, "")} suffix={card.mainValue.replace(/[0-9.,+\-\s]/g, "") || undefined} height={56} onColor="#f5f5f5" offColor="rgba(245,245,245,0.05)" />
                  {(card.mainValue.startsWith("+") || card.mainValue.startsWith("-")) && (
                    <span className="text-[28px] text-white/25 leading-none mb-1">{card.mainValue.startsWith("+") ? "↑" : "↓"}</span>
                  )}
                </div>
                <p className="text-[10px] uppercase tracking-widest text-white/20 mt-2">{card.label}</p>
              </div>
            ) : card.subtitle ? (
              <div><span className="text-[32px] font-bold tracking-tight leading-tight">{card.subtitle}</span></div>
            ) : null}

            {/* ══ HEADLINE — the decisive statement ══ */}
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.08] px-5 py-4">
              <p className="text-[14px] text-white/90 font-medium leading-relaxed">{dd.headline ?? dd.meaning ?? dd.highlight}</p>
              {dd.supportingContext && <p className="text-[12px] text-white/50 mt-2 leading-relaxed">{dd.supportingContext}</p>}
              {!dd.supportingContext && dd.summary && <p className="text-[12px] text-white/50 mt-2 leading-relaxed">{dd.summary}</p>}
            </div>

            {/* ══ EXPANDABLE ACTIONS ══ */}
            <div className="mt-auto pt-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setActionsOpen(!actionsOpen)}
                  className={`text-[11px] px-4 py-2 rounded-full border transition-all ${actionsOpen ? 'border-white/[0.15] bg-white/[0.06] text-white/70' : 'border-white/[0.08] bg-white/[0.02] text-white/40 hover:text-white/60 hover:bg-white/[0.04]'}`}>
                  Actions {actionsOpen ? '✕' : '→'}
                </button>
                {actionsOpen && dd.actions && dd.actions.slice(0, 3).map((a, i) => (
                  <motion.button key={a} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05, duration: 0.15 }}
                    onClick={() => toast.success(a, { description: 'Queued' })}
                    className="text-[10px] px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white/70 hover:bg-white/[0.05] transition-all whitespace-nowrap">
                    {a}
                  </motion.button>
                ))}
              </div>
              {card.openSpectrum && onOpenSpectrum && (
                <button onClick={() => { onClose(); onOpenSpectrum() }}
                  className="mt-3 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-[11px] text-white/40 hover:text-white/60 hover:bg-white/[0.04] transition-colors text-left w-full">
                  Explore audience in Spectrum →
                </button>
              )}
            </div>
          </div>

          {/* ═══ RIGHT: Detail / People / Minerva ═══ */}
          <div className="overflow-hidden flex flex-col">
            <div className="shrink-0 flex items-center gap-1 px-10 pt-6 pb-0">
              {(["detail", "people", "minerva"] as const).map((t) => (
                <button key={t} onClick={() => { setRightTab(t); setExpandedPerson(null) }}
                  className={`text-[12px] px-3 py-1.5 rounded-lg transition-all ${
                    rightTab === t ? "bg-white/10 text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}>
                  {t === "people" ? `People (${relatedPeople.length})` : t === "minerva" ? "Minerva AI" : "Detail"}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-10 pr-12" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>

            {rightTab === "detail" ? (
            <div className="space-y-8">

              {/* ══ PROJECTED OUTCOME ══ */}
              {(dd.projectedScale || dd.projectedInaction) && (
              <div className="space-y-2.5">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Projected Outcome</h3>
                {dd.projectedScale && <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <p className="text-[9px] uppercase tracking-wider text-white/25 mb-1">If you act now</p>
                  <p className="text-[12px] text-white/70 leading-relaxed">{dd.projectedScale}</p>
                </div>}
                {dd.projectedInaction && <div className="rounded-lg border border-white/[0.04] px-4 py-3">
                  <p className="text-[9px] uppercase tracking-wider text-white/20 mb-1">If you do nothing</p>
                  <p className="text-[12px] text-white/40 leading-relaxed">{dd.projectedInaction}</p>
                </div>}
              </div>
              )}

              {/* ══ CONFIDENCE ══ */}
              {dd.confidence && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 rounded-full bg-white/[0.04]">
                    <div className="h-full rounded-full bg-white/25" style={{ width: `${dd.confidence.score}%` }} />
                  </div>
                  <span className="text-[11px] tabular-nums text-white/50">{dd.confidence.score}%</span>
                </div>
                <span className="text-[10px] text-white/25">{dd.confidence.reason}</span>
              </div>
              )}

              {/* ══ RECOMMENDED + WATCH ══ */}
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-white/30 mb-2">{dd.recommendedActions ? 'Recommended' : 'Immediate'}</p>
                  <div className="space-y-1">
                    {(dd.recommendedActions ?? dd.immediateActions ?? []).map((a, i) => (
                      <button key={i} onClick={() => toast.success(a, { description: "Queued" })}
                        className="flex items-start gap-2 w-full text-left hover:bg-white/[0.04] rounded-lg px-2 py-1.5 -mx-2 transition-colors group cursor-pointer">
                        <span className="text-[10px] text-white/20 mt-0.5 shrink-0">{i + 1}.</span>
                        <span className="text-[12px] text-white/70 leading-snug group-hover:text-white/90 transition-colors">{a}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {(dd.watchConditions ?? dd.followUpActions) && <div>
                  <p className="text-[9px] uppercase tracking-wider text-white/20 mb-2">{dd.watchConditions ? 'Watch' : 'Follow-up'}</p>
                  <div className="space-y-1">
                    {(dd.watchConditions ?? dd.followUpActions ?? []).map((w, i) => (
                      <div key={i} className="flex items-start gap-2 px-2 py-1">
                        <span className="text-[10px] text-white/15 mt-0.5">⚠</span>
                        <span className="text-[11px] text-white/30 leading-snug">{w}</span>
                      </div>
                    ))}
                  </div>
                </div>}
              </div>

              {/* Trend Chart */}
              {dd.chartData && (
                <div>
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">7-Day Trend</h3>
                  <div className="rounded-lg border border-border/20 overflow-hidden p-3" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <VisxAreaChart data={dd.chartData} xDataKey="date" aspectRatio="3 / 1" margin={{ top: 12, right: 12, bottom: 28, left: 12 }}>
                      <VisxGrid horizontal numTicksRows={4} strokeDasharray="3,3" strokeOpacity={0.3} />
                      <VisxArea dataKey="primary" fill="#f5f5f5" fillOpacity={0.25} stroke="#f5f5f5" strokeWidth={2} fadeEdges />
                      {dd.chartData[0]?.secondary !== undefined && (
                        <VisxArea dataKey="secondary" fill="#f5f5f5" fillOpacity={0.08} stroke="#f5f5f580" strokeWidth={1.5} fadeEdges />
                      )}
                      <VisxTooltip rows={(point) => {
                        const rows = [{ color: "#f5f5f5", label: dd.chartLabels?.primary ?? "Primary", value: point.primary as number }]
                        if (point.secondary !== undefined) rows.push({ color: "#f5f5f580", label: dd.chartLabels?.secondary ?? "Secondary", value: point.secondary as number })
                        return rows
                      }} />
                    </VisxAreaChart>
                  </div>
                </div>
              )}

              {/* Key Metrics */}
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Key Metrics</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {dd.metrics.map((m, i) => (
                    <div key={i} className="rounded-lg border border-border/20 px-3.5 py-3">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{m.label}</p>
                      <span className={`text-[20px] font-bold tracking-tight ${m.value.startsWith("+") || m.value.startsWith("-") ? "text-white/90" : ""}`}>{m.value}</span>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{m.context}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence + Highlight */}
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Evidence</h3>
                <p className="text-[13px] text-foreground/70 leading-[1.7] mb-3">{dd.evidence}</p>
                <div className="rounded-lg bg-primary/5 border border-primary/10 px-4 py-3">
                  <p className="text-[13px] text-foreground/90 font-medium leading-snug">{dd.highlight}</p>
                </div>
              </div>

              {/* Analysis */}
              {dd.analysis && <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Analysis</h3>
                <p className="text-[13px] text-foreground/85 leading-[1.8]">{dd.analysis}</p>
              </div>}

              {/* Data Table */}
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Data</h3>
                <div className="rounded-lg border border-border/20 overflow-hidden">
                  <table className="w-full text-[12px]">
                    <thead><tr className="bg-muted/10">
                      {dd.table.headers.map((h, i) => (
                        <th key={i} className="px-3 py-2 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {dd.table.rows.map((row, ri) => (
                        <tr key={ri} className={`border-t border-border/10 ${ri === 0 ? "bg-muted/5" : ""}`}>
                          {row.map((cell, ci) => (
                            <td key={ci} className={`px-3 py-2 ${ci === 0 ? "text-foreground/80 font-medium" : ci === dd.table.deltaCol ? `font-semibold ${deltaColor(cell)}` : "text-muted-foreground"}`}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sources */}
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Sources</h3>
                <div className="flex flex-wrap gap-2">
                  {dd.sources.map((s, i) => (
                    <span key={i} className="text-[10px] px-2.5 py-1 rounded-md border border-border/20 bg-muted/5 text-muted-foreground inline-flex items-center gap-1.5"><PlatformIcon name={s} size={10} />{s}</span>
                  ))}
                </div>
              </div>
            </div>
            ) : rightTab === "people" ? (
            <div>
              {expandedPerson ? (
                <div style={{ animation: 'fadeIn 200ms ease' }}>
                  <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: translateX(0); } }`}</style>
                  <button onClick={() => setExpandedPerson(null)} className="text-[11px] text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1">&larr; Back to list</button>
                  <div className="flex items-center gap-3 mb-5">
                    <UserAvatar name={`${expandedPerson.firstName} ${expandedPerson.lastName}`} size={40} />
                    <div>
                      <p className="text-[16px] font-medium">{expandedPerson.firstName} {expandedPerson.lastName}</p>
                      <p className="text-[12px] text-muted-foreground">{expandedPerson.jobTitle} at {expandedPerson.company} · {expandedPerson.city}, {expandedPerson.state}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3 mb-5">
                    {[{l:'Ticket Buy',v:expandedPerson.scores.ticketBuy},{l:'Premium',v:expandedPerson.scores.premium},{l:'Renewal',v:expandedPerson.scores.renewal},{l:'Churn',v:expandedPerson.scores.churn}].map(s=>(
                      <div key={s.l} className="rounded-lg bg-muted/10 p-3 text-center">
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.l}</p>
                        <p className="text-[20px] font-medium tabular-nums mt-1">{Math.round(s.v*100)}</p>
                        <div className="w-full h-1 rounded-full bg-white/[0.04] mt-1.5"><div className="h-full rounded-full bg-white/25" style={{width:`${s.v*100}%`}} /></div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-2">Contact</p>
                        {expandedPerson.contacts.map((c,i)=>(
                          <div key={i} className="flex items-center justify-between text-[11px] py-1">
                            <span className="text-muted-foreground">{c.type}</span>
                            <span className="text-foreground/80">{c.value}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-2">Affinities</p>
                        <div className="flex flex-wrap gap-1.5">
                          {expandedPerson.affinities.map((a,i)=>(
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.06] text-white/45">{a.name} {Math.round(a.score*100)}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-2">Household</p>
                        <div className="space-y-1 text-[11px]">
                          <div className="flex justify-between"><span className="text-muted-foreground">Income</span><span className="text-foreground/70">{expandedPerson.household.incomeBand}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Net Worth</span><span className="text-foreground/70">{expandedPerson.household.netWorthBand}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Distance</span><span className="text-foreground/70">{expandedPerson.household.distanceToStadium.toFixed(1)} mi</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Household</span><span className="text-foreground/70">{expandedPerson.household.householdSize} people{expandedPerson.household.hasChildren ? ', has children' : ''}</span></div>
                        </div>
                      </div>
                      {expandedPerson.tickets.length > 0 && (
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-2">Ticket History</p>
                          {expandedPerson.tickets.map((t,i)=>(
                            <div key={i} className="flex items-center justify-between text-[11px] py-1 border-b border-border/5 last:border-0">
                              <span className="text-muted-foreground">{t.date.split('T')[0]}</span>
                              <span className="text-foreground/60">{t.product}</span>
                              <span className="text-foreground/70 font-medium">${t.revenue.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {['Contact with AI', 'Add to segment', 'Flag for review', 'Export profile'].map(a=>(
                      <button key={a} onClick={() => toast.success(`${a}: ${expandedPerson.firstName} ${expandedPerson.lastName}`)}
                        className="text-[10px] px-3 py-1.5 rounded-full border border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all">
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
              <div className="rounded-lg border border-border/20 overflow-hidden">
                <table className="w-full text-[12px]">
                  <thead><tr className="bg-muted/10">
                    <th className="px-2 py-2.5 w-8"><input type="checkbox" className="rounded border-white/20 bg-transparent" onChange={(e) => { if (e.target.checked) setSelectedPeople(new Set(relatedPeople.map(p=>p.id))); else setSelectedPeople(new Set()) }} /></th>
                    <th className="px-3 py-2.5 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Person</th>
                    <th className="px-3 py-2.5 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Propensity</th>
                    <th className="px-3 py-2.5 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Income</th>
                  </tr></thead>
                  <tbody>
                    {relatedPeople.map((p) => (
                      <tr key={p.id} onClick={() => setExpandedPerson(p)}
                        className="border-t border-border/10 hover:bg-muted/10 transition-all duration-150 cursor-pointer">
                        <td className="px-2 py-2.5" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={selectedPeople.has(p.id)} className="rounded border-white/20 bg-transparent"
                            onChange={() => { const s = new Set(selectedPeople); s.has(p.id) ? s.delete(p.id) : s.add(p.id); setSelectedPeople(s) }} />
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <UserAvatar name={`${p.firstName} ${p.lastName}`} size={28} />
                            <div>
                              <p className="text-[12px] font-medium">{p.firstName} {p.lastName}</p>
                              <p className="text-[10px] text-muted-foreground">{p.city}, {p.state}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-14 h-1.5 rounded-full bg-white/[0.04]"><div className="h-full rounded-full bg-white/30" style={{ width: `${p.scores.ticketBuy*100}%` }} /></div>
                            <span className="text-[10px] tabular-nums text-muted-foreground">{Math.round(p.scores.ticketBuy*100)}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-[11px] text-muted-foreground">{p.household.incomeBand}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {relatedPeople.length > 0 ? (
                <p className="text-[10px] text-muted-foreground mt-3">{relatedPeople.length} suggested profiles for this context</p>
              ) : (
                <div className="flex items-center justify-center py-16">
                  <p className="text-[13px] text-muted-foreground/40">No profiles found</p>
                </div>
              )}
              {selectedPeople.size > 0 && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5">
                  <span className="text-[11px] text-white/50 mr-2">{selectedPeople.size} selected</span>
                  {['Add to segment', 'Send outreach', 'Export CSV', 'Ask Minerva'].map(a => (
                    <button key={a} onClick={() => { toast.success(`${a}: ${selectedPeople.size} people`); setSelectedPeople(new Set()) }}
                      className="text-[10px] px-2.5 py-1 rounded-full border border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white/70 hover:bg-white/[0.05] transition-all">
                      {a}
                    </button>
                  ))}
                </div>
              )}
              </div>
              )}
            </div>
            ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-[14px] text-muted-foreground/30 mb-2">Minerva AI</p>
                <p className="text-[11px] text-muted-foreground/20">Ask Minerva anything about this data</p>
              </div>
            </div>
            )}

            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  )
}

export { insights, DrillDownModal }
