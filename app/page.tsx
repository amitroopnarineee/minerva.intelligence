import { AppSidebar } from "@/components/app-sidebar";
import { RightSidebar } from "@/components/shared/RightSidebar";
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

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex flex-1 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-sm">
                    Miami Dolphins · Consumer Intelligence
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-3 pr-14">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              All systems operational
            </span>
            <span className="text-[11px] text-muted-foreground">
              Updated 2 min ago
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
