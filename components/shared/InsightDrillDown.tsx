"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { persons } from "@/lib/data/persons"
import { SevenSegmentDisplay } from "@/components/ui/seven-segment"
import { UserAvatar } from "@/components/shared/UserAvatar"
import { AreaChart as VisxAreaChart, Area as VisxArea, Grid as VisxGrid, ChartTooltip as VisxTooltip } from "@/components/ui/area-chart"

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
    summary: string
    meaning: string
    metrics: { label: string; value: string; context: string }[]
    evidence: string
    highlight: string
    analysis: string
    immediateActions: string[]
    followUpActions: string[]
    sources: string[]
    table: { headers: string[]; rows: string[][]; deltaCol?: number }
    actions: string[]
    chartData?: { date: Date; primary: number; secondary?: number }[]
    chartLabels?: { primary: string; secondary?: string }
  }
}

const categories = ["All", "Signal", "Audience", "Campaign", "Action"]

// Generate 7-day mock trend data
function makeTrend(base: number, delta: number, noise = 0.08): { date: Date; primary: number; secondary?: number }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const t = i / 6;
    const jitter = 1 + (Math.sin(i * 2.1) * noise);
    return {
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
      primary: Math.round(base * (1 + t * delta) * jitter),
      secondary: Math.round(base * 0.6 * (1 + t * delta * 0.5) * jitter),
    };
  });
}

const insights: InsightCard[] = [
  {
    id: "1", label: "Attention", mainValue: "+18%", valueColor: "text-white/90",
    copy: "Player-led content and offseason conversation drove a broad lift in brand visibility across Instagram, TikTok, and owned web.",
    meaning: "Brand awareness is up meaningfully, but this is mostly a top-of-funnel signal.",
    cta: "See channel breakdown", color: "border-l-white/[0.15]", category: "Signal",
    relatedAudienceIds: ["aud_001", "aud_010", "aud_007"],
    drillDown: {
      title: "Brand Attention Increased",
      summary: "Attention is up 18% vs yesterday, driven primarily by player-led content, premium experience messaging, and a rise in schedule-related search behavior.",
      meaning: "This is a top-of-funnel signal. Not all of this lift is converting into owned value yet — but the reach foundation is strong.",
      metrics: [
        { label: "Attention delta", value: "+18%", context: "Score moved from 76 to 90 in 24 hours." },
        { label: "Top channels", value: "IG · TikTok · Web", context: "These three generated majority of incremental reach." },
        { label: "Top audience", value: "Younger Fans", context: "Younger fans drove lift; families drove more valuable intent." },
        { label: "Search lift", value: "+12%", context: "Schedule, ticket, and premium queries all rose." },
      ],
      evidence: "The largest movement came from player-led content and premium messaging published between Mar 30 and Mar 31.",
      highlight: "Social reach grew 3x faster than owned capture — the gap is the opportunity.",
      table: { headers: ["Channel", "Yesterday", "Today", "Delta"], rows: [["Instagram", "18.2k", "24.1k", "+32%"], ["TikTok", "12.6k", "17.4k", "+38%"], ["Owned Web", "8.9k", "10.2k", "+15%"], ["Search", "6.4k", "7.2k", "+12%"]], deltaCol: 3 },
      analysis: "The attention spike is real but shallow. Player-led content drove broad reach across younger demographics, but the owned capture rate didn't keep pace.",
      immediateActions: ["Review top 5 contributing posts for CTA opportunities", "Add ticket links to next player content drop", "Brief social team on owned conversion gap"],
      followUpActions: ["A/B test CTA variants on next Player Spotlight", "Build retargeting audience from social engagers", "Schedule weekly attention-to-conversion review"],
      sources: ["Instagram Insights API", "TikTok Analytics", "Google Search Console", "Minerva Engagement Pipeline"],
      actions: ["View top contributing posts", "Compare by audience", "Export attention summary", "Ask Minerva why it rose"],
      chartData: makeTrend(76, 0.18), chartLabels: { primary: "Attention Score", secondary: "Owned Capture" },
    },
  },
  {
    id: "2", label: "Premium Experience", mainValue: "+11%", valueColor: "text-white/90",
    copy: "Premium game-day messaging is outperforming general hype and creating the strongest downstream ticket-intent lift.",
    meaning: "This is the strongest near-term revenue opportunity in the dataset.",
    cta: "Analyze in Audience Spectrum →", color: "border-l-white/[0.15]", category: "Signal",
    openSpectrum: true,
    relatedAudienceIds: ["aud_002", "aud_006"],
    drillDown: {
      title: "Premium Experience Is The Strongest Revenue Signal",
      summary: "Premium game-day messaging is outperforming general hype across high-intent audiences and creating the clearest path to premium ticket sales.",
      meaning: "Premium creative is 28% more efficient than generic hype on owned action. This is the most direct path to revenue right now.",
      metrics: [
        { label: "Ticket intent lift", value: "+11%", context: "Intent rose from 54 to 60 among high-value audiences." },
        { label: "Best audience", value: "Premium Buyers", context: "Club, suite, hospitality positioning wins here." },
        { label: "Vs. general hype", value: "+28%", context: "Premium creative is 28% more efficient on owned action." },
        { label: "Top campaign", value: "Premium Seating", context: "Strongest conversion-driving campaign in the mix." },
      ],
      evidence: "Premium-oriented messaging consistently outperformed generic brand hype on clickthrough, ticket intent, and owned conversion.",
      highlight: "Premium Seating Push has 3.2% owned action rate — nearly 2x the general hype average.",
      table: { headers: ["Campaign", "CTR", "Intent Lift", "Owned Action"], rows: [["Premium Seating Push", "4.8%", "+16%", "3.2%"], ["Club Access Campaign", "4.1%", "+13%", "2.9%"], ["General Game Hype", "3.0%", "+6%", "1.8%"], ["Player Spotlight CTA", "3.4%", "+7%", "2.0%"]], deltaCol: 2 },
      analysis: "Premium messaging isn't just outperforming — it's creating a fundamentally different conversion path. The 28% efficiency gap vs general hype suggests that high-intent audiences self-select when shown premium positioning.",
      immediateActions: ["Increase Premium Seating Push budget by 30%", "Share performance deck with VP of Premium Sales", "Create lookalike audience from 87 premium converters"],
      followUpActions: ["Test premium creative on Family segment", "Build premium retargeting sequence", "Prep Q2 premium campaign brief"],
      sources: ["Meta Ads Manager", "Minerva Campaign Table", "Ticketmaster Premium Sales API", "CRM Suite Holder Data"],
      actions: ["Generate premium sales brief", "Send to ticketing team", "Expand winning creative", "Compare with general hype"],
      chartData: makeTrend(54, 0.11, 0.06), chartLabels: { primary: "Ticket Intent", secondary: "Owned Action" },
    },
  },
  {
    id: "3", label: "Family Audience", mainValue: "+14%", valueColor: "text-white/90",
    copy: "Family ticket consideration rose across Miami-Dade and Broward, led by planning, convenience, and shared weekend messaging.",
    meaning: "This is the fastest-rising high-intent audience segment.",
    cta: "View regional data", color: "border-l-white/[0.15]", category: "Audience",
    relatedAudienceIds: ["aud_003"],
    drillDown: {
      title: "Family Ticket Interest Rose In South Florida",
      summary: "Family ticket consideration increased 14%, with the strongest lift in Miami-Dade and Broward, linked to planning and weekend messaging.",
      meaning: "Families are converting at a higher rate than broad audiences. This is a real campaign opportunity, not a vanity signal.",
      metrics: [
        { label: "Family consideration", value: "+14%", context: "Segment score rose from 44 to 50 in 24 hours." },
        { label: "Top counties", value: "Dade · Broward", context: "Strongest local lift concentrated here." },
        { label: "Best message", value: "Ease + planning", context: "Convenience framing beat pure excitement." },
        { label: "Top campaign", value: "Family Weekend", context: "Highest-performing family-facing campaign." },
      ],
      evidence: "Families showed the strongest increase in consideration and owned clickthrough when exposed to weekend planning and ease-of-entry messaging.",
      highlight: "Miami-Dade alone rose +19% — the strongest single-county lift in the dataset.",
      table: { headers: ["Region", "Yesterday", "Today", "Delta"], rows: [["Miami-Dade", "21", "25", "+19%"], ["Broward", "18", "21", "+17%"], ["Palm Beach", "12", "13", "+8%"], ["South FL Total", "51", "59", "+14%"]], deltaCol: 3 },
      analysis: "The family lift is concentrated and actionable. Miami-Dade and Broward account for 85% of the increase, and convenience-led messaging consistently beats excitement-led messaging in this segment.",
      immediateActions: ["Launch geo-targeted family campaign in Dade + Broward", "Create weekend planning email sequence", "Brief lifecycle team on family segment opportunity"],
      followUpActions: ["Test family messaging in Palm Beach", "Build family lookalike from high-intent converters", "Develop family gameday experience landing page"],
      sources: ["Minerva Audience Table", "Regional Sales Data", "Email Platform Analytics", "Minerva Geo Pipeline"],
      actions: ["Create family campaign brief", "Launch regional variant", "Assign to lifecycle team", "Compare vs premium"],
      chartData: makeTrend(44, 0.14, 0.07), chartLabels: { primary: "Family Consideration", secondary: "Regional Lift" },
    },
  },
  {
    id: "4", label: "Owned Conversion", mainValue: "-4%", valueColor: "text-white/90/60",
    copy: "Social engagement rose sharply, but movement into app, ticketing, and lifecycle capture still trails total reach growth.",
    meaning: "There is a clear conversion gap between attention and owned value.",
    cta: "See funnel gaps", color: "border-l-white/[0.15]", category: "Signal",
    relatedAudienceIds: ["aud_010", "aud_001"],
    drillDown: {
      title: "Owned Conversion Is Still Lagging",
      summary: "Even with strong engagement growth, owned action is down 4% in efficiency. The main drop-off is between social engagement and owned clickthrough.",
      meaning: "The biggest opportunity isn't more reach — it's stronger CTA design and clearer owned pathways from social to app.",
      metrics: [
        { label: "Efficiency delta", value: "-4%", context: "Reach climbing faster than owned conversion." },
        { label: "Biggest drop-off", value: "Social → owned", context: "Largest funnel leak happens after engagement." },
        { label: "Most affected", value: "Younger + casual", context: "High engagement, low progression to owned." },
        { label: "Worst gap", value: "TikTok", context: "Highest reach growth, weakest follow-through." },
      ],
      evidence: "Social engagement rose strongly, but app opens, ticket clicks, and email capture did not keep pace. TikTok has the widest gap.",
      highlight: "TikTok engagement is 8.6% but owned click-through is only 1.2% — a 7.4pt gap.",
      table: { headers: ["Channel", "Engagement", "Owned Click", "Gap"], rows: [["TikTok", "8.6%", "1.2%", "-7.4"], ["Instagram", "6.9%", "1.7%", "-5.2"], ["Email", "3.1%", "2.6%", "-0.5"], ["Owned Web", "4.2%", "3.4%", "-0.8"]], deltaCol: 3 },
      analysis: "TikTok drives 38% more reach than any other channel but converts at 1.2% — the lowest owned action rate in the mix. The issue isn't content quality — it's the absence of clear owned pathways.",
      immediateActions: ["Audit all TikTok posts for CTA presence and quality", "Add swipe-up links to next 5 Instagram stories", "Create dedicated landing page for social traffic"],
      followUpActions: ["Build social-to-app deep link infrastructure", "Test in-content QR codes at next home game", "Design CTA experiment framework for content team"],
      sources: ["TikTok Analytics", "Instagram Insights", "App Store Connect", "Minerva Funnel Pipeline", "Ticketmaster Click Data"],
      actions: ["Create CTA test", "Generate conversion brief", "Assign to performance team", "Create experiment"],
      chartData: makeTrend(82, -0.04, 0.05), chartLabels: { primary: "Engagement", secondary: "Owned Conversion" },
    },
  },
  {
    id: "5", label: "Sponsor Resonance", mainValue: "+9%", valueColor: "text-white/90",
    copy: "Luxury, hospitality, and Miami-lifestyle narratives are creating the strongest sponsor-adjacent value in the current mix.",
    meaning: "This is the strongest partner narrative right now.",
    cta: "View sponsor data", color: "border-l-white/[0.15]", category: "Signal",
    relatedAudienceIds: ["aud_002", "aud_007"],
    drillDown: {
      title: "Luxury And Hospitality Narratives Are Winning",
      summary: "Sponsor resonance is up 9%, driven by narratives tied to premium lifestyle, hospitality, and elevated Miami identity.",
      meaning: "Not the strongest ticketing driver, but the strongest partner story.",
      metrics: [
        { label: "Sponsor resonance", value: "+9%", context: "Narrative score moved from 66 to 72." },
        { label: "Top narrative", value: "Miami Lifestyle", context: "Strongest brand-partner alignment." },
        { label: "Best audience", value: "Lifestyle premium", context: "Cleanest response to luxury framing." },
        { label: "Top asset", value: "Lifestyle Content", context: "Highest sponsor lift among assets." },
      ],
      evidence: "Luxury and hospitality-aligned storytelling outperformed other partnership narratives on both quality-of-engagement and sponsor value.",
      highlight: "Miami Lifestyle narrative has +12% sponsor lift — 4x higher than general hype.",
      table: { headers: ["Narrative", "Engagement", "Sponsor Lift", "Sentiment"], rows: [["Miami Lifestyle", "5.4%", "+12%", "84"], ["Premium Game-Day", "4.8%", "+9%", "82"], ["Player Excitement", "7.1%", "+3%", "79"], ["General Hype", "4.0%", "+2%", "75"]], deltaCol: 2 },
      analysis: "Sponsor resonance is a leading indicator for partnership revenue. The Miami Lifestyle narrative indexes 4x higher on sponsor lift than general hype.",
      immediateActions: ["Generate sponsor memo with lifestyle performance data", "Share narrative comparison with partnerships team", "Identify top 3 sponsor-aligned content pieces"],
      followUpActions: ["Build lifestyle content calendar for Q2", "Propose co-branded content series to top sponsor", "Create sponsor value dashboard"],
      sources: ["Minerva Narrative Analysis", "Sponsor Tracking Platform", "Brand Sentiment Pipeline", "Social Listening Tools"],
      actions: ["Generate sponsor memo", "Export to partnerships", "Build partner summary", "Compare narratives"],
      chartData: makeTrend(66, 0.09, 0.06), chartLabels: { primary: "Sponsor Resonance", secondary: "Brand Lift" },
    },
  },
  {
    id: "6", label: "Top Campaign", mainValue: "", valueColor: "",
    subtitle: "Player Spotlight Series", pill: "High reach · low CTA",
    copy: "The strongest awareness driver in the dataset, but still underperforming premium and family campaigns on owned action.",
    meaning: "Best campaign for reach, not best for conversion.",
    cta: "See campaign performance", color: "border-l-white/[0.15]", category: "Campaign",
    relatedAudienceIds: ["aud_001", "aud_010", "aud_007"],
    drillDown: {
      title: "Player Spotlight Is The Strongest Awareness Driver",
      summary: "Player Spotlight produced the largest attention lift, but trails premium and family campaigns on owned conversion.",
      meaning: "The next step isn't replacing it — it's giving it a better owned-action layer.",
      metrics: [
        { label: "Attention impact", value: "34%", context: "Contributed 34% of total social attention lift." },
        { label: "Best channels", value: "TikTok · IG", context: "Strongest on short-form social." },
        { label: "Engagement", value: "Very High", context: "Comments, saves, shares all rose." },
        { label: "Owned action", value: "Med-Low", context: "CTA gap is the main weakness." },
      ],
      evidence: "Player-led content is the strongest tool for awareness, but not for conversion.",
      highlight: "Player Spotlight gets 8.9% engagement but only 1.6% owned action — Premium Seating gets 4.8% and 3.2%.",
      table: { headers: ["Asset", "Reach", "Engagement", "Owned Action"], rows: [["Player Spotlight 01", "18.4k", "8.9%", "1.6%"], ["Player Spotlight 02", "16.8k", "8.1%", "1.5%"], ["Premium Seating Push", "11.2k", "4.8%", "3.2%"], ["Family Weekend Push", "9.6k", "5.2%", "2.8%"]], deltaCol: 3 },
      analysis: "Player Spotlight is doing exactly what it should — building massive awareness. Adding CTAs to existing high-reach content is a much better strategy than replacing it.",
      immediateActions: ["Create CTA overlay variants for top 3 Spotlight posts", "Add end-card with ticket link to next video", "Route performance data to content team lead"],
      followUpActions: ["Develop Player Spotlight + Premium hybrid format", "Test mid-roll CTA insertion on TikTok", "Build attribution model for Spotlight → ticket path"],
      sources: ["TikTok Creator Studio", "Instagram Insights", "Minerva Campaign Table", "Content Management System"],
      actions: ["Generate CTA-enhanced variants", "Route to content team", "Compare against premium", "Ask Minerva how to improve"],
      chartData: makeTrend(42, 0.06, 0.1), chartLabels: { primary: "Reach", secondary: "Owned Action" },
    },
  },
  {
    id: "7", label: "Audience Shift", mainValue: "", valueColor: "",
    subtitle: "Families up · Gen Z flat",
    copy: "Higher-intent local audiences are becoming more valuable than broad casual reach this week.",
    meaning: "Value is shifting toward segments with stronger intent, not just larger reach.",
    cta: "Analyze in Audience Spectrum →", color: "border-l-white/[0.15]", category: "Audience",
    openSpectrum: true,
    relatedAudienceIds: ["aud_003", "aud_002"],
    drillDown: {
      title: "Audience Value Is Shifting Toward Families And Premium",
      summary: "Families and premium buyers are becoming more valuable than broad casual Gen Z reach.",
      meaning: "Casual audiences win on raw attention, but families and premium buyers create more valuable intent.",
      metrics: [
        { label: "Families", value: "+14%", context: "Strongest consideration lift in audience set." },
        { label: "Premium buyers", value: "+11%", context: "Most efficient downstream value per impression." },
        { label: "Casual Gen Z", value: "Flat", context: "High engagement, limited improvement in action." },
        { label: "Core fans", value: "Stable", context: "Healthy owned retention, lower growth." },
      ],
      evidence: "Casual audiences still win on raw attention, but families and premium buyers create more valuable intent and stronger owned follow-through.",
      highlight: "Premium Buyers have 46 owned action score vs Gen Z's 19 — a 2.4x gap in downstream value.",
      table: { headers: ["Audience", "Attention", "Intent", "Owned Action"], rows: [["Families", "61", "59", "41"], ["Premium Buyers", "54", "63", "46"], ["Casual Gen Z", "74", "38", "19"], ["Core Fans", "58", "56", "44"]], deltaCol: 3 },
      analysis: "This is a structural shift, not a blip. Casual Gen Z audiences generate 74 attention points but only 19 owned action. Families generate 61 attention and 41 owned action — a 1.5x gap.",
      immediateActions: ["Rebalance next week's media mix toward family + premium", "Create family-specific retargeting audience", "Brief media buyer on audience efficiency data"],
      followUpActions: ["Build audience shift dashboard for weekly review", "Develop Gen Z → owned conversion experiment", "Create audience value scoring framework"],
      sources: ["Minerva Audience Scoring", "Media Mix Model", "CRM Engagement Data", "Ticketmaster Purchase History"],
      actions: ["Create audience brief", "Compare segments", "Build campaign recommendation", "Export"],
      chartData: makeTrend(50, 0.08, 0.09), chartLabels: { primary: "Family Intent", secondary: "Premium Intent" },
    },
  },
  {
    id: "8", label: "Priority", mainValue: "", valueColor: "",
    subtitle: "Turn reach into owned capture", pill: "3 actions ready",
    copy: "Shift more weight toward premium experience, launch a family variant, and fix the short-form CTA gap.",
    meaning: "This is the synthesized action card.",
    cta: "View priority actions", color: "border-l-white/[0.15]", category: "Action",
    relatedAudienceIds: ["aud_002", "aud_003", "aud_010", "aud_001"],
    drillDown: {
      title: "Today's Priority Actions",
      summary: "Three moves stand out: push premium harder, activate a family variant, and fix the owned CTA gap.",
      meaning: "The strongest path isn't one metric — it's the combination of premium performance, family growth, and the conversion gap that needs solving.",
      metrics: [
        { label: "Premium", value: "High", context: "Highest revenue opportunity right now." },
        { label: "Families", value: "High", context: "Fastest-rising high-intent segment." },
        { label: "CTAs", value: "Med-High", context: "Biggest friction point in the funnel." },
        { label: "Readiness", value: "High", context: "All three actions are justified by signal quality." },
      ],
      evidence: "The strongest business path is the combination of premium experience performance, family audience growth, and the owned capture gap.",
      highlight: "All three priority actions are ready to execute today based on current signal quality.",
      table: { headers: ["Action", "Impact", "Evidence", "Status"], rows: [["Shift budget to premium", "High", "Premium Seating Push", "Ready"], ["Launch family FL variant", "High", "Family Weekend Push", "Ready"], ["Test social CTA layer", "Med-High", "Conversion Gap", "Needs test"], ["Sponsor lifestyle memo", "Medium", "Luxury Narrative", "Ready"]], deltaCol: 1 },
      analysis: "These three priorities aren't independent — they're connected. Premium experience is the revenue engine, families are the growth engine, and owned CTAs are the conversion engine.",
      immediateActions: ["Shift 30% of general hype budget to premium creative", "Launch family weekend campaign in Dade + Broward", "Audit and fix CTAs on top 10 social posts"],
      followUpActions: ["Build weekly priority action review cadence", "Create cross-channel attribution dashboard", "Prepare Q2 strategic brief with these three pillars"],
      sources: ["All Minerva Pipelines", "Campaign Performance Data", "Audience Scoring Models", "Funnel Analytics"],
      actions: ["Create premium brief", "Create family task", "Create CTA experiment", "Export to leadership", "Assign owners"],
      chartData: makeTrend(60, 0.12, 0.07), chartLabels: { primary: "Signal Strength", secondary: "Readiness" },
    },
  },
]

/* ── Helpers ── */
function deltaColor(val: string): string {
  if (val.startsWith("+")) return "text-white/90"
  if (val.startsWith("-")) return "text-white/90/60"
  return "text-foreground/60"
}

function DrillDownModal({ card, onClose, onOpenSpectrum, onNav, onPersonClick }: { card: InsightCard; onClose: () => void; onOpenSpectrum?: () => void; onNav?: (dir: -1 | 1) => void; onPersonClick?: (personId: string) => void }) {
  const dd = card.drillDown
  const [rightTab, setRightTab] = useState<"detail" | "people" | "minerva">("detail")
  const [expandedPerson, setExpandedPerson] = useState<typeof persons[0] | null>(null)
  const [selectedPeople, setSelectedPeople] = useState<Set<string>>(new Set())

  // Get related people based on audience IDs
  const relatedPeople = card.relatedAudienceIds.length > 0
    ? persons.filter(p => p.audiences.some(a => card.relatedAudienceIds.includes(a)))
    : [...persons].sort((a, b) => b.scores.ticketBuy - a.scores.ticketBuy).slice(0, 5)

  useEffect(() => {
    setRightTab("detail")
  }, [card.id])

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

        {/* Close button — floating top-right */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all">
          <X className="h-4 w-4" />
        </button>

        {/* Two-column layout — full height */}
        <div className="h-full grid grid-cols-2">

          {/* ═══ LEFT: Title + Summary + Hero + Meaning — evenly spaced vertically ═══ */}
          <div className="border-r border-white/[0.06] p-10 flex flex-col justify-between">
            {/* Title + summary */}
            <div>
              <h2 className="text-[22px] font-semibold tracking-tight leading-tight">{dd.title}</h2>
              <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed">{dd.summary}</p>
            </div>

            {/* Hero value or subtitle */}
            {card.mainValue ? (
              <div>
                <div className="flex items-end gap-2">
                  <SevenSegmentDisplay
                    value={card.mainValue.replace(/[^0-9.]/g, "")}
                    suffix={card.mainValue.replace(/[0-9.,+\-\s]/g, "") || undefined}
                    height={56}
                    onColor="#f5f5f5"
                    offColor="rgba(245,245,245,0.05)"
                  />
                  {(card.mainValue.startsWith("+") || card.mainValue.startsWith("-")) && (
                    <span className="text-[28px] text-white/25 leading-none mb-1">{card.mainValue.startsWith("+") ? "↑" : "↓"}</span>
                  )}
                </div>
                <p className="text-[10px] uppercase tracking-widest text-white/20 mt-2">{card.label}</p>
              </div>
            ) : card.subtitle ? (
              <div>
                <span className="text-[32px] font-bold tracking-tight leading-tight">{card.subtitle}</span>
              </div>
            ) : null}

            {/* What it means */}
            <div className="rounded-xl bg-muted/10 border-l-2 border-foreground/20 px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">What it means</p>
              <p className="text-[14px] text-foreground/90 leading-relaxed">{dd.meaning}</p>
            </div>

            {/* Action pills */}
            {dd.actions && dd.actions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {dd.actions.slice(0, 4).map((a, i) => (
                  <button key={i} onClick={() => toast.success(`${a}`, { description: 'Action queued for execution.' })}
                    className="text-[11px] px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/50 hover:text-white/80 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all">
                    {a}
                  </button>
                ))}
              </div>
            )}

            {/* Spectrum CTA for eligible cards */}
            {card.openSpectrum && onOpenSpectrum && (
              <button onClick={() => { onClose(); onOpenSpectrum() }}
                className="rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-[13px] font-medium text-white/90 hover:bg-white/[0.06] transition-colors text-left">
                Explore audience in Spectrum →
              </button>
            )}
          </div>

          {/* ═══ RIGHT: Detail / People tabs ═══ */}
          <div className="overflow-hidden flex flex-col">
            {/* Tab bar */}
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

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-10 pr-12" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>

            {rightTab === "detail" ? (
            <div className="space-y-8">

              {/* Trend Chart */}
              {dd.chartData && (
                <div>
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">7-Day Trend</h3>
                  <div className="rounded-lg border border-border/20 overflow-hidden p-3">
                    <VisxAreaChart data={dd.chartData} xDataKey="date" aspectRatio="3 / 1" margin={{ top: 12, right: 12, bottom: 28, left: 12 }}>
                      <VisxGrid horizontal numTicksRows={4} strokeDasharray="3,3" strokeOpacity={0.3} />
                      <VisxArea dataKey="primary" fill="#f5f5f5" fillOpacity={0.25} stroke="#f5f5f5" strokeWidth={2} fadeEdges />
                      {dd.chartData[0]?.secondary !== undefined && (
                        <VisxArea dataKey="secondary" fill="#f5f5f5" fillOpacity={0.08} stroke="#f5f5f580" strokeWidth={1.5} fadeEdges />
                      )}
                      <VisxTooltip rows={(point) => {
                        const rows = [{ color: "#f5f5f5", label: dd.chartLabels?.primary ?? "Primary", value: point.primary as number }];
                        if (point.secondary !== undefined) rows.push({ color: "#f5f5f580", label: dd.chartLabels?.secondary ?? "Secondary", value: point.secondary as number });
                        return rows;
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
                      <p className="text-[10.5px] text-muted-foreground mt-0.5 leading-snug">{m.context}</p>
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

              {/* Data Table */}
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Data</h3>
                <div className="rounded-lg border border-border/20 overflow-hidden">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="bg-muted/10">
                        {dd.table.headers.map((h, i) => (
                          <th key={i} className="px-3 py-2 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dd.table.rows.map((row, ri) => (
                        <tr key={ri} className={`border-t border-border/10 ${ri === 0 ? "bg-muted/5" : ""}`}>
                          {row.map((cell, ci) => (
                            <td key={ci} className={`px-3 py-2 ${
                              ci === 0 ? "text-foreground/80 font-medium" :
                              ci === dd.table.deltaCol ? `font-semibold ${deltaColor(cell)}` :
                              "text-muted-foreground"
                            }`}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Analysis */}
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Analysis</h3>
                <p className="text-[13px] text-foreground/85 leading-[1.8]">{dd.analysis}</p>
              </div>

              {/* Suggested Actions */}
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Suggested Actions</h3>
                <div className="mb-4">
                  <p className="text-[11px] font-semibold text-foreground/70 mb-2">Immediate</p>
                  <div className="space-y-1.5">
                    {dd.immediateActions.map((a, i) => (
                      <button key={i} onClick={() => toast.success(`Action started: ${a}`, { description: "This action has been queued for execution.", duration: 3000 })} className="mn-action-btn flex items-start gap-2.5 w-full text-left hover:bg-white/[0.04] rounded-lg px-2 py-1.5 -mx-2 transition-colors group cursor-pointer">
                        <span className="text-[11px] text-muted-foreground font-medium mt-0.5 shrink-0">{i + 1}.</span>
                        <span className="text-[13px] text-foreground/80 leading-snug group-hover:text-white/90 transition-colors">{a}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-foreground/70 mb-2">Follow-up</p>
                  <div className="space-y-1.5">
                    {dd.followUpActions.map((a, i) => (
                      <button key={i} onClick={() => toast(`Scheduled: ${a}`, { description: "Added to your follow-up queue.", duration: 3000 })} className="mn-action-btn flex items-start gap-2.5 w-full text-left hover:bg-white/[0.04] rounded-lg px-2 py-1.5 -mx-2 transition-colors group cursor-pointer">
                        <span className="text-[11px] text-muted-foreground font-medium mt-0.5 shrink-0">{i + 1}.</span>
                        <span className="text-[13px] text-foreground/80 leading-snug group-hover:text-foreground transition-colors">{a}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sources */}
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Sources</h3>
                <div className="flex flex-wrap gap-2">
                  {dd.sources.map((s, i) => (
                    <span key={i} className="text-[11px] px-2.5 py-1 rounded-md border border-border/20 bg-muted/5 text-muted-foreground">{s}</span>
                  ))}
                </div>
              </div>

            </div>
            ) : rightTab === "people" ? (
            /* PEOPLE TAB */
            <div>
              {expandedPerson ? (
                /* Profile view — replaces table */
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
                /* Table view */
                <div>
              <div className="rounded-lg border border-border/20 overflow-hidden">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="bg-muted/10">
                      <th className="px-2 py-2.5 w-8"><input type="checkbox" className="rounded border-white/20 bg-transparent" onChange={(e) => { if (e.target.checked) setSelectedPeople(new Set(relatedPeople.map(p=>p.id))); else setSelectedPeople(new Set()) }} /></th>
                      <th className="px-3 py-2.5 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Person</th>
                      <th className="px-3 py-2.5 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Propensity</th>
                      <th className="px-3 py-2.5 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Income</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatedPeople.map((p) => (
                      <tr key={p.id} onClick={() => setExpandedPerson(p)}
                        className={`border-t border-border/10 hover:bg-muted/10 transition-all duration-150 cursor-pointer`}>
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
                  <p className="text-[13px] text-muted-foreground/40">No matching profiles found</p>
                </div>
              )}

              {/* Selection action bar */}
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
            /* MINERVA AI TAB */
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-[14px] text-muted-foreground/30 mb-2">Minerva AI</p>
                <p className="text-[11px] text-muted-foreground/20">Ask Minerva anything about this data.</p>
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
