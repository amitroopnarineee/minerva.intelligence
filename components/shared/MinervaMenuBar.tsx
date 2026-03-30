"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { MinervaLogo } from "@/components/shared/MinervaLogo"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { NotificationPopover } from "@/components/shared/NotificationPopover"
import { UserMenu } from "@/components/shared/UserMenu"

interface MenuItemOption {
  label?: string
  action?: string
  shortcut?: string
  type?: "item" | "separator"
  href?: string
  badge?: string
}

interface MenuConfig {
  label: string
  items: MenuItemOption[]
}

const MINERVA_MENUS: MenuConfig[] = [
  {
    label: "Workspace",
    items: [
      { label: "Home", action: "nav", href: "/home", shortcut: "⌘1" },
      { label: "Command Center", action: "nav", href: "/", shortcut: "⌘2", badge: "NEW" },
      { label: "Analytics", action: "nav", href: "/analytics", shortcut: "⌘3" },
      { label: "Person Search", action: "nav", href: "/person-search", shortcut: "⌘4" },
      { label: "Bulk Enrich", action: "nav", href: "/bulk-enrich", shortcut: "⌘5" },
    ],
  },
  {
    label: "Audiences",
    items: [
      { label: "Prospecting", action: "nav", href: "/prospecting", shortcut: "⌘6" },
      { label: "Owned Audience", action: "nav", href: "/owned-audience", shortcut: "⌘7" },
      { type: "separator" },
      { label: "Create Prospect...", action: "create-prospect" },
      { label: "Create Audience...", action: "create-audience" },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Integrations", action: "nav", href: "/integrations" },
      { label: "Usage", action: "nav", href: "/usage" },
      { type: "separator" },
      { label: "Get Started", action: "nav", href: "/get-started", badge: "4" },
    ],
  },
]

const LOGO_MENU: MenuItemOption[] = [
  { label: "About Minerva", action: "about" },
  { type: "separator" },
  { label: "Preferences...", action: "preferences", shortcut: "⌘," },
  { label: "Help Center", action: "help" },
  { type: "separator" },
  { label: "Log Out", action: "logout", shortcut: "⇧⌘Q" },
]

// ─── MenuDropdown ────────────────────────────────────────────────────────────

interface MenuDropdownProps {
  isOpen: boolean
  onClose: () => void
  items: MenuItemOption[]
  position: { x: number; y: number }
  onItemClick: (item: MenuItemOption) => void
}

function MenuDropdown({ isOpen, onClose, items, position, onItemClick }: MenuDropdownProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    if (isOpen) document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div ref={ref} className="absolute z-[60] backdrop-blur-xl animate-in fade-in slide-in-from-top-1 duration-150"
      style={{
        left: position.x, top: position.y, minWidth: 220,
        background: "hsl(var(--popover))",
        border: "1px solid hsl(var(--border))",
        borderRadius: 8,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1)",
      }}>
      <div className="py-1">
        {items.map((item, i) => {
          if (item.type === "separator") return <div key={i} className="h-px bg-border mx-2 my-1" />
          return (
            <div key={i} className="px-3 py-1.5 text-sm cursor-pointer hover:bg-accent transition-colors flex items-center justify-between"
              onClick={() => { onItemClick(item); onClose() }}>
              <span className="flex items-center gap-2">
                {item.label}
                {item.badge && <span className="rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">{item.badge}</span>}
              </span>
              {item.shortcut && <span className="text-xs text-muted-foreground ml-6">{item.shortcut}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── MinervaMenuBar ──────────────────────────────────────────────────────────

export function MinervaMenuBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [dropdownPos, setDropdownPos] = useState({ x: 0, y: 0 })
  const [currentTime, setCurrentTime] = useState("")
  const logoRef = useRef<HTMLDivElement>(null)
  const menuRefs = useRef<Record<string, HTMLSpanElement | null>>({})

  useEffect(() => {
    const update = () => {
      setCurrentTime(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }))
    }
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  const openMenu = useCallback((key: string, el: HTMLElement | null) => {
    if (activeMenu === key) { setActiveMenu(null); return }
    if (el) {
      const rect = el.getBoundingClientRect()
      const parentRect = el.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 }
      setDropdownPos({ x: rect.left - parentRect.left, y: 38 })
    }
    setActiveMenu(key)
  }, [activeMenu])

  const handleItem = useCallback((item: MenuItemOption) => {
    if (item.href) router.push(item.href)
  }, [router])

  // Find active page label for highlighting
  const activeLabel = (() => {
    for (const menu of MINERVA_MENUS) {
      for (const item of menu.items) {
        if (item.href === pathname) return menu.label
      }
    }
    return null
  })()

  return (
    <div className="relative">
      <div className="flex h-10 items-center justify-between border-b bg-background/95 backdrop-blur-sm px-4">
        {/* Left: logo + app name + menus */}
        <div className="flex items-center gap-4">
          <div ref={logoRef} onClick={() => openMenu("logo", logoRef.current)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <MinervaLogo className="h-4 w-4" />
            <span className="text-sm font-semibold">Minerva</span>
          </div>

          <div className="flex items-center gap-1">
            {MINERVA_MENUS.map((menu) => {
              const isActive = activeLabel === menu.label
              return (
                <span key={menu.label}
                  ref={(el) => { menuRefs.current[menu.label] = el }}
                  onClick={() => openMenu(menu.label, menuRefs.current[menu.label])}
                  className={`px-2.5 py-1 text-sm cursor-pointer rounded-md transition-colors select-none ${
                    isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}>
                  {menu.label}
                </span>
              )
            })}
          </div>
        </div>

        {/* Right: utilities */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <NotificationPopover />
          <span className="text-xs text-muted-foreground tabular-nums ml-1 hidden sm:inline">{currentTime}</span>
          <UserMenu />
        </div>
      </div>

      {/* Dropdowns */}
      <MenuDropdown isOpen={activeMenu === "logo"} onClose={() => setActiveMenu(null)} items={LOGO_MENU} position={dropdownPos} onItemClick={handleItem} />
      {MINERVA_MENUS.map((menu) => (
        <MenuDropdown key={menu.label} isOpen={activeMenu === menu.label} onClose={() => setActiveMenu(null)} items={menu.items} position={dropdownPos} onItemClick={handleItem} />
      ))}
    </div>
  )
}
