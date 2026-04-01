"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { MinervaInput } from "@/components/home/MinervaInput"
import { AudienceSpectrum } from "@/components/shared/AudienceSpectrum"
import { toast } from "sonner"

export function HomeContent() {
  const [showSpectrum, setShowSpectrum] = useState(false)

  const textTertiary = "text-white/25"

  const handleSend = (message: string) => {
    window.dispatchEvent(new CustomEvent("minerva-chat-send", { detail: { message } }))
  }

  const handleModeChange = useCallback((modeId: string) => {
    if (modeId === "audiences") {
      setShowSpectrum(true)
    }
  }, [])

  const handleSpectrumSave = useCallback(() => {
    toast.success("Segment saved", {
      description: "Your audience segment has been saved and is ready to activate.",
      duration: 4000,
    })
  }, [])

  return (
    <div className="mn-home flex flex-col -mt-9 min-h-screen">
      <div className="mn-home-content relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-9">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="mn-home-center flex flex-col items-center text-center w-full max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="w-full">
            <MinervaInput onSend={handleSend} onModeChange={handleModeChange} />
          </motion.div>
        </motion.div>
      </div>
      <div className="mn-home-footer relative z-10 pb-6 pt-4">
        <p className={`text-center text-[11px] ${textTertiary}`}>© 2026 Minerva Intelligence. All rights reserved.</p>
      </div>

      {showSpectrum && (
        <AudienceSpectrum
          onClose={() => setShowSpectrum(false)}
          onSave={handleSpectrumSave}
        />
      )}
    </div>
  )
}
