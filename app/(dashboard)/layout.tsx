"use client"

import { MinervaMenuBar } from "@/components/shared/MinervaMenuBar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-black overflow-hidden" style={{ fontFamily: "'Overused Grotesk', ui-sans-serif, system-ui, sans-serif" }}>
      <MinervaMenuBar />
      {children}
    </div>
  )
}
