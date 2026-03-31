"use client"

import { useState, useEffect } from "react"

export function Typewriter({ text, speed = 20, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed("")
    setDone(false)
    let i = 0
    const words = text.split(" ")
    const interval = setInterval(() => {
      if (i < words.length) {
        setDisplayed(words.slice(0, i + 1).join(" "))
        i++
      } else {
        clearInterval(interval)
        setDone(true)
        onDone?.()
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span className={done ? "" : "after:content-['▍'] after:ml-0.5 after:text-white/30 after:animate-pulse"}>
      {displayed}
    </span>
  )
}
