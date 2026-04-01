import type { Insight } from "@/lib/types";

// Derived from insights.csv
export const insights: Insight[] = [
  {
    id: "ins_001",
    type: "demand_shift",
    title: "Premium suite interest up 22% in last 7 days",
    summary:
      "Driven by corporate-domain visitors and repeat suite/club page views. Highest lift in Miami-Ft. Lauderdale and Palm Beach households. Recommend activating premium prospects to Meta and routing top 150 leads to the premium sales team.",
    severity: "high",
    changePct: 22,
    confidenceScore: 0.84,
    generatedAt: "2026-03-29T21:00:00",
    relatedAudienceId: "aud_002",
    relatedCampaignId: "camp_002",
  },
  {
    id: "ins_002",
    type: "efficiency_drop",
    title: "Meta new-fan acquisition efficiency down 14%",
    summary:
      "CTR is steady but post-click ticket conversion has dropped, strongest among 18–34 cohorts. Recommend a landing flow audit and tighter retargeting on high-intent seat map viewers.",
    severity: "medium",
    changePct: -14,
    confidenceScore: 0.78,
    generatedAt: "2026-03-29T19:00:00",
    relatedAudienceId: "aud_005",
    relatedCampaignId: "camp_004",
  },
  {
    id: "ins_003",
    type: "winback",
    title: "Lapsed high-value fans re-engaging on ticket pages",
    summary:
      "1,900 lapsed profiles returned in the last 10 days with strong seat map and checkout activity. This is a time-sensitive win-back window. Recommend email + Meta retargeting sequence within 48 hours.",
    severity: "high",
    changePct: 18,
    confidenceScore: 0.81,
    generatedAt: "2026-03-29T18:00:00",
    relatedAudienceId: "aud_004",
  },
];

// AI morning briefing — synthesized from insights + KPI trends
export const morningBriefing = {
  greeting: "Good morning, Sarah",
  date: "Monday, March 30, 2026",
  summary:
    "Three things need your attention today. Premium suite demand surged 22% this week — mostly corporate visitors from the Ft. Lauderdale and Palm Beach area. Your premium sales team should see the top 150 leads routed this morning. Second, Meta acquisition efficiency dropped 14% for younger cohorts — the spend is running but conversions are soft. Consider pausing until the landing flow is audited. Third, 1,900 lapsed high-value fans came back to browse tickets in the last 10 days. This is a narrow win-back window — the email + retargeting sequence should launch today.",
  keyMetric: {
    label: "Influenced Revenue (30d)",
    value: 2420000,
    trend: "up" as const,
    trendPct: 7.6,
  },
  topAction: "Activate win-back sequence for 1,900 lapsed high-value fans before the conversion window closes.",
};
