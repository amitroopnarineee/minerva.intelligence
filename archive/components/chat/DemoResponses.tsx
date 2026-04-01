"use client"

import { useState, useEffect, Fragment } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Typewriter } from "./Typewriter"
import { MetricCard, MetricGrid } from "./MetricCard"
import { ToolChain } from "./ToolChain"

export interface DemoBlock {
  type: "text" | "tools" | "metrics" | "table" | "cta"
  delay: number // ms after message start
  // text
  text?: string
  // tools
  tools?: { icon: string; label: string; detail: string; duration: number }[]
  // metrics
  metrics?: { label: string; value: string; sub?: string; color?: "emerald" | "amber" | "red" | "blue" | "white" }[]
  // table
  headers?: string[]
  rows?: string[][]
  // cta
  ctaText?: string
  ctaAction?: string
}

export interface DemoResponse {
  match: (input: string) => boolean
  blocks: DemoBlock[]
  navigate?: string
  actions?: { type: string; id: string }[]
}

/* ── Block renderer ── */
function DemoBlockRenderer({ block, onCta }: { block: DemoBlock; onCta?: (action: string) => void }) {
  switch (block.type) {
    case "text":
      return (
        <div className="mn-chat-demo-text text-[13.5px] text-white/82 leading-[1.65]">
          <Typewriter text={block.text || ""} speed={25} />
        </div>
      )
    case "tools":
      return <ToolChain steps={block.tools || []} startDelay={0} />
    case "metrics":
      return (
        <MetricGrid>
          {block.metrics?.map((m, i) => (
            <MetricCard key={i} label={m.label} value={m.value} sub={m.sub} color={m.color} delay={i * 0.08} />
          ))}
        </MetricGrid>
      )
    case "table":
      return (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className="mn-chat-demo-table my-3 rounded-[10px] border border-white/[0.06] overflow-hidden text-[12px]">
          <table className="w-full">
            <thead><tr className="mn-chat-demo-table-head bg-white/[0.03]">
              {block.headers?.map((h, i) => (
                <th key={i} className="mn-chat-demo-th px-3 py-2 text-left text-[10px] text-white/40 uppercase tracking-wider font-medium">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {block.rows?.map((row, ri) => (
                <tr key={ri} className="mn-chat-demo-tr border-t border-white/[0.04]">
                  {row.map((cell, ci) => (
                    <td key={ci} className={`px-3 py-2 ${ci === 0 ? "text-white/70 font-medium" : "text-white/50"}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )
    case "cta":
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
          className="mn-chat-demo-cta text-[13px] text-white/55 leading-relaxed mt-2">
          <Typewriter text={block.ctaText || ""} speed={20} />
        </motion.div>
      )
    default:
      return null
  }
}

/* ── Demo response player — stages blocks with delays ── */
export function DemoResponsePlayer({ blocks, onCta, onAction }: { blocks: DemoBlock[]; onCta?: (action: string) => void; onAction?: (action: { type: string; id: string }) => void }) {
  const [visibleBlocks, setVisibleBlocks] = useState<number[]>([])

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    blocks.forEach((block, i) => {
      timers.push(setTimeout(() => {
        setVisibleBlocks(prev => [...prev, i])
      }, block.delay))
    })
    return () => timers.forEach(clearTimeout)
  }, [blocks])

  return (
    <div className="mn-chat-demo-player space-y-1">
      <AnimatePresence>
        {visibleBlocks.map((idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <DemoBlockRenderer block={blocks[idx]} onCta={onCta} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   DEMO RESPONSES — the scripted golden paths
   ═══════════════════════════════════════════════ */

export const demoResponses: DemoResponse[] = [
  {
    match: (input) => /marcus\s*johnson/i.test(input),
    navigate: "/person-search",
    actions: [{ type: "openPerson", id: "p_000015" }],
    blocks: [
      { type: "tools", delay: 0, tools: [
        { icon: "user", label: "Looking up person", detail: "Marcus Johnson", duration: 600 },
        { icon: "navigation", label: "Navigating to", detail: "/person-search", duration: 400 },
        { icon: "user", label: "Opening profile", detail: "Marcus Johnson", duration: 500 },
      ]},
      { type: "text", delay: 1800, text: "Found Marcus Johnson — a high-value season ticket holder from Fort Lauderdale, FL. I've opened his profile on your dashboard." },
      { type: "metrics", delay: 3200, metrics: [
        { label: "Renewal Score", value: "94%", sub: "Excellent retention", color: "emerald" },
        { label: "Premium Propensity", value: "88%", sub: "Strong upsell potential", color: "blue" },
        { label: "Churn Risk", value: "5%", sub: "Very low", color: "emerald" },
        { label: "Ticket Purchase", value: "97%", sub: "Extremely likely buyer", color: "blue" },
      ]},
      { type: "text", delay: 4800, text: "Marcus is in 3 audience segments with affinities for NFL, Golf, and Luxury Travel. He represents an ideal candidate for premium hospitality packages and suite upgrades." },
      { type: "cta", delay: 6200, ctaText: "Next step: Want me to analyze his audience segments or find similar high-value profiles for targeted campaigns?" },
    ],
  },
  {
    match: (input) => /ashley\s*martinez/i.test(input),
    navigate: "/person-search",
    actions: [{ type: "openPerson", id: "p_000002" }],
    blocks: [
      { type: "tools", delay: 0, tools: [
        { icon: "user", label: "Looking up person", detail: "Ashley Martinez", duration: 500 },
        { icon: "navigation", label: "Navigating to", detail: "/person-search", duration: 400 },
        { icon: "user", label: "Opening profile", detail: "Ashley Martinez", duration: 500 },
      ]},
      { type: "text", delay: 1700, text: "Found Ashley Martinez — an active fan from Miami, FL. Profile is now on your dashboard." },
      { type: "metrics", delay: 3000, metrics: [
        { label: "Renewal Score", value: "87%", sub: "High retention", color: "emerald" },
        { label: "Premium Propensity", value: "72%", sub: "Good upsell candidate", color: "blue" },
        { label: "Churn Risk", value: "12%", sub: "Low", color: "emerald" },
        { label: "Ticket Purchase", value: "91%", sub: "Very likely buyer", color: "blue" },
      ]},
      { type: "text", delay: 4400, text: "Ashley lives 8.2 miles from the stadium, engages regularly, and has strong fine dining and NFL affinities. She's an ideal target for premium single-game experiences and club seat trials." },
      { type: "cta", delay: 5800, ctaText: "Should I check which campaigns are targeting her segments, or look for similar profiles in her area?" },
    ],
  },
  {
    match: (input) => /premium\s*suite/i.test(input),
    blocks: [
      { type: "tools", delay: 0, tools: [
        { icon: "megaphone", label: "Loading campaign", detail: "Premium Suites Spring Push", duration: 700 },
      ]},
      { type: "text", delay: 1000, text: "Here's the Premium Suites Spring Push campaign performance:" },
      { type: "metrics", delay: 1800, metrics: [
        { label: "ROAS", value: "3.8x", sub: "Strong return", color: "emerald" },
        { label: "Conversions", value: "87", sub: "Seed audience ready", color: "blue" },
        { label: "Spend", value: "$89.4K", sub: "59% of $150K budget", color: "amber" },
        { label: "CPA", value: "$1,028", sub: "Reasonable for suites", color: "white" },
      ]},
      { type: "table", delay: 3200, headers: ["Metric", "Value"], rows: [
        ["Platform", "Meta (paid/social)"],
        ["Trend", "+8.5% week-over-week"],
        ["Budget Remaining", "41% ($61.6K)"],
        ["Est. Revenue", "$339,720"],
      ]},
      { type: "text", delay: 4200, text: "The campaign is performing well. 3.8x ROAS with upward momentum and significant budget headroom. The 87 converters are a strong seed for Meta lookalike expansion." },
      { type: "cta", delay: 5400, ctaText: "Recommendations: Accelerate spend with remaining budget, test lookalike expansion, and monitor CPA as you scale. Want me to pull the audience segment behind this campaign?" },
    ],
  },
  {
    match: (input) => /renewal\s*risk/i.test(input),
    blocks: [
      { type: "tools", delay: 0, tools: [
        { icon: "users", label: "Fetching audience", detail: "Renewal Risk Members", duration: 600 },
      ]},
      { type: "text", delay: 900, text: "Here's the Renewal Risk Members segment — at-risk season ticket holders who haven't renewed:" },
      { type: "metrics", delay: 1800, metrics: [
        { label: "Segment Size", value: "700", sub: "Estimated members", color: "red" },
        { label: "Avg Propensity", value: "43%", sub: "Below avg renewal", color: "amber" },
        { label: "Email Reach", value: "92%", sub: "High reachability", color: "emerald" },
        { label: "Phone Reach", value: "71%", sub: "Good for outbound", color: "blue" },
      ]},
      { type: "text", delay: 3200, text: "This is a critical segment with 700 at-risk members. The high email reachability (92%) means a targeted retention campaign could be highly effective. Recommended channel is email with personalized renewal offers." },
      { type: "cta", delay: 4600, ctaText: "Should I identify specific high-value individuals in this segment, or help build a retention campaign brief?" },
    ],
  },
  {
    match: (input) => /analytics|take\s*me\s*to/i.test(input) && /analytics/i.test(input),
    navigate: "/analytics",
    blocks: [
      { type: "tools", delay: 0, tools: [
        { icon: "navigation", label: "Navigating to", detail: "/analytics", duration: 400 },
      ]},
      { type: "text", delay: 700, text: "I've navigated you to the Analytics dashboard. You can see 30-day spend and revenue trends, campaign breakdowns by channel, and KPI performance across all active initiatives." },
      { type: "cta", delay: 2000, ctaText: "Would you like me to drill into a specific campaign, compare channel performance, or analyze conversion trends?" },
    ],
  },
  {
    match: (input) => /focus|today|morning|brief/i.test(input),
    blocks: [
      { type: "text", delay: 0, text: "Morning, Sarah. Here's your priority dashboard for today:" },
      { type: "metrics", delay: 800, metrics: [
        { label: "Active Campaigns", value: "5", sub: "All performing", color: "emerald" },
        { label: "Renewal Risk", value: "700", sub: "Need attention", color: "red" },
        { label: "Top ROAS", value: "5.2x", sub: "Season Ticket Renewals", color: "emerald" },
        { label: "New Prospects", value: "+142", sub: "7-day growth", color: "blue" },
      ]},
      { type: "text", delay: 2200, text: "Three things to focus on:" },
      { type: "table", delay: 2800, headers: ["Priority", "Action", "Impact"], rows: [
        ["🔴 High", "Review 700 renewal-risk members", "Revenue retention"],
        ["🟡 Medium", "Scale Premium Suites (+8.5% WoW)", "Budget has 41% headroom"],
        ["🟢 Low", "Explore David Chen (prospect, $500K+ HH)", "Premium conversion"],
      ]},
      { type: "cta", delay: 4000, ctaText: "Want me to dive into the renewal risk segment first, or review campaign performance across all channels?" },
    ],
  },
]

export function findDemoResponse(input: string): DemoResponse | null {
  return demoResponses.find(r => r.match(input)) || null
}
