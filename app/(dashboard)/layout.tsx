import { MinervaMenuBar } from "@/components/shared/MinervaMenuBar"
import { GlobalBackground } from "@/components/shared/GlobalBackground"
import { CommandPalette } from "@/components/shared/CommandPalette"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mn-root h-screen relative overflow-hidden">
      <GlobalBackground />
      <div className="mn-shell relative z-10 h-full flex flex-col">
        <MinervaMenuBar />
        <main className="mn-main flex-1 overflow-y-auto pt-9">
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  )
}
