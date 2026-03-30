"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Clock, Plug } from "lucide-react";
import { integrations, recentActivity } from "@/lib/data/integrations";

const healthIcon = {
  healthy: <CheckCircle className="h-3 w-3 text-positive" />,
  degraded: <AlertCircle className="h-3 w-3 text-warning" />,
  error: <AlertCircle className="h-3 w-3 text-negative" />,
};

const activityIcon = {
  sync: "text-positive",
  activation: "text-accent",
  model: "text-[#818CF8]",
  audience: "text-accent",
  alert: "text-warning",
};

function timeAgo(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function SystemTrust() {
  const healthyCount = integrations.filter((i) => i.healthStatus === "healthy").length;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.9 }}
      className="rounded-xl border border-border-default bg-bg-surface"
    >
      <div className="grid grid-cols-[1fr_1px_1fr] divide-x divide-border-subtle">
        {/* Integrations health */}
        <div className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <Plug className="h-3.5 w-3.5 text-text-tertiary" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
              System Health
            </span>
            <span className="ml-auto text-[11px] text-text-tertiary">
              {healthyCount}/{integrations.length} healthy
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {integrations.map((int) => (
              <div
                key={int.id}
                className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-bg-raised px-2.5 py-1.5"
              >
                {healthIcon[int.healthStatus]}
                <span className="text-[11px] text-text-secondary">{int.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider rendered by grid */}
        <div />

        {/* Recent activity */}
        <div className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-text-tertiary" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
              Recent Activity
            </span>
          </div>
          <div className="space-y-2">
            {recentActivity.slice(0, 4).map((act) => (
              <div key={act.id} className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${
                  act.type === "alert" ? "bg-warning" : "bg-accent"
                }`} />
                <span className="text-[12px] font-medium text-text-secondary">
                  {act.label}
                </span>
                <span className="flex-1 truncate text-[11px] text-text-tertiary">
                  {act.detail}
                </span>
                <span className="flex-shrink-0 text-[10px] text-text-tertiary">
                  {timeAgo(act.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
