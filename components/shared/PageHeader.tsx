import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface PageHeaderProps {
  breadcrumb: string
  title: string
  subtitle: string
  actions?: React.ReactNode
}

export function PageHeader({ breadcrumb, title, subtitle, actions }: PageHeaderProps) {
  return (
    <>
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
        {actions && <div className="mn-header-actions ml-auto flex items-center gap-2">{actions}</div>}
      </header>
      <div className="mn-page-header px-6 pt-6 pb-4">
        <h1 className="mn-page-title text-[28px] font-semibold tracking-tight">{title}</h1>
        <p className="mn-page-subtitle mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </>
  )
}
