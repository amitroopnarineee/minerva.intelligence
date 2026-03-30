"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { morningBriefing } from "@/lib/data/insights";

export function MorningBriefing() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-xl border border-border-default bg-bg-surface"
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-border-subtle px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-dim">
            <Sparkles className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-text-primary">
              {morningBriefing.greeting}
            </h2>
            <p className="text-[12px] text-text-tertiary">
              {morningBriefing.date} · Minerva Intelligence Brief
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-positive-dim px-3 py-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-positive" />
          <span className="tabular-nums text-[12px] font-semibold text-positive">
            +{morningBriefing.keyMetric.trendPct}%
          </span>
          <span className="text-[12px] text-text-secondary">
            {morningBriefing.keyMetric.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        <p className="max-w-[720px] text-[14px] leading-[1.7] text-text-secondary">
          {morningBriefing.summary}
        </p>
      </div>

      {/* Action footer */}
      <div className="flex items-center justify-between border-t border-border-subtle px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-wider text-text-tertiary">
            Top Action
          </span>
          <span className="text-[13px] text-text-secondary">
            {morningBriefing.topAction}
          </span>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-[12px] font-semibold text-bg-root transition-colors duration-150 hover:bg-accent-strong">
          Activate
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.section>
  );
}
