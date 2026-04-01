import type { NextBestAction } from "@/lib/types";

// Derived from next_best_actions.csv
export const opportunities: NextBestAction[] = [
  {
    id: "nba_001",
    recommendedAction:
      "Activate premium prospects to Meta and route top 150 leads to premium sales",
    recommendedChannel: "Meta + Sales",
    priorityScore: 0.92,
    expectedLiftPct: 18,
    expectedRevenue: 185000,
    audienceId: "aud_002",
    modelId: "model_premium",
    status: "open",
  },
  {
    id: "nba_002",
    recommendedAction:
      "Launch renewal urgency email + SMS for at-risk season ticket members",
    recommendedChannel: "Email + SMS",
    priorityScore: 0.88,
    expectedLiftPct: 12,
    expectedRevenue: 260000,
    audienceId: "aud_001",
    modelId: "model_renewal",
    status: "open",
  },
  {
    id: "nba_003",
    recommendedAction:
      "Win-back email sequence + 7-day Meta retargeting burst for lapsed fans",
    recommendedChannel: "Email + Meta",
    priorityScore: 0.86,
    expectedLiftPct: 10,
    expectedRevenue: 140000,
    audienceId: "aud_004",
    modelId: "model_winback",
    status: "open",
  },
];
