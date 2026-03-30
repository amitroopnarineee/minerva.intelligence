"use client";

import { motion } from "framer-motion";
import { Zap, ArrowRight, DollarSign } from "lucide-react";
import { opportunities } from "@/lib/data/opportunities";
import { audiences } from "@/lib/data/audiences";

function channelBadge(channel: string) {
  const colors: Record<string, string> = {
    "Meta + Sales": "bg-[#1877F2]/10 text-[#60A5FA]",
    "Email + SMS": "bg-accent-dim text-accent",
    "Email + Meta": "bg-positive-dim text-positive",
  };
  return colors[channel] ?? "bg-bg-raised text-text-secondary";
}

export function TopOpportunities() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Zap className="h-4 w-4 text-accent" />
          <h2 className="text-base font-semibold text-text-primary">
            Top Opportunities
          </h2>
        </div>
        <span className="text-[11px] text-text-tertiary">
          Ranked by expected revenue impact
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {opportunities.map((opp, i) => {
          const audience = audiences.find((a) => a.id === opp.audienceId);
          return (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.45 + i * 0.08 }}
              className="group flex flex-col justify-between rounded-xl border border-border-default bg-bg-surface p-5 transition-colors duration-150 hover:border-border-strong"
            >
              {/* Rank + Priority */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-dim text-[11px] font-bold text-accent">
                    {i + 1}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${channelBadge(opp.recommendedChannel)}`}>
                    {opp.recommendedChannel}
                  </span>
                </div>

                {/* Action */}
                <p className="mb-3 text-[13px] font-medium leading-[1.5] text-text-primary">
                  {opp.recommendedAction}
                </p>

                {/* Audience context */}
                {audience && (
                  <p className="mb-4 text-[12px] leading-[1.5] text-text-tertiary">
                    {audience.name} · {audience.estimatedSize.toLocaleString()} people
                    {audience.emailReachRate && ` · ${(audience.emailReachRate * 100).toFixed(0)}% email reachable`}
                  </p>
                )}
              </div>

              {/* Revenue + CTA */}
              <div className="flex items-center justify-between border-t border-border-subtle pt-4">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-positive" />
                  <span className="tabular-nums text-[14px] font-semibold text-positive">
                    ${(opp.expectedRevenue / 1000).toFixed(0)}K
                  </span>
                  <span className="text-[11px] text-text-tertiary">expected</span>
                </div>
                <button className="flex items-center gap-1 rounded-lg border border-border-default px-2.5 py-1.5 text-[11px] font-medium text-text-secondary transition-colors duration-150 hover:border-accent hover:text-accent">
                  Activate
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
