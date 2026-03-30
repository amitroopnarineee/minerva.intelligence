"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { currentKpi, previousKpi, kpiDelta, kpiHistory } from "@/lib/data/kpis";
import { Sparkline } from "@/components/shared/Sparkline";

interface MetricCardProps {
  label: string;
  value: string;
  subtext: string;
  delta: { value: number; direction: "up" | "down" | "stable" };
  sparkData: number[];
  index: number;
}

function MetricCard({ label, value, subtext, delta, sparkData, index }: MetricCardProps) {
  const TrendIcon = delta.direction === "up" ? TrendingUp : delta.direction === "down" ? TrendingDown : Minus;
  const trendColor = delta.direction === "up" ? "text-emerald-400" : delta.direction === "down" ? "text-red-400" : "text-muted-foreground";

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.04 }}>
      <Card className="mn-kpi-card p-4 hover:bg-accent/30 transition-colors cursor-pointer group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
          <Sparkline data={sparkData} width={48} height={16} showArea={false} showDot={false} />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <span className="tabular-nums text-2xl font-bold tracking-tight">{value}</span>
            <p className="text-[10px] text-muted-foreground mt-0.5">{subtext}</p>
          </div>
          <div className={`flex items-center gap-0.5 ${trendColor}`}>
            <TrendIcon className="h-3.5 w-3.5" />
            <span className="tabular-nums text-xs font-semibold">{delta.value.toFixed(1)}%</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function MetricStrip() {
  const metrics = [
    { label: "Revenue", value: `$${(currentKpi.influencedRevenue / 1000).toFixed(0)}K`, subtext: "Influenced (today)", delta: kpiDelta(currentKpi.influencedRevenue, previousKpi.influencedRevenue), sparkData: kpiHistory.map((k) => k.influencedRevenue) },
    { label: "ROAS", value: `${currentKpi.roas.toFixed(1)}x`, subtext: "Return on ad spend", delta: kpiDelta(currentKpi.roas, previousKpi.roas), sparkData: kpiHistory.map((k) => k.roas) },
    { label: "Conversion", value: `${(currentKpi.ticketConversionRate * 100).toFixed(1)}%`, subtext: "Ticket conversion rate", delta: kpiDelta(currentKpi.ticketConversionRate, previousKpi.ticketConversionRate), sparkData: kpiHistory.map((k) => k.ticketConversionRate) },
    { label: "Premium Leads", value: `${currentKpi.premiumLeadVolume}`, subtext: "Suite & club pipeline", delta: kpiDelta(currentKpi.premiumLeadVolume, previousKpi.premiumLeadVolume), sparkData: kpiHistory.map((k) => k.premiumLeadVolume) },
    { label: "Returning", value: `${(currentKpi.returningFanRate * 100).toFixed(1)}%`, subtext: "Fan return rate", delta: kpiDelta(currentKpi.returningFanRate, previousKpi.returningFanRate), sparkData: kpiHistory.map((k) => k.returningFanRate) },
    { label: "Active", value: `${currentKpi.activationReadyAudiences}`, subtext: "Ready to activate", delta: kpiDelta(currentKpi.activationReadyAudiences, previousKpi.activationReadyAudiences), sparkData: kpiHistory.map((k) => k.activationReadyAudiences) },
  ];

  return (
    <div className="mn-kpi-grid grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {metrics.map((m, i) => (<MetricCard key={m.label} {...m} index={i} />))}
    </div>
  );
}
