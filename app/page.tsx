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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Sparkles } from "lucide-react"
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
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          {/* Left: Logo + Trigger + Breadcrumb */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <SidebarTrigger className="-ml-0.5" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-sm font-medium">
                    Miami Dolphins
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Center: placeholder for component you'll send */}
          <div className="flex-1" />

          {/* Right: Status + Nav + Avatar */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              All systems operational
            </span>
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />
            <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
              <Bell className="h-4 w-4" />
            </button>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                SM
              </AvatarFallback>
            </Avatar>
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
