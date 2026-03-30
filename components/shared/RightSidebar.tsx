"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PanelRightOpen,
  PanelRightClose,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  ArrowRight,
  Bell,
} from "lucide-react";
import { integrations, recentActivity } from "@/lib/data/integrations";
import { opportunities } from "@/lib/data/opportunities";

const healthIcon = {
  healthy: <CheckCircle className="h-3 w-3 text-emerald-400" />,
  degraded: <AlertCircle className="h-3 w-3 text-amber-400" />,
  error: <AlertCircle className="h-3 w-3 text-red-400" />,
};

const activityDot: Record<string, string> = {
  sync: "bg-emerald-400",
  activation: "bg-primary",
  model: "bg-violet-400",
  audience: "bg-primary",
  alert: "bg-amber-400",
};

function timeAgo(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function RightSidebar() {
  const [open, setOpen] = useState(true);
  const healthyCount = integrations.filter((i) => i.healthStatus === "healthy").length;

  return (
    <>
      {/* Toggle button — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-3 top-3 z-50 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        {open ? (
          <PanelRightClose className="h-4 w-4" />
        ) : (
          <PanelRightOpen className="h-4 w-4" />
        )}
      </button>

      <AnimatePresence mode="wait">
        {open && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="h-screen flex-shrink-0 overflow-hidden border-l border-sidebar-border bg-sidebar"
          >
            <div className="flex h-full w-[320px] flex-col overflow-y-auto">
              {/* Header */}
              <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Activity & Health</span>
              </div>

              {/* Quick Actions */}
              <div className="border-b border-sidebar-border p-4">
                <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  {opportunities.slice(0, 2).map((opp, i) => (
                    <button
                      key={opp.id}
                      className="flex w-full items-start gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-accent"
                    >
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium leading-snug text-foreground line-clamp-2">
                          {opp.recommendedAction}
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {opp.recommendedChannel} · ${(opp.expectedRevenue / 1000).toFixed(0)}K expected
                        </p>
                      </div>
                      <ArrowRight className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="border-b border-sidebar-border p-4">
                <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((act) => (
                    <div key={act.id} className="flex items-start gap-2.5">
                      <div className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${activityDot[act.type] ?? "bg-muted-foreground"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground">
                          {act.label}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {act.detail}
                        </p>
                      </div>
                      <span className="flex-shrink-0 text-[10px] text-muted-foreground">
                        {timeAgo(act.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Health */}
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    System Health
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    {healthyCount}/{integrations.length} healthy
                  </span>
                </div>
                <div className="space-y-1.5">
                  {integrations.map((int) => (
                    <div
                      key={int.id}
                      className="flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-accent"
                    >
                      <div className="flex items-center gap-2">
                        {healthIcon[int.healthStatus]}
                        <span className="text-xs text-foreground">{int.name}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {timeAgo(int.lastSyncAt)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
