import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { MetricStrip } from "@/components/home/MetricStrip"
import { MorningBriefing } from "@/components/home/MorningBriefing"
import { TopOpportunities } from "@/components/home/TopOpportunities"
import { AudienceIntelligence } from "@/components/home/AudienceIntelligence"
import { ChannelSignals } from "@/components/home/ChannelSignals"

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
            <FadeIn className="mn-section-kpi">
              <MetricStrip />
            </FadeIn>
            <FadeIn className="mn-section-briefing mt-4">
              <MorningBriefing />
            </FadeIn>
            <FadeIn className="mn-section-opps mt-4">
              <TopOpportunities />
            </FadeIn>
            <FadeIn className="mn-section-audience mt-4">
              <AudienceIntelligence />
            </FadeIn>
            <FadeIn className="mn-section-channels mt-4">
              <ChannelSignals />
            </FadeIn>
          </PageTransition>
        </div>
      </div>
    </>
  )
}
