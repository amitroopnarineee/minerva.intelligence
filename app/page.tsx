import { Shell } from "@/components/shared/Shell";
import { MetricStrip } from "@/components/home/MetricStrip";
import { MorningBriefing } from "@/components/home/MorningBriefing";
import { TopOpportunities } from "@/components/home/TopOpportunities";
import { AudienceIntelligence } from "@/components/home/AudienceIntelligence";
import { ChannelSignals } from "@/components/home/ChannelSignals";
import { SystemTrust } from "@/components/home/SystemTrust";

export default function Home() {
  return (
    <Shell>
      <div className="mx-auto max-w-[1200px] px-8 py-8">
        {/* Page header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1 text-[12px] font-medium text-text-tertiary">
              Miami Dolphins · Consumer Intelligence
            </p>
            <h1 className="text-[28px] font-semibold tracking-tight text-text-primary">
              Command Center
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
              <span className="h-1.5 w-1.5 rounded-full bg-positive" />
              All systems operational
            </span>
            <span className="text-[11px] text-text-tertiary">
              Last updated 2 min ago
            </span>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-6">
          <MetricStrip />
          <MorningBriefing />
          <TopOpportunities />
          <AudienceIntelligence />
          <ChannelSignals />
          <SystemTrust />
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-border-subtle pb-8 pt-4">
          <p className="text-center text-[11px] text-text-tertiary">
            Minerva Intelligence · Synthetic demo data · Built for design review
          </p>
        </div>
      </div>
    </Shell>
  );
}
