import { MinervaMenuBar } from "@/components/shared/MinervaMenuBar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-30">
        <MinervaMenuBar />
      </div>
      <main className="h-full overflow-y-auto pt-9">
        {children}
      </main>
    </div>
  )
}
