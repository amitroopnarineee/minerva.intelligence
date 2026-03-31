# Audience Scoring Tool — Build Prompt for External AI

## YOUR TASK
Build a single React component file called `AudienceSpectrum.tsx` that implements a premium audience scoring tool. This will be dropped into an existing Next.js project. Output ONE file only.

## STACK (must match exactly)
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4 (utility classes)
- Recharts (already installed — import from "recharts")
- Framer Motion (already installed — import from "framer-motion")  
- "use client" directive required at top
- Font: "Overused Grotesk" for body, "SF Pro Display" for headings
- Theme: dark mode, oklch colors. Use `text-foreground`, `text-muted-foreground`, `bg-card`, `border-border` etc.
- Every single HTML element must have a unique CSS class prefixed with `mn-spectrum-*` (e.g., `mn-spectrum-header`, `mn-spectrum-chart`, `mn-spectrum-metric-card`)

## HOW IT WILL BE USED
```tsx
// In a page or modal:
import { AudienceSpectrum } from "@/components/shared/AudienceSpectrum"
<AudienceSpectrum onClose={() => setOpen(false)} />
```

It renders as a near-fullscreen modal overlay (position: fixed, inset with small margins). The component manages its own state internally.

## DATA
The component must include its own embedded data (no external imports). Generate realistic pre-aggregated data for 100 score buckets (0-99) representing a "Premium Suite Propensity" model for Miami Dolphins fans (5,000 person population).

Each bucket object:
```ts
interface ScoreBucket {
  score: number           // 0-99
  count: number           // records in this bucket (total ~5000 across all)
  withEmail: number       // subset with email
  withPhone: number       // subset with phone
  withAddress: number     // subset with address
  demographics: {
    age: Record<string, number>        // "18-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65+"
    gender: Record<string, number>     // "male" | "female"
    homeownership: Record<string, number> // "owner" | "renter"
    income: Record<string, number>     // "<50k" | "50-100k" | "100-250k" | "250-500k" | "500k+"
    wealth: Record<string, number>     // "<100k" | "100-250k" | "250-500k" | "500k-1m" | "1m+"
  }
}
```

Data generation rules for realism:
- Distribution should be roughly normal, peaking around score 45-55
- Higher scores should skew: older (45-64), more homeowners, higher income/wealth, better reachability
- Lower scores should skew: younger (18-34), more renters, lower income
- Email reachability: ~85-95% for high scores, ~60-75% for low scores
- Phone reachability: ~70-85% for high scores, ~40-55% for low scores
- Total population: ~5,000

## PRODUCT ARCHITECTURE

### Modal shell
- Fixed overlay, `inset: 16px, top: 48px`
- `bg-card` with `border border-border/50 rounded-2xl`
- Backdrop: `bg-black/60 backdrop-blur-md`
- Smooth open/close animation (Framer Motion)
- Header bar with title + close button

### Two-column layout (50/50)
- Left: fixed hero surface (spectrum + controls)
- Right: scrollable strategic rail

---

### LEFT COLUMN: Audience Spectrum (hero)

#### 1. Title + description
"Audience Spectrum" heading with one-line description.

#### 2. Mode pills
Four buttons: **Efficiency** | **Balanced** (default) | **Scale** | **Custom**
- Efficiency: selects top ~15% (score 85-99)
- Balanced: selects top ~35% (score 65-99) — DEFAULT
- Scale: selects top ~60% (score 40-99)
- Custom: user drags freely

Each mode sets the selection range and updates everything.

#### 3. Histogram / spectrum chart
A beautiful bar chart of all 100 buckets.
- Selected range bars: bright/highlighted color
- Non-selected: dimmed/receded
- The user can drag the edges of the selection to resize the range
- Use a custom brush interaction or two draggable handles on the x-axis
- Show score labels on x-axis (0, 25, 50, 75, 100)

#### 4. Live selection summary (below chart)
When a range is selected, show:
- Score range: "65–99"
- Audience: "1,847 people"  
- Top: "37th percentile"
- Email reach: "1,621 (87.8%)"
- Phone reach: "1,384 (74.9%)"
- Avg score: "78.3"

These must recalculate live as the selection changes.

#### 5. Selection method toggle
Small segmented control: **Score Range** | **Top %** | **Audience Size**
- Score Range: drag the histogram handles (default)
- Top %: a slider from 1-100%
- Audience Size: a slider from 100-5000

All three methods update the same selection state.

---

### RIGHT COLUMN: Strategic rail (scrollable)

#### Section 1: Selected Segment card
Compact summary with the key numbers (size, percentile, reachability breakdown).

#### Section 2: "Why this segment matters"
2-3 sentences of plain-English strategic interpretation based on the actual demographics of the selected range. Example: "This segment skews older (55% are 45+), more likely to be homeowners (72% vs 54% baseline), and shows strong direct contactability. It represents the highest-fit audience for premium suite targeting."

Generate this dynamically based on the actual selected data vs full population.

#### Section 3: Compared to baseline
Show the selected segment vs full audience comparison.
Use diverging bar rows or delta chips:
```
Homeowners:  72% vs 54%  [+18 pts ████████▓▓▓▓]
Age 45-64:   55% vs 31%  [+24 pts ██████████▓▓]
Income 250k+: 28% vs 12% [+16 pts ███████▓▓▓▓▓]
Age 18-34:   12% vs 29%  [-17 pts ▓▓▓▓▓▓▓████]
```

Show top 5-6 biggest deltas (positive and negative), sorted by absolute delta.

#### Section 4: How audience evolves across score
Mini sparkline/area charts showing how 3-4 key demographics change across the score spectrum:
- Homeownership rate by score
- Age 45+ share by score  
- Income 250k+ share by score
- Email reachability by score

These should be small, elegant, and show the full 0-99 range with the selected area highlighted.

#### Section 5: Recommendation + actions
Strategic guidance card:
- "Best for: Efficient targeting with strong demographic concentration"
- "Tradeoff: Smaller scale limits reach campaign effectiveness"
- "Consider: Expanding to 50-99 adds 800 more people with only moderate quality dilution"

Action buttons (styled, even if non-functional):
- **Save Segment**
- **Export Audience** 
- **Activate Segment**

---

## VISUAL DESIGN RULES

- Premium enterprise feel, not generic dashboard
- Calm, editorial, lots of whitespace
- Soft grey/dark modal surface
- White or `bg-card` inner cards with subtle borders
- Minimal dividers (1px `border-border/20`)
- Typography: 13px body, 11px labels (uppercase tracking-wider), 24px+ hero numbers
- Chart colors: Use `#6B8DE3` for selected bars, `rgba(255,255,255,0.08)` for unselected
- No heavy borders, no colored backgrounds on everything
- Action buttons: primary style for main CTA, outline for secondary
- Smooth transitions on all state changes (200-300ms)
- Hover states on all interactive elements

## CRITICAL RULES
1. ONE FILE. Everything in `AudienceSpectrum.tsx`. Data, types, components, logic — all in one file.
2. `"use client"` at top
3. Every element has a `mn-spectrum-*` class
4. Export the component as named export: `export function AudienceSpectrum`
5. Props: `{ onClose: () => void }`
6. Use Recharts for charts (BarChart, AreaChart, etc.)
7. Use Framer Motion for modal animation
8. Generate realistic data inline (no external files)
9. All calculations must be real (aggregate from bucket data, not hardcoded display values)
10. The mode pills must actually change the selection and update all derived data
11. Must work in dark mode (use CSS variables / Tailwind theme tokens)
