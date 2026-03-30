"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, TrendingUp, TrendingDown, ChevronDown, ChevronUp, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { morningBriefing, insights } from "@/lib/data/insights";
import { toast } from "sonner";

function ConfidenceDot({ score }: { score: number }) {
  const color = score > 0.8 ? "bg-emerald-400" : score > 0.6 ? "bg-amber-400" : "bg-red-400";
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
      <span className="text-[10px] text-muted-foreground tabular-nums">{(score * 100).toFixed(0)}%</span>
    </span>
  );
}

function EntityHighlight({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-foreground">{children}</span>;
}

export function MorningBriefing() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }}>
      <Card className="mn-briefing overflow-hidden border-primary/10">
        {/* Header */}
        <div className="mn-briefing-header flex items-center justify-between px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold">{morningBriefing.greeting}</h2>
                <Badge variant="secondary" className="text-[10px]">AI Brief</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">{morningBriefing.date}</p>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1.5 py-1">
            <TrendingUp className="h-3 w-3 text-emerald-400" />
            <span className="tabular-nums font-semibold text-emerald-400">+{morningBriefing.keyMetric.trendPct}%</span>
            <span className="text-muted-foreground hidden sm:inline">{morningBriefing.keyMetric.label}</span>
          </Badge>
        </div>

        {/* AI-generated insights — Perplexity style */}
        <div className="px-6 py-5 space-y-4">
          {insights.map((insight, i) => {
            const isUp = insight.changePct > 0;
            const TrendIcon = isUp ? TrendingUp : TrendingDown;
            const trendColor = insight.severity === "high" && isUp ? "text-emerald-400" : insight.severity === "high" && !isUp ? "text-red-400" : isUp ? "text-emerald-400" : "text-amber-400";
            const borderColor = insight.severity === "high" ? "border-l-primary/40" : "border-l-muted-foreground/20";

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
                className={`rounded-lg border-l-2 ${borderColor} bg-muted/30 px-4 py-3`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendIcon className={`h-3.5 w-3.5 shrink-0 ${trendColor}`} />
                      <span className="text-sm font-medium">{insight.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{insight.summary}</p>
                  </div>
                  <ConfidenceDot score={insight.confidenceScore} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Expandable detail */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-border/50"
            >
              <div className="px-6 py-4 space-y-2">
                <p className="text-xs text-muted-foreground">
                  <EntityHighlight>Data freshness:</EntityHighlight> All models refreshed within the last 4 hours. Ticketmaster sync completed at 10:00 PM. Salesforce CRM sync completed at 11:00 PM. Meta Ads data current as of 8:00 PM.
                </p>
                <p className="text-xs text-muted-foreground">
                  <EntityHighlight>Confidence context:</EntityHighlight> Premium suite demand signal is based on 2,400+ unique visitor sessions with corporate domain matching. Win-back signal is based on 1,900 resolved identity matches across email, web, and ticketing data.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-6 py-3">
          <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {expanded ? "Show less" : "View data sources & confidence"}
          </button>
          <Button size="sm" onClick={() => toast.success("Activation queued", { description: "Win-back sequence for 1,900 lapsed fans will launch within 2 hours." })}>
            Activate top action <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </Card>
    </motion.section>
  );
}
