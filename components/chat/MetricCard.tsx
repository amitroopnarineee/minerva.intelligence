"use client"

import { motion } from "framer-motion"

interface MetricCardProps {
  label: string
  value: string
  sub?: string
  color?: "emerald" | "amber" | "red" | "blue" | "white"
  delay?: number
}

const colorMap = {
  emerald: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/15 text-emerald-400",
  amber: "from-amber-500/10 to-amber-500/5 border-amber-500/15 text-amber-400",
  red: "from-red-500/10 to-red-500/5 border-red-500/15 text-red-400",
  blue: "from-blue-500/10 to-blue-500/5 border-blue-500/15 text-blue-400",
  white: "from-white/[0.06] to-white/[0.03] border-white/[0.08] text-white/80",
}

export function MetricCard({ label, value, sub, color = "white", delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className={`rounded-xl border bg-gradient-to-b px-3.5 py-2.5 ${colorMap[color]}`}
    >
      <div className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">{label}</div>
      <div className={`text-[18px] font-semibold tracking-tight ${colorMap[color].split(" ").pop()}`}>{value}</div>
      {sub && <div className="text-[10.5px] text-white/30 mt-0.5">{sub}</div>}
    </motion.div>
  )
}

export function MetricGrid({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
      className="grid grid-cols-2 gap-2 my-3"
    >
      {children}
    </motion.div>
  )
}
