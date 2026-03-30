import { PageHeader } from "@/components/shared/PageHeader"
import { Upload } from "lucide-react"

export default function BulkEnrichPage() {
  return (
    <div className="mn-shell">
      <PageHeader
        breadcrumb="Bulk Enrich"
        title="Bulk Enrichment"
        subtitle="Upload a CSV file and enrich your prospects."
      />
      <div className="mn-page flex-1 px-6 pb-6">
        {/* Upload area */}
        <div className="mn-enrich-upload flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-16">
          <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
          <h3 className="text-base font-semibold">Upload your CSV file</h3>
          <p className="mt-1 text-sm text-muted-foreground">Drag and drop or browse your file system.</p>
          <button className="mt-4 rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">
            Browse Files
          </button>
        </div>

        {/* History */}
        <div className="mn-enrich-history mt-8">
          <h3 className="text-base font-semibold">No enrichment history</h3>
          <p className="mt-1 text-sm text-muted-foreground">Your bulk enrichments will appear here.</p>
        </div>
      </div>
    </div>
  )
}
