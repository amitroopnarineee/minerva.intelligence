"use client"

import { Bell } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { recentActivity } from "@/lib/data/integrations"

const activityDot: Record<string, string> = {
  sync: "bg-emerald-400",
  activation: "bg-blue-400",
  model: "bg-violet-400",
  audience: "bg-cyan-400",
  alert: "bg-amber-400",
}

function timeAgo(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return "just now"
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function NotificationPopover() {
  return (
    <Popover>
      <PopoverTrigger className="mn-header-bell relative inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
        <Bell className="h-4 w-4" />
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
          {recentActivity.length}
        </span>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b px-4 py-3">
          <h4 className="text-sm font-semibold">Notifications</h4>
          <p className="text-xs text-muted-foreground">{recentActivity.length} recent updates</p>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {recentActivity.map((act) => (
            <div key={act.id} className="flex items-start gap-3 border-b px-4 py-3 last:border-0 transition-colors hover:bg-muted/50 cursor-pointer">
              <div className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${activityDot[act.type] ?? "bg-muted-foreground"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{act.label}</p>
                <p className="text-xs text-muted-foreground truncate">{act.detail}</p>
              </div>
              <span className="flex-shrink-0 text-[10px] text-muted-foreground">{timeAgo(act.timestamp)}</span>
            </div>
          ))}
        </div>
        <div className="border-t px-4 py-2 text-center">
          <span className="text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors">View all activity</span>
        </div>
      </PopoverContent>
    </Popover>
  )
}
