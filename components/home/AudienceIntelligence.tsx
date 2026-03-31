"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, ArrowRight, Mail, Phone } from "lucide-react";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { audiences } from "@/lib/data/audiences";
import { AudienceDetailSheet } from "@/components/shared/AudienceDetailSheet";
import { useState } from "react";
import type { Audience } from "@/lib/types";

function ReachBar({ rate, icon: Icon }: { rate: number; icon: typeof Mail }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3 w-3 text-muted-foreground" />
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-primary/40" style={{ width: `${rate * 100}%` }} />
      </div>
      <span className="tabular-nums text-[10px] text-muted-foreground">{(rate * 100).toFixed(0)}%</span>
    </div>
  );
}

export function AudienceIntelligence() {
  const [selectedAudience, setSelectedAudience] = useState<Audience | null>(null)
  const displayAudiences = audiences.filter((a) => a.isActivationReady).slice(0, 6);

  return (
    <>
      <section className="mn-audience">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Audience Intelligence</h2>
          <span className="text-xs text-muted-foreground">{displayAudiences.length} activation-ready</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {displayAudiences.map((aud, i) => {
            const TrendIcon = aud.valueTrend === "up" ? TrendingUp : aud.valueTrend === "down" ? TrendingDown : Minus;
            const trendColor = aud.valueTrend === "up" ? "text-emerald-400" : aud.valueTrend === "down" ? "text-red-400" : "text-muted-foreground";
            return (
              <motion.div key={aud.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}>
                <FeatureCard className="mn-audience-card flex h-full flex-col p-4 cursor-pointer hover:border-primary/30 transition-colors" decorated={true}>
                  <div className="mb-2 flex items-start justify-between">
                    <Badge variant="secondary" className="text-[10px] uppercase">{aud.type}</Badge>
                    <span className={`flex items-center gap-0.5 ${trendColor}`}>
                      <TrendIcon className="h-3 w-3" />
                      <span className="tabular-nums text-[10px] font-medium">{(aud.memberDelta ?? 0) > 0 ? "+" : ""}{aud.memberDelta}</span>
                    </span>
                  </div>
                  <h3 className="text-sm font-medium">{aud.name}</h3>
                  <p className="mt-1 flex-1 text-xs text-muted-foreground leading-relaxed">{aud.description}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <span className="tabular-nums font-semibold">{aud.estimatedSize.toLocaleString()}</span>
                    <span className="text-muted-foreground">people</span>
                    {aud.avgPropensityScore && <span className="text-muted-foreground">· {(aud.avgPropensityScore * 100).toFixed(0)}% propensity</span>}
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {aud.emailReachRate && <ReachBar rate={aud.emailReachRate} icon={Mail} />}
                    {aud.phoneReachRate && <ReachBar rate={aud.phoneReachRate} icon={Phone} />}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t pt-3">
                    <Badge variant="outline" className="text-[10px]">{aud.channelRecommendation}</Badge>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground"
                      onClick={() => setSelectedAudience(aud)}>
                      View <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </FeatureCard>
              </motion.div>
            );
          })}
        </div>
      </section>
      <AudienceDetailSheet audience={selectedAudience} open={!!selectedAudience} onClose={() => setSelectedAudience(null)} />
    </>
  );
}
