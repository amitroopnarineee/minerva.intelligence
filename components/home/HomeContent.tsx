"use client"

import { motion } from "framer-motion"
import { MinervaLogo } from "@/components/shared/MinervaLogo"
import AnimatedFooter from "@/components/shared/AnimatedFooter"

export function HomeContent() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Main welcome area — centered vertically */}
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center max-w-lg"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <MinervaLogo className="h-12 w-12 text-foreground mb-6" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Good morning, Sarah.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-3 text-base text-muted-foreground max-w-md"
          >
            Your consumer intelligence platform is ready. Navigate to the Command Center for today's overview, or search for a person to get started.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-3"
          >
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-none border border-primary bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Open Command Center
            </a>
            <a
              href="/person-search"
              className="inline-flex items-center justify-center rounded-none border border-border px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:border-foreground"
            >
              Person Search
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated footer */}
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
  )
}
