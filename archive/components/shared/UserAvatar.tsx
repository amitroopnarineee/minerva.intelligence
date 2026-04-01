"use client"

import { useState } from "react"
import { getAvatar, getLogo } from "@/lib/data/avatars"

const PALETTE = ["#6B8DE3", "#3B5FCC", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#38bdf8", "#fb923c"]

function getInitials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
}

function getColor(name: string): string {
  const hash = Array.from(name).reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return PALETTE[hash % PALETTE.length]
}

interface UserAvatarProps {
  name: string
  size?: number
  variant?: string // kept for compatibility, unused
  className?: string
}

export function UserAvatar({ name, size = 32, className }: UserAvatarProps) {
  const [imgFailed, setImgFailed] = useState(false)
  const src = getAvatar(name)
  const initials = getInitials(name)
  const bg = getColor(name)

  return (
    <div
      className={`mn-avatar shrink-0 rounded-full overflow-hidden flex items-center justify-center ${className || ""}`}
      style={{ width: size, height: size, background: imgFailed ? bg : "transparent" }}
    >
      {!imgFailed ? (
        <img
          src={src}
          alt={name}
          width={size}
          height={size}
          className="rounded-full object-cover w-full h-full"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span style={{ fontSize: size * 0.38, fontWeight: 600, color: "#fff", lineHeight: 1 }}>
          {initials}
        </span>
      )}
    </div>
  )
}

interface CompanyLogoProps {
  name: string
  size?: number
  className?: string
}

export function CompanyLogo({ name, size = 32, className }: CompanyLogoProps) {
  const [imgFailed, setImgFailed] = useState(false)
  const src = getLogo(name)
  const initials = getInitials(name)
  const bg = getColor(name)

  if (!src || imgFailed) {
    return (
      <div
        className={`mn-company-logo shrink-0 rounded-lg flex items-center justify-center ${className || ""}`}
        style={{ width: size, height: size, background: bg }}
      >
        <span style={{ fontSize: size * 0.38, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
          {initials}
        </span>
      </div>
    )
  }

  return (
    <div className={`mn-company-logo shrink-0 rounded-lg overflow-hidden bg-white ${className || ""}`} style={{ width: size, height: size }}>
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className="object-contain w-full h-full p-0.5"
        onError={() => setImgFailed(true)}
      />
    </div>
  )
}
