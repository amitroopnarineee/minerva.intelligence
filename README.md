# Minerva Intelligence — Consumer Intelligence Platform

A reimagined "Smart Home Page" for Minerva's consumer intelligence platform, built as a design engineering take-home. The prototype demonstrates how a CMO of the Miami Dolphins might interact with 260M+ resolved consumer profiles, predictive audiences, and campaign intelligence through a single, cohesive interface.

## Live Demo

**[minerva.intelligence.vercel.app](https://minerva-intelligence.vercel.app)** → Start at `/home`

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4, shadcn/ui (55 components installed, ~20 actively used)
- **Animation**: Framer Motion, Canvas API (gradient), CSS transitions
- **Charts**: Recharts, inline SVG sparklines
- **Font**: Overused Grotesk (brand), SF Pro Display (headings)
- **Package manager**: pnpm
- **Deployment**: Vercel (auto-deploy on push)

## Architecture

```
app/(dashboard)/
  layout.tsx          → Menu bar + global gradient + ⌘K palette
  home/page.tsx       → Mode switcher + AI input (portal)
  page.tsx            → Command Center (6 data modules)
  analytics/          → KPIs, spend/revenue charts, campaign breakdown
  person-search/      → Live filtering → PersonTable → ProfileSheet
  prospecting/        → Prospect persons → ProfileSheet
  owned-audience/     → Customer persons → ProfileSheet
  bulk-enrich/        → Upload area + enrichment job history
  integrations/       → Integration cards
  usage/              → Usage metrics
  get-started/        → Onboarding checklist

components/
  shared/             → 19 reusable components
  home/               → 8 page-specific modules

lib/data/             → 7 typed data files, 8 rich person profiles
```

## Key Design Decisions

**macOS-style menu bar** replaces a traditional sidebar — every page gets full viewport width. The animated gradient background is shared across all pages via a fixed canvas layer with triple progressive blur, creating one continuous canvas.

**AI is woven into components, not isolated in chat** (per the Perplexity Finance reference). The Morning Briefing generates insights with confidence indicators. Opportunities surface as actionable cards. The mode switcher on Home pre-configures the AI input for different workflows.

**Every surface has depth**: clicking an audience card opens a detail sheet with member scoring, reachability bars, and sample members. Clicking a campaign row shows 30-day spend/conversion charts. Clicking any person row opens a full profile with demographics, household data, propensity scores, affinities, and ticket history. Nested navigation (audience → member → person profile) demonstrates real product depth.

**Data integrity**: 8 person profiles with internally consistent audience memberships — every person's audiences match their demographics, fan status, and behavior. 8 audiences, 5 campaigns, 7 days of KPIs, and 3 AI insights all cross-reference correctly.

## Interactive Flows

```
Home → [mode] → Route to any page
Command Center → Audience Card → AudienceDetailSheet → Member → PersonProfileSheet
Command Center → Campaign Row → CampaignDetailSheet (ROAS, 30d charts)
Command Center → Morning Briefing → Expand/collapse insights
Person Search → Filter chips / search → PersonTable → PersonProfileSheet
Prospecting → PersonTable → PersonProfileSheet
Owned Audience → PersonTable → PersonProfileSheet
⌘K → Search pages, people, audiences, toggle theme
Menu bar → All 10 routes
```

## Running Locally

```bash
git clone git@github.com:amitroopnarineee/minerva.intelligence.git
cd minerva.intelligence
pnpm install
pnpm dev
# → http://localhost:3000/home
```

## Custom CSS Override System

Every UI element has a `mn-` prefixed class for surgical CSS targeting via `app/overrides.css`. This enables design iteration without touching component logic:

```css
.mn-card { /* all FeatureCards */ }
.mn-menubar { /* top navigation */ }
.mn-person-row { /* person table rows */ }
.mn-propensity-ring { /* score gauges */ }
```

---

Built by [Amit Roopnarine](https://amitroopnarine.com) · March 2026
