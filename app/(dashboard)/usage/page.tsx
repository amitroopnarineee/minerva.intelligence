import { PageHeader } from "@/components/shared/PageHeader"

export default function UsagePage() {
  return (
    <div className="mn-shell">
      <PageHeader
        breadcrumb="Usage"
        title="Usage"
        subtitle="Monitor your API usage and platform consumption."
      />
      <div className="mn-page flex-1 px-6 pb-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <span className="text-xs font-medium text-muted-foreground">API Calls (30d)</span>
            <p className="mt-1 text-2xl font-semibold tabular-nums">12,847</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <span className="text-xs font-medium text-muted-foreground">Enrichments (30d)</span>
            <p className="mt-1 text-2xl font-semibold tabular-nums">8,432</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <span className="text-xs font-medium text-muted-foreground">Segments Active</span>
            <p className="mt-1 text-2xl font-semibold tabular-nums">12</p>
          </div>
        </div>
        <div className="mt-6 min-h-[40vh] rounded-xl bg-muted/50" />
      </div>
    </div>
  )
}
