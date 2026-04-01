"use client"

import { Icon } from "@iconify/react"

const PLATFORM_ICONS: Record<string, string> = {
  // Social / Ad platforms
  "meta": "simple-icons:meta",
  "instagram": "simple-icons:instagram",
  "tiktok": "simple-icons:tiktok",
  "x": "simple-icons:x",
  "twitter": "simple-icons:x",
  "youtube": "simple-icons:youtube",
  "linkedin": "simple-icons:linkedin",
  "facebook": "simple-icons:facebook",
  "google": "simple-icons:google",
  "snapchat": "simple-icons:snapchat",
  // Marketing / CRM
  "klaviyo": "simple-icons:klaviyo",
  "salesforce": "simple-icons:salesforce",
  "hubspot": "simple-icons:hubspot",
  "mailchimp": "simple-icons:mailchimp",
  // Ticketing / Sports
  "ticketmaster": "simple-icons:ticketmaster",
  // Analytics
  "google search console": "simple-icons:googlesearchconsole",
  "google analytics": "simple-icons:googleanalytics",
  // Apps
  "app store connect": "simple-icons:apple",
  "apple": "simple-icons:apple",
}

export function PlatformIcon({ name, size = 12, className = "" }: { name: string; size?: number; className?: string }) {
  const key = name.toLowerCase().trim()
  const icon = PLATFORM_ICONS[key]
  if (!icon) return null
  return <Icon icon={icon} width={size} height={size} className={`inline-block shrink-0 ${className}`} />
}

/** Renders a platform name with its icon inline */
export function PlatformLabel({ name, size = 11, gap = 4, className = "" }: { name: string; size?: number; gap?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`} style={{ gap }}>
      <PlatformIcon name={name} size={size} />
      <span>{name}</span>
    </span>
  )
}
