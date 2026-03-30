import { PageHeader } from "@/components/shared/PageHeader"

export default function CommandCenterPage() {
  return (
    <div className="mn-shell">
      <PageHeader
        breadcrumb="Command Center"
        title="Command Center"
        subtitle="Your daily consumer intelligence overview."
      />
      <div className="mn-page flex-1 px-6 pb-6">
        <div className="mn-page-content flex flex-col gap-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/50" />
        </div>
      </div>
    </div>
  )
}
