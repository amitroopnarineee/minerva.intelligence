"use client"

import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { FeatureCard } from "@/components/shared/FeatureCard"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Users, Plus, Clock, TrendingUp, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const segments = [
  { id: "dolphins", name: "Miami Dolphins Fan Base", description: "Consumer intelligence for South Florida sports fans", count: 9193, status: "active", lastRefreshed: "Today at 9:00 AM", created: "Mar 28, 2026", tags: ["NFL Interest", "Miami-Dade", "Broward"] },
  { id: "renewal-risk", name: "Renewal Risk Members", description: "Season ticket holders at risk of non-renewal", count: 700, status: "warning", lastRefreshed: "Today at 9:00 AM", created: "Mar 15, 2026", tags: ["Churn Risk > 40%", "Season Ticket"] },
  { id: "premium-prospects", name: "Premium Upgrade Prospects", description: "High-propensity fans for suite and club seat upgrades", count: 1420, status: "active", lastRefreshed: "Yesterday", created: "Mar 10, 2026", tags: ["Premium Score > 70", "Income $250K+"] },
  { id: "lapsed-fans", name: "Lapsed Fan Re-engagement", description: "Former ticket buyers who haven't attended in 12+ months", count: 2340, status: "active", lastRefreshed: "Mar 29, 2026", created: "Feb 20, 2026", tags: ["Lapsed", "Last Seen > 12mo"] },
  { id: "family-segment", name: "Family Package Buyers", description: "Households with children interested in group/family experiences", count: 3100, status: "active", lastRefreshed: "Mar 28, 2026", created: "Feb 1, 2026", tags: ["Has Children", "Family Activities"] },
  { id: "high-net-worth", name: "High Net Worth Prospects", description: "Affluent individuals for corporate hospitality and VIP experiences", count: 890, status: "active", lastRefreshed: "Mar 27, 2026", created: "Jan 15, 2026", tags: ["Net Worth $1M+", "Corporate"] },
]

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-500",
  warning: "bg-amber-500/10 text-amber-500",
  draft: "bg-muted text-muted-foreground",
}
const statusIcons: Record<string, typeof TrendingUp> = {
  active: TrendingUp, warning: Shield, draft: Clock,
}

export default function PersonSearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const filtered = segments.filter(s => !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.description.toLowerCase().includes(query.toLowerCase()))

  return (
    <>
      <PageHeader breadcrumb="Person Search" title="" subtitle="" />
      <div className="mn-psearch-page flex-1 overflow-y-auto p-6">
        <div className="mn-psearch-container mx-auto max-w-5xl">
          <PageTransition>
            <FadeIn className="mn-psearch-header mb-6">
              <div className="mn-psearch-title-row flex items-start justify-between">
                <div>
                  <h1 className="mn-psearch-title text-[24px] font-semibold tracking-tight">Audience Segments</h1>
                  <p className="mn-psearch-subtitle text-[13px] text-muted-foreground mt-0.5">Search 260M+ resolved consumer profiles or browse saved segments</p>
                </div>
                <button className="mn-psearch-new-btn flex items-center gap-1.5 text-[12px] bg-primary text-primary-foreground rounded-lg px-3 py-2 font-medium">
                  <Plus className="h-3.5 w-3.5" /> New Segment
                </button>
              </div>
            </FadeIn>

            {/* Search */}
            <FadeIn className="mn-psearch-search-bar mb-5">
              <div className="mn-psearch-search relative w-72">
                <Search className="mn-psearch-search-icon absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search segments..."
                  className="mn-psearch-search-input pl-9 h-9 rounded-lg bg-card/60 border-border/50 text-[13px]" />
              </div>
            </FadeIn>

            {/* Segments table */}
            <FadeIn>
              <FeatureCard className="mn-psearch-segments-table overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="mn-psearch-table-header">
                      <TableHead className="mn-psearch-th-name">Segment</TableHead>
                      <TableHead className="mn-psearch-th-size w-24">Size</TableHead>
                      <TableHead className="mn-psearch-th-status w-24">Status</TableHead>
                      <TableHead className="mn-psearch-th-tags">Tags</TableHead>
                      <TableHead className="mn-psearch-th-refreshed w-36">Last Refreshed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((seg) => {
                      const StatusIcon = statusIcons[seg.status] || TrendingUp
                      return (
                        <TableRow key={seg.id} className="mn-psearch-segment-row cursor-pointer hover:bg-accent/30 transition-colors"
                          onClick={() => router.push(`/person-search/${seg.id}`)}>
                          <TableCell className="mn-psearch-cell-name">
                            <div className="mn-psearch-segment-info flex items-center gap-3">
                              <div className="mn-psearch-segment-icon h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Users className="h-4 w-4 text-primary" />
                              </div>
                              <div className="mn-psearch-segment-text">
                                <p className="mn-psearch-segment-name text-[13px] font-medium">{seg.name}</p>
                                <p className="mn-psearch-segment-desc text-[11px] text-muted-foreground">{seg.description}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="mn-psearch-cell-size text-[13px] font-semibold tabular-nums">{seg.count.toLocaleString()}</TableCell>
                          <TableCell className="mn-psearch-cell-status">
                            <Badge className={`mn-psearch-status-badge text-[10px] gap-1 ${statusColors[seg.status]}`}>
                              <StatusIcon className="h-3 w-3" /> {seg.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="mn-psearch-cell-tags">
                            <div className="mn-psearch-tag-list flex flex-wrap gap-1">
                              {seg.tags.slice(0, 2).map((t, i) => (
                                <Badge key={i} variant="outline" className="mn-psearch-tag text-[10px]">{t}</Badge>
                              ))}
                              {seg.tags.length > 2 && <span className="text-[10px] text-muted-foreground">+{seg.tags.length - 2}</span>}
                            </div>
                          </TableCell>
                          <TableCell className="mn-psearch-cell-refreshed text-[12px] text-muted-foreground">{seg.lastRefreshed}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </FeatureCard>
            </FadeIn>
          </PageTransition>
        </div>
      </div>
    </>
  )
}
