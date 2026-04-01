"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button"

/* ── Types ── */
type View = 'home' | 'briefing' | 'studio-entry' | 'studio' | 'studio-save' | 'settings'

/* ── Transition wrapper ── */
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
      <path d="M3.22338 0.10804C8.60738-0.117663 15.2593 0.0802654 20.7514 0.0806169L54.8952 0.0813197L98.5292 0.0802656C105.88 0.0797382 113.232 0.0524922 120.582 0.0874727C121.836 0.0934492 125.577 0.177121 125.799 1.98275C126.284 5.9278 126.094 10.2025 126.095 14.1983L126.101 37.3406L126.097 94.1848C126.097 103.232 126.101 112.277 126.134 121.324C126.145 124.1 125.876 125.495 122.997 126.15C120.091 126.363 116.48 126.301 113.528 126.309L95.7205 126.272L39.5386 126.275L14.7594 126.287C10.8551 126.289 6.28689 126.421 2.40371 125.996C1.57016 125.905 0.645369 124.641 0.2024 123.971C-0.154084 120.034 0.0682788 112.64 0.0709155 108.398L0.075663 79.5376L0.0721467 29.332C0.0739045 21.2202 0.071621 13.1079 0.0739062 4.99634C0.0746093 2.4512 0.326854 0.606731 3.22338 0.10804ZM115.299 86.8225C115.872 82.4559 115.519 77.6787 115.58 73.2545C115.603 71.6122 115.467 69.9391 115.631 68.299L86.6845 68.2786C82.4155 68.2774 74.8969 68.0399 70.8383 68.3419C69.3213 70.2486 77.8047 76.3373 79.362 77.2375C88.2832 82.3946 98.7311 85.0554 108.942 86.0784C110.918 86.2709 113.369 86.7304 115.299 86.8225ZM115.552 29.1267C115.595 23.3099 115.732 16.7932 115.574 11.0142C114.95 11.0457 113.888 11.0675 113.305 11.1659C98.5133 13.6246 86.4254 20.8775 77.7743 33.2507C77.0362 34.3065 74.49 37.6073 75.6475 38.7439C76.2035 38.8536 76.6667 38.5563 77.1953 38.3115C78.7545 37.5048 80.3555 36.8809 81.9676 36.1959C92.9068 31.5467 103.815 30.2841 115.552 29.1267ZM10.6994 97.269C10.7783 101.238 10.8025 105.207 10.772 109.176C10.7707 110.437 10.4705 114.437 11.2038 115.25C24.1319 114.174 36.204 107.408 44.7419 97.7762C46.1632 96.1729 51.7307 89.3763 51.2331 87.3994C50.9826 87.2338 51.0419 87.2298 50.7641 87.202C43.0065 90.7797 35.4715 93.7492 26.9749 95.1164C23.639 95.642 20.2937 96.1061 16.9406 96.5082C15.0705 96.7301 12.4943 96.9458 10.6994 97.269Z" fill="white"/>
    </svg>
  )
}

/* ══════════════════════════════════════════════════════════
   TAGLINES
   ══════════════════════════════════════════════════════════ */
const TAGLINES = [
  "Clarity beyond scale",
  "Patterns in infinite data",
  "Meaning in every profile",
  "Intelligence in boundless reach",
]

/* ══════════════════════════════════════════════════════════
   SCREEN: HOME
   ══════════════════════════════════════════════════════════ */
function HomeScreen({ navigateTo }: { navigateTo: (v: View) => void }) {
  const [tagIndex, setTagIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTagIndex(p => (p + 1) % TAGLINES.length), 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
      {/* Rotating tagline */}
      <p key={tagIndex} className="text-4xl sm:text-5xl tracking-tight text-white text-center animate-tagline-in mb-10"
        style={{ fontWeight: 400, letterSpacing: '-0.03em' }}>
        {TAGLINES[tagIndex]}
      </p>

      {/* CTA */}
      <LiquidMetalButton label="Enter" onClick={() => navigateTo('briefing')} />

      {/* Credit */}
      <p className="absolute bottom-6 left-0 right-0 text-center text-[11px] text-white/15 tracking-wide">
        Minerva<sup className="text-[7px]">™</sup> · Amit Roopnarine
      </p>
    </div>
  )
}


/* ══════════════════════════════════════════════════════════
   BRIEFING: Advanced Typewriter
   ══════════════════════════════════════════════════════════ */

const NUMBER_CHUNKS = ['$242K', '4.0x', '3 actions ready.']

function useAdvancedTypewriter(text: string, active: boolean, speed = 25) {
  const [segments, setSegments] = useState<{text:string,type:'char'|'number'|'warm'}[]>([])
  const [done, setDone] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    if (!active) { setSegments([]); setDone(false); setCursorVisible(true); return }
    setSegments([]); setDone(false); setCursorVisible(true)

    // Pre-parse text into chunks
    const chunks: {text:string,type:'char'|'number'|'warm'}[] = []
    let remaining = text
    while (remaining.length > 0) {
      let found = false
      for (const nc of NUMBER_CHUNKS) {
        if (remaining.startsWith(nc)) {
          const type = nc === '3 actions ready.' ? 'warm' : 'number'
          chunks.push({ text: nc, type })
          remaining = remaining.slice(nc.length)
          found = true
          break
        }
      }
      if (!found) {
        chunks.push({ text: remaining[0], type: 'char' })
        remaining = remaining.slice(1)
      }
    }

    let idx = 0
    const built: typeof chunks = []

    function tick() {
      if (idx >= chunks.length) {
        setDone(true)
        setTimeout(() => setCursorVisible(false), 200)
        return
      }
      const chunk = chunks[idx]
      built.push(chunk)
      setSegments([...built])
      idx++

      // Determine delay for next chunk
      let delay = speed
      if (chunk.type === 'number' || chunk.type === 'warm') delay = 180
      else {
        const ch = chunk.text
        if (ch === '.') delay = 180
        else if (ch === ',') delay = 100
        else if (ch === '—' || ch === ':') delay = 120
        else if (ch === ' ') delay = 15
        else delay = speed
      }
      setTimeout(tick, delay)
    }
    tick()
  }, [active, text, speed])

  return { segments, done, cursorVisible }
}

/* Simple typewriter for connector text */
function useSimpleTypewriter(text: string, active: boolean, speed = 20) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!active) { setDisplayed(""); setDone(false); return }
    setDisplayed(""); setDone(false)
    let i = 0
    function tick() {
      if (i >= text.length) { setDone(true); return }
      const ch = text[i]
      i++
      setDisplayed(text.slice(0, i))
      const delay = ch === '.' ? 180 : ch === ',' ? 100 : ch === '—' || ch === ':' ? 120 : ch === ' ' ? 12 : speed
      setTimeout(tick, delay)
    }
    tick()
  }, [active, text, speed])
  return { displayed, done }
}

/* Render typed segments with styling */
function TypedText({ segments, cursorVisible, done }: { segments: {text:string,type:'char'|'number'|'warm'}[]; cursorVisible: boolean; done: boolean }) {
  return (
    <span style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, letterSpacing: '-0.01em' }}>
      {segments.map((s, i) => {
        if (s.type === 'number') return <span key={i} className="animate-number-pop" style={{ color: '#fff', fontWeight: 500 }}>{s.text}</span>
        if (s.type === 'warm') return <span key={i} className="animate-number-pop" style={{ color: 'rgba(255,230,180,0.65)' }}>{s.text}</span>
        return <span key={i} style={{ color: 'rgba(255,255,255,0.85)' }}>{s.text}</span>
      })}
      {cursorVisible && <span className={done ? 'animate-cursor-fade' : 'animate-blink'} style={{ color: 'rgba(255,255,255,0.5)' }}>|</span>}
    </span>
  )
}

/* Thinking dots */
function ThinkingDots({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div className="flex items-center gap-1.5 py-3" style={{ opacity: visible ? 1 : 0, transition: 'opacity 150ms' }}>
      <div className="w-1 h-1 rounded-full animate-dot-1" style={{ background: 'rgba(255,255,255,0.3)' }} />
      <div className="w-1 h-1 rounded-full animate-dot-2" style={{ background: 'rgba(255,255,255,0.3)' }} />
      <div className="w-1 h-1 rounded-full animate-dot-3" style={{ background: 'rgba(255,255,255,0.3)' }} />
    </div>
  )
}

/* Sparkline with unique paths */
function Sparkline({ path }: { path: string }) {
  return (
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
      <path d={path} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

/* Stagger entrance */
function Stagger({ children, delay = 0, stagger = 120, active }: { children: React.ReactNode[]; delay?: number; stagger?: number; active: boolean }) {
  return <>{children.map((child, i) => (
    <div key={i} style={{
      opacity: active ? 1 : 0, transform: active ? 'translateY(0)' : 'translateY(14px)',
      filter: active ? 'blur(0)' : 'blur(4px)',
      transition: `opacity 400ms cubic-bezier(0.22,1,0.36,1) ${delay + i * stagger}ms, transform 400ms cubic-bezier(0.22,1,0.36,1) ${delay + i * stagger}ms, filter 400ms cubic-bezier(0.22,1,0.36,1) ${delay + i * stagger}ms`
    }}>{child}</div>
  ))}</>
}

/* ══════════════════════════════════════════════════════════
   SCREEN: BRIEFING
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
const ACTIONS = [
  { title: "Activate Seatmap Retargeting Pool", sub: "900 profiles · paid channel · $99K pipeline" },
  { title: "Remind 700 at-risk members to renew", sub: "Renewal Risk Members · email · 94% reach" },
  { title: "Route Marcus Johnson to premium sales", sub: "Ticket Buy: 97 · Premium: 88 · $8.4K revenue" },
]
const SIGNALS = [
  { label: "ATTENTION", delta: "+18%", copy: "Awareness way up — but still mostly top-of-funnel.", cta: "See channel breakdown" },
  { label: "PREMIUM EXPERIENCE", delta: "+11%", copy: "Premium game-day messaging beating general hype on ticket intent.", cta: "Analyze in Audience Studio →", nav: true },
  { label: "FAMILY AUDIENCE", delta: "+14%", copy: "Family consideration up 14%. Strongest in Dade + Broward.", cta: "View regional data" },
  { label: "OWNED CONVERSION", delta: "-4%", copy: "Social engagement surged, but ticketing and lifecycle aren’t keeping up.", cta: "See funnel gaps" },
  { label: "SPONSOR RESONANCE", delta: "+9%", copy: "Luxury and hospitality narratives driving strongest sponsor value.", cta: "View sponsor data" },
]
const FUNNEL = [
  { label: "Reached", value: "48.2K", pct: 100 },
  { label: "Engaged", value: "12.8K", pct: 26.5 },
  { label: "Converted", value: "3.4K", pct: 7.0 },
  { label: "Revenue", value: "$242K", pct: 3.5 },
]

/*
  Thread timeline:
  step 0: greeting types
  step 1: thinking dots → connector "Here’s my top recommendation —" → Recommends card
  step 2: connector "Key metrics this week:" → Metrics card
  step 3: connector "Here’s how the funnel looks:" → Funnel
  step 4: connector "Revenue versus spend, last 7 days:" → Chart
  step 5: connector "Campaign breakdown:" → Table
  step 6: connector "Three actions I’d prioritize:" → Action cards
  step 7: footer
*/
const CONNECTORS = [
  "",
  "Here’s my top recommendation —",
  "Key metrics this week:",
  "Here’s how the funnel looks:",
  "Revenue versus spend, last 7 days:",
  "Campaign breakdown:",
  "Three actions I’d prioritize:",
  "",
]
// Delays between steps (ms after previous step completes)
const STEP_DELAYS = [0, 800, 1000, 1000, 1000, 1500, 1500, 1000]

function BriefingScreen({ navigateTo }: { navigateTo: (v: View) => void }) {
  const [tab, setTab] = useState<'briefing' | 'signals'>('briefing')
  const [playing, setPlaying] = useState(true)
  const [step, setStep] = useState(0)
  const [showDots, setShowDots] = useState(false)
  const [connectorText, setConnectorText] = useState("")
  const [connectorDone, setConnectorDone] = useState(false)
  const [connectorActive, setConnectorActive] = useState(false)
  const [showCard, setShowCard] = useState(-1) // which card to show
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const latestSectionRef = useRef<HTMLDivElement>(null)

  // Greeting
  const greetingText = "Morning, Sarah. Revenue is $242K with ROAS at 4.0x. Family audience surging. 3 actions ready."
  const { segments: greetingSegs, done: greetingDone, cursorVisible } = useAdvancedTypewriter(greetingText, step >= 0 && tab === 'briefing')

  // Connector typewriter
  const currentConnector = step >= 1 && step <= 6 ? CONNECTORS[step] : ""
  const { displayed: connectorDisp, done: connDone } = useSimpleTypewriter(currentConnector, connectorActive, 20)

  // Signals tab
  const signalsText = "3 positive signals, 1 declining metric, and 1 weekend opportunity. Family audience consideration is the strongest trend — up 14% across Miami-Dade and Broward. Owned conversion is your biggest gap."
  const { displayed: signalsGreeting, done: signalsDone } = useSimpleTypewriter(signalsText, tab === 'signals')

  // Auto-advance timeline
  useEffect(() => {
    if (!playing || tab !== 'briefing') return
    if (step === 0 && greetingDone) {
      // Greeting done → start step 1 after delay
      const t = setTimeout(() => {
        setStep(1)
        setShowDots(true)
        setTimeout(() => {
          setShowDots(false)
          setConnectorActive(true)
        }, 650)
      }, STEP_DELAYS[1])
      return () => clearTimeout(t)
    }
  }, [playing, tab, step, greetingDone])

  // When connector finishes → show card
  useEffect(() => {
    if (!playing || !connDone || !connectorActive) return
    const t = setTimeout(() => {
      setShowCard(step)
      setConnectorActive(false)
    }, 200)
    return () => clearTimeout(t)
  }, [connDone, connectorActive, playing, step])

  // When card shown → advance to next step
  useEffect(() => {
    if (!playing || showCard < 1 || showCard >= 7) return
    const nextStep = showCard + 1
    if (nextStep > 7) return
    const t = setTimeout(() => {
      setStep(nextStep)
      if (nextStep <= 6) {
        setShowDots(true)
        setConnectorActive(false)
        setTimeout(() => {
          setShowDots(false)
          setConnectorActive(true)
        }, 650)
      } else {
        // Step 7 = footer, no connector
        setShowCard(7)
      }
    }, STEP_DELAYS[nextStep])
    return () => clearTimeout(t)
  }, [playing, showCard])

  // Auto-scroll
  useEffect(() => {
    if (latestSectionRef.current && playing) {
      latestSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [showCard, step, playing])

  const isComplete = showCard >= 7

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="max-w-[720px] mx-auto px-6 pt-6 pb-32">

          {/* Header */}
          <p className="text-[9px] uppercase tracking-[0.08em] mb-6" style={{ color: 'rgba(255,255,255,0.22)' }}>
            ✦ APR 1 · BRIEFING
          </p>

          {/* Mode tabs */}
          <div className="flex items-center gap-1 mb-10">
            {['Briefing', 'Signals', 'Audiences', 'People'].map(t => {
              const active = (t === 'Briefing' && tab === 'briefing') || (t === 'Signals' && tab === 'signals')
              return (
                <button key={t} onClick={() => {
                  if (t === 'Briefing') setTab('briefing')
                  else if (t === 'Signals') setTab('signals')
                  else navigateTo('studio-entry')
                }}
                  className="text-[12px] px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: active ? 'rgba(255,255,255,0.1)' : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,0.35)', fontWeight: active ? 500 : 400 }}>
                  {t}
                </button>
              )
            })}
          </div>

          {tab === 'briefing' ? (
          <div className="space-y-4">
            {/* S0: Greeting */}
            <div><TypedText segments={greetingSegs} cursorVisible={cursorVisible} done={greetingDone} /></div>

            {/* Thinking dots (between greeting and first card) */}
            {step >= 1 && showCard < 1 && <ThinkingDots visible={showDots} />}

            {/* S1: Connector + Minerva Recommends */}
            {step >= 1 && (
              <div ref={showCard >= 1 ? latestSectionRef : undefined}>
                {connectorActive && step === 1 && (
                  <p className="text-[14px] mb-3" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: '16px 0 12px 0' }}>
                    {connectorDisp}{!connDone && <span className="animate-blink" style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>}
                  </p>
                )}
                {step === 1 && connDone && showCard < 1 && <ThinkingDots visible={showDots} />}
                {showCard >= 1 && (
                  <>
                    <p className="text-[14px] mb-3" style={{ color: 'rgba(255,255,255,0.45)', margin: '16px 0 12px 0' }}>{CONNECTORS[1]}</p>
                    <div className="animate-card-in" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 18px' }}>
                      <p className="text-[9px] uppercase tracking-[0.06em] mb-2" style={{ color: 'rgba(255,255,255,0.22)' }}>✦ MINERVA RECOMMENDS</p>
                      <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        Scale Family Ticket Bundle budget by 20% and activate Seatmap Retargeting Pool (900 profiles). Combined estimated lift: <span className="text-white font-medium">+$34K</span> revenue this week.
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <button onClick={() => toast.success("Executing 2 actions…")} className="text-[11px] px-3 py-1 rounded-full transition-all hover:bg-white/[0.04]" style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.02)' }}>→ Execute both</button>
                        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>⏱ Generated 12 min ago · 91% confidence</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* S2: Metrics */}
            {step >= 2 && (
              <div ref={showCard >= 2 ? latestSectionRef : undefined}>
                {connectorActive && step === 2 && (
                  <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.45)', margin: '16px 0 12px 0' }}>
                    {connectorDisp}{!connDone && <span className="animate-blink" style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>}
                  </p>
                )}
                {showCard >= 2 && (
                  <>
                    <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.45)', margin: '16px 0 12px 0' }}>{CONNECTORS[2]}</p>
                    <div className="animate-card-in" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
                      <Stagger active={showCard >= 2} delay={0} stagger={120}>
                        {METRICS.map((m, i) => (
                          <div key={m.label} onClick={() => toast(`Opening ${m.label} detail…`)}
                            className="flex items-center px-[18px] py-3 cursor-pointer transition-colors hover:bg-white/[0.02]"
                            style={{ borderBottom: i < METRICS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                            <span className="text-[9px] uppercase tracking-[0.06em] w-24" style={{ color: 'rgba(255,255,255,0.22)' }}>{m.label}</span>
                            <span className="text-[22px] tabular-nums text-white flex-1" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>{m.value}</span>
                            <span className="text-[11px] w-20 text-right" style={{ color: m.dim ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.35)' }}>{m.trend}</span>
                            <div className="ml-4"><Sparkline path={m.spark} /></div>
                          </div>
                        ))}
                      </Stagger>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* S3: Funnel */}
            {step >= 3 && showCard >= 3 && (
              <div ref={latestSectionRef} className="animate-card-in">
                <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.45)', margin: '16px 0 12px 0' }}>{CONNECTORS[3]}</p>
                <div className="flex items-end gap-2">
                  {FUNNEL.map((f, i) => (
                    <div key={f.label} className="flex-1 text-center">
                      <p className="text-[20px] tabular-nums text-white mb-1" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>{f.value}</p>
                      <div className="mx-auto rounded-sm overflow-hidden" style={{ height: 4, background: 'rgba(255,255,255,0.04)' }}>
                        <div style={{ width: `${f.pct}%`, height: '100%', background: 'rgba(255,255,255,0.2)', animation: 'bar-grow 300ms ease both', animationDelay: `${i * 150}ms` }} />
                      </div>
                      <p className="text-[9px] uppercase tracking-[0.04em] mt-2" style={{ color: 'rgba(255,255,255,0.22)' }}>{f.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* S4: Revenue chart */}
            {step >= 4 && showCard >= 4 && (
              <div ref={latestSectionRef} className="animate-card-in">
                <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.45)', margin: '16px 0 12px 0' }}>{CONNECTORS[4]}</p>
                <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16, height: 120 }}>
                  <svg viewBox="0 0 300 80" className="w-full h-full">
                    <polyline points="0,60 50,55 100,48 150,42 200,35 250,28 300,20" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                    <polyline points="0,70 50,68 100,65 150,62 200,60 250,58 300,55" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
                    <text x="295" y="18" fill="rgba(255,255,255,0.3)" fontSize="6" textAnchor="end">Revenue</text>
                    <text x="295" y="53" fill="rgba(255,255,255,0.15)" fontSize="6" textAnchor="end">Spend</text>
                  </svg>
                </div>
              </div>
            )}

            {/* S5: Campaign table */}
            {step >= 5 && showCard >= 5 && (
              <div ref={latestSectionRef} className="animate-card-in">
                <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.45)', margin: '16px 0 12px 0' }}>{CONNECTORS[5]}</p>
                <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
                  <div className="flex px-[18px] py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span className="text-[9px] uppercase tracking-[0.06em] flex-1" style={{ color: 'rgba(255,255,255,0.22)' }}>Campaign</span>
                    <span className="text-[9px] uppercase tracking-[0.06em] w-16 text-right" style={{ color: 'rgba(255,255,255,0.22)' }}>Platform</span>
                    <span className="text-[9px] uppercase tracking-[0.06em] w-16 text-right" style={{ color: 'rgba(255,255,255,0.22)' }}>Spend</span>
                    <span className="text-[9px] uppercase tracking-[0.06em] w-14 text-right" style={{ color: 'rgba(255,255,255,0.22)' }}>ROAS</span>
                    <span className="text-[9px] uppercase tracking-[0.06em] w-14 text-right" style={{ color: 'rgba(255,255,255,0.22)' }}>Conv</span>
                  </div>
                  <Stagger active={showCard >= 5} stagger={120}>
                    {CAMPAIGNS.map((c, i) => (
                      <div key={c.name} onClick={() => toast(`Opening ${c.name}…`)}
                        className="flex items-center px-[18px] py-2.5 cursor-pointer transition-colors hover:bg-white/[0.02]"
                        style={{ borderBottom: i < CAMPAIGNS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        <span className="flex-1 text-[12px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                          <span style={{ color: c.up ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.2)' }}>{c.up ? '↗' : '↘'}</span> {c.name}
                        </span>
                        <span className="w-16 text-right text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{c.platform}</span>
                        <span className="w-16 text-right text-[12px] tabular-nums" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.spend}</span>
                        <span className="w-14 text-right text-[12px] tabular-nums text-white" style={{ fontWeight: 500 }}>{c.roas}</span>
                        <span className="w-14 text-right text-[12px] tabular-nums" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.conv}</span>
                      </div>
                    ))}
                  </Stagger>
                </div>
              </div>
            )}

            {/* S6: Next Best Actions */}
            {step >= 6 && showCard >= 6 && (
              <div ref={latestSectionRef} className="animate-card-in">
                <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.45)', margin: '16px 0 12px 0' }}>{CONNECTORS[6]}</p>
                <Stagger active={showCard >= 6} stagger={200}>
                  {ACTIONS.map((a, i) => (
                    <div key={a.title} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 18px', marginBottom: 8 }}
                      className="flex items-center justify-between">
                      <div>
                        <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.7)' }}>→ {a.title}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{a.sub}</p>
                      </div>
                      <button onClick={() => i === 2 ? navigateTo('studio-entry') : toast.success(`Executing: ${a.title}`)}
                        className="text-[11px] px-3 py-1 rounded-full shrink-0 ml-4 transition-all hover:bg-white/[0.04]"
                        style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.02)' }}>
                        Execute →
                      </button>
                    </div>
                  ))}
                </Stagger>
              </div>
            )}

            {/* S7: Footer */}
            {showCard >= 7 && (
              <div ref={latestSectionRef} className="animate-card-in text-center pt-4">
                <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.15)' }}>
                  Last sync: 8:12 AM — Ticketmaster · Klaviyo · Meta · Salesforce · Identity Graph · 5 sources connected
                </p>
              </div>
            )}

            {/* Thinking dots for mid-steps */}
            {step >= 2 && step <= 6 && showCard < step && <ThinkingDots visible={showDots} />}
          </div>
          ) : (
          /* ══ SIGNALS TAB ══ */
          <div className="space-y-6">
            <div style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, letterSpacing: '-0.01em', color: 'rgba(255,255,255,0.85)' }}>
              <span>{signalsGreeting}</span>
              {!signalsDone && <span className="animate-blink" style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>}
            </div>
            {signalsDone && (
              <Stagger active={signalsDone} stagger={150}>
                {SIGNALS.map(s => (
                  <div key={s.label} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 18px' }}>
                    <p className="text-[9px] uppercase tracking-[0.06em] mb-1" style={{ color: 'rgba(255,255,255,0.22)' }}>{s.label}</p>
                    <p className="text-[28px] tabular-nums text-white mb-1" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>{s.delta}</p>
                    <p className="text-[13px] mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.copy}</p>
                    <button onClick={() => s.nav ? navigateTo('studio-entry') : toast(s.cta)}
                      className="text-[11px] transition-colors hover:text-white/50" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {s.cta}
                    </button>
                  </div>
                ))}
              </Stagger>
            )}
          </div>
          )}
        </div>
      </div>

      {/* Play/Pause floating pill */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]">
        <button onClick={() => { if (isComplete) { setStep(0); setShowCard(-1); setConnectorActive(false); setPlaying(true) } else setPlaying(!playing) }}
          className="h-8 px-4 rounded-full text-[11px] transition-all"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: isComplete ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.35)', backdropFilter: 'blur(16px)', fontWeight: 500 }}>
          {isComplete ? '✓ Complete' : playing ? '⏸ Pause' : '▶ Resume'}
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   SCREEN: STUDIO ENTRY
   ══════════════════════════════════════════════════════════ */
function StudioEntry({ navigateTo }: { navigateTo: (v: View) => void }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const presets = [
    { name: "Premium Homeowners Q2", count: 25 },
    { name: "Balanced Scale Campaign", count: 126 },
    { name: "Miami Renters Under 35", count: 89 },
  ]
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
      {/* + Button */}
      <button onClick={() => navigateTo('studio')}
        className="w-12 h-12 rounded-full flex items-center justify-center transition-all mb-4 animate-studio-entry-plus"
        style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.3)' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="10" y1="4" x2="10" y2="16"/><line x1="4" y1="10" x2="16" y2="10"/></svg>
      </button>

      <p className="text-[14px] mb-6 animate-studio-entry-text" style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400, animationDelay: '200ms' }}>
        Start a new audience segment
      </p>

      <div className="flex items-center gap-2.5 animate-studio-entry-pills" style={{ animationDelay: '400ms' }}>
        <div className="relative">
          <button onClick={() => setShowDropdown(!showDropdown)}
            className="h-9 px-4 rounded-full text-[12px] transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.02)' }}>
            Select existing segment
          </button>
          {showDropdown && (
            <div className="absolute top-11 left-0 w-64 rounded-lg overflow-hidden z-10" style={{ background: 'rgba(13,13,15,0.95)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
              {presets.map(p => (
                <button key={p.name} onClick={() => navigateTo('studio')}
                  className="w-full text-left px-4 py-2.5 text-[12px] transition-colors hover:bg-white/[0.04]"
                  style={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {p.name} <span style={{ color: 'rgba(255,255,255,0.2)' }}>· {p.count} records</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => navigateTo('studio')}
          className="h-9 px-4 rounded-full text-[12px] transition-all"
          style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.02)' }}>
          Upload CSV
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   SCREEN: STUDIO (iframe wrapper)
   ══════════════════════════════════════════════════════════ */
function StudioWorkspace({ navigateTo }: { navigateTo: (v: View) => void }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  function handleExport() {
    iframeRef.current?.contentWindow?.postMessage({ type: 'minerva-tour-click', selector: '.mn-workspace-topbar-save' }, '*')
    toast.success("Exporting CSV…")
  }

  return (
    <div className="flex-1 relative">
      <iframe ref={iframeRef} src="/workspace.html"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', background: '#000' }}
        title="Audience Studio" />

      {/* Bottom bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 10, padding: '0 20px', background: 'linear-gradient(transparent, rgba(0,0,0,0.9) 40%)', zIndex: 50,
      }}>
        <button onClick={() => navigateTo('studio-save')} style={{
          height: 36, padding: '0 24px', borderRadius: 100, background: 'rgba(255,255,255,0.88)', color: '#000',
          fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'Overused Grotesk, sans-serif',
        }}>Save Segment</button>
        <button onClick={handleExport} style={{
          height: 36, padding: '0 20px', borderRadius: 100, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)',
          fontSize: 13, fontWeight: 500, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontFamily: 'Overused Grotesk, sans-serif',
        }}>Export CSV</button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   SCREEN: STUDIO SAVE
   ══════════════════════════════════════════════════════════ */
function StudioSave({ navigateTo }: { navigateTo: (v: View) => void }) {
  const [phase, setPhase] = useState<'anim' | 'list'>('anim')
  const segments = [
    { name: "Premium Homeowners $250k+ Q2", scores: "80 – 99", size: "22.3M", email: "82%", saved: "Just now", isNew: true },
    { name: "Balanced Scale Campaign", scores: "60 – 99", size: "112.7M", email: "74%", saved: "Today", isNew: false },
    { name: "Miami Renters Under 35", scores: "20 – 50", size: "41.2M", email: "61%", saved: "Yesterday", isNew: false },
  ]

  useEffect(() => {
    const t = setTimeout(() => setPhase('list'), 2000)
    return () => clearTimeout(t)
  }, [])

  if (phase === 'anim') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="animate-save-check text-[32px] mb-4">✦</div>
        <p className="text-[16px] text-white animate-fade-in-delay-300">Segment saved</p>
        <p className="text-[12px] mt-2 animate-fade-in-delay-500" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Premium Homeowners $250k+ Q2 · 25 records
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center pt-24 px-6">
      <div className="w-full max-w-[640px]">
        <p className="text-[9px] uppercase tracking-[0.06em] mb-4" style={{ color: 'rgba(255,255,255,0.22)' }}>YOUR SEGMENTS</p>
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
          {/* Header */}
          <div className="flex px-[18px] py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="text-[9px] uppercase tracking-[0.06em] flex-1" style={{ color: 'rgba(255,255,255,0.22)' }}>Segment</span>
            <span className="text-[9px] uppercase tracking-[0.06em] w-20 text-right" style={{ color: 'rgba(255,255,255,0.22)' }}>Scores</span>
            <span className="text-[9px] uppercase tracking-[0.06em] w-20 text-right" style={{ color: 'rgba(255,255,255,0.22)' }}>Size</span>
            <span className="text-[9px] uppercase tracking-[0.06em] w-16 text-right" style={{ color: 'rgba(255,255,255,0.22)' }}>Email</span>
            <span className="text-[9px] uppercase tracking-[0.06em] w-20 text-right" style={{ color: 'rgba(255,255,255,0.22)' }}>Saved</span>
          </div>
          {segments.map((s, i) => (
            <div key={s.name} onClick={() => navigateTo('studio')}
              className="flex items-center px-[18px] py-3 cursor-pointer transition-colors hover:bg-white/[0.02]"
              style={{
                borderBottom: i < segments.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                background: s.isNew ? 'rgba(255,255,255,0.04)' : 'transparent',
                boxShadow: s.isNew ? 'inset 2px 0 0 rgba(255,255,255,0.3)' : 'none',
              }}>
              <span className="flex-1 text-[12px]" style={{ color: 'rgba(255,255,255,0.7)' }}>{s.name}</span>
              <span className="w-20 text-right text-[11px] tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.scores}</span>
              <span className="w-20 text-right text-[11px] tabular-nums" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.size}</span>
              <span className="w-16 text-right text-[11px] tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.email}</span>
              <span className="w-20 text-right text-[11px]" style={{ color: s.isNew ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)' }}>{s.saved}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-6 justify-center">
          <button onClick={() => navigateTo('studio-entry')} className="h-9 px-5 rounded-full text-[12px] transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.02)' }}>New Segment</button>
          <button onClick={() => navigateTo('briefing')} className="h-9 px-5 rounded-full text-[12px] transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.02)' }}>Back to Briefing</button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   SCREEN: SETTINGS
   ══════════════════════════════════════════════════════════ */
function SettingsScreen({ navigateTo }: { navigateTo: (v: View) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center pt-24 px-6">
      <div className="w-full max-w-[400px] space-y-8">
        <div>
          <p className="text-[16px] text-white mb-0.5">Sarah Mitchell</p>
          <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.35)' }}>CMO, Miami Dolphins</p>
        </div>

        <div className="space-y-2">
          <button onClick={() => navigateTo('briefing')} className="w-full text-left text-[13px] py-2 transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>→ Start Briefing</button>
          <button onClick={() => navigateTo('studio-entry')} className="w-full text-left text-[13px] py-2 transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>→ Open Audience Studio</button>
        </div>

        <div>
          <p className="text-[9px] uppercase tracking-[0.06em] mb-3" style={{ color: 'rgba(255,255,255,0.22)' }}>DATA SOURCES</p>
          <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Ticketmaster · Klaviyo · Meta · Salesforce · Identity Graph</p>
          <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>Last sync: 8:12 AM · 5 sources connected</p>
        </div>

        <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.15)' }}>
          Minerva™ Intelligence · v1.0 · Built by Amit Roopnarine
        </p>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN APP SHELL
   ══════════════════════════════════════════════════════════ */
export function MinervaApp() {
  const { view, transitioning, navigateTo } = useCanvasTransition()
  const router = useRouter()

  // Listen for notch nav events
  useEffect(() => {
    const goHome = () => navigateTo('home')
    const navSection = (e: Event) => {
      const section = (e as CustomEvent).detail
      if (section === 'studio') navigateTo('studio-entry')
      else if (section === 'briefing') navigateTo('briefing')
    }
    window.addEventListener('minerva-go-home', goHome)
    window.addEventListener('minerva-nav-section', navSection)
    return () => { window.removeEventListener('minerva-go-home', goHome); window.removeEventListener('minerva-nav-section', navSection) }
  }, [navigateTo])

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative" style={{ fontFamily: "'Overused Grotesk', ui-sans-serif, system-ui, sans-serif" }}>

      {/* ═══ CANVAS — transitions between views ═══ */}
      <div className="flex-1 flex flex-col min-h-0" style={{
        opacity: transitioning ? 0 : 1,
        filter: transitioning ? 'blur(6px)' : 'blur(0)',
        transform: transitioning ? 'scale(0.98)' : 'scale(1)',
        transition: transitioning
          ? 'opacity 250ms ease-out, filter 250ms ease-out, transform 250ms ease-out'
          : 'opacity 400ms cubic-bezier(0.22,1,0.36,1), filter 400ms cubic-bezier(0.22,1,0.36,1), transform 400ms cubic-bezier(0.22,1,0.36,1)',
      }}>
        {view === 'home' && <HomeScreen navigateTo={navigateTo} />}
        {view === 'briefing' && <BriefingScreen navigateTo={navigateTo} />}
        {view === 'studio-entry' && <StudioEntry navigateTo={navigateTo} />}
        {view === 'studio' && <StudioWorkspace navigateTo={navigateTo} />}
        {view === 'studio-save' && <StudioSave navigateTo={navigateTo} />}
        {view === 'settings' && <SettingsScreen navigateTo={navigateTo} />}
      </div>
    </div>
  )
}
