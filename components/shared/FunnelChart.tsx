"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FunnelGradientStop {
  offset: string | number;
  color: string;
}

export interface FunnelStage {
  label: string;
  value: number;
  displayValue?: string;
  color?: string;
  gradient?: FunnelGradientStop[];
}

export interface FunnelChartProps {
  data: FunnelStage[];
  orientation?: "horizontal" | "vertical";
  color?: string;
  layers?: number;
  className?: string;
  style?: CSSProperties;
  showPercentage?: boolean;
  showValues?: boolean;
  showLabels?: boolean;
  hoveredIndex?: number | null;
  onHoverChange?: (index: number | null) => void;
  formatPercentage?: (pct: number) => string;
  formatValue?: (value: number) => string;
  staggerDelay?: number;
  gap?: number;
  renderPattern?: (id: string, color: string) => ReactNode;
  edges?: "curved" | "straight";
  labelLayout?: "spread" | "grouped";
  labelOrientation?: "vertical" | "horizontal";
  labelAlign?: "center" | "start" | "end";
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const fmtPct = (p: number) => `${Math.round(p)}%`;
const fmtVal = (v: number) => v.toLocaleString("en-US");
const springConfig = { stiffness: 120, damping: 20, mass: 1 };
const hoverSpring = { stiffness: 300, damping: 24 };

// ─── SVG Helpers ─────────────────────────────────────────────────────────────

function hSegmentPath(normStart: number, normEnd: number, segW: number, H: number, layerScale: number, straight = false) {
  const my = H / 2;
  const h0 = normStart * H * 0.44 * layerScale;
  const h1 = normEnd * H * 0.44 * layerScale;
  if (straight) return `M 0 ${my - h0} L ${segW} ${my - h1} L ${segW} ${my + h1} L 0 ${my + h0} Z`;
  const cx = segW * 0.55;
  return `M 0 ${my - h0} C ${cx} ${my - h0}, ${segW - cx} ${my - h1}, ${segW} ${my - h1} L ${segW} ${my + h1} C ${segW - cx} ${my + h1}, ${cx} ${my + h0}, 0 ${my + h0} Z`;
}

// ─── Animated Ring ───────────────────────────────────────────────────────────

function HRing({ d, color, fill, opacity, hovered, ringIndex, totalRings }: {
  d: string; color: string; fill?: string; opacity: number; hovered: boolean; ringIndex: number; totalRings: number;
}) {
  const extraScale = 1 + (ringIndex / Math.max(totalRings - 1, 1)) * 0.12;
  const ringSpring = { stiffness: 300 - ringIndex * 60, damping: 24 - ringIndex * 3 };
  const scaleY = useSpring(1, ringSpring);
  useEffect(() => { scaleY.set(hovered ? extraScale : 1); }, [hovered, scaleY, extraScale]);
  return <motion.path d={d} fill={fill ?? color} opacity={opacity} style={{ scaleY, transformOrigin: "center center" }} />;
}

// ─── Animated Segment ────────────────────────────────────────────────────────

function HSegment({ index, normStart, normEnd, segW, fullH, color, layers, staggerDelay, hovered, dimmed, renderPattern, straight, gradientStops }: {
  index: number; normStart: number; normEnd: number; segW: number; fullH: number; color: string; layers: number; staggerDelay: number; hovered: boolean; dimmed: boolean; renderPattern?: (id: string, color: string) => ReactNode; straight: boolean; gradientStops?: FunnelGradientStop[];
}) {
  const patternId = `funnel-h-pattern-${index}`;
  const gradientId = `funnel-h-grad-${index}`;
  const growProgress = useSpring(0, springConfig);
  const entranceScaleX = useTransform(growProgress, [0, 1], [0, 1]);
  const entranceScaleY = useTransform(growProgress, [0, 1], [0, 1]);
  const dimOpacity = useSpring(1, hoverSpring);

  useEffect(() => { dimOpacity.set(dimmed ? 0.4 : 1); }, [dimmed, dimOpacity]);
  useEffect(() => { const t = setTimeout(() => growProgress.set(1), index * staggerDelay * 1000); return () => clearTimeout(t); }, [growProgress, index, staggerDelay]);

  const rings = Array.from({ length: layers }, (_, l) => ({
    d: hSegmentPath(normStart, normEnd, segW, fullH, 1 - (l / layers) * 0.35, straight),
    opacity: 0.18 + (l / (layers - 1 || 1)) * 0.65,
  }));

  return (
    <motion.div className="mn-funnel-segment pointer-events-none relative shrink-0 overflow-visible" style={{ width: segW, height: fullH, zIndex: hovered ? 10 : 1, opacity: dimOpacity }}>
      <motion.div className="absolute inset-0 overflow-visible" style={{ scaleX: entranceScaleX, scaleY: entranceScaleY, transformOrigin: "left center" }}>
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox={`0 0 ${segW} ${fullH}`}>
          <defs>
            {gradientStops && (
              <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
                {gradientStops.map((stop) => (<stop key={`${stop.offset}-${stop.color}`} offset={typeof stop.offset === "number" ? `${stop.offset * 100}%` : stop.offset} stopColor={stop.color} />))}
              </linearGradient>
            )}
            {renderPattern?.(patternId, color)}
          </defs>
          {rings.map((r, i) => {
            const isInnermost = i === rings.length - 1;
            let ringFill: string | undefined;
            if (isInnermost && renderPattern) ringFill = `url(#${patternId})`;
            else if (isInnermost && gradientStops) ringFill = `url(#${gradientId})`;
            return <HRing color={color} d={r.d} fill={ringFill} hovered={hovered} key={`h-ring-${r.opacity.toFixed(2)}`} opacity={r.opacity} ringIndex={i} totalRings={layers} />;
          })}
        </svg>
      </motion.div>
    </motion.div>
  );
}

// ─── Label Overlay ───────────────────────────────────────────────────────────

function SegmentLabel({ stage, pct, showValues, showPercentage, showLabels, formatPercentage, formatValue, index, staggerDelay }: {
  stage: FunnelStage; pct: number; showValues: boolean; showPercentage: boolean; showLabels: boolean; formatPercentage: (p: number) => string; formatValue: (v: number) => string; index: number; staggerDelay: number;
}) {
  const display = stage.displayValue ?? formatValue(stage.value);
  return (
    <motion.div className="absolute inset-0 flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * staggerDelay + 0.25, duration: 0.35, ease: "easeOut" }}>
      {showValues && <div className="flex h-[16%] items-end justify-center pb-1"><span className="whitespace-nowrap font-semibold text-foreground text-sm">{display}</span></div>}
      {showPercentage && <div className="flex flex-1 items-center justify-center"><span className="rounded-full bg-foreground px-3 py-1 font-bold text-background text-xs shadow-sm">{formatPercentage(pct)}</span></div>}
      {showLabels && <div className="flex h-[16%] items-start justify-center pt-1"><span className="whitespace-nowrap font-medium text-muted-foreground text-xs">{stage.label}</span></div>}
    </motion.div>
  );
}

// ─── FunnelChart ─────────────────────────────────────────────────────────────

export function FunnelChart({ data, color = "hsl(var(--chart-1))", layers = 3, className, style, showPercentage = true, showValues = true, showLabels = true, hoveredIndex: hoveredIndexProp, onHoverChange, formatPercentage = fmtPct, formatValue = fmtVal, staggerDelay = 0.12, gap = 4, renderPattern, edges = "curved" }: FunnelChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [sz, setSz] = useState({ w: 0, h: 0 });
  const [internalHoveredIndex, setInternalHoveredIndex] = useState<number | null>(null);

  const isControlled = hoveredIndexProp !== undefined;
  const hoveredIndex = isControlled ? hoveredIndexProp : internalHoveredIndex;
  const setHoveredIndex = useCallback((index: number | null) => {
    if (isControlled) onHoverChange?.(index);
    else setInternalHoveredIndex(index);
  }, [isControlled, onHoverChange]);

  const measure = useCallback(() => {
    if (!ref.current) return;
    const { width: w, height: h } = ref.current.getBoundingClientRect();
    if (w > 0 && h > 0) setSz({ w, h });
  }, []);

  useEffect(() => { measure(); const ro = new ResizeObserver(measure); if (ref.current) ro.observe(ref.current); return () => ro.disconnect(); }, [measure]);

  if (!data.length) return null;
  const max = data[0]!.value;
  const n = data.length;
  const norms = data.map((d) => d.value / max);
  const { w: W, h: H } = sz;
  const totalGap = gap * (n - 1);
  const segW = (W - totalGap) / n;

  return (
    <div className={cn("relative w-full select-none overflow-visible", className)} ref={ref} style={{ aspectRatio: "2.2 / 1", ...style }}>
      {W > 0 && H > 0 && (
        <>
          <div className="absolute inset-0 flex flex-row overflow-visible" style={{ gap }}>
            {data.map((stage, i) => {
              const firstStop = stage.gradient?.[0];
              const segColor = firstStop ? firstStop.color : (stage.color ?? color);
              return (
                <HSegment key={stage.label} index={i} normStart={norms[i] ?? 0} normEnd={norms[Math.min(i + 1, n - 1)] ?? 0} segW={segW} fullH={H} color={segColor} layers={layers} staggerDelay={staggerDelay} hovered={hoveredIndex === i} dimmed={hoveredIndex !== null && hoveredIndex !== i} renderPattern={renderPattern} straight={edges === "straight"} gradientStops={stage.gradient} />
              );
            })}
          </div>
          {data.map((stage, i) => {
            const pct = (stage.value / max) * 100;
            const isDimmed = hoveredIndex !== null && hoveredIndex !== i;
            return (
              <motion.div key={`lbl-${stage.label}`} className="absolute cursor-pointer" onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)} style={{ left: (segW + gap) * i, width: segW, top: 0, height: H, zIndex: 20 }} animate={{ opacity: isDimmed ? 0.4 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}>
                <SegmentLabel stage={stage} pct={pct} showValues={showValues} showPercentage={showPercentage} showLabels={showLabels} formatPercentage={formatPercentage} formatValue={formatValue} index={i} staggerDelay={staggerDelay} />
              </motion.div>
            );
          })}
        </>
      )}
    </div>
  );
}

FunnelChart.displayName = "FunnelChart";
export default FunnelChart;
