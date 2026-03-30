"use client";

import { motion } from "framer-motion";
import { Activity, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { campaigns } from "@/lib/data/campaigns";

function TrendIndicator({ trend, pct }: { trend: string; pct: number }) {
  const Icon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const color = trend === "up" ? "text-positive" : trend === "down" ? "text-negative" : "text-text-tertiary";
  return (
    <span className={`inline-flex items-center gap-1 ${color}`}>
      <Icon className="h-3 w-3" />
      <span className="tabular-nums text-[12px] font-medium">
        {pct > 0 ? "+" : ""}{pct}%
      </span>
    </span>
  );
}

function SpendBar({ spend, budget }: { spend: number; budget: number }) {
  const pct = Math.min((spend / budget) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-bg-raised">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            pct > 85 ? "bg-warning" : "bg-accent/50"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="tabular-nums text-[11px] text-text-tertiary">
        {pct.toFixed(0)}%
      </span>
    </div>
  );
}

export function ChannelSignals() {
  const sorted = [...campaigns].sort((a, b) => Math.abs(b.trendPct) - Math.abs(a.trendPct));

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Activity className="h-4 w-4 text-accent" />
          <h2 className="text-base font-semibold text-text-primary">
            Channel Signals
          </h2>
        </div>
        <span className="text-[11px] text-text-tertiary">
          {campaigns.length} active campaigns
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.75 }}
        className="overflow-hidden rounded-xl border border-border-default bg-bg-surface"
      >
        {/* Table header */}
        <div className="grid grid-cols-[1fr_80px_80px_80px_100px_80px_60px] gap-4 border-b border-border-subtle px-5 py-3">
          {["Campaign", "Channel", "ROAS", "Conversions", "Budget Used", "Trend", ""].map(
            (h) => (
              <span key={h} className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                {h}
              </span>
            )
          )}
        </div>

        {/* Rows */}
        {sorted.map((c, i) => (
          <div
            key={c.id}
            className={`grid grid-cols-[1fr_80px_80px_80px_100px_80px_60px] items-center gap-4 px-5 py-3.5 transition-colors duration-100 hover:bg-bg-raised ${
              i < sorted.length - 1 ? "border-b border-border-subtle" : ""
            }`}
          >
            {/* Name + platform */}
            <div className="flex items-center gap-2">
              {c.trend === "down" && (
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 text-negative" />
              )}
              <div>
                <span className="text-[13px] font-medium text-text-primary">{c.name}</span>
                <span className="ml-2 text-[11px] text-text-tertiary">{c.platform}</span>
              </div>
            </div>

            {/* Channel */}
            <span className="text-[12px] capitalize text-text-secondary">{c.channel}</span>

            {/* ROAS */}
            <span className="tabular-nums text-[13px] font-semibold text-text-primary">
              {c.roas.toFixed(1)}x
            </span>

            {/* Conversions */}
            <span className="tabular-nums text-[13px] text-text-primary">
              {c.conversions}
            </span>

            {/* Budget */}
            <SpendBar spend={c.spend} budget={c.budget} />

            {/* Trend */}
            <TrendIndicator trend={c.trend} pct={c.trendPct} />

            {/* Action */}
            <button className="text-[11px] font-medium text-text-tertiary transition-colors hover:text-accent">
              View
            </button>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
