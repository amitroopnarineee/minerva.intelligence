"use client"

import * as React from "react";

const digitPatterns = [
  [1, 1, 1, 1, 1, 1, 0], // 0
  [0, 1, 1, 0, 0, 0, 0], // 1
  [1, 1, 0, 1, 1, 0, 1], // 2
  [1, 1, 1, 1, 0, 0, 1], // 3
  [0, 1, 1, 0, 0, 1, 1], // 4
  [1, 0, 1, 1, 0, 1, 1], // 5
  [1, 0, 1, 1, 1, 1, 1], // 6
  [1, 1, 1, 0, 0, 0, 0], // 7
  [1, 1, 1, 1, 1, 1, 1], // 8
  [1, 1, 1, 1, 0, 1, 1], // 9
];

const segmentPaths = [
  "m 70,0 8,8 -8,8 H 18 L 10,8 18,0 Z",
  "m 72,18 8,-8 8,8 v 52 l -8,8 -8,-8 z",
  "m 72,90 8,-8 8,8 v 52 l -8,8 -8,-8 z",
  "m 70,144 8,8 -8,8 H 18 L 10,152 18,144 Z",
  "m 0,90 8,-8 8,8 v 52 l -8,8 -8,-8 z",
  "m 0,18 8,-8 8,8 V 70 L 8,78 0,70 Z",
  "m 70,72 8,8 -8,8 H 18 L 10,80 18,72 Z",
];

type SevenSegmentNumberProps = {
  value: number;
  height?: number;
  width?: number;
  onColor?: string;
  offColor?: string;
  className?: string;
};

export const SevenSegmentNumber: React.FC<SevenSegmentNumberProps> = ({
  value, height, width, onColor = "currentColor", offColor = "transparent", className,
}) => {
  const pattern = value >= 0 && value <= 9 ? digitPatterns[value] : [0, 0, 0, 0, 0, 0, 0];
  return (
    <svg width={width} height={height} viewBox="0 0 88 160" xmlns="http://www.w3.org/2000/svg" className={className}>
      {segmentPaths.map((path, index) => (
        <path key={index} d={path} fill={pattern[index] === 1 ? onColor : offColor} />
      ))}
    </svg>
  );
};

// Multi-digit display helper
export function SevenSegmentDisplay({ value, suffix, height = 48, onColor = "#38bdf8", offColor = "rgba(56,189,248,0.06)", className = "" }: {
  value: string; suffix?: string; height?: number; onColor?: string; offColor?: string; className?: string;
}) {
  const chars = value.replace(/[^0-9.]/g, "").split("");
  const digitWidth = height * (88 / 160);
  return (
    <span className={`inline-flex items-end gap-[2px] ${className}`}>
      {chars.map((c, i) =>
        c === "." ? (
          <span key={i} className="inline-block rounded-full mb-[2px]" style={{ width: height * 0.08, height: height * 0.08, background: onColor }} />
        ) : (
          <SevenSegmentNumber key={i} value={parseInt(c)} height={height} width={digitWidth} onColor={onColor} offColor={offColor} />
        )
      )}
      {suffix && <span className="text-sky-400 ml-1" style={{ fontSize: height * 0.45, lineHeight: 1 }}>{suffix}</span>}
    </span>
  );
}
