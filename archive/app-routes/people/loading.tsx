import { Skeleton } from "@/components/ui/skeleton"

export default function PeopleLoading() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Skeleton className="h-7 w-20 mb-1" />
          <Skeleton className="h-4 w-64" />
        </div>
        {/* Search + count */}
        <div className="flex items-center justify-between mb-5">
          <Skeleton className="h-9 w-80 rounded-lg" />
          <Skeleton className="h-4 w-20" />
        </div>
        {/* Table */}
        <div className="rounded-lg border border-border/50 bg-card/60 overflow-hidden">
          {/* Header row */}
          <div className="flex items-center gap-4 px-4 py-3 border-b border-border/30">
            {[120, 40, 140, 80, 100, 70, 70].map((w, i) => (
              <Skeleton key={i} className="h-3" style={{ width: w }} />
            ))}
          </div>
          {/* Body rows */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-border/10">
              <div className="flex items-center gap-3 w-[160px]">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
              <Skeleton className="h-3 w-8" />
              <div className="space-y-1.5 w-[140px]">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-2.5 w-20" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
