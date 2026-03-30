"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { currentKpi, previousKpi, kpiDelta, kpiHistory } from "@/lib/data/kpis";
import { Sparkline } from "@/components/shared/Sparkline";

interface MetricCardProps {
  label: string;
  value: string;
  delta: { value: number; direction: "up" | "down" | "stable" };
  sparkData: number[];
  index: number;
}

function MetricCard({ label, value, delta, sparkData, index }: MetricCardProps) {
  const TrendIcon = delta.direction === "up" ? TrendingUp : delta.direction === "down" ? TrendingDown : Minus;
  const trendColor = delta.direction === "up" ? "text-emerald-400" : delta.direction === "down" ? "text-red-400" : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Card className="mn-kpi-card p-4">
        <div className="mn-kpi-top flex items-center justify-between">
          <span className="mn-kpi-label text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
          <div className={`mn-kpi-trend flex items-center gap-0.5 ${trendColor}`}>
            <TrendIcon className="h-3 w-3" />
            <span className="tabular-nums text-[10px] font-medium">{delta.value.toFixed(1)}%</span>
          </div>
        </div>
        <div className="mn-kpi-bottom mt-1.5 flex items-end justify-between gap-2">
          <span className="mn-kpi-value tabular-nums text-xl font-semibold tracking-tight">{value}</span>
          <div className="mn-kpi-spark"><Sparkline data={sparkData} width={64} height={24} /></div>
        </div>
      </Card>
    </motion.div>
  );
}

export function MetricStrip() {
  const metrics = [
    { label: "Revenue", value: `$${(currentKpi.influencedRevenue / 1000).toFixed(0)}K`, delta: kpiDelta(currentKpi.influencedRevenue, previousKpi.influencedRevenue), sparkData: kpiHistory.map((k) => k.influencedRevenue) },
    { label: "ROAS", value: `${currentKpi.roas.toFixed(1)}x`, delta: kpiDelta(currentKpi.roas, previousKpi.roas), sparkData: kpiHistory.map((k) => k.roas) },
    { label: "Conversion", value: `${(currentKpi.ticketConversionRate * 100).toFixed(1)}%`, delta: kpiDelta(currentKpi.ticketConversionRate, previousKpi.ticketConversionRate), sparkData: kpiHistory.map((k) => k.ticketConversionRate) },
    { label: "Premium Leads", value: `${currentKpi.premiumLeadVolume}`, delta: kpiDelta(currentKpi.premiumLeadVolume, previousKpi.premiumLeadVolume), sparkData: kpiHistory.map((k) => k.premiumLeadVolume) },
    { label: "Returning", value: `${(currentKpi.returningFanRate * 100).toFixed(1)}%`, delta: kpiDelta(currentKpi.returningFanRate, previousKpi.returningFanRate), sparkData: kpiHistory.map((k) => k.returningFanRate) },
    { label: "Active", value: `${currentKpi.activationReadyAudiences}`, delta: kpiDelta(currentKpi.activationReadyAudiences, previousKpi.activationReadyAudiences), sparkData: kpiHistory.map((k) => k.activationReadyAudiences) },
  ];

  return (
    <div className="mn-kpi-grid grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {metrics.map((m, i) => (<MetricCard key={m.label} {...m} index={i} />))}
    </div>
  );
}
