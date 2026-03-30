"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { morningBriefing } from "@/lib/data/insights";
import { toast } from "sonner";

export function MorningBriefing() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
    >
      <Card className="mn-briefing overflow-hidden">
        <div className="mn-briefing-header flex items-start justify-between border-b px-5 py-4">
          <div className="mn-briefing-header-left flex items-center gap-2.5">
            <div className="mn-briefing-icon flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="mn-briefing-meta">
              <h2 className="mn-briefing-greeting text-sm font-semibold">{morningBriefing.greeting}</h2>
              <p className="mn-briefing-date text-[11px] text-muted-foreground">{morningBriefing.date} · Minerva Intelligence Brief</p>
            </div>
          </div>
          <Badge variant="secondary" className="mn-briefing-badge gap-1.5">
            <TrendingUp className="h-3 w-3 text-emerald-400" />
            <span className="tabular-nums text-emerald-400">+{morningBriefing.keyMetric.trendPct}%</span>
            <span className="text-muted-foreground">{morningBriefing.keyMetric.label}</span>
          </Badge>
        </div>
        <div className="mn-briefing-body px-5 py-4">
          <p className="mn-briefing-summary text-sm leading-relaxed text-muted-foreground">{morningBriefing.summary}</p>
        </div>
        <div className="mn-briefing-footer flex items-center justify-between border-t px-5 py-3">
          <div className="mn-briefing-action-text flex items-center gap-2 min-w-0">
            <span className="mn-briefing-action-label text-[10px] font-semibold uppercase tracking-wider text-muted-foreground shrink-0">Top Action</span>
            <span className="mn-briefing-action-desc text-xs text-muted-foreground truncate">{morningBriefing.topAction}</span>
          </div>
          <Button
            size="sm"
            className="mn-briefing-cta ml-3 shrink-0"
            onClick={() => toast.success("Activation queued", { description: "Win-back sequence for 1,900 lapsed fans will launch within 2 hours." })}
          >
            Activate <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </Card>
    </motion.section>
  );
}
