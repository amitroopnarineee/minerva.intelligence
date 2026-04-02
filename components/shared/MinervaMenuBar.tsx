"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"



const LEFT_NAV = [
  { label: "Home", href: "/", section: "home" },
  { label: "Briefing", href: "/", section: "briefing" },
]
const RIGHT_NAV = [
  { label: "Audience", href: "/", section: "studio" },
  { label: "Dashboard", href: "/", section: "dashboard" },
]

type NotchState = "hidden" | "peek" | "open"

function MinervaLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 127 127" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.22338 0.10804C8.60738 -0.117663 15.2593 0.0802654 20.7514 0.0806169L54.8952 0.0813197L98.5292 0.0802656C105.88 0.0797382 113.232 0.0524922 120.582 0.0874727C121.836 0.0934492 125.577 0.177121 125.799 1.98275C126.284 5.9278 126.094 10.2025 126.095 14.1983L126.101 37.3406L126.097 94.1848C126.097 103.232 126.101 112.277 126.134 121.324C126.145 124.1 125.876 125.495 122.997 126.15C120.091 126.363 116.48 126.301 113.528 126.309L95.7205 126.272L39.5386 126.275L14.7594 126.287C10.8551 126.289 6.28689 126.421 2.40371 125.996C1.57016 125.905 0.645369 124.641 0.2024 123.971C-0.154084 120.034 0.0682788 112.64 0.0709155 108.398L0.075663 79.5376L0.0721467 29.332C0.0739045 21.2202 0.071621 13.1079 0.0739062 4.99634C0.0746093 2.4512 0.326854 0.606731 3.22338 0.10804ZM115.299 86.8225C115.872 82.4559 115.519 77.6787 115.58 73.2545C115.603 71.6122 115.467 69.9391 115.631 68.299L86.6845 68.2786C82.4155 68.2774 74.8969 68.0399 70.8383 68.3419C69.3213 70.2486 77.8047 76.3373 79.362 77.2375C88.2832 82.3946 98.7311 85.0554 108.942 86.0784C110.918 86.2709 113.369 86.7304 115.299 86.8225ZM115.552 29.1267C115.595 23.3099 115.732 16.7932 115.574 11.0142C114.95 11.0457 113.888 11.0675 113.305 11.1659C98.5133 13.6246 86.4254 20.8775 77.7743 33.2507C77.0362 34.3065 74.49 37.6073 75.6475 38.7439C76.2035 38.8536 76.6667 38.5563 77.1953 38.3115C78.7545 37.5048 80.3555 36.8809 81.9676 36.1959C92.9068 31.5467 103.815 30.2841 115.552 29.1267ZM10.6994 97.269C10.7783 101.238 10.8025 105.207 10.772 109.176C10.7707 110.437 10.4705 114.437 11.2038 115.25C24.1319 114.174 36.204 107.408 44.7419 97.7762C46.1632 96.1729 51.7307 89.3763 51.2331 87.3994C50.9826 87.2338 51.0419 87.2298 50.7641 87.202C43.0065 90.7797 35.4715 93.7492 26.9749 95.1164C23.639 95.642 20.2937 96.1061 16.9406 96.5082C15.0705 96.7301 12.4943 96.9458 10.6994 97.269ZM63.6035 36.9446C64.9614 33.953 68.9926 27.3165 70.9656 24.8744C73.2713 21.7943 74.9462 20.3399 77.5354 17.699C78.8562 16.3516 83.6403 12.4178 84.1997 11.3164C83.1824 10.3751 77.7334 10.686 76.1911 10.6871L65.6987 10.6767C59.2765 10.667 51.0687 10.4076 44.7543 10.6449C44.5566 10.6525 44.359 10.6614 44.1614 10.672C43.5237 10.702 42.8494 10.6512 42.3693 11.0355C42.0264 12.0958 43.4369 12.9128 44.1815 13.5381C47.3272 16.1788 50.5156 19.1791 53.2293 22.2786C55.0769 24.4161 56.7644 26.687 58.2779 29.0727C60.0452 31.874 61.0925 34.8331 63.6035 36.9446ZM84.6878 115.124C83.339 113.616 81.4132 112.191 79.8819 110.773C76.6238 107.813 73.5958 104.609 70.8239 101.19C69.5254 99.5507 68.3435 97.8224 67.2869 96.0178C66.0188 93.9011 64.9012 90.6871 62.9196 89.4218C61.2985 91.7228 59.9383 94.4555 58.4405 96.8705C55.2444 102.024 51.4701 106.356 46.8576 110.301C45.8503 111.163 42.1603 114.016 42.1653 115.094C43.7909 115.864 60.8921 115.565 63.9479 115.563L75.4702 115.545C78.5509 115.542 81.6928 115.745 84.6878 115.124ZM115.492 97.3311C113.135 96.8083 110.249 96.5886 107.85 96.318C97.3516 95.1342 87.3758 92.5971 77.7646 88.1667C77.1127 87.8661 75.814 87.1537 75.1262 87.1046C74.9929 90.3641 80.2059 96.2361 82.5164 98.8036C90.9637 108.19 102.505 113.917 115.023 115.402C115.233 115.427 115.388 115.384 115.586 115.329C115.658 109.33 115.627 103.33 115.492 97.3311ZM11.2833 10.9685L10.7546 11.1434C10.6426 11.4109 10.7575 27.316 10.8428 28.9958C13.7133 29.5818 16.8571 29.6901 19.7957 30.0903C30.4582 31.5421 41.0963 34.2221 50.8176 39.0719C51.9744 38.4741 50.6789 36.3761 50.1501 35.5582C42.9587 24.4316 32.074 15.7267 19.1521 12.3431C16.9619 11.7636 13.3403 11.027 11.2833 10.9685ZM115.204 39.6553C111.622 39.9431 106.728 40.2862 103.217 40.9387C92.847 42.866 79.2243 46.7899 72.1277 54.9797C71.6707 55.5071 70.5532 56.8151 70.4354 57.4398C70.7376 57.8749 70.5736 57.7321 71.096 57.9561C79.5791 57.7098 88.636 57.8919 97.1551 57.8604C102.311 57.8415 110.602 57.6442 115.513 58.1076C115.546 55.9478 115.89 40.4418 115.204 39.6553ZM11.0017 39.4957C10.6779 41.2899 10.7335 46.1921 10.7662 48.1679C10.8141 51.0586 10.6582 55.1402 10.8776 57.9849C21.2346 57.5855 33.2748 57.8601 43.7297 57.8678L51.1359 57.891C52.3832 57.9068 54.4279 58.0139 55.6113 57.9149C56.0884 56.6354 54.2797 54.8219 53.3722 53.9405C42.7474 43.6229 24.9712 40.6184 11.0017 39.4957ZM10.8618 68.2878C10.6155 70.4342 10.6447 84.9522 11.0892 86.459C11.863 86.8577 12.8936 86.5743 13.717 86.4926C24.6696 85.4057 36.8104 83.0995 46.4049 77.4437C48.0775 76.4904 56.8085 70.295 55.7698 68.5522C54.2773 68.0558 41.6344 68.2811 39.3928 68.2841L10.8618 68.2878Z" fill="white"/>
    </svg>
  )
}

const NAV_ITEMS = [
  { type: "link" as const, label: "Home", href: "/", paths: ["/"] },
  { type: "link" as const, label: "Briefing", href: "/", paths: [] },
  { type: "link" as const, label: "Audience", href: "/", paths: [] },
  { type: "link" as const, label: "Dashboard", href: "/", paths: [] },
]

export function MinervaMenuBar() {
  const [notchState, setNotchState] = useState<NotchState>("peek")
  const stateRef = useRef<NotchState>("peek")
  const notchRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [navVisible, setNavVisible] = useState(false)
  const [workspaceHidden, setWorkspaceHidden] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Hide menubar when workspace modal is open
  useEffect(() => {
    const handler = (e: Event) => setWorkspaceHidden((e as CustomEvent).detail)
    window.addEventListener('minerva-workspace-active', handler)
    return () => window.removeEventListener('minerva-workspace-active', handler)
  }, [])

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

  const handleNav = useCallback((href: string, section?: string) => {
    if (section) window.dispatchEvent(new CustomEvent('minerva-nav-section', { detail: section }))
    router.push(href); go("peek")
    timerRef.current = setTimeout(() => { if (stateRef.current === "peek") go("hidden") }, 600)
  }, [router, go])

  const isOpen = notchState === "open"
  const isPeek = notchState === "peek"
  const isVisible = notchState !== "hidden"

  if (workspaceHidden) return null

  return (
    <>
      {/* ═══ STATIC HEADER ═══ */}
      <div className="mn-menubar mn-menubar-static flex items-center justify-between px-5 py-2.5 fixed top-0 left-0 right-0 z-[250]" style={{ background: 'transparent', pointerEvents: 'auto' }}>
        <div className="mn-menubar-left flex items-center gap-1">
          <button onClick={() => { router.push('/'); window.dispatchEvent(new Event('minerva-go-home')) }} className="mn-menubar-logo flex items-center gap-2 mr-3 hover:opacity-80 transition-opacity">
            <MinervaLogo size={16} />
            <span className="mn-menubar-brand text-[18px] font-medium tracking-tight">Minerva<sup className="text-[7px] ml-px opacity-40">™</sup></span>
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
          <div aria-label="User"
            onClick={() => setNavVisible(v => !v)}
            className="ml-2 rounded-full bg-white/90 ring-1 ring-white/10 hover:ring-white/30 transition-all cursor-pointer flex items-center justify-center" style={{ width: 25, height: 25 }}>
            <span className="text-[9px] font-semibold text-black/60 leading-none">SM</span>
          </div>
        </div>
      </div>

      {/* ═══ DYNAMIC NOTCH ═══ */}
      <div className={`fixed inset-0 z-[249] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        onClick={handleBackdrop}
        style={{ background: isOpen ? "rgb(0 0 0 / 84%)" : "rgba(0,0,0,0)", backdropFilter: isOpen ? "blur(2px)" : "none", transition: "background 500ms, backdrop-filter 500ms" }} />

      <div className="fixed top-0 left-0 right-0 h-[10px] bg-[#0a0a0a] z-[260]"
        style={{ transform: isVisible ? "translateY(0)" : "translateY(-100%)", transition: "transform 600ms cubic-bezier(.32,.72,0,1)" }} />

      <div className="fixed top-0 left-1/2 z-[260] flex flex-col items-center" style={{ transform: "translateX(-50%)" }}>
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
              <span key={item.label} data-nav="true" onClick={() => handleNav(item.href, item.section)}
                style={{ fontSize: 13, fontWeight: pathname === item.href ? 500 : 400, whiteSpace: "nowrap", padding: "4px 14px", borderRadius: 20, cursor: "pointer", color: pathname === item.href ? "#fff" : "rgba(255,255,255,0.5)", opacity: isOpen ? 1 : 0, transform: isOpen ? "translateY(0) scale(1)" : "translateY(6px) scale(0.92)", transition: `all 450ms cubic-bezier(.32,.72,0,1) ${isOpen ? 100 + i * 60 : 0}ms` }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#fff"; (e.target as HTMLElement).style.background = "rgba(255,255,255,0.1)" }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = pathname === item.href ? "#fff" : "rgba(255,255,255,0.5)"; (e.target as HTMLElement).style.background = "transparent" }}>
                {item.label}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-center z-[5] text-white" style={{ flexShrink: 0, minWidth: 18, minHeight: 18 }}><MinervaLogo size={18} /></div>
          <div className="flex items-center overflow-hidden"
            style={{ maxWidth: isOpen ? 300 : 0, opacity: isOpen ? 1 : 0, marginLeft: isOpen ? 14 : 0, transition: "max-width 700ms cubic-bezier(.32,.72,0,1), opacity 500ms, margin 700ms cubic-bezier(.32,.72,0,1)" }}>
            {RIGHT_NAV.map((item, i) => (
              <span key={item.label} data-nav="true" onClick={() => handleNav(item.href, item.section)}
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
