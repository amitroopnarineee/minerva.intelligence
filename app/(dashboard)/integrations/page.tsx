import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { integrations } from "@/lib/data/integrations"
import { CheckCircle, AlertCircle } from "lucide-react"

const healthIcon: Record<string, React.ReactNode> = {
  healthy: <CheckCircle className="h-4 w-4 text-emerald-500" />,
  degraded: <AlertCircle className="h-4 w-4 text-amber-500" />,
  error: <AlertCircle className="h-4 w-4 text-red-500" />,
}

export default function IntegrationsPage() {
  return (
    <>
      <PageHeader breadcrumb="Integrations" title="Integrations" subtitle="Connect your data sources to Minerva." />
      <div className="mn-page flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl">
          <PageTransition>
            <FadeIn className="mb-6">
              <h1 className="text-[28px] font-semibold tracking-tight">Integrations</h1>
              <p className="mt-1 text-sm text-muted-foreground">Connect your data sources to Minerva.</p>
            </FadeIn>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {integrations.map((int) => (
                <FadeIn key={int.id}>
                  <Card className="cursor-pointer transition-colors hover:bg-accent/50">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">{int.vendor.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{int.name}</span>
                          {healthIcon[int.healthStatus]}
                        </div>
                        <span className="text-xs text-muted-foreground capitalize">{int.sourceType}</span>
                      </div>
                      <Badge variant="secondary" className="capitalize">{int.status}</Badge>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </PageTransition>
        </div>
      </div>
    </>
  )
}
