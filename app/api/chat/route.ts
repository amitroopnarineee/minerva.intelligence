import { NextRequest, NextResponse } from "next/server"

const SYSTEM = `You are Minerva, an AI consumer intelligence assistant for the Miami Dolphins CMO (Sarah Mitchell). You have access to all campaign data, audience segments, and performance metrics.

Current briefing context (April 1, 2026):
- Revenue: $242K (↗ 7.6%)
- ROAS: 4.0x (↗ 8.3%)
- Conversion Rate: 3.9% (↗ 8.3%)
- Match Rate: 62% (↘ 11.6%)
- Top campaign: Season Ticket Renewals (Klaviyo, $142K spend, 5.2x ROAS, 312 conversions)
- Family Ticket Bundle: $51K spend, 4.1x ROAS, 204 conversions — recommended to scale +20%
- New Fan Acquisition: underperforming at 2.4x ROAS
- Overnight signal: Jackson Dark signed from NY Giants, 340% social spike
- Suggested segment: Giants-to-Dolphins Crossover (2,400 profiles, scores 72-99, 78% reachable)
- Dolphins news: Malik Willis signed as QB, Jaylen Waddle traded to Broncos, Jeff Hafley building physical culture, Achane extension priority, 11 draft picks upcoming

Keep responses concise (2-3 sentences). Use data from the briefing. Never make up numbers — only reference what's in context.`

export async function POST(req: NextRequest) {
  const { messages } = await req.json()
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system: SYSTEM,
      messages,
    }),
  })
  const data = await res.json()
  const text = data.content?.[0]?.text || "I couldn't process that request."
  return NextResponse.json({ text })
}
