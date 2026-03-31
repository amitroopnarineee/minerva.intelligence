"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"

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
  const [state, setState] = useState<NotchState>("hidden")
  const [mounted, setMounted] = useState(false)
  const notchRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => { setMounted(true) }, [])

  const go = useCallback((s: NotchState) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setState(s)
  }, [])

  // Mouse proximity detection
  useEffect(() => {
    if (!mounted) return
    const handleMove = (e: MouseEvent) => {
      const rect = notchRef.current?.getBoundingClientRect()
      const overNotch = rect && e.clientX >= rect.left - 5 && e.clientX <= rect.right + 5 && e.clientY <= rect.bottom + 5 && e.clientY >= 0

      if (e.clientY <= 50 && state === "hidden") {
        go("peek")
      }
      if (state === "peek") {
        if (e.clientY <= 50 || overNotch) {
          if (timerRef.current) clearTimeout(timerRef.current)
        } else {
          if (timerRef.current) clearTimeout(timerRef.current)
          timerRef.current = setTimeout(() => setState(s => s === "peek" ? "hidden" : s), 300)
        }
      }
    }
    document.addEventListener("mousemove", handleMove)
    return () => document.removeEventListener("mousemove", handleMove)
  }, [mounted, state, go])

  const handleNotchClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).dataset.nav) return
    if (timerRef.current) clearTimeout(timerRef.current)
    if (state === "peek" || state === "hidden") go("open")
    else {
      go("peek")
      timerRef.current = setTimeout(() => setState(s => s === "peek" ? "hidden" : s), 1000)
    }
  }, [state, go])

  const handleBackdrop = useCallback(() => {
    if (state === "open") {
      go("peek")
      timerRef.current = setTimeout(() => setState(s => s === "peek" ? "hidden" : s), 600)
    }
  }, [state, go])

  const handleNav = useCallback((href: string) => {
    router.push(href)
    go("peek")
    timerRef.current = setTimeout(() => setState(s => s === "peek" ? "hidden" : s), 600)
  }, [router, go])

  // Emit events for chat toggle
  const handleSparkle = useCallback(() => {
    window.dispatchEvent(new CustomEvent("minerva-chat-toggle"))
    go("peek")
    timerRef.current = setTimeout(() => setState(s => s === "peek" ? "hidden" : s), 400)
  }, [go])

  if (!mounted) return null

  const isOpen = state === "open"
  const isVisible = state !== "hidden"

  return (
    <>
      {/* Top bar */}
      <div className={`mn-menubar-topbar fixed top-0 left-0 right-0 h-[10px] bg-[#0a0a0a] z-[150] transition-transform duration-[600ms] ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
        style={{ transitionTimingFunction: "cubic-bezier(.32,.72,0,1)" }} />

      {/* Backdrop */}
      <div className={`mn-menubar-backdrop fixed inset-0 z-[99] transition-all duration-500 ${isOpen ? "bg-black/8 pointer-events-auto backdrop-blur-[2px]" : "bg-transparent pointer-events-none"}`}
        onClick={handleBackdrop} />

      {/* Notch */}
      <div className="mn-menubar-wrapper fixed top-0 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center">
        <div ref={notchRef} onClick={handleNotchClick}
          className={`mn-menubar mn-notch relative flex items-center justify-center cursor-pointer select-none bg-[#0a0a0a] transition-all ${
            isOpen ? "mn-notch-open w-[520px] h-[54px] rounded-b-[30px] px-9 opacity-100 translate-y-0"
            : isVisible ? "mn-notch-peek w-[180px] h-[38px] rounded-b-[22px] px-5 opacity-100 translate-y-0"
            : "mn-notch-hidden w-[120px] h-0 rounded-b-[20px] px-5 opacity-0 -translate-y-5"
          }`}
          style={{ transitionDuration: "500ms, 500ms, 600ms, 500ms, 400ms, 500ms", transitionTimingFunction: "cubic-bezier(.32,.72,0,1)" }}
        >
          {/* Ear curves */}
          <svg className={`mn-notch-ear-l absolute top-0 right-full w-[18px] h-[18px] pointer-events-none transition-opacity duration-400 ${isVisible ? "opacity-100" : "opacity-0"}`}
            viewBox="0 0 20 20"><path d="M20 0L20 20C20 8.954 11.046 0 0 0L20 0Z" fill="#0a0a0a"/></svg>
          <svg className={`mn-notch-ear-r absolute top-0 left-full w-[18px] h-[18px] pointer-events-none transition-opacity duration-400 ${isVisible ? "opacity-100" : "opacity-0"}`}
            viewBox="0 0 20 20"><path d="M0 0L0 20C0 8.954 8.954 0 20 0L0 0Z" fill="#0a0a0a"/></svg>

          {/* Left nav */}
          <div className={`mn-notch-nav-left flex items-center overflow-hidden transition-all ${isOpen ? "max-w-[300px] opacity-100 mr-4" : "max-w-0 opacity-0 mr-0"}`}
            style={{ transitionDuration: "700ms, 500ms, 700ms", transitionTimingFunction: "cubic-bezier(.32,.72,0,1)" }}>
            {LEFT_NAV.map((item, i) => (
              <span key={item.href} data-nav="true" onClick={() => handleNav(item.href)}
                className={`mn-notch-item mn-notch-item-l${i} text-[13.5px] font-normal tracking-[0.01em] whitespace-nowrap px-4 py-[5px] rounded-[20px] cursor-pointer transition-all ${
                  isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-1.5 scale-[0.92]"
                } ${pathname === item.href ? "text-white font-medium" : "text-white/55 hover:text-white hover:bg-white/10 active:scale-[0.96] active:bg-white/15"}`}
                style={{ transitionDelay: isOpen ? `${120 + i * 60}ms` : "0ms", transitionDuration: "450ms", transitionTimingFunction: "cubic-bezier(.32,.72,0,1)" }}>
                {item.label}
              </span>
            ))}
          </div>

          {/* Logo */}
          <div className={`mn-notch-logo flex items-center justify-center shrink-0 z-5 transition-transform duration-500 ${state === "peek" ? "hover:scale-[1.08]" : ""}`}
            style={{ transitionTimingFunction: "cubic-bezier(.32,.72,0,1)" }}>
            <span className="mn-notch-logo-text text-white text-[13px] font-semibold tracking-tight" style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.15))" }}>
              Minerva
            </span>
          </div>

          {/* Right nav */}
          <div className={`mn-notch-nav-right flex items-center overflow-hidden transition-all ${isOpen ? "max-w-[300px] opacity-100 ml-4" : "max-w-0 opacity-0 ml-0"}`}
            style={{ transitionDuration: "700ms, 500ms, 700ms", transitionTimingFunction: "cubic-bezier(.32,.72,0,1)" }}>
            {RIGHT_NAV.map((item, i) => (
              <span key={item.href} data-nav="true" onClick={() => handleNav(item.href)}
                className={`mn-notch-item mn-notch-item-r${i} text-[13.5px] font-normal tracking-[0.01em] whitespace-nowrap px-4 py-[5px] rounded-[20px] cursor-pointer transition-all ${
                  isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-1.5 scale-[0.92]"
                } ${pathname === item.href ? "text-white font-medium" : "text-white/55 hover:text-white hover:bg-white/10 active:scale-[0.96] active:bg-white/15"}`}
                style={{ transitionDelay: isOpen ? `${120 + i * 60}ms` : "0ms", transitionDuration: "450ms", transitionTimingFunction: "cubic-bezier(.32,.72,0,1)" }}>
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
