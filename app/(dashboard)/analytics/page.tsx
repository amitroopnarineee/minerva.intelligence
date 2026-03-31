"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { FeatureCard } from "@/components/shared/FeatureCard"
import { Badge } from "@/components/ui/badge"
import { campaigns } from "@/lib/data/campaigns"
import { TrendingUp, TrendingDown, Minus, DollarSign, Target, BarChart3, Users } from "lucide-react"

const tabs = ["All Channels", "Email", "Paid", "SMS"] as const
type Tab = (typeof tabs)[number]
const channelMap: Record<Tab, string | null> = { "All Channels": null, Email: "email", Paid: "paid", SMS: "sms" }

// Generate 30 days of mock performance data
function generateDailyData(seed: number) {
  const days = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const base = 3000 + seed * 500
    days.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      spend: Math.round(base + Math.sin(i * 0.5 + seed) * 1200 + Math.random() * 800),
      revenue: Math.round((base + Math.sin(i * 0.5 + seed) * 1200) * (2.5 + Math.random() * 2)),
      conversions: Math.round(8 + Math.sin(i * 0.3 + seed) * 6 + Math.random() * 10),
    })
  }
  return days
}

function MiniBarChart({ data, color = "bg-primary/30", hoverColor = "bg-primary/60" }: { data: number[]; color?: string; hoverColor?: string }) {
  const max = Math.max(...data)
  return (
    <div className="mn-mini-chart flex items-end gap-px h-16">
      {data.map((v, i) => (
        <div key={i} className={`flex-1 rounded-t ${color} hover:${hoverColor} transition-colors`} style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All Channels")
  const filtered = channelMap[activeTab] ? campaigns.filter(c => c.channel === channelMap[activeTab]) : campaigns

  const totalSpend = filtered.reduce((s, c) => s + c.spend, 0)
  const totalBudget = filtered.reduce((s, c) => s + c.budget, 0)
  const totalConversions = filtered.reduce((s, c) => s + c.conversions, 0)
  const avgRoas = filtered.length > 0 ? +(filtered.reduce((s, c) => s + c.roas, 0) / filtered.length).toFixed(1) : 0
  const totalRevenue = Math.round(filtered.reduce((s, c) => s + c.spend * c.roas, 0))

  const dailyData = generateDailyData(tabs.indexOf(activeTab))

  return (
    <>
      <PageHeader breadcrumb="Analytics" title="Analytics" subtitle="" />
      <div className="mn-page flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl">
          <PageTransition>
            <FadeIn className="mb-6">
              <h1 className="mn-page-title text-[28px] font-semibold tracking-tight">Executive Overview</h1>
              <p className="mn-page-subtitle mt-1 text-sm text-muted-foreground">Campaign performance across all channels · Last 30 days</p>
            </FadeIn>

            {/* Tabs */}
            <FadeIn className="mb-6">
              <div className="mn-analytics-tabs flex gap-1">
                {tabs.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </FadeIn>

            {/* KPI row */}
            <FadeIn className="mn-analytics-kpis mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: DollarSign, label: "Total Spend", value: `$${totalSpend.toLocaleString()}`, sub: `of $${totalBudget.toLocaleString()} budget` },
                  { icon: BarChart3, label: "Avg ROAS", value: `${avgRoas}x`, sub: `${filtered.length} campaigns` },
                  { icon: Target, label: "Conversions", value: totalConversions.toLocaleString(), sub: `$${totalConversions > 0 ? Math.round(totalSpend / totalConversions).toLocaleString() : "—"} CPA` },
                  { icon: TrendingUp, label: "Est. Revenue", value: `$${totalRevenue.toLocaleString()}`, sub: `from ${filtered.length} campaigns` },
                ].map((kpi) => (
                  <FeatureCard key={kpi.label} className="p-4" decorated={false}>
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                      <kpi.icon className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-medium uppercase tracking-wider">{kpi.label}</span>
                    </div>
                    <p className="text-xl font-bold tabular-nums">{kpi.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.sub}</p>
                  </FeatureCard>
                ))}
              </div>
            </FadeIn>

            {/* Spend chart */}
            <FadeIn className="mn-analytics-spend mb-6">
              <FeatureCard className="p-5" decorated={false}>
                <h3 className="text-sm font-medium mb-4">Daily Spend</h3>
                <MiniBarChart data={dailyData.map(d => d.spend)} />
                <div className="flex justify-between text-[9px] text-muted-foreground mt-1.5 tabular-nums">
                  <span>{dailyData[0].date}</span><span>{dailyData[14].date}</span><span>{dailyData[29].date}</span>
                </div>
              </FeatureCard>
            </FadeIn>

            {/* Revenue chart */}
            <FadeIn className="mn-analytics-revenue mb-6">
              <FeatureCard className="p-5" decorated={false}>
                <h3 className="text-sm font-medium mb-4">Daily Revenue</h3>
                <MiniBarChart data={dailyData.map(d => d.revenue)} color="bg-emerald-500/20" hoverColor="bg-emerald-500/40" />
                <div className="flex justify-between text-[9px] text-muted-foreground mt-1.5 tabular-nums">
                  <span>{dailyData[0].date}</span><span>{dailyData[14].date}</span><span>{dailyData[29].date}</span>
                </div>
              </FeatureCard>
            </FadeIn>

            {/* Campaign table */}
            <FadeIn className="mn-analytics-table mb-6">
              <FeatureCard className="overflow-hidden" decorated={false}>
                <div className="px-4 py-3 border-b">
                  <h3 className="text-sm font-medium">Campaign Breakdown</h3>
                </div>
                <div className="divide-y">
                  {filtered.map((c) => {
                    const TrendIcon = c.trend === "up" ? TrendingUp : c.trend === "down" ? TrendingDown : Minus
                    const trendColor = c.trend === "up" ? "text-emerald-400" : c.trend === "down" ? "text-red-400" : "text-muted-foreground"
                    const pct = Math.round((c.spend / c.budget) * 100)
                    return (
                      <div key={c.id} className="mn-campaign-row flex items-center justify-between px-4 py-3 hover:bg-accent/20 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{c.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className="text-[9px]">{c.platform}</Badge>
                              <span className="text-[10px] text-muted-foreground capitalize">{c.channel}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold tabular-nums">{c.roas}x</p>
                            <p className="text-[10px] text-muted-foreground">ROAS</p>
                          </div>
                          <div className="text-right hidden md:block">
                            <p className="text-sm font-semibold tabular-nums">{c.conversions}</p>
                            <p className="text-[10px] text-muted-foreground">Conv.</p>
                          </div>
                          <div className="text-right w-20">
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary mb-1">
                              <div className={`h-full rounded-full ${pct > 85 ? "bg-amber-400" : "bg-primary/40"}`} style={{ width: `${pct}%` }} />
                            </div>
                            <p className="text-[10px] text-muted-foreground tabular-nums">{pct}% of ${(c.budget / 1000).toFixed(0)}k</p>
                          </div>
                          <span className={`flex items-center gap-0.5 w-16 justify-end ${trendColor}`}>
                            <TrendIcon className="h-3 w-3" /><span className="text-xs font-medium tabular-nums">{c.trendPct > 0 ? "+" : ""}{c.trendPct}%</span>
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </FeatureCard>
            </FadeIn>
          </PageTransition>
        </div>
      </div>
    </>
  )
}
