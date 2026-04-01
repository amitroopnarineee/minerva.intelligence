"use client";

import { useEffect, useRef, useState } from "react";

interface SpecialTextProps {
  children: string;
  speed?: number;
  delay?: number;
  className?: string;
}

const RANDOM_CHARS = "_!X$0-+*#";

function getRandomChar(prevChar?: string): string {
  let char: string;
  do {
    char = RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
  } while (char === prevChar);
  return char;
}

export function SpecialText({
  children,
  speed = 20,
  delay = 0,
  className = "",
}: SpecialTextProps) {
  const text = children;
  const [displayText, setDisplayText] = useState<string>(" ".repeat(text.length));
  const [currentPhase, setCurrentPhase] = useState<"phase1" | "phase2">("phase1");
  const [animationStep, setAnimationStep] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset and restart when text changes
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayText(" ".repeat(text.length));
    setCurrentPhase("phase1");
    setAnimationStep(0);
    setHasStarted(false);
    const t = setTimeout(() => setHasStarted(true), delay * 1000);
    return () => { clearTimeout(t); if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [text, delay]);

  useEffect(() => {
    if (!hasStarted) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setAnimationStep(prev => {
        const step = prev;
        if (currentPhase === "phase1") {
          const maxSteps = text.length * 2;
          const currentLength = Math.min(step + 1, text.length);
          const chars: string[] = [];
          for (let i = 0; i < currentLength; i++) chars.push(getRandomChar(i > 0 ? chars[i-1] : undefined));
          for (let i = currentLength; i < text.length; i++) chars.push("\u00A0");
          setDisplayText(chars.join(""));
          if (step >= maxSteps - 1) { setCurrentPhase("phase2"); return 0; }
        } else {
          const revealedCount = Math.floor(step / 2);
          const chars: string[] = [];
          for (let i = 0; i < revealedCount && i < text.length; i++) chars.push(text[i]);
          if (revealedCount < text.length) chars.push(step % 2 === 0 ? "_" : getRandomChar());
          for (let i = chars.length; i < text.length; i++) chars.push(getRandomChar());
          setDisplayText(chars.join(""));
          if (step >= text.length * 2 - 1) { setDisplayText(text); if (intervalRef.current) clearInterval(intervalRef.current); return step; }
        }
        return prev + 1;
      });
    }, speed);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [currentPhase, hasStarted, text, speed]);

  return (
    <span className={className}>
      {displayText}
    </span>
  );
}
