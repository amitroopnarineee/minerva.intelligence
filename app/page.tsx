import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { MetricStrip } from "@/components/home/MetricStrip"
import { MorningBriefing } from "@/components/home/MorningBriefing"
import { TopOpportunities } from "@/components/home/TopOpportunities"
import { AudienceIntelligence } from "@/components/home/AudienceIntelligence"
import { ChannelSignals } from "@/components/home/ChannelSignals"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <span className="text-sm text-muted-foreground">
                  Miami Dolphins
                </span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              All systems operational
            </span>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="mx-auto w-full max-w-[1200px]">
            <div className="mb-4">
              <h1 className="text-2xl font-semibold tracking-tight">
                Command Center
              </h1>
              <p className="text-sm text-muted-foreground">
                Consumer intelligence overview · March 30, 2026
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <MetricStrip />
              <MorningBriefing />
              <TopOpportunities />
              <AudienceIntelligence />
              <ChannelSignals />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
