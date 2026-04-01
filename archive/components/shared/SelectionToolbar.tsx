"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Copy, MessageSquare, Search, Check } from "lucide-react"

interface SelectionToolbarProps {
  onAskAI?: (text: string) => void
}

export function SelectionToolbar({ onAskAI }: SelectionToolbarProps) {
  const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null)
  const [copied, setCopied] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const handleMouseUp = useCallback(() => {
    // Small delay to let selection finalize
    setTimeout(() => {
      const sel = window.getSelection()
      const text = sel?.toString().trim()
      if (text && text.length > 3) {
        const range = sel?.getRangeAt(0)
        if (range) {
          const rect = range.getBoundingClientRect()
          setSelection({
            text,
            x: rect.left + rect.width / 2,
            y: rect.top - 8,
          })
        }
      }
    }, 10)
  }, [])

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (toolbarRef.current?.contains(e.target as Node)) return
    setSelection(null)
    setCopied(false)
  }, [])

  const handleKeyDown = useCallback(() => {
    setSelection(null)
    setCopied(false)
  }, [])

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleMouseUp, handleMouseDown, handleKeyDown])

  const handleAskAI = () => {
    if (selection?.text) {
      onAskAI?.(selection.text)
      setSelection(null)
    }
  }

  const handleCopy = () => {
    if (selection?.text) {
      navigator.clipboard.writeText(selection.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const handleAnalyze = () => {
    if (selection?.text) {
      onAskAI?.(`Analyze this data and provide insights:\n\n"${selection.text}"`)
      setSelection(null)
    }
  }

  return (
    <AnimatePresence>
      {selection && (
        <motion.div
          ref={toolbarRef}
          initial={{ opacity: 0, y: 4, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="mn-selection-toolbar fixed z-50 flex items-center gap-0.5 rounded-lg border border-white/10 bg-[#1a1c2e]/90 backdrop-blur-xl px-1 py-1 shadow-2xl"
          style={{
            left: Math.max(8, Math.min(selection.x - 100, window.innerWidth - 220)),
            top: Math.max(8, selection.y - 40),
          }}
        >
          <button onClick={handleAskAI}
            className="mn-toolbar-btn flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors">
            <Sparkles className="h-3 w-3" /> Ask AI
          </button>
          <button onClick={handleAnalyze}
            className="mn-toolbar-btn flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors">
            <Search className="h-3 w-3" /> Analyze
          </button>
          <div className="mn-seltool-el-1 h-4 w-px bg-white/10" />
          <button onClick={handleCopy}
            className="mn-toolbar-btn flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors">
            {copied ? <Check className="mn-seltool-el-2 h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
