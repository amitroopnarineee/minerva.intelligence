import { AppSidebar } from "@/components/app-sidebar";
import { RightSidebar } from "@/components/shared/RightSidebar";
import { NavTicker } from "@/components/shared/NavTicker";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { MetricStrip } from "@/components/home/MetricStrip";
import { MorningBriefing } from "@/components/home/MorningBriefing";
import { TopOpportunities } from "@/components/home/TopOpportunities";
import { AudienceIntelligence } from "@/components/home/AudienceIntelligence";
import { ChannelSignals } from "@/components/home/ChannelSignals";

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Top nav bar with scrolling ticker (ShopifyEdition pattern) */}
        <header className="flex h-12 shrink-0 items-center border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <span className="text-sm font-medium whitespace-nowrap">Miami Dolphins</span>
          </div>
          <NavTicker />
          <div className="flex items-center gap-3 px-3 pr-14">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1200px] px-6 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight">
                Command Center
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Consumer intelligence overview · March 30, 2026
              </p>
            </div>

            <div className="space-y-5">
              <MetricStrip />
              <MorningBriefing />
              <TopOpportunities />
              <AudienceIntelligence />
              <ChannelSignals />
            </div>

            <div className="mt-8 border-t pb-8 pt-4">
              <p className="text-center text-[11px] text-muted-foreground">
                Minerva Intelligence · Synthetic demo data · Built for design review
              </p>
            </div>
          </div>
        </div>
      </SidebarInset>
      <RightSidebar />
    </SidebarProvider>
  );
}
