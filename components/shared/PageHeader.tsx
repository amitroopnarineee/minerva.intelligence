import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { UserMenu } from "@/components/shared/UserMenu"
import { NotificationPopover } from "@/components/shared/NotificationPopover"

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
              <BreadcrumbPage className="mn-header-breadcrumb text-sm font-medium">{breadcrumb}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex-1" />
      <div className="mn-header-right flex items-center gap-1">
        {actions}
        <ThemeToggle />
        <NotificationPopover />
        <UserMenu />
      </div>
    </header>
  )
}
