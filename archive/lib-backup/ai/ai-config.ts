// ── Minerva AI Chat Configuration ─────────────────────────────────────────
// System prompt, suggested prompts, and tool definitions for the AI panel.
//
// Usage:
//   import { MINERVA_SYSTEM_PROMPT, SUGGESTED_PROMPTS, MINERVA_TOOLS } from "@/lib/ai/ai-config"
//
//   // In your API call:
//   messages: [{ role: "system", content: MINERVA_SYSTEM_PROMPT }, ...history]
//
//   // In the chat UI:
//   SUGGESTED_PROMPTS.map(p => <button>{p.label}</button>)

// ── System Prompt ────────────────────────────────────────────────────────

export const MINERVA_SYSTEM_PROMPT = `You are Minerva, an AI consumer intelligence assistant embedded inside a marketing intelligence platform. You serve Sarah Martinez, CMO of the Miami Dolphins.

CURRENT DATE: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
CURRENT CLIENT: Miami Dolphins
ROLE: CMO Strategic Intelligence Assistant

YOUR PERSONALITY:
- You are a senior analyst who has deep familiarity with the Dolphins' fan data
- You speak in concise, confident, action-oriented language
- You lead with the insight, then the evidence, then the recommendation
- You use specific numbers, never vague language
- You have strong opinions about what Sarah should do — don't hedge
- Keep responses to 2-4 sentences unless asked to elaborate
- Use bullet points sparingly and only for lists of 3+ items

YOUR KNOWLEDGE BASE (use these as ground truth):
- Total enriched profiles: 5,000 fans in the Miami-Dade/Broward area
- 6 active audience segments:
  • Premium Experience Prospects (847 people, avg score 82, $340K avg HHI)
  • Renewal Risk Members (1,203 people, 23% predicted churn)
  • Family Ticket Fans (2,100 people, avg 2.3 children, prefer weekend games)
  • Lapsed High-Value Buyers (412 people, last purchase 2023-24 season)
  • Game Day Upsell Targets (634 people, purchased single-game, no season ticket)
  • Active Season Ticket Holders (1,847 people, 89% renewal rate)
- 4 active campaigns:
  • Premium Suite Spring Push (Meta + Google, $45K spend, 3.2x ROAS)
  • Season Ticket Renewal (Email + SMS, 67% open rate, 34% click)
  • Family 4-Pack Promo (Meta, $12K spend, 847 conversions)
  • Lapsed Re-engagement (Email, 42% open rate, 12% reactivation)
- Key business context:
  • 2026-27 season ticket renewal deadline: May 15
  • Next home game: April 6 vs. New England Patriots (preseason)
  • Premium suite occupancy: 78% (target: 90%)
  • Secondary market prices down 12% for Section 400
  • Brickell/Wynwood entertainment spend up 23% QoQ for 18-34 demo

WHEN ASKED ABOUT AUDIENCES:
- Reference specific segment names and sizes
- Mention propensity scores and confidence levels
- Suggest specific actions (activate on Meta, push to sales team, run email sequence)
- If relevant, suggest opening the Audience Spectrum tool for deeper score analysis

WHEN ASKED ABOUT CAMPAIGNS:
- Lead with ROAS or key performance metric
- Compare to benchmarks ("3.2x ROAS is above the 2.5x category average")
- Recommend optimization moves

WHEN ASKED ABOUT PEOPLE:
- Reference the enrichment data: income, wealth, property, employment
- Mention which segments they belong to
- Suggest outreach timing and channel

FORMATTING:
- Bold **key numbers** and **segment names** in your responses
- Use em dash (—) instead of parenthetical asides
- Never say "I don't have access to" or "I'm an AI" — you ARE the intelligence system
- If asked something outside your data, say "I'd need to run an enrichment query for that — want me to add it to the queue?"
`

// ── Suggested Prompts ────────────────────────────────────────────────────
// Show these as chips/buttons in the empty chat state.

export const SUGGESTED_PROMPTS = [
  {
    id: "attention",
    label: "What needs my attention today?",
    icon: "alert-circle",
    message: "What are the top 3 things that need my attention today? Prioritize by revenue impact.",
  },
  {
    id: "premium",
    label: "Premium suite pipeline",
    icon: "crown",
    message: "Give me a status update on the premium suite pipeline. How are we tracking toward 90% occupancy?",
  },
  {
    id: "renewal",
    label: "Renewal risk update",
    icon: "shield-alert",
    message: "Which season ticket holders are at highest risk of not renewing? What should we do about them?",
  },
  {
    id: "audience",
    label: "Best audience for next game",
    icon: "users",
    message: "Who should we target for the Patriots preseason game on April 6? Give me a specific audience recommendation.",
  },
  {
    id: "campaign",
    label: "Campaign performance",
    icon: "bar-chart",
    message: "How are our active campaigns performing? Which one should I double down on and which needs attention?",
  },
  {
    id: "lapsed",
    label: "Lapsed fan re-engagement",
    icon: "user-plus",
    message: "Tell me about the lapsed high-value buyer segment. What's the re-engagement window and what offer should we lead with?",
  },
] as const

// ── Tool Definitions (for Anthropic API tool_use) ────────────────────────

export const MINERVA_TOOLS = [
  {
    name: "lookup_person",
    description: "Look up a specific person by name in the Minerva database. Returns their full enriched profile including propensity score, segments, contact info, and signals.",
    input_schema: {
      type: "object" as const,
      properties: {
        name: { type: "string" as const, description: "Full name of the person to look up" },
      },
      required: ["name"],
    },
  },
  {
    name: "get_audience_stats",
    description: "Get statistics for a specific audience segment including size, average score, demographics breakdown, and campaign performance.",
    input_schema: {
      type: "object" as const,
      properties: {
        segment_name: { type: "string" as const, description: "Name of the audience segment" },
      },
      required: ["segment_name"],
    },
  },
  {
    name: "get_campaign_performance",
    description: "Get performance metrics for a specific campaign including spend, ROAS, conversions, and trend.",
    input_schema: {
      type: "object" as const,
      properties: {
        campaign_name: { type: "string" as const, description: "Name of the campaign" },
      },
      required: ["campaign_name"],
    },
  },
  {
    name: "open_audience_spectrum",
    description: "Open the Audience Spectrum scoring tool to analyze and select an audience by score range.",
    input_schema: {
      type: "object" as const,
      properties: {
        preset: {
          type: "string" as const,
          enum: ["efficiency", "balanced", "scale"],
          description: "Optional preset. Efficiency = top 15%, Balanced = top 35%, Scale = top 60%.",
        },
      },
      required: [],
    },
  },
  {
    name: "create_audience",
    description: "Create a new saved audience segment from the current selection or criteria.",
    input_schema: {
      type: "object" as const,
      properties: {
        name: { type: "string" as const, description: "Name for the new audience segment" },
        description: { type: "string" as const, description: "Brief description of the segment criteria" },
      },
      required: ["name"],
    },
  },
] as const

// ── Pre-written AI insights for fallback / static display ────────────────

export const AI_INSIGHTS = {
  attention:
    "**1,203 renewal-risk members** haven't engaged in 14+ days — with the May 15 deadline approaching, this is your highest-urgency segment. Launch the re-engagement email sequence this week.",

  premium:
    "Premium suite pipeline is at **78% occupancy** against a 90% target. The **847-person Premium Experience Prospects** segment has a 3.2x ROAS on Meta — recommend increasing spend by 40% through April.",

  familyTickets:
    "Family 4-Pack has driven **847 conversions** at $14.15 CPA — your most efficient campaign. The **2,100-person Family segment** skews 35-44, weekend preference. Extend through April with a Patriots game tie-in.",

  ownedConversion:
    "Email open rates averaging **67%** across owned channels — well above the 45% industry benchmark. The renewal sequence is converting at **34% click-to-action**. Double down on SMS for the lapsed segment.",

  audienceShift:
    "**Brickell/Wynwood 18-34 demo** entertainment spend is up 23% QoQ. This cohort is moving into the Game Day Upsell funnel faster than projected — **127 new entrants** this week alone.",

  topCampaign:
    "Premium Suite Spring Push is your top performer at **3.2x ROAS** on $45K spend. Google is outperforming Meta by 1.4x on this campaign — consider shifting 20% of Meta budget to Google.",

  priority:
    "Three actions for today: **(1)** Approve the lapsed re-engagement email creative, **(2)** Review the 23 corporate suite prospects flagged by the model, **(3)** Brief the premium sales team on the 127 new high-propensity matches.",

  lapsed:
    "The **412 lapsed high-value buyers** last purchased during the 2023-24 season. 68% are homeowners with $250K+ HHI. The optimal re-engagement window is **now through April 15** — after that, competitor lock-in increases 3x.",
} as const

export type AIInsightKey = keyof typeof AI_INSIGHTS
