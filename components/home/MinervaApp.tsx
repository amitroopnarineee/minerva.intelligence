"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button"
import React from 'react'

/* ── Types ── */
type View = 'home' | 'briefing' | 'calendar'
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

function Sparkline({ d }: { d: string }) {
  return <svg width="60" height="20" viewBox="0 0 60 20" fill="none"><path d={d} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" fill="none" /></svg>
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
  { label: "REVENUE", value: "$242K", trend: "↗ 7.6%", spark: "M0,15 L8,13 L16,14 L24,10 L32,8 L40,11 L48,6 L56,3 L60,4" },
  { label: "ROAS", value: "4.0x", trend: "↗ 8.3%", spark: "M0,16 L8,15 L16,13 L24,14 L32,11 L40,9 L48,7 L56,5 L60,4" },
  { label: "CONV RATE", value: "3.9%", trend: "↗ 8.3%", spark: "M0,12 L8,15 L16,10 L24,13 L32,8 L40,11 L48,6 L56,9 L60,5" },
  { label: "MATCH RATE", value: "62%", trend: "↘ 11.6%", spark: "M0,5 L8,6 L16,4 L24,7 L32,9 L40,8 L48,11 L56,13 L60,14", dim: true },
]
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

/* ══════════════════════════════════════════════════════════
   HOME SCREEN
   ══════════════════════════════════════════════════════════ */


function HomeScreen({ onEnter }: { onEnter: () => void }) {
  const [ti, setTi] = useState(0)
  useEffect(() => { const iv = setInterval(() => setTi(p => (p + 1) % TAGLINES.length), 5000); return () => clearInterval(iv) }, [])
  return (
    <div className="absolute inset-0">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.03) 0%, transparent 70%)' }} />
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
  const [step, setStep] = useState(-1)
  const [playing, setPlaying] = useState(true)
  const [launchState, setLaunchState] = useState<'idle'|'launching'|'launched'>('idle')
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setStep(0) }, [])

  // Advance past segment card when studio modal closes
  useEffect(() => {
    if (studioDone && step === 3) {
      setTimeout(() => setStep(studioSaved ? 4 : 5), 500)
    }
  }, [studioDone, step, studioSaved])

  // Auto-scroll
  useEffect(() => {
    const sc = scrollRef.current
    if (!sc || !playing) return
    const ob = new MutationObserver(() => { sc.scrollTop = sc.scrollHeight - sc.clientHeight })
    ob.observe(sc, { childList: true, subtree: true, characterData: true })
    return () => ob.disconnect()
  }, [playing])

  const onAdvance = useCallback(() => setStep(s => s + 1), [])
  const isComplete = step >= 12

  return (
    <div className="absolute inset-0 flex flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="max-w-[720px] mx-auto px-6 pt-6 pb-40">
          <p style={LBL} className="mb-6">✦ APR 1 · BRIEFING</p>

          {/* S0: Greeting */}
          {step >= 0 && (
            <TypeSection playing={playing} onAdvance={onAdvance} text="Morning, Sarah. Revenue is $242K with ROAS at 4.0x. 3 actions ready." speed={25} delayAfter={800} />
          )}

          {/* S1: Pivot — typed slowly, brighter */}
          {step >= 1 && (
            <TypeSection playing={playing} onAdvance={onAdvance} text="Something interesting happened overnight." speed={30} delayAfter={1500}
              style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: 'rgba(255,255,255,0.75)', marginTop: 24 }} />
          )}

          {/* S2: Pivot continued */}
          {step >= 2 && (
            <TypeSection playing={playing} onAdvance={onAdvance} text="Dolphins heavily linked to Francis Mauigoa at pick #11. Draft narrative gaining traction — fan confidence in long-term direction rising. Protection-first strategy resonating with premium buyers." speed={30} delayAfter={1000}
              style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: 'rgba(255,255,255,0.75)' }} />
          )}

          {/* S3: Segment card — pauses for Audience Studio */}
          {step >= 3 && (
            <ConnCard playing={playing} onAdvance={onAdvance} text="I ran a signal analysis across your file and surfaced a segment you should look at: 2,400 current Giants fans in the South Florida market who match our high-propensity profile. These are people who could become Dolphins fans — their favorite quarterback just moved here." speed={30} delayAfter={99999} textStyle={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: '16px 0 12px 0' }}>
              <div style={{ ...CARD, border: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={LBL} className="mb-3">✦ SUGGESTED SEGMENT</p>
                <p className="text-[16px] text-white mb-1" style={{ fontWeight: 500 }}>Draft Momentum</p>
                <p className="text-[12px] mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>2,400 profiles · scores 72–99 · 78% reachable</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {['Giants fan', 'South FL', '45+', '$250k+ HHI', 'Ticketmaster active'].map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded" style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>{t}</span>
                  ))}
                </div>
                <button onClick={onOpenStudio}
                  className="h-8 px-4 rounded-full text-[12px] transition-all hover:bg-white/[0.08]"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}>
                  View in Audience Studio →
                </button>
                <p className="text-[10px] mt-3" style={{ color: 'rgba(255,255,255,0.2)' }}>⏱ 23 min ago · 87% confidence</p>
              </div>
            </ConnCard>
          )}

          {/* S4: Campaign Activation Card (only after studio save) */}
          {step >= 4 && studioSaved && (
            <ConnCard playing={playing} onAdvance={() => {}} text="Segment saved: Draft Momentum — 2,400 profiles. Here's the campaign I've prepared." delayAfter={99999}>
              <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '20px 22px', overflow: 'hidden' }}>
                <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.22)', marginBottom: 16 }}>CAMPAIGN READY TO LAUNCH</p>
                <p style={{ fontSize: 18, fontWeight: 500, color: '#fff', letterSpacing: '-0.01em', marginBottom: 20 }}>Protect the Future</p>
                {/* Three big stat boxes */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
                  {[{ value: '1,872', label: 'RECIPIENTS' }, { value: '89%', label: 'EST. OPEN RATE' }, { value: '$34K', label: 'EST. REVENUE LIFT' }].map(stat => (
                    <div key={stat.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 8, padding: '12px 14px', textAlign: 'center' }}>
                      <p style={{ fontSize: 22, fontWeight: 600, color: '#fff', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{stat.value}</p>
                      <p style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.22)', marginTop: 4 }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
                {/* Channel mix */}
                <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.22)', marginBottom: 8 }}>CHANNEL MIX</p>
                <div style={{ marginBottom: 20 }}>
                  {[{ name: 'Email', pct: 78 }, { name: 'Retargeting', pct: 12 }, { name: 'Direct Mail', pct: 10 }].map(ch => (
                    <div key={ch.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 11 }}>
                      <span style={{ width: 72, color: 'rgba(255,255,255,0.35)', textAlign: 'right' }}>{ch.name}</span>
                      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${ch.pct}%`, height: '100%', background: 'rgba(255,255,255,0.25)', borderRadius: 2, animation: 'bar-grow 400ms ease both' }} />
                      </div>
                      <span style={{ width: 32, textAlign: 'right', fontSize: 10, color: 'rgba(255,255,255,0.22)', fontVariantNumeric: 'tabular-nums' }}>{ch.pct}%</span>
                    </div>
                  ))}
                </div>
                {/* Creative preview */}
                <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.22)', marginBottom: 8 }}>CREATIVE PREVIEW</p>
                <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 8, padding: '16px 18px', marginBottom: 16 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>Your QB just joined the Dolphins.</p>
                  <p style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>Welcome to the family.</p>
                  <div style={{ display: 'inline-block', padding: '8px 20px', borderRadius: 6, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>20% OFF YOUR FIRST GAME →</div>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)', marginTop: 12 }}>Hard Rock Stadium · Miami Gardens, FL</p>
                </div>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginBottom: 16 }}>⏱ Optimized for Tuesday 9:14 AM EST · Best open rate window for this segment</p>
                {/* CTA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {launchState === 'launched' ? (
                    <div style={{ height: 44, padding: '0 28px', borderRadius: 100, display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 500 }}>✓ Launched · 1,872 recipients</div>
                  ) : launchState === 'launching' ? (
                    <div className="animate-pulse" style={{ height: 44, padding: '0 28px', borderRadius: 100, display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 500 }}>Launching…</div>
                  ) : (
                    <button onClick={() => { setLaunchState('launching'); toast.success('Campaign launched — tracking begins'); setTimeout(() => { setLaunchState('launched'); if (playing) setTimeout(() => setStep(s => s + 1), 1500) }, 1200) }}
                      style={{ height: 44, padding: '0 28px', borderRadius: 100, background: 'rgba(255,255,255,0.88)', color: '#000', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: "'Overused Grotesk', ui-sans-serif, system-ui, sans-serif", transition: 'all 0.15s ease' }}
                      onMouseEnter={e => (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.95)'}
                      onMouseLeave={e => (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.88)'}>
                      Launch Campaign
                    </button>
                  )}
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Preview · Edit · Schedule</span>
                </div>
              </div>
            </ConnCard>
          )}

          {/* S5: Connector + Minerva Recommends */}
          {step >= 5 && (
            <ConnCard playing={playing} onAdvance={onAdvance} text={studioSaved ? "Now let me walk you through the rest of your morning intelligence." : "Here's your morning intelligence."} delayAfter={1200}>
              <div style={CARD}>
                <p style={LBL} className="mb-2">✦ MINERVA RECOMMENDS</p>
                <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Scale Family Ticket Bundle budget by 20% and activate Seatmap Retargeting Pool (900 profiles). Combined estimated lift: <span style={{ color: 'rgba(255,255,255,0.88)', fontWeight: 500 }}>+$34K</span> revenue this week.
                </p>
                <div className="flex items-center justify-between mt-3">
                  <button onClick={() => onDetail({ title: "Execute 2 Actions", subtitle: "Scaling + Retargeting", size: "sm", content: <div className="space-y-3"><p className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>Minerva will execute both actions:</p><div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 8 }}><p className="text-[12px]" style={{ color: "rgba(255,255,255,0.6)" }}>1. Scale Family Ticket Bundle +20%</p><p className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>Meta Ads · $51K → $61K</p></div><div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 8 }}><p className="text-[12px]" style={{ color: "rgba(255,255,255,0.6)" }}>2. Activate Seatmap Retargeting Pool</p><p className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>900 profiles · Paid channel</p></div></div> })} className="text-[11px] px-3 py-1 rounded-full transition-all hover:bg-white/[0.04]" style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.02)', height: 28 }}>→ Execute both</button>
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>⏱ 12 min ago · 91% confidence</span>
                </div>
              </div>
            </ConnCard>
          )}

          {/* S6: Metrics */}
          {step >= 6 && (
            <ConnCard playing={playing} onAdvance={onAdvance} text="Key metrics this week:" delayAfter={1200}>
              <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
                {METRICS.map((m, i) => (
                  <div key={m.label} onClick={() => onDetail({ title: m.label, subtitle: m.value + " " + m.trend, size: "sm", content: <div><div className="flex items-center gap-4 mb-4"><span className="text-[28px] text-white tabular-nums" style={{ fontWeight: 600 }}>{m.value}</span><span className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>{m.trend}</span></div><div className="mb-4"><Sparkline d={m.spark} /></div><p className="text-[13px] mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>7-day trend. Click any point to drill into hourly breakdown.</p><p className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>Source: Ticketmaster · Klaviyo · Meta · Updated 8:12 AM</p></div> })}
                    className="flex items-center px-[18px] py-3 cursor-pointer transition-colors hover:bg-white/[0.02] animate-card-in"
                    style={{ borderBottom: i < METRICS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', animationDelay: `${i * 120}ms` }}>
                    <span style={{ ...LBL, width: 96 }}>{m.label}</span>
                    <span className="text-[22px] tabular-nums text-white flex-1" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>{m.value}</span>
                    <span className="text-[11px] w-20 text-right" style={{ color: m.dim ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.35)' }}>{m.trend}</span>
                    <div className="ml-4"><Sparkline d={m.spark} /></div>
                  </div>
                ))}
              </div>
            </ConnCard>
          )}

          {/* S7: Funnel */}
          {step >= 7 && (
            <ConnCard playing={playing} onAdvance={onAdvance} text="Here's the funnel:" delayAfter={1200}>
              <div className="flex items-end gap-2">
                {FUNNEL.map((f, i) => (
                  <div key={f.label} className="flex-1 text-center animate-card-in" style={{ animationDelay: `${i * 150}ms` }}>
                    <p className="text-[20px] tabular-nums text-white mb-1" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>{f.value}</p>
                    <div className="mx-auto rounded-sm overflow-hidden" style={{ height: 4, background: 'rgba(255,255,255,0.04)' }}>
                      <div style={{ width: `${f.pct}%`, height: '100%', background: 'rgba(255,255,255,0.2)', animation: 'bar-grow 400ms ease both', animationDelay: `${i * 150}ms` }} />
                    </div>
                    <p className="text-[9px] uppercase tracking-[0.04em] mt-2" style={{ color: 'rgba(255,255,255,0.22)' }}>{f.label}</p>
                  </div>
                ))}
              </div>
            </ConnCard>
          )}

          {/* S8: Chart */}
          {step >= 8 && (
            <ConnCard playing={playing} onAdvance={onAdvance} text="Revenue versus spend, last 7 days:" delayAfter={1500}>
              <div style={{ ...CARD, padding: 16, height: 120 }}>
                <svg viewBox="0 0 300 80" className="w-full h-full">
                  <polyline points="0,60 50,55 100,48 150,42 200,35 250,28 300,20" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                  <polyline points="0,70 50,68 100,65 150,62 200,60 250,58 300,55" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
                  <text x="295" y="18" fill="rgba(255,255,255,0.3)" fontSize="6" textAnchor="end">Revenue</text>
                  <text x="295" y="53" fill="rgba(255,255,255,0.15)" fontSize="6" textAnchor="end">Spend</text>
                </svg>
              </div>
            </ConnCard>
          )}

          {/* S9: Campaigns */}
          {step >= 9 && (
            <ConnCard playing={playing} onAdvance={onAdvance} text="Campaign breakdown:" delayAfter={1500}>
              <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
                <div className="flex px-[18px] py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ ...LBL, flex: 1 }}>Campaign</span>
                  <span style={{ ...LBL, width: 64, textAlign: 'right' }}>Spend</span>
                  <span style={{ ...LBL, width: 56, textAlign: 'right' }}>ROAS</span>
                  <span style={{ ...LBL, width: 56, textAlign: 'right' }}>Conv</span>
                </div>
                {CAMPAIGNS.map((c, i) => (
                  <div key={c.name} onClick={() => onDetail({ title: c.name, subtitle: c.platform + " · " + c.spend + " spend", size: "md", content: <div className="space-y-4"><div className="flex gap-6"><div><p style={{ fontSize: 9, textTransform: "uppercase" as const, letterSpacing: "0.06em", color: "rgba(255,255,255,0.22)" }}>ROAS</p><p className="text-[24px] text-white tabular-nums" style={{ fontWeight: 600 }}>{c.roas}</p></div><div><p style={{ fontSize: 9, textTransform: "uppercase" as const, letterSpacing: "0.06em", color: "rgba(255,255,255,0.22)" }}>Conversions</p><p className="text-[24px] text-white tabular-nums" style={{ fontWeight: 600 }}>{c.conv}</p></div><div><p style={{ fontSize: 9, textTransform: "uppercase" as const, letterSpacing: "0.06em", color: "rgba(255,255,255,0.22)" }}>Spend</p><p className="text-[24px] text-white tabular-nums" style={{ fontWeight: 600 }}>{c.spend}</p></div></div><p className="text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>{c.up ? "Trending positively — consider scaling." : "Underperforming — review targeting."}</p><p className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>Platform: {c.platform} · Updated 8:12 AM</p></div> })}
                    className="flex items-center px-[18px] py-2.5 cursor-pointer transition-colors hover:bg-white/[0.02] animate-card-in"
                    style={{ borderBottom: i < CAMPAIGNS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', animationDelay: `${i * 100}ms` }}>
                    <span className="flex-1 text-[12px] flex items-center" style={{ color: 'rgba(255,255,255,0.5)' }}><PlatformIcon name={c.platform} />{c.up ? '↗' : '↘'} {c.name}</span>
                    <span className="w-16 text-right text-[12px] tabular-nums" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.spend}</span>
                    <span className="w-14 text-right text-[12px] tabular-nums text-white" style={{ fontWeight: 500 }}>{c.roas}</span>
                    <span className="w-14 text-right text-[12px] tabular-nums" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.conv}</span>
                  </div>
                ))}
              </div>
            </ConnCard>
          )}

          {/* S10: Social Pulse */}
          {step >= 10 && (
            <ConnCard playing={playing} onAdvance={onAdvance} text="Here's what fans are saying:" delayAfter={1800}>
              <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
                <div className="px-[18px] py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <p style={LBL}>SOCIAL PULSE · #FINSUP</p>
                </div>
                {[
                  { handle: "@MiamiDolphins", time: "2h", text: "Ready to get to it. Sullivan and Hafley continue offering fans reason to believe." },
                  { handle: "@ThePhinsider", time: "4h", text: "Achane extension is a priority. Splash Zone 4/1." },
                  { handle: "@ClutchPoints", time: "6h", text: "4 players Dolphins must avoid picking in the 2026 NFL Draft." },
                  { handle: "@SportsIllustrated", time: "8h", text: "When the Dolphins signed Malik Willis, they understood they were taking a gamble." },
                  { handle: "@DolphinsTalk", time: "12h", text: "Laying the Foundation — Miami has embraced a foundational reset under the new regime." },
                ].map((t, i) => (
                  <div key={i} className="px-[18px] py-2.5 transition-colors hover:bg-white/[0.02] animate-card-in cursor-pointer"
                    onClick={() => onDetail({ title: t.handle, subtitle: t.time + " ago", size: "sm" as ModalSize, content: <div><p className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{t.text}</p><p className="text-[11px] mt-3" style={{ color: "rgba(255,255,255,0.2)" }}>via X (Twitter) · #FinsUp #MiamiDolphins</p></div> })}
                    style={{ borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none', animationDelay: `${i * 100}ms` }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>{t.handle}</span>
                      <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.15)' }}>{t.time}</span>
                    </div>
                    <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{t.text}</p>
                  </div>
                ))}
              </div>
            </ConnCard>
          )}

          {/* S11: Remaining actions */}
          {step >= 11 && (
            <ConnCard playing={playing} onAdvance={onAdvance} text={studioSaved ? "Two more actions I'd prioritize:" : "Three actions I'd prioritize:"} delayAfter={1500}>
              <div className="space-y-2">
                <p style={LBL} className="mb-2">{studioSaved ? 'TWO MORE ACTIONS' : 'NEXT BEST ACTIONS'}</p>
                {[
                  { title: "Remind 700 at-risk members to renew", sub: "Renewal Risk Members · email · 94% reach" },
                  { title: "Activate Seatmap Retargeting Pool", sub: "900 profiles · paid channel · $99K pipeline" },
                ].map((a, i) => (
                  <div key={a.title} className="flex items-center justify-between animate-card-in" style={{ ...CARD, animationDelay: `${i * 200}ms` }}>
                    <div>
                      <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.7)' }}>→ {a.title}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{a.sub}</p>
                    </div>
                    <button onClick={() => onDetail({ title: a.title, subtitle: a.sub, size: "sm", content: <div><p className="text-[13px] mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>Executing this action now. Confirmation within 60 seconds.</p><p className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>Est. completion: ~45 seconds</p></div> })}
                      className="text-[11px] px-3 py-1 rounded-full shrink-0 ml-4 transition-all hover:bg-white/[0.04]"
                      style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>Execute →</button>
                  </div>
                ))}
              </div>
            </ConnCard>
          )}

          {/* S12: Footer */}
          {step >= 12 && (
            <div className="animate-card-in text-center pt-6 space-y-6">
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.12)' }}>
                Last sync: 8:12 AM — Ticketmaster · Klaviyo · Meta · Salesforce · Identity Graph · 5 sources connected
              </p>
              <button onClick={() => navigateTo('calendar')}
                className="h-11 px-8 rounded-full text-[14px] transition-all hover:bg-white/[0.08] mx-auto block"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                View Calendar
              </button>
            </div>
          )}

          <div ref={bottomRef} className="h-8" />
        </div>
      </div>

      {/* Play/Pause pill */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2">
        {!playing && !isComplete ? (
          <MinervaInlineChat onResume={() => setPlaying(true)} />
        ) : (
          <button onClick={() => setPlaying(!playing)}
            className="h-8 px-4 rounded-full text-[11px] transition-all"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: isComplete ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.35)', backdropFilter: 'blur(16px)', fontWeight: 500 }}>
            {isComplete ? '✓ Briefing complete' : '⏸ Pause'}
          </button>
        )}
      </div>
    </div>
  )
}



/* ══════════════════════════════════════════════════════════
   AUDIENCE STUDIO MODAL
   ══════════════════════════════════════════════════════════ */
function AudienceModal({ open, onSave, onClose }: { open: boolean; onSave: () => void; onClose: () => void }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [saveAnim, setSaveAnim] = useState(false)

  useEffect(() => {
    if (open && iframeRef.current) {
      const t = setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage({ type: 'minerva-init', mode: 'premium', embedded: true }, '*')
      }, 1000)
      return () => clearTimeout(t)
    }
  }, [open])

  function handleSave() {
    setSaveAnim(true)
    setTimeout(() => { onSave() }, 1500)
  }

  if (!open && !saveAnim) return null

  return (
    <div className="fixed inset-0 z-[200] flex flex-col" style={{
      transform: open ? 'translateY(0)' : 'translateY(40px)',
      opacity: open ? 1 : 0,
      transition: 'transform 500ms cubic-bezier(0.22,1,0.36,1), opacity 400ms ease',
      pointerEvents: open ? 'auto' : 'none',
    }}>
      {/* Close button */}
      <button onClick={onClose} className="fixed top-3 right-4 z-[210] text-[11px] px-3 py-1.5 rounded-lg transition-all hover:bg-white/[0.06]" style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>✕ Close</button>

      {/* Iframe */}
      {saveAnim ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-black">
          <div className="animate-save-check text-[32px] mb-4">✦</div>
          <p className="text-[16px] text-white animate-fade-in-delay-300">Segment saved</p>
          <p className="text-[12px] mt-2 animate-fade-in-delay-500" style={{ color: 'rgba(255,255,255,0.3)' }}>Draft Momentum · 2,400 profiles</p>
        </div>
      ) : (
        <div className="flex-1 relative bg-black">
          <iframe ref={iframeRef} src="/workspace.html" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} title="Audience Studio" />
        </div>
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


/* ══ DETAIL MODAL ══ */
type ModalSize = 'sm' | 'md' | 'lg'
type DetailData = { title: string; subtitle?: string; size?: ModalSize; content: React.ReactNode } | null

function DetailModal({ data, onClose }: { data: DetailData; onClose: () => void }) {
  if (!data) return null
  const w = data.size === 'lg' ? 'max-w-[900px]' : data.size === 'md' ? 'max-w-[640px]' : 'max-w-[400px]'
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} />
      <div className={`relative ${w} w-full mx-4 animate-card-in`} onClick={e => e.stopPropagation()}
        style={{ background: 'rgba(13,13,15,0.98)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div className="shrink-0 flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <p className="text-[14px] text-white" style={{ fontWeight: 500 }}>{data.title}</p>
            {data.subtitle && <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{data.subtitle}</p>}
          </div>
          <button onClick={onClose} className="text-[12px] px-3 py-1 rounded-lg transition-colors hover:bg-white/[0.04]" style={{ color: 'rgba(255,255,255,0.4)' }}>\u2715</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4" style={{ scrollbarWidth: 'none' }}>
          {data.content}
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

  // Listen for notch navigation events
  useEffect(() => {
    const handleGoHome = () => navigateTo('home')
    const handleNavSection = (e: Event) => {
      const section = (e as CustomEvent).detail
      if (section === 'home') navigateTo('home')
      else if (section === 'briefing') navigateTo('briefing')
      else if (section === 'calendar') navigateTo('calendar')
      else if (section === 'studio') handleOpenStudio()
    }
    window.addEventListener('minerva-go-home', handleGoHome)
    window.addEventListener('minerva-nav-section', handleNavSection)
    return () => {
      window.removeEventListener('minerva-go-home', handleGoHome)
      window.removeEventListener('minerva-nav-section', handleNavSection)
    }
  }, [navigateTo])

  function handleOpenStudio() { setModal('studio') }
  function handleSaveStudio() {
    setStudioSaved(true)
    setTimeout(() => { setModal('closed'); setStudioDone(true) }, 1500)
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
        {view === 'home' && <HomeScreen onEnter={() => navigateTo('briefing')} />}
        {view === 'briefing' && <BriefingThread navigateTo={navigateTo} onOpenStudio={handleOpenStudio} studioSaved={studioSaved} studioDone={studioDone} onDetail={setDetail} />}
        {view === 'calendar' && <CalendarScreen navigateTo={navigateTo} onDetail={setDetail} />}
      </div>

      {/* Detail Modal */}
      <DetailModal data={detail} onClose={() => setDetail(null)} />

      {/* Audience Studio Modal */}
      <AudienceModal open={modal === 'studio'} onSave={handleSaveStudio} onClose={handleCloseStudio} />


    </div>
  )
}
