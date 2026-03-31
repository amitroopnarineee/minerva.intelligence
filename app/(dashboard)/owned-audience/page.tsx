import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PersonTable } from "@/components/shared/PersonTable"
import { persons } from "@/lib/data/persons"
import { Search, SlidersHorizontal, Plus } from "lucide-react"

export default function OwnedAudiencePage() {
  const owned = persons.filter((p) => p.knownStatus === "customer")
  return (
    <>
      <PageHeader breadcrumb="Owned Audience" title="Owned Audiences" subtitle="Manage audiences from your connected first-party data."
        actions={<Button size="sm"><Plus className="mn-owned-el-1 mr-1 h-4 w-4" /> Create Audience</Button>}
      />
      <div className="mn-page flex-1 overflow-y-auto p-6">
        <div className="mn-owned-el-2 mx-auto max-w-6xl">
          <PageTransition>
            <FadeIn className="mb-6">
              <h1 className="mn-owned-label-3 text-[28px] font-semibold tracking-tight">Owned Audiences</h1>
              <p className="mn-owned-el-4 mt-1 text-sm text-muted-foreground">Manage audiences built from your connected first-party data.</p>
            </FadeIn>
            <FadeIn>
              <div className="mn-owned-group-5 mb-4 flex items-center gap-3">
                <div className="mn-owned-el-6 relative flex-1">
                  <Search className="mn-owned-el-7 absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search audiences..." className="pl-9" />
                </div>
                <Button variant="outline" size="sm"><SlidersHorizontal className="mn-owned-el-8 mr-1 h-4 w-4" /> Filters</Button>
              </div>
            </FadeIn>
            <FadeIn>
              <PersonTable persons={owned} />
            </FadeIn>
          </PageTransition>
        </div>
      </div>
    </>
  )
}
