// ── Core KPI types ──
export interface KpiSnapshot {
  date: string;
  influencedRevenue: number;
  paidSpend: number;
  roas: number;
  ticketConversionRate: number;
  premiumLeadVolume: number;
  returningFanRate: number;
  activationReadyAudiences: number;
  dataMatchRate: number;
}

// ── Insight / AI Briefing ──
export type InsightSeverity = "high" | "medium" | "low";
export type InsightType = "demand_shift" | "efficiency_drop" | "winback" | "anomaly";

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  summary: string;
  severity: InsightSeverity;
  changePct: number;
  confidenceScore: number;
  generatedAt: string;
  relatedAudienceId?: string;
  relatedCampaignId?: string;
}

// ── Next Best Action ──
export interface NextBestAction {
  id: string;
  recommendedAction: string;
  recommendedChannel: string;
  priorityScore: number;
  expectedLiftPct: number;
  expectedRevenue: number;
  audienceId: string;
  modelId: string;
  status: "open" | "accepted" | "dismissed";
}

// ── Audience ──
export type AudienceType = "lifecycle" | "predictive" | "retargeting" | "sales" | "suppression";

export interface Audience {
  id: string;
  name: string;
  type: AudienceType;
  description: string;
  businessUnit: string;
  estimatedSize: number;
  channelRecommendation: string;
  isActivationReady: boolean;
  lastRefreshedAt: string;
  // derived stats
  emailReachRate?: number;
  phoneReachRate?: number;
  avgPropensityScore?: number;
  valueTrend?: "up" | "down" | "stable";
  memberDelta?: number;
}

// ── Campaign ──
export type CampaignChannel = "email" | "paid" | "sms" | "sales";
export type CampaignStatus = "active" | "paused" | "completed";

export interface Campaign {
  id: string;
  name: string;
  channel: CampaignChannel;
  platform: string;
  objective: string;
  status: CampaignStatus;
  budget: number;
  spend: number;
  roas: number;
  conversions: number;
  trend: "up" | "down" | "stable";
  trendPct: number;
}

// ── Integration / System Health ──
export type HealthStatus = "healthy" | "degraded" | "error";

export interface Integration {
  id: string;
  name: string;
  sourceType: string;
  vendor: string;
  status: "connected" | "disconnected";
  healthStatus: HealthStatus;
  lastSyncAt: string;
  recordsSynced: number;
  errorCount7d: number;
}

// ── Activity ──
export interface ActivityItem {
  id: string;
  label: string;
  detail: string;
  timestamp: string;
  type: "sync" | "activation" | "model" | "audience" | "alert";
}
