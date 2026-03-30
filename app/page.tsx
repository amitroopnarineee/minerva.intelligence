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
    <div className="mn-shell">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="mn-header flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <div className="mn-header-left flex items-center gap-2">
              <div className="mn-header-logo">
                <MinervaLogo className="h-6 w-6 text-foreground" />
              </div>
              <div className="mn-header-trigger">
                <SidebarTrigger />
              </div>
              <Separator orientation="vertical" className="mn-header-sep mx-1 data-[orientation=vertical]:h-4" />
              <div className="mn-header-breadcrumb">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage className="mn-header-title text-sm font-medium">
                        Miami Dolphins
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
            <div className="mn-header-nav ml-4 hidden sm:block">
              <TopNav />
            </div>
            <div className="mn-header-spacer flex-1" />
            <div className="mn-header-right flex items-center gap-2">
              <button className="mn-header-bell flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                <Bell className="h-4 w-4" />
              </button>
              <Avatar className="mn-header-avatar h-8 w-8 cursor-pointer border border-border">
                <AvatarFallback className="mn-header-avatar-fallback bg-primary/10 text-[11px] font-semibold text-primary">
                  SM
                </AvatarFallback>
              </Avatar>
            </div>
          </header>

          <div className="mn-page flex-1 overflow-y-auto p-6">
            <div className="mn-page-header mb-6">
              <h1 className="mn-page-title text-2xl font-semibold tracking-tight">Command Center</h1>
              <p className="mn-page-subtitle text-sm text-muted-foreground">Consumer intelligence overview · March 30, 2026</p>
            </div>
            <div className="mn-page-content flex flex-col gap-4">
              <div className="mn-section-kpi"><MetricStrip /></div>
              <div className="mn-section-briefing"><MorningBriefing /></div>
              <div className="mn-section-opps"><TopOpportunities /></div>
              <div className="mn-section-audience"><AudienceIntelligence /></div>
              <div className="mn-section-channels"><ChannelSignals /></div>
            </div>
            <div className="mn-page-footer mt-8 border-t pb-8 pt-4">
              <p className="mn-page-footer-text text-center text-[11px] text-muted-foreground">
                Minerva Intelligence · Synthetic demo data · Built for design review
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
