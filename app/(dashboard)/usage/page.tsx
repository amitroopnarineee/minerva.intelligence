import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"

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
            </FadeIn>
            <FadeIn>
              <div className="mt-4 min-h-[40vh] flex-1 rounded-xl bg-muted/50" />
            </FadeIn>
          </PageTransition>
        </div>
      </div>
    </>
  )
}
