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
    <div className="mn-audint-group-1 flex items-center gap-2">
      <Icon className="mn-audint-el-2 h-3 w-3 text-muted-foreground" />
      <div className="mn-audint-el-3 h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
        <div className="mn-audint-el-4 h-full rounded-full bg-primary/40" style={{ width: `${rate * 100}%` }} />
      </div>
      <span className="mn-audint-el-5 tabular-nums text-[10px] text-muted-foreground">{(rate * 100).toFixed(0)}%</span>
    </div>
  );
}

export function AudienceIntelligence() {
  const [selectedAudience, setSelectedAudience] = useState<Audience | null>(null)
  const displayAudiences = audiences.filter((a) => a.isActivationReady).slice(0, 6);

  return (
    <>
      <section className="mn-audience">
        <div className="mn-audint-row-6 mb-3 flex items-center justify-between">
          <h2 className="mn-audint-el-7 text-base font-semibold">Audience Intelligence</h2>
          <span className="mn-audint-el-8 text-xs text-muted-foreground">{displayAudiences.length} activation-ready</span>
        </div>
        <div className="mn-audint-grid grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {displayAudiences.map((aud, i) => {
            const TrendIcon = aud.valueTrend === "up" ? TrendingUp : aud.valueTrend === "down" ? TrendingDown : Minus;
            const trendColor = aud.valueTrend === "up" ? "text-emerald-400" : aud.valueTrend === "down" ? "text-red-400" : "text-muted-foreground";
            return (
              <motion.div key={aud.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}>
                <FeatureCard className="mn-audience-card flex h-full flex-col p-4 cursor-pointer hover:border-primary/30 transition-colors" decorated={true}
                  data-selectable data-select-type="Audience" data-select-label={aud.name}
                  data-select-size={`${aud.estimatedSize.toLocaleString()}`}
                  data-select-propensity={`${((aud.avgPropensityScore ?? 0) * 100).toFixed(0)}%`}
                  data-select-channel={aud.channelRecommendation}>
                  <div className="mn-audint-el-10 mb-2 flex items-start justify-between">
                    <Badge variant="secondary" className="mn-audint-el-11 text-[10px] uppercase">{aud.type}</Badge>
                    <span className={`flex items-center gap-0.5 ${trendColor}`}>
                      <TrendIcon className="h-3 w-3" />
                      <span className="mn-audint-label-12 tabular-nums text-[10px] font-medium">{(aud.memberDelta ?? 0) > 0 ? "+" : ""}{aud.memberDelta}</span>
                    </span>
                  </div>
                  <h3 className="mn-audint-el-13 text-sm font-medium">{aud.name}</h3>
                  <p className="mn-audint-el-14 mt-1 flex-1 text-xs text-muted-foreground leading-relaxed">{aud.description}</p>
                  <div className="mn-audint-group-15 mt-3 flex items-center gap-3 text-xs">
                    <span className="mn-audint-el-16 tabular-nums font-semibold">{aud.estimatedSize.toLocaleString()}</span>
                    <span className="mn-audint-el-17 text-muted-foreground">people</span>
                    {aud.avgPropensityScore && <span className="mn-audint-el-18 text-muted-foreground">· {(aud.avgPropensityScore * 100).toFixed(0)}% propensity</span>}
                  </div>
                  <div className="mn-audint-stack mt-3 space-y-1.5">
                    {aud.emailReachRate && <ReachBar rate={aud.emailReachRate} icon={Mail} />}
                    {aud.phoneReachRate && <ReachBar rate={aud.phoneReachRate} icon={Phone} />}
                  </div>
                  <div className="mn-audint-row-20 mt-3 flex items-center justify-between border-t pt-3">
                    <Badge variant="outline" className="mn-audint-el-21 text-[10px]">{aud.channelRecommendation}</Badge>
                    <Button variant="ghost" size="sm" className="mn-audint-el-22 h-7 text-xs text-muted-foreground"
                      onClick={() => setSelectedAudience(aud)}>
                      View <ArrowRight className="mn-audint-el-23 ml-1 h-3 w-3" />
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
