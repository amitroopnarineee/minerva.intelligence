import { PageHeader } from "@/components/shared/PageHeader"
import { MinervaLogo } from "@/components/shared/MinervaLogo"

const recentSearches = [
  { query: "Designers in New York", time: "18 min ago" },
  { query: "Senior Designers from Rogo or Posh with Creative and Front End Skills", time: "19 min ago" },
  { query: "Experienced Product Designers in New York with Front-End and Brand", time: "21 min ago" },
  { query: "Experienced Designers in New York City", time: "24 min ago" },
]

export default function PersonSearchPage() {
  return (
    <div className="mn-shell">
      <PageHeader
        breadcrumb="Person Search"
        title="Person Search"
        subtitle="Search for people all across the United States. We'll find the best matches for you."
      />
      <div className="mn-page flex-1 px-6 pb-6">
        {/* Search tabs */}
        <div className="mn-search-tabs mb-4 flex items-center gap-4">
          <button className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium">Minerva</button>
          <button className="px-3 py-1.5 text-sm text-muted-foreground">Owned</button>
          <span className="text-xs text-muted-foreground">👥 260M</span>
        </div>

        {/* Search input */}
        <div className="mn-search-input mb-8">
          <div className="rounded-xl border border-border bg-card p-4">
            <textarea
              className="w-full resize-none bg-transparent text-sm text-muted-foreground outline-none placeholder:text-muted-foreground"
              placeholder="Show me software engineers who studied at Harvard and now work in big tech."
              rows={2}
              readOnly
            />
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">Demographics</span>
              <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">Financial</span>
              <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">Career</span>
              <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">Education</span>
              <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">Residence</span>
              <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">Affinities</span>
              <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">Contact</span>
            </div>
          </div>
        </div>

        {/* Recent searches */}
        <div className="mn-search-recent">
          {recentSearches.map((s, i) => (
            <div key={i} className="flex items-center justify-between border-b py-3 last:border-0">
              <span className="text-sm">{s.query}</span>
              <span className="text-xs text-muted-foreground">{s.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
