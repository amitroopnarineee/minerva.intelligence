"use client";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  showArea?: boolean;
  showDot?: boolean;
  className?: string;
}

export function Sparkline({
  data,
  width = 80,
  height = 24,
  showArea = true,
  showDot = true,
  className = "",
}: SparklineProps) {
  if (data.length < 2) return null;

  const mn = Math.min(...data);
  const mx = Math.max(...data);
  const range = mx - mn || 1;
  const padding = 1;

  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - mn) / range) * (height - padding * 2) - padding,
  }));

  const trend = data[data.length - 1] > data[0] ? "up" : data[data.length - 1] < data[0] ? "down" : "flat";
  const strokeColor = trend === "up" ? "#38bdf8" : trend === "down" ? "#64748b" : "#475569";
  const fillColor = strokeColor;

  const polyline = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = `M0,${height} ${pts.map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")} L${width},${height} Z`;
  const last = pts[pts.length - 1];

  return (
    <svg
      className={`mn-sparkline ${className}`}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      {showArea && (
        <path d={areaPath} fill={fillColor} opacity={0.08} />
      )}
      <polyline
        points={polyline}
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.7}
      />
      {showDot && (
        <circle cx={last.x} cy={last.y} r={2} fill={strokeColor} />
      )}
    </svg>
  );
}

// Generate believable trend data (ported from ShopifyEdition)
export function mockTrend(base: number, volatility: number, direction: number, length = 7): number[] {
  const data: number[] = [];
  let v = base;
  for (let i = 0; i < length; i++) {
    v += (Math.random() - 0.5 + direction * 0.15) * volatility;
    if (v < 0) v = base * 0.1;
    data.push(Math.round(v * 100) / 100);
  }
  return data;
}
