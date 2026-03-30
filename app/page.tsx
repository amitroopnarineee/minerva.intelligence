import { AppSidebar } from "@/components/app-sidebar"
import { TopNav } from "@/components/shared/TopNav"
import { MinervaLogo } from "@/components/shared/MinervaLogo"
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
import { Bell } from "lucide-react"
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
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <MinervaLogo className="h-6 w-6 text-foreground" />
            <SidebarTrigger />
            <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-4" />
            <span className="text-sm font-medium">Miami Dolphins</span>
          </div>
          <div className="ml-4 hidden sm:block">
            <TopNav />
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
              <Bell className="h-4 w-4" />
            </button>
            <Avatar className="h-8 w-8 cursor-pointer border border-border">
              <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
                SM
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">Command Center</h1>
            <p className="text-sm text-muted-foreground">Consumer intelligence overview · March 30, 2026</p>
          </div>
          <div className="flex flex-col gap-4">
            <MetricStrip />
            <MorningBriefing />
            <TopOpportunities />
            <AudienceIntelligence />
            <ChannelSignals />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
