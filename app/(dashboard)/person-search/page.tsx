"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PersonTable } from "@/components/shared/PersonTable"
import { persons } from "@/lib/data/persons"
import { Search, Sparkles, Clock } from "lucide-react"

const recentSearches = [
  "High earners near Hard Rock Stadium",
  "Lapsed fans in Coral Gables",
  "Season ticket holders with children",
]

const filterChips = ["25-34", "35-44", "Miami", "Fort Lauderdale", "Season Ticket", "Active Fan", "Lapsed", "Premium"]

export default function PersonSearchPage() {
  const [query, setQuery] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  const results = hasSearched
    ? persons.filter((p) => {
        const q = query.toLowerCase()
        return (
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.fanStatus.replace(/_/g, " ").includes(q) ||
          p.ageBand.includes(q) ||
          q === "" // show all if empty search
        )
      })
    : []

  const handleSearch = () => {
    setHasSearched(true)
  }

  return (
    <>
      <PageHeader breadcrumb="Person Search" title="Person Search" subtitle="" />
      <div className="mn-page flex-1 overflow-y-auto p-6">
        <div className="mn-psearch-el-1 mx-auto max-w-4xl">
          <PageTransition>
            {/* Search */}
            <FadeIn className="mn-search-header mb-8">
              <div className="mn-psearch-center-2 text-center mb-6">
                <h1 className="mn-page-title text-[28px] font-semibold tracking-tight">Person Search</h1>
                <p className="mn-page-subtitle mt-1 text-sm text-muted-foreground">Search 260M+ resolved consumer profiles by any attribute.</p>
              </div>
              <div className="mn-search-input relative max-w-xl mx-auto">
                <Search className="mn-psearch-el-3 absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearch() }}
                  placeholder="Search by name, location, fan status, age..."
                  className="mn-search-field pl-10 pr-10 h-12 rounded-xl bg-card/60 backdrop-blur-sm border-border/50 text-base"
                />
                <button onClick={handleSearch} className="mn-psearch-el-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>
            </FadeIn>

            {/* Filter chips */}
            <FadeIn className="mn-search-filters mb-6">
              <div className="mn-psearch-group-5 flex flex-wrap justify-center gap-2">
                {filterChips.map((chip) => (
                  <Badge key={chip} variant="outline" className="mn-filter-chip cursor-pointer hover:bg-accent/50 transition-colors text-xs"
                    onClick={() => { setQuery(chip.toLowerCase()); setHasSearched(true) }}>
                    {chip}
                  </Badge>
                ))}
              </div>
            </FadeIn>

            {/* Results or empty state */}
            {hasSearched ? (
              <FadeIn className="mn-search-results">
                <div className="mn-psearch-row-6 mb-4 flex items-center justify-between">
                  <p className="mn-psearch-el-7 text-sm text-muted-foreground">{results.length} results found</p>
                </div>
                <PersonTable persons={results} />
              </FadeIn>
            ) : (
              <FadeIn className="mn-search-recent">
                <div className="mn-psearch-el-8 max-w-md mx-auto">
                  <p className="mn-psearch-group-9 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> Recent Searches
                  </p>
                  <div className="mn-psearch-stack space-y-1">
                    {recentSearches.map((s) => (
                      <button key={s} onClick={() => { setQuery(s); setHasSearched(true) }}
                        className="mn-recent-search w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/30 rounded-lg transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}
          </PageTransition>
        </div>
      </div>
    </>
  )
}
