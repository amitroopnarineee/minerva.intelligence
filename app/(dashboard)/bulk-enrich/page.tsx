"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { FeatureCard } from "@/components/shared/FeatureCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileSpreadsheet, CheckCircle2, Clock, Database, Sparkles } from "lucide-react"

const recentJobs = [
  { id: 1, name: "CRM_Export_March.csv", records: 12450, matched: 11280, enriched: 10950, status: "completed" as const, date: "Mar 28, 2026" },
  { id: 2, name: "Event_Attendees_Q1.csv", records: 3200, matched: 2890, enriched: 2760, status: "completed" as const, date: "Mar 25, 2026" },
  { id: 3, name: "Lapsed_Fans_Recheck.csv", records: 1900, matched: 1650, enriched: 1580, status: "completed" as const, date: "Mar 22, 2026" },
]

const enrichmentStats = [
  { label: "Records Processed", value: "17,550", icon: Database },
  { label: "Match Rate", value: "91.2%", icon: CheckCircle2 },
  { label: "Avg Attributes Added", value: "47", icon: Sparkles },
  { label: "Avg Processing Time", value: "2.3 min", icon: Clock },
]

export default function BulkEnrichPage() {
  const [dragging, setDragging] = useState(false)

  return (
    <>
      <PageHeader breadcrumb="Bulk Enrich" title="Bulk Enrichment" subtitle="" />
      <div className="mn-page flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl">
          <PageTransition>
            <FadeIn className="mb-6">
              <h1 className="mn-page-title text-[28px] font-semibold tracking-tight">Bulk Enrichment</h1>
              <p className="mn-page-subtitle mt-1 text-sm text-muted-foreground">Upload a CSV to enrich with 300+ consumer attributes from Minerva's identity graph.</p>
            </FadeIn>

            {/* Upload area */}
            <FadeIn className="mn-enrich-upload mb-6">
              <FeatureCard className="p-0" decorated={false}>
                <div className={`flex flex-col items-center justify-center py-16 px-6 border-2 border-dashed rounded-lg transition-colors ${dragging ? "border-primary bg-primary/5" : "border-border/50"}`}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setDragging(false) }}>
                  <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium mb-1">Drop a CSV file here, or click to browse</p>
                  <p className="text-xs text-muted-foreground mb-4">Maximum 100,000 records · Headers must include email or phone</p>
                  <Button variant="outline" size="sm"><FileSpreadsheet className="mr-2 h-4 w-4" /> Select File</Button>
                </div>
              </FeatureCard>
            </FadeIn>

            {/* Stats */}
            <FadeIn className="mn-enrich-stats mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {enrichmentStats.map(({ label, value, icon: Icon }) => (
                  <FeatureCard key={label} className="p-4" decorated={false}>
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                      <Icon className="h-3.5 w-3.5" /><span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
                    </div>
                    <p className="text-xl font-bold tabular-nums">{value}</p>
                  </FeatureCard>
                ))}
              </div>
            </FadeIn>

            {/* Recent jobs */}
            <FadeIn className="mn-enrich-history">
              <FeatureCard className="overflow-hidden" decorated={false}>
                <div className="px-4 py-3 border-b"><h3 className="text-sm font-medium">Recent Enrichment Jobs</h3></div>
                <div className="divide-y">
                  {recentJobs.map((job) => {
                    const matchRate = Math.round((job.matched / job.records) * 100)
                    const enrichRate = Math.round((job.enriched / job.records) * 100)
                    return (
                      <div key={job.id} className="mn-enrich-row flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <FileSpreadsheet className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{job.name}</p>
                            <p className="text-[10px] text-muted-foreground">{job.records.toLocaleString()} records · {job.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="hidden sm:block text-right w-24">
                            <Progress value={enrichRate} className="h-1.5 mb-1" />
                            <p className="text-[10px] text-muted-foreground tabular-nums">{matchRate}% matched · {enrichRate}% enriched</p>
                          </div>
                          <Badge className="bg-emerald-500/10 text-emerald-500 text-[10px]"><CheckCircle2 className="h-3 w-3 mr-1" />{job.status}</Badge>
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
