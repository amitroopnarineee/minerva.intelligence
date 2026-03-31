"use client"

import { useState, useRef } from "react"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { X, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface InsightCard {
  id: string
  label: string
  mainValue: string
  valueColor: string
  copy: string
  subtitle?: string
  pill?: string
  timeAgo: string
  color: string
  category: string
  drillDown: {
    kicker: string
    title: string
    summary: string
    metrics: { label: string; value: string; context: string }[]
    evidence: string
    table: { headers: string[]; rows: string[][] }
    actions: string[]
  }
}

const categories = ["All", "Signal", "Audience", "Campaign", "Action"]

const insights: InsightCard[] = [
  {
    id: "1", label: "Attention", mainValue: "+18%", valueColor: "text-emerald-400",
    copy: "Player-led content and offseason conversation drove a broad lift in brand visibility across Instagram, TikTok, and owned web.",
    timeAgo: "3min", color: "border-l-emerald-400/60", category: "Signal",
    drillDown: {
      kicker: "Miami Dolphins Sample DB", title: "Brand Attention Increased",
      summary: "Attention is up 18% vs yesterday, driven primarily by player-led content, premium experience messaging, and a rise in schedule-related search behavior.",
      metrics: [
        { label: "Attention delta", value: "+18%", context: "Overall score moved from 76 to 90 in the last 24 hours." },
        { label: "Top channels", value: "IG · TikTok · Web", context: "These three surfaces generated the majority of incremental reach." },
        { label: "Top audience", value: "Younger Fans", context: "Younger fans created most of the lift, families produced more valuable downstream intent." },
        { label: "Search lift", value: "+12%", context: "Schedule, ticket, and premium-related queries all rose." },
      ],
      evidence: "Within the sample dataset, the largest movement came from player-led content and premium messaging published between Mar 30 and Mar 31. Social reach increased much faster than owned capture, which is why attention is up but not all of that lift is converting into long-term value.",
      table: { headers: ["Channel", "Yesterday", "Today", "Delta"], rows: [["Instagram", "18.2k", "24.1k", "+32%"], ["TikTok", "12.6k", "17.4k", "+38%"], ["Owned Web", "8.9k", "10.2k", "+15%"], ["Search", "6.4k", "7.2k", "+12%"]] },
      actions: ["View top contributing posts", "Compare by audience", "Export attention summary", "Ask Minerva why it rose"],
    },
  },
  {
    id: "2", label: "Premium Experience", mainValue: "+11%", valueColor: "text-blue-400",
    copy: "Premium game-day messaging is outperforming general hype and creating the strongest downstream ticket-intent lift.",
    timeAgo: "5min", color: "border-l-blue-400/60", category: "Signal",
    drillDown: {
      kicker: "Miami Dolphins Sample DB", title: "Premium Experience Is The Strongest Revenue Signal",
      summary: "Premium game-day messaging is outperforming general hype across high-intent audiences and is creating the clearest path to premium ticket sales.",
      metrics: [
        { label: "Ticket intent lift", value: "+11%", context: "Ticket intent increased from 54 to 60 among high-value audiences." },
        { label: "Best audience", value: "Premium Buyers", context: "Club, suite, and hospitality positioning is winning most cleanly here." },
        { label: "Vs. general hype", value: "+28%", context: "Premium creative is 28% more efficient on owned action than generic hype." },
        { label: "Top campaign", value: "Premium Seating", context: "The strongest conversion-driving campaign in the current mix." },
      ],
      evidence: "Across the sample campaign table, premium-oriented messaging consistently outperformed generic brand hype on clickthrough, ticket intent, and owned conversion. It also produced stronger overlap with sponsor-adjacent premium audiences.",
      table: { headers: ["Campaign", "CTR", "Intent Lift", "Owned Action"], rows: [["Premium Seating Push", "4.8%", "+16%", "3.2%"], ["Club Access Campaign", "4.1%", "+13%", "2.9%"], ["General Game Hype", "3.0%", "+6%", "1.8%"], ["Player Spotlight CTA", "3.4%", "+7%", "2.0%"]] },
      actions: ["Generate premium sales brief", "Send to ticketing team", "Expand winning creative", "Compare with general hype"],
    },
  },
  {
    id: "3", label: "Family Audience", mainValue: "+14%", valueColor: "text-emerald-400",
    copy: "Family ticket consideration rose across Miami-Dade and Broward, led by planning, convenience, and shared weekend messaging.",
    timeAgo: "8min", color: "border-l-purple-400/60", category: "Audience",
    drillDown: {
      kicker: "Miami Dolphins Sample DB", title: "Family Ticket Interest Rose In South Florida",
      summary: "Family ticket consideration increased 14%, with the strongest lift concentrated in Miami-Dade and Broward and linked to planning, convenience, and weekend messaging.",
      metrics: [
        { label: "Family consideration", value: "+14%", context: "Family segment score rose from 44 to 50 in the last 24 hours." },
        { label: "Top counties", value: "Dade · Broward", context: "These counties account for the strongest local lift." },
        { label: "Best message", value: "Ease + planning", context: "Convenience-led framing outperformed pure excitement messaging." },
        { label: "Top campaign", value: "Family Weekend", context: "The current highest-performing family-facing campaign." },
      ],
      evidence: "Inside the sample audience and regional tables, families showed the strongest increase in consideration and owned clickthrough when exposed to weekend planning and ease-of-entry messaging. This is a real near-term campaign opportunity, not just a vanity signal.",
      table: { headers: ["Region", "Yesterday", "Today", "Delta"], rows: [["Miami-Dade", "21", "25", "+19%"], ["Broward", "18", "21", "+17%"], ["Palm Beach", "12", "13", "+8%"], ["South FL Total", "51", "59", "+14%"]] },
      actions: ["Create family campaign brief", "Launch regional variant", "Assign to lifecycle team", "Compare vs premium buyers"],
    },
  },
  {
    id: "4", label: "Owned Conversion", mainValue: "-4%", valueColor: "text-red-400",
    copy: "Social engagement rose sharply, but movement into app, ticketing, and lifecycle capture still trails total reach growth.",
    timeAgo: "10min", color: "border-l-red-400/60", category: "Signal",
    drillDown: {
      kicker: "Miami Dolphins Sample DB", title: "Owned Conversion Is Still Lagging",
      summary: "Even with strong engagement growth, owned action is down 4% in efficiency. The main drop-off is between short-form social engagement and owned clickthrough.",
      metrics: [
        { label: "Efficiency delta", value: "-4%", context: "Reach is climbing faster than owned conversion." },
        { label: "Biggest drop-off", value: "Social → owned", context: "The largest funnel leak happens after engagement." },
        { label: "Most affected", value: "Younger + casual", context: "These groups engage heavily but progress less into owned flows." },
        { label: "Worst channel gap", value: "TikTok", context: "Highest reach growth, weakest owned follow-through." },
      ],
      evidence: "The sample funnel data shows that social engagement rose strongly, but app opens, ticket clicks, and email capture did not keep pace. The biggest opportunity is not more reach — it is stronger CTA design and clearer owned pathways.",
      table: { headers: ["Channel", "Engagement", "Owned Click", "Gap"], rows: [["TikTok", "8.6%", "1.2%", "-7.4"], ["Instagram", "6.9%", "1.7%", "-5.2"], ["Email", "3.1%", "2.6%", "-0.5"], ["Owned Web", "4.2%", "3.4%", "-0.8"]] },
      actions: ["Create CTA test", "Generate conversion brief", "Assign to performance team", "Create experiment"],
    },
  },
  {
    id: "5", label: "Sponsor Resonance", mainValue: "+9%", valueColor: "text-amber-400",
    copy: "Luxury, hospitality, and Miami-lifestyle narratives are creating the strongest sponsor-adjacent value in the current mix.",
    timeAgo: "12min", color: "border-l-amber-400/60", category: "Signal",
    drillDown: {
      kicker: "Miami Dolphins Sample DB", title: "Luxury And Hospitality Narratives Are Winning",
      summary: "Sponsor resonance is up 9%, driven by narratives tied to premium lifestyle, hospitality, and elevated Miami identity.",
      metrics: [
        { label: "Sponsor resonance", value: "+9%", context: "Sponsor-linked narrative score moved from 66 to 72." },
        { label: "Top narrative", value: "Miami Lifestyle", context: "The strongest brand-partner alignment in the dataset." },
        { label: "Best audience", value: "Lifestyle premium", context: "This audience shows the cleanest response to luxury framing." },
        { label: "Top asset", value: "Lifestyle Content", context: "Highest sponsor lift among current assets." },
      ],
      evidence: "Within the narrative and sponsor tables, luxury and hospitality-aligned storytelling outperformed other partnership-related narratives on both quality-of-engagement and sponsor value. It may not be the strongest ticketing driver, but it is the strongest partner story.",
      table: { headers: ["Narrative", "Engagement", "Sponsor Lift", "Sentiment"], rows: [["Miami Lifestyle", "5.4%", "+12%", "84"], ["Premium Game-Day", "4.8%", "+9%", "82"], ["Player Excitement", "7.1%", "+3%", "79"], ["General Hype", "4.0%", "+2%", "75"]] },
      actions: ["Generate sponsor memo", "Export to partnerships", "Compare with premium narrative", "Build partner summary"],
    },
  },
  {
    id: "6", label: "Top Campaign", mainValue: "", valueColor: "",
    subtitle: "Player Spotlight Series",
    pill: "High reach / low CTA",
    copy: "The strongest awareness driver in the dataset, but still underperforming premium and family campaigns on owned action.",
    timeAgo: "15min", color: "border-l-blue-400/60", category: "Campaign",
    drillDown: {
      kicker: "Miami Dolphins Sample DB", title: "Player Spotlight Series Is The Strongest Awareness Driver",
      summary: "Player Spotlight Series produced the largest attention lift in the campaign table, but still trails premium and family campaigns on owned conversion.",
      metrics: [
        { label: "Attention impact", value: "34%", context: "The campaign contributed 34% of total social attention lift." },
        { label: "Best channels", value: "TikTok · IG", context: "Performance is strongest on short-form social." },
        { label: "Engagement quality", value: "Very High", context: "Comments, saves, and share velocity all rose." },
        { label: "Owned action", value: "Medium-Low", context: "The CTA gap is the main weakness." },
      ],
      evidence: "The campaign table makes the gap very clear: player-led content is the strongest tool for awareness, but not the strongest tool for conversion. The next step is not replacing it — it is giving it a better owned-action layer.",
      table: { headers: ["Asset", "Reach", "Engagement", "Owned Action"], rows: [["Player Spotlight 01", "18.4k", "8.9%", "1.6%"], ["Player Spotlight 02", "16.8k", "8.1%", "1.5%"], ["Player Spotlight 03", "14.9k", "7.8%", "1.4%"], ["Premium Seating Push", "11.2k", "4.8%", "3.2%"]] },
      actions: ["Generate CTA-enhanced variants", "Route to content team", "Compare against premium", "Ask Minerva how to improve"],
    },
  },
  {
    id: "7", label: "Audience Shift", mainValue: "", valueColor: "",
    subtitle: "Families up · Gen Z flat",
    copy: "Higher-intent local audiences are becoming more valuable than broad casual reach this week.",
    timeAgo: "18min", color: "border-l-purple-400/60", category: "Audience",
    drillDown: {
      kicker: "Miami Dolphins Sample DB", title: "Audience Value Is Shifting Toward Families And Premium Buyers",
      summary: "Families and premium buyers are becoming more valuable than broad casual Gen Z reach, even though casual audiences still generate more top-of-funnel attention.",
      metrics: [
        { label: "Families", value: "+14%", context: "Strongest consideration lift in the current audience set." },
        { label: "Premium buyers", value: "+11%", context: "Most efficient downstream value per impression." },
        { label: "Casual Gen Z", value: "Flat", context: "High engagement, but limited improvement in action." },
        { label: "Core fans", value: "Stable", context: "Healthy owned retention, lower growth rate." },
      ],
      evidence: "The audience table shows why the shift matters: casual audiences still win on raw attention, but families and premium buyers create more valuable intent and stronger owned follow-through. That makes them better targets for immediate action.",
      table: { headers: ["Audience", "Attention", "Intent", "Owned Action"], rows: [["Families", "61", "59", "41"], ["Premium Buyers", "54", "63", "46"], ["Casual Gen Z", "74", "38", "19"], ["Core Fans", "58", "56", "44"]] },
      actions: ["Create audience brief", "Compare segments", "Build campaign recommendation", "Ask why the shift is happening"],
    },
  },
  {
    id: "8", label: "Priority", mainValue: "", valueColor: "",
    subtitle: "Turn reach into owned capture",
    pill: "3 actions ready",
    copy: "Shift more weight toward premium experience, launch a family variant, and fix the short-form CTA gap.",
    timeAgo: "20min", color: "border-l-white/40", category: "Action",
    drillDown: {
      kicker: "Miami Dolphins Sample DB", title: "Today's Priority Actions",
      summary: "Based on the dataset, three moves stand out: push premium experience harder, activate a family variant in South Florida, and fix the short-form owned CTA gap.",
      metrics: [
        { label: "Action 1: Premium", value: "High", context: "Highest revenue opportunity in the current mix." },
        { label: "Action 2: Families", value: "High", context: "Fastest-rising high-intent audience in South Florida." },
        { label: "Action 3: CTAs", value: "Med-High", context: "Biggest friction point in the funnel." },
        { label: "Readiness", value: "High", context: "All three actions are justified by current signal quality." },
      ],
      evidence: "The strongest business path in the sample dataset is not one single metric. It is the combination of premium experience performance, family audience growth, and the obvious owned capture gap that still needs to be solved.",
      table: { headers: ["Action", "Impact", "Evidence", "Status"], rows: [["Shift budget to premium creative", "High", "Premium Seating Push", "Ready"], ["Launch family South FL variant", "High", "Family Weekend Push", "Ready"], ["Test stronger social CTA layer", "Med-High", "Conversion Gap", "Needs testing"], ["Prepare sponsor lifestyle memo", "Medium", "Luxury Narrative", "Ready"]] },
      actions: ["Create premium brief", "Create family task", "Create CTA experiment", "Export to leadership", "Assign owners"],
    },
  },
]

function DrillDownModal({ card, onClose }: { card: InsightCard; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="mn-cc-modal fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mn-cc-modal-content absolute inset-4 top-12 bg-card border border-border/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="mn-cc-modal-topbar flex items-center justify-between px-8 py-5 border-b border-border/30 shrink-0">
          <div className="mn-cc-modal-meta">
            <p className="mn-cc-modal-kicker text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">{card.drillDown.kicker}</p>
            <h2 className="mn-cc-modal-title text-[20px] font-semibold tracking-tight">{card.drillDown.title}</h2>
            <p className="mn-cc-modal-summary text-[13px] text-muted-foreground mt-1 max-w-2xl leading-relaxed">{card.drillDown.summary}</p>
          </div>
          <button onClick={onClose} className="mn-cc-modal-close h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all shrink-0 ml-6">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Two-column body */}
        <div className="mn-cc-modal-body flex-1 grid grid-cols-2 min-h-0">
          {/* Left: metrics */}
          <div className="mn-cc-modal-left border-r border-border/20 p-8 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>
            <h3 className="mn-cc-modal-metrics-title text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-4">Key Metrics</h3>
            <div className="mn-cc-modal-metrics grid grid-cols-2 gap-3">
              {card.drillDown.metrics.map((m, i) => (
                <div key={i} className="mn-cc-modal-metric rounded-xl border border-border/30 bg-muted/10 px-4 py-4">
                  <p className="mn-cc-modal-metric-label text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{m.label}</p>
                  <span className="mn-cc-modal-metric-number text-[22px] font-bold tracking-tight">{m.value}</span>
                  <p className="mn-cc-modal-metric-context text-[11px] text-muted-foreground mt-1 leading-snug">{m.context}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: evidence + table + actions */}
          <div className="mn-cc-modal-right overflow-y-auto p-8" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>
            <div className="mn-cc-modal-sections space-y-6">
              {/* Evidence */}
              <div className="mn-cc-modal-section">
                <h3 className="mn-cc-modal-section-title text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Evidence</h3>
                <p className="mn-cc-modal-section-text text-[13.5px] text-foreground/80 leading-[1.75]">{card.drillDown.evidence}</p>
              </div>

              {/* Data table */}
              <div className="mn-cc-modal-table-wrap">
                <h3 className="mn-cc-modal-table-title text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Data</h3>
                <div className="mn-cc-modal-table rounded-xl border border-border/30 overflow-hidden">
                  <table className="mn-cc-modal-table-el w-full text-[12px]">
                    <thead>
                      <tr className="mn-cc-modal-thead bg-muted/20">
                        {card.drillDown.table.headers.map((h, i) => (
                          <th key={i} className="mn-cc-modal-th px-3 py-2.5 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {card.drillDown.table.rows.map((row, ri) => (
                        <tr key={ri} className="mn-cc-modal-tr border-t border-border/20">
                          {row.map((cell, ci) => (
                            <td key={ci} className={`mn-cc-modal-td px-3 py-2.5 ${ci === 0 ? "text-foreground/80 font-medium" : "text-muted-foreground"}`}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action chips */}
              <div className="mn-cc-modal-actions-wrap">
                <h3 className="mn-cc-modal-actions-title text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Actions</h3>
                <div className="mn-cc-modal-actions flex flex-wrap gap-2">
                  {card.drillDown.actions.map((a, i) => (
                    <button key={i} className="mn-cc-modal-action-chip text-[12px] px-3 py-1.5 rounded-lg border border-border/40 text-foreground/70 hover:text-foreground hover:bg-muted/20 transition-colors">
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

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === "left" ? -360 : 360, behavior: "smooth" })
  }

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

          {/* Filter tabs */}
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
          <button onClick={() => scroll("left")} className="mn-cc-scroll-left absolute left-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-card/80 border border-border/30 flex items-center justify-center hover:bg-card transition-colors backdrop-blur-sm">
            <ChevronLeft className="mn-cc-scroll-icon h-4 w-4" />
          </button>
          <button onClick={() => scroll("right")} className="mn-cc-scroll-right absolute right-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-card/80 border border-border/30 flex items-center justify-center hover:bg-card transition-colors backdrop-blur-sm">
            <ChevronRight className="mn-cc-scroll-icon h-4 w-4" />
          </button>

          <div ref={scrollRef} className="mn-cc-carousel flex gap-4 overflow-x-auto px-8 pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((card) => (
                <motion.div key={card.id} layout
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCard(card)}
                  className={`mn-cc-card snap-start shrink-0 w-[280px] h-[220px] rounded-xl border-l-[3px] ${card.color} bg-card/90 backdrop-blur-sm border border-border/30 p-5 flex flex-col cursor-pointer hover:shadow-lg transition-shadow`}
                >
                  {/* Top: label + value */}
                  <div className="mn-cc-card-top flex items-center justify-between mb-1">
                    <span className="mn-cc-card-label text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{card.label}</span>
                    {card.pill && <span className="mn-cc-card-pill text-[9px] px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground">{card.pill}</span>}
                  </div>
                  {card.mainValue && <span className={`mn-cc-card-value text-[28px] font-bold tracking-tight leading-none mb-1 ${card.valueColor}`}>{card.mainValue}</span>}
                  {card.subtitle && <span className="mn-cc-card-subtitle text-[15px] font-semibold tracking-tight leading-tight mb-1">{card.subtitle}</span>}

                  {/* Copy */}
                  <p className="mn-cc-card-copy text-[12px] text-muted-foreground leading-snug flex-1 mt-1">{card.copy}</p>

                  {/* Bottom */}
                  <div className="mn-cc-card-bottom flex items-center justify-between mt-3 pt-3 border-t border-border/20">
                    <span className="mn-cc-card-action text-[11px] font-medium text-primary/70">View Drill Down</span>
                    <span className="mn-cc-card-time flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="mn-cc-card-clock h-3 w-3" /> {card.timeAgo}
                    </span>
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
