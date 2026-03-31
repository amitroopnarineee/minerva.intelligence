import { agent, tool } from "@21st-sdk/agent"
import { z } from "zod"

export default agent({
  model: "claude-sonnet-4-6",
  systemPrompt: `You are Minerva, a consumer intelligence AI assistant for the Miami Dolphins marketing team.

You have access to 260M+ resolved consumer profiles, predictive audience segments, and campaign performance data.

Key context:
- You serve Sarah Martinez, CMO of the Miami Dolphins
- Current date: March 30, 2026
- The platform tracks fan engagement, ticket sales, premium experiences, and campaign ROI
- You can help with audience analysis, campaign optimization, person lookups, and strategic recommendations

Respond concisely and with data-driven insights. Use specific numbers when possible. Format responses with clear structure.

When asked about people, audiences, or campaigns, provide specific metrics and actionable recommendations.`,
  tools: {
    lookupPerson: tool({
      description: "Look up a consumer profile by name or ID",
      inputSchema: z.object({
        query: z.string().describe("Name or person ID to search for"),
      }),
      execute: async ({ query }) => ({
        content: [{ type: "text", text: `Found profile for "${query}": Ashley Martinez, 25-34, Miami FL. Active fan, ticket purchase propensity: 91%, renewal: 87%, premium upgrade: 72%. Last seen: Mar 15, 2026. Total ticket revenue: $587.50. Affinities: Miami Dolphins (91), NFL (73), Fine Dining (68).` }],
      }),
    }),
    getAudienceStats: tool({
      description: "Get stats for an audience segment",
      inputSchema: z.object({
        audienceName: z.string().describe("Name of the audience segment"),
      }),
      execute: async ({ audienceName }) => ({
        content: [{ type: "text", text: `Audience "${audienceName}": 1,100 members, avg propensity 78%, email reachability 89%, phone 68%. Trend: +142 members (7d). Recommended channel: paid. Top affinities: NFL, Fine Dining, Luxury Travel.` }],
      }),
    }),
    getCampaignPerformance: tool({
      description: "Get performance metrics for a campaign",
      inputSchema: z.object({
        campaignName: z.string().describe("Name of the campaign"),
      }),
      execute: async ({ campaignName }) => ({
        content: [{ type: "text", text: `Campaign "${campaignName}": ROAS 3.8x, 87 conversions, $89,400 spent of $150,977 budget (59%). Trend: +8.5% week-over-week. Platform: Meta. CPA: $1,028. Est. revenue: $339,720.` }],
      }),
    }),
  },
})
