"use client"

import { ShaderBackground } from "@/components/shared/ShaderBackground"

export function GlobalBackground() {
  return (
    <div className="mn-global-bg fixed inset-0 z-0 pointer-events-none">
      <ShaderBackground />
    </div>
  )
}
