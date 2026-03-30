import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MinervaLogo } from "@/components/shared/MinervaLogo"
import { Upload } from "lucide-react"

export default function BulkEnrichPage() {
  return (
    <>
      <PageHeader breadcrumb="Bulk Enrich" title="Bulk Enrichment" subtitle="Upload a CSV file and enrich your prospects." />
      <div className="mn-page flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl">
          <PageTransition>
            <FadeIn>
              <div className="flex flex-col items-center pt-8 pb-6">
                <MinervaLogo className="mb-4 h-10 w-10 text-muted-foreground" />
                <h1 className="text-[28px] font-semibold tracking-tight">Bulk Enrichment</h1>
                <p className="mt-1 text-sm text-muted-foreground">Upload a CSV file and enrich your prospects.</p>
              </div>
            </FadeIn>
            <FadeIn>
              <Card className="mx-auto max-w-xl border-dashed">
                <CardContent className="flex flex-col items-center py-16">
                  <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
                  <h3 className="text-base font-semibold">Upload your CSV file</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Drag and drop or browse your file system.</p>
                  <Button variant="outline" className="mt-4">Browse Files</Button>
                </CardContent>
              </Card>
            </FadeIn>
            <FadeIn>
              <div className="mx-auto max-w-xl mt-8">
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
