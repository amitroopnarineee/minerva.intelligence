"use client"

import { ShaderBackground } from "@/components/shared/ShaderBackground"

export function GlobalBackground() {
  return (
    <div className="mn-global-bg fixed inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(15,23,42,1) 0%, rgba(0,0,0,1) 70%)' }} />
  )
}
