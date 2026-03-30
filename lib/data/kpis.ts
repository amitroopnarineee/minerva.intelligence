import type { KpiSnapshot } from "@/lib/types";

// Derived from daily_kpi_snapshots.csv — last 7 days
export const kpiHistory: KpiSnapshot[] = [
  { date: "2026-03-24", influencedRevenue: 412830, paidSpend: 91200, roas: 4.53, ticketConversionRate: 0.041, premiumLeadVolume: 34, returningFanRate: 0.601, activationReadyAudiences: 14, dataMatchRate: 0.82 },
  { date: "2026-03-25", influencedRevenue: 396385, paidSpend: 88342, roas: 4.49, ticketConversionRate: 0.042, premiumLeadVolume: 38, returningFanRate: 0.593, activationReadyAudiences: 10, dataMatchRate: 0.857 },
  { date: "2026-03-26", influencedRevenue: 355338, paidSpend: 88276, roas: 4.03, ticketConversionRate: 0.040, premiumLeadVolume: 30, returningFanRate: 0.565, activationReadyAudiences: 15, dataMatchRate: 0.736 },
  { date: "2026-03-27", influencedRevenue: 318296, paidSpend: 66298, roas: 4.80, ticketConversionRate: 0.029, premiumLeadVolume: 27, returningFanRate: 0.552, activationReadyAudiences: 13, dataMatchRate: 0.735 },
  { date: "2026-03-28", influencedRevenue: 249762, paidSpend: 60509, roas: 4.13, ticketConversionRate: 0.041, premiumLeadVolume: 24, returningFanRate: 0.550, activationReadyAudiences: 20, dataMatchRate: 0.646 },
  { date: "2026-03-29", influencedRevenue: 225279, paidSpend: 60525, roas: 3.72, ticketConversionRate: 0.036, premiumLeadVolume: 20, returningFanRate: 0.589, activationReadyAudiences: 21, dataMatchRate: 0.701 },
  { date: "2026-03-30", influencedRevenue: 242420, paidSpend: 60175, roas: 4.03, ticketConversionRate: 0.039, premiumLeadVolume: 23, returningFanRate: 0.548, activationReadyAudiences: 20, dataMatchRate: 0.620 },
];

export const currentKpi = kpiHistory[kpiHistory.length - 1];
export const previousKpi = kpiHistory[kpiHistory.length - 2];

export function kpiDelta(current: number, previous: number): { value: number; direction: "up" | "down" | "stable" } {
  const diff = current - previous;
  const pct = previous !== 0 ? (diff / previous) * 100 : 0;
  return {
    value: Math.abs(pct),
    direction: pct > 0.5 ? "up" : pct < -0.5 ? "down" : "stable",
  };
}
