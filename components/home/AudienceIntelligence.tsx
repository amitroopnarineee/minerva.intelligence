"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, ArrowRight, Mail, Phone } from "lucide-react";
import { audiences } from "@/lib/data/audiences";

function ReachBar({ rate, icon: Icon }: { rate: number; icon: typeof Mail }) {
  return (
    <div className="mn-audience-reach flex items-center gap-2">
      <Icon className="mn-audience-reach-icon h-3 w-3 text-muted-foreground" />
      <div className="mn-audience-reach-bar h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
        <div className="mn-audience-reach-fill h-full rounded-full bg-primary/40" style={{ width: `${rate * 100}%` }} />
      </div>
      <span className="mn-audience-reach-value tabular-nums text-[10px] text-muted-foreground">{(rate * 100).toFixed(0)}%</span>
    </div>
  );
}

export function AudienceIntelligence() {
  const displayAudiences = audiences.filter((a) => a.isActivationReady).slice(0, 6);

  return (
    <section className="mn-audience">
      <div className="mn-audience-header mb-3 flex items-center justify-between">
        <h2 className="mn-audience-title text-base font-semibold">Audience Intelligence</h2>
        <span className="mn-audience-subtitle text-xs text-muted-foreground">{displayAudiences.length} activation-ready</span>
      </div>
      <div className="mn-audience-grid grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {displayAudiences.map((aud, i) => {
          const TrendIcon = aud.valueTrend === "up" ? TrendingUp : aud.valueTrend === "down" ? TrendingDown : Minus;
          const trendColor = aud.valueTrend === "up" ? "text-emerald-400" : aud.valueTrend === "down" ? "text-red-400" : "text-muted-foreground";
          return (
            <motion.div
              key={aud.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
              className="mn-audience-card flex flex-col rounded-xl border border-border bg-card p-4"
            >
              <div className="mn-audience-card-top mb-2 flex items-start justify-between">
                <span className="mn-audience-card-type rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary-foreground">{aud.type}</span>
                <span className={`mn-audience-card-trend flex items-center gap-0.5 ${trendColor}`}>
                  <TrendIcon className="h-3 w-3" />
                  <span className="tabular-nums text-[10px] font-medium">{(aud.memberDelta ?? 0) > 0 ? "+" : ""}{aud.memberDelta}</span>
                </span>
              </div>
              <h3 className="mn-audience-card-name text-sm font-medium">{aud.name}</h3>
              <p className="mn-audience-card-desc mt-1 flex-1 text-xs text-muted-foreground leading-relaxed">{aud.description}</p>
              <div className="mn-audience-card-stats mt-3 flex items-center gap-3 text-xs">
                <span className="mn-audience-card-size tabular-nums font-semibold">{aud.estimatedSize.toLocaleString()}</span>
                <span className="text-muted-foreground">people</span>
                {aud.avgPropensityScore && (<span className="text-muted-foreground">· {(aud.avgPropensityScore * 100).toFixed(0)}% propensity</span>)}
              </div>
              <div className="mn-audience-card-reach mt-3 space-y-1.5">
                {aud.emailReachRate && <ReachBar rate={aud.emailReachRate} icon={Mail} />}
                {aud.phoneReachRate && <ReachBar rate={aud.phoneReachRate} icon={Phone} />}
              </div>
              <div className="mn-audience-card-footer mt-3 flex items-center justify-between border-t pt-3">
                <span className="mn-audience-card-channel rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground">{aud.channelRecommendation}</span>
                <button className="mn-audience-card-cta flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-primary">
                  View <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
