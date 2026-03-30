"use client";

import { motion } from "framer-motion";
import { ArrowRight, DollarSign, Zap, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { opportunities } from "@/lib/data/opportunities";
import { audiences } from "@/lib/data/audiences";
import { toast } from "sonner";

export function TopOpportunities() {
  const top = opportunities[0];
  const rest = opportunities.slice(1);
  const topAudience = audiences.find((a) => a.id === top.audienceId);

  return (
    <section className="mn-opps">
      <div className="mn-opps-header mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold">Top Opportunities</h2>
        </div>
        <span className="text-xs text-muted-foreground">Ranked by expected revenue</span>
      </div>

      {/* #1 — Hero opportunity */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
        <Card className="mn-opps-hero mb-4 overflow-hidden border-primary/20 bg-primary/[0.03]">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 p-6">
              <div className="mb-3 flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground text-[10px] font-bold">TOP PRIORITY</Badge>
                <Badge variant="secondary" className="text-[10px]">{top.recommendedChannel}</Badge>
              </div>
              <h3 className="text-lg font-semibold leading-snug mb-2">{top.recommendedAction}</h3>
              {topAudience && (
                <p className="text-sm text-muted-foreground mb-4">
                  {topAudience.name} · {topAudience.estimatedSize.toLocaleString()} people · {topAudience.emailReachRate ? `${(topAudience.emailReachRate * 100).toFixed(0)}% reachable` : ""}
                </p>
              )}
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Expected Revenue</span>
                  <p className="tabular-nums text-2xl font-bold text-emerald-400">${(top.expectedRevenue / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Expected Lift</span>
                  <p className="flex items-center gap-1 text-2xl font-bold"><TrendingUp className="h-5 w-5 text-emerald-400" />{top.expectedLiftPct}%</p>
                </div>
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Priority Score</span>
                  <p className="tabular-nums text-2xl font-bold">{(top.priorityScore * 100).toFixed(0)}</p>
                </div>
              </div>
            </div>
            <div className="flex items-end justify-end p-6 lg:border-l border-t lg:border-t-0 border-border/50">
              <Button size="lg" onClick={() => toast.success("Activation queued", { description: `${top.recommendedChannel} activation for ${topAudience?.name} is being prepared.` })}>
                Activate Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* #2 and #3 — Secondary opportunities */}
      <div className="grid gap-3 sm:grid-cols-2">
        {rest.map((opp, i) => {
          const audience = audiences.find((a) => a.id === opp.audienceId);
          return (
            <motion.div key={opp.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.45 + i * 0.08 }}>
              <Card className="mn-opps-card flex h-full flex-col p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] tabular-nums">#{i + 2}</Badge>
                  <Badge variant="secondary" className="text-[10px]">{opp.recommendedChannel}</Badge>
                </div>
                <p className="text-sm font-medium leading-snug flex-1">{opp.recommendedAction}</p>
                {audience && <p className="mt-2 text-xs text-muted-foreground">{audience.name} · {audience.estimatedSize.toLocaleString()} people</p>}
                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="tabular-nums text-sm font-semibold text-emerald-400">${(opp.expectedRevenue / 1000).toFixed(0)}K</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toast.success("Activation queued", { description: `${opp.recommendedChannel} activation is being prepared.` })}>
                    Activate <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
