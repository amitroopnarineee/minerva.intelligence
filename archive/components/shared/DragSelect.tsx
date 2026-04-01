"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, X, Layers } from "lucide-react"

interface SelectedItem {
  type: string
  label: string
  data: Record<string, string>
}

interface DragSelectProps {
  onAnalyze?: (userMessage: string) => void
}

function formatForAI(items: SelectedItem[]): string {
  if (items.length === 0) return ""

  const types = [...new Set(items.map(i => i.type))]
  const parts: string[] = []

  for (const type of types) {
    const group = items.filter(i => i.type === type)
    for (const item of group) {
      const entries = Object.entries(item.data).filter(([k]) => k !== "label" && k !== "type")
      const metrics = entries.map(([k, v]) => `${k}: ${v}`).join(", ")
      parts.push(`${item.label} (${metrics})`)
    }
  }

  const summary = parts.join(" · ")
  const typeList = types.join(" and ").toLowerCase()

  return `Analyze these ${items.length} ${typeList} items I selected: ${summary}. What patterns do you see and what should I do?`
}

export function DragSelect({ onAnalyze }: DragSelectProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [dragEnd, setDragEnd] = useState<{ x: number; y: number } | null>(null)
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
  const [showSummary, setShowSummary] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  const getSelectableElements = useCallback(() => {
    return document.querySelectorAll("[data-selectable]")
  }, [])

  const getItemFromElement = useCallback((el: Element): SelectedItem => {
    const dataset = (el as HTMLElement).dataset
    const data: Record<string, string> = {}
    for (const [key, value] of Object.entries(dataset)) {
      if (key.startsWith("select") && key !== "selectable") {
        const cleanKey = key.replace("select", "").replace(/^./, c => c.toLowerCase())
        if (value) data[cleanKey] = value
      }
    }
    return {
      type: dataset.selectType || "item",
      label: dataset.selectLabel || el.textContent?.slice(0, 50) || "Unknown",
      data,
    }
  }, [])

  const rectsOverlap = useCallback((a: DOMRect, b: { left: number; top: number; right: number; bottom: number }) => {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom)
  }, [])

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!e.altKey) return
    const target = e.target as HTMLElement
    if (target.closest("button, input, textarea, a, [role=dialog]")) return
    e.preventDefault()
    setDragStart({ x: e.clientX, y: e.clientY })
    setDragEnd({ x: e.clientX, y: e.clientY })
    setIsDragging(true)
    setSelectedItems([])
    setShowSummary(false)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    setDragEnd({ x: e.clientX, y: e.clientY })
    if (dragStart) {
      const selRect = {
        left: Math.min(dragStart.x, e.clientX), top: Math.min(dragStart.y, e.clientY),
        right: Math.max(dragStart.x, e.clientX), bottom: Math.max(dragStart.y, e.clientY),
      }
      const elements = getSelectableElements()
      const items: SelectedItem[] = []
      elements.forEach(el => {
        const rect = el.getBoundingClientRect()
        const htmlEl = el as HTMLElement
        if (rectsOverlap(rect, selRect)) {
          htmlEl.style.outline = "2px solid rgba(139,123,170,0.6)"
          htmlEl.style.outlineOffset = "-2px"
          htmlEl.style.borderRadius = "4px"
          items.push(getItemFromElement(el))
        } else {
          htmlEl.style.outline = ""
          htmlEl.style.outlineOffset = ""
        }
      })
      setSelectedItems(items)
    }
  }, [isDragging, dragStart, getSelectableElements, rectsOverlap, getItemFromElement])

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    getSelectableElements().forEach(el => {
      ;(el as HTMLElement).style.outline = ""
      ;(el as HTMLElement).style.outlineOffset = ""
    })
    if (selectedItems.length > 0) setShowSummary(true)
  }, [isDragging, selectedItems, getSelectableElements])

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp])

  const dragRect = dragStart && dragEnd ? {
    left: Math.min(dragStart.x, dragEnd.x), top: Math.min(dragStart.y, dragEnd.y),
    width: Math.abs(dragEnd.x - dragStart.x), height: Math.abs(dragEnd.y - dragStart.y),
  } : null

  // Build rich chip summary
  const typeCounts = selectedItems.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <>
      {isDragging && dragRect && dragRect.width > 5 && (
        <div ref={overlayRef} className="mn-dragsel-card-1 fixed z-40 pointer-events-none border-2 border-white/30 bg-white/[0.04] backdrop-blur-sm rounded"
          style={{ left: dragRect.left, top: dragRect.top, width: dragRect.width, height: dragRect.height }} />
      )}

      <AnimatePresence>
        {showSummary && selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mn-drag-summary fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl border border-white/10 bg-[#1a1c2e]/90 backdrop-blur-xl px-4 py-3 shadow-2xl"
          >
            <div className="mn-dragsel-group-2 flex items-center gap-2">
              <Layers className="mn-dragsel-el-3 h-4 w-4 text-white/50" />
              <div className="mn-dragsel-group-4 flex items-center gap-1.5">
                {Object.entries(typeCounts).map(([type, count]) => (
                  <span key={type} className="mn-dragsel-label-5 inline-flex items-center rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/70">
                    {count} {type}{count > 1 ? "s" : ""}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                onAnalyze?.(formatForAI(selectedItems))
                setShowSummary(false)
                setSelectedItems([])
              }}
              className="mn-dragsel-label-6 flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white/90 hover:bg-white/20 transition-colors"
            >
              <Sparkles className="h-3 w-3" /> Analyze with AI
            </button>
            <button onClick={() => { setShowSummary(false); setSelectedItems([]) }}
              className="mn-dragsel-el-7 text-white/30 hover:text-white/60 transition-colors">
              <X className="mn-dragsel-el-8 h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
