"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { PropensityRing } from "@/components/shared/ScoreComponents"
import { PersonProfileSheet } from "@/components/shared/PersonProfileSheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Zap, Radio } from "lucide-react"
import { useState } from "react"
import { getPersonsByAudience, type Person } from "@/lib/data/persons"
import type { Audience } from "@/lib/types"

interface AudienceDetailSheetProps {
  audience: Audience | null
  open: boolean
  onClose: () => void
}

const typeColors: Record<string, string> = {
  lifecycle: "bg-blue-500/10 text-blue-500",
  behavioral: "bg-purple-500/10 text-purple-500",
  predictive: "bg-emerald-500/10 text-emerald-500",
  lookalike: "bg-amber-500/10 text-amber-500",
  rule_based: "bg-cyan-500/10 text-cyan-500",
}

export function AudienceDetailSheet({ audience, open, onClose }: AudienceDetailSheetProps) {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  if (!audience) return null

  const members = getPersonsByAudience(audience.id)
  const emailReach = audience.emailReachRate ?? 0.85
  const phoneReach = audience.phoneReachRate ?? 0.6
  const propensity = audience.avgPropensityScore ?? 0.5

  return (
    <>
      <Sheet open={open} onOpenChange={(o) => { if (!o) onClose() }}>
        <SheetContent className="mn-audience-detail w-full sm:max-w-lg overflow-y-auto p-0">
          <div className="mn-audience-header sticky top-0 z-10 border-b bg-background/95 backdrop-blur-sm px-6 py-4">
            <SheetHeader className="p-0">
              <div className="mn-audsheet-group-1 flex items-center gap-3">
                <div className="mn-audsheet-el-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="mn-audsheet-el-3 h-5 w-5 text-primary" />
                </div>
                <div className="mn-audsheet-el-4 flex-1 min-w-0">
                  <SheetTitle className="mn-audsheet-el-5 text-lg font-semibold">{audience.name}</SheetTitle>
                  <div className="mn-audsheet-group-6 flex items-center gap-2 mt-1">
                    <Badge className={`text-[10px] ${typeColors[audience.type] ?? "bg-secondary text-secondary-foreground"}`}>{audience.type.replace(/_/g, " ")}</Badge>
                    <span className="mn-audsheet-el-7 text-xs text-muted-foreground">{audience.estimatedSize.toLocaleString()} members</span>
                  </div>
                </div>
              </div>
            </SheetHeader>
          </div>

          <div className="mn-audsheet-stack px-6 py-5 space-y-6">
            {/* Description */}
            <p className="mn-audsheet-el-9 text-sm text-muted-foreground">{audience.description}</p>

            {/* Key metrics */}
            <div className="mn-audsheet-grid grid grid-cols-3 gap-3">
              <div className="mn-metric-card rounded-lg border p-3 text-center">
                <p className="mn-audsheet-el-11 text-xl font-bold tabular-nums">{audience.estimatedSize.toLocaleString()}</p>
                <p className="mn-audsheet-el-12 text-[10px] text-muted-foreground mt-0.5">Members</p>
              </div>
              <div className="mn-metric-card rounded-lg border p-3 text-center">
                <p className="mn-audsheet-el-13 text-xl font-bold tabular-nums">{Math.round(propensity * 100)}</p>
                <p className="mn-audsheet-el-14 text-[10px] text-muted-foreground mt-0.5">Propensity</p>
              </div>
              <div className="mn-metric-card rounded-lg border p-3 text-center">
                <p className="mn-audsheet-el-15 text-xl font-bold tabular-nums">{audience.memberDelta !== undefined ? (audience.memberDelta > 0 ? "+" : "") + audience.memberDelta : "—"}</p>
                <p className="mn-audsheet-el-16 text-[10px] text-muted-foreground mt-0.5">Δ 7d</p>
              </div>
            </div>

            <Separator />

            {/* Reachability */}
            <div>
              <h4 className="mn-audsheet-label-17 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Channel Reachability</h4>
              <div className="mn-audsheet-stack space-y-3">
                <div><div className="mn-audsheet-row-19 flex items-center justify-between text-xs mb-1"><span>Email</span><span className="mn-audsheet-el-20 tabular-nums font-medium">{Math.round(emailReach * 100)}%</span></div><Progress value={emailReach * 100} className="h-1.5" /></div>
                <div><div className="mn-audsheet-row-21 flex items-center justify-between text-xs mb-1"><span>Phone / SMS</span><span className="mn-audsheet-el-22 tabular-nums font-medium">{Math.round(phoneReach * 100)}%</span></div><Progress value={phoneReach * 100} className="h-1.5" /></div>
                <div><div className="mn-audsheet-row-23 flex items-center justify-between text-xs mb-1"><span>Ad Platforms</span><span className="mn-audsheet-el-24 tabular-nums font-medium">{Math.round(((emailReach + phoneReach) / 2) * 100)}%</span></div><Progress value={((emailReach + phoneReach) / 2) * 100} className="h-1.5" /></div>
              </div>
            </div>

            <Separator />

            {/* Score distribution chart */}
            <div>
              <h4 className="mn-audsheet-label-25 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Score Distribution</h4>
              <div className="mn-audsheet-group-26 flex items-end justify-between gap-1 h-16">
                {[12, 18, 28, 45, 72, 90, 68, 42, 25, 8].map((v, i) => (
                  <div key={i} className="mn-audsheet-el-27 flex-1 rounded-t bg-primary/20 hover:bg-primary/40 transition-colors" style={{ height: `${v}%` }} />
                ))}
              </div>
              <div className="mn-audsheet-el-28 flex justify-between text-[9px] text-muted-foreground mt-1 tabular-nums"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div>
            </div>

            <Separator />

            {/* Recommended channel */}
            <div>
              <h4 className="mn-audsheet-label-29 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Recommended Channel</h4>
              <div className="mn-audsheet-group-30 flex items-center gap-2 rounded-lg border px-3 py-2">
                <Radio className="mn-audsheet-el-31 h-4 w-4 text-primary" /><span className="mn-audsheet-el-32 text-sm font-medium capitalize">{audience.channelRecommendation}</span>
              </div>
            </div>

            <Separator />

            {/* Sample members */}
            <div>
              <div className="mn-audsheet-row-33 flex items-center justify-between mb-3">
                <h4 className="mn-audsheet-label-34 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Sample Members</h4>
                <span className="mn-audsheet-el-35 text-[10px] text-muted-foreground">{members.length} matched in sample</span>
              </div>
              {members.length > 0 ? (
                <div className="mn-audsheet-stack space-y-2">
                  {members.slice(0, 5).map((p) => (
                    <div key={p.id} className="mn-member-row flex items-center justify-between rounded-lg border px-3 py-2 cursor-pointer hover:bg-accent/30 transition-colors"
                      onClick={() => setSelectedPerson(p)}>
                      <div className="mn-audsheet-group-37 flex items-center gap-3">
                        <Avatar className="mn-audsheet-el-38 h-7 w-7 border"><AvatarFallback className="mn-audsheet-el-39 bg-primary/10 text-[9px] font-bold text-primary">{p.firstName[0]}{p.lastName[0]}</AvatarFallback></Avatar>
                        <div><p className="mn-audsheet-el-40 text-xs font-medium">{p.firstName} {p.lastName}</p><p className="mn-audsheet-el-41 text-[10px] text-muted-foreground">{p.city}, {p.state}</p></div>
                      </div>
                      <PropensityRing score={p.scores.ticketBuy} size={28} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mn-audsheet-center-42 text-xs text-muted-foreground py-4 text-center">No sample members in demo data for this audience</p>
              )}
            </div>

            <Button className="w-full" size="lg"><Zap className="mn-audsheet-el-43 mr-2 h-4 w-4" /> Activate on {audience.channelRecommendation}</Button>
          </div>
        </SheetContent>
      </Sheet>
      <PersonProfileSheet person={selectedPerson} open={!!selectedPerson} onClose={() => setSelectedPerson(null)} />
    </>
  )
}
