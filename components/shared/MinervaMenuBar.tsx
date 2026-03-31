"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Search, Sparkles, Moon, Sun, Bell } from "lucide-react"
import { useTheme } from "next-themes"

interface DropdownItem { label: string; href: string }

const HOME_ITEMS: DropdownItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "Command Center", href: "/command-center" },
]

const PEOPLE_ITEMS: DropdownItem[] = [
  { label: "All People", href: "/people" },
  { label: "Person Search", href: "/person-search" },
  { label: "Prospecting", href: "/prospecting" },
  { label: "Owned Audience", href: "/owned-audience" },
  { label: "Bulk Enrich", href: "/bulk-enrich" },
]
const SETTINGS_ITEMS: DropdownItem[] = [
  { label: "Integrations", href: "/integrations" },
  { label: "Usage", href: "/usage" },
  { label: "Get Started", href: "/get-started" },
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

/* ── Dropdown menu ── */
function MenuDropdown({ items, open, onClose, onNav }: { items: DropdownItem[]; open: boolean; onClose: () => void; onNav: (href: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open, onClose])
  if (!open) return null
  return (
    <div ref={ref} className="mn-menubar-dropdown absolute top-full left-0 mt-1 min-w-[180px] bg-[#1a1a1a] border border-white/10 rounded-xl py-1.5 shadow-2xl z-50"
      style={{ backdropFilter: "blur(20px)" }}>
      {items.map((item) => (
        <button key={item.href} onClick={() => { onNav(item.href); onClose() }}
          className="mn-menubar-dropdown-item w-full text-left px-4 py-2 text-[13px] text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors">
          {item.label}
        </button>
      ))}
    </div>
  )
}

/* ── Minerva Logo SVG ── */
function MinervaLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 223 223" fill="none">
      <path d="M87.84 150.07C92.88 142.7 98.2 133.53 104.08 122.05C105.4 119.36 106.59 117.07 107.66 115.16C98.69 124.76 81.55 151.08 63.49 145.82C39.12 138.73 85.48 108.13 28.98 136.22C28.26 136.58 27.54 136.83 26.82 137.02C32.77 143.14 38.5 149.47 44.26 155.66C47.9 159.58 51.48 163.94 55.55 167.4C61.66 172.6 69.13 168.97 74.63 164.76C79.87 160.75 84.13 155.49 87.84 150.07Z" fill="currentColor"/>
      <path d="M47.86 122.86C54.41 123.73 61.14 123.03 67.59 121.82C76.37 120.18 86.61 117.45 98.89 113.49C101.73 112.52 104.19 111.75 106.3 111.15C93.17 111.59 62.43 118.09 53.38 101.6C41.16 79.36 95.58 90.49 35.77 70.41C35.01 70.15 34.33 69.82 33.69 69.45C33.57 77.98 33.13 86.52 32.82 94.96C32.63 100.3 32.08 105.91 32.51 111.24C33.15 119.24 41 121.95 47.86 122.86Z" fill="currentColor"/>
      <path d="M109.84 98.57C110.8 101.41 111.58 103.87 112.18 105.98C111.73 92.85 105.24 62.12 121.73 53.06C143.97 40.84 132.83 95.26 152.92 35.45C153.17 34.69 153.5 34.01 153.87 33.37C145.34 33.25 136.81 32.81 128.36 32.5C123.03 32.31 117.41 31.76 112.08 32.19C104.08 32.83 101.37 40.68 100.46 47.55C99.59 54.09 100.29 60.82 101.5 67.27C103.15 76.05 105.87 86.29 109.84 98.57Z" fill="currentColor"/>
      <path d="M73.25 87.52C80.62 92.57 89.79 97.88 101.27 103.76C103.96 105.09 106.25 106.28 108.17 107.34C98.57 98.37 72.24 81.23 77.5 63.17C84.59 38.81 115.19 85.16 87.1 28.67C86.74 27.94 86.49 27.22 86.3 26.5C80.18 32.45 73.85 38.19 67.66 43.94C63.75 47.58 59.39 51.16 55.92 55.23C50.72 61.34 54.35 68.81 58.56 74.31C62.57 79.55 67.83 83.81 73.25 87.52Z" fill="currentColor"/>
      <path d="M113.8 124.43C112.84 121.59 112.07 119.13 111.46 117.02C111.91 130.15 118.4 160.89 101.91 169.94C79.67 182.16 90.81 127.74 70.73 187.55C70.47 188.31 70.14 188.99 69.77 189.63C78.3 189.75 86.83 190.19 95.28 190.5C100.61 190.69 106.23 191.24 111.56 190.81C119.56 190.17 122.27 182.32 123.18 175.46C124.05 168.91 123.35 162.18 122.14 155.73C120.49 146.95 117.77 136.71 113.8 124.43Z" fill="currentColor"/>
      <path d="M150.39 135.48C143.02 130.43 133.85 125.12 122.36 119.24C119.68 117.91 117.39 116.72 115.47 115.66C125.06 124.63 151.4 141.77 146.14 159.83C139.05 184.2 108.45 137.85 136.54 194.34C136.9 195.06 137.15 195.78 137.34 196.5C143.45 190.55 149.79 184.81 155.98 179.06C159.89 175.42 164.25 171.84 167.72 167.77C172.92 161.66 169.29 154.19 165.08 148.69C161.06 143.45 155.81 139.19 150.39 135.48Z" fill="currentColor"/>
      <path d="M168.09 55.6C161.98 50.4 154.51 54.03 149.01 58.24C143.77 62.26 139.51 67.51 135.8 72.93C130.76 80.3 125.44 89.47 119.56 100.96C118.24 103.64 117.05 105.92 115.98 107.84C124.95 98.24 142.09 71.93 160.15 77.18C184.51 84.27 138.16 114.87 194.65 86.78C195.38 86.42 196.1 86.17 196.82 85.98C190.87 79.87 185.13 73.53 179.38 67.34C175.74 63.43 172.16 59.07 168.09 55.6Z" fill="currentColor"/>
      <path d="M175.77 100.14C169.23 99.27 162.5 99.97 156.05 101.18C147.27 102.83 137.03 105.55 124.75 109.52C121.91 110.48 119.45 111.25 117.34 111.86C130.47 111.41 161.21 104.92 170.26 121.41C182.48 143.65 128.06 132.51 187.87 152.59C188.63 152.85 189.31 153.18 189.95 153.55C190.07 145.02 190.51 136.49 190.82 128.04C191.01 122.71 191.56 117.09 191.13 111.76C190.49 103.76 182.64 101.05 175.77 100.14Z" fill="currentColor"/>
    </svg>
  )
}

export function MinervaMenuBar() {
  const [notchState, setNotchState] = useState<NotchState>("hidden")
  const stateRef = useRef<NotchState>("hidden")
  const notchRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { setTheme, resolvedTheme } = useTheme()

  const go = useCallback((s: NotchState) => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
    stateRef.current = s
    setNotchState(s)
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
    router.push(href)
    setOpenMenu(null)
    go("peek")
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
          <button onClick={() => router.push("/")} className="mn-menubar-logo flex items-center gap-2 mr-3 hover:opacity-80 transition-opacity">
            <MinervaLogo size={16} />
            <span className="mn-menubar-brand text-[13px] font-semibold tracking-tight">Minerva</span>
          </button>

          {/* Home — dropdown */}
          <div className="mn-menubar-menu relative">
            <button onClick={() => setOpenMenu(openMenu === "home" ? null : "home")}
              className={`mn-menubar-item text-[13px] px-2.5 py-1 rounded-md transition-colors ${["/","/command-center"].includes(pathname) ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}>
              Home
            </button>
            <MenuDropdown items={HOME_ITEMS} open={openMenu === "home"} onClose={() => setOpenMenu(null)} onNav={handleNav} />
          </div>

          {/* People — dropdown */}
          <div className="mn-menubar-menu relative">
            <button onClick={() => setOpenMenu(openMenu === "people" ? null : "people")}
              className={`mn-menubar-item text-[13px] px-2.5 py-1 rounded-md transition-colors ${["/people","/person-search","/prospecting","/owned-audience","/bulk-enrich"].includes(pathname) ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}>
              People
            </button>
            <MenuDropdown items={PEOPLE_ITEMS} open={openMenu === "people"} onClose={() => setOpenMenu(null)} onNav={handleNav} />
          </div>

          {/* Analytics — direct link */}
          <button onClick={() => router.push("/analytics")}
            className={`mn-menubar-item text-[13px] px-2.5 py-1 rounded-md transition-colors ${pathname === "/analytics" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}>
            Analytics
          </button>

          {/* Settings — dropdown */}
          <div className="mn-menubar-menu relative">
            <button onClick={() => setOpenMenu(openMenu === "settings" ? null : "settings")}
              className={`mn-menubar-item text-[13px] px-2.5 py-1 rounded-md transition-colors ${["/integrations","/usage","/get-started"].includes(pathname) ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}>
              Settings
            </button>
            <MenuDropdown items={SETTINGS_ITEMS} open={openMenu === "settings"} onClose={() => setOpenMenu(null)} onNav={handleNav} />
          </div>

          {/* Search */}
          <button onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
            className="mn-menubar-search flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground ml-2 transition-colors">
            <Search className="h-3.5 w-3.5" /> Search
          </button>
        </div>

        {/* Right icons */}
        <div className="mn-menubar-right flex items-center gap-3">
          <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="mn-menubar-theme text-muted-foreground hover:text-foreground transition-colors">
            {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="mn-menubar-bell text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="h-4 w-4" />
          </button>
          <button onClick={() => window.dispatchEvent(new CustomEvent("minerva-chat-toggle"))}
            className="mn-menubar-ai text-muted-foreground hover:text-foreground transition-colors">
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ═══ DYNAMIC NOTCH ═══ */}
      <div className={`mn-menubar-backdrop fixed inset-0 z-[99] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        onClick={handleBackdrop}
        style={{ background: isOpen ? "rgb(0 0 0 / 84%)" : "rgba(0,0,0,0)", backdropFilter: isOpen ? "blur(2px)" : "none", transition: "background 500ms, backdrop-filter 500ms" }} />

      <div className="mn-menubar-topbar fixed top-0 left-0 right-0 h-[10px] bg-[#0a0a0a] z-[150]"
        style={{ transform: isVisible ? "translateY(0)" : "translateY(-100%)", transition: "transform 600ms cubic-bezier(.32,.72,0,1)" }} />

      <div className="mn-menubar-wrapper fixed top-0 left-1/2 z-[200] flex flex-col items-center" style={{ transform: "translateX(-50%)" }}>
        <div ref={notchRef} onClick={handleNotchClick}
          className="mn-notch relative flex items-center justify-center cursor-pointer select-none"
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
          <svg className="mn-notch-ear-l absolute top-0 pointer-events-none" style={{ right: "100%", width: 16, height: 16, opacity: isVisible ? 1 : 0, transition: "opacity 400ms ease 100ms" }} viewBox="0 0 20 20"><path d="M20 0L20 20C20 8.954 11.046 0 0 0L20 0Z" fill="#0a0a0a" /></svg>
          <svg className="mn-notch-ear-r absolute top-0 pointer-events-none" style={{ left: "100%", width: 16, height: 16, opacity: isVisible ? 1 : 0, transition: "opacity 400ms ease 100ms" }} viewBox="0 0 20 20"><path d="M0 0L0 20C0 8.954 8.954 0 20 0L0 0Z" fill="#0a0a0a" /></svg>

          <div className="mn-notch-nav-left flex items-center overflow-hidden"
            style={{ maxWidth: isOpen ? 300 : 0, opacity: isOpen ? 1 : 0, marginRight: isOpen ? 14 : 0, transition: "max-width 700ms cubic-bezier(.32,.72,0,1), opacity 500ms cubic-bezier(.32,.72,0,1), margin 700ms cubic-bezier(.32,.72,0,1)" }}>
            {LEFT_NAV.map((item, i) => (
              <span key={item.href} data-nav="true" onClick={() => handleNav(item.href)}
                className="mn-notch-item"
                style={{ fontSize: 13, fontWeight: pathname === item.href ? 500 : 400, letterSpacing: "0.01em", whiteSpace: "nowrap", padding: "4px 14px", borderRadius: 20, cursor: "pointer", color: pathname === item.href ? "#fff" : "rgba(255,255,255,0.5)", opacity: isOpen ? 1 : 0, transform: isOpen ? "translateY(0) scale(1)" : "translateY(6px) scale(0.92)", transition: `all 450ms cubic-bezier(.32,.72,0,1) ${isOpen ? 100 + i * 60 : 0}ms` }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#fff"; (e.target as HTMLElement).style.background = "rgba(255,255,255,0.1)" }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = pathname === item.href ? "#fff" : "rgba(255,255,255,0.5)"; (e.target as HTMLElement).style.background = "transparent" }}>
                {item.label}
              </span>
            ))}
          </div>

          <div className="mn-notch-logo flex items-center justify-center shrink-0 z-[5]">
            <MinervaLogo size={18} />
          </div>

          <div className="mn-notch-nav-right flex items-center overflow-hidden"
            style={{ maxWidth: isOpen ? 300 : 0, opacity: isOpen ? 1 : 0, marginLeft: isOpen ? 14 : 0, transition: "max-width 700ms cubic-bezier(.32,.72,0,1), opacity 500ms cubic-bezier(.32,.72,0,1), margin 700ms cubic-bezier(.32,.72,0,1)" }}>
            {RIGHT_NAV.map((item, i) => (
              <span key={item.href} data-nav="true" onClick={() => handleNav(item.href)}
                className="mn-notch-item"
                style={{ fontSize: 13, fontWeight: pathname === item.href ? 500 : 400, letterSpacing: "0.01em", whiteSpace: "nowrap", padding: "4px 14px", borderRadius: 20, cursor: "pointer", color: pathname === item.href ? "#fff" : "rgba(255,255,255,0.5)", opacity: isOpen ? 1 : 0, transform: isOpen ? "translateY(0) scale(1)" : "translateY(6px) scale(0.92)", transition: `all 450ms cubic-bezier(.32,.72,0,1) ${isOpen ? 100 + i * 60 : 0}ms` }}
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
