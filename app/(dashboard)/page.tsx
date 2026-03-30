import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { MetricStrip } from "@/components/home/MetricStrip"
import { MorningBriefing } from "@/components/home/MorningBriefing"
import { TopOpportunities } from "@/components/home/TopOpportunities"
import { InsightsCharts } from "@/components/home/InsightsCharts"
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
      <div className="mn-page flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <PageTransition>
            {/* Title */}
            <FadeIn className="mn-page-header mb-6">
              <h1 className="mn-page-title text-[32px] font-bold tracking-tight">
                Command Center
              </h1>
              <p className="mn-page-subtitle mt-1 text-sm text-muted-foreground">
                Miami Dolphins · Consumer Intelligence · March 30, 2026
              </p>
            </FadeIn>

            {/* KPI Strip */}
            <FadeIn className="mn-section-kpi mb-6">
              <MetricStrip />
            </FadeIn>

            {/* AI Morning Briefing */}
            <FadeIn className="mn-section-briefing mb-6">
              <MorningBriefing />
            </FadeIn>

            {/* Charts — Revenue trend + Funnel */}
            <FadeIn className="mn-section-charts mb-6">
              <InsightsCharts />
            </FadeIn>

            {/* Top Opportunities — #1 hero + #2/#3 secondary */}
            <FadeIn className="mn-section-opps mb-6">
              <TopOpportunities />
            </FadeIn>

            {/* Audience Intelligence */}
            <FadeIn className="mn-section-audience mb-6">
              <AudienceIntelligence />
            </FadeIn>

            {/* Channel Signals Table */}
            <FadeIn className="mn-section-channels mb-6">
              <ChannelSignals />
            </FadeIn>

            {/* Footer */}
            <FadeIn>
              <div className="mn-page-footer border-t pt-4 pb-8">
                <p className="text-center text-[11px] text-muted-foreground">
                  Minerva Intelligence · Synthetic demo data · Built for design review
                </p>
              </div>
            </FadeIn>
          </PageTransition>
        </div>
      </div>
    </>
  )
}
