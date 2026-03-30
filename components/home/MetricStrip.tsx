"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { currentKpi, previousKpi, kpiDelta, kpiHistory } from "@/lib/data/kpis";
import { Sparkline } from "@/components/shared/Sparkline";

interface MetricCardProps {
  label: string;
  value: string;
  delta: { value: number; direction: "up" | "down" | "stable" };
  sparkData: number[];
  positiveDirection?: "up" | "down";
  index: number;
}

function MetricCard({ label, value, delta, sparkData, positiveDirection = "up", index }: MetricCardProps) {
  const isGood = delta.direction === positiveDirection || delta.direction === "stable";
  const TrendIcon = delta.direction === "up" ? TrendingUp : delta.direction === "down" ? TrendingDown : Minus;
  const trendColor = delta.direction === "stable"
    ? "text-muted-foreground"
    : isGood
    ? "text-emerald-400"
    : "text-red-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/50"
    >
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon className="h-3 w-3" />
          <span className="tabular-nums text-[11px] font-medium">
            {delta.value.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-end justify-between">
        <span className="tabular-nums text-2xl font-semibold tracking-tight">
          {value}
        </span>
        <Sparkline data={sparkData} width={72} height={28} showDot={true} showArea={true} />
      </div>
    </motion.div>
  );
}

export function MetricStrip() {
  const metrics = [
    {
      label: "Influenced Revenue",
      value: `$${(currentKpi.influencedRevenue / 1000).toFixed(0)}K`,
      delta: kpiDelta(currentKpi.influencedRevenue, previousKpi.influencedRevenue),
      sparkData: kpiHistory.map((k) => k.influencedRevenue),
    },
    {
      label: "ROAS",
      value: `${currentKpi.roas.toFixed(1)}x`,
      delta: kpiDelta(currentKpi.roas, previousKpi.roas),
      sparkData: kpiHistory.map((k) => k.roas),
    },
    {
      label: "Ticket Conversion",
      value: `${(currentKpi.ticketConversionRate * 100).toFixed(1)}%`,
      delta: kpiDelta(currentKpi.ticketConversionRate, previousKpi.ticketConversionRate),
      sparkData: kpiHistory.map((k) => k.ticketConversionRate),
    },
    {
      label: "Premium Leads",
      value: `${currentKpi.premiumLeadVolume}`,
      delta: kpiDelta(currentKpi.premiumLeadVolume, previousKpi.premiumLeadVolume),
      sparkData: kpiHistory.map((k) => k.premiumLeadVolume),
    },
    {
      label: "Returning Fans",
      value: `${(currentKpi.returningFanRate * 100).toFixed(1)}%`,
      delta: kpiDelta(currentKpi.returningFanRate, previousKpi.returningFanRate),
      sparkData: kpiHistory.map((k) => k.returningFanRate),
    },
    {
      label: "Activation-Ready",
      value: `${currentKpi.activationReadyAudiences}`,
      delta: kpiDelta(currentKpi.activationReadyAudiences, previousKpi.activationReadyAudiences),
      sparkData: kpiHistory.map((k) => k.activationReadyAudiences),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {metrics.map((m, i) => (
        <MetricCard key={m.label} {...m} index={i} />
      ))}
    </div>
  );
}
