"use client"

import { motion } from "framer-motion"
import { MinervaLogo } from "@/components/shared/MinervaLogo"
import AnimatedGradientBackground from "@/components/shared/AnimatedGradientBackground"
import AnimatedFooter from "@/components/shared/AnimatedFooter"

export function HomeContent() {
  return (
    <div className="flex flex-1 flex-col relative">
      {/* Gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatedGradientBackground
          startingGap={125}
          Breathing={true}
          breathingRange={5}
          animationSpeed={0.02}
          topOffset={0}
          gradientColors={[
            "hsl(var(--background))",
            "#1a1a2e",
            "#16213e",
            "#0f3460",
            "#533483",
            "#e94560",
            "#0f3460",
          ]}
          gradientStops={[30, 48, 58, 68, 78, 88, 100]}
        />
      </div>

      {/* Main content — centered */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col items-center text-center max-w-lg"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <MinervaLogo className="h-16 w-16 text-white mb-8" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Good morning, Sarah.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="mt-4 text-base text-white/60 max-w-md leading-relaxed"
          >
            Minerva has analyzed 48,200 consumer signals overnight. 
            3 new opportunities are ready for activation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-3"
          >
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-none border border-white bg-white px-8 py-3 text-sm font-semibold text-black transition-all hover:bg-white/90"
            >
              Open Command Center
            </a>
            <a
              href="/person-search"
              className="inline-flex items-center justify-center rounded-none border border-white/20 px-8 py-3 text-sm font-medium text-white/70 transition-all hover:text-white hover:border-white/50"
            >
              Person Search
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <AnimatedFooter
          leftLinks={[
            { href: "#", label: "Terms & Policies" },
            { href: "#", label: "Privacy Policy" },
            { href: "#", label: "Security" },
          ]}
          rightLinks={[
            { href: "#", label: "Documentation" },
            { href: "#", label: "API Reference" },
            { href: "#", label: "Help Center" },
            { href: "#", label: "Status" },
          ]}
          copyrightText="© 2026 Minerva Intelligence. All rights reserved."
          barCount={23}
        />
      </div>
    </div>
  )
}
