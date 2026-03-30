import { MinervaMenuBar } from "@/components/shared/MinervaMenuBar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col">
      <MinervaMenuBar />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
