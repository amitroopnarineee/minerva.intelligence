"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { campaigns } from "@/lib/data/campaigns";

export function ChannelSignals() {
  const sorted = [...campaigns].sort((a, b) => Math.abs(b.trendPct) - Math.abs(a.trendPct));

  return (
    <section className="mn-channels">
      <div className="mn-channels-header mb-3 flex items-center justify-between">
        <h2 className="mn-channels-title text-base font-semibold">Channel Signals</h2>
        <span className="mn-channels-subtitle text-xs text-muted-foreground">{campaigns.length} active campaigns</span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.5 }}
        className="mn-channels-table overflow-hidden rounded-xl border border-border bg-card"
      >
        <table className="mn-channels-table-el w-full text-left text-sm">
          <thead className="mn-channels-thead">
            <tr className="mn-channels-thead-row border-b">
              <th className="mn-channels-th px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Campaign</th>
              <th className="mn-channels-th px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Channel</th>
              <th className="mn-channels-th px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-right">ROAS</th>
              <th className="mn-channels-th px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Conv.</th>
              <th className="mn-channels-th hidden px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-right lg:table-cell">Budget</th>
              <th className="mn-channels-th px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Trend</th>
            </tr>
          </thead>
          <tbody className="mn-channels-tbody">
            {sorted.map((c) => {
              const TrendIcon = c.trend === "up" ? TrendingUp : c.trend === "down" ? TrendingDown : Minus;
              const trendColor = c.trend === "up" ? "text-emerald-400" : c.trend === "down" ? "text-red-400" : "text-muted-foreground";
              const budgetPct = Math.min((c.spend / c.budget) * 100, 100);
              return (
                <tr key={c.id} className="mn-channels-row border-b last:border-0 transition-colors hover:bg-muted/50">
                  <td className="mn-channels-td-name px-4 py-3">
                    <div className="mn-channels-name flex items-center gap-2">
                      {c.trend === "down" && <AlertTriangle className="mn-channels-alert h-3.5 w-3.5 text-red-400" />}
                      <span className="mn-channels-campaign-name font-medium">{c.name}</span>
                      <span className="mn-channels-platform text-xs text-muted-foreground">{c.platform}</span>
                    </div>
                  </td>
                  <td className="mn-channels-td-channel px-4 py-3 capitalize text-muted-foreground">{c.channel}</td>
                  <td className="mn-channels-td-roas px-4 py-3 tabular-nums font-semibold text-right">{c.roas.toFixed(1)}x</td>
                  <td className="mn-channels-td-conv px-4 py-3 tabular-nums text-right">{c.conversions}</td>
                  <td className="mn-channels-td-budget hidden px-4 py-3 lg:table-cell">
                    <div className="mn-channels-budget flex items-center justify-end gap-2">
                      <div className="mn-channels-budget-bar h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                        <div className={`mn-channels-budget-fill h-full rounded-full ${budgetPct > 85 ? "bg-amber-400" : "bg-primary/40"}`} style={{ width: `${budgetPct}%` }} />
                      </div>
                      <span className="mn-channels-budget-pct tabular-nums text-[11px] text-muted-foreground">{budgetPct.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="mn-channels-td-trend px-4 py-3">
                    <span className={`mn-channels-trend flex items-center justify-end gap-0.5 ${trendColor}`}>
                      <TrendIcon className="h-3 w-3" />
                      <span className="tabular-nums text-xs font-medium">{c.trendPct > 0 ? "+" : ""}{c.trendPct}%</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </section>
  );
}
