"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Users, Megaphone, Navigation, Sparkles, Check } from "lucide-react"

interface ToolStep {
  icon: typeof Sparkles
  label: string
  detail: string
  doneDelay: number // ms after appearing to show "done"
}

const iconMap: Record<string, typeof Sparkles> = {
  user: User, users: Users, megaphone: Megaphone, navigation: Navigation, sparkles: Sparkles,
}

export function ToolChain({ steps, startDelay = 200 }: { steps: { icon: string; label: string; detail: string; duration: number }[]; startDelay?: number }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [doneSet, setDoneSet] = useState<Set<number>>(new Set())

  useEffect(() => {
    let cumulative = startDelay
    const timers: NodeJS.Timeout[] = []

    steps.forEach((step, i) => {
      // Show step
      timers.push(setTimeout(() => setVisibleCount(i + 1), cumulative))
      // Mark done
      timers.push(setTimeout(() => setDoneSet(prev => new Set([...prev, i])), cumulative + step.duration))
      cumulative += step.duration + 150
    })

    return () => timers.forEach(clearTimeout)
  }, [steps, startDelay])

  return (
    <div className="mn-chat-tool-chain space-y-1.5 my-2">
      <AnimatePresence>
        {steps.slice(0, visibleCount).map((step, i) => {
          const Icon = iconMap[step.icon] || Sparkles
          const isDone = doneSet.has(i)
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`mn-chat-tool-step ${isDone ? "mn-chat-tool-step-done" : "mn-chat-tool-step-pending"} flex items-center gap-2.5 rounded-[10px] border border-white/[0.06] bg-white/[0.025] px-3 py-2`}
            >
              <div className={`mn-chat-tool-icon h-5 w-5 rounded-md flex items-center justify-center shrink-0 ${isDone ? "bg-emerald-500/10" : "bg-white/[0.04]"}`}>
                {isDone ? <Check className="h-3 w-3 text-emerald-400/70" /> : <Icon className="h-3 w-3 text-white/30" />}
              </div>
              <div className="mn-chat-tool-text flex-1 min-w-0">
                <span className="text-[11.5px] text-white/40">{step.label}</span>
                <span className="text-[11.5px] text-white/60 ml-1">{step.detail}</span>
              </div>
              {isDone ? (
                <span className="mn-chat-tool-done-badge text-[9px] text-emerald-400/50 font-medium uppercase tracking-wider">Done</span>
              ) : (
                <div className="mn-chat-tool-spinner h-3 w-3 border-2 border-white/15 border-t-white/40 rounded-full animate-spin" />
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
