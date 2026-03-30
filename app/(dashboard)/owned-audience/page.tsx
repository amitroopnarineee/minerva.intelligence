import { PageHeader } from "@/components/shared/PageHeader"
import { Search, SlidersHorizontal, Plus } from "lucide-react"

export default function OwnedAudiencePage() {
  return (
    <div className="mn-shell">
      <PageHeader
        breadcrumb="Owned Audience"
        title="Owned Audiences"
        subtitle="Manage audiences built from your connected first-party data."
        actions={
          <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> Create Audience
          </button>
        }
      />
      <div className="mn-page flex-1 px-6 pb-6">
        <div className="mn-audience-toolbar mb-4 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-border px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search audiences..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              readOnly
            />
          </div>
          <button className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>

        <div className="mn-audience-table rounded-xl border border-border">
          <div className="grid grid-cols-[1fr_80px_80px_80px_100px_100px_100px] gap-4 border-b px-4 py-3">
            {["Name", "Size", "Status", "Source", "Type", "Last Updated", "Activations"].map((h) => (
              <span key={h} className="text-xs font-medium text-muted-foreground">{h}</span>
            ))}
          </div>
          <div className="flex items-center justify-center py-12">
            <span className="text-sm text-muted-foreground">No data available</span>
          </div>
          <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
            <span>Rows per page: 10</span>
            <span>0 - 0 of 0</span>
          </div>
        </div>
      </div>
    </div>
  )
}
