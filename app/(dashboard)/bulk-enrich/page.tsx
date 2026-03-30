import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { Upload } from "lucide-react"

export default function BulkEnrichPage() {
  return (
    <>
      <PageHeader breadcrumb="Bulk Enrich" title="Bulk Enrichment" subtitle="Upload a CSV file and enrich your prospects." />
      <div className="mn-page flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl">
          <PageTransition>
            <FadeIn className="mb-6">
              <h1 className="text-[28px] font-semibold tracking-tight">Bulk Enrichment</h1>
              <p className="mt-1 text-sm text-muted-foreground">Upload a CSV file and enrich your prospects.</p>
            </FadeIn>
            <FadeIn>
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-16">
                <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
                <h3 className="text-base font-semibold">Upload your CSV file</h3>
                <p className="mt-1 text-sm text-muted-foreground">Drag and drop or browse your file system.</p>
                <button className="mt-4 rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">Browse Files</button>
              </div>
            </FadeIn>
            <FadeIn>
              <div className="mt-8">
                <h3 className="text-base font-semibold">No enrichment history</h3>
                <p className="mt-1 text-sm text-muted-foreground">Your bulk enrichments will appear here.</p>
              </div>
            </FadeIn>
          </PageTransition>
        </div>
      </div>
    </>
  )
}
