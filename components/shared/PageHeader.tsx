import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { Bell } from "lucide-react"

interface PageHeaderProps {
  breadcrumb: string
  title: string
  subtitle: string
  actions?: React.ReactNode
}

export function PageHeader({ breadcrumb, title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="mn-header flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <div className="mn-header-left flex items-center gap-2">
        <SidebarTrigger className="mn-header-trigger" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="mn-header-breadcrumb text-sm font-medium">
                {breadcrumb}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex-1" />
      <div className="mn-header-right flex items-center gap-1">
        {actions}
        <ThemeToggle />
        <button className="mn-header-bell flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
          <Bell className="h-4 w-4" />
        </button>
        <Avatar className="mn-header-avatar h-8 w-8 cursor-pointer border border-border">
          <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
            SM
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
