import type { Integration, ActivityItem } from "@/lib/types";

// Derived from integrations.csv + sync_runs.csv
export const integrations: Integration[] = [
  { id: "int_salesforce", name: "Salesforce CRM", sourceType: "crm", vendor: "Salesforce", status: "connected", healthStatus: "healthy", lastSyncAt: "2026-03-29T23:00:00", recordsSynced: 52000, errorCount7d: 0 },
  { id: "int_ticketing", name: "Ticketmaster", sourceType: "ticketing", vendor: "Ticketmaster", status: "connected", healthStatus: "healthy", lastSyncAt: "2026-03-29T22:00:00", recordsSynced: 180000, errorCount7d: 1 },
  { id: "int_ga4", name: "GA4 Web Analytics", sourceType: "web_analytics", vendor: "Google", status: "connected", healthStatus: "healthy", lastSyncAt: "2026-03-30T01:00:00", recordsSynced: 840000, errorCount7d: 0 },
  { id: "int_meta", name: "Meta Ads", sourceType: "ads", vendor: "Meta", status: "connected", healthStatus: "healthy", lastSyncAt: "2026-03-29T20:00:00", recordsSynced: 320000, errorCount7d: 0 },
  { id: "int_klaviyo", name: "Klaviyo Email", sourceType: "email", vendor: "Klaviyo", status: "connected", healthStatus: "healthy", lastSyncAt: "2026-03-29T21:00:00", recordsSynced: 245000, errorCount7d: 0 },
  { id: "int_sms", name: "Twilio SMS", sourceType: "sms", vendor: "Twilio", status: "connected", healthStatus: "degraded", lastSyncAt: "2026-03-29T18:00:00", recordsSynced: 98000, errorCount7d: 3 },
  { id: "int_merch", name: "Shopify Merch", sourceType: "commerce", vendor: "Shopify", status: "connected", healthStatus: "healthy", lastSyncAt: "2026-03-29T19:00:00", recordsSynced: 67000, errorCount7d: 0 },
];

// Recent system activity
export const recentActivity: ActivityItem[] = [
  { id: "act_1", label: "Model refreshed", detail: "Premium Suite Propensity v1.3 — 2h ago", timestamp: "2026-03-30T08:00:00", type: "model" },
  { id: "act_2", label: "Audience pushed", detail: "Premium Experience Prospects → Meta Ads", timestamp: "2026-03-29T22:30:00", type: "activation" },
  { id: "act_3", label: "Sync completed", detail: "Ticketmaster — 180K records", timestamp: "2026-03-29T22:00:00", type: "sync" },
  { id: "act_4", label: "New audience", detail: "Seatmap Retargeting Pool created — 900 members", timestamp: "2026-03-29T20:15:00", type: "audience" },
  { id: "act_5", label: "Sync degraded", detail: "Twilio SMS — 3 errors in last 7d", timestamp: "2026-03-29T18:00:00", type: "alert" },
];
