"use client"

import { useState, useRef } from "react"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { X, Clock, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface InsightCard {
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
  drillDown: {
    title: string
    summary: string
    meaning: string
    metrics: { label: string; value: string; context: string }[]
    evidence: string
    highlight: string
    table: { headers: string[]; rows: string[][]; deltaCol?: number }
    actions: string[]
  }
}

const categories = ["All", "Signal", "Audience", "Campaign", "Action"]

const insights: InsightCard[] = [
  {
    id: "1", label: "Attention", mainValue: "+18%", valueColor: "text-emerald-400",
    copy: "Player-led content and offseason conversation drove a broad lift in brand visibility across Instagram, TikTok, and owned web.",
    meaning: "Brand awareness is up meaningfully, but this is mostly a top-of-funnel signal.",
    cta: "See channel breakdown", color: "border-l-emerald-400/60", category: "Signal",
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
      evidence: "The largest movement came from player-led content and premium messaging published between Mar 30 and Mar 31. Social reach increased much faster than owned capture, which is why attention is up but not all of that lift is converting into long-term value.",
      highlight: "Social reach grew 3x faster than owned capture — the gap is the opportunity.",
      table: { headers: ["Channel", "Yesterday", "Today", "Delta"], rows: [["Instagram", "18.2k", "24.1k", "+32%"], ["TikTok", "12.6k", "17.4k", "+38%"], ["Owned Web", "8.9k", "10.2k", "+15%"], ["Search", "6.4k", "7.2k", "+12%"]], deltaCol: 3 },
      actions: ["View top contributing posts", "Compare by audience", "Export attention summary", "Ask Minerva why it rose"],
    },
  },
  {
    id: "2", label: "Premium Experience", mainValue: "+11%", valueColor: "text-blue-400",
    copy: "Premium game-day messaging is outperforming general hype and creating the strongest downstream ticket-intent lift.",
    meaning: "This is the strongest near-term revenue opportunity in the dataset.",
    cta: "Compare campaigns", color: "border-l-blue-400/60", category: "Signal",
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
      evidence: "Premium-oriented messaging consistently outperformed generic brand hype on clickthrough, ticket intent, and owned conversion. It also produced stronger overlap with sponsor-adjacent premium audiences.",
      highlight: "Premium Seating Push has 3.2% owned action rate — nearly 2x the general hype average.",
      table: { headers: ["Campaign", "CTR", "Intent Lift", "Owned Action"], rows: [["Premium Seating Push", "4.8%", "+16%", "3.2%"], ["Club Access Campaign", "4.1%", "+13%", "2.9%"], ["General Game Hype", "3.0%", "+6%", "1.8%"], ["Player Spotlight CTA", "3.4%", "+7%", "2.0%"]], deltaCol: 2 },
      actions: ["Generate premium sales brief", "Send to ticketing team", "Expand winning creative", "Compare with general hype"],
    },
  },
  {
    id: "3", label: "Family Audience", mainValue: "+14%", valueColor: "text-emerald-400",
    copy: "Family ticket consideration rose across Miami-Dade and Broward, led by planning, convenience, and shared weekend messaging.",
    meaning: "This is the fastest-rising high-intent audience segment.",
    cta: "View regional data", color: "border-l-purple-400/60", category: "Audience",
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
      evidence: "Families showed the strongest increase in consideration and owned clickthrough when exposed to weekend planning and ease-of-entry messaging. This is a near-term campaign opportunity.",
      highlight: "Miami-Dade alone rose +19% — the strongest single-county lift in the dataset.",
      table: { headers: ["Region", "Yesterday", "Today", "Delta"], rows: [["Miami-Dade", "21", "25", "+19%"], ["Broward", "18", "21", "+17%"], ["Palm Beach", "12", "13", "+8%"], ["South FL Total", "51", "59", "+14%"]], deltaCol: 3 },
      actions: ["Create family campaign brief", "Launch regional variant", "Assign to lifecycle team", "Compare vs premium"],
    },
  },
  {
    id: "4", label: "Owned Conversion", mainValue: "-4%", valueColor: "text-red-400",
    copy: "Social engagement rose sharply, but movement into app, ticketing, and lifecycle capture still trails total reach growth.",
    meaning: "There is a clear conversion gap between attention and owned value.",
    cta: "See funnel gaps", color: "border-l-red-400/60", category: "Signal",
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
      evidence: "Social engagement rose strongly, but app opens, ticket clicks, and email capture did not keep pace. TikTok has the widest gap at -7.4 points between engagement and owned click rate.",
      highlight: "TikTok engagement is 8.6% but owned click-through is only 1.2% — a 7.4pt gap.",
      table: { headers: ["Channel", "Engagement", "Owned Click", "Gap"], rows: [["TikTok", "8.6%", "1.2%", "-7.4"], ["Instagram", "6.9%", "1.7%", "-5.2"], ["Email", "3.1%", "2.6%", "-0.5"], ["Owned Web", "4.2%", "3.4%", "-0.8"]], deltaCol: 3 },
      actions: ["Create CTA test", "Generate conversion brief", "Assign to performance team", "Create experiment"],
    },
  },
  {
    id: "5", label: "Sponsor Resonance", mainValue: "+9%", valueColor: "text-amber-400",
    copy: "Luxury, hospitality, and Miami-lifestyle narratives are creating the strongest sponsor-adjacent value in the current mix.",
    meaning: "This is the strongest partner narrative right now.",
    cta: "View sponsor data", color: "border-l-amber-400/60", category: "Signal",
    drillDown: {
      title: "Luxury And Hospitality Narratives Are Winning",
      summary: "Sponsor resonance is up 9%, driven by narratives tied to premium lifestyle, hospitality, and elevated Miami identity.",
      meaning: "Not the strongest ticketing driver, but the strongest partner story. This is the narrative to lead with in sponsor conversations.",
      metrics: [
        { label: "Sponsor resonance", value: "+9%", context: "Narrative score moved from 66 to 72." },
        { label: "Top narrative", value: "Miami Lifestyle", context: "Strongest brand-partner alignment." },
        { label: "Best audience", value: "Lifestyle premium", context: "Cleanest response to luxury framing." },
        { label: "Top asset", value: "Lifestyle Content", context: "Highest sponsor lift among assets." },
      ],
      evidence: "Luxury and hospitality-aligned storytelling outperformed other partnership narratives on both quality-of-engagement and sponsor value.",
      highlight: "Miami Lifestyle narrative has +12% sponsor lift — 4x higher than general hype.",
      table: { headers: ["Narrative", "Engagement", "Sponsor Lift", "Sentiment"], rows: [["Miami Lifestyle", "5.4%", "+12%", "84"], ["Premium Game-Day", "4.8%", "+9%", "82"], ["Player Excitement", "7.1%", "+3%", "79"], ["General Hype", "4.0%", "+2%", "75"]], deltaCol: 2 },
      actions: ["Generate sponsor memo", "Export to partnerships", "Build partner summary", "Compare narratives"],
    },
  },
  {
    id: "6", label: "Top Campaign", mainValue: "", valueColor: "",
    subtitle: "Player Spotlight Series", pill: "High reach · low CTA",
    copy: "The strongest awareness driver in the dataset, but still underperforming premium and family campaigns on owned action.",
    meaning: "Best campaign for reach, not best for conversion.",
    cta: "See campaign performance", color: "border-l-blue-400/60", category: "Campaign",
    drillDown: {
      title: "Player Spotlight Is The Strongest Awareness Driver",
      summary: "Player Spotlight produced the largest attention lift, but trails premium and family campaigns on owned conversion.",
      meaning: "The next step isn't replacing it — it's giving it a better owned-action layer. Add stronger CTAs to the existing high-reach format.",
      metrics: [
        { label: "Attention impact", value: "34%", context: "Contributed 34% of total social attention lift." },
        { label: "Best channels", value: "TikTok · IG", context: "Strongest on short-form social." },
        { label: "Engagement", value: "Very High", context: "Comments, saves, shares all rose." },
        { label: "Owned action", value: "Med-Low", context: "CTA gap is the main weakness." },
      ],
      evidence: "Player-led content is the strongest tool for awareness, but not for conversion. The campaign table makes the gap clear.",
      highlight: "Player Spotlight gets 8.9% engagement but only 1.6% owned action — Premium Seating gets 4.8% and 3.2%.",
      table: { headers: ["Asset", "Reach", "Engagement", "Owned Action"], rows: [["Player Spotlight 01", "18.4k", "8.9%", "1.6%"], ["Player Spotlight 02", "16.8k", "8.1%", "1.5%"], ["Premium Seating Push", "11.2k", "4.8%", "3.2%"], ["Family Weekend Push", "9.6k", "5.2%", "2.8%"]], deltaCol: 3 },
      actions: ["Generate CTA-enhanced variants", "Route to content team", "Compare against premium", "Ask Minerva how to improve"],
    },
  },
  {
    id: "7", label: "Audience Shift", mainValue: "", valueColor: "",
    subtitle: "Families up · Gen Z flat",
    copy: "Higher-intent local audiences are becoming more valuable than broad casual reach this week.",
    meaning: "Value is shifting toward segments with stronger intent, not just larger reach.",
    cta: "Compare audience segments", color: "border-l-purple-400/60", category: "Audience",
    drillDown: {
      title: "Audience Value Is Shifting Toward Families And Premium",
      summary: "Families and premium buyers are becoming more valuable than broad casual Gen Z reach.",
      meaning: "Casual audiences win on raw attention, but families and premium buyers create more valuable intent. Target where the intent is, not where the volume is.",
      metrics: [
        { label: "Families", value: "+14%", context: "Strongest consideration lift in audience set." },
        { label: "Premium buyers", value: "+11%", context: "Most efficient downstream value per impression." },
        { label: "Casual Gen Z", value: "Flat", context: "High engagement, limited improvement in action." },
        { label: "Core fans", value: "Stable", context: "Healthy owned retention, lower growth." },
      ],
      evidence: "Casual audiences still win on raw attention, but families and premium buyers create more valuable intent and stronger owned follow-through.",
      highlight: "Premium Buyers have 46 owned action score vs Gen Z's 19 — a 2.4x gap in downstream value.",
      table: { headers: ["Audience", "Attention", "Intent", "Owned Action"], rows: [["Families", "61", "59", "41"], ["Premium Buyers", "54", "63", "46"], ["Casual Gen Z", "74", "38", "19"], ["Core Fans", "58", "56", "44"]], deltaCol: 3 },
      actions: ["Create audience brief", "Compare segments", "Build campaign recommendation", "Export"],
    },
  },
  {
    id: "8", label: "Priority", mainValue: "", valueColor: "",
    subtitle: "Turn reach into owned capture", pill: "3 actions ready",
    copy: "Shift more weight toward premium experience, launch a family variant, and fix the short-form CTA gap.",
    meaning: "This is the synthesized action card.",
    cta: "View priority actions", color: "border-l-white/40", category: "Action",
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
      actions: ["Create premium brief", "Create family task", "Create CTA experiment", "Export to leadership", "Assign owners"],
    },
  },
]

/* ── Delta color helper ── */
function deltaColor(val: string): string {
  if (val.startsWith("+")) return "text-emerald-400"
  if (val.startsWith("-")) return "text-red-400"
  return "text-foreground/60"
}

function DrillDownModal({ card, onClose }: { card: InsightCard; onClose: () => void }) {
  const dd = card.drillDown
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
      className="mn-cc-modal fixed inset-0 z-50 bg-black/60 backdrop-blur-md" onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mn-cc-modal-content absolute inset-4 top-12 bg-card border border-border/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}>

        {/* Compact header */}
        <div className="mn-cc-modal-topbar flex items-center justify-between px-8 py-4 border-b border-border/20 shrink-0">
          <div className="mn-cc-modal-header-left">
            <h2 className="mn-cc-modal-title text-[18px] font-semibold tracking-tight">{dd.title}</h2>
            <p className="mn-cc-modal-summary text-[12px] text-muted-foreground mt-0.5">{dd.summary}</p>
          </div>
          <button onClick={onClose} className="mn-cc-modal-close h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all shrink-0 ml-6">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Two-column body */}
        <div className="mn-cc-modal-body flex-1 grid grid-cols-2 min-h-0">

          {/* Left: strategic takeaway + metrics */}
          <div className="mn-cc-modal-left border-r border-border/20 p-8 overflow-y-auto flex flex-col gap-6" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>

            {/* Hero value */}
            {card.mainValue && (
              <div className="mn-cc-modal-hero">
                <span className={`mn-cc-modal-hero-value text-[48px] font-bold tracking-tighter leading-none ${card.valueColor}`}>{card.mainValue}</span>
              </div>
            )}

            {/* What it means — the strategic callout */}
            <div className="mn-cc-modal-meaning rounded-xl bg-muted/10 border-l-2 border-foreground/20 px-5 py-4">
              <p className="mn-cc-modal-meaning-label text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">What it means</p>
              <p className="mn-cc-modal-meaning-text text-[14px] text-foreground/90 leading-relaxed">{dd.meaning}</p>
            </div>

            {/* Key metrics */}
            <div className="mn-cc-modal-metrics-section">
              <h3 className="mn-cc-modal-metrics-title text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Key Metrics</h3>
              <div className="mn-cc-modal-metrics grid grid-cols-2 gap-2.5">
                {dd.metrics.map((m, i) => (
                  <div key={i} className="mn-cc-modal-metric rounded-lg border border-border/20 px-3.5 py-3">
                    <p className="mn-cc-modal-metric-label text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{m.label}</p>
                    <span className={`mn-cc-modal-metric-number text-[20px] font-bold tracking-tight ${m.value.startsWith("+") ? "text-emerald-400" : m.value.startsWith("-") ? "text-red-400" : ""}`}>{m.value}</span>
                    <p className="mn-cc-modal-metric-context text-[10.5px] text-muted-foreground mt-0.5 leading-snug">{m.context}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: evidence + table + actions */}
          <div className="mn-cc-modal-right overflow-y-auto p-8" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>
            <div className="mn-cc-modal-sections space-y-6">

              {/* Evidence with highlight pullquote */}
              <div className="mn-cc-modal-section">
                <h3 className="mn-cc-modal-section-title text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Evidence</h3>
                <p className="mn-cc-modal-evidence text-[13px] text-foreground/70 leading-[1.7] mb-3">{dd.evidence}</p>
                <div className="mn-cc-modal-highlight rounded-lg bg-primary/5 border border-primary/10 px-4 py-3">
                  <p className="mn-cc-modal-highlight-text text-[13px] text-foreground/90 font-medium leading-snug">{dd.highlight}</p>
                </div>
              </div>

              {/* Data table with colored deltas */}
              <div className="mn-cc-modal-table-wrap">
                <h3 className="mn-cc-modal-table-title text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Data</h3>
                <div className="mn-cc-modal-table rounded-lg border border-border/20 overflow-hidden">
                  <table className="mn-cc-modal-table-el w-full text-[12px]">
                    <thead>
                      <tr className="mn-cc-modal-thead bg-muted/10">
                        {dd.table.headers.map((h, i) => (
                          <th key={i} className="mn-cc-modal-th px-3 py-2 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dd.table.rows.map((row, ri) => (
                        <tr key={ri} className={`mn-cc-modal-tr border-t border-border/10 ${ri === 0 ? "bg-muted/5" : ""}`}>
                          {row.map((cell, ci) => (
                            <td key={ci} className={`mn-cc-modal-td px-3 py-2 ${
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

              {/* Actions — primary action differentiated */}
              <div className="mn-cc-modal-actions-wrap">
                <h3 className="mn-cc-modal-actions-title text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Actions</h3>
                <div className="mn-cc-modal-actions flex flex-wrap gap-2">
                  {dd.actions.map((a, i) => (
                    <button key={i} className={`mn-cc-modal-action-chip text-[12px] px-3 py-1.5 rounded-lg transition-colors ${
                      i === 0
                        ? "bg-primary text-primary-foreground font-medium hover:bg-primary/90"
                        : "border border-border/30 text-foreground/60 hover:text-foreground hover:bg-muted/20"
                    }`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function CommandCenterPage() {
  const [activeCard, setActiveCard] = useState<InsightCard | null>(null)
  const [activeFilter, setActiveFilter] = useState("All")
  const scrollRef = useRef<HTMLDivElement>(null)

  const filtered = activeFilter === "All" ? insights : insights.filter(c => c.category === activeFilter)

  return (
    <div className="mn-cc-page flex-1 flex flex-col relative overflow-hidden">
      <PageTransition>
        <FadeIn className="mn-cc-header flex-1 flex flex-col items-center justify-center text-center px-6">
          <h1 className="mn-cc-title text-[32px] font-semibold tracking-tight mb-2" style={{ fontFamily: "'SF Pro Display', 'Overused Grotesk', sans-serif" }}>
            Attention is up.
          </h1>
          <p className="mn-cc-subtitle text-[14px] text-muted-foreground max-w-lg mb-8">
            Premium and family momentum are rising, but owned conversion is slipping — the move today is turning that demand into premium sales and stronger capture.
          </p>
          <div className="mn-cc-filters flex items-center gap-1 rounded-xl bg-muted/20 border border-border/30 p-1 backdrop-blur-sm">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveFilter(cat)}
                className={`mn-cc-filter-chip text-[12px] px-3 py-1.5 rounded-lg transition-all ${
                  activeFilter === cat
                    ? "mn-cc-filter-active bg-primary text-primary-foreground font-medium shadow-sm"
                    : "mn-cc-filter-inactive text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Carousel */}
        <div className="mn-cc-carousel-area shrink-0 pb-6 relative">
          <div className="mn-cc-scroll-left hidden" /><div className="mn-cc-scroll-right hidden" />
          <div ref={scrollRef} className="mn-cc-carousel flex gap-4 overflow-x-auto px-8 pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((card) => (
                <motion.div key={card.id} layout
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCard(card)}
                  className={`mn-cc-card snap-start shrink-0 w-[280px] h-[240px] rounded-xl border-l-[3px] ${card.color} bg-card/90 backdrop-blur-sm border border-border/30 p-5 flex flex-col cursor-pointer hover:shadow-lg transition-shadow`}>

                  {/* Label + pill */}
                  <div className="mn-cc-card-top flex items-center justify-between mb-1">
                    <span className="mn-cc-card-label text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{card.label}</span>
                    {card.pill && <span className="mn-cc-card-pill text-[9px] px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground">{card.pill}</span>}
                  </div>

                  {/* Value or subtitle */}
                  {card.mainValue && <span className={`mn-cc-card-value text-[28px] font-bold tracking-tight leading-none mb-1 ${card.valueColor}`}>{card.mainValue}</span>}
                  {card.subtitle && <span className="mn-cc-card-subtitle text-[15px] font-semibold tracking-tight leading-tight mb-1">{card.subtitle}</span>}

                  {/* Copy */}
                  <p className="mn-cc-card-copy text-[11.5px] text-muted-foreground leading-snug mt-1">{card.copy}</p>

                  {/* Meaning — the strategic one-liner */}
                  <p className="mn-cc-card-meaning text-[11px] text-foreground/50 italic mt-auto mb-3 leading-snug">{card.meaning}</p>

                  {/* Bottom: contextual CTA */}
                  <div className="mn-cc-card-bottom flex items-center justify-between pt-3 border-t border-border/20">
                    <span className="mn-cc-card-action text-[11px] font-medium text-primary/70">{card.cta}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </PageTransition>

      <AnimatePresence>
        {activeCard && <DrillDownModal card={activeCard} onClose={() => setActiveCard(null)} />}
      </AnimatePresence>
    </div>
  )
}
