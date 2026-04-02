"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button"
import React from 'react'
import dynamic from 'next/dynamic'
const InfiniteGallery = dynamic(() => import('@/components/ui/3d-gallery-photography'), { ssr: false })

import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, Line, LineChart, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/line-charts-6'

/* ── Types ── */
type View = 'home' | 'dashboard' | 'briefing' | 'segments'
type ModalState = 'closed' | 'studio'

/* ── Canvas transition ── */
function useCanvasTransition() {
  const [view, setView] = useState<View>('home')
  const [transitioning, setTransitioning] = useState(false)
  const navigateTo = useCallback((next: View) => {
    setTransitioning(true)
    setTimeout(() => { setView(next); setTransitioning(false) }, 280)
  }, [])
  return { view, transitioning, navigateTo }
}

/* ── Minerva Logo ── */
function MinervaLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 127 127" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M3.22 0.11C8.61-0.12 15.26 0.08 20.75 0.08L54.9 0.08 98.53 0.08C105.88 0.08 113.23 0.05 120.58 0.09 121.84 0.09 125.58 0.18 125.8 1.98 126.28 5.93 126.09 10.2 126.1 14.2L126.1 37.34 126.1 94.18C126.1 103.23 126.1 112.28 126.13 121.32 126.15 124.1 125.88 125.5 123 126.15 120.09 126.36 116.48 126.3 113.53 126.31L95.72 126.27 39.54 126.28 14.76 126.29C10.86 126.29 6.29 126.42 2.4 126 1.57 125.91 0.65 124.64 0.2 123.97-0.15 120.03 0.07 112.64 0.07 108.4L0.08 79.54 0.07 29.33C0.07 21.22 0.07 13.11 0.07 5 0.07 2.45 0.33 0.61 3.22 0.11ZM115.3 86.82C115.87 82.46 115.52 77.68 115.58 73.25 115.6 71.61 115.47 69.94 115.63 68.3L86.68 68.28C82.42 68.28 74.9 68.04 70.84 68.34 69.32 70.25 77.8 76.34 79.36 77.24 88.28 82.39 98.73 85.06 108.94 86.08 110.92 86.27 113.37 86.73 115.3 86.82ZM115.55 29.13C115.6 23.31 115.73 16.79 115.57 11.01 114.95 11.05 113.89 11.07 113.31 11.17 98.51 13.62 86.43 20.88 77.77 33.25 77.04 34.31 74.49 37.61 75.65 38.74 76.2 38.85 76.67 38.56 77.2 38.31 78.75 37.5 80.36 36.88 81.97 36.2 92.91 31.55 103.82 30.28 115.55 29.13ZM10.7 97.27C10.78 101.24 10.8 105.21 10.77 109.18 10.77 110.44 10.47 114.44 11.2 115.25 24.13 114.17 36.2 107.41 44.74 97.78 46.16 96.17 51.73 89.38 51.23 87.4 50.98 87.23 51.04 87.23 50.76 87.2 43.01 90.78 35.47 93.75 26.97 95.12 23.64 95.64 20.29 96.11 16.94 96.51 15.07 96.73 12.49 96.95 10.7 97.27Z" fill="white"/>
    </svg>
  )
}

/* ══════════════════════════════════════════════════════════
   TYPEWRITER + HELPERS
   ══════════════════════════════════════════════════════════ */
const NUMBER_CHUNKS = ['$242K', '4.0x', '3 actions ready.', '84%', '2,400', 'Francis Mauigoa', 'pick #11', '1,872']
const SHIMMER_NAMES = new Set(['Francis Mauigoa', 'pick #11'])

function useTypewriter(text: string, active: boolean, speed = 25) {
  const [segments, setSegments] = useState<{text:string,type:'char'|'num'|'warm'}[]>([])
  const [done, setDone] = useState(false)
  const [cursorVis, setCursorVis] = useState(true)

  useEffect(() => {
    if (!active) { setSegments([]); setDone(false); setCursorVis(true); return }
    setSegments([]); setDone(false); setCursorVis(true)

    // Parse chunks
    const chunks: {text:string,type:'char'|'num'|'warm'}[] = []
    let r = text
    while (r.length > 0) {
      let found = false
      for (const nc of NUMBER_CHUNKS) {
        if (r.startsWith(nc)) {
          chunks.push({ text: nc, type: nc === '3 actions ready.' ? 'warm' : 'num' })
          r = r.slice(nc.length); found = true; break
        }
      }
      if (!found) { chunks.push({ text: r[0], type: 'char' }); r = r.slice(1) }
    }

    // Pre-compute timeline: when each chunk should appear (ms from start)
    const timeline: number[] = []
    let t = 0
    for (const ch of chunks) {
      timeline.push(t)
      if (ch.type === 'num' || ch.type === 'warm') t += 180
      else { const c = ch.text; t += c === '.' ? 180 : c === ',' ? 100 : c === '\u2014' || c === ':' ? 120 : c === ' ' ? 15 : speed }
    }

    let cancelled = false
    let lastCount = 0
    const start = performance.now()

    function frame(now: number) {
      if (cancelled) return
      const elapsed = now - start
      let count = 0
      for (let i = 0; i < timeline.length; i++) { if (timeline[i] <= elapsed) count = i + 1; else break }
      if (count !== lastCount) { lastCount = count; setSegments(chunks.slice(0, count)) }
      if (count >= chunks.length) { setDone(true); setTimeout(() => { if (!cancelled) setCursorVis(false) }, 200); return }
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
    return () => { cancelled = true }
  }, [active, text, speed])
  return { segments, done, cursorVis }
}

function useSimpleTyper(text: string, active: boolean, speed = 20) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!active) { setDisplayed(""); setDone(false); return }
    setDisplayed(""); setDone(false)

    // Pre-compute timeline
    const timeline: number[] = []
    let t = 0
    for (let i = 0; i < text.length; i++) {
      timeline.push(t)
      const ch = text[i]
      t += ch === '.' ? 180 : ch === ',' ? 100 : ch === '\u2014' || ch === ':' ? 120 : ch === ' ' ? 12 : speed
    }

    let cancelled = false
    let lastCount = 0
    const start = performance.now()

    function frame(now: number) {
      if (cancelled) return
      const elapsed = now - start
      let count = 0
      for (let i = 0; i < timeline.length; i++) { if (timeline[i] <= elapsed) count = i + 1; else break }
      if (count !== lastCount) { lastCount = count; setDisplayed(text.slice(0, count)) }
      if (count >= text.length) { setDone(true); return }
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
    return () => { cancelled = true }
  }, [active, text, speed])
  return { displayed, done }
}

function TypedText({ segments, cursorVis, done }: { segments: {text:string,type:'char'|'num'|'warm'}[]; cursorVis: boolean; done: boolean }) {
  return (
    <span>
      {segments.map((s, i) => {
        if (s.type === 'num') return <span key={i} className={`animate-number-pop ${SHIMMER_NAMES.has(s.text) ? 'shimmer-link' : ''}`} style={{ color: '#fff', fontWeight: 500 }}>{s.text}</span>
        if (s.type === 'warm') return <span key={i} className="animate-number-pop" style={{ color: 'rgba(255,230,180,0.65)' }}>{s.text}</span>
        return <span key={i} style={{ color: 'rgba(255,255,255,0.85)' }}>{s.text}</span>
      })}
      {cursorVis && <span className={done ? 'animate-cursor-fade' : 'animate-blink'} style={{ color: 'rgba(255,255,255,0.5)' }}>|</span>}
    </span>
  )
}

function Dots({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <div className="flex items-center gap-1.5 py-3">
      <div className="w-1 h-1 rounded-full animate-dot-1" style={{ background: 'rgba(255,255,255,0.3)' }} />
      <div className="w-1 h-1 rounded-full animate-dot-2" style={{ background: 'rgba(255,255,255,0.3)' }} />
      <div className="w-1 h-1 rounded-full animate-dot-3" style={{ background: 'rgba(255,255,255,0.3)' }} />
    </div>
  )
}


function PlatformIcon({ name }: { name: string }) {
  const colors: Record<string,string> = { Meta: '#0668E1', Klaviyo: '#28B446' }
  return <span className="inline-flex items-center justify-center w-4 h-4 rounded-[3px] mr-1.5 text-[7px] font-bold shrink-0" style={{ background: colors[name] || '#555', color: '#fff' }}>{name[0]}</span>
}

const CARD = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 18px' } as const
const LBL = { fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.22)' }
const CONN = { fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: '16px 0 12px 0' }

/* ══════════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════════ */
const METRICS = [
  { label: "Revenue", value: "$242K", prev: "$225K", pct: "+7.6%", up: true, data: [
    { m: "May", v: 180 }, { m: "Jun", v: 195 }, { m: "Jul", v: 188 }, { m: "Aug", v: 210 },
    { m: "Sep", v: 205 }, { m: "Oct", v: 198 }, { m: "Nov", v: 215 }, { m: "Dec", v: 220 },
    { m: "Jan", v: 208 }, { m: "Feb", v: 225 }, { m: "Mar", v: 230 }, { m: "Apr", v: 242 },
  ]},
  { label: "ROAS", value: "4.0x", prev: "3.7x", pct: "+8.3%", up: true, data: [
    { m: "May", v: 2.8 }, { m: "Jun", v: 3.0 }, { m: "Jul", v: 2.9 }, { m: "Aug", v: 3.2 },
    { m: "Sep", v: 3.1 }, { m: "Oct", v: 3.3 }, { m: "Nov", v: 3.4 }, { m: "Dec", v: 3.5 },
    { m: "Jan", v: 3.3 }, { m: "Feb", v: 3.7 }, { m: "Mar", v: 3.8 }, { m: "Apr", v: 4.0 },
  ]},
  { label: "Conv Rate", value: "3.9%", prev: "3.6%", pct: "+8.3%", up: true, data: [
    { m: "May", v: 2.8 }, { m: "Jun", v: 3.1 }, { m: "Jul", v: 2.6 }, { m: "Aug", v: 3.3 },
    { m: "Sep", v: 2.9 }, { m: "Oct", v: 3.5 }, { m: "Nov", v: 3.0 }, { m: "Dec", v: 3.2 },
    { m: "Jan", v: 3.4 }, { m: "Feb", v: 3.6 }, { m: "Mar", v: 3.5 }, { m: "Apr", v: 3.9 },
  ]},
  { label: "Match Rate", value: "62%", prev: "70.1%", pct: "-11.6%", up: false, data: [
    { m: "May", v: 78 }, { m: "Jun", v: 76 }, { m: "Jul", v: 75 }, { m: "Aug", v: 73 },
    { m: "Sep", v: 74 }, { m: "Oct", v: 72 }, { m: "Nov", v: 70 }, { m: "Dec", v: 69 },
    { m: "Jan", v: 68 }, { m: "Feb", v: 70 }, { m: "Mar", v: 65 }, { m: "Apr", v: 62 },
  ]},
]

// Daily data for the big chart (18 days)
const DAILY_DATA = [
  { date: '2026-03-16', revenue: 180, roas: 2.8, conv: 2.8, match: 78 },
  { date: '2026-03-17', revenue: 195, roas: 3.0, conv: 3.1, match: 76 },
  { date: '2026-03-18', revenue: 188, roas: 2.9, conv: 2.6, match: 75 },
  { date: '2026-03-19', revenue: 210, roas: 3.2, conv: 3.3, match: 73 },
  { date: '2026-03-20', revenue: 225, roas: 3.4, conv: 3.5, match: 74 },
  { date: '2026-03-21', revenue: 198, roas: 3.1, conv: 2.9, match: 72 },
  { date: '2026-03-22', revenue: 215, roas: 3.3, conv: 3.2, match: 70 },
  { date: '2026-03-23', revenue: 230, roas: 3.5, conv: 3.4, match: 69 },
  { date: '2026-03-24', revenue: 208, roas: 3.2, conv: 3.0, match: 68 },
  { date: '2026-03-25', revenue: 220, roas: 3.4, conv: 3.3, match: 70 },
  { date: '2026-03-26', revenue: 235, roas: 3.6, conv: 3.5, match: 67 },
  { date: '2026-03-27', revenue: 240, roas: 3.7, conv: 3.6, match: 66 },
  { date: '2026-03-28', revenue: 228, roas: 3.5, conv: 3.4, match: 65 },
  { date: '2026-03-29', revenue: 218, roas: 3.3, conv: 3.2, match: 64 },
  { date: '2026-03-30', revenue: 232, roas: 3.6, conv: 3.5, match: 63 },
  { date: '2026-03-31', revenue: 238, roas: 3.8, conv: 3.7, match: 62 },
  { date: '2026-04-01', revenue: 242, roas: 4.0, conv: 3.9, match: 62 },
]

const METRIC_KEYS: Record<string, { dataKey: string; color: string; format: (v: number) => string }> = {
  Revenue: { dataKey: 'revenue', color: 'var(--color-teal-500, #14b8a6)', format: (v) => `$${v}K` },
  ROAS: { dataKey: 'roas', color: 'var(--color-violet-500, #8b5cf6)', format: (v) => `${v.toFixed(1)}x` },
  'Conv Rate': { dataKey: 'conv', color: 'var(--color-lime-500, #84cc16)', format: (v) => `${v.toFixed(1)}%` },
  'Match Rate': { dataKey: 'match', color: 'var(--color-sky-500, #0ea5e9)', format: (v) => `${v}%` },
}

const briefingChartConfig = {
  revenue: { label: 'Revenue', color: 'var(--color-teal-500, #14b8a6)' },
  roas: { label: 'ROAS', color: 'var(--color-violet-500, #8b5cf6)' },
  conv: { label: 'Conv Rate', color: 'var(--color-lime-500, #84cc16)' },
  match: { label: 'Match Rate', color: 'var(--color-sky-500, #0ea5e9)' },
} satisfies ChartConfig
const CAMPAIGNS = [
  { name: "Season Ticket Renewals", platform: "Klaviyo", spend: "$142K", roas: "5.2x", conv: "312", up: true },
  { name: "Premium Suites Spring", platform: "Meta", spend: "$89K", roas: "3.8x", conv: "87", up: true },
  { name: "Family Ticket Bundle", platform: "Meta", spend: "$51K", roas: "4.1x", conv: "204", up: true },
  { name: "New Fan Acquisition", platform: "Meta", spend: "$79K", roas: "2.4x", conv: "156", up: false },
  { name: "Lapsed Buyer Win-Back", platform: "Klaviyo", spend: "$29K", roas: "4.6x", conv: "89", up: true },
]
const FUNNEL = [
  { label: "Reached", value: "48.2K", pct: 100 },
  { label: "Engaged", value: "12.8K", pct: 26.5 },
  { label: "Converted", value: "3.4K", pct: 7.0 },
  { label: "Revenue", value: "$242K", pct: 3.5 },
]
const TAGLINES = ["Clarity beyond scale", "Patterns in infinite data", "Meaning in every profile", "Intelligence in boundless reach"]

const GALLERY_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1638378943379-f9c64b6612e4?w=600&auto=format&fit=crop&q=60', alt: 'Football helmet' },
  { src: 'https://images.unsplash.com/photo-1747561502595-871265f5503b?w=600&auto=format&fit=crop&q=60', alt: 'Football jersey' },
  { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60', alt: 'Portrait 1' },
  { src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=60', alt: 'Portrait 2' },
  { src: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=600&auto=format&fit=crop&q=60', alt: 'Portrait 3' },
  { src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=60', alt: 'Portrait 4' },
  { src: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&auto=format&fit=crop&q=60', alt: 'Abstract' },
  { src: 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=600&auto=format&fit=crop&q=60', alt: 'Sky' },
]

/* ══════════════════════════════════════════════════════════
   HOME SCREEN
   ══════════════════════════════════════════════════════════ */


function HomeScreen({ onEnter }: { onEnter: () => void }) {
  const [ti, setTi] = useState(0)
  useEffect(() => { const iv = setInterval(() => setTi(p => (p + 1) % TAGLINES.length), 5000); return () => clearInterval(iv) }, [])
  return (
    <div className="mn-modal-backdrop absolute inset-0">
      {/* 3D Gallery background */}
      <div className="absolute inset-0 opacity-30">
        <InfiniteGallery images={GALLERY_IMAGES} speed={0.8} visibleCount={10} className="h-full w-full" />
      </div>
      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10 pointer-events-none">
        <p key={ti} className="text-4xl sm:text-5xl tracking-tight text-white text-center animate-tagline-in mb-10 mix-blend-exclusion" style={{ fontWeight: 400, letterSpacing: '-0.03em' }}>{TAGLINES[ti]}</p>
        <div className="pointer-events-auto"><LiquidMetalButton label="Enter" onClick={onEnter} /></div>
      </div>
      <p className="absolute bottom-6 left-0 right-0 text-center text-[11px] text-white/15 tracking-wide z-10">Minerva<sup className="text-[7px]">™</sup> · Amit Roopnarine</p>
    </div>
  )
}


/* ── ConnCard: types connector, shows card, advances step ── */
function ConnCard({ text, children, delayAfter = 1200, speed = 20, textStyle, playing, onAdvance }: {
  text: string; children: React.ReactNode; delayAfter?: number; speed?: number;
  textStyle?: React.CSSProperties; playing: boolean; onAdvance: () => void
}) {
  const [cardVisible, setCardVisible] = useState(false)
  const { displayed, done: typeDone } = useSimpleTyper(text, true, speed)
  const doneCalledRef = useRef(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeDone && !cardVisible) {
      const t = setTimeout(() => setCardVisible(true), 200)
      return () => clearTimeout(t)
    }
  }, [typeDone, cardVisible])

  useEffect(() => {
    if (cardVisible && !doneCalledRef.current) {
      doneCalledRef.current = true
      const t = setTimeout(() => { if (playing) onAdvance() }, delayAfter)
      return () => clearTimeout(t)
    }
  }, [cardVisible, delayAfter, playing, onAdvance])

  useEffect(() => {
    if (cardVisible && cardRef.current && playing) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [cardVisible, playing])

  return (
    <div>
      {text && <p style={textStyle || CONN}>{displayed}{!typeDone && <span className="animate-blink" style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>}</p>}
      {typeDone && !cardVisible && <Dots show />}
      {cardVisible && <div ref={cardRef} className="animate-card-in">{children}</div>}
    </div>
  )
}

/* ── TypeSection: types text, advances step ── */
function TypeSection({ text, speed = 30, style, delayAfter = 1500, playing, onAdvance }: {
  text: string; speed?: number; style?: React.CSSProperties; delayAfter?: number;
  playing: boolean; onAdvance: () => void
}) {
  const { segments, done, cursorVis } = useTypewriter(text, true, speed)
  const calledRef = useRef(false)
  useEffect(() => {
    if (done && !calledRef.current) {
      calledRef.current = true
      const t = setTimeout(() => { if (playing) onAdvance() }, delayAfter)
      return () => clearTimeout(t)
    }
  }, [done, delayAfter, playing, onAdvance])
  return (
    <div style={style || { fontSize: 18, fontWeight: 400, lineHeight: 1.65, letterSpacing: '-0.01em' }}>
      <TypedText segments={segments} cursorVis={cursorVis} done={done} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   BRIEFING THREAD — THE PRODUCT
   ══════════════════════════════════════════════════════════ */

function BriefingThread({ navigateTo, onOpenStudio, studioSaved, studioDone, onDetail }: { navigateTo: (v: View) => void; onOpenStudio: () => void; studioSaved: boolean; studioDone: boolean; onDetail: (d: DetailData) => void }) {
  const [phase, setPhase] = useState(0) // 0=typing, 1=kpis, 2=signal, 3=complete
  const [typeDone, setTypeDone] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState('Revenue')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-advance phases
  useEffect(() => {
    if (typeDone && phase === 0) {
      setTimeout(() => setPhase(1), 300)
      setTimeout(() => setPhase(2), 800)
      setTimeout(() => setPhase(3), 1400)
    }
  }, [typeDone, phase])

  return (
    <div className="absolute inset-0 flex flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="max-w-[720px] mx-auto px-6 pt-8 pb-40">

          {/* ═══ GREETING (typed) ═══ */}
          <p style={LBL} className="mb-4">✦ APR 1 · BRIEFING</p>
          <TypeSection playing={true} onAdvance={() => setTypeDone(true)}
            text="Morning, Sarah. $242K revenue, 4.0x ROAS. Two actions ready."
            speed={20} delayAfter={200} />

          {/* ═══ STATUS: KPIs + Campaigns (instant after typing) ═══ */}
          {phase >= 1 && (
            <div className="animate-card-in mt-6">
              {/* KPI Strip */}
              <div className="mn-kpi-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                {METRICS.map(m => (
                  <div key={m.label} onClick={() => setSelectedMetric(m.label)}
                    className="mn-kpi-card cursor-pointer transition-all hover:border-white/[0.12] animate-card-in"
                    style={{ background: selectedMetric === m.label ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.025)', border: selectedMetric === m.label ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 0, overflow: 'hidden' }}>
                    {/* Header: label + trend badge */}
                    <div className="mn-kpi-header flex items-center justify-between px-4 pt-3 pb-0">
                      <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{m.label}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: m.up ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', color: m.up ? 'rgba(74,222,128,0.8)' : 'rgba(248,113,113,0.8)', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{m.up ? '↑' : '↓'} {m.pct.replace(/[+-]/, '')}</span>
                    </div>
                    {/* Value + prev */}
                    <div className="mn-kpi-value px-4 pt-1 pb-2">
                      <p className="text-[24px] text-white tabular-nums" style={{ fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{m.value}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }}>from {m.prev}</p>
                    </div>
                    {/* Recharts area sparkline */}
                    <div className="mn-kpi-chart" style={{ padding: 0, height: 48 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={m.data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                          <defs>
                            <linearGradient id={`kpi-grad-${m.label}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={m.up ? 'rgb(74,222,128)' : 'rgb(248,113,113)'} stopOpacity={0.2} />
                              <stop offset="100%" stopColor={m.up ? 'rgb(74,222,128)' : 'rgb(248,113,113)'} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="m" hide />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (!active || !payload?.length) return null
                              return (
                                <div style={{ background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '4px 8px' }}>
                                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{payload[0].payload.m}</p>
                                  <p style={{ fontSize: 12, color: '#fff', fontWeight: 600, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{payload[0].value}</p>
                                </div>
                              )
                            }}
                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                          />
                          <Area
                            type="monotone"
                            dataKey="v"
                            stroke={m.up ? 'rgba(74,222,128,0.6)' : 'rgba(248,113,113,0.6)'}
                            strokeWidth={1.5}
                            fill={`url(#kpi-grad-${m.label})`}
                            dot={false}
                            activeDot={{ r: 3, fill: m.up ? 'rgb(74,222,128)' : 'rgb(248,113,113)', stroke: 'none' }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ))}
              </div>

              {/* ═══ BIG LINE CHART ═══ */}
              <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginBottom: 12 }}>
                <ChartContainer
                  config={briefingChartConfig}
                  className="h-[280px] w-full overflow-visible [&_.recharts-cartesian-axis-tick_text]:fill-white/30 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-white/10"
                  style={{ background: 'transparent' }}
                >
                  <LineChart
                    data={DAILY_DATA}
                    margin={{ top: 20, right: 20, left: 5, bottom: 20 }}
                    style={{ overflow: 'visible' }}
                  >
                    <defs>
                      <pattern id="mnDotGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="10" cy="10" r="0.8" fill="rgba(255,255,255,0.06)" />
                      </pattern>
                      <filter id="mnLineShadow" x="-100%" y="-100%" width="300%" height="300%">
                        <feDropShadow dx="4" dy="6" stdDeviation="25" floodColor={`${METRIC_KEYS[selectedMetric]?.color}40`} />
                      </filter>
                    </defs>
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)' }}
                      tickMargin={10}
                      tickFormatter={(value) => {
                        const d = new Date(value)
                        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)' }}
                      tickMargin={8}
                      tickCount={5}
                      tickFormatter={(value) => METRIC_KEYS[selectedMetric]?.format(value) ?? String(value)}
                    />
                    <ChartTooltip
                      content={({ active, payload }: any) => {
                        if (!active || !payload?.length) return null
                        const mk = METRIC_KEYS[selectedMetric]
                        return (
                          <div style={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', minWidth: 100 }}>
                            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: 0, marginBottom: 2 }}>{selectedMetric}</p>
                            <p style={{ fontSize: 14, color: '#fff', fontWeight: 600, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{mk?.format(payload[0].value)}</p>
                          </div>
                        )
                      }}
                      cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)' }}
                    />
                    <rect x="55" y="-20" width="100%" height="100%" fill="url(#mnDotGrid)" style={{ pointerEvents: 'none' }} />
                    <Line
                      type="monotone"
                      dataKey={METRIC_KEYS[selectedMetric]?.dataKey}
                      stroke={METRIC_KEYS[selectedMetric]?.color}
                      strokeWidth={2}
                      filter="url(#mnLineShadow)"
                      dot={false}
                      activeDot={{ r: 5, fill: METRIC_KEYS[selectedMetric]?.color, stroke: 'rgba(0,0,0,0.5)', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>

              {/* Campaign Table */}
              <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
                <div className="flex px-4 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ ...LBL, flex: 1 }}>Campaign</span>
                  <span style={{ ...LBL, width: 64, textAlign: 'right' }}>Spend</span>
                  <span style={{ ...LBL, width: 48, textAlign: 'right' }}>ROAS</span>
                </div>
                {CAMPAIGNS.map((c, i) => (
                  <div key={c.name} onClick={() => onDetail({ title: c.name, subtitle: c.platform, heroValue: c.roas + ' ROAS', size: "sm", content: <div className="space-y-3"><div className="flex gap-6">{[["ROAS",c.roas],["Conv",c.conv],["Spend",c.spend]].map(([l,v]) => <div key={l}><p style={{...LBL}}>{l}</p><p className="text-[24px] text-white tabular-nums" style={{fontWeight:600}}>{v}</p></div>)}</div></div> })}
                    className="flex items-center px-4 py-2.5 cursor-pointer transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: i < CAMPAIGNS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <span className="flex-1 text-[12px]" style={{ color: 'rgba(255,255,255,0.5)' }}><PlatformIcon name={c.platform} />{c.up ? '\u2197' : '\u2198'} {c.name}</span>
                    <span className="w-16 text-right text-[12px] tabular-nums" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.spend}</span>
                    <span className="w-12 text-right text-[12px] tabular-nums text-white" style={{ fontWeight: 500 }}>{c.roas}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ SIGNAL: Draft Momentum + Actions (instant after KPIs) ═══ */}
          {phase >= 2 && (
            <div className="animate-card-in mt-8">
              <p style={{...LBL, marginBottom: 12}}>✦ SIGNAL</p>

              {/* Signal Card */}
              <div style={{ ...CARD, border: '1px solid rgba(255,255,255,0.1)', marginBottom: 12 }}>
                <p className="text-[15px] text-white mb-1" style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>Draft momentum. Premium buyers responding.</p>
                <p className="text-[12px] mb-3" style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>Mauigoa linked at #11. Protection-first narrative resonating with high-value South FL fans. 2,400 profiles scored 72–99, 78% reachable.</p>
                <div className="flex items-center gap-3">
                  <button onClick={onOpenStudio}
                    className="text-[11px] px-3 py-1.5 rounded-full transition-all hover:bg-white/[0.08]"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}>
                    Explore segment →
                  </button>
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>23 min ago · 87% confidence</span>
                </div>
              </div>

              {/* Recommendations */}
              <div style={CARD}>
                <p style={{...LBL, marginBottom: 10}}>✦ ACTIONS</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] text-white" style={{ fontWeight: 500 }}>Scale Family Ticket Bundle +20%</p>
                      <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Meta Ads · $51K → $61K · Est. +$14K lift</p>
                    </div>
                    <button onClick={() => toast.success('Scaling Family Bundle +20%')} className="text-[10px] px-3 py-1 rounded-full" style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>Execute</button>
                  </div>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.04)' }} />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] text-white" style={{ fontWeight: 500 }}>Activate Seatmap Retargeting</p>
                      <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>900 profiles · Paid channel · Est. +$20K lift</p>
                    </div>
                    <button onClick={() => toast.success('Activating Retargeting Pool')} className="text-[10px] px-3 py-1 rounded-full" style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>Execute</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ EXIT: Social + Navigation (instant after signal) ═══ */}
          {phase >= 3 && (
            <div className="animate-card-in mt-8">
              {/* Social Pulse — compact */}
              <p style={{...LBL, marginBottom: 8}}>✦ SOCIAL PULSE</p>
              <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
                {[
                  { handle: "@ThePhinsider", text: "Achane extension is a priority. Splash Zone 4/1." },
                  { handle: "@ClutchPoints", text: "4 players Dolphins must avoid picking in the 2026 NFL Draft." },
                  { handle: "@DolphinsTalk", text: "Laying the Foundation — Miami has embraced a foundational reset." },
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <span className="text-[10px] shrink-0" style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>{t.handle}</span>
                    <p className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{t.text}</p>
                  </div>
                ))}
              </div>

              {/* Navigation CTAs */}
              <div className="flex items-center justify-center gap-4 mt-10 mb-6">
                <button onClick={() => toast.success('Exporting briefing...')}
                  className="text-[12px] px-5 py-2 rounded-full transition-all hover:bg-white/[0.04]"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                  Export
                </button>
                <button onClick={() => navigateTo('dashboard')}
                  className="text-[12px] px-5 py-2 rounded-full transition-all hover:bg-white/[0.95]"
                  style={{ background: 'rgba(255,255,255,0.88)', color: '#000', fontWeight: 500 }}>
                  Return to Dashboard →
                </button>
              </div>

              <p className="text-center text-[10px]" style={{ color: 'rgba(255,255,255,0.1)' }}>Briefing complete · Updated 8:12 AM EST</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

function AudienceModal({ open, onSave, onClose }: { open: boolean; onSave: (name: string) => void; onClose: () => void }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [actionModal, setActionModal] = useState<'save-segment' | 'launch-campaign' | null>(null)
  const [phase, setPhase] = useState<'select' | 'workspace'>('select')
  const [emptyMode, setEmptyMode] = useState(false)

  // Reset phase when modal opens
  useEffect(() => { if (open) { setPhase('select'); setEmptyMode(false) } }, [open])

  // Listen for postMessage from workspace iframe (Save Segment button)
  useEffect(() => {
    function handleMsg(e: MessageEvent) {
      if (e.data?.type === 'minerva-save-segment') setActionModal('save-segment')
      if (e.data?.type === 'minerva-launch-campaign') setActionModal('launch-campaign')
    }
    window.addEventListener('message', handleMsg)
    return () => window.removeEventListener('message', handleMsg)
  }, [])

  useEffect(() => {
    if (open && phase === 'workspace' && iframeRef.current) {
      const t = setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage({ type: 'minerva-init', mode: 'premium', embedded: true }, '*')
      }, 1000)
      return () => clearTimeout(t)
    }
  }, [open, phase])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] flex flex-col" style={{
      transform: open ? 'translateY(0)' : 'translateY(40px)',
      opacity: open ? 1 : 0,
      transition: 'transform 500ms cubic-bezier(0.22,1,0.36,1), opacity 400ms ease',
      pointerEvents: open ? 'auto' : 'none',
    }}>

      {/* Close pill — matches avatar size and style */}
      <button onClick={onClose}
        className="fixed top-2.5 z-[260] rounded-full bg-white/90 ring-1 ring-white/10 hover:ring-white/30 transition-all flex items-center justify-center"
        style={{ right: 68, width: 25, height: 25, opacity: 0, animation: open ? 'mn-stagger-in 0.4s ease 0.3s forwards' : 'none' }}>
        <span className="text-[9px] font-semibold text-black/60 leading-none">✕</span>
      </button>

      {phase === 'select' ? (
        /* ═══ SEGMENT SELECTOR ═══ */
        <div className="flex-1 flex flex-col items-center justify-center bg-black">
          <div className="w-full max-w-[720px] mx-auto px-6" style={{ opacity: 0, animation: 'mn-stagger-in 0.5s ease 0.15s forwards' }}>
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-5 h-5 rounded bg-white flex items-center justify-center">
                <svg width={12} height={12} viewBox="0 0 127 127" fill="none"><path d="M3.22 0.11C8.61-0.12 15.26 0.08 20.75 0.08L54.9 0.08 98.53 0.08C105.88 0.08 113.23 0.05 120.58 0.09 121.84 0.09 125.58 0.18 125.8 1.98 126.28 5.93 126.09 10.2 126.1 14.2L126.1 37.34 126.1 94.18C126.1 103.23 126.1 112.28 126.13 121.32 126.15 124.1 125.88 125.5 123 126.15 120.09 126.36 116.48 126.3 113.53 126.31L95.72 126.27 39.54 126.28 14.76 126.29C10.86 126.29 6.29 126.42 2.4 126 1.57 125.91 0.65 124.64 0.2 123.97-0.15 120.03 0.07 112.64 0.07 108.4L0.08 79.54 0.07 29.33C0.07 21.22 0.07 13.11 0.07 5 0.07 2.45 0.33 0.61 3.22 0.11Z" fill="black"/></svg>
              </div>
              <span className="text-[14px] text-white" style={{ fontWeight: 500 }}>Minerva</span>
            </div>
            <h2 className="text-[26px] text-white text-center mb-10" style={{ fontWeight: 500, letterSpacing: '-0.02em' }}>Select Segment</h2>
            {/* Hidden file input */}
            <input ref={fileRef} type="file" accept="*" className="hidden" onChange={() => { setPhase('workspace') }} />

            <div className="flex items-center justify-center gap-4">
              {/* Existing audience */}
              <button onClick={() => setPhase('workspace')}
                className="group flex flex-col items-center justify-center rounded-2xl transition-all hover:border-white/[0.15]"
                style={{ width: 200, height: 180, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', opacity: 0, animation: 'mn-stagger-in 0.4s ease 0.2s forwards' }}>
                <div className="w-12 h-12 rounded-full mb-4 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="" className="w-full h-full object-cover" />
                </div>
                <span className="text-[13px] text-white" style={{ fontWeight: 500 }}>Audience 1</span>
                <span className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>268M profiles</span>
              </button>

              {/* Upload */}
              <button onClick={() => fileRef.current?.click()}
                className="group flex flex-col items-center justify-center rounded-2xl transition-all hover:border-white/[0.15]"
                style={{ width: 200, height: 180, background: 'rgba(255,255,255,0.025)', border: '1px dashed rgba(255,255,255,0.08)', opacity: 0, animation: 'mn-stagger-in 0.4s ease 0.3s forwards' }}>
                <span className="text-[20px] mb-3" style={{ color: 'rgba(255,255,255,0.2)' }}>↑</span>
                <span className="text-[13px] text-white" style={{ fontWeight: 500 }}>Upload</span>
                <span className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Any file format</span>
              </button>

              {/* New / Empty segment */}
              <button onClick={() => { setEmptyMode(true); setPhase('workspace') }}
                className="group flex flex-col items-center justify-center rounded-2xl transition-all hover:border-white/[0.15]"
                style={{ width: 200, height: 180, background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.06)', opacity: 0, animation: 'mn-stagger-in 0.4s ease 0.4s forwards' }}>
                <span className="text-[20px] mb-3" style={{ color: 'rgba(255,255,255,0.15)' }}>+</span>
                <span className="text-[13px] text-white" style={{ fontWeight: 500 }}>New Segment</span>
                <span className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Start from scratch</span>
              </button>
            </div>
            <p className="text-center mt-10 text-[11px]" style={{ color: 'rgba(255,255,255,0.15)' }}>Miami Dolphins · Consumer Intelligence · April 2, 2026</p>
          </div>
        </div>
      ) : (
        /* ═══ WORKSPACE ═══ */
        <div className="flex-1 relative bg-black" style={{ opacity: 0, animation: 'mn-stagger-in 0.4s ease forwards' }}>
          <iframe ref={iframeRef} src={emptyMode ? '/workspace.html?empty=1' : '/workspace.html'} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} title="Audience Studio" />
        </div>
      )}

      {/* Action modal overlay */}
      {actionModal && (
        <WorkspaceActionModal
          type={actionModal}
          onCancel={() => setActionModal(null)}
          onConfirm={(name) => { setActionModal(null); onSave(name) }}
        />
      )}

    </div>
  )
}



/* ══════════════════════════════════════════════════════════
   CALENDAR SCREEN — Past Daily Briefings
   ══════════════════════════════════════════════════════════ */
const PAST_BRIEFINGS: Record<number, { headline: string; revenue: string; roas: string; actions: number; signal?: string }> = {
  1: { headline: "Mauigoa at #11 — draft momentum building", revenue: "$242K", roas: "4.0x", actions: 3, signal: "Draft Momentum segment — premium buyers gaining confidence" },
  31: { headline: "Family audience surging after spring break push", revenue: "$238K", roas: "3.9x", actions: 2 },
  30: { headline: "Premium Suite renewals ahead of target", revenue: "$231K", roas: "4.1x", actions: 4, signal: "Lapsed buyer win-back window closing" },
  29: { headline: "Match rate declining — identity graph needs refresh", revenue: "$225K", roas: "3.7x", actions: 2 },
  28: { headline: "Seatmap retargeting pool hit 900 profiles", revenue: "$219K", roas: "3.8x", actions: 3, signal: "New high-propensity cluster in Broward" },
  27: { headline: "Email open rates up 12% after subject line test", revenue: "$214K", roas: "3.6x", actions: 1 },
  26: { headline: "Weekend game day — conversion spike expected", revenue: "$208K", roas: "3.5x", actions: 2 },
  25: { headline: "Sponsor resonance data: luxury narrative winning", revenue: "$202K", roas: "3.4x", actions: 3, signal: "Premium hospitality segment growing 8%" },
}

function CalendarScreen({ navigateTo, onDetail }: { navigateTo: (v: View) => void; onDetail: (d: DetailData) => void }) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const today = 1 // April 1
  const daysInMonth = 30
  const firstDayOffset = 2 // April 2026 starts on Wednesday (0=Sun)

  const days: (number | null)[] = []
  for (let i = 0; i < firstDayOffset; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)
  while (days.length % 7 !== 0) days.push(null)

  const briefing = selectedDay ? PAST_BRIEFINGS[selectedDay] : null

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="max-w-[600px] mx-auto px-6 pt-6 pb-32">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => navigateTo('briefing')} className="text-[12px] px-3 py-1.5 rounded-lg transition-all hover:bg-white/[0.04]" style={{ color: 'rgba(255,255,255,0.4)' }}>← Back to briefing</button>
            <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.22)' }}>✦ APRIL 2026 · BRIEFING CALENDAR</p>
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 mb-8">
            {['S','M','T','W','T','F','S'].map((d, i) => (
              <div key={i} className="text-center text-[9px] uppercase py-2" style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em' }}>{d}</div>
            ))}
            {days.map((day, i) => {
              if (day === null) return <div key={i} />
              const hasBriefing = !!PAST_BRIEFINGS[day]
              const isToday = day === today
              const isSelected = day === selectedDay
              const isFuture = day > today
              return (
                <button key={i} onClick={() => hasBriefing ? setSelectedDay(day) : null}
                  className="aspect-square rounded-lg flex flex-col items-center justify-center transition-all relative"
                  style={{
                    background: isSelected ? 'rgba(255,255,255,0.1)' : isToday ? 'rgba(255,255,255,0.04)' : 'transparent',
                    border: isToday ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                    color: isFuture ? 'rgba(255,255,255,0.1)' : hasBriefing ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)',
                    cursor: hasBriefing ? 'pointer' : 'default',
                  }}>
                  <span className="text-[13px] tabular-nums" style={{ fontWeight: isToday ? 600 : 400 }}>{day}</span>
                  {hasBriefing && <div className="w-1 h-1 rounded-full mt-0.5" style={{ background: isToday ? '#fff' : 'rgba(255,255,255,0.25)' }} />}
                </button>
              )
            })}
          </div>

          {/* Selected briefing preview */}
          {briefing ? (
            <div className="animate-card-in" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '20px 22px' }}>
              <div className="flex items-center justify-between mb-4">
                <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.22)' }}>
                  ✦ {selectedDay === today ? 'TODAY' : `APRIL ${selectedDay}`} · BRIEFING
                </p>
                {selectedDay === today && (
                  <button onClick={() => navigateTo('briefing')} className="text-[11px] px-3 py-1 rounded-full transition-all hover:bg-white/[0.04]" style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                    View full briefing →
                  </button>
                )}
                {selectedDay !== null && selectedDay !== today && (
                  <button onClick={() => onDetail({ title: `April ${selectedDay} Briefing Recap`, subtitle: briefing?.headline, size: 'lg' as ModalSize, content: <div className="space-y-4"><p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{briefing?.headline}. Revenue was {briefing?.revenue} with ROAS at {briefing?.roas}. {briefing?.actions} actions were recommended.{briefing?.signal ? ` Key signal: ${briefing.signal}.` : ''}</p><div className="flex gap-6"><div><p style={{ fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.22)' }}>Revenue</p><p className="text-[24px] text-white tabular-nums" style={{ fontWeight: 600 }}>{briefing?.revenue}</p></div><div><p style={{ fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.22)' }}>ROAS</p><p className="text-[24px] text-white tabular-nums" style={{ fontWeight: 600 }}>{briefing?.roas}</p></div></div>{briefing?.signal && <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 8 }}><p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Signal: {briefing.signal}</p></div>}<p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.15)' }}>Use the Minerva chat to ask questions about this day's data.</p></div> })}
                    className="text-[11px] px-3 py-1 rounded-full transition-all hover:bg-white/[0.04]" style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                    Load full recap →
                  </button>
                )}
              </div>
              <p className="text-[16px] text-white mb-4" style={{ fontWeight: 500, lineHeight: 1.5 }}>{briefing.headline}</p>
              <div className="flex gap-6 mb-4">
                <div>
                  <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.22)' }}>Revenue</p>
                  <p className="text-[20px] text-white tabular-nums" style={{ fontWeight: 600 }}>{briefing.revenue}</p>
                </div>
                <div>
                  <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.22)' }}>ROAS</p>
                  <p className="text-[20px] text-white tabular-nums" style={{ fontWeight: 600 }}>{briefing.roas}</p>
                </div>
                <div>
                  <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.22)' }}>Actions</p>
                  <p className="text-[20px] text-white tabular-nums" style={{ fontWeight: 600 }}>{briefing.actions}</p>
                </div>
              </div>
              {briefing.signal && (
                <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>⚡ {briefing.signal}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.25)' }}>Select a day to view its briefing</p>
              <p className="text-[11px] mt-2" style={{ color: 'rgba(255,255,255,0.12)' }}>Days with briefings have a dot indicator</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


/* ══ DETAIL MODAL (full-screen 2-col with rich right panel) ══ */
type ModalSize = 'sm' | 'md' | 'lg'
type DetailData = { title: string; subtitle?: string; size?: ModalSize; heroValue?: string; content: React.ReactNode } | null

/* ══════════════════════════════════════════════════════════
   DASHBOARD SCREEN
   ══════════════════════════════════════════════════════════ */

const DASH_TABS = [
  { id: "discover", label: "Discover", icon: "◎", title: "Discover patterns in your audience." },
  { id: "people", label: "People", icon: "◔", title: "Explore your customer profiles." },
  { id: "audiences", label: "Audiences", icon: "◫", title: "Build intelligent audience segments." },
  { id: "enrich", label: "Enrich", icon: "↧", title: "Enrich profiles with new data." },
  { id: "activate", label: "Activate", icon: "✦", title: "Activate audiences across channels." },
]

function DashboardScreen({ navigateTo, onOpenStudio }: { navigateTo: (v: View) => void; onOpenStudio: () => void }) {
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState("audiences")

  const handleSubmit = () => {
    const q = query.toLowerCase().trim()
    if (q.includes('briefing') || q.includes('brief') || q.includes('today')) {
      navigateTo('briefing')
    }
  }

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: '#0a0a0c' }}>
      <div className="h-12 shrink-0" />
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-12">
        <h1 key={activeTab} className="text-[28px] text-white text-center mb-8" style={{ fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.3, opacity: 0, animation: 'mn-stagger-in 0.35s ease forwards' }}>
          {DASH_TABS.find(t => t.id === activeTab)?.title}
        </h1>

        {/* Chat input */}
        <div className="w-full max-w-[560px] flex items-center gap-2 px-4 h-12 rounded-full mb-6 mn-stagger-2"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', opacity: 0, animation: 'mn-stagger-in 0.5s ease 0.1s forwards' }}>
          <input value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder={`Try "give me today's briefing"`}
            className="flex-1 bg-transparent outline-none text-[14px] text-white placeholder:text-white/25" />
          <button onClick={handleSubmit}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: query ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.08)', color: query ? '#000' : 'rgba(255,255,255,0.2)', fontSize: 14, transition: 'all 0.15s' }}>↑</button>
        </div>

        {/* Tab pills */}
        <div className="flex items-center gap-2 mn-stagger-3" style={{ opacity: 0, animation: 'mn-stagger-in 0.5s ease 0.2s forwards' }}>
          {DASH_TABS.map(t => (
            <button key={t.id} onClick={() => {
              setActiveTab(t.id)
              if (t.id === 'audiences') onOpenStudio()
            }}
              className="flex items-center gap-1.5 text-[12px] px-3.5 py-1.5 rounded-full transition-all hover:bg-white/[0.06] hover:border-white/[0.12]"
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
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   SAVED SEGMENTS
   ══════════════════════════════════════════════════════════ */

type SavedSegment = { id: string; name: string; count: string; scoreRange: string; tags: string[]; created: string }

const INITIAL_SEGMENTS: SavedSegment[] = [
  { id: 's1', name: 'Season Ticket Renewals', count: '4,200', scoreRange: '80–99', tags: ['58% Male', 'Avg $92K Income', '71% Homeowner'], created: 'Mar 28' },
  { id: 's2', name: 'Lapsed Premium Buyers', count: '1,800', scoreRange: '60–79', tags: ['45% Female', '$110K+ Income', 'South FL'], created: 'Mar 25' },
  { id: 's3', name: 'New Fan Acquisition', count: '12,400', scoreRange: '40–59', tags: ['62% 18–34', 'Mobile-First', 'High Engagement'], created: 'Mar 20' },
]

function SegmentsScreen({ segments, navigateTo }: { segments: SavedSegment[]; navigateTo: (v: View) => void }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: '#0a0a0c' }}>
      <div className="h-14 shrink-0" />
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="max-w-[820px] mx-auto px-6 pt-4 pb-20">
          <div className="flex items-center justify-between mb-8" style={{ opacity: 0, animation: 'mn-stagger-in 0.5s ease forwards' }}>
            <div>
              <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.22)', marginBottom: 6 }}>✦ AUDIENCE SEGMENTS</p>
              <h1 className="text-[24px] text-white" style={{ fontWeight: 500, letterSpacing: '-0.02em' }}>Saved Segments</h1>
            </div>
            <button onClick={() => navigateTo('dashboard')} className="text-[11px] px-4 py-1.5 rounded-full transition-all hover:bg-white/[0.04]" style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
              ← Dashboard
            </button>
          </div>

          {/* Segments table */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', opacity: 0, animation: 'mn-stagger-in 0.5s ease 0.1s forwards' }}>
            {/* Header */}
            <div className="grid px-5 py-3" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              {['Segment', 'Profiles', 'Score Range', 'Created'].map(h => (
                <span key={h} style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.22)' }}>{h}</span>
              ))}
            </div>
            {/* Rows */}
            {segments.map((seg, i) => (
              <div key={seg.id} className="grid items-center px-5 py-4 cursor-pointer transition-colors hover:bg-white/[0.02]"
                style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: i < segments.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', opacity: 0, animation: `mn-stagger-in 0.4s ease ${0.15 + i * 0.06}s forwards` }}>
                <div>
                  <p className="text-[13px] text-white" style={{ fontWeight: 500 }}>{seg.name}</p>
                  <div className="flex gap-2 mt-1">
                    {seg.tags.map(t => (
                      <span key={t} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)' }}>{t}</span>
                    ))}
                  </div>
                </div>
                <span className="text-[13px] tabular-nums" style={{ color: 'rgba(255,255,255,0.5)' }}>{seg.count}</span>
                <span className="text-[13px] tabular-nums" style={{ color: 'rgba(255,255,255,0.5)' }}>{seg.scoreRange}</span>
                <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{seg.created}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   WORKSPACE ACTION MODAL
   ══════════════════════════════════════════════════════════ */

function WorkspaceActionModal({ type, onConfirm, onCancel }: { type: 'save-segment' | 'launch-campaign'; onConfirm: (name: string) => void; onCancel: () => void }) {
  const [name, setName] = useState(type === 'save-segment' ? 'Premium High-Intent Fans' : 'Draft Momentum Push')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  function handleConfirm() {
    setSaving(true)
    setTimeout(() => { setDone(true) }, 800)
    setTimeout(() => { onConfirm(name) }, 1800)
  }

  return (
    <div className="fixed inset-0 z-[280] flex flex-col" style={{ background: 'rgba(6,6,8,0.95)', backdropFilter: 'blur(20px)' }}>
      {/* Full-screen modal container */}
      <div className="flex-1 flex flex-col m-4 sm:m-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', opacity: 0, animation: 'mn-stagger-in 0.4s ease forwards' }}>
        {done ? (
          <div className="flex-1 flex flex-col items-center justify-center" style={{ opacity: 0, animation: 'mn-stagger-in 0.3s ease forwards' }}>
            <div className="text-[40px] mb-4">✦</div>
            <p className="text-[22px] text-white" style={{ fontWeight: 500 }}>{type === 'save-segment' ? 'Segment Saved' : 'Campaign Launched'}</p>
            <p className="text-[13px] mt-3" style={{ color: 'rgba(255,255,255,0.3)' }}>{name}</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 sm:px-10 pt-6 sm:pt-8">
              <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.22)' }}>
                ✦ {type === 'save-segment' ? 'SAVE SEGMENT' : 'LAUNCH CAMPAIGN'}
              </p>
            </div>

            {/* Large centered input */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-10">
              <input value={name} onChange={e => setName(e.target.value)} autoFocus
                className="w-full bg-transparent outline-none text-white text-center"
                style={{ fontSize: 35, fontWeight: 500, height: 'auto', border: 'none', letterSpacing: '-0.02em' }} />
              {type === 'save-segment' && (
                <div className="flex items-center justify-center gap-8 mt-8">
                  <div className="text-center">
                    <span className="text-[10px] block mb-1" style={{ color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Profiles</span>
                    <span className="text-[18px] text-white tabular-nums" style={{ fontWeight: 600 }}>2,400</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] block mb-1" style={{ color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Score Range</span>
                    <span className="text-[18px] text-white tabular-nums" style={{ fontWeight: 600 }}>72–99</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] block mb-1" style={{ color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Reachable</span>
                    <span className="text-[18px] text-white tabular-nums" style={{ fontWeight: 600 }}>78%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Full-width bottom buttons */}
            <div className="flex gap-3 px-6 sm:px-10 pb-6 sm:pb-8">
              <button onClick={onCancel} className="flex-1 text-[13px] py-3.5 rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>Cancel</button>
              <button onClick={handleConfirm} disabled={saving} className="flex-1 text-[13px] py-3.5 rounded-xl transition-all hover:bg-white/[0.95]" style={{ background: saving ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.88)', color: '#000', fontWeight: 500 }}>
                {saving ? '...' : type === 'save-segment' ? 'Save Segment' : 'Launch'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function DetailModal({ data, onClose }: { data: DetailData; onClose: () => void }) {
  const [rightTab, setRightTab] = useState<'detail'|'people'>('detail')
  if (!data) return null

  // Mock metrics for the detail tab
  const metrics = [
    { label: 'Reach', value: '78%', context: 'Email + phone + mail' },
    { label: 'Avg Score', value: '84', context: 'Top 20% of file' },
    { label: 'Homeowners', value: '74%', context: '+19pts vs baseline' },
    { label: 'Est. Lift', value: '+$34K', context: 'If activated this week' },
  ]
  const tableData = [
    ['West Palm Beach', '24', '+62', '↑'],
    ['Boca Raton', '18', '+44', '↑'],
    ['Coral Gables', '12', '+31', '↑'],
    ['Fort Lauderdale', '9', '+18', '→'],
    ['Hollywood', '6', '-4', '↓'],
  ]
  const mockPeople = [
    { name: 'Alejandro Patel', role: 'Account Exec · Doral', score: 99 },
    { name: 'Jessica Mitchell', role: 'Developer · Coral Gables', score: 99 },
    { name: 'Chris Campbell', role: 'Sr VP Ops · Fort Lauderdale', score: 99 },
    { name: 'Sarah Martinez', role: 'Engineer · Boca Raton', score: 99 },
    { name: 'Vanessa Brooks', role: 'Physician · Boca Raton', score: 98 },
    { name: 'Brandon Blackwell', role: 'Engineer · Boca Raton', score: 97 },
    { name: 'Daniel Foster', role: 'Professor · Coral Gables', score: 97 },
    { name: 'Elena Chen', role: 'Financial Advisor · Coral Gables', score: 96 },
  ]

  return (
    <div className="mn-modal-overlay fixed inset-0 z-[150] animate-card-in" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)' }} />
      <div className="mn-modal-container absolute inset-4 top-12 rounded-2xl overflow-hidden flex" onClick={e => e.stopPropagation()}
        style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.06)' }}>

        <button onClick={onClose} className="mn-modal-close absolute top-4 right-4 z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/[0.06]" style={{ color: 'rgba(255,255,255,0.35)' }}>✕</button>

        {/* ═══ LEFT: Intelligence Surface ═══ */}
        <div className="mn-modal-left w-1/2 border-r border-white/[0.06] p-10 flex flex-col gap-6 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>
          <div>
            <h2 className="mn-modal-title text-[22px] font-semibold tracking-tight leading-tight text-white">{data.title}</h2>
            {data.subtitle && <p className="mn-modal-subtitle text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{data.subtitle}</p>}
          </div>

          {data.heroValue && (
            <div>
              <p className="mn-modal-hero text-[56px] text-white" style={{ fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1 }}>{data.heroValue}</p>
              <p className="mn-modal-hero-label text-[10px] uppercase tracking-widest mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>{data.title}</p>
            </div>
          )}

          <div className="mn-modal-headline rounded-xl px-5 py-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {data.content}
          </div>

          <div className="mn-modal-actions mt-auto pt-4">
            <div className="flex items-center gap-2">
              {['Scale +20%', 'Add to campaign', 'Export segment'].map((a, i) => (
                <button key={a} onClick={() => toast.success(a, { description: 'Queued' })}
                  className="text-[10px] px-3 py-1.5 rounded-full transition-all hover:bg-white/[0.05]"
                  style={{ border: '1px solid rgba(255,255,255,0.06)', color: i === 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)', background: i === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)' }}>
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ RIGHT: Detail / People ═══ */}
        <div className="mn-modal-right w-1/2 overflow-hidden flex flex-col">
          <div className="mn-modal-tabs shrink-0 flex items-center gap-1 px-10 pt-6 pb-0">
            {(['detail', 'people'] as const).map(t => (
              <button key={t} onClick={() => setRightTab(t)}
                className="text-[12px] px-3 py-1.5 rounded-lg transition-all capitalize"
                style={{ background: rightTab === t ? 'rgba(255,255,255,0.1)' : 'transparent', color: rightTab === t ? '#fff' : 'rgba(255,255,255,0.35)', fontWeight: rightTab === t ? 500 : 400 }}>
                {t === 'people' ? `People (${mockPeople.length})` : 'Detail'}
              </button>
            ))}
          </div>

          <div className="mn-modal-tab-content flex-1 overflow-y-auto p-10 pr-12" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>
            {rightTab === 'detail' ? (
              <div className="mn-modal-detail-sections space-y-8">
                {/* Projected Outcome */}
                <div className="mn-modal-projected space-y-2.5">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>Projected Outcome</h3>
                  <div className="rounded-lg px-4 py-3" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                    <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>If you act now</p>
                    <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>Estimated +$34K revenue lift this week. Premium suite conversion rate projected to increase 2.1x with targeted Family Bundle + retargeting activation.</p>
                  </div>
                  <div className="rounded-lg px-4 py-3" style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.15)' }}>If you do nothing</p>
                    <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>Window closes in 7–10 days as draft cycle ends. Audience attention decays ~15% per week without activation.</p>
                  </div>
                </div>

                {/* Confidence */}
                <div className="mn-modal-confidence flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="mn-modal-confidence-bar w-24 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="h-full rounded-full" style={{ width: '87%', background: 'rgba(255,255,255,0.25)' }} />
                    </div>
                    <span className="text-[11px] tabular-nums" style={{ color: 'rgba(255,255,255,0.5)' }}>87%</span>
                  </div>
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>High confidence — strong signal density</span>
                </div>

                {/* Key Metrics */}
                <div>
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>Key Metrics</h3>
                  <div className="mn-modal-metrics-grid grid grid-cols-2 gap-2.5">
                    {metrics.map((m, i) => (
                      <div key={i} className="rounded-lg px-3.5 py-3" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{m.label}</p>
                        <span className="text-[20px] font-bold tracking-tight text-white">{m.value}</span>
                        <p className="text-[10px] mt-0.5 leading-snug" style={{ color: 'rgba(255,255,255,0.25)' }}>{m.context}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence */}
                <div>
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>Evidence</h3>
                  <p className="mn-modal-evidence text-[13px] leading-[1.7] mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>Draft narrative is driving measurable engagement lift across premium segments. West Palm Beach cluster shows strongest response — homeowner density and income concentration align with Family Bundle targeting.</p>
                  <div className="rounded-lg px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="mn-modal-highlight text-[13px] font-medium leading-snug" style={{ color: 'rgba(255,255,255,0.85)' }}>Protection-first narrative resonates strongest with 45+ homeowners earning $250k+ in South Florida metro.</p>
                  </div>
                </div>

                {/* Data Table */}
                <div>
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>Data</h3>
                  <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                    <table className="mn-modal-data-table w-full text-[12px]">
                      <thead><tr className="mn-modal-data-head" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        {['City', 'Count', 'Delta', ''].map(h => (
                          <th key={h} className="px-3 py-2 text-left text-[10px] uppercase tracking-wider font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {tableData.map((row, ri) => (
                          <tr key={ri} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                            {row.map((cell, ci) => (
                              <td key={ci} className="px-3 py-2" style={{ color: ci === 0 ? 'rgba(255,255,255,0.7)' : ci === 2 ? (cell.startsWith('+') ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)') : 'rgba(255,255,255,0.4)', fontWeight: ci === 0 ? 500 : ci === 2 ? 600 : 400 }}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sources */}
                <div>
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>Sources</h3>
                  <div className="mn-modal-sources flex flex-wrap gap-2">
                    {['Ticketmaster', 'Klaviyo', 'Meta Ads', 'Social Signals', 'CRM'].map(s => (
                      <span key={s} className="text-[10px] px-2.5 py-1 rounded-md inline-flex items-center" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.35)' }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  <table className="mn-modal-table w-full text-[12px]">
                    <thead><tr className="mn-modal-table-head" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <th className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wider font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>Person</th>
                      <th className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wider font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>Propensity</th>
                      <th className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wider font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>Score</th>
                    </tr></thead>
                    <tbody>
                      {mockPeople.map((p, i) => (
                        <tr key={i} className="transition-colors hover:bg-white/[0.02] cursor-pointer" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-medium" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>{p.name.split(' ').map(n=>n[0]).join('')}</div>
                              <div>
                                <p className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{p.name}</p>
                                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{p.role}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-14 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}><div className="h-full rounded-full" style={{ width: `${p.score}%`, background: 'rgba(255,255,255,0.3)' }} /></div>
                              <span className="text-[10px] tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>{p.score}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="text-[12px] tabular-nums font-medium text-white">{p.score}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] mt-3" style={{ color: 'rgba(255,255,255,0.2)' }}>{mockPeople.length} suggested profiles for this context</p>
                <div className="mn-modal-people-actions mt-3 flex items-center gap-2 rounded-lg px-4 py-2.5" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
                  {['Add to segment', 'Send outreach', 'Export CSV'].map(a => (
                    <button key={a} onClick={() => toast.success(a)}
                      className="text-[10px] px-2.5 py-1 rounded-full transition-all hover:bg-white/[0.05]"
                      style={{ border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.02)' }}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


/* ══ MINERVA INLINE CHAT (replaces pause button when paused) ══ */
function MinervaInlineChat({ onResume }: { onResume: () => void }) {
  const [response, setResponse] = useState("")
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const msgs = useRef<{role:string,content:string}[]>([])

  async function send() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput("")
    msgs.current.push({ role: 'user', content: userMsg })
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs.current }),
      })
      const data = await res.json()
      msgs.current.push({ role: 'assistant', content: data.text })
      setResponse(data.text)
    } catch { setResponse("Connection error.") }
    setLoading(false)
  }

  return (
    <div className="animate-card-in w-[420px] max-w-[calc(100vw-32px)]" style={{ background: 'rgba(10,10,12,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, backdropFilter: 'blur(20px)', padding: '10px 12px' }}>
      {/* Response bubble */}
      {response && (
        <div className="mb-2 px-3 py-2 rounded-lg text-[12px]" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
          {response}
        </div>
      )}
      {loading && <div className="flex gap-1.5 py-2 px-1"><div className="w-1 h-1 rounded-full animate-dot-1" style={{ background: 'rgba(255,255,255,0.3)' }} /><div className="w-1 h-1 rounded-full animate-dot-2" style={{ background: 'rgba(255,255,255,0.3)' }} /><div className="w-1 h-1 rounded-full animate-dot-3" style={{ background: 'rgba(255,255,255,0.3)' }} /></div>}
      {/* Input row */}
      <div className="flex gap-2 items-center">
        <MinervaLogo size={12} />
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask Minerva anything..." autoFocus
          className="flex-1 text-[12px] px-3 py-2 rounded-lg bg-transparent outline-none"
          style={{ border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' }} />
        <button onClick={send} className="text-[11px] px-2.5 py-1.5 rounded-lg transition-all hover:bg-white/[0.04]" style={{ color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>→</button>
        <button onClick={onResume} className="text-[11px] px-3 py-1.5 rounded-lg transition-all hover:bg-white/[0.06]" style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', fontWeight: 500 }}>▶ Resume</button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN APP
   ══════════════════════════════════════════════════════════ */
export function MinervaApp() {
  const { view, transitioning, navigateTo } = useCanvasTransition()
  const [modal, setModal] = useState<ModalState>('closed')
  const [detail, setDetail] = useState<DetailData>(null)
  const [studioSaved, setStudioSaved] = useState(false)
  const [studioDone, setStudioDone] = useState(false)
  const [savedSegments, setSavedSegments] = useState<SavedSegment[]>(INITIAL_SEGMENTS)

  // Listen for notch navigation events
  useEffect(() => {
    const handleGoHome = () => { setModal('closed'); navigateTo('home') }
    const handleNavSection = (e: Event) => {
      const section = (e as CustomEvent).detail
      if (section === 'studio') { handleOpenStudio(); return }
      setModal('closed')
      if (section === 'home') navigateTo('home')
      else if (section === 'briefing') navigateTo('briefing')
      else if (section === 'dashboard') navigateTo('dashboard')
      
    }
    window.addEventListener('minerva-go-home', handleGoHome)
    window.addEventListener('minerva-nav-section', handleNavSection)
    return () => {
      window.removeEventListener('minerva-go-home', handleGoHome)
      window.removeEventListener('minerva-nav-section', handleNavSection)
    }
  }, [navigateTo])

  function handleOpenStudio() { setModal('studio') }
  function handleSaveStudio(name: string) {
    setStudioSaved(true)
    const newSeg: SavedSegment = { id: `s${Date.now()}`, name, count: '2,400', scoreRange: '72–99', tags: ['78% Reachable', 'South FL', 'Premium'], created: 'Apr 2' }
    setSavedSegments(prev => [newSeg, ...prev])
    setModal('closed')
    setStudioDone(true)
    navigateTo('segments')
  }
  function handleCloseStudio() { setModal('closed'); setStudioDone(true) }

  return (
    <div className="h-full flex flex-col relative">


      {/* Canvas — transitions between views */}
      <div className="flex-1 relative" style={{
        opacity: transitioning ? 0 : (modal === 'studio' ? 0.3 : 1),
        filter: transitioning ? 'blur(6px)' : (modal === 'studio' ? 'blur(8px)' : 'blur(0)'),
        transform: transitioning ? 'scale(0.98)' : 'scale(1)',
        transition: 'opacity 300ms ease, filter 300ms ease, transform 250ms ease-out',
      }}>
        {view === 'home' && <HomeScreen onEnter={() => navigateTo('dashboard')} />}
        {view === 'dashboard' && <DashboardScreen navigateTo={navigateTo} onOpenStudio={handleOpenStudio} />}
        {view === 'briefing' && <BriefingThread navigateTo={navigateTo} onOpenStudio={handleOpenStudio} studioSaved={studioSaved} studioDone={studioDone} onDetail={setDetail} />}
        {view === 'segments' && <SegmentsScreen segments={savedSegments} navigateTo={navigateTo} />}
      </div>

      {/* Detail Modal */}
      <DetailModal data={detail} onClose={() => setDetail(null)} />

      {/* Audience Studio Modal */}
      <AudienceModal open={modal === 'studio'} onSave={handleSaveStudio} onClose={handleCloseStudio} />


    </div>
  )
}
