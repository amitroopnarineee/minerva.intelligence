"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus, DollarSign, Target, BarChart3, Zap } from "lucide-react"
import type { Campaign } from "@/lib/types"

interface CampaignDetailSheetProps {
  campaign: Campaign | null
  open: boolean
  onClose: () => void
}

const channelColors: Record<string, string> = {
  email: "bg-blue-500/10 text-blue-500",
  paid: "bg-purple-500/10 text-purple-500",
  sms: "bg-emerald-500/10 text-emerald-500",
  sales: "bg-amber-500/10 text-amber-500",
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-500",
  paused: "bg-amber-500/10 text-amber-500",
  completed: "bg-muted text-muted-foreground",
}

// Mock daily data for campaign performance chart
function generateDailyData() {
  const days = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      spend: Math.round(2000 + Math.random() * 3000),
      conversions: Math.round(5 + Math.random() * 20),
      roas: +(2 + Math.random() * 4).toFixed(1),
    })
  }
  return days
}

export function CampaignDetailSheet({ campaign, open, onClose }: CampaignDetailSheetProps) {
  if (!campaign) return null

  const TrendIcon = campaign.trend === "up" ? TrendingUp : campaign.trend === "down" ? TrendingDown : Minus
  const trendColor = campaign.trend === "up" ? "text-emerald-400" : campaign.trend === "down" ? "text-red-400" : "text-muted-foreground"
  const budgetPct = Math.round((campaign.spend / campaign.budget) * 100)
  const dailyData = generateDailyData()
  const maxSpend = Math.max(...dailyData.map(d => d.spend))

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent className="mn-campaign-detail w-full sm:max-w-lg overflow-y-auto p-0">
        <div className="mn-campsheet-divider sticky top-0 z-10 border-b bg-background/95 backdrop-blur-sm px-6 py-4">
          <SheetHeader className="p-0">
            <div className="mn-campsheet-group-2 flex items-center gap-3">
              <div className="mn-campsheet-el-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="mn-campsheet-el-4 h-5 w-5 text-primary" />
              </div>
              <div className="mn-campsheet-el-5 flex-1 min-w-0">
                <SheetTitle className="mn-campsheet-el-6 text-lg font-semibold">{campaign.name}</SheetTitle>
                <div className="mn-campsheet-group-7 flex items-center gap-2 mt-1">
                  <Badge className={`text-[10px] ${channelColors[campaign.channel] ?? ""}`}>{campaign.channel}</Badge>
                  <Badge className={`text-[10px] ${statusColors[campaign.status] ?? ""}`}>{campaign.status}</Badge>
                  <span className="mn-campsheet-el-8 text-xs text-muted-foreground">{campaign.platform}</span>
                </div>
              </div>
            </div>
          </SheetHeader>
        </div>

        <div className="mn-campsheet-stack px-6 py-5 space-y-6">
          {/* Key metrics */}
          <div className="mn-campsheet-grid grid grid-cols-2 gap-3">
            <div className="mn-campsheet-el-11 rounded-lg border p-3">
              <div className="mn-campsheet-group-12 flex items-center gap-1.5 text-muted-foreground mb-1"><DollarSign className="h-3 w-3" /><span className="mn-campsheet-label-13 text-[10px] uppercase tracking-wider font-medium">ROAS</span></div>
              <div className="mn-campsheet-group-14 flex items-center gap-2">
                <span className="mn-campsheet-el-15 text-2xl font-bold tabular-nums">{campaign.roas}x</span>
                <span className={`flex items-center gap-0.5 text-xs ${trendColor}`}><TrendIcon className="h-3 w-3" />{campaign.trendPct}%</span>
              </div>
            </div>
            <div className="mn-campsheet-el-16 rounded-lg border p-3">
              <div className="mn-campsheet-group-17 flex items-center gap-1.5 text-muted-foreground mb-1"><Target className="h-3 w-3" /><span className="mn-campsheet-label-18 text-[10px] uppercase tracking-wider font-medium">Conversions</span></div>
              <span className="mn-campsheet-el-19 text-2xl font-bold tabular-nums">{campaign.conversions.toLocaleString()}</span>
            </div>
          </div>

          <Separator />

          {/* Budget */}
          <div>
            <h4 className="mn-campsheet-label-20 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Budget Utilization</h4>
            <div className="mn-campsheet-row-21 flex items-center justify-between text-xs mb-1">
              <span>${campaign.spend.toLocaleString()} spent</span>
              <span className="mn-campsheet-el-22 text-muted-foreground">${campaign.budget.toLocaleString()} budget</span>
            </div>
            <Progress value={budgetPct} className="h-2" />
            <p className="mn-campsheet-el-23 text-[10px] text-muted-foreground mt-1">{budgetPct}% utilized · ${(campaign.budget - campaign.spend).toLocaleString()} remaining</p>
          </div>

          <Separator />

          {/* 30-day spend chart (mini bar chart) */}
          <div>
            <h4 className="mn-campsheet-label-24 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Daily Spend — Last 30 Days</h4>
            <div className="mn-campsheet-group-25 flex items-end gap-px h-20">
              {dailyData.map((d, i) => (
                <div key={i} className="mn-campsheet-el-26 flex-1 rounded-t bg-primary/25 hover:bg-primary/50 transition-colors" style={{ height: `${(d.spend / maxSpend) * 100}%` }}
                  title={`${d.date}: $${d.spend.toLocaleString()}`} />
              ))}
            </div>
            <div className="mn-campsheet-el-27 flex justify-between text-[9px] text-muted-foreground mt-1 tabular-nums">
              <span>{dailyData[0].date}</span><span>{dailyData[14].date}</span><span>{dailyData[29].date}</span>
            </div>
          </div>

          <Separator />

          {/* Daily conversions chart */}
          <div>
            <h4 className="mn-campsheet-label-28 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Daily Conversions</h4>
            <div className="mn-campsheet-group-29 flex items-end gap-px h-16">
              {dailyData.map((d, i) => (
                <div key={i} className="mn-campsheet-el-30 flex-1 rounded-t bg-emerald-500/25 hover:bg-emerald-500/50 transition-colors" style={{ height: `${(d.conversions / 25) * 100}%` }}
                  title={`${d.date}: ${d.conversions} conversions`} />
              ))}
            </div>
          </div>

          <Separator />

          {/* Campaign details */}
          <div>
            <h4 className="mn-campsheet-label-31 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Details</h4>
            <div className="mn-campsheet-stack space-y-2 text-xs">
              <div className="mn-campsheet-el-33 flex justify-between"><span className="mn-campsheet-el-34 text-muted-foreground">Objective</span><span className="mn-campsheet-el-35 font-medium capitalize">{campaign.objective.replace(/_/g, " ")}</span></div>
              <div className="mn-campsheet-el-36 flex justify-between"><span className="mn-campsheet-el-37 text-muted-foreground">Platform</span><span className="mn-campsheet-el-38 font-medium">{campaign.platform}</span></div>
              <div className="mn-campsheet-el-39 flex justify-between"><span className="mn-campsheet-el-40 text-muted-foreground">Channel</span><span className="mn-campsheet-el-41 font-medium capitalize">{campaign.channel}</span></div>
              <div className="mn-campsheet-el-42 flex justify-between"><span className="mn-campsheet-el-43 text-muted-foreground">CPA</span><span className="mn-campsheet-el-44 font-medium tabular-nums">${campaign.conversions > 0 ? Math.round(campaign.spend / campaign.conversions).toLocaleString() : "—"}</span></div>
              <div className="mn-campsheet-el-45 flex justify-between"><span className="mn-campsheet-el-46 text-muted-foreground">Revenue (est.)</span><span className="mn-campsheet-el-47 font-medium tabular-nums">${Math.round(campaign.spend * campaign.roas).toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
