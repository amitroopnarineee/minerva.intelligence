"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Search, Sparkles } from "lucide-react"

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "People", href: "/people" },
  { label: "Analytics", href: "/analytics" },
  { label: "Settings", href: "/integrations" },
]

const LEFT_NAV = [
  { label: "Home", href: "/" },
  { label: "People", href: "/people" },
]
const RIGHT_NAV = [
  { label: "Analytics", href: "/analytics" },
  { label: "Settings", href: "/integrations" },
]

type NotchState = "hidden" | "peek" | "open"

export function MinervaMenuBar() {
  const [notchState, setNotchState] = useState<NotchState>("hidden")
  const stateRef = useRef<NotchState>("hidden")
  const notchRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const go = useCallback((s: NotchState) => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
    stateRef.current = s
    setNotchState(s)
  }, [])

  // Mouse proximity for notch
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const s = stateRef.current
      const rect = notchRef.current?.getBoundingClientRect()
      const overNotch = rect && e.clientX >= rect.left - 10 && e.clientX <= rect.right + 10 && e.clientY <= rect.bottom + 10 && e.clientY >= 0

      if (e.clientY <= 50 && s === "hidden") {
        go("peek")
        return
      }
      if (s === "peek") {
        if (e.clientY <= 50 || overNotch) {
          if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
        } else if (!timerRef.current) {
          timerRef.current = setTimeout(() => { if (stateRef.current === "peek") go("hidden") }, 400)
        }
      }
    }
    document.addEventListener("mousemove", handleMove)
    return () => document.removeEventListener("mousemove", handleMove)
  }, [go])

  const handleNotchClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-nav]")) return
    e.stopPropagation()
    const s = stateRef.current
    if (s === "peek" || s === "hidden") go("open")
    else {
      go("peek")
      timerRef.current = setTimeout(() => { if (stateRef.current === "peek") go("hidden") }, 1200)
    }
  }, [go])

  const handleBackdrop = useCallback(() => {
    if (stateRef.current === "open") {
      go("peek")
      timerRef.current = setTimeout(() => { if (stateRef.current === "peek") go("hidden") }, 800)
    }
  }, [go])

  const handleNav = useCallback((href: string) => {
    router.push(href)
    go("peek")
    timerRef.current = setTimeout(() => { if (stateRef.current === "peek") go("hidden") }, 600)
  }, [router, go])

  const isOpen = notchState === "open"
  const isPeek = notchState === "peek"
  const isVisible = notchState !== "hidden"

  // Logo symbol
  const LogoSymbol = () => (
    <svg className="mn-notch-logo-svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="1" y="1" width="14" height="14" rx="3" fill="white" />
    </svg>
  )

  return (
    <>
      {/* ═══ STATIC HEADER — always visible ═══ */}
      <div className="mn-menubar mn-menubar-static flex items-center justify-between px-5 py-2.5 relative z-30">
        <div className="mn-menubar-left flex items-center gap-1">
          {/* Logo + name */}
          <button onClick={() => router.push("/")} className="mn-menubar-logo flex items-center gap-2 mr-3 hover:opacity-80 transition-opacity">
            <svg width="14" height="14" viewBox="0 0 16 16"><rect x="1" y="1" width="14" height="14" rx="3" fill="currentColor" /></svg>
            <span className="mn-menubar-brand text-[13px] font-semibold tracking-tight">Minerva</span>
          </button>
          {/* Nav items */}
          {NAV_ITEMS.map((item) => (
            <button key={item.href} onClick={() => router.push(item.href)}
              className={`mn-menubar-item text-[13px] px-2.5 py-1 rounded-md transition-colors ${
                pathname === item.href ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              }`}>
              {item.label}
            </button>
          ))}
          {/* Search */}
          <button onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
            className="mn-menubar-search flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground ml-2 transition-colors">
            <Search className="h-3.5 w-3.5" /> Search
          </button>
        </div>
        <div className="mn-menubar-right flex items-center gap-3">
          <button onClick={() => window.dispatchEvent(new CustomEvent("minerva-chat-toggle"))}
            className="mn-menubar-ai text-muted-foreground hover:text-foreground transition-colors">
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ═══ DYNAMIC NOTCH — overlays on hover ═══ */}

      {/* Notch backdrop */}
      <div
        className={`mn-menubar-backdrop fixed inset-0 z-[99] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        onClick={handleBackdrop}
        style={{
          background: isOpen ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0)",
          backdropFilter: isOpen ? "blur(2px)" : "none",
          transition: "background 500ms ease, backdrop-filter 500ms ease",
        }}
      />

      {/* Top bar (slides down with notch) */}
      <div className="mn-menubar-topbar fixed top-0 left-0 right-0 h-[10px] bg-[#0a0a0a] z-[150]"
        style={{ transform: isVisible ? "translateY(0)" : "translateY(-100%)", transition: "transform 600ms cubic-bezier(.32,.72,0,1)" }} />

      {/* Notch */}
      <div className="mn-menubar-wrapper fixed top-0 left-1/2 z-[200] flex flex-col items-center" style={{ transform: "translateX(-50%)" }}>
        <div ref={notchRef} onClick={handleNotchClick}
          className="mn-menubar mn-notch relative flex items-center justify-center cursor-pointer select-none"
          style={{
            background: "#0a0a0a",
            width: isOpen ? 480 : isPeek ? 120 : 80,
            height: isOpen ? 50 : isPeek ? 34 : 0,
            borderRadius: isOpen ? "0 0 28px 28px" : isPeek ? "0 0 18px 18px" : "0 0 16px 16px",
            padding: isOpen ? "8px 32px" : isPeek ? "8px 16px" : "0 16px",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(-20px)",
            transition: [
              "width 700ms cubic-bezier(.32,.72,0,1)",
              "height 500ms cubic-bezier(.32,.72,0,1)",
              "border-radius 600ms cubic-bezier(.32,.72,0,1)",
              "padding 500ms cubic-bezier(.32,.72,0,1)",
              "opacity 400ms ease",
              "transform 500ms cubic-bezier(.32,.72,0,1)",
            ].join(", "),
          }}
        >
          {/* Ears */}
          <svg className="mn-notch-ear-l absolute top-0 pointer-events-none" style={{ right: "100%", width: 16, height: 16, opacity: isVisible ? 1 : 0, transition: "opacity 400ms ease 100ms" }} viewBox="0 0 20 20">
            <path d="M20 0L20 20C20 8.954 11.046 0 0 0L20 0Z" fill="#0a0a0a" />
          </svg>
          <svg className="mn-notch-ear-r absolute top-0 pointer-events-none" style={{ left: "100%", width: 16, height: 16, opacity: isVisible ? 1 : 0, transition: "opacity 400ms ease 100ms" }} viewBox="0 0 20 20">
            <path d="M0 0L0 20C0 8.954 8.954 0 20 0L0 0Z" fill="#0a0a0a" />
          </svg>

          {/* Left nav */}
          <div className="mn-notch-nav-left flex items-center overflow-hidden"
            style={{ maxWidth: isOpen ? 300 : 0, opacity: isOpen ? 1 : 0, marginRight: isOpen ? 14 : 0, transition: "max-width 700ms cubic-bezier(.32,.72,0,1), opacity 500ms cubic-bezier(.32,.72,0,1), margin 700ms cubic-bezier(.32,.72,0,1)" }}>
            {LEFT_NAV.map((item, i) => (
              <span key={item.href} data-nav="true" onClick={() => handleNav(item.href)}
                style={{
                  fontSize: "13px", fontWeight: pathname === item.href ? 500 : 400, letterSpacing: "0.01em", whiteSpace: "nowrap",
                  padding: "4px 14px", borderRadius: 20, cursor: "pointer", color: pathname === item.href ? "#fff" : "rgba(255,255,255,0.5)",
                  opacity: isOpen ? 1 : 0, transform: isOpen ? "translateY(0) scale(1)" : "translateY(6px) scale(0.92)",
                  transition: `all 450ms cubic-bezier(.32,.72,0,1) ${isOpen ? 100 + i * 60 : 0}ms`,
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#fff"; (e.target as HTMLElement).style.background = "rgba(255,255,255,0.1)" }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = pathname === item.href ? "#fff" : "rgba(255,255,255,0.5)"; (e.target as HTMLElement).style.background = "transparent" }}>
                {item.label}
              </span>
            ))}
          </div>

          {/* Logo symbol */}
          <div className="mn-notch-logo flex items-center justify-center shrink-0 z-[5]">
            <LogoSymbol />
          </div>

          {/* Right nav */}
          <div className="mn-notch-nav-right flex items-center overflow-hidden"
            style={{ maxWidth: isOpen ? 300 : 0, opacity: isOpen ? 1 : 0, marginLeft: isOpen ? 14 : 0, transition: "max-width 700ms cubic-bezier(.32,.72,0,1), opacity 500ms cubic-bezier(.32,.72,0,1), margin 700ms cubic-bezier(.32,.72,0,1)" }}>
            {RIGHT_NAV.map((item, i) => (
              <span key={item.href} data-nav="true" onClick={() => handleNav(item.href)}
                style={{
                  fontSize: "13px", fontWeight: pathname === item.href ? 500 : 400, letterSpacing: "0.01em", whiteSpace: "nowrap",
                  padding: "4px 14px", borderRadius: 20, cursor: "pointer", color: pathname === item.href ? "#fff" : "rgba(255,255,255,0.5)",
                  opacity: isOpen ? 1 : 0, transform: isOpen ? "translateY(0) scale(1)" : "translateY(6px) scale(0.92)",
                  transition: `all 450ms cubic-bezier(.32,.72,0,1) ${isOpen ? 100 + i * 60 : 0}ms`,
                }}
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
