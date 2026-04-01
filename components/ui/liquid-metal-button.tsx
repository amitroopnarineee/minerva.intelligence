// components/ui/liquid-metal-button.tsx
"use client"

import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

interface LiquidMetalButtonProps {
  label?: string;
  onClick?: () => void;
}

export function LiquidMetalButton({
  label = "Enter",
  onClick,
}: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const shaderRef = useRef<HTMLDivElement>(null);
  const shaderMount = useRef<any>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);

  const W = 142, H = 46, IW = 138, IH = 42;

  useEffect(() => {
    const styleId = "shader-canvas-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .shader-container canvas {
          width: 100% !important; height: 100% !important; display: block !important;
          position: absolute !important; top: 0 !important; left: 0 !important; border-radius: 100px !important;
        }
        @keyframes ripple-anim { 0% { transform: translate(-50%,-50%) scale(0); opacity: 0.6; } 100% { transform: translate(-50%,-50%) scale(4); opacity: 0; } }
      `;
      document.head.appendChild(style);
    }
    const loadShader = async () => {
      try {
        if (shaderRef.current) {
          if (shaderMount.current?.destroy) shaderMount.current.destroy();
          shaderMount.current = new ShaderMount(shaderRef.current, liquidMetalFragmentShader, {
            u_repetition: 4, u_softness: 0.5, u_shiftRed: 0.3, u_shiftBlue: 0.3,
            u_distortion: 0, u_contour: 0, u_angle: 45, u_scale: 8, u_shape: 1, u_offsetX: 0.1, u_offsetY: -0.1,
          }, undefined, 0.6);
        }
      } catch (e) { console.error("Shader load failed:", e); }
    };
    loadShader();
    return () => { if (shaderMount.current?.destroy) { shaderMount.current.destroy(); shaderMount.current = null; } };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    shaderMount.current?.setSpeed?.(2.4);
    setTimeout(() => { shaderMount.current?.setSpeed?.(isHovered ? 1 : 0.6); }, 300);
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const ripple = { x: e.clientX - rect.left, y: e.clientY - rect.top, id: rippleId.current++ };
      setRipples(prev => [...prev, ripple]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== ripple.id)), 600);
    }
    onClick?.();
  };

  return (
    <div className="relative inline-block">
      <div style={{ perspective: "1000px", perspectiveOrigin: "50% 50%" }}>
        <div style={{ position: "relative", width: W, height: H, transformStyle: "preserve-3d", transition: "all 0.8s cubic-bezier(0.34,1.56,0.64,1)" }}>
          {/* Label layer */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transform: "translateZ(20px)", zIndex: 30, pointerEvents: "none" }}>
            <span style={{ fontSize: 14, color: "#666", fontWeight: 400, textShadow: "0px 1px 2px rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>{label}</span>
          </div>
          {/* Inner dark layer */}
          <div style={{ position: "absolute", inset: 0, transform: `translateZ(10px) ${isPressed ? "translateY(1px) scale(0.98)" : ""}`, zIndex: 20, transition: "all 0.8s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.15s ease" }}>
            <div style={{ width: IW, height: IH, margin: 2, borderRadius: 100, background: "linear-gradient(180deg,#202020,#000)", boxShadow: isPressed ? "inset 0 2px 4px rgba(0,0,0,0.4)" : "none", transition: "box-shadow 0.15s ease" }} />
          </div>
          {/* Shader layer */}
          <div style={{ position: "absolute", inset: 0, transform: `translateZ(0) ${isPressed ? "translateY(1px) scale(0.98)" : ""}`, zIndex: 10, transition: "all 0.8s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.15s ease" }}>
            <div style={{ width: W, height: H, borderRadius: 100, boxShadow: isPressed ? "0 0 0 1px rgba(0,0,0,0.5)" : isHovered ? "0 0 0 1px rgba(0,0,0,0.4), 0 12px 6px rgba(0,0,0,0.05), 0 8px 5px rgba(0,0,0,0.1), 0 4px 4px rgba(0,0,0,0.15)" : "0 0 0 1px rgba(0,0,0,0.3), 0 36px 14px rgba(0,0,0,0.02), 0 20px 12px rgba(0,0,0,0.08), 0 9px 9px rgba(0,0,0,0.12)", transition: "box-shadow 0.15s ease" }}>
              <div ref={shaderRef} className="shader-container" style={{ borderRadius: 100, overflow: "hidden", position: "relative", width: W, maxWidth: W, height: H }} />
            </div>
          </div>
          {/* Click target */}
          <button ref={buttonRef} onClick={handleClick}
            onMouseEnter={() => { setIsHovered(true); shaderMount.current?.setSpeed?.(1); }}
            onMouseLeave={() => { setIsHovered(false); setIsPressed(false); shaderMount.current?.setSpeed?.(0.6); }}
            onMouseDown={() => setIsPressed(true)} onMouseUp={() => setIsPressed(false)}
            style={{ position: "absolute", inset: 0, background: "transparent", border: "none", cursor: "pointer", outline: "none", zIndex: 40, transform: "translateZ(25px)", overflow: "hidden", borderRadius: 100 }}
            aria-label={label}>
            {ripples.map(r => (
              <span key={r.id} style={{ position: "absolute", left: r.x, top: r.y, width: 20, height: 20, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)", pointerEvents: "none", animation: "ripple-anim 0.6s ease-out" }} />
            ))}
          </button>
        </div>
      </div>
    </div>
  );
}
