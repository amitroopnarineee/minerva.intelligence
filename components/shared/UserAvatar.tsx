"use client"

import Avatar from "boring-avatars"

const PALETTE = ["#6B8DE3", "#3B5FCC", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#38bdf8", "#fb923c"]

interface UserAvatarProps {
  name: string
  size?: number
  variant?: "beam" | "marble" | "pixel" | "sunset" | "ring" | "bauhaus"
  className?: string
}

export function UserAvatar({ name, size = 32, variant = "beam", className }: UserAvatarProps) {
  return (
    <div className={`mn-avatar shrink-0 rounded-full overflow-hidden ${className || ""}`} style={{ width: size, height: size }}>
      <Avatar name={name} size={size} variant={variant} colors={PALETTE} />
    </div>
  )
}

interface CompanyLogoProps {
  name: string
  size?: number
  className?: string
}

export function CompanyLogo({ name, size = 32, className }: CompanyLogoProps) {
  return (
    <div className={`mn-company-logo shrink-0 rounded-lg overflow-hidden ${className || ""}`} style={{ width: size, height: size }}>
      <Avatar name={name} size={size} variant="bauhaus" colors={PALETTE} />
    </div>
  )
}
