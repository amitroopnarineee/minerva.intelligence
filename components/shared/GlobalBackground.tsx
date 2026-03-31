"use client"

import { useTheme } from "next-themes"
import { useEffect, useState, useRef } from "react"

export function GlobalBackground() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => setMounted(true), [])

  const isDark = !mounted || resolvedTheme === "dark"

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let w = window.innerWidth
    let h = window.innerHeight
    canvas.width = w
    canvas.height = h

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w
      canvas.height = h
    }
    window.addEventListener("resize", resize)

    // Color palette — dark blues + warm tones inspired by the Akoya image
    const darkPalette = [
      { x: 0.15, y: 0.0, r: 0.45, color: [18, 22, 42] },     // deep navy top-left
      { x: 0.7,  y: 0.05, r: 0.4, color: [35, 30, 55] },      // dark indigo top-right
      { x: 0.5,  y: 0.35, r: 0.5, color: [55, 48, 72] },      // muted purple center
      { x: 0.2,  y: 0.6, r: 0.45, color: [85, 65, 82] },      // dusty mauve
      { x: 0.8,  y: 0.55, r: 0.4, color: [100, 78, 88] },     // warm rose-gray
      { x: 0.3,  y: 0.85, r: 0.5, color: [160, 115, 95] },    // dusty salmon bottom
      { x: 0.7,  y: 0.9, r: 0.45, color: [140, 105, 85] },    // warm taupe bottom
      { x: 0.5,  y: 0.75, r: 0.35, color: [120, 90, 100] },   // muted rose
    ]

    const lightPalette = [
      { x: 0.15, y: 0.0, r: 0.45, color: [210, 215, 230] },
      { x: 0.7,  y: 0.05, r: 0.4, color: [220, 210, 225] },
      { x: 0.5,  y: 0.35, r: 0.5, color: [225, 215, 220] },
      { x: 0.2,  y: 0.6, r: 0.45, color: [230, 210, 205] },
      { x: 0.8,  y: 0.55, r: 0.4, color: [235, 215, 210] },
      { x: 0.3,  y: 0.85, r: 0.5, color: [240, 220, 210] },
      { x: 0.7,  y: 0.9, r: 0.45, color: [235, 225, 215] },
      { x: 0.5,  y: 0.75, r: 0.35, color: [230, 215, 215] },
    ]

    const palette = isDark ? darkPalette : lightPalette
    const baseColor = isDark ? [12, 14, 28] : [248, 246, 242]
    let t = 0

    function draw() {
      t += 0.002
      ctx!.fillStyle = `rgb(${baseColor[0]},${baseColor[1]},${baseColor[2]})`
      ctx!.fillRect(0, 0, w, h)

      for (const blob of palette) {
        // Gentle floating motion
        const ox = Math.sin(t * 0.7 + blob.x * 6) * 0.02
        const oy = Math.cos(t * 0.5 + blob.y * 4) * 0.015
        const cx = (blob.x + ox) * w
        const cy = (blob.y + oy) * h
        const radius = blob.r * Math.max(w, h)

        const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, radius)
        const [r, g, b] = blob.color
        grad.addColorStop(0, `rgba(${r},${g},${b},0.6)`)
        grad.addColorStop(0.4, `rgba(${r},${g},${b},0.3)`)
        grad.addColorStop(0.7, `rgba(${r},${g},${b},0.1)`)
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`)

        ctx!.fillStyle = grad
        ctx!.fillRect(0, 0, w, h)
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [isDark])

  return (
    <div className="mn-global-bg fixed inset-0 z-0 pointer-events-none">
      {/* Canvas gradient */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Progressive blur layers — makes transitions silky smooth */}
      <div className="absolute inset-0" style={{ backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)" }} />
      <div className="absolute inset-0" style={{ backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)" }} />
      <div className="absolute inset-0" style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }} />
    </div>
  )
}
