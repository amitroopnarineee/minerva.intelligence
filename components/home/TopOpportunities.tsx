"use client";

import { motion } from "framer-motion";
import { ArrowRight, DollarSign } from "lucide-react";
import { opportunities } from "@/lib/data/opportunities";
import { audiences } from "@/lib/data/audiences";

export function TopOpportunities() {
  return (
    <section className="mn-opps">
      <div className="mn-opps-header mb-3 flex items-center justify-between">
        <h2 className="mn-opps-title text-base font-semibold">Top Opportunities</h2>
        <span className="mn-opps-subtitle text-xs text-muted-foreground">Ranked by expected revenue</span>
      </div>
      <div className="mn-opps-grid grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {opportunities.map((opp, i) => {
          const audience = audiences.find((a) => a.id === opp.audienceId);
          return (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
              className="mn-opps-card flex flex-col justify-between rounded-xl border border-border bg-card p-4"
            >
              <div className="mn-opps-card-body">
                <div className="mn-opps-card-top mb-2.5 flex items-center justify-between">
                  <span className="mn-opps-card-rank flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold bg-primary/10 text-primary">{i + 1}</span>
                  <span className="mn-opps-card-channel rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">{opp.recommendedChannel}</span>
                </div>
                <p className="mn-opps-card-action text-sm font-medium leading-snug">{opp.recommendedAction}</p>
                {audience && (
                  <p className="mn-opps-card-context mt-2 text-xs text-muted-foreground">
                    {audience.name} · {audience.estimatedSize.toLocaleString()} people
                    {audience.emailReachRate && ` · ${(audience.emailReachRate * 100).toFixed(0)}% email reachable`}
                  </p>
                )}
              </div>
              <div className="mn-opps-card-footer mt-4 flex items-center justify-between border-t pt-3">
                <div className="mn-opps-card-revenue flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="mn-opps-card-revenue-value tabular-nums text-sm font-semibold text-emerald-400">${(opp.expectedRevenue / 1000).toFixed(0)}K</span>
                  <span className="mn-opps-card-revenue-label text-[10px] text-muted-foreground">expected</span>
                </div>
                <button className="mn-opps-card-cta flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                  Activate <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
