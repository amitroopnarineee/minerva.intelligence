"use client"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-black overflow-hidden" style={{ fontFamily: "'Overused Grotesk', ui-sans-serif, system-ui, sans-serif" }}>
      {children}
    </div>
  )
}
