"use client";

import { currentKpi } from "@/lib/data/kpis";

const tickers = [
  { label: "Revenue", value: `$${(currentKpi.influencedRevenue / 1000).toFixed(0)}K`, dot: "bg-emerald-400" },
  { label: "ROAS", value: `${currentKpi.roas.toFixed(1)}x`, dot: "bg-emerald-400" },
  { label: "Ticket Conv", value: `${(currentKpi.ticketConversionRate * 100).toFixed(1)}%`, dot: "bg-amber-400" },
  { label: "Premium Leads", value: `${currentKpi.premiumLeadVolume}`, dot: "bg-blue-400" },
  { label: "Returning Fans", value: `${(currentKpi.returningFanRate * 100).toFixed(1)}%`, dot: "bg-emerald-400" },
  { label: "Match Rate", value: `${(currentKpi.dataMatchRate * 100).toFixed(0)}%`, dot: "bg-emerald-400" },
  { label: "Active Audiences", value: `${currentKpi.activationReadyAudiences}`, dot: "bg-blue-400" },
];

export function NavTicker() {
  // Duplicate for seamless loop
  const items = [...tickers, ...tickers];

  return (
    <div className="relative flex-1 overflow-hidden mx-4">
      <div className="flex animate-scroll gap-6 whitespace-nowrap">
        {items.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 text-[11px]">
            <span className={`h-[5px] w-[5px] rounded-full ${t.dot}`} />
            <span className="text-muted-foreground">{t.label}</span>
            <span className="font-semibold tabular-nums text-foreground">{t.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
