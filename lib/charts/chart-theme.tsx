"use client"

import type { CSSProperties, ReactNode } from "react"
import { Tooltip, type TooltipProps } from "recharts"

// ── Color Palette ────────────────────────────────────────────────────────────
// Single source of truth for every chart in the project.

export const CHART_COLORS = {
  /** Primary accent — selected bars, active lines, CTAs */
  primary: "#6B8DE3",
  primaryLight: "#8BA6F0",
  primaryDim: "rgba(107, 141, 227, 0.15)",

  /** Secondary — comparison lines, secondary series */
  secondary: "#A78BFA",
  secondaryDim: "rgba(167, 139, 250, 0.12)",

  /** Positive — growth, increase, healthy */
  positive: "#34D399",
  positiveDim: "rgba(52, 211, 153, 0.12)",

  /** Negative — decline, risk, attention */
  negative: "#F87171",
  negativeDim: "rgba(248, 113, 113, 0.12)",

  /** Neutral — unselected bars, grid, muted elements */
  muted: "rgba(255, 255, 255, 0.06)",
  mutedStroke: "rgba(255, 255, 255, 0.12)",

  /** Axis text, tick marks */
  axisText: "rgba(255, 255, 255, 0.35)",
  axisLine: "rgba(255, 255, 255, 0.08)",

  /** Glass surfaces */
  glassBg: "rgba(255, 255, 255, 0.04)",
  glassBorder: "rgba(255, 255, 255, 0.08)",
} as const

// ── Gradient Definitions ─────────────────────────────────────────────────────
// Drop this inside any <defs> block in a Recharts chart.

export function ChartGradients() {
  return (
    <>
      {/* Primary area fill */}
      <linearGradient id="mn-grad-primary" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.35} />
        <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
      </linearGradient>

      {/* Secondary area fill */}
      <linearGradient id="mn-grad-secondary" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={CHART_COLORS.secondary} stopOpacity={0.3} />
        <stop offset="100%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
      </linearGradient>

      {/* Positive area fill */}
      <linearGradient id="mn-grad-positive" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={CHART_COLORS.positive} stopOpacity={0.3} />
        <stop offset="100%" stopColor={CHART_COLORS.positive} stopOpacity={0} />
      </linearGradient>

      {/* Negative area fill */}
      <linearGradient id="mn-grad-negative" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={CHART_COLORS.negative} stopOpacity={0.3} />
        <stop offset="100%" stopColor={CHART_COLORS.negative} stopOpacity={0} />
      </linearGradient>

      {/* Primary bar gradient (vertical) */}
      <linearGradient id="mn-grad-bar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={CHART_COLORS.primaryLight} stopOpacity={0.95} />
        <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0.6} />
      </linearGradient>
    </>
  )
}

// ── Glass Tooltip ────────────────────────────────────────────────────────────
// Custom tooltip with glass aesthetic. Use as <Tooltip content={<GlassTooltip />} />

interface GlassTooltipPayload {
  name?: string
  value?: number | string
  color?: string
  dataKey?: string
  payload?: Record<string, unknown>
}

interface GlassTooltipProps {
  active?: boolean
  payload?: GlassTooltipPayload[]
  label?: string | number
  /** Optional formatter for the label. e.g. (label) => `Score ${label}` */
  labelFormatter?: (label: string | number) => string
  /** Optional formatter for values. e.g. (value) => `${value}%` */
  valueFormatter?: (value: number | string, name?: string) => string
}

export function GlassTooltip({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
}: GlassTooltipProps) {
  if (!active || !payload?.length) return null

  const displayLabel = labelFormatter ? labelFormatter(label ?? "") : label

  return (
    <div
      className="mn-chart-tooltip"
      style={{
        background: "rgba(15, 15, 20, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.9)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        minWidth: 120,
      }}
    >
      {displayLabel !== undefined && displayLabel !== "" && (
        <div
          className="mn-chart-tooltip-label"
          style={{
            fontSize: 11,
            color: "rgba(255, 255, 255, 0.45)",
            marginBottom: 6,
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
        >
          {displayLabel}
        </div>
      )}
      {payload.map((entry, i) => {
        const displayValue = valueFormatter
          ? valueFormatter(entry.value ?? 0, entry.name)
          : entry.value
        return (
          <div
            key={i}
            className="mn-chart-tooltip-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: i > 0 ? 4 : 0,
            }}
          >
            <div
              className="mn-chart-tooltip-dot"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: entry.color || CHART_COLORS.primary,
                flexShrink: 0,
              }}
            />
            <span style={{ color: "rgba(255,255,255,0.55)", marginRight: 4 }}>
              {entry.name}
            </span>
            <span style={{ fontWeight: 600, marginLeft: "auto", fontVariantNumeric: "tabular-nums" }}>
              {displayValue}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── Default Axis Props ───────────────────────────────────────────────────────
// Spread these on <XAxis> and <YAxis> for consistent styling.

export const defaultXAxisProps = {
  tick: { fontSize: 11, fill: CHART_COLORS.axisText },
  tickLine: false,
  axisLine: { stroke: CHART_COLORS.axisLine },
} as const

export const defaultYAxisProps = {
  tick: { fontSize: 11, fill: CHART_COLORS.axisText },
  tickLine: false,
  axisLine: false,
  width: 40,
} as const

// ── Consistent margins ──────────────────────────────────────────────────────

export const chartMargins = {
  compact: { top: 4, right: 8, bottom: 0, left: 0 },
  standard: { top: 8, right: 16, bottom: 20, left: 8 },
  withAxis: { top: 8, right: 16, bottom: 24, left: 48 },
} as const
