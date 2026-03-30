"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { morningBriefing } from "@/lib/data/insights";

export function MorningBriefing() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="rounded-xl border border-border bg-card"
    >
      <div className="flex items-start justify-between border-b px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">{morningBriefing.greeting}</h2>
            <p className="text-[11px] text-muted-foreground">{morningBriefing.date} · Minerva Intelligence Brief</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1">
          <TrendingUp className="h-3 w-3 text-emerald-400" />
          <span className="tabular-nums text-[11px] font-semibold text-emerald-400">+{morningBriefing.keyMetric.trendPct}%</span>
          <span className="text-[11px] text-muted-foreground">{morningBriefing.keyMetric.label}</span>
        </div>
      </div>
      <div className="px-5 py-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{morningBriefing.summary}</p>
      </div>
      <div className="flex items-center justify-between border-t px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Top Action</span>
          <span className="text-xs text-muted-foreground">{morningBriefing.topAction}</span>
        </div>
        <button className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
          Activate <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </motion.section>
  );
}
