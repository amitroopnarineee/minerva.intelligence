import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"

export default function CommandCenterPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Command Center"
        title="Command Center"
        subtitle="Your daily consumer intelligence overview."
      />
      <div className="mn-page flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl">
          <PageTransition>
            <FadeIn className="mn-page-header mb-6">
              <h1 className="mn-page-title text-[28px] font-semibold tracking-tight">Command Center</h1>
              <p className="mn-page-subtitle mt-1 text-sm text-muted-foreground">Your daily consumer intelligence overview.</p>
            </FadeIn>
            <FadeIn>
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
              </div>
            </FadeIn>
            <FadeIn>
              <div className="mt-4 min-h-[50vh] flex-1 rounded-xl bg-muted/50" />
            </FadeIn>
          </PageTransition>
        </div>
      </div>
    </>
  )
}
