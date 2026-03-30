import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const usage = [
  { label: "API Calls", current: 12847, limit: 50000, period: "30d" },
  { label: "Enrichments", current: 8432, limit: 25000, period: "30d" },
  { label: "Segments Active", current: 12, limit: 50, period: "" },
]

export default function UsagePage() {
  return (
    <>
      <PageHeader breadcrumb="Usage" title="Usage" subtitle="Monitor your API usage and platform consumption." />
      <div className="mn-page flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl">
          <PageTransition>
            <FadeIn className="mb-6">
              <h1 className="text-[28px] font-semibold tracking-tight">Usage</h1>
              <p className="mt-1 text-sm text-muted-foreground">Monitor your API usage and platform consumption.</p>
            </FadeIn>
            <FadeIn>
              <div className="grid gap-4 md:grid-cols-3">
                {usage.map((u) => (
                  <Card key={u.label}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium text-muted-foreground">{u.label} {u.period && `(${u.period})`}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-semibold tabular-nums">{u.current.toLocaleString()}</p>
                      <div className="mt-3 space-y-1">
                        <Progress value={(u.current / u.limit) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground tabular-nums">{u.current.toLocaleString()} / {u.limit.toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </FadeIn>
            <FadeIn>
              <Card className="mt-4">
                <CardContent className="min-h-[40vh] p-0" />
              </Card>
            </FadeIn>
          </PageTransition>
        </div>
      </div>
    </>
  )
}
