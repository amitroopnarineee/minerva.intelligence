import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader breadcrumb="Analytics" title="Executive Overview" subtitle="Get a comprehensive overview of your key business metrics." />
      <div className="mn-page flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl">
          <PageTransition>
            <FadeIn className="mn-page-header mb-6">
              <h1 className="text-[28px] font-semibold tracking-tight">Executive Overview</h1>
              <p className="mt-1 text-sm text-muted-foreground">Get a comprehensive overview of your key business metrics.</p>
            </FadeIn>
            <FadeIn>
              <div className="mb-6 flex items-center gap-4 border-b">
                <button className="border-b-2 border-foreground px-1 pb-3 text-sm font-semibold">Paid Ads</button>
                <button className="px-1 pb-3 text-sm text-muted-foreground">Meta Ads</button>
                <button className="px-1 pb-3 text-sm text-muted-foreground">Google Ads</button>
              </div>
            </FadeIn>
            <FadeIn>
              <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border py-24">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <span className="text-xl text-muted-foreground">📊</span>
                </div>
                <h3 className="text-base font-semibold">No analytics data yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">Connect your ad accounts to start tracking metrics.</p>
                <button className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Connect Integration</button>
              </div>
            </FadeIn>
          </PageTransition>
        </div>
      </div>
    </>
  )
}
