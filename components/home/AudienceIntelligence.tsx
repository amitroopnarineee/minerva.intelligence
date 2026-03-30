"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp, TrendingDown, Minus, ArrowRight, Mail, Phone } from "lucide-react";
import { audiences } from "@/lib/data/audiences";
import { Badge } from "@/components/ui/badge";

const typeColors: Record<string, string> = {
  lifecycle: "bg-warning-dim text-warning",
  predictive: "bg-accent-dim text-accent",
  retargeting: "bg-[#818CF8]/10 text-[#818CF8]",
  sales: "bg-positive-dim text-positive",
  suppression: "bg-negative-dim text-negative",
};

function TrendBadge({ trend, delta }: { trend?: string; delta?: number }) {
  if (!trend || !delta) return null;
  const Icon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const color = trend === "up" ? "text-positive" : trend === "down" ? "text-negative" : "text-text-tertiary";
  return (
    <span className={`inline-flex items-center gap-1 ${color}`}>
      <Icon className="h-3 w-3" />
      <span className="tabular-nums text-[11px] font-medium">
        {delta > 0 ? "+" : ""}
        {delta}
      </span>
    </span>
  );
}

function ReachBar({ rate, icon: Icon, label }: { rate: number; icon: typeof Mail; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3 w-3 text-text-tertiary" />
      <div className="flex-1">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-raised">
          <div
            className="h-full rounded-full bg-accent/60 transition-all duration-500"
            style={{ width: `${rate * 100}%` }}
          />
        </div>
      </div>
      <span className="tabular-nums text-[11px] text-text-tertiary">
        {(rate * 100).toFixed(0)}%
      </span>
    </div>
  );
}

export function AudienceIntelligence() {
  // Show top 6 activation-ready audiences
  const displayAudiences = audiences.filter((a) => a.isActivationReady).slice(0, 6);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Users className="h-4 w-4 text-accent" />
          <h2 className="text-base font-semibold text-text-primary">
            Audience Intelligence
          </h2>
        </div>
        <span className="text-[11px] text-text-tertiary">
          {displayAudiences.length} activation-ready audiences
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {displayAudiences.map((aud, i) => (
          <motion.div
            key={aud.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.6 + i * 0.06 }}
            className="group flex flex-col rounded-xl border border-border-default bg-bg-surface p-5 transition-colors duration-150 hover:border-border-strong"
          >
            {/* Header */}
            <div className="mb-3 flex items-start justify-between">
              <div className="flex-1">
                <span className={`mb-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${typeColors[aud.type] ?? "bg-bg-raised text-text-secondary"}`}>
                  {aud.type}
                </span>
                <h3 className="text-[13px] font-semibold leading-tight text-text-primary">
                  {aud.name}
                </h3>
              </div>
              <TrendBadge trend={aud.valueTrend} delta={aud.memberDelta} />
            </div>

            {/* Description */}
            <p className="mb-4 flex-1 text-[12px] leading-[1.5] text-text-tertiary">
              {aud.description}
            </p>

            {/* Stats */}
            <div className="mb-3 flex items-center gap-4 text-[12px]">
              <span className="tabular-nums font-semibold text-text-primary">
                {aud.estimatedSize.toLocaleString()}
              </span>
              <span className="text-text-tertiary">people</span>
              {aud.avgPropensityScore && (
                <>
                  <span className="text-border-strong">·</span>
                  <span className="tabular-nums text-text-secondary">
                    {(aud.avgPropensityScore * 100).toFixed(0)}% propensity
                  </span>
                </>
              )}
            </div>

            {/* Reachability */}
            <div className="mb-4 space-y-2">
              {aud.emailReachRate && (
                <ReachBar rate={aud.emailReachRate} icon={Mail} label="Email" />
              )}
              {aud.phoneReachRate && (
                <ReachBar rate={aud.phoneReachRate} icon={Phone} label="Phone" />
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border-subtle pt-3">
              <Badge variant="outline" className="border-border-default text-[10px] text-text-tertiary">
                {aud.channelRecommendation}
              </Badge>
              <button className="flex items-center gap-1 text-[11px] font-medium text-text-tertiary transition-colors duration-150 hover:text-accent">
                View audience
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
