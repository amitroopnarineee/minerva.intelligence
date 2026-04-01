"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"



const LEFT_NAV = [
  { label: "Home", href: "/" },
  { label: "Insights", href: "/command-center" },
]
const RIGHT_NAV = [
  { label: "Prospects", href: "/prospecting" },
  { label: "Audience", href: "/person-search" },
]

type NotchState = "hidden" | "peek" | "open"

function MinervaLogo({ size = 16 }: { size?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/minerva-logo-white.svg" alt="Minerva" width={size} height={size} style={{ display: 'block' }} />
}

const NAV_ITEMS = [
  { type: "link" as const, label: "Home", href: "/", paths: ["/"] },
  { type: "link" as const, label: "Insights", href: "/command-center", paths: ["/command-center"] },
  { type: "link" as const, label: "Prospects", href: "/prospecting", paths: ["/people", "/prospecting"] },
  { type: "link" as const, label: "Audience", href: "/person-search", paths: ["/owned-audience", "/person-search"] },
]

export function MinervaMenuBar() {
  const [notchState, setNotchState] = useState<NotchState>("hidden")
  const stateRef = useRef<NotchState>("hidden")
  const notchRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [navVisible, setNavVisible] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Hide nav on route change
  useEffect(() => { setNavVisible(false) }, [pathname])

  const go = useCallback((s: NotchState) => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
    stateRef.current = s; setNotchState(s)
  }, [])

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const s = stateRef.current
      const rect = notchRef.current?.getBoundingClientRect()
      const overNotch = rect && e.clientX >= rect.left - 10 && e.clientX <= rect.right + 10 && e.clientY <= rect.bottom + 10 && e.clientY >= 0
      if (e.clientY <= 50 && s === "hidden") { go("peek"); return }
      if (s === "peek") {
        if (e.clientY <= 50 || overNotch) { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null } }
        else if (!timerRef.current) { timerRef.current = setTimeout(() => { if (stateRef.current === "peek") go("hidden") }, 400) }
      }
    }
    document.addEventListener("mousemove", handleMove)
    return () => document.removeEventListener("mousemove", handleMove)
  }, [go])

  const handleNotchClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-nav]")) return
    e.stopPropagation()
    if (stateRef.current === "peek" || stateRef.current === "hidden") go("open")
    else { go("peek"); timerRef.current = setTimeout(() => { if (stateRef.current === "peek") go("hidden") }, 1200) }
  }, [go])

  const handleBackdrop = useCallback(() => {
    if (stateRef.current === "open") { go("peek"); timerRef.current = setTimeout(() => { if (stateRef.current === "peek") go("hidden") }, 800) }
  }, [go])

  const handleNav = useCallback((href: string) => {
    router.push(href); go("peek")
    timerRef.current = setTimeout(() => { if (stateRef.current === "peek") go("hidden") }, 600)
  }, [router, go])

  const isOpen = notchState === "open"
  const isPeek = notchState === "peek"
  const isVisible = notchState !== "hidden"

  return (
    <>
      {/* ═══ STATIC HEADER ═══ */}
      <div className="mn-menubar mn-menubar-static flex items-center justify-between px-5 py-2.5 relative z-30">
        <div className="mn-menubar-left flex items-center gap-1">
          <button onClick={() => { router.push('/'); window.dispatchEvent(new Event('minerva-go-home')) }} className="mn-menubar-logo flex items-center gap-2 mr-3 hover:opacity-80 transition-opacity">
            <MinervaLogo size={16} />
            <span className="mn-menubar-brand text-[13px] font-semibold tracking-tight">Minerva</span>
          </button>
        </div>

        <div className="mn-menubar-right flex items-center gap-1">
          {NAV_ITEMS.map((item, i) => (
            <div key={item.label} className="relative"
              style={{
                opacity: navVisible ? 1 : 0,
                transform: navVisible ? "translateX(0)" : "translateX(12px)",
                transition: `opacity 250ms ease ${navVisible ? i * 60 : (NAV_ITEMS.length - 1 - i) * 40}ms, transform 300ms ease ${navVisible ? i * 60 : (NAV_ITEMS.length - 1 - i) * 40}ms`,
                pointerEvents: navVisible ? "auto" : "none",
              }}>
              <button onClick={() => router.push(item.href!)}
                className={`text-[13px] px-2.5 py-1 rounded-md transition-colors ${item.paths.includes(pathname) ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}>
                {item.label}
              </button>
            </div>
          ))}
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User"
            onClick={() => setNavVisible(v => !v)}
            className="h-5 w-5 ml-2 rounded-full object-cover ring-1 ring-white/10 hover:ring-white/30 transition-all cursor-pointer" />
        </div>
      </div>

      {/* ═══ DYNAMIC NOTCH ═══ */}
      <div className={`fixed inset-0 z-[99] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        onClick={handleBackdrop}
        style={{ background: isOpen ? "rgb(0 0 0 / 84%)" : "rgba(0,0,0,0)", backdropFilter: isOpen ? "blur(2px)" : "none", transition: "background 500ms, backdrop-filter 500ms" }} />

      <div className="fixed top-0 left-0 right-0 h-[10px] bg-[#0a0a0a] z-[150]"
        style={{ transform: isVisible ? "translateY(0)" : "translateY(-100%)", transition: "transform 600ms cubic-bezier(.32,.72,0,1)" }} />

      <div className="fixed top-0 left-1/2 z-[200] flex flex-col items-center" style={{ transform: "translateX(-50%)" }}>
        <div ref={notchRef} onClick={handleNotchClick}
          className="relative flex items-center justify-center cursor-pointer select-none"
          style={{
            background: "#0a0a0a",
            width: isOpen ? 480 : isPeek ? 120 : 80,
            height: isOpen ? 50 : isPeek ? 34 : 0,
            borderRadius: isOpen ? "0 0 28px 28px" : isPeek ? "0 0 18px 18px" : "0 0 16px 16px",
            padding: isOpen ? "8px 32px" : isPeek ? "8px 16px" : "0 16px",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(-20px)",
            transition: "width 700ms cubic-bezier(.32,.72,0,1), height 500ms cubic-bezier(.32,.72,0,1), border-radius 600ms cubic-bezier(.32,.72,0,1), padding 500ms cubic-bezier(.32,.72,0,1), opacity 400ms ease, transform 500ms cubic-bezier(.32,.72,0,1)",
          }}>
          <svg className="absolute top-0 pointer-events-none" style={{ right: "100%", width: 16, height: 16, opacity: isVisible ? 1 : 0, transition: "opacity 400ms ease 100ms" }} viewBox="0 0 20 20"><path d="M20 0L20 20C20 8.954 11.046 0 0 0L20 0Z" fill="#0a0a0a" /></svg>
          <svg className="absolute top-0 pointer-events-none" style={{ left: "100%", width: 16, height: 16, opacity: isVisible ? 1 : 0, transition: "opacity 400ms ease 100ms" }} viewBox="0 0 20 20"><path d="M0 0L0 20C0 8.954 8.954 0 20 0L0 0Z" fill="#0a0a0a" /></svg>

          <div className="flex items-center overflow-hidden"
            style={{ maxWidth: isOpen ? 300 : 0, opacity: isOpen ? 1 : 0, marginRight: isOpen ? 14 : 0, transition: "max-width 700ms cubic-bezier(.32,.72,0,1), opacity 500ms, margin 700ms cubic-bezier(.32,.72,0,1)" }}>
            {LEFT_NAV.map((item, i) => (
              <span key={item.href} data-nav="true" onClick={() => handleNav(item.href)}
                style={{ fontSize: 13, fontWeight: pathname === item.href ? 500 : 400, whiteSpace: "nowrap", padding: "4px 14px", borderRadius: 20, cursor: "pointer", color: pathname === item.href ? "#fff" : "rgba(255,255,255,0.5)", opacity: isOpen ? 1 : 0, transform: isOpen ? "translateY(0) scale(1)" : "translateY(6px) scale(0.92)", transition: `all 450ms cubic-bezier(.32,.72,0,1) ${isOpen ? 100 + i * 60 : 0}ms` }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#fff"; (e.target as HTMLElement).style.background = "rgba(255,255,255,0.1)" }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = pathname === item.href ? "#fff" : "rgba(255,255,255,0.5)"; (e.target as HTMLElement).style.background = "transparent" }}>
                {item.label}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-center shrink-0 z-[5] text-white"><MinervaLogo size={18} /></div>
          <div className="flex items-center overflow-hidden"
            style={{ maxWidth: isOpen ? 300 : 0, opacity: isOpen ? 1 : 0, marginLeft: isOpen ? 14 : 0, transition: "max-width 700ms cubic-bezier(.32,.72,0,1), opacity 500ms, margin 700ms cubic-bezier(.32,.72,0,1)" }}>
            {RIGHT_NAV.map((item, i) => (
              <span key={item.href} data-nav="true" onClick={() => handleNav(item.href)}
                style={{ fontSize: 13, fontWeight: pathname === item.href ? 500 : 400, whiteSpace: "nowrap", padding: "4px 14px", borderRadius: 20, cursor: "pointer", color: pathname === item.href ? "#fff" : "rgba(255,255,255,0.5)", opacity: isOpen ? 1 : 0, transform: isOpen ? "translateY(0) scale(1)" : "translateY(6px) scale(0.92)", transition: `all 450ms cubic-bezier(.32,.72,0,1) ${isOpen ? 100 + i * 60 : 0}ms` }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#fff"; (e.target as HTMLElement).style.background = "rgba(255,255,255,0.1)" }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = pathname === item.href ? "#fff" : "rgba(255,255,255,0.5)"; (e.target as HTMLElement).style.background = "transparent" }}>
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
