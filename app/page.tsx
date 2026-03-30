import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
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
import { SystemTrust } from "@/components/home/SystemTrust";

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border-subtle transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex flex-1 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-text-secondary text-sm">
                    Miami Dolphins · Consumer Intelligence
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-3 px-4">
            <span className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
              <span className="h-1.5 w-1.5 rounded-full bg-positive" />
              All systems operational
            </span>
            <span className="text-[11px] text-text-tertiary">
              Updated 2 min ago
            </span>
          </div>
        </header>

        {/* Main content */}
        <div className="mx-auto w-full max-w-[1200px] px-6 py-6">
          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-[26px] font-semibold tracking-tight text-text-primary">
              Command Center
            </h1>
          </div>

          {/* Modules */}
          <div className="space-y-5">
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
      </SidebarInset>
    </SidebarProvider>
  );
}
