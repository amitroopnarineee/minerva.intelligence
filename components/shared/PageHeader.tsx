import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

interface PageHeaderProps {
  breadcrumb: string
  title: string
  subtitle: string
  actions?: React.ReactNode
  transparent?: boolean
}

export function PageHeader({ breadcrumb, title, subtitle, actions, transparent = false }: PageHeaderProps) {
  if (transparent) return null

  return (
    <div className="flex h-10 shrink-0 items-center justify-between border-b px-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm font-medium">{breadcrumb}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
