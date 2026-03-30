"use client";

import { motion } from "framer-motion";
import { ArrowRight, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { opportunities } from "@/lib/data/opportunities";
import { audiences } from "@/lib/data/audiences";
import { toast } from "sonner";

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
            >
              <Card className="mn-opps-card flex h-full flex-col justify-between p-4">
                <div className="mn-opps-card-body">
                  <div className="mn-opps-card-top mb-2.5 flex items-center justify-between">
                    <span className="mn-opps-card-rank flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold bg-primary/10 text-primary">{i + 1}</span>
                    <Badge variant="secondary" className="mn-opps-card-channel text-[10px]">{opp.recommendedChannel}</Badge>
                  </div>
                  <p className="mn-opps-card-action text-sm font-medium leading-snug">{opp.recommendedAction}</p>
                  {audience && (
                    <p className="mn-opps-card-context mt-2 text-xs text-muted-foreground">
                      {audience.name} · {audience.estimatedSize.toLocaleString()} people
                      {audience.emailReachRate && ` · ${(audience.emailReachRate * 100).toFixed(0)}% reachable`}
                    </p>
                  )}
                </div>
                <div className="mn-opps-card-footer mt-4 flex items-center justify-between border-t pt-3">
                  <div className="mn-opps-card-revenue flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="tabular-nums text-sm font-semibold text-emerald-400">${(opp.expectedRevenue / 1000).toFixed(0)}K</span>
                    <span className="text-[10px] text-muted-foreground">expected</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mn-opps-card-cta h-7 text-xs"
                    onClick={() => toast.success("Activation queued", { description: `${opp.recommendedChannel} activation for ${audience?.name ?? "audience"} is being prepared.` })}
                  >
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
