"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { PersonTable } from "@/components/shared/PersonTable"
import { FeatureCard } from "@/components/shared/FeatureCard"
import { persons } from "@/lib/data/persons"
import { Search, Sparkles, Clock, BarChart3, Users, FileText, Download, Save, MessageSquare } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

/* ── Mock aggregate data (as if we have 9,193 Dolphins fans) ── */
const totalRecords = 9193
const contactSummary = { email: 8882, phone: 8882, address: 9193 }
const genderData = [
  { name: "Male", value: 4800, fill: "#6B8DE3" },
  { name: "Female", value: 3800, fill: "#3B5FCC" },
  { name: "Unknown", value: 593, fill: "#4a4d5e" },
]
const ageData = [
  { band: "18–24", count: 420 }, { band: "25–34", count: 2810 },
  { band: "35–44", count: 2650 }, { band: "45–54", count: 1580 },
  { band: "55–64", count: 980 }, { band: "65+", count: 753 },
]
const fanStatusData = [
  { name: "Active Fan", value: 3200, fill: "#34d399" },
  { name: "Season Ticket", value: 2100, fill: "#60a5fa" },
  { name: "Prospect", value: 1800, fill: "#fbbf24" },
  { name: "Lapsed", value: 1293, fill: "#f87171" },
  { name: "Anonymous", value: 800, fill: "#4a4d5e" },
]
const incomeData = [
  { band: "<$100K", count: 3300 }, { band: "$100–250K", count: 2800 },
  { band: "$250–500K", count: 1600 }, { band: "$500K–1M", count: 940 },
  { band: ">$1M", count: 553 },
]
const homeownershipData = [
  { name: "Owner", value: 4500, fill: "#6B8DE3" },
  { name: "Renter", value: 2900, fill: "#3B5FCC" },
  { name: "Unknown", value: 1793, fill: "#4a4d5e" },
]

const recentSearches = [
  "High earners near Hard Rock Stadium",
  "Lapsed fans in Coral Gables",
  "Season ticket holders with children",
]
const filterChips = ["25-34", "35-44", "Miami", "Fort Lauderdale", "Season Ticket", "Active Fan", "Lapsed", "Premium"]
const CHART_COLORS = ["#6B8DE3", "#3B5FCC", "#34d399", "#fbbf24", "#f87171", "#4a4d5e"]

function ReachBar({ label, icon, count, total }: { label: string; icon: string; count: number; total: number }) {
  const pct = Math.round((count / total) * 100)
  return (
    <div className="mn-psearch-reach-bar flex items-center gap-3 py-2">
      <span className="mn-psearch-reach-icon text-lg shrink-0">{icon}</span>
      <div className="mn-psearch-reach-info flex-1 min-w-0">
        <div className="mn-psearch-reach-row flex items-center justify-between mb-1">
          <span className="mn-psearch-reach-label text-[13px] text-foreground/80">{label}</span>
          <span className="mn-psearch-reach-value text-[13px] font-semibold tabular-nums">{count.toLocaleString()}<span className="mn-psearch-reach-total text-muted-foreground font-normal">/{total.toLocaleString()}</span></span>
        </div>
        <Progress value={pct} className="mn-psearch-reach-progress h-2" />
      </div>
    </div>
  )
}

function MiniPie({ data, size = 140 }: { data: { name: string; value: number; fill: string }[]; size?: number }) {
  return (
    <div className="mn-psearch-mini-pie">
      <PieChart width={size} height={size}>
        <Pie data={data} cx={size/2} cy={size/2} innerRadius={size*0.28} outerRadius={size*0.45} dataKey="value" strokeWidth={0}>
          {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
        </Pie>
        <Tooltip contentStyle={{ background: "rgba(12,14,26,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
      </PieChart>
      <div className="mn-psearch-pie-legend flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {data.map((d, i) => (
          <div key={i} className="mn-psearch-pie-legend-item flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <div className="mn-psearch-pie-dot h-2 w-2 rounded-full" style={{ background: d.fill }} />
            {d.name}
          </div>
        ))}
      </div>
    </div>
  )
}

function HorizontalBars({ data, color = "#6B8DE3" }: { data: { band: string; count: number }[]; color?: string }) {
  const max = Math.max(...data.map(d => d.count))
  return (
    <div className="mn-psearch-h-bars space-y-2">
      {data.map((d, i) => (
        <div key={i} className="mn-psearch-h-bar-row flex items-center gap-3">
          <span className="mn-psearch-h-bar-label text-[11px] text-muted-foreground w-16 text-right shrink-0">{d.band}</span>
          <div className="mn-psearch-h-bar-track flex-1 h-5 bg-secondary/30 rounded overflow-hidden">
            <div className="mn-psearch-h-bar-fill h-full rounded transition-all" style={{ width: `${(d.count / max) * 100}%`, background: color }} />
          </div>
          <span className="mn-psearch-h-bar-count text-[11px] text-muted-foreground tabular-nums w-10">{d.count >= 1000 ? `${(d.count/1000).toFixed(1)}k` : d.count}</span>
        </div>
      ))}
    </div>
  )
}

export default function PersonSearchPage() {
  const [query, setQuery] = useState("")
  const [hasSearched, setHasSearched] = useState(true) // default to searched for demo
  const [activeTab, setActiveTab] = useState("insights")

  // Listen for AI-driven person open events
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail?.personId) setActiveTab("people")
    }
    window.addEventListener("minerva-open-person", handler)
    return () => window.removeEventListener("minerva-open-person", handler)
  }, [])

  const results = persons.filter((p) => {
    if (!query) return true
    const q = query.toLowerCase()
    return p.firstName.toLowerCase().includes(q) || p.lastName.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.fanStatus.replace(/_/g, " ").includes(q) || p.ageBand.includes(q)
  })

  return (
    <>
      <PageHeader breadcrumb="Person Search" title="" subtitle="" />
      <div className="mn-psearch-page flex-1 overflow-y-auto p-6">
        <div className="mn-psearch-container mx-auto max-w-6xl">
          <PageTransition>
            {/* Header */}
            <FadeIn className="mn-psearch-header mb-6">
              <div className="mn-psearch-breadcrumb text-[11px] text-muted-foreground mb-2">Person Search › <span className="text-foreground/70">Miami Dolphins Fan Base</span></div>
              <div className="mn-psearch-title-row flex items-start justify-between">
                <div>
                  <h1 className="mn-psearch-title text-[24px] font-semibold tracking-tight">Miami Dolphins Fan Base</h1>
                  <p className="mn-psearch-subtitle text-[13px] text-muted-foreground mt-0.5">Consumer intelligence for South Florida sports fans</p>
                </div>
                <div className="mn-psearch-actions flex items-center gap-2">
                  <button className="mn-psearch-action-btn flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground border border-border/50 rounded-lg px-3 py-1.5 transition-colors">
                    <MessageSquare className="h-3.5 w-3.5" /> Feedback
                  </button>
                  <button className="mn-psearch-action-btn flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground border border-border/50 rounded-lg px-3 py-1.5 transition-colors">
                    <Download className="h-3.5 w-3.5" /> Export
                  </button>
                  <button className="mn-psearch-save-btn flex items-center gap-1.5 text-[12px] bg-primary text-primary-foreground rounded-lg px-3 py-1.5 font-medium">
                    <Save className="h-3.5 w-3.5" /> Save
                  </button>
                </div>
              </div>
            </FadeIn>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mn-psearch-tabs">
              <div className="mn-psearch-tab-bar flex items-center justify-between mb-6">
                <TabsList className="mn-psearch-tab-list bg-transparent p-0 h-auto gap-0">
                  <TabsTrigger value="insights" className="mn-psearch-tab data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-[13px] gap-1.5">
                    <BarChart3 className="h-3.5 w-3.5" /> Insights
                  </TabsTrigger>
                  <TabsTrigger value="people" className="mn-psearch-tab data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-[13px] gap-1.5">
                    <Users className="h-3.5 w-3.5" /> People
                  </TabsTrigger>
                  <TabsTrigger value="definition" className="mn-psearch-tab data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-[13px] gap-1.5">
                    <FileText className="h-3.5 w-3.5" /> Definition
                  </TabsTrigger>
                </TabsList>
                {/* Search input */}
                <div className="mn-psearch-search relative w-64">
                  <Search className="mn-psearch-search-icon absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter results..."
                    className="mn-psearch-search-input pl-9 h-9 rounded-lg bg-card/60 backdrop-blur-sm border-border/50 text-[13px]" />
                </div>
              </div>

              {/* ══ INSIGHTS TAB ══ */}
              <TabsContent value="insights" className="mn-psearch-insights mt-0">
                <div className="mn-psearch-insights-grid grid grid-cols-2 gap-4">
                  {/* Contact Summary */}
                  <FeatureCard className="mn-psearch-contact-summary p-5">
                    <h3 className="mn-psearch-card-title text-[13px] font-semibold mb-4">Contact Summary</h3>
                    <div className="mn-psearch-total-records mb-4">
                      <span className="mn-psearch-total-number text-[32px] font-bold tracking-tight">{totalRecords.toLocaleString()}</span>
                      <span className="mn-psearch-total-label text-[13px] text-muted-foreground ml-2">total records</span>
                    </div>
                    <ReachBar label="With Emails" icon="✉️" count={contactSummary.email} total={totalRecords} />
                    <ReachBar label="With Phone Number" icon="📞" count={contactSummary.phone} total={totalRecords} />
                    <ReachBar label="With Address" icon="📍" count={contactSummary.address} total={totalRecords} />
                  </FeatureCard>

                  {/* General Demographics */}
                  <FeatureCard className="mn-psearch-demographics p-5">
                    <h3 className="mn-psearch-card-title text-[13px] font-semibold mb-4">General Demographics</h3>
                    <div className="mn-psearch-demo-grid grid grid-cols-2 gap-4">
                      <div className="mn-psearch-gender">
                        <h4 className="mn-psearch-demo-subtitle text-[12px] font-medium text-muted-foreground mb-2">Gender</h4>
                        <MiniPie data={genderData} />
                      </div>
                      <div className="mn-psearch-age">
                        <h4 className="mn-psearch-demo-subtitle text-[12px] font-medium text-muted-foreground mb-2">Age</h4>
                        <HorizontalBars data={ageData} />
                      </div>
                    </div>
                  </FeatureCard>

                  {/* Fan Profile */}
                  <FeatureCard className="mn-psearch-fan-profile p-5">
                    <h3 className="mn-psearch-card-title text-[13px] font-semibold mb-4">Fan Profile</h3>
                    <div className="mn-psearch-fan-grid grid grid-cols-2 gap-4">
                      <div className="mn-psearch-fan-status">
                        <h4 className="mn-psearch-demo-subtitle text-[12px] font-medium text-muted-foreground mb-2">Fan Status</h4>
                        <MiniPie data={fanStatusData} />
                      </div>
                      <div className="mn-psearch-fan-income">
                        <h4 className="mn-psearch-demo-subtitle text-[12px] font-medium text-muted-foreground mb-2">Household Income</h4>
                        <HorizontalBars data={incomeData} color="#3B5FCC" />
                      </div>
                    </div>
                  </FeatureCard>

                  {/* Economic Status */}
                  <FeatureCard className="mn-psearch-economic p-5">
                    <h3 className="mn-psearch-card-title text-[13px] font-semibold mb-4">Economic Status</h3>
                    <div className="mn-psearch-econ-grid grid grid-cols-2 gap-4">
                      <div className="mn-psearch-homeownership">
                        <h4 className="mn-psearch-demo-subtitle text-[12px] font-medium text-muted-foreground mb-2">Home Ownership</h4>
                        <MiniPie data={homeownershipData} />
                      </div>
                      <div className="mn-psearch-wealth">
                        <h4 className="mn-psearch-demo-subtitle text-[12px] font-medium text-muted-foreground mb-2">Net Worth Distribution</h4>
                        <HorizontalBars data={[
                          { band: "<$100K", count: 1200 }, { band: "$100-250K", count: 2100 },
                          { band: "$250-500K", count: 2400 }, { band: "$500K-1M", count: 1800 },
                          { band: ">$1M", count: 1693 },
                        ]} color="#34d399" />
                      </div>
                    </div>
                  </FeatureCard>
                </div>
              </TabsContent>

              {/* ══ PEOPLE TAB ══ */}
              <TabsContent value="people" className="mn-psearch-people mt-0">
                <div className="mn-psearch-results-bar flex items-center justify-between mb-4">
                  <p className="mn-psearch-result-count text-[13px] text-muted-foreground">{results.length} people found</p>
                  <div className="mn-psearch-filter-chips flex flex-wrap gap-2">
                    {filterChips.map((chip) => (
                      <Badge key={chip} variant="outline" className="mn-psearch-filter-chip cursor-pointer hover:bg-accent/50 transition-colors text-[11px]"
                        onClick={() => setQuery(chip.toLowerCase())}>
                        {chip}
                      </Badge>
                    ))}
                  </div>
                </div>
                <PersonTable persons={results} />
              </TabsContent>

              {/* ══ DEFINITION TAB ══ */}
              <TabsContent value="definition" className="mn-psearch-definition mt-0">
                <FeatureCard className="mn-psearch-def-card p-6 max-w-2xl">
                  <h3 className="mn-psearch-def-title text-[14px] font-semibold mb-4">Search Definition</h3>
                  <div className="mn-psearch-def-grid space-y-4">
                    <div className="mn-psearch-def-row flex items-start gap-3">
                      <span className="mn-psearch-def-label text-[12px] text-muted-foreground w-28 shrink-0 pt-0.5">Query</span>
                      <span className="mn-psearch-def-value text-[13px] font-medium">Miami Dolphins Fan Base — South Florida</span>
                    </div>
                    <div className="mn-psearch-def-row flex items-start gap-3">
                      <span className="mn-psearch-def-label text-[12px] text-muted-foreground w-28 shrink-0 pt-0.5">Geography</span>
                      <span className="mn-psearch-def-value text-[13px]">Miami-Dade, Broward, Palm Beach counties</span>
                    </div>
                    <div className="mn-psearch-def-row flex items-start gap-3">
                      <span className="mn-psearch-def-label text-[12px] text-muted-foreground w-28 shrink-0 pt-0.5">Filters</span>
                      <div className="mn-psearch-def-tags flex flex-wrap gap-1.5">
                        <Badge variant="outline" className="text-[10px]">NFL Interest</Badge>
                        <Badge variant="outline" className="text-[10px]">Miami Dolphins Affinity</Badge>
                        <Badge variant="outline" className="text-[10px]">Age 18–75</Badge>
                        <Badge variant="outline" className="text-[10px]">Known + Anonymous</Badge>
                      </div>
                    </div>
                    <div className="mn-psearch-def-row flex items-start gap-3">
                      <span className="mn-psearch-def-label text-[12px] text-muted-foreground w-28 shrink-0 pt-0.5">Created</span>
                      <span className="mn-psearch-def-value text-[13px]">March 28, 2026 by Sarah Martinez</span>
                    </div>
                    <div className="mn-psearch-def-row flex items-start gap-3">
                      <span className="mn-psearch-def-label text-[12px] text-muted-foreground w-28 shrink-0 pt-0.5">Last Refreshed</span>
                      <span className="mn-psearch-def-value text-[13px]">Today at 9:00 AM EST</span>
                    </div>
                  </div>
                </FeatureCard>
              </TabsContent>
            </Tabs>
          </PageTransition>
        </div>
      </div>
    </>
  )
}
