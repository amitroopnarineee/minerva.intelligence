"use client";

import { localPoint } from "@visx/event";
import { curveMonotoneX } from "@visx/curve";
import { GridRows } from "@visx/grid";
import { ParentSize } from "@visx/responsive";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AreaClosed, LinePath } from "@visx/shape";
import { bisector } from "d3-array";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useSpring,
} from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

// ─── Chart CSS Vars ──────────────────────────────────────────────────────────

export const chartCssVars = {
  background: "var(--chart-background, hsl(var(--background)))",
  linePrimary: "var(--chart-line-primary, hsl(var(--chart-2)))",
  lineSecondary: "var(--chart-line-secondary, hsl(var(--chart-5)))",
  crosshair: "var(--chart-crosshair, hsl(var(--muted-foreground)))",
  grid: "var(--chart-grid, hsl(var(--border)))",
};

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Margin { top: number; right: number; bottom: number; left: number }
export interface TooltipData { point: Record<string, unknown>; index: number; x: number; yPositions: Record<string, number> }
export interface LineConfig { dataKey: string; stroke: string; strokeWidth: number }

export interface ChartContextValue {
  data: Record<string, unknown>[];
  xScale: ReturnType<typeof scaleTime<number>>;
  yScale: ReturnType<typeof scaleLinear<number>>;
  width: number; height: number; innerWidth: number; innerHeight: number;
  margin: Margin; columnWidth: number;
  tooltipData: TooltipData | null;
  setTooltipData: Dispatch<SetStateAction<TooltipData | null>>;
  containerRef: RefObject<HTMLDivElement | null>;
  lines: LineConfig[]; isLoaded: boolean; animationDuration: number;
  xAccessor: (d: Record<string, unknown>) => Date;
  dateLabels: string[];
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ChartContext = createContext<ChartContextValue | null>(null);
function useChart(): ChartContextValue {
  const ctx = useContext(ChartContext);
  if (!ctx) throw new Error("useChart must be used within AreaChart");
  return ctx;
}

// ─── Tooltip Indicator ───────────────────────────────────────────────────────

function TooltipIndicator({ x, height, visible }: { x: number; height: number; visible: boolean }) {
  const animatedX = useSpring(x, { stiffness: 300, damping: 30 });
  useEffect(() => { animatedX.set(x) }, [x, animatedX]);
  if (!visible) return null;
  return (
    <motion.line
      x1={animatedX} x2={animatedX} y1={0} y2={height}
      stroke={chartCssVars.crosshair} strokeWidth={1} strokeOpacity={0.5}
    />
  );
}

// ─── Tooltip Dot ─────────────────────────────────────────────────────────────

function TooltipDot({ x, y, visible, color }: { x: number; y: number; visible: boolean; color: string }) {
  const ax = useSpring(x, { stiffness: 300, damping: 30 });
  const ay = useSpring(y, { stiffness: 300, damping: 30 });
  useEffect(() => { ax.set(x); ay.set(y) }, [x, y, ax, ay]);
  if (!visible) return null;
  return <motion.circle cx={ax} cy={ay} r={5} fill={color} stroke={chartCssVars.background} strokeWidth={2} />;
}

// ─── Tooltip Box ─────────────────────────────────────────────────────────────

function TooltipBox({ x, y, visible, containerRef, containerWidth, children }: {
  x: number; y: number; visible: boolean; containerRef: RefObject<HTMLDivElement | null>;
  containerWidth: number; children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true) }, []);
  const shouldFlip = x + 180 + 16 > containerWidth;
  const targetX = shouldFlip ? x - 16 - 180 : x + 16;
  const targetY = Math.max(16, y - 40);
  const left = useSpring(targetX, { stiffness: 100, damping: 20 });
  const top = useSpring(targetY, { stiffness: 100, damping: 20 });
  useEffect(() => { left.set(targetX) }, [targetX, left]);
  useEffect(() => { top.set(targetY) }, [targetY, top]);

  const container = containerRef.current;
  if (!mounted || !container || !visible) return null;

  return createPortal(
    <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}
      className="pointer-events-none absolute z-50" style={{ left, top }} transition={{ duration: 0.1 }}>
      <div className="min-w-[140px] overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-lg backdrop-blur-md">
        {children}
      </div>
    </motion.div>,
    container
  );
}

// ─── ChartTooltip ────────────────────────────────────────────────────────────

export interface TooltipRow { color: string; label: string; value: string | number }

export interface ChartTooltipProps {
  showCrosshair?: boolean; showDots?: boolean;
  rows?: (point: Record<string, unknown>) => TooltipRow[];
}

export function ChartTooltip({ showCrosshair = true, showDots = true, rows: rowsRenderer }: ChartTooltipProps) {
  const { tooltipData, width, height, innerHeight, margin, lines, containerRef } = useChart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true) }, []);

  const visible = tooltipData !== null;
  const x = tooltipData?.x ?? 0;
  const xM = x + margin.left;
  const firstKey = lines[0]?.dataKey;
  const firstY = firstKey ? (tooltipData?.yPositions[firstKey] ?? 0) : 0;

  const tooltipRows = useMemo(() => {
    if (!tooltipData) return [];
    if (rowsRenderer) return rowsRenderer(tooltipData.point);
    return lines.map(l => ({ color: l.stroke, label: l.dataKey, value: (tooltipData.point[l.dataKey] as number) ?? 0 }));
  }, [tooltipData, lines, rowsRenderer]);

  const container = containerRef.current;
  if (!mounted || !container) return null;

  return createPortal(
    <>
      {showCrosshair && (
        <svg className="pointer-events-none absolute inset-0" width="100%" height="100%">
          <g transform={`translate(${margin.left},${margin.top})`}>
            <TooltipIndicator x={x} height={innerHeight} visible={visible} />
          </g>
        </svg>
      )}
      {showDots && visible && (
        <svg className="pointer-events-none absolute inset-0" width="100%" height="100%">
          <g transform={`translate(${margin.left},${margin.top})`}>
            {lines.map(l => (
              <TooltipDot key={l.dataKey} color={l.stroke} visible={visible}
                x={x} y={tooltipData?.yPositions[l.dataKey] ?? 0} />
            ))}
          </g>
        </svg>
      )}
      <TooltipBox x={xM} y={firstY + margin.top} visible={visible}
        containerRef={containerRef} containerWidth={width}>
        <div className="px-3 py-2.5 space-y-1.5">
          {tooltipRows.map(r => (
            <div key={r.label} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="text-sm text-muted-foreground">{r.label}</span>
              </div>
              <span className="font-medium text-sm tabular-nums">{typeof r.value === "number" ? r.value.toLocaleString() : r.value}</span>
            </div>
          ))}
        </div>
      </TooltipBox>
    </>,
    container
  );
}

// ─── Grid ────────────────────────────────────────────────────────────────────

export interface GridProps {
  horizontal?: boolean; numTicksRows?: number;
  stroke?: string; strokeDasharray?: string; strokeOpacity?: number;
}

export function Grid({ horizontal = true, numTicksRows = 5, stroke = chartCssVars.grid, strokeDasharray = "4,4", strokeOpacity = 0.5 }: GridProps) {
  const { yScale, innerWidth } = useChart();
  if (!horizontal) return null;
  return (
    <g>
      <GridRows scale={yScale} width={innerWidth} numTicks={numTicksRows}
        stroke={stroke} strokeDasharray={strokeDasharray} strokeOpacity={strokeOpacity} strokeWidth={1} />
    </g>
  );
}

// ─── XAxis ───────────────────────────────────────────────────────────────────

export function XAxis({ numTicks = 5 }: { numTicks?: number }) {
  const { xScale, margin, containerRef } = useChart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true) }, []);

  const labels = useMemo(() => {
    const [start, end] = xScale.domain();
    if (!start || !end) return [];
    const s = start.getTime(), e = end.getTime(), range = e - s;
    return Array.from({ length: numTicks }, (_, i) => {
      const d = new Date(s + (i / (numTicks - 1)) * range);
      return { x: (xScale(d) ?? 0) + margin.left, label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) };
    });
  }, [xScale, margin.left, numTicks]);

  const container = containerRef.current;
  if (!mounted || !container) return null;
  return createPortal(
    <div className="pointer-events-none absolute inset-0">
      {labels.map(item => (
        <div key={item.label} className="absolute" style={{ left: item.x, bottom: 12, width: 0, display: "flex", justifyContent: "center" }}>
          <span className="whitespace-nowrap text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>,
    container
  );
}

// ─── Area ────────────────────────────────────────────────────────────────────

// biome-ignore lint/suspicious/noExplicitAny: d3 curve
type CurveFactory = any;

export interface AreaProps {
  dataKey: string; fill?: string; fillOpacity?: number;
  stroke?: string; strokeWidth?: number; curve?: CurveFactory;
  fadeEdges?: boolean; gradientToOpacity?: number;
}

export function Area({
  dataKey, fill = chartCssVars.linePrimary, fillOpacity = 0.4,
  stroke, strokeWidth = 2, curve = curveMonotoneX,
  fadeEdges = false, gradientToOpacity = 0,
}: AreaProps) {
  const { data, xScale, yScale, innerHeight, innerWidth, isLoaded, animationDuration, xAccessor } = useChart();
  const uniqueId = useId();
  const gradientId = `area-grad-${dataKey}-${uniqueId}`;
  const edgeMaskId = `area-edge-${dataKey}-${uniqueId}`;
  const resolvedStroke = stroke || fill;

  const getY = useCallback((d: Record<string, unknown>) => {
    const v = d[dataKey]; return typeof v === "number" ? (yScale(v) ?? 0) : 0;
  }, [dataKey, yScale]);
  const easing = "cubic-bezier(0.85, 0, 0.15, 1)";

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: fill, stopOpacity: fillOpacity }} />
          <stop offset="100%" style={{ stopColor: fill, stopOpacity: gradientToOpacity }} />
        </linearGradient>
        {fadeEdges && (
          <>
            <linearGradient id={`${edgeMaskId}-g`} x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" style={{ stopColor: "white", stopOpacity: 0 }} />
              <stop offset="20%" style={{ stopColor: "white", stopOpacity: 1 }} />
              <stop offset="80%" style={{ stopColor: "white", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "white", stopOpacity: 0 }} />
            </linearGradient>
            <mask id={edgeMaskId}>
              <rect fill={`url(#${edgeMaskId}-g)`} width={innerWidth} height={innerHeight} />
            </mask>
          </>
        )}
      </defs>
      <g>
        <g mask={fadeEdges ? `url(#${edgeMaskId})` : undefined}>
          <AreaClosed curve={curve} data={data} fill={`url(#${gradientId})`}
            x={d => xScale(xAccessor(d)) ?? 0} y={getY} yScale={yScale} />
        </g>
        <LinePath curve={curve} data={data}
          stroke={resolvedStroke} strokeWidth={strokeWidth} strokeLinecap="round"
          x={d => xScale(xAccessor(d)) ?? 0} y={getY} />
      </g>
    </>
  );
}

// ─── AreaChart ───────────────────────────────────────────────────────────────

export interface AreaChartProps {
  data: Record<string, unknown>[]; xDataKey?: string;
  margin?: Partial<Margin>; animationDuration?: number;
  aspectRatio?: string; className?: string; children: ReactNode;
}

const DEFAULT_MARGIN: Margin = { top: 20, right: 20, bottom: 40, left: 20 };

function extractAreaConfigs(children: ReactNode): LineConfig[] {
  const configs: LineConfig[] = [];
  const arr = Array.isArray(children) ? children : [children];
  for (const child of arr) {
    if (child && typeof child === "object" && "props" in child) {
      const p = child.props as AreaProps | undefined;
      if (p?.dataKey) configs.push({ dataKey: p.dataKey, stroke: p.stroke || p.fill || chartCssVars.linePrimary, strokeWidth: p.strokeWidth || 2 });
    }
  }
  return configs;
}

function ChartInner({ width, height, data, xDataKey, margin, animationDuration, children, containerRef }: {
  width: number; height: number; data: Record<string, unknown>[]; xDataKey: string;
  margin: Margin; animationDuration: number; children: ReactNode; containerRef: RefObject<HTMLDivElement | null>;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const lines = useMemo(() => extractAreaConfigs(children), [children]);
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const xAccessor = useCallback((d: Record<string, unknown>): Date => {
    const v = d[xDataKey]; return v instanceof Date ? v : new Date(v as string | number);
  }, [xDataKey]);
  const bisectDate = useMemo(() => bisector<Record<string, unknown>, Date>(d => xAccessor(d)).left, [xAccessor]);

  const xScale = useMemo(() => {
    const dates = data.map(d => xAccessor(d));
    return scaleTime({ range: [0, innerW], domain: [Math.min(...dates.map(d => d.getTime())), Math.max(...dates.map(d => d.getTime()))] });
  }, [innerW, data, xAccessor]);

  const columnWidth = useMemo(() => data.length < 2 ? 0 : innerW / (data.length - 1), [innerW, data.length]);

  const yScale = useMemo(() => {
    let max = 0;
    for (const l of lines) for (const d of data) { const v = d[l.dataKey]; if (typeof v === "number" && v > max) max = v; }
    return scaleLinear({ range: [innerH, 0], domain: [0, (max || 100) * 1.1], nice: true });
  }, [innerH, data, lines]);

  const dateLabels = useMemo(() => data.map(d => xAccessor(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })), [data, xAccessor]);

  useEffect(() => { const t = setTimeout(() => setIsLoaded(true), animationDuration); return () => clearTimeout(t) }, [animationDuration]);

  const handleMouseMove = useCallback((event: React.MouseEvent<SVGGElement>) => {
    const pt = localPoint(event);
    if (!pt) return;
    const chartX = pt.x - margin.left;
    const x0 = xScale.invert(chartX);
    const idx = bisectDate(data, x0, 1);
    const d0 = data[idx - 1], d1 = data[idx];
    if (!d0) return;
    let d = d0, fi = idx - 1;
    if (d1 && x0.getTime() - xAccessor(d0).getTime() > xAccessor(d1).getTime() - x0.getTime()) { d = d1; fi = idx }
    const yPos: Record<string, number> = {};
    for (const l of lines) { const v = d[l.dataKey]; if (typeof v === "number") yPos[l.dataKey] = yScale(v) ?? 0 }
    setTooltipData({ point: d, index: fi, x: xScale(xAccessor(d)) ?? 0, yPositions: yPos });
  }, [xScale, yScale, data, lines, margin.left, xAccessor, bisectDate]);

  if (width < 10 || height < 10) return null;

  const ctx: ChartContextValue = {
    data, xScale, yScale, width, height, innerWidth: innerW, innerHeight: innerH,
    margin, columnWidth, tooltipData, setTooltipData, containerRef, lines,
    isLoaded, animationDuration, xAccessor, dateLabels,
  };

  return (
    <ChartContext.Provider value={ctx}>
      <svg width={width} height={height}>
        <rect fill="transparent" width={width} height={height} />
        <g transform={`translate(${margin.left},${margin.top})`}
          onMouseMove={isLoaded ? handleMouseMove : undefined}
          onMouseLeave={() => setTooltipData(null)}
          style={{ cursor: isLoaded ? "crosshair" : "default" }}>
          <rect fill="transparent" width={innerW} height={innerH} />
          {children}
        </g>
      </svg>
    </ChartContext.Provider>
  );
}

export function AreaChart({ data, xDataKey = "date", margin: mp, animationDuration = 1100, aspectRatio = "2.5 / 1", className = "", children }: AreaChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const margin = { ...DEFAULT_MARGIN, ...mp };
  return (
    <div className={cn("relative w-full", className)} ref={containerRef} style={{ aspectRatio, touchAction: "none" }}>
      <ParentSize debounceTime={10}>
        {({ width, height }) => (
          <ChartInner animationDuration={animationDuration} containerRef={containerRef}
            data={data} height={height} margin={margin} width={width} xDataKey={xDataKey}>
            {children}
          </ChartInner>
        )}
      </ParentSize>
    </div>
  );
}

export default AreaChart;
