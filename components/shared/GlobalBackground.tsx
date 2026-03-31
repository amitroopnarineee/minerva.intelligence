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

    const resize = () => { w = window.innerWidth; h = window.innerHeight; canvas.width = w; canvas.height = h }
    window.addEventListener("resize", resize)

    // Two gradient presets inspired by Nuevo Tokyo — smooth horizontal atmospheric bands
    // Preset A: Deep navy → steel blue → warm cream (Image 2 style)
    const presetA = [
      { stop: 0.0,  r: 5,   g: 5,   b: 12  },  // near black
      { stop: 0.15, r: 8,   g: 10,  b: 25  },  // very dark navy
      { stop: 0.30, r: 15,  g: 22,  b: 50  },  // deep navy
      { stop: 0.45, r: 30,  g: 45,  b: 82  },  // navy blue
      { stop: 0.58, r: 55,  g: 72,  b: 110 },  // steel blue
      { stop: 0.70, r: 90,  g: 105, b: 130 },  // dusty blue
      { stop: 0.82, r: 135, g: 140, b: 148 },  // silver-blue
      { stop: 0.92, r: 175, g: 170, b: 162 },  // warm silver
      { stop: 1.0,  r: 210, g: 200, b: 185 },  // warm cream
    ]

    // Preset B: Dark olive → warm golden (Image 1 style)
    const presetB = [
      { stop: 0.0,  r: 5,   g: 8,   b: 5   },  // near black-green
      { stop: 0.15, r: 10,  g: 15,  b: 8   },  // very dark olive
      { stop: 0.30, r: 22,  g: 30,  b: 18  },  // deep olive
      { stop: 0.45, r: 42,  g: 52,  b: 32  },  // dark olive-green
      { stop: 0.58, r: 68,  g: 78,  b: 48  },  // olive
      { stop: 0.70, r: 105, g: 108, b: 65  },  // olive-gold
      { stop: 0.82, r: 150, g: 145, b: 90  },  // muted gold
      { stop: 0.92, r: 190, g: 178, b: 120 },  // warm gold
      { stop: 1.0,  r: 220, g: 205, b: 155 },  // light gold-cream
    ]

    const lightPreset = [
      { stop: 0.0,  r: 245, g: 243, b: 240 },
      { stop: 0.15, r: 238, g: 235, b: 230 },
      { stop: 0.30, r: 225, g: 220, b: 215 },
      { stop: 0.45, r: 210, g: 208, b: 212 },
      { stop: 0.58, r: 200, g: 200, b: 210 },
      { stop: 0.70, r: 210, g: 210, b: 215 },
      { stop: 0.82, r: 225, g: 222, b: 218 },
      { stop: 0.92, r: 238, g: 234, b: 228 },
      { stop: 1.0,  r: 248, g: 244, b: 238 },
    ]

    let t = 0

    function lerp(a: number, b: number, mix: number) {
      return a + (b - a) * mix
    }

    function draw() {
      t += 0.0008  // very slow breathing

      if (!isDark) {
        // Light mode — simple static gradient
        const grad = ctx!.createLinearGradient(0, 0, 0, h)
        for (const s of lightPreset) {
          grad.addColorStop(s.stop, `rgb(${s.r},${s.g},${s.b})`)
        }
        ctx!.fillStyle = grad
        ctx!.fillRect(0, 0, w, h)
        animRef.current = requestAnimationFrame(draw)
        return
      }

      // Dark mode — crossfade between preset A and B
      const mix = (Math.sin(t) + 1) / 2  // 0→1→0 oscillation

      const grad = ctx!.createLinearGradient(0, 0, 0, h)
      for (let i = 0; i < presetA.length; i++) {
        const a = presetA[i]
        const b = presetB[i]
        const r = Math.round(lerp(a.r, b.r, mix))
        const g = Math.round(lerp(a.g, b.g, mix))
        const bl = Math.round(lerp(a.b, b.b, mix))
        grad.addColorStop(a.stop, `rgb(${r},${g},${bl})`)
      }
      ctx!.fillStyle = grad
      ctx!.fillRect(0, 0, w, h)

      // Subtle horizontal noise bands for texture
      for (let y = 0; y < h; y += 3) {
        const noise = (Math.random() - 0.5) * 3
        ctx!.fillStyle = `rgba(${noise > 0 ? 255 : 0},${noise > 0 ? 255 : 0},${noise > 0 ? 255 : 0},${Math.abs(noise) * 0.003})`
        ctx!.fillRect(0, y, w, 2)
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
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Single subtle blur to smooth any banding */}
      <div className="absolute inset-0" style={{ backdropFilter: "blur(1px)", WebkitBackdropFilter: "blur(1px)" }} />
    </div>
  )
}
