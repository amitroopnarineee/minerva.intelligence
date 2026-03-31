"use client"

import { useState, useRef } from "react"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { X, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface InsightCard {
  id: string
  source: string
  category: string
  headline: string
  timeAgo: string
  color: string
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
    timeAgo: "3min", color: "border-l-red-400/60",
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
    timeAgo: "5min", color: "border-l-emerald-400/60",
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
    timeAgo: "8min", color: "border-l-blue-400/60",
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
    timeAgo: "12min", color: "border-l-amber-400/60",
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
    timeAgo: "15min", color: "border-l-orange-400/60",
    drillDown: {
      title: "Lapsed Fan Re-engagement Opportunity",
      sections: [
        { heading: "Summary", content: "2,340 previously active fans have not attended a game or engaged digitally in over 12 months. This segment represents a significant re-engagement opportunity with an estimated lifetime value of $4.7M." },
        { heading: "Segment Profile", content: "Median age: 32. 58% male. Top lapse reasons (inferred): price sensitivity (42%), schedule conflicts (31%), team performance dissatisfaction (27%). 85% still have valid email addresses." },
        { heading: "Campaign Recommendation", content: "Deploy 3-stage email sequence: (1) 'We miss you' sentiment with highlight reel, (2) Exclusive returning-fan offer — 25% off select games, (3) Final urgency — limited availability messaging. Budget: $12K estimated for 3-stage email + retargeting." },
      ],
      metrics: [{ label: "Lapsed Fans", value: "2,340" }, { label: "Est. LTV", value: "$4.7M" }, { label: "Email Reach", value: "85%" }, { label: "Re-engage Rate", value: "18%" }],
    },
  },
  {
    id: "6", source: "Family", category: "Segment",
    headline: "Family package buyers up 23% month-over-month",
    timeAgo: "20min", color: "border-l-purple-400/60",
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
  {
    id: "7", source: "Concessions", category: "Growth",
    headline: "Per-cap concession spend up 18% vs last season",
    timeAgo: "25min", color: "border-l-emerald-400/60",
    drillDown: {
      title: "Concession Revenue — Per-Cap Growth",
      sections: [
        { heading: "Summary", content: "Average per-capita concession spend has risen to $47.20, up 18% from $40.00 last season. Mobile ordering adoption is at 34%, driving higher average order values and reduced queue times." },
        { heading: "Top Categories", content: "Craft beer (+31%), premium food vendors (+24%), and merchandise (+15%) are the fastest-growing categories. Standard concession items are flat. The new sushi vendor in the 72 Club is averaging $2,800 per game." },
        { heading: "Opportunity", content: "Expand mobile ordering to all concourse levels — currently only available in premium sections. Test dynamic pricing on high-demand games. Consider exclusive menu items tied to premium ticket packages." },
      ],
      metrics: [{ label: "Per-Cap Spend", value: "$47.20", trend: "+18%" }, { label: "Mobile Orders", value: "34%" }, { label: "Avg Order Value", value: "$28.50" }, { label: "Season Revenue", value: "$12.4M" }],
    },
  },
  {
    id: "8", source: "Email", category: "Campaign",
    headline: "Season ticket renewal email — 42% open rate, 8.3% CTR",
    timeAgo: "30min", color: "border-l-blue-400/60",
    drillDown: {
      title: "Email Campaign — Season Ticket Renewal Series",
      sections: [
        { heading: "Summary", content: "The 3-part renewal email sequence launched March 15 has achieved a 42% open rate (industry avg: 21%) and 8.3% click-through rate. 340 renewals have been directly attributed to the campaign, generating $1.2M in committed revenue." },
        { heading: "Sequence Performance", content: "Email 1 (Early Bird): 48% open, 9.1% CTR. Email 2 (Seat Map Preview): 39% open, 7.8% CTR. Email 3 (Final Reminder): 38% open, 8.0% CTR. Subject line A/B test showed personalized lines outperform generic by 22%." },
        { heading: "Next Steps", content: "Send Email 4 (final urgency) to non-converters on April 5. Segment high-value non-openers for phone outreach. Test SMS follow-up for mobile-first audience (under 35)." },
      ],
      metrics: [{ label: "Open Rate", value: "42%", trend: "+21pts" }, { label: "CTR", value: "8.3%" }, { label: "Renewals", value: "340" }, { label: "Revenue", value: "$1.2M" }],
    },
  },
  {
    id: "9", source: "Parking", category: "High Value",
    headline: "VIP parking utilization at 91% — capacity risk for playoffs",
    timeAgo: "35min", color: "border-l-red-400/60",
    drillDown: {
      title: "VIP Parking — Capacity Planning Alert",
      sections: [
        { heading: "Summary", content: "VIP and premium parking lots are running at 91% utilization for regular season games. With playoff demand typically 30-40% higher, there is a significant risk of overselling and negative premium customer experiences." },
        { heading: "Current Allocation", content: "72 Club: 100% allocated. Suite holders: 95% allocated. Season ticket premium: 88% allocated. Single-game premium: sold out last 3 home games. Overflow lot (Lot H) has been activated for last 2 games." },
        { heading: "Recommendation", content: "1. Immediately cap single-game VIP parking sales at 90% per game. 2. Negotiate temporary overflow agreement with adjacent property. 3. Launch premium valet service ($75) as capacity relief and revenue add-on. 4. Communicate proactively with suite holders about guaranteed parking." },
      ],
      metrics: [{ label: "Utilization", value: "91%" }, { label: "Revenue/Game", value: "$185K" }, { label: "Overflow Days", value: "2" }, { label: "Complaints", value: "14" }],
    },
  },
  {
    id: "10", source: "Social", category: "Growth",
    headline: "Instagram engagement rate 4.7% — 2x industry benchmark",
    timeAgo: "40min", color: "border-l-purple-400/60",
    drillDown: {
      title: "Social Media — Instagram Performance",
      sections: [
        { heading: "Summary", content: "The Dolphins Instagram account has reached 4.7% engagement rate, doubling the sports industry benchmark of 2.3%. Follower growth is +8,400 this month, driven by behind-the-scenes draft prep content and player lifestyle posts." },
        { heading: "Top Content", content: "Reels outperform static posts 3:1 in engagement. Top 3 posts this month: (1) Draft prospect workout video — 890K views, (2) Player mic'd up at practice — 650K views, (3) Stadium sunset timelapse — 420K views. Stories with polls average 12% response rate." },
        { heading: "Monetization", content: "Partner content (sponsored posts) generating $45K/month. Explore Instagram Shopping integration for merchandise — estimated $15K incremental monthly revenue. Consider UGC campaign tied to gameday to boost organic reach." },
      ],
      metrics: [{ label: "Engagement", value: "4.7%", trend: "+1.2pts" }, { label: "Followers", value: "2.1M" }, { label: "Monthly Growth", value: "+8,400" }, { label: "Partner Rev", value: "$45K" }],
    },
  },
]

function DrillDownModal({ card, onClose }: { card: InsightCard; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="mn-cc-modal fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mn-cc-modal-content absolute inset-4 top-12 bg-card border border-border/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mn-cc-modal-topbar flex items-center justify-between px-8 py-5 border-b border-border/30 shrink-0">
          <div className="mn-cc-modal-meta flex items-center gap-2.5">
            <span className="mn-cc-modal-source text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{card.source}</span>
            <span className="mn-cc-modal-sep text-muted-foreground/20">|</span>
            <span className="mn-cc-modal-category text-[11px] text-muted-foreground">{card.category}</span>
            <span className="mn-cc-modal-sep text-muted-foreground/20">|</span>
            <span className="mn-cc-modal-time flex items-center gap-1 text-[11px] text-muted-foreground"><Clock className="h-3 w-3" />{card.timeAgo} ago</span>
          </div>
          <button onClick={onClose} className="mn-cc-modal-close h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mn-cc-modal-body flex-1 grid grid-cols-2 min-h-0">
          <div className="mn-cc-modal-left border-r border-border/20 p-8 flex flex-col justify-center">
            <h2 className="mn-cc-modal-title text-[26px] font-semibold tracking-tight leading-tight mb-8">{card.drillDown.title}</h2>
            {card.drillDown.metrics && (
              <div className="mn-cc-modal-metrics grid grid-cols-2 gap-3">
                {card.drillDown.metrics.map((m, i) => (
                  <div key={i} className="mn-cc-modal-metric rounded-xl border border-border/30 bg-muted/10 px-4 py-4">
                    <p className="mn-cc-modal-metric-label text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{m.label}</p>
                    <div className="mn-cc-modal-metric-value flex items-baseline gap-2">
                      <span className="mn-cc-modal-metric-number text-[24px] font-bold tracking-tight">{m.value}</span>
                      {m.trend && <span className="mn-cc-modal-metric-trend text-[12px] font-medium text-emerald-400">{m.trend}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mn-cc-modal-right overflow-y-auto p-8" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>
            <div className="mn-cc-modal-sections space-y-8">
              {card.drillDown.sections.map((sec, i) => (
                <div key={i} className="mn-cc-modal-section">
                  <h3 className="mn-cc-modal-section-title text-[12px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">{sec.heading}</h3>
                  <p className="mn-cc-modal-section-text text-[14px] text-foreground/80 leading-[1.75]">{sec.content}</p>
                </div>
              ))}
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

  const categories = ["All", "Renewal Risk", "Campaign", "Growth", "High Value", "Re-engagement", "Segment"]
  const filtered = activeFilter === "All" ? insights : insights.filter(c => c.category === activeFilter)

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === "left" ? -360 : 360, behavior: "smooth" })
  }

  return (
    <div className="mn-cc-page flex-1 flex flex-col relative overflow-hidden">
      <PageTransition>
        {/* Centered header */}
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
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`mn-cc-filter-chip text-[12px] px-3 py-1.5 rounded-lg transition-all ${
                  activeFilter === cat
                    ? "mn-cc-filter-active bg-primary text-primary-foreground font-medium shadow-sm"
                    : "mn-cc-filter-inactive text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Bottom carousel */}
        <div className="mn-cc-carousel-area shrink-0 pb-6 relative">
          <button onClick={() => scroll("left")}
            className="mn-cc-scroll-left absolute left-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-card/80 border border-border/30 flex items-center justify-center hover:bg-card transition-colors backdrop-blur-sm">
            <ChevronLeft className="mn-cc-scroll-icon h-4 w-4" />
          </button>
          <button onClick={() => scroll("right")}
            className="mn-cc-scroll-right absolute right-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-card/80 border border-border/30 flex items-center justify-center hover:bg-card transition-colors backdrop-blur-sm">
            <ChevronRight className="mn-cc-scroll-icon h-4 w-4" />
          </button>

          <div ref={scrollRef}
            className="mn-cc-carousel flex gap-4 overflow-x-auto px-8 pb-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCard(card)}
                  className={`mn-cc-card snap-start shrink-0 w-[280px] h-[200px] rounded-xl border-l-[3px] ${card.color} bg-card/90 backdrop-blur-sm border border-border/30 p-5 flex flex-col cursor-pointer hover:shadow-lg transition-shadow`}
                >
                  <div className="mn-cc-card-top flex items-center justify-between mb-3">
                    <span className="mn-cc-card-source text-[11px] font-semibold text-foreground/70">{card.source}</span>
                    <span className="mn-cc-card-category text-[10px] text-muted-foreground uppercase tracking-wider">{card.category}</span>
                  </div>
                  <p className="mn-cc-card-headline text-[14px] font-medium leading-snug flex-1">{card.headline}</p>
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
