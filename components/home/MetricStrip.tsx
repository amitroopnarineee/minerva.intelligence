"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { currentKpi, previousKpi, kpiDelta } from "@/lib/data/kpis";

interface MetricCardProps {
  label: string;
  value: string;
  delta: { value: number; direction: "up" | "down" | "stable" };
  positiveDirection?: "up" | "down";
  index: number;
}

function MetricCard({ label, value, delta, positiveDirection = "up", index }: MetricCardProps) {
  const isGood = delta.direction === positiveDirection || delta.direction === "stable";
  const TrendIcon = delta.direction === "up" ? TrendingUp : delta.direction === "down" ? TrendingDown : Minus;
  const trendColor = delta.direction === "stable"
    ? "text-text-tertiary"
    : isGood
    ? "text-positive"
    : "text-negative";
  const trendBg = delta.direction === "stable"
    ? "bg-bg-raised"
    : isGood
    ? "bg-positive-dim"
    : "bg-negative-dim";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="flex flex-col gap-1.5 rounded-xl border border-border-default bg-bg-surface px-5 py-4"
    >
      <span className="text-[11px] font-medium uppercase tracking-wider text-text-tertiary">
        {label}
      </span>
      <span className="tabular-nums text-2xl font-semibold tracking-tight text-text-primary">
        {value}
      </span>
      <div className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 ${trendBg}`}>
        <TrendIcon className={`h-3 w-3 ${trendColor}`} />
        <span className={`tabular-nums text-[11px] font-medium ${trendColor}`}>
          {delta.value.toFixed(1)}%
        </span>
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
      positiveDirection: "up" as const,
    },
    {
      label: "ROAS",
      value: `${currentKpi.roas.toFixed(1)}x`,
      delta: kpiDelta(currentKpi.roas, previousKpi.roas),
      positiveDirection: "up" as const,
    },
    {
      label: "Ticket Conversion",
      value: `${(currentKpi.ticketConversionRate * 100).toFixed(1)}%`,
      delta: kpiDelta(currentKpi.ticketConversionRate, previousKpi.ticketConversionRate),
      positiveDirection: "up" as const,
    },
    {
      label: "Premium Leads",
      value: `${currentKpi.premiumLeadVolume}`,
      delta: kpiDelta(currentKpi.premiumLeadVolume, previousKpi.premiumLeadVolume),
      positiveDirection: "up" as const,
    },
    {
      label: "Returning Fan Rate",
      value: `${(currentKpi.returningFanRate * 100).toFixed(1)}%`,
      delta: kpiDelta(currentKpi.returningFanRate, previousKpi.returningFanRate),
      positiveDirection: "up" as const,
    },
    {
      label: "Activation-Ready",
      value: `${currentKpi.activationReadyAudiences}`,
      delta: kpiDelta(currentKpi.activationReadyAudiences, previousKpi.activationReadyAudiences),
      positiveDirection: "up" as const,
    },
  ];

  return (
    <div className="grid grid-cols-6 gap-3">
      {metrics.map((m, i) => (
        <MetricCard key={m.label} {...m} index={i} />
      ))}
    </div>
  );
}
