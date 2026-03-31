import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { z } from "zod";
import { persons } from "@/lib/data/persons";
import { audiences } from "@/lib/data/audiences";
import { campaigns } from "@/lib/data/campaigns";

export const maxDuration = 30;

const systemPrompt = `You are Minerva AI, an elite consumer intelligence assistant for the Miami Dolphins CMO, Sarah Martinez. You have access to tools that can both retrieve data AND control the dashboard UI.

PERSONALITY: Strategic, concise, data-driven. Use numbers and percentages. End responses with a proactive next step.

CRITICAL RULES:
- When you look up a person, audience, or campaign, ALWAYS use the navigate/open tools to show the data on screen too.
- After retrieving data, offer to navigate or open relevant detail views.
- Format tables in markdown when showing data summaries.
- Keep responses under 200 words unless detailed analysis is requested.
- Use bold for key metrics and names.

AVAILABLE DATA: 8 consumer profiles, 8 audience segments, 5 campaigns for the Miami Dolphins.
Current date: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: systemPrompt,
    messages,
    tools: {
      lookupPerson: {
        description: "Look up a consumer profile by name.",
        inputSchema: z.object({ name: z.string().describe("Person's first or last name") }),
        execute: async ({ name }: { name: string }) => {
          const match = persons.find(
            (p) => p.firstName.toLowerCase().includes(name.toLowerCase()) || p.lastName.toLowerCase().includes(name.toLowerCase())
          );
          if (!match) return { found: false, message: `No person found matching "${name}"` };
          return {
            found: true,
            person: {
              name: `${match.firstName} ${match.lastName}`, id: match.id,
              city: `${match.city}, ${match.state}`, fanStatus: match.fanStatus.replace(/_/g, " "),
              scores: match.scores,
              affinities: match.affinities?.slice(0, 4).map((a) => a.name),
              audiences: match.audiences,
            },
          };
        },
      },
      getAudienceStats: {
        description: "Get stats for an audience segment by name.",
        inputSchema: z.object({ audienceName: z.string().describe("Audience segment name") }),
        execute: async ({ audienceName }: { audienceName: string }) => {
          const match = audiences.find((a) => a.name.toLowerCase().includes(audienceName.toLowerCase()));
          if (!match) return { found: false, message: `No audience found matching "${audienceName}"` };
          const members = persons.filter((p) => p.audiences.includes(match.id));
          return {
            found: true,
            audience: {
              name: match.name, id: match.id,
              estimatedSize: match.estimatedSize,
              avgPropensityScore: match.avgPropensityScore,
              emailReachRate: match.emailReachRate,
              phoneReachRate: match.phoneReachRate,
              channelRecommendation: match.channelRecommendation,
              memberDelta: match.memberDelta,
              members: members.map((m) => `${m.firstName} ${m.lastName}`),
            },
          };
        },
      },
      getCampaignPerformance: {
        description: "Get performance data for a campaign by name.",
        inputSchema: z.object({ campaignName: z.string().describe("Campaign name") }),
        execute: async ({ campaignName }: { campaignName: string }) => {
          const match = campaigns.find((c) => c.name.toLowerCase().includes(campaignName.toLowerCase()));
          if (!match) return { found: false, message: `No campaign found matching "${campaignName}"` };
          return {
            found: true,
            campaign: {
              name: match.name, id: match.id, roas: match.roas,
              spend: match.spend, budget: match.budget,
              conversions: match.conversions,
              channel: match.channel, trendPct: match.trendPct,
              platform: match.platform, trend: match.trend,
            },
          };
        },
      },
      navigateTo: {
        description: "Navigate the dashboard to a specific page.",
        inputSchema: z.object({
          route: z.enum(["/", "/home", "/analytics", "/person-search", "/prospecting", "/owned-audience", "/bulk-enrich"]),
        }),
        execute: async ({ route }: { route: string }) => ({ action: "navigate", route }),
      },
      openPersonProfile: {
        description: "Open a person's detail profile sheet on screen.",
        inputSchema: z.object({ personId: z.string() }),
        execute: async ({ personId }: { personId: string }) => {
          const p = persons.find((x) => x.id === personId);
          return { action: "openPerson", personId, name: p ? `${p.firstName} ${p.lastName}` : personId };
        },
      },
      openAudienceDetail: {
        description: "Open an audience segment's detail sheet.",
        inputSchema: z.object({ audienceId: z.string() }),
        execute: async ({ audienceId }: { audienceId: string }) => {
          const a = audiences.find((x) => x.id === audienceId);
          return { action: "openAudience", audienceId, name: a?.name ?? audienceId };
        },
      },
      openCampaignDetail: {
        description: "Open a campaign's detail sheet.",
        inputSchema: z.object({ campaignId: z.string() }),
        execute: async ({ campaignId }: { campaignId: string }) => {
          const c = campaigns.find((x) => x.id === campaignId);
          return { action: "openCampaign", campaignId, name: c?.name ?? campaignId };
        },
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
