"use client";

import { motion } from "framer-motion";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { kpiHistory } from "@/lib/data/kpis";
import { FunnelChart } from "@/components/shared/FunnelChart";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const chartData = kpiHistory.map((k) => ({
  date: new Date(k.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  revenue: Math.round(k.influencedRevenue / 1000),
  spend: Math.round(k.paidSpend / 1000),
}));

const funnelData = [
  { label: "Reached", value: 48200, displayValue: "48.2K", color: "hsl(var(--chart-1))" },
  { label: "Engaged", value: 12800, displayValue: "12.8K", color: "hsl(var(--chart-2))" },
  { label: "Converted", value: 3400, displayValue: "3.4K", color: "hsl(var(--chart-3))" },
  { label: "Revenue", value: 890, displayValue: "$242K", color: "hsl(var(--chart-4))" },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="mn-insights-card-1 rounded-none border bg-popover px-3 py-2 shadow-md">
      <p className="mn-insights-el-2 text-xs font-medium mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="mn-insights-el-3 text-xs text-muted-foreground">
          <span className="mn-insights-el-4 font-medium text-foreground">${p.value}K</span> {p.name}
        </p>
      ))}
    </div>
  );
}

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
            <div className="mn-insights-el-9 h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--chart-5))" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(var(--chart-5))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-2))" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
                  <Area type="monotone" dataKey="spend" stroke="hsl(var(--chart-5))" strokeWidth={1.5} fill="url(#spendGrad)" name="Spend" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
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
            <FunnelChart data={funnelData} layers={4} gap={3} staggerDelay={0.15} showPercentage={true} showValues={true} showLabels={true} className="h-[220px]" style={{ aspectRatio: "unset" }} />
          </CardContent>
        </FeatureCard>
      </motion.div>
    </div>
  );
}
