"use client"

import { useState, useRef } from "react"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { X, Clock, TrendingUp, Users, DollarSign, AlertTriangle, Megaphone, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface InsightCard {
  id: string
  source: string
  category: string
  headline: string
  detail: string
  timeAgo: string
  color: string  // accent border color
  drillDown: {
    title: string
    sections: { heading: string; content: string }[]
    metrics?: { label: string; value: string; trend?: string }[]
  }
}

const insights: InsightCard[] = [
  {
    id: "1", source: "Dolphins", category: "Renewal Risk",
    headline: "700 season ticket holders flagged for non-renewal",
    detail: "",
    timeAgo: "3min", color: "border-red-400/40",
    drillDown: {
      title: "Renewal Risk — Season Ticket Holders",
      sections: [
        { heading: "Summary", content: "700 season ticket holders have been flagged with renewal probability below 40%. This represents a potential revenue loss of $2.1M in annual ticket revenue if not addressed before the April 15 renewal deadline." },
        { heading: "Key Drivers", content: "Primary factors: 62% attended fewer than 4 games last season. 28% have open support tickets. 15% downgraded seating in the last renewal cycle. The 25–34 age cohort shows the steepest decline in engagement." },
        { heading: "Recommended Actions", content: "1. Deploy personalized renewal offers with 10% early-bird discount. 2. Trigger outbound call campaign for accounts > $5K annual value. 3. Invite top 50 at-risk holders to exclusive spring training event." },
      ],
      metrics: [{ label: "At-Risk Accounts", value: "700" }, { label: "Revenue Exposure", value: "$2.1M" }, { label: "Avg Renewal Prob", value: "31%" }, { label: "Days to Deadline", value: "15" }],
    },
  },
  {
    id: "2", source: "Premium Suites", category: "Campaign",
    headline: "ROAS hit 3.8x — budget has 41% headroom",
    detail: "",
    timeAgo: "5min", color: "border-emerald-400/40",
    drillDown: {
      title: "Premium Suites Spring Push — Campaign Performance",
      sections: [
        { heading: "Summary", content: "The Premium Suites Spring Push campaign is outperforming targets with a 3.8x ROAS, +8.5% week-over-week growth, and 87 conversions. $61.6K of the $150K budget remains unspent, representing significant scaling opportunity." },
        { heading: "Channel Breakdown", content: "Meta (paid social) is driving 72% of conversions at $890 CPA. Google Display contributes 18% at $1,240 CPA. Email retargeting delivers the lowest CPA at $340 but only 10% of volume. LinkedIn was paused due to $3,200 CPA." },
        { heading: "Recommendation", content: "Increase Meta budget by 30% and expand lookalike audience from 87 converters. Test creative refresh with suite amenity photography. Consider reactivating LinkedIn with tighter targeting to C-suite only." },
      ],
      metrics: [{ label: "ROAS", value: "3.8x", trend: "+8.5%" }, { label: "Conversions", value: "87" }, { label: "Spend", value: "$89.4K" }, { label: "Budget Left", value: "$61.6K" }],
    },
  },
  {
    id: "3", source: "Fan Base", category: "Growth",
    headline: "142 new prospects added in 7 days",
    detail: "",
    timeAgo: "8min", color: "border-blue-400/40",
    drillDown: {
      title: "Prospect Acquisition — Weekly Growth Report",
      sections: [
        { heading: "Summary", content: "142 new consumer profiles were resolved and added to the fan base this week, a 12% increase over last week. 68% came from digital engagement (website + app), 22% from event attendance, and 10% from partner data syncs." },
        { heading: "Profile Quality", content: "Average identity confidence: 78%. 91% have email addresses. 64% have phone numbers. The Aventura/Sunny Isles zip codes are the fastest-growing geography, with high-income prospect concentration." },
        { heading: "Next Steps", content: "Review top 20 high-net-worth prospects for direct outreach. Schedule data sync with Ticketmaster for missed event attendees. Consider geo-targeted campaign in Aventura area." },
      ],
      metrics: [{ label: "New Prospects", value: "142" }, { label: "Avg Confidence", value: "78%" }, { label: "Email Rate", value: "91%" }, { label: "WoW Growth", value: "+12%" }],
    },
  },
  {
    id: "4", source: "David Chen", category: "High Value",
    headline: "Top prospect — $500K+ household, no tickets purchased",
    detail: "",
    timeAgo: "12min", color: "border-amber-400/40",
    drillDown: {
      title: "High-Value Prospect — David Chen",
      sections: [
        { heading: "Profile", content: "David Chen, 51, CEO of Corporate Ventures LLC in Aventura, FL. Household income $500K+, net worth $1M+. Strong affinities for fine dining (0.93), luxury travel (0.89), and golf (0.86). NFL interest score: 0.55 — moderate but growing." },
        { heading: "Engagement History", content: "First seen Feb 10, 2026 via website. 6 site visits in the last 30 days, browsing premium suites and corporate hospitality pages. Downloaded the 2026 suite pricing PDF. No ticket purchases yet." },
        { heading: "Strategy", content: "This is a classic premium conversion target. Recommend: 1. Personal outreach from VP of Premium Sales. 2. Invite to upcoming suite holder networking event. 3. Offer complimentary suite experience for one game with 4 guests." },
      ],
      metrics: [{ label: "Premium Score", value: "91%" }, { label: "Net Worth", value: "$1M+" }, { label: "Site Visits", value: "6" }, { label: "Days Since First Seen", value: "49" }],
    },
  },
  {
    id: "5", source: "Lapsed Fans", category: "Re-engagement",
    headline: "2,340 lapsed fans haven't attended in 12+ months",
    detail: "",
    timeAgo: "15min", color: "border-orange-400/40",
    drillDown: {
      title: "Lapsed Fan Re-engagement Opportunity",
      sections: [
        { heading: "Summary", content: "2,340 previously active fans have not attended a game or engaged digitally in over 12 months. This segment represents a significant re-engagement opportunity with an estimated lifetime value of $4.7M." },
        { heading: "Segment Profile", content: "Median age: 32. 58% male. Top lapse reasons (inferred): price sensitivity (42%), schedule conflicts (31%), team performance dissatisfaction (27%). 85% still have valid email addresses." },
        { heading: "Campaign Recommendation", content: "Deploy 3-stage email sequence: (1) 'We miss you' sentiment with highlight reel, (2) Exclusive returning-fan offer — 25% off select games, (3) Final urgency — limited availability messaging. Budget: $12K estimated for 3-stage email + retargeting." },
      ],
      metrics: [{ label: "Lapsed Fans", value: "2,340" }, { label: "Est. LTV", value: "$4.7M" }, { label: "Email Reach", value: "85%" }, { label: "Re-engage Rate (est)", value: "18%" }],
    },
  },
  {
    id: "6", source: "Family", category: "Segment",
    headline: "Family package buyers up 23% month-over-month",
    detail: "",
    timeAgo: "20min", color: "border-purple-400/40",
    drillDown: {
      title: "Family Segment — Growth Analysis",
      sections: [
        { heading: "Summary", content: "The Family Package Buyers segment has grown 23% month-over-month to 3,100 members. Spring break timing and a new 'Kids Free Under 5' promotion are driving the surge. Average order value is $380 for family packages." },
        { heading: "Demographics", content: "Median household size: 4. 72% homeowners. Primary geographies: Doral (18%), Pembroke Pines (15%), Coral Springs (12%). 91% have children under 14. Strong index for outdoor recreation and family activities." },
        { heading: "Revenue Impact", content: "Family segment drove $847K in Q1 revenue, up from $689K in Q4. Concession spend per family visit averages $95 — 40% higher than individual tickets. Consider expanding family zone seating and kid-friendly gameday activations." },
      ],
      metrics: [{ label: "Segment Size", value: "3,100" }, { label: "MoM Growth", value: "+23%" }, { label: "Q1 Revenue", value: "$847K" }, { label: "Avg Order", value: "$380" }],
    },
  },
]

function DrillDownModal({ card, onClose }: { card: InsightCard; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="mn-cc-modal fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="mn-cc-modal-content bg-card border border-border/50 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="mn-cc-modal-header flex items-start justify-between p-6 pb-4 border-b border-border/30">
          <div>
            <div className="mn-cc-modal-meta flex items-center gap-2 mb-2">
              <span className="mn-cc-modal-source text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{card.source}</span>
              <span className="mn-cc-modal-dot text-muted-foreground/30">·</span>
              <span className="mn-cc-modal-category text-[11px] text-muted-foreground">{card.category}</span>
              <span className="mn-cc-modal-dot text-muted-foreground/30">·</span>
              <span className="mn-cc-modal-time flex items-center gap-1 text-[11px] text-muted-foreground"><Clock className="h-3 w-3" />{card.timeAgo} ago</span>
            </div>
            <h2 className="mn-cc-modal-title text-[20px] font-semibold tracking-tight">{card.drillDown.title}</h2>
          </div>
          <button onClick={onClose} className="mn-cc-modal-close text-muted-foreground hover:text-foreground transition-colors p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Metrics strip */}
        {card.drillDown.metrics && (
          <div className="mn-cc-modal-metrics grid grid-cols-4 gap-4 p-6 pb-4">
            {card.drillDown.metrics.map((m, i) => (
              <div key={i} className="mn-cc-modal-metric rounded-xl border border-border/30 bg-muted/20 px-4 py-3">
                <p className="mn-cc-modal-metric-label text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{m.label}</p>
                <div className="mn-cc-modal-metric-value flex items-baseline gap-1.5">
                  <span className="text-[20px] font-bold tracking-tight">{m.value}</span>
                  {m.trend && <span className="text-[11px] font-medium text-emerald-400">{m.trend}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sections */}
        <div className="mn-cc-modal-body p-6 pt-2 space-y-5">
          {card.drillDown.sections.map((sec, i) => (
            <div key={i} className="mn-cc-modal-section">
              <h3 className="mn-cc-modal-section-title text-[13px] font-semibold mb-2">{sec.heading}</h3>
              <p className="mn-cc-modal-section-text text-[13.5px] text-muted-foreground leading-relaxed">{sec.content}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function CommandCenterPage() {
  const [activeCard, setActiveCard] = useState<InsightCard | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -360 : 360, behavior: "smooth" })
    }
  }

  return (
    <div className="mn-cc-page flex-1 flex flex-col relative overflow-hidden">
      <PageTransition>
        {/* Centered header */}
        <FadeIn className="mn-cc-header flex-1 flex flex-col items-center justify-center text-center px-6">
          <h1 className="mn-cc-title text-[32px] font-semibold tracking-tight mb-2" style={{ fontFamily: "'SF Pro Display', 'Overused Grotesk', sans-serif" }}>
            Command Center
          </h1>
          <p className="mn-cc-subtitle text-[14px] text-muted-foreground max-w-md">
            AI-generated insights and intelligence cards for the Miami Dolphins CMO
          </p>
        </FadeIn>

        {/* Bottom carousel */}
        <div className="mn-cc-carousel-area shrink-0 pb-6 relative">
          {/* Scroll buttons */}
          <button onClick={() => scroll("left")}
            className="mn-cc-scroll-left absolute left-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-card/80 border border-border/30 flex items-center justify-center hover:bg-card transition-colors backdrop-blur-sm">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scroll("right")}
            className="mn-cc-scroll-right absolute right-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-card/80 border border-border/30 flex items-center justify-center hover:bg-card transition-colors backdrop-blur-sm">
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Cards */}
          <div ref={scrollRef}
            className="mn-cc-carousel flex gap-4 overflow-x-auto px-8 pb-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}>
            {insights.map((card) => (
              <motion.div
                key={card.id}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                onClick={() => setActiveCard(card)}
                className={`mn-cc-card snap-start shrink-0 w-[280px] h-[200px] rounded-xl border-l-2 ${card.color} bg-card/90 backdrop-blur-sm border border-border/30 p-5 flex flex-col cursor-pointer hover:shadow-lg transition-shadow`}
              >
                {/* Top row */}
                <div className="mn-cc-card-top flex items-center justify-between mb-3">
                  <span className="mn-cc-card-source text-[11px] font-semibold text-foreground/70">{card.source}</span>
                  <span className="mn-cc-card-category text-[10px] text-muted-foreground uppercase tracking-wider">{card.category}</span>
                </div>

                {/* Headline */}
                <p className="mn-cc-card-headline text-[14px] font-medium leading-snug flex-1">{card.headline}</p>

                {/* Bottom row */}
                <div className="mn-cc-card-bottom flex items-center justify-between mt-3 pt-3 border-t border-border/20">
                  <span className="mn-cc-card-action text-[11px] font-medium text-primary/70">View Drill Down</span>
                  <span className="mn-cc-card-time flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" /> {card.timeAgo}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </PageTransition>

      {/* Full-screen modal */}
      <AnimatePresence>
        {activeCard && <DrillDownModal card={activeCard} onClose={() => setActiveCard(null)} />}
      </AnimatePresence>
    </div>
  )
}
