"use client"

import { usePathname } from "next/navigation"
import { ShaderBackground } from "@/components/shared/ShaderBackground"

export function GlobalBackground() {
  const pathname = usePathname()
  if (pathname !== "/") return null
  return (
    <div className="mn-global-bg fixed inset-0 z-0 pointer-events-none">
      <ShaderBackground />
    </div>
  )
}
