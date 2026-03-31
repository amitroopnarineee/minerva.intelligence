"use client"

import { useState } from "react"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { FeatureCard } from "@/components/shared/FeatureCard"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { persons } from "@/lib/data/persons"
import { audiences } from "@/lib/data/audiences"
import { Search, ChevronRight, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

const statusColors: Record<string, string> = {
  active_fan: "bg-emerald-500/10 text-emerald-500",
  season_ticket_holder: "bg-blue-500/10 text-blue-500",
  lapsed: "bg-red-500/10 text-red-500",
  prospect: "bg-amber-500/10 text-amber-500",
  anonymous: "bg-muted text-muted-foreground",
}

function getAudienceNames(audienceIds: string[]): string[] {
  return audienceIds.map(id => audiences.find(a => a.id === id)?.name || id).slice(0, 2)
}

export default function PeoplePage() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const filtered = persons.filter(p => {
    if (!query) return true
    const q = query.toLowerCase()
    return p.firstName.toLowerCase().includes(q) || p.lastName.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) || p.jobTitle.toLowerCase().includes(q) ||
      p.company.toLowerCase().includes(q) || p.fanStatus.replace(/_/g, " ").includes(q)
  })

  return (
    <div className="mn-people-page flex-1 overflow-y-auto p-6">
      <div className="mn-people-container mx-auto max-w-6xl">
        <PageTransition>
          {/* Header */}
          <FadeIn className="mn-people-header mb-6">
            <div className="mn-people-title-row flex items-start justify-between">
              <div>
                <h1 className="mn-people-title text-[24px] font-semibold tracking-tight">People</h1>
                <p className="mn-people-subtitle text-[13px] text-muted-foreground mt-0.5">All resolved consumer profiles across your segments</p>
              </div>
              <button className="mn-people-add-btn flex items-center gap-1.5 text-[12px] bg-primary text-primary-foreground rounded-lg px-3 py-2 font-medium">
                <Plus className="h-3.5 w-3.5" /> Add to Segment
              </button>
            </div>
          </FadeIn>

          {/* Search + count */}
          <FadeIn className="mn-people-toolbar flex items-center justify-between mb-5">
            <div className="mn-people-search relative w-80">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, location, title, status..."
                className="pl-9 h-9 rounded-lg bg-card/60 border-border/50 text-[13px]" />
            </div>
            <span className="mn-people-count text-[13px] text-muted-foreground">{filtered.length} people</span>
          </FadeIn>

          {/* Table */}
          <FadeIn>
            <FeatureCard className="mn-people-table overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="mn-people-thead">
                    <TableHead className="mn-people-th-name">Person</TableHead>
                    <TableHead className="mn-people-th-age w-14">Age</TableHead>
                    <TableHead className="mn-people-th-job">Job Title</TableHead>
                    <TableHead className="mn-people-th-status">Status</TableHead>
                    <TableHead className="mn-people-th-segments">Segments</TableHead>
                    <TableHead className="mn-people-th-wealth">Wealth</TableHead>
                    <TableHead className="mn-people-th-income">Income</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => {
                    const initials = `${p.firstName[0]}${p.lastName[0]}`
                    const segmentNames = getAudienceNames(p.audiences)
                    return (
                      <TableRow key={p.id} className="mn-people-row cursor-pointer hover:bg-accent/30 transition-colors"
                        onClick={() => router.push(`/person-search/person/${p.id}`)}>
                        <TableCell className="mn-people-cell-name">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border shrink-0">
                              <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[13px] font-medium">{p.firstName} {p.lastName}</span>
                                <svg className="h-3.5 w-3.5 text-[#0A66C2] shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                              </div>
                              <p className="text-[11px] text-muted-foreground">{p.city}, {p.state}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="mn-people-cell-age text-[13px] tabular-nums">{p.age}</TableCell>
                        <TableCell className="mn-people-cell-job">
                          <p className="text-[13px]">{p.jobTitle}</p>
                          <p className="text-[11px] text-muted-foreground">{p.company}</p>
                        </TableCell>
                        <TableCell className="mn-people-cell-status">
                          <Badge className={`text-[10px] ${statusColors[p.fanStatus] ?? "bg-secondary text-secondary-foreground"}`}>
                            {p.fanStatus.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="mn-people-cell-segments">
                          <div className="flex flex-wrap gap-1">
                            {segmentNames.map((s, i) => (
                              <Badge key={i} variant="outline" className="text-[9px] max-w-[120px] truncate">{s}</Badge>
                            ))}
                            {p.audiences.length > 2 && <span className="text-[10px] text-muted-foreground">+{p.audiences.length - 2}</span>}
                          </div>
                        </TableCell>
                        <TableCell className="mn-people-cell-wealth text-[13px] text-muted-foreground">{p.household.netWorthBand}</TableCell>
                        <TableCell className="mn-people-cell-income text-[13px] text-muted-foreground">{p.household.incomeBand}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <div className="mn-people-footer flex items-center justify-between border-t px-4 py-3 text-[11px] text-muted-foreground">
                <span>Rows per page: 25</span>
                <span>1 – {filtered.length} of {filtered.length}</span>
              </div>
            </FeatureCard>
          </FadeIn>
        </PageTransition>
      </div>
    </div>
  )
}
