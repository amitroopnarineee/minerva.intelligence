"use client"

import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { FeatureCard } from "@/components/shared/FeatureCard"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { PersonTable } from "@/components/shared/PersonTable"
import { persons } from "@/lib/data/persons"
import { CompanyLogo } from "@/components/shared/UserAvatar"

const segments = [
  { id: "dolphins", name: "Miami Dolphins Fan Base", description: "Consumer intelligence for South Florida sports fans", count: 9193, status: "active", lastRefreshed: "Today at 9:00 AM", tags: ["NFL Interest", "Miami-Dade", "Broward"] },
  { id: "renewal-risk", name: "Renewal Risk Members", description: "Season ticket holders at risk of non-renewal", count: 700, status: "warning", lastRefreshed: "Today at 9:00 AM", tags: ["Churn Risk > 40%", "Season Ticket"] },
  { id: "premium-prospects", name: "Premium Upgrade Prospects", description: "High-propensity fans for suite and club seat upgrades", count: 1420, status: "active", lastRefreshed: "Yesterday", tags: ["Premium Score > 70", "Income $250K+"] },
  { id: "lapsed-fans", name: "Lapsed Fan Re-engagement", description: "Former ticket buyers who haven't attended in 12+ months", count: 2340, status: "active", lastRefreshed: "Mar 29, 2026", tags: ["Lapsed", "Last Seen > 12mo"] },
  { id: "family-segment", name: "Family Package Buyers", description: "Households with children interested in group/family experiences", count: 3100, status: "active", lastRefreshed: "Mar 28, 2026", tags: ["Has Children", "Family Activities"] },
  { id: "high-net-worth", name: "High Net Worth Prospects", description: "Affluent individuals for corporate hospitality and VIP experiences", count: 890, status: "active", lastRefreshed: "Mar 27, 2026", tags: ["Net Worth $1M+", "Corporate"] },
]

const statusColors: Record<string, string> = {
  active: "bg-sky-500/10 text-sky-400",
  warning: "bg-sky-500/10 text-sky-400/60",
  draft: "bg-muted text-muted-foreground",
}
const statusIcons: Record<string, typeof TrendingUp> = {
  active: TrendingUp, warning: Shield, draft: Clock,
}

export default function PersonSearchPage() {
  const router = useRouter()
  const [tab, setTab] = useState<"segments" | "owned">("segments")
  const ownedAudience = persons.filter((p) => p.knownStatus === "customer")

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-6xl">
        <PageTransition>
          <FadeIn className="mb-6">
            <h1 className="text-[24px] font-semibold tracking-tight">Audiences</h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">Manage audience segments and owned audiences.</p>
          </FadeIn>

          <FadeIn className="mb-5">
            <div className="flex items-center gap-1">
              <button onClick={() => setTab("segments")}
                className={`text-[12px] px-3 py-1.5 rounded-lg transition-all ${tab === "segments" ? "bg-white/10 text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}>
                Audience Segments
              </button>
              <button onClick={() => setTab("owned")}
                className={`text-[12px] px-3 py-1.5 rounded-lg transition-all ${tab === "owned" ? "bg-white/10 text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}>
                Owned Audiences
              </button>
            </div>
          </FadeIn>

          {tab === "segments" ? (
          <FadeIn>
            <FeatureCard className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Segment</TableHead>
                    <TableHead className="w-24">Size</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="w-36">Last Refreshed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {segments.map((seg) => {
                    const StatusIcon = statusIcons[seg.status] || TrendingUp
                    return (
                      <TableRow key={seg.id} className="cursor-pointer hover:bg-accent/30 transition-colors"
                        onClick={() => router.push(`/person-search/${seg.id}`)}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <CompanyLogo name={seg.name} size={36} />
                            <div>
                              <p className="text-[13px] font-medium">{seg.name}</p>
                              <p className="text-[11px] text-muted-foreground">{seg.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[13px] font-semibold tabular-nums">{seg.count.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={`text-[10px] gap-1 ${statusColors[seg.status]}`}>
                            <StatusIcon className="h-3 w-3" /> {seg.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {seg.tags.slice(0, 2).map((t, i) => (
                              <Badge key={i} variant="outline" className="text-[10px]">{t}</Badge>
                            ))}
                            {seg.tags.length > 2 && <span className="text-[10px] text-muted-foreground">+{seg.tags.length - 2}</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-[12px] text-muted-foreground">{seg.lastRefreshed}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </FeatureCard>
          </FadeIn>
          ) : (
          <FadeIn>
            <PersonTable persons={ownedAudience} />
          </FadeIn>
          )}
        </PageTransition>
      </div>
    </div>
  )
}
