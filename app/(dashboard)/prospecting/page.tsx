"use client"

import { useState } from "react"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { PersonTable } from "@/components/shared/PersonTable"
import { persons } from "@/lib/data/persons"

export default function ProspectingPage() {
  const [tab, setTab] = useState<"segments" | "all">("segments")
  const prospecting = persons.filter((p) => p.fanStatus === "prospect" || p.lifecycleStage === "acquisition")

  return (
    <div className="mn-page flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-6xl">
        <PageTransition>
          <FadeIn className="mb-6">
            <h1 className="text-[24px] font-semibold tracking-tight">Prospects</h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">Manage prospect segments and browse all prospects.</p>
          </FadeIn>

          <FadeIn className="mb-5">
            <div className="flex items-center gap-1">
              <button onClick={() => setTab("segments")}
                className={`text-[12px] px-3 py-1.5 rounded-lg transition-all ${tab === "segments" ? "bg-white/10 text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}>
                Prospecting Segments
              </button>
              <button onClick={() => setTab("all")}
                className={`text-[12px] px-3 py-1.5 rounded-lg transition-all ${tab === "all" ? "bg-white/10 text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}>
                All Prospects
              </button>
            </div>
          </FadeIn>

          <FadeIn>
            <PersonTable persons={tab === "segments" ? prospecting : persons} />
          </FadeIn>
        </PageTransition>
      </div>
    </div>
  )
}
