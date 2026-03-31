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
  const stateRef = useRef<NotchState>("hidden")
  const notchRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const go = useCallback((s: NotchState) => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
    stateRef.current = s
    setState(s)
  }, [])

  // Mouse proximity — uses ref to avoid stale closure
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const s = stateRef.current
      const rect = notchRef.current?.getBoundingClientRect()
      const overNotch = rect && e.clientX >= rect.left - 10 && e.clientX <= rect.right + 10 && e.clientY <= rect.bottom + 10 && e.clientY >= 0

      // Reveal on hover near top
      if (e.clientY <= 60 && s === "hidden") {
        go("peek")
        return
      }

      // While peeking: stay if near top or over notch, hide otherwise
      if (s === "peek") {
        if (e.clientY <= 60 || overNotch) {
          if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
        } else {
          if (!timerRef.current) {
            timerRef.current = setTimeout(() => {
              if (stateRef.current === "peek") go("hidden")
            }, 400)
          }
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
    if (s === "peek" || s === "hidden") {
      go("open")
    } else if (s === "open") {
      go("peek")
      timerRef.current = setTimeout(() => {
        if (stateRef.current === "peek") go("hidden")
      }, 1200)
    }
  }, [go])

  const handleBackdrop = useCallback(() => {
    if (stateRef.current === "open") {
      go("peek")
      timerRef.current = setTimeout(() => {
        if (stateRef.current === "peek") go("hidden")
      }, 800)
    }
  }, [go])

  const handleNav = useCallback((href: string) => {
    router.push(href)
    go("peek")
    timerRef.current = setTimeout(() => {
      if (stateRef.current === "peek") go("hidden")
    }, 600)
  }, [router, go])

  const isOpen = state === "open"
  const isPeek = state === "peek"
  const isVisible = state !== "hidden"

  return (
    <>
      {/* Top bar */}
      <div
        className="mn-menubar-topbar fixed top-0 left-0 right-0 h-[10px] bg-[#0a0a0a] z-[150]"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 600ms cubic-bezier(.32,.72,0,1)",
        }}
      />

      {/* Backdrop */}
      <div
        className={`mn-menubar-backdrop fixed inset-0 z-[99] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        onClick={handleBackdrop}
        style={{
          background: isOpen ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0)",
          backdropFilter: isOpen ? "blur(2px)" : "none",
          WebkitBackdropFilter: isOpen ? "blur(2px)" : "none",
          transition: "background 500ms ease, backdrop-filter 500ms ease",
        }}
      />

      {/* Notch wrapper */}
      <div className="mn-menubar-wrapper fixed top-0 left-1/2 z-[200] flex flex-col items-center" style={{ transform: "translateX(-50%)" }}>
        <div
          ref={notchRef}
          onClick={handleNotchClick}
          className="mn-menubar mn-notch relative flex items-center justify-center cursor-pointer select-none"
          style={{
            background: "#0a0a0a",
            width: isOpen ? 520 : isPeek ? 180 : 120,
            height: isOpen ? 54 : isPeek ? 38 : 0,
            borderRadius: isOpen ? "0 0 30px 30px" : isPeek ? "0 0 22px 22px" : "0 0 20px 20px",
            padding: isOpen ? "8px 36px" : isPeek ? "8px 20px" : "0 20px",
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
          {/* Ear curves */}
          <svg
            className="mn-notch-ear-l absolute top-0 pointer-events-none"
            style={{ right: "100%", width: 18, height: 18, opacity: isVisible ? 1 : 0, transition: "opacity 400ms ease 100ms" }}
            viewBox="0 0 20 20"
          >
            <path d="M20 0L20 20C20 8.954 11.046 0 0 0L20 0Z" fill="#0a0a0a" />
          </svg>
          <svg
            className="mn-notch-ear-r absolute top-0 pointer-events-none"
            style={{ left: "100%", width: 18, height: 18, opacity: isVisible ? 1 : 0, transition: "opacity 400ms ease 100ms" }}
            viewBox="0 0 20 20"
          >
            <path d="M0 0L0 20C0 8.954 8.954 0 20 0L0 0Z" fill="#0a0a0a" />
          </svg>

          {/* Left nav */}
          <div
            className="mn-notch-nav-left flex items-center overflow-hidden"
            style={{
              maxWidth: isOpen ? 300 : 0,
              opacity: isOpen ? 1 : 0,
              marginRight: isOpen ? 16 : 0,
              transition: "max-width 700ms cubic-bezier(.32,.72,0,1), opacity 500ms cubic-bezier(.32,.72,0,1), margin 700ms cubic-bezier(.32,.72,0,1)",
            }}
          >
            {LEFT_NAV.map((item, i) => (
              <span
                key={item.href}
                data-nav="true"
                onClick={() => handleNav(item.href)}
                className={`mn-notch-item ${pathname === item.href ? "text-white font-medium" : "text-white/55"}`}
                style={{
                  fontSize: "13.5px",
                  fontWeight: pathname === item.href ? 500 : 400,
                  letterSpacing: "0.01em",
                  whiteSpace: "nowrap",
                  padding: "5px 16px",
                  borderRadius: 20,
                  cursor: "pointer",
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateY(0) scale(1)" : "translateY(6px) scale(0.92)",
                  transition: `color 300ms ease, background 300ms ease, opacity 450ms cubic-bezier(.32,.72,0,1) ${isOpen ? 120 + i * 60 : 0}ms, transform 450ms cubic-bezier(.32,.72,0,1) ${isOpen ? 120 + i * 60 : 0}ms`,
                }}
                onMouseEnter={(e) => { if (pathname !== item.href) { (e.target as HTMLElement).style.color = "#fff"; (e.target as HTMLElement).style.background = "rgba(255,255,255,0.1)" } }}
                onMouseLeave={(e) => { if (pathname !== item.href) { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.55)"; (e.target as HTMLElement).style.background = "transparent" } }}
              >
                {item.label}
              </span>
            ))}
          </div>

          {/* Logo */}
          <div className="mn-notch-logo flex items-center justify-center shrink-0 z-[5]">
            <span
              className="mn-notch-logo-text text-white font-semibold"
              style={{ fontSize: 13, letterSpacing: "-0.01em", filter: "drop-shadow(0 0 8px rgba(255,255,255,0.15))" }}
            >
              Minerva
            </span>
          </div>

          {/* Right nav */}
          <div
            className="mn-notch-nav-right flex items-center overflow-hidden"
            style={{
              maxWidth: isOpen ? 300 : 0,
              opacity: isOpen ? 1 : 0,
              marginLeft: isOpen ? 16 : 0,
              transition: "max-width 700ms cubic-bezier(.32,.72,0,1), opacity 500ms cubic-bezier(.32,.72,0,1), margin 700ms cubic-bezier(.32,.72,0,1)",
            }}
          >
            {RIGHT_NAV.map((item, i) => (
              <span
                key={item.href}
                data-nav="true"
                onClick={() => handleNav(item.href)}
                className={`mn-notch-item ${pathname === item.href ? "text-white font-medium" : "text-white/55"}`}
                style={{
                  fontSize: "13.5px",
                  fontWeight: pathname === item.href ? 500 : 400,
                  letterSpacing: "0.01em",
                  whiteSpace: "nowrap",
                  padding: "5px 16px",
                  borderRadius: 20,
                  cursor: "pointer",
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateY(0) scale(1)" : "translateY(6px) scale(0.92)",
                  transition: `color 300ms ease, background 300ms ease, opacity 450ms cubic-bezier(.32,.72,0,1) ${isOpen ? 120 + i * 60 : 0}ms, transform 450ms cubic-bezier(.32,.72,0,1) ${isOpen ? 120 + i * 60 : 0}ms`,
                }}
                onMouseEnter={(e) => { if (pathname !== item.href) { (e.target as HTMLElement).style.color = "#fff"; (e.target as HTMLElement).style.background = "rgba(255,255,255,0.1)" } }}
                onMouseLeave={(e) => { if (pathname !== item.href) { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.55)"; (e.target as HTMLElement).style.background = "transparent" } }}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
