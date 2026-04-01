"use client";

import { motion } from "framer-motion";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { kpiHistory } from "@/lib/data/kpis";
import { FunnelChart } from "@/components/shared/FunnelChart";
import {
  AreaChart as VisxAreaChart,
  Area as VisxArea,
  Grid as VisxGrid,
  XAxis as VisxXAxis,
  ChartTooltip as VisxTooltip,
} from "@/components/ui/area-chart";

// Transform KPI data for visx (needs Date objects)
const chartData = kpiHistory.map((k) => ({
  date: new Date(k.date),
  revenue: Math.round(k.influencedRevenue / 1000),
  spend: Math.round(k.paidSpend / 1000),
}));

const funnelData = [
  { label: "Reached", value: 48200, displayValue: "48.2K", color: "hsl(var(--chart-1))" },
  { label: "Engaged", value: 12800, displayValue: "12.8K", color: "hsl(var(--chart-2))" },
  { label: "Converted", value: 3400, displayValue: "3.4K", color: "hsl(var(--chart-3))" },
  { label: "Revenue", value: 890, displayValue: "$242K", color: "hsl(var(--chart-4))" },
];

export function InsightsCharts() {
  return (
    <div className="mn-charts grid gap-4 lg:grid-cols-5">
      <motion.div className="mn-insights-el-5 lg:col-span-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.55 }}>
        <FeatureCard className="h-full">
          <CardHeader className="pb-2">
            <div className="mn-insights-row-6 flex items-center justify-between">
              <CardTitle className="mn-insights-el-7 text-sm font-semibold">Revenue vs Spend (7d)</CardTitle>
              <Badge variant="secondary" className="mn-insights-el-8 text-[10px]">Daily</Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <VisxAreaChart data={chartData} xDataKey="date" aspectRatio="2.2 / 1"
              margin={{ top: 12, right: 12, bottom: 32, left: 12 }}>
              <VisxGrid horizontal numTicksRows={4} strokeDasharray="3,3" strokeOpacity={0.3} />
              <VisxArea dataKey="revenue" fill="#38bdf8" fillOpacity={0.3} stroke="#38bdf8" strokeWidth={2} fadeEdges />
              <VisxArea dataKey="spend" fill="#38bdf8" fillOpacity={0.1} stroke="#38bdf880" strokeWidth={1.5} fadeEdges />
              <VisxXAxis numTicks={5} />
              <VisxTooltip rows={(point) => [
                { color: "#38bdf8", label: "Revenue", value: `${(point.revenue as number)?.toLocaleString()}K` },
                { color: "#38bdf880", label: "Spend", value: `${(point.spend as number)?.toLocaleString()}K` },
              ]} />
            </VisxAreaChart>
          </CardContent>
        </FeatureCard>
      </motion.div>

      <motion.div className="mn-insights-el-10 lg:col-span-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.65 }}>
        <FeatureCard className="h-full">
          <CardHeader className="pb-2">
            <div className="mn-insights-row-11 flex items-center justify-between">
              <CardTitle className="mn-insights-el-12 text-sm font-semibold">Conversion Funnel</CardTitle>
              <Badge variant="secondary" className="mn-insights-el-13 text-[10px]">30d</Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <FunnelChart data={funnelData} layers={4} gap={3} staggerDelay={0.15}
              showPercentage={true} showValues={true} showLabels={true}
              className="h-[220px]" style={{ aspectRatio: "unset" }} />
          </CardContent>
        </FeatureCard>
      </motion.div>
    </div>
  );
}
