import { AppSidebar } from "@/components/app-sidebar"
import { MinervaLogo } from "@/components/shared/MinervaLogo"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
  return (
    <div className="mn-shell">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Header — matches Minerva's simple breadcrumb bar */}
          <header className="mn-header flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <div className="mn-header-left flex items-center gap-2">
              <SidebarTrigger className="mn-header-trigger" />
              <Separator orientation="vertical" className="mn-header-sep mr-2 data-[orientation=vertical]:h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="mn-header-breadcrumb text-sm font-medium">
                      Command Center
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          {/* Content — clean starting point for homepage rebuild */}
          <div className="mn-page flex-1 overflow-y-auto p-6">
            <div className="mn-page-header mb-6">
              <h1 className="mn-page-title text-[28px] font-semibold tracking-tight">
                Command Center
              </h1>
              <p className="mn-page-subtitle mt-1 text-sm text-muted-foreground">
                Your daily consumer intelligence overview.
              </p>
            </div>

            {/* Placeholder grid — ready for homepage modules */}
            <div className="mn-page-content flex flex-col gap-4">
              <div className="mn-placeholder grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="mn-placeholder-card aspect-video rounded-xl bg-muted/50" />
                <div className="mn-placeholder-card aspect-video rounded-xl bg-muted/50" />
                <div className="mn-placeholder-card aspect-video rounded-xl bg-muted/50" />
              </div>
              <div className="mn-placeholder-full min-h-[50vh] flex-1 rounded-xl bg-muted/50" />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
