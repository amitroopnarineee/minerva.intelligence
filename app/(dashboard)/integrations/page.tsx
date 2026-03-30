import { PageHeader } from "@/components/shared/PageHeader"
import { integrations } from "@/lib/data/integrations"
import { CheckCircle, AlertCircle } from "lucide-react"

const healthIcon = {
  healthy: <CheckCircle className="h-4 w-4 text-emerald-500" />,
  degraded: <AlertCircle className="h-4 w-4 text-amber-500" />,
  error: <AlertCircle className="h-4 w-4 text-red-500" />,
}

export default function IntegrationsPage() {
  return (
    <div className="mn-shell">
      <PageHeader
        breadcrumb="Integrations"
        title="Integrations"
        subtitle="Connect your data sources to Minerva."
      />
      <div className="mn-page flex-1 px-6 pb-6">
        <div className="mn-integrations-grid grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((int) => (
            <div key={int.id} className="mn-integration-card flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
                {int.vendor.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{int.name}</span>
                  {healthIcon[int.healthStatus]}
                </div>
                <span className="text-xs text-muted-foreground capitalize">{int.sourceType}</span>
              </div>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium capitalize text-secondary-foreground">
                {int.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
