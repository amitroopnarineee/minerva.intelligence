"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ShaderBackground } from "@/components/shared/ShaderBackground"

export function GlobalBackground() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (pathname !== "/") { setVisible(false); return }
    // Hide when canvas opens (welcome → canvas transition)
    const hide = () => setVisible(false)
    const show = () => setVisible(true)
    window.addEventListener('minerva-nav-section', hide)
    window.addEventListener('minerva-go-home', show)
    return () => { window.removeEventListener('minerva-nav-section', hide); window.removeEventListener('minerva-go-home', show) }
  }, [pathname])

  if (!visible) return null
  return (
    <div className="mn-global-bg fixed inset-0 z-0 pointer-events-none">
      <ShaderBackground />
    </div>
  )
}
