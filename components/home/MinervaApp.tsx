"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button"

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
  return <svg width={size} height={size} viewBox="0 0 127 127" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.22338 0.10804C8.60738-0.117663 15.2593 0.0802654 20.7514 0.0806169L54.8952 0.0813197L98.5292 0.0802656C105.88 0.0797382 113.232 0.0524922 120.582 0.0874727C121.836 0.0934492 125.577 0.177121 125.799 1.98275C126.284 5.9278 126.094 10.2025 126.095 14.1983L126.101 37.3406L126.097 94.1848C126.097 103.232 126.101 112.277 126.134 121.324C126.145 124.1 125.876 125.495 122.997 126.15C120.091 126.363 116.48 126.301 113.528 126.309L95.7205 126.272L39.5386 126.275L14.7594 126.287C10.8551 126.289 6.28689 126.421 2.40371 125.996C1.57016 125.905 0.645369 124.641 0.2024 123.971C-0.154084 120.034 0.0682788 112.64 0.0709155 108.398L0.075663 79.5376L0.0721467 29.332C0.0739045 21.2202 0.071621 13.1079 0.0739062 4.99634C0.0746093 2.4512 0.326854 0.606731 3.22338 0.10804Z" fill="white"/></svg>
}

/* ══════════════════════════════════════════════════════════
   TYPEWRITER + HELPERS
   ══════════════════════════════════════════════════════════ */
const NUMBER_CHUNKS = ['$242K', '4.0x', '3 actions ready.', '340%', '2,400', 'Jackson Dark', '1,872']

function useTypewriter(text: string, active: boolean, speed = 25) {
  const [segments, setSegments] = useState<{text:string,type:'char'|'num'|'warm'}[]>([])
  const [done, setDone] = useState(false)
  const [cursorVis, setCursorVis] = useState(true)
  useEffect(() => {
    if (!active) { setSegments([]); setDone(false); setCursorVis(true); return }
    let cancelled = false; setSegments([]); setDone(false); setCursorVis(true)
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
    let idx = 0; const built: typeof chunks = []
    function tick() {
      if (cancelled) return
      if (idx >= chunks.length) { setDone(true); setTimeout(() => { if (!cancelled) setCursorVis(false) }, 200); return }
      const c = chunks[idx]; built.push(c); setSegments([...built]); idx++
      let d = speed
      if (c.type === 'num' || c.type === 'warm') d = 180
      else { const ch = c.text; d = ch === '.' ? 180 : ch === ',' ? 100 : ch === '—' || ch === ':' ? 120 : ch === ' ' ? 15 : speed }
      setTimeout(tick, d)
    }
    tick(); return () => { cancelled = true }
  }, [active, text, speed])
  return { segments, done, cursorVis }
}

function useSimpleTyper(text: string, active: boolean, speed = 20) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!active) { setDisplayed(""); setDone(false); return }
    let cancelled = false; setDisplayed(""); setDone(false); let i = 0
    function tick() {
      if (cancelled || i >= text.length) { if (!cancelled) setDone(true); return }
      const ch = text[i]; i++; setDisplayed(text.slice(0, i))
      setTimeout(tick, ch === '.' ? 180 : ch === ',' ? 100 : ch === '—' || ch === ':' ? 120 : ch === ' ' ? 12 : speed)
    }
    tick(); return () => { cancelled = true }
  }, [active, text, speed])
  return { displayed, done }
}

function TypedText({ segments, cursorVis, done }: { segments: {text:string,type:'char'|'num'|'warm'}[]; cursorVis: boolean; done: boolean }) {
  return (
    <span>
      {segments.map((s, i) => {
        if (s.type === 'num') return <span key={i} className="animate-number-pop" style={{ color: '#fff', fontWeight: 500 }}>{s.text}</span>
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
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
      <p key={ti} className="text-4xl sm:text-5xl tracking-tight text-white text-center animate-tagline-in mb-10" style={{ fontWeight: 400, letterSpacing: '-0.03em' }}>{TAGLINES[ti]}</p>
      <LiquidMetalButton label="Enter" onClick={onEnter} />
      <p className="absolute bottom-6 left-0 right-0 text-center text-[11px] text-white/15 tracking-wide">Minerva<sup className="text-[7px]">™</sup> · Amit Roopnarine</p>
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

/*
  Timeline (step counter — each step is one visible item):
  0: greeting          5: funnel           10: pivot3+segment card
  1: conn1+recommends  6: conn4+chart      11: (modal pause)
  2: conn2+metrics     7: conn5+campaigns  12: conn7+composer
  3: conn3+funnel      8: pivot1           13: conn8+wrapup
  4: conn4+chart       9: pivot2           14: footer
  
  Simplified: use revealCount. Items render when their index <= revealCount.
  Each item has a "revealDelay" (ms after previous item finishes).
*/

function BriefingThread({ navigateTo, onOpenStudio, studioSaved, studioDone }: { navigateTo: (v: View) => void; onOpenStudio: () => void; studioSaved: boolean; studioDone: boolean }) {
  const [step, setStep] = useState(-1) // -1 = not started, 0+ = items revealed
  const [playing, setPlaying] = useState(true)
  const [sendState, setSendState] = useState<'idle'|'sending'|'sent'>('idle')
  const advanceRef = useRef<NodeJS.Timeout | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Start on mount
  useEffect(() => { setStep(0) }, [])

  // Advance past segment card when modal closes
  useEffect(() => {
    if (studioDone && step === 8) {
      // The segment card had delayAfter=99999, so we need to manually advance
      setTimeout(() => setStep(9), 500)
    }
  }, [studioDone, step])

  // Auto-scroll to bottom as new items appear
  useEffect(() => {
    if (playing && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [step, playing])

  const onAdvance = useCallback(() => setStep(s => s + 1), [])

  function advance(delayMs: number) {
    if (advanceRef.current) clearTimeout(advanceRef.current)
    advanceRef.current = setTimeout(() => {
      if (!playing) return
      setStep(s => s + 1)
    }, delayMs)
  }

  // Text done callbacks — trigger advance after appropriate delay
  function onGreetingDone() { if (playing) advance(800) }
  function onConnDone() { if (playing) advance(200) } // brief pause before card
  function onCardShown(delayAfter = 1200) { if (playing) advance(delayAfter) }
  function onPivotDone(delayAfter = 1500) { if (playing) advance(delayAfter) }

  const isComplete = step >= 14

  return (
    <div className="absolute inset-0 flex flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="max-w-[720px] mx-auto px-6 pt-6 pb-40">

          {/* Header */}
          <p style={LBL} className="mb-6">✦ APR 1 · BRIEFING</p>

          {/* S0: Greeting */}
          {step >= 0 && (
            <TypeSection playing={playing} onAdvance={onAdvance} text="Morning, Sarah. Revenue is $242K with ROAS at 4.0x. Family audience surging. 3 actions ready." speed={25} delayAfter={800} />
          )}

          {/* S1: Minerva Recommends */}
          {step >= 1 && (
            <ConnCard playing={playing} onAdvance={onAdvance} text="Here's my top recommendation —" delayAfter={1200}>
              <div style={CARD}>
                <p style={LBL} className="mb-2">✦ MINERVA RECOMMENDS</p>
                <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Scale Family Ticket Bundle budget by 20% and activate Seatmap Retargeting Pool (900 profiles). Combined estimated lift: <span style={{ color: 'rgba(255,255,255,0.88)', fontWeight: 500 }}>+$34K</span> revenue this week.
                </p>
                <div className="flex items-center justify-between mt-3">
                  <button onClick={() => toast.success("Executing 2 actions…")} className="text-[11px] px-3 py-1 rounded-full transition-all hover:bg-white/[0.04]" style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.02)', height: 28 }}>→ Execute both</button>
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>⏱ 12 min ago · 91% confidence</span>
                </div>
              </div>
            </ConnCard>
          )}

          {/* S2: Metrics */}
          {step >= 2 && (
            <ConnCard playing={playing} onAdvance={onAdvance} text="Key metrics this week:" delayAfter={1200}>
              <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
                {METRICS.map((m, i) => (
                  <div key={m.label} onClick={() => toast(`Opening ${m.label} detail…`)}
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


          {/* S3: Funnel */}
          {step >= 3 && (
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

          {/* S4: Chart */}
          {step >= 4 && (
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

          {/* S5: Campaigns */}
          {step >= 5 && (
            <ConnCard playing={playing} onAdvance={onAdvance} text="Campaign breakdown:" delayAfter={1500}>
              <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
                <div className="flex px-[18px] py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ ...LBL, flex: 1 }}>Campaign</span>
                  <span style={{ ...LBL, width: 64, textAlign: 'right' }}>Platform</span>
                  <span style={{ ...LBL, width: 64, textAlign: 'right' }}>Spend</span>
                  <span style={{ ...LBL, width: 56, textAlign: 'right' }}>ROAS</span>
                  <span style={{ ...LBL, width: 56, textAlign: 'right' }}>Conv</span>
                </div>
                {CAMPAIGNS.map((c, i) => (
                  <div key={c.name} onClick={() => toast(`Opening ${c.name}…`)}
                    className="flex items-center px-[18px] py-2.5 cursor-pointer transition-colors hover:bg-white/[0.02] animate-card-in"
                    style={{ borderBottom: i < CAMPAIGNS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', animationDelay: `${i * 100}ms` }}>
                    <span className="flex-1 text-[12px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.up ? '↗' : '↘'} {c.name}</span>
                    <span className="w-16 text-right text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{c.platform}</span>
                    <span className="w-16 text-right text-[12px] tabular-nums" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.spend}</span>
                    <span className="w-14 text-right text-[12px] tabular-nums text-white" style={{ fontWeight: 500 }}>{c.roas}</span>
                    <span className="w-14 text-right text-[12px] tabular-nums" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.conv}</span>
                  </div>
                ))}
              </div>
            </ConnCard>
          )}


          {/* S6: PIVOT — typed slowly, brighter */}
          {step >= 6 && (
            <TypeSection playing={playing} onAdvance={onAdvance} text="Something interesting happened overnight." speed={30} delayAfter={1500}
              style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: 'rgba(255,255,255,0.75)', marginTop: 24 }} />
          )}

          {/* S7: Pivot continued */}
          {step >= 7 && (
            <TypeSection playing={playing} onAdvance={onAdvance} text="The Dolphins signed quarterback Jackson Dark from the New York Giants. Social media volume spiked 340% in the last 8 hours — mostly Giants fans reacting." speed={30} delayAfter={1000}
              style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: 'rgba(255,255,255,0.75)' }} />
          )}

          {/* S8: Pivot analysis + segment card */}
          {step >= 8 && (
            <ConnCard playing={playing} onAdvance={onAdvance} text="I ran a signal analysis across your file and surfaced a segment you should look at: 2,400 current Giants fans in the South Florida market who match our high-propensity profile. These are people who could become Dolphins fans — their favorite quarterback just moved here." speed={30} delayAfter={99999} textStyle={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: '16px 0 12px 0' }}>
              <div style={{ ...CARD, border: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={LBL} className="mb-3">✦ SUGGESTED SEGMENT</p>
                <p className="text-[16px] text-white mb-1" style={{ fontWeight: 500 }}>Giants-to-Dolphins Crossover</p>
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


          {/* S9: Campaign Composer (after modal save) OR skip connector */}
          {step >= 9 && studioSaved && (
            <ConnCard playing={playing} onAdvance={onAdvance} text={'Segment saved: Giants-to-Dolphins Crossover — 2,400 profiles. Now let\'s reach them.'} delayAfter={99999}>
              <div style={{ ...CARD }}>
                <p style={LBL} className="mb-3">COMPOSE CAMPAIGN</p>
                <p className="text-[12px] mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>To: Giants-to-Dolphins Crossover (2,400)</p>
                <p className="text-[12px] mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>Channel: Email · 78% reachable (1,872)</p>
                <p className="text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Subject:</p>
                <div className="rounded-lg px-3 py-2 mb-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.7)' }}>Your QB just joined the Dolphins — here's your welcome offer</p>
                </div>
                <p className="text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Message:</p>
                <div className="rounded-lg px-3 py-3 mb-4" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Hi <span style={{ color: 'rgba(255,230,180,0.5)' }}>{'{first_name}'}</span>,<br /><br />
                    Jackson Dark is officially a Dolphin. As a fellow fan, we want to welcome you with an exclusive offer: 20% off your first Dolphins game experience.<br /><br />
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>[Claim Your Welcome Offer →]</span><br /><br />
                    See you at Hard Rock Stadium.<br />
                    — The Miami Dolphins
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => { setSendState('sending'); setTimeout(() => { setSendState('sent'); toast.success('Sent to 1,872 recipients'); if (playing) setTimeout(() => setStep(s => s + 1), 1500) }, 1200) }}
                    className="h-9 px-5 rounded-full text-[13px] transition-all"
                    style={{ background: sendState === 'sent' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.88)', color: sendState === 'sent' ? 'rgba(255,255,255,0.6)' : '#000', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                    {sendState === 'idle' ? '✉ Send Campaign' : sendState === 'sending' ? 'Sending…' : '✓ Sent to 1,872'}
                  </button>
                  <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Preview · Schedule</span>
                </div>
              </div>
            </ConnCard>
          )}

          {/* S10/S9: Wrap-up + Remaining actions */}
          {step >= (studioSaved ? 10 : 9) && (
            <ConnCard playing={playing} onAdvance={onAdvance} text={studioSaved ? "Done. 1,872 Giants fans will receive your welcome offer within the hour. I'll track performance and brief you tomorrow." : "Three actions I'd prioritize:"} delayAfter={1500}>
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
                    <button onClick={() => toast.success(`Executing: ${a.title}`)}
                      className="text-[11px] px-3 py-1 rounded-full shrink-0 ml-4 transition-all hover:bg-white/[0.04]"
                      style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>Execute →</button>
                  </div>
                ))}
              </div>
            </ConnCard>
          )}


          {/* Footer */}
          {step >= (studioSaved ? 11 : 10) && (
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
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]">
        <button onClick={() => setPlaying(!playing)}
          className="h-8 px-4 rounded-full text-[11px] transition-all"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: isComplete ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.35)', backdropFilter: 'blur(16px)', fontWeight: 500 }}>
          {isComplete ? '✓ Briefing complete' : playing ? '⏸ Pause' : '▶ Resume'}
        </button>
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
      {/* Top bar */}
      <div className="shrink-0 h-12 flex items-center justify-between px-5" style={{ background: '#000', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Audience Studio · Giants-to-Dolphins</p>
        <button onClick={onClose} className="text-[12px] px-3 py-1 rounded-lg transition-colors hover:bg-white/[0.04]" style={{ color: 'rgba(255,255,255,0.4)' }}>✕ Close</button>
      </div>

      {/* Iframe */}
      {saveAnim ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-black">
          <div className="animate-save-check text-[32px] mb-4">✦</div>
          <p className="text-[16px] text-white animate-fade-in-delay-300">Segment saved</p>
          <p className="text-[12px] mt-2 animate-fade-in-delay-500" style={{ color: 'rgba(255,255,255,0.3)' }}>Giants-to-Dolphins Crossover · 2,400 profiles</p>
        </div>
      ) : (
        <div className="flex-1 relative bg-black">
          <iframe ref={iframeRef} src="/workspace.html" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} title="Audience Studio" />
        </div>
      )}

      {/* Bottom bar */}
      {!saveAnim && (
        <div className="shrink-0 h-14 flex items-center justify-center gap-3 px-5" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.95) 30%)', position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50 }}>
          <button onClick={handleSave} style={{ height: 36, padding: '0 24px', borderRadius: 100, background: 'rgba(255,255,255,0.88)', color: '#000', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Save Segment</button>
          <button onClick={() => { iframeRef.current?.contentWindow?.postMessage({ type: 'minerva-tour-click', selector: '.mn-workspace-topbar-save' }, '*'); toast.success('Exporting CSV…') }}
            style={{ height: 36, padding: '0 20px', borderRadius: 100, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', fontSize: 13, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>Export CSV</button>
        </div>
      )}
    </div>
  )
}



/* ══════════════════════════════════════════════════════════
   CALENDAR SCREEN — Past Daily Briefings
   ══════════════════════════════════════════════════════════ */
const PAST_BRIEFINGS: Record<number, { headline: string; revenue: string; roas: string; actions: number; signal?: string }> = {
  1: { headline: "Jackson Dark signing drives 340% social spike", revenue: "$242K", roas: "4.0x", actions: 3, signal: "Giants-to-Dolphins segment identified" },
  31: { headline: "Family audience surging after spring break push", revenue: "$238K", roas: "3.9x", actions: 2 },
  30: { headline: "Premium Suite renewals ahead of target", revenue: "$231K", roas: "4.1x", actions: 4, signal: "Lapsed buyer win-back window closing" },
  29: { headline: "Match rate declining — identity graph needs refresh", revenue: "$225K", roas: "3.7x", actions: 2 },
  28: { headline: "Seatmap retargeting pool hit 900 profiles", revenue: "$219K", roas: "3.8x", actions: 3, signal: "New high-propensity cluster in Broward" },
  27: { headline: "Email open rates up 12% after subject line test", revenue: "$214K", roas: "3.6x", actions: 1 },
  26: { headline: "Weekend game day — conversion spike expected", revenue: "$208K", roas: "3.5x", actions: 2 },
  25: { headline: "Sponsor resonance data: luxury narrative winning", revenue: "$202K", roas: "3.4x", actions: 3, signal: "Premium hospitality segment growing 8%" },
}

function CalendarScreen({ navigateTo }: { navigateTo: (v: View) => void }) {
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

/* ══════════════════════════════════════════════════════════
   MAIN APP
   ══════════════════════════════════════════════════════════ */
export function MinervaApp() {
  const { view, transitioning, navigateTo } = useCanvasTransition()
  const [modal, setModal] = useState<ModalState>('closed')
  const [studioSaved, setStudioSaved] = useState(false)
  const [studioDone, setStudioDone] = useState(false)
  const briefingRef = useRef<{ onStudioSaved: () => void; onStudioClosed: () => void } | null>(null)

  function handleOpenStudio() { setModal('studio') }
  function handleSaveStudio() {
    setStudioSaved(true)
    setTimeout(() => { setModal('closed'); setStudioDone(true) }, 1500)
  }
  function handleCloseStudio() { setModal('closed'); setStudioDone(true) }

  return (
    <div className="h-full flex flex-col relative">
      {/* Shell header — always visible */}
      <div className="shrink-0 flex items-center justify-between px-5 py-2.5 relative z-30">
        <button onClick={() => navigateTo('home')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <MinervaLogo size={16} />
          {view === 'home' && <span className="text-[13px] font-medium tracking-tight text-white">Minerva<sup className="text-[7px] ml-px opacity-40">™</sup></span>}
        </button>
        <button onClick={() => toast('Settings')} className="h-5 w-5 rounded-full bg-white/90 hover:ring-white/30 transition-all flex items-center justify-center">
          <span className="text-[8px] font-semibold text-black/60 leading-none">SM</span>
        </button>
      </div>

      {/* Canvas — transitions between views */}
      <div className="flex-1 relative" style={{
        opacity: transitioning ? 0 : (modal === 'studio' ? 0.3 : 1),
        filter: transitioning ? 'blur(6px)' : (modal === 'studio' ? 'blur(8px)' : 'blur(0)'),
        transform: transitioning ? 'scale(0.98)' : 'scale(1)',
        transition: 'opacity 300ms ease, filter 300ms ease, transform 250ms ease-out',
      }}>
        {view === 'home' && <HomeScreen onEnter={() => navigateTo('briefing')} />}
        {view === 'briefing' && <BriefingThread navigateTo={navigateTo} onOpenStudio={handleOpenStudio} studioSaved={studioSaved} studioDone={studioDone} />}
        {view === 'calendar' && <CalendarScreen navigateTo={navigateTo} />}
      </div>

      {/* Audience Studio Modal */}
      <AudienceModal open={modal === 'studio'} onSave={handleSaveStudio} onClose={handleCloseStudio} />
    </div>
  )
}
