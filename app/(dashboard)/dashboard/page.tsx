"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const TABS = [
  { id: "discover", label: "Discover", icon: "◎" },
  { id: "people", label: "People", icon: "◔" },
  { id: "audiences", label: "Audiences", icon: "◫" },
  { id: "enrich", label: "Enrich", icon: "↧" },
  { id: "activate", label: "Activate", icon: "✦" },
]

const NAV = ["Home", "People", "Analytics", "Settings"]

function MinervaIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 127 127" fill="none">
      <path fillRule="evenodd" d="M3.22 0.11C8.61-0.12 15.26 0.08 20.75 0.08L54.9 0.08 98.53 0.08C105.88 0.08 113.23 0.05 120.58 0.09 121.84 0.09 125.58 0.18 125.8 1.98 126.28 5.93 126.09 10.2 126.1 14.2L126.1 37.34 126.1 94.18C126.1 103.23 126.1 112.28 126.13 121.32 126.15 124.1 125.88 125.5 123 126.15 120.09 126.36 116.48 126.3 113.53 126.31L95.72 126.27 39.54 126.28 14.76 126.29C10.86 126.29 6.29 126.42 2.4 126 1.57 125.91 0.65 124.64 0.2 123.97-0.15 120.03 0.07 112.64 0.07 108.4L0.08 79.54 0.07 29.33C0.07 21.22 0.07 13.11 0.07 5 0.07 2.45 0.33 0.61 3.22 0.11Z" fill="white"/>
    </svg>
  )
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("audiences")
  const [query, setQuery] = useState("")
  const router = useRouter()

  return (
    <div className="h-full flex flex-col" style={{ background: '#0a0a0c' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 h-12 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <MinervaIcon />
            <span className="text-[13px] font-semibold tracking-tight text-white">Minerva</span>
          </div>
          {NAV.map(n => (
            <button key={n} className="text-[13px] transition-colors hover:text-white"
              style={{ color: n === "Home" ? '#fff' : 'rgba(255,255,255,0.35)', fontWeight: n === "Home" ? 500 : 400 }}>
              {n}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {["☀", "⊞", "✦"].map((ic, i) => (
            <button key={i} className="w-7 h-7 rounded-md flex items-center justify-center text-[13px] transition-colors hover:bg-white/[0.06]"
              style={{ color: 'rgba(255,255,255,0.3)' }}>{ic}</button>
          ))}
        </div>
      </nav>

      {/* Dynamic Island notch hint */}
      <div className="flex justify-center">
        <div className="w-16 h-6 rounded-b-2xl flex items-center justify-center" style={{ background: '#111' }}>
          <MinervaIcon />
        </div>
      </div>

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-12">
        <h1 className="text-[28px] text-white text-center mb-8" style={{ fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
          Build intelligent audience segments.
        </h1>

        {/* Chat input */}
        <div className="w-full max-w-[560px] flex items-center gap-2 px-4 h-12 rounded-full mb-6"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors hover:bg-white/[0.06]"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>+</button>
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent outline-none text-[14px] text-white placeholder:text-white/25" />
          <button className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors hover:bg-white/[0.06]"
            style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>🎤</button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: query ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.08)', color: query ? '#000' : 'rgba(255,255,255,0.2)', fontSize: 14, transition: 'all 0.15s' }}>↑</button>
        </div>

        {/* Tab pills */}
        <div className="flex items-center gap-2">
          {TABS.map(t => (
            <button key={t.id} onClick={() => {
              setActiveTab(t.id)
              if (t.id === 'audiences') router.push('/workspace')
            }}
              className="flex items-center gap-1.5 text-[12px] px-3.5 py-1.5 rounded-full transition-all"
              style={{
                background: activeTab === t.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                border: `1px solid ${activeTab === t.id ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
                color: activeTab === t.id ? '#fff' : 'rgba(255,255,255,0.35)',
                fontWeight: activeTab === t.id ? 500 : 400,
              }}>
              <span style={{ fontSize: 11 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 py-4 text-center">
        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.1)' }}>© 2026 Minerva Intelligence. All rights reserved.</p>
      </div>
    </div>
  )
}
