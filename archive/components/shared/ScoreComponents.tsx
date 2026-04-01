"use client"

import { cn } from "@/lib/utils"

interface PropensityRingProps {
  score: number
  size?: number
  label?: string
  className?: string
}

export function PropensityRing({ score, size = 48, label, className }: PropensityRingProps) {
  const pct = Math.round(score * 100)
  const radius = (size - 6) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (score * circumference)
  const color = pct > 70 ? "stroke-emerald-500" : pct > 40 ? "stroke-amber-400" : "stroke-red-400"

  return (
    <div className={cn("mn-propensity-ring flex flex-col items-center gap-1", className)}>
      <div className="mn-score-el-1 relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="mn-score-el-2 -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={3} className="mn-score-el-3 text-secondary" />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={3} strokeLinecap="round" className={color}
            strokeDasharray={circumference} strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }} />
        </svg>
        <div className="mn-score-el-4 absolute inset-0 flex items-center justify-center">
          <span className="mn-score-el-5 text-xs font-bold tabular-nums">{pct}</span>
        </div>
      </div>
      {label && <span className="mn-score-label-6 text-[9px] text-muted-foreground font-medium uppercase tracking-wider">{label}</span>}
    </div>
  )
}

interface ScoreBadgeProps {
  score: number
  label: string
  size?: "sm" | "md"
  className?: string
}

export function ScoreBadge({ score, label, size = "sm", className }: ScoreBadgeProps) {
  const pct = Math.round(score * 100)
  const color = pct > 70 ? "text-emerald-500 bg-emerald-500/10" : pct > 40 ? "text-amber-500 bg-amber-500/10" : "text-red-400 bg-red-400/10"

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("inline-flex items-center justify-center rounded font-bold tabular-nums", color,
        size === "sm" ? "h-6 w-8 text-[10px]" : "h-8 w-10 text-xs"
      )}>
        {pct}
      </span>
      <span className={cn("text-muted-foreground", size === "sm" ? "text-[10px]" : "text-xs")}>{label}</span>
    </div>
  )
}

interface IdentityBarProps {
  confidence: number
  completeness: number
  className?: string
}

export function IdentityBar({ confidence, completeness, className }: IdentityBarProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="mn-score-group-7 flex items-center gap-1.5">
        <div className="mn-score-el-8 h-1.5 w-12 overflow-hidden rounded-full bg-secondary">
          <div className="mn-score-el-9 h-full rounded-full bg-primary/60" style={{ width: `${confidence * 100}%` }} />
        </div>
        <span className="mn-score-el-10 text-[9px] text-muted-foreground tabular-nums">{Math.round(confidence * 100)}% ID</span>
      </div>
      <div className="mn-score-group-11 flex items-center gap-1.5">
        <div className="mn-score-el-12 h-1.5 w-12 overflow-hidden rounded-full bg-secondary">
          <div className="mn-score-el-13 h-full rounded-full bg-primary/40" style={{ width: `${completeness * 100}%` }} />
        </div>
        <span className="mn-score-el-14 text-[9px] text-muted-foreground tabular-nums">{Math.round(completeness * 100)}% complete</span>
      </div>
    </div>
  )
}
