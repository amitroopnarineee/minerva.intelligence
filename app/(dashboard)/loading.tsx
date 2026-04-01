import { Skeleton } from "@/components/ui/skeleton"

export default function HomeLoading() {
  return (
    <div className="flex-1 flex flex-col items-center px-6 pt-16 pb-10">
      <div className="w-full max-w-[1100px] space-y-5">
        {/* Mode pills */}
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
        {/* Headline */}
        <Skeleton className="h-5 w-64 mx-auto" />
        {/* Brief text */}
        <Skeleton className="h-4 w-[480px] mx-auto" />
        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-px rounded-lg overflow-hidden border border-white/[0.06]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white/[0.025] px-4 py-3.5">
              <Skeleton className="h-2 w-14 mb-3" />
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
        {/* Funnel */}
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] p-4">
          <Skeleton className="h-2 w-40 mb-4" />
          <Skeleton className="h-[100px] w-full rounded" />
        </div>
        {/* Chart + table */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 rounded-lg border border-white/[0.06] bg-white/[0.025] p-4">
            <Skeleton className="h-2 w-32 mb-4" />
            <Skeleton className="h-[120px] w-full rounded" />
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] p-4">
            <Skeleton className="h-2 w-24 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
