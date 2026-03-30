import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PersonTable } from "@/components/shared/PersonTable"
import { persons } from "@/lib/data/persons"
import { Search, SlidersHorizontal, Plus } from "lucide-react"

export default function ProspectingPage() {
  const prospecting = persons.filter((p) => p.fanStatus === "prospect" || p.lifecycleStage === "acquisition")
  return (
    <>
      <PageHeader breadcrumb="Prospecting" title="Prospecting Segments" subtitle="Create and manage your prospect audiences."
        actions={<Button size="sm"><Plus className="mr-1 h-4 w-4" /> Create Prospect</Button>}
      />
      <div className="mn-page flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl">
          <PageTransition>
            <FadeIn className="mb-6">
              <h1 className="text-[28px] font-semibold tracking-tight">Prospecting Segments</h1>
              <p className="mt-1 text-sm text-muted-foreground">Create and manage your prospect audiences for targeting.</p>
            </FadeIn>
            <FadeIn>
              <div className="mb-4 flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search prospects..." className="pl-9" />
                </div>
                <Button variant="outline" size="sm"><SlidersHorizontal className="mr-1 h-4 w-4" /> Filters</Button>
              </div>
            </FadeIn>
            <FadeIn>
              <PersonTable persons={prospecting} />
            </FadeIn>
          </PageTransition>
        </div>
      </div>
    </>
  )
}
