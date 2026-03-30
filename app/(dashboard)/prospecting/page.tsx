import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Search, SlidersHorizontal, Plus } from "lucide-react"
import { audiences } from "@/lib/data/audiences"

export default function ProspectingPage() {
  const prospecting = audiences.filter((a) => a.type === "predictive" || a.type === "retargeting")
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
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead className="text-right">Propensity</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prospecting.map((aud) => (
                      <TableRow key={aud.id} className="cursor-pointer">
                        <TableCell className="font-medium">{aud.name}</TableCell>
                        <TableCell className="tabular-nums">{aud.estimatedSize.toLocaleString()}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-[10px] capitalize">{aud.type}</Badge></TableCell>
                        <TableCell className="capitalize text-muted-foreground">{aud.channelRecommendation}</TableCell>
                        <TableCell className="tabular-nums text-right">{aud.avgPropensityScore ? `${(aud.avgPropensityScore * 100).toFixed(0)}%` : "—"}</TableCell>
                        <TableCell className="text-right">{aud.isActivationReady ? <Badge className="bg-emerald-500/10 text-emerald-500 text-[10px]">Ready</Badge> : <Badge variant="secondary" className="text-[10px]">Pending</Badge>}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
                  <span>Rows per page: 10</span>
                  <span>1 - {prospecting.length} of {prospecting.length}</span>
                </div>
              </Card>
            </FadeIn>
          </PageTransition>
        </div>
      </div>
    </>
  )
}
