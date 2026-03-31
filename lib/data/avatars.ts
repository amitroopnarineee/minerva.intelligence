// ── Real Avatars & Company Logos ──────────────────────────────────────────
// Replace boring-avatars with real human photos and real company logos.
//
// Avatars: randomuser.me (real portrait photos, deterministic by index)
// Logos: logo.clearbit.com (real company logos by domain)

export const PERSON_AVATARS: Record<string, string> = {
  "Ashley Martinez": "https://randomuser.me/api/portraits/women/44.jpg",
  "Marcus Johnson": "https://randomuser.me/api/portraits/men/32.jpg",
  "Sofia Reyes": "https://randomuser.me/api/portraits/women/63.jpg",
  "David Chen": "https://randomuser.me/api/portraits/men/55.jpg",
  "Jasmine Williams": "https://randomuser.me/api/portraits/women/28.jpg",
  "Robert Thompson": "https://randomuser.me/api/portraits/men/67.jpg",
  "Elena Garcia": "https://randomuser.me/api/portraits/women/51.jpg",
  "James Rivera": "https://randomuser.me/api/portraits/men/22.jpg",
}

export const COMPANY_LOGOS: Record<string, string> = {
  "Carnival Corporation": "https://logo.clearbit.com/carnival.com",
  "JPM Financial Group": "https://logo.clearbit.com/jpmorgan.com",
  "Corporate Ventures LLC": "https://logo.clearbit.com/crunchbase.com",
  "Vice Media": "https://logo.clearbit.com/vice.com",
  "Baptist Health": "https://logo.clearbit.com/baptisthealth.net",
  "Gensler": "https://logo.clearbit.com/gensler.com",
  "Florida International University": "https://logo.clearbit.com/fiu.edu",
}

export const DOLPHINS_LOGO = "https://logo.clearbit.com/miamidolphins.com"

export const PARTNER_LOGOS: Record<string, string> = {
  "Salesforce": "https://logo.clearbit.com/salesforce.com",
  "HubSpot": "https://logo.clearbit.com/hubspot.com",
  "Meta": "https://logo.clearbit.com/meta.com",
  "Google Ads": "https://logo.clearbit.com/google.com",
  "Snowflake": "https://logo.clearbit.com/snowflake.com",
  "Twilio": "https://logo.clearbit.com/twilio.com",
  "Braze": "https://logo.clearbit.com/braze.com",
  "The Trade Desk": "https://logo.clearbit.com/thetradedesk.com",
}

// ── Helper functions ─────────────────────────────────────────────────────

/**
 * Get avatar URL for a person. Falls back to a deterministic randomuser portrait.
 */
export function getAvatar(name: string): string {
  if (PERSON_AVATARS[name]) return PERSON_AVATARS[name]
  const hash = Array.from(name).reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const gender = hash % 2 === 0 ? "women" : "men"
  const index = (hash % 70) + 1
  return `https://randomuser.me/api/portraits/${gender}/${index}.jpg`
}

/**
 * Get company logo URL. Falls back to the Clearbit generic.
 */
export function getLogo(company: string): string | null {
  if (COMPANY_LOGOS[company]) return COMPANY_LOGOS[company]
  if (company === "Freelance" || company === "Self-Employed") return null
  const domain = company.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "") + ".com"
  return `https://logo.clearbit.com/${domain}`
}

/**
 * Avatar component helper — returns props for an <img> tag.
 */
export function avatarProps(name: string, size: number = 32) {
  return {
    src: getAvatar(name),
    alt: name,
    width: size,
    height: size,
    className: "rounded-full object-cover",
    onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.style.display = "none"
    },
  } as const
}
