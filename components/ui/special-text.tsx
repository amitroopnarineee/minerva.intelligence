"use client";

import { useEffect, useRef, useState } from "react";

interface SpecialTextProps {
  children: string;
  speed?: number;
  delay?: number;
  className?: string;
}

const CHARS = "·•—–~°∙";

function pick(prev?: string): string {
  let c: string;
  do { c = CHARS[Math.floor(Math.random() * CHARS.length)]; } while (c === prev);
  return c;
}

export function SpecialText({
  children,
  speed = 45,
  delay = 0,
  className = "",
}: SpecialTextProps) {
  const text = children;
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    // Total duration: fade out old text, then reveal new text
    const len = text.length;
    const fadeOutMs = len * speed * 0.6;   // scramble away
    const fadeInMs = len * speed * 1.2;    // reveal new text char by char
    const totalMs = fadeOutMs + fadeInMs;
    let started = false;

    const delayTimeout = setTimeout(() => {
      started = true;
      startRef.current = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startRef.current;
        const progress = Math.min(elapsed / totalMs, 1);

        if (progress < fadeOutMs / totalMs) {
          // Phase 1: scramble — progressively replace chars with random symbols
          const phase1Progress = elapsed / fadeOutMs;
          const scrambledCount = Math.floor(phase1Progress * len);
          const chars: string[] = [];
          for (let i = 0; i < len; i++) {
            if (i < scrambledCount) {
              // Random chance to show space vs symbol for organic feel
              chars.push(Math.random() > 0.3 ? pick() : " ");
            } else {
              chars.push(" ");
            }
          }
          setDisplay(chars.join(""));
        } else {
          // Phase 2: reveal — real characters appear left to right with trailing scramble
          const phase2Progress = (elapsed - fadeOutMs) / fadeInMs;
          const revealedCount = Math.floor(phase2Progress * len);
          const chars: string[] = [];
          for (let i = 0; i < len; i++) {
            if (i < revealedCount) {
              chars.push(text[i]);
            } else if (i < revealedCount + 3) {
              // Small scramble window ahead of reveal cursor
              chars.push(Math.random() > 0.5 ? pick() : " ");
            } else {
              chars.push(" ");
            }
          }
          setDisplay(chars.join(""));
        }

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          setDisplay(text);
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      clearTimeout(delayTimeout);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [text, speed, delay]);

  return <span className={className}>{display}</span>;
}
