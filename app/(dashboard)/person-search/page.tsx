import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MinervaLogo } from "@/components/shared/MinervaLogo"
import { Send } from "lucide-react"

const filters = ["Demographics", "Financial", "Career", "Education", "Residence", "Affinities", "Contact"]

const recentSearches = [
  { query: "Designers in New York", time: "18 min ago" },
  { query: "Senior Designers from Rogo or Posh with Creative and Front End Skills", time: "19 min ago" },
  { query: "Experienced Product Designers in New York with Front-End and Brand", time: "21 min ago" },
  { query: "Experienced Designers in New York City", time: "24 min ago" },
]

export default function PersonSearchPage() {
  return (
    <>
      <PageHeader breadcrumb="Person Search" title="Person Search" subtitle="Search for people all across the United States." />
      <div className="mn-page flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl">
          <PageTransition>
            <FadeIn>
              <div className="flex flex-col items-center pt-8 pb-4">
                <MinervaLogo className="mb-4 h-10 w-10 text-muted-foreground" />
                <h1 className="text-[28px] font-semibold tracking-tight">Person Search</h1>
                <p className="mt-1 text-sm text-muted-foreground text-center max-w-md">Search for people all across the United States. We'll find the best matches for you.</p>
              </div>
            </FadeIn>
            <FadeIn>
              <div className="mx-auto max-w-2xl">
                <div className="mb-4 flex items-center justify-center gap-3">
                  <Tabs defaultValue={0}>
                    <TabsList>
                      <TabsTrigger value={0}>Minerva</TabsTrigger>
                      <TabsTrigger value={1}>Owned</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Badge variant="secondary">👥 260M</Badge>
                </div>
                <Card className="mb-8">
                  <CardContent className="p-4">
                    <textarea className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Show me software engineers who studied at Harvard and now work in big tech." rows={2} readOnly />
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {filters.map((f) => (
                          <Badge key={f} variant="outline" className="cursor-pointer hover:bg-accent">{f}</Badge>
                        ))}
                      </div>
                      <Button size="icon" className="ml-2 h-8 w-8 rounded-full shrink-0">
                        <Send className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <div>
                  {recentSearches.map((s, i) => (
                    <div key={i} className="flex items-center justify-between border-b py-3 last:border-0 cursor-pointer transition-colors hover:bg-muted/50 -mx-2 px-2 rounded-md">
                      <span className="text-sm">{s.query}</span>
                      <span className="text-xs text-muted-foreground shrink-0 ml-4">{s.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </PageTransition>
        </div>
      </div>
    </>
  )
}
