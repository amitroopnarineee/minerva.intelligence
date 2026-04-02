"use client"

import { MinervaMenuBar } from "@/components/shared/MinervaMenuBar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-black overflow-hidden flex flex-col" style={{ fontFamily: "'Overused Grotesk', ui-sans-serif, system-ui, sans-serif" }}>
      <MinervaMenuBar />
      <div className="flex-1 relative overflow-hidden">
        {children}
      </div>
    </div>
  )
}
