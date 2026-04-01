"use client"

import { MinervaLogo } from "@/components/shared/MinervaLogo"

const useDolphinsLogo = false

export function ClientLogo({ className = "" }: { className?: string }) {
  if (!useDolphinsLogo) {
    return <MinervaLogo className={`mn-client-logo ${className}`} />
  }

  return (
    <img
      src="/dolphins-white.png"
      alt="Miami Dolphins"
      className={className}
      style={{ objectFit: "contain" }}
    />
  )
}
