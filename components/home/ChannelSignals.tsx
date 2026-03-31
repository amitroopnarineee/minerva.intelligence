"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CampaignDetailSheet } from "@/components/shared/CampaignDetailSheet";
import { campaigns } from "@/lib/data/campaigns";
import { useState } from "react";
import type { Campaign } from "@/lib/types";

export function ChannelSignals() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const sorted = [...campaigns].sort((a, b) => Math.abs(b.trendPct) - Math.abs(a.trendPct));

  return (
    <>
      <section className="mn-channels">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Channel Signals</h2>
          <span className="text-xs text-muted-foreground">{campaigns.length} active campaigns</span>
        </div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.5 }}>
          <FeatureCard className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead className="text-right">ROAS</TableHead>
                  <TableHead className="text-right">Conv.</TableHead>
                  <TableHead className="text-right hidden lg:table-cell">Budget</TableHead>
                  <TableHead className="text-right">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((c) => {
                  const TrendIcon = c.trend === "up" ? TrendingUp : c.trend === "down" ? TrendingDown : Minus;
                  const trendColor = c.trend === "up" ? "text-emerald-400" : c.trend === "down" ? "text-red-400" : "text-muted-foreground";
                  const budgetPct = Math.min((c.spend / c.budget) * 100, 100);
                  return (
                    <TableRow key={c.id} className="mn-campaign-row cursor-pointer" onClick={() => setSelectedCampaign(c)}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {c.trend === "down" && <AlertTriangle className="h-3.5 w-3.5 text-red-400" />}
                          <span className="font-medium">{c.name}</span>
                          <Badge variant="outline" className="text-[10px] hidden sm:inline-flex">{c.platform}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize text-muted-foreground">{c.channel}</TableCell>
                      <TableCell className="tabular-nums font-semibold text-right">{c.roas.toFixed(1)}x</TableCell>
                      <TableCell className="tabular-nums text-right">{c.conversions}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                            <div className={`h-full rounded-full ${budgetPct > 85 ? "bg-amber-400" : "bg-primary/40"}`} style={{ width: `${budgetPct}%` }} />
                          </div>
                          <span className="tabular-nums text-[11px] text-muted-foreground">{budgetPct.toFixed(0)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`flex items-center justify-end gap-0.5 ${trendColor}`}>
                          <TrendIcon className="h-3 w-3" />
                          <span className="tabular-nums text-xs font-medium">{c.trendPct > 0 ? "+" : ""}{c.trendPct}%</span>
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </FeatureCard>
        </motion.div>
      </section>
      <CampaignDetailSheet campaign={selectedCampaign} open={!!selectedCampaign} onClose={() => setSelectedCampaign(null)} />
    </>
  );
}
