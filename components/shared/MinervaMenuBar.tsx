"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Bell, Moon, Sun, Search, Sparkles } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, CreditCard, HelpCircle } from "lucide-react"
import { useTheme } from "next-themes"

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
  href?: string // direct link, no dropdown
}

const MINERVA_MENUS: MenuConfig[] = [
  {
    label: "Home",
    href: "/",
    items: [],
  },
  {
    label: "People",
    items: [
      { label: "People Directory", action: "nav", href: "/people", shortcut: "⌘1" },
      { label: "Person Search", action: "nav", href: "/person-search", shortcut: "⌘2" },
      { label: "Prospecting", action: "nav", href: "/prospecting", shortcut: "⌘3" },
      { label: "Owned Audience", action: "nav", href: "/owned-audience", shortcut: "⌘4" },
      { type: "separator" },
      { label: "Bulk Enrich", action: "nav", href: "/bulk-enrich", shortcut: "⌘5" },
    ],
  },
  {
    label: "Analytics",
    href: "/analytics",
    items: [],
  },
  {
    label: "Settings",
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
    <div ref={ref} className="mn-menubar-el-1 absolute z-[60] backdrop-blur-xl animate-in fade-in slide-in-from-top-1 duration-150"
      style={{
        left: position.x, top: position.y, minWidth: 220,
        background: "hsl(var(--popover))",
        border: "1px solid hsl(var(--border))",
        borderRadius: 8,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1)",
      }}>
      <div className="py-1">
        {items.map((item, i) => {
          if (item.type === "separator") return <div key={i} className="mn-menubar-el-2 h-px bg-border mx-2 my-1" />
          return (
            <div key={i} className="mn-menubar-row-3 px-3 py-1.5 text-sm cursor-pointer hover:bg-accent transition-colors flex items-center justify-between"
              onClick={() => { onItemClick(item); onClose() }}>
              <span className="mn-menubar-right flex items-center gap-2">
                {item.label}
                {item.badge && <span className="mn-menubar-el-4 rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">{item.badge}</span>}
              </span>
              {item.shortcut && <span className="mn-menubar-el-5 text-xs text-muted-foreground ml-6">{item.shortcut}</span>}
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
  const { setTheme, resolvedTheme } = useTheme()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [dropdownPos, setDropdownPos] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const menuRefs = useRef<Record<string, HTMLSpanElement | null>>({})

  useEffect(() => setMounted(true), [])

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
      setDropdownPos({ x: rect.left - parentRect.left, y: 36 })
    }
    setActiveMenu(key)
  }, [activeMenu])

  const handleItem = useCallback((item: MenuItemOption) => {
    if (item.href) router.push(item.href)
  }, [router])

  const activeLabel = (() => {
    for (const menu of MINERVA_MENUS) {
      for (const item of menu.items) {
        if (item.href === pathname) return menu.label
      }
    }
    return null
  })()

  return (
    <div className="mn-menubar relative z-30">
      <div className="mn-menubar-inner flex h-9 items-center justify-between px-4">
        {/* Left: logo + menus */}
        <div className="mn-menubar-left flex items-center gap-3">
          {/* Logo — navigates to /home */}
          <button onClick={() => router.push("/")} className="mn-menubar-group-6 flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <div className="mn-logo-mark h-[10px] w-[10px] rounded-[2px] bg-current" />
            <span className="mn-menubar-label-7 text-[13px] font-semibold leading-none">Minerva</span>
          </button>

          <div className="mn-menubar-el-8 flex items-center">
            {MINERVA_MENUS.map((menu) => {
              const isActive = activeLabel === menu.label
              return (
                <span key={menu.label}
                  ref={(el) => { menuRefs.current[menu.label] = el }}
                  onClick={() => menu.href ? router.push(menu.href) : openMenu(menu.label, menuRefs.current[menu.label])}
                  className={`px-2 py-0.5 text-[13px] leading-none cursor-pointer rounded transition-colors select-none ${
                    (isActive || (menu.href && pathname === menu.href)) ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                  }`}>
                  {menu.label}
                </span>
              )
            })}
          </div>
        </div>

        {/* Center: ⌘K search */}
        <button onClick={() => { const e = new KeyboardEvent("keydown", { key: "k", metaKey: true }); document.dispatchEvent(e) }}
          className="mn-cmd-trigger flex items-center gap-1.5 rounded-md border border-border/50 px-2 py-0.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-border transition-colors">
          <Search className="h-3 w-3" />
          <span className="mn-menubar-el-9 hidden sm:inline">Search</span>
          <kbd className="mn-menubar-label-10 ml-1 rounded bg-muted/50 px-1 py-px text-[9px] font-medium">⌘K</kbd>
        </button>

        {/* Right: utilities — all aligned to text height */}
        <div className="mn-menubar-right flex items-center gap-2">
          <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="mn-menubar-el-11 text-muted-foreground hover:text-foreground transition-colors">
            {mounted ? (resolvedTheme === "dark" ? <Moon className="mn-menubar-el-12 h-[14px] w-[14px]" /> : <Sun className="mn-menubar-el-13 h-[14px] w-[14px]" />) : <Sun className="mn-menubar-el-14 h-[14px] w-[14px] opacity-0" />}
          </button>
          <button onClick={() => { const e = new CustomEvent("minerva-chat-toggle"); window.dispatchEvent(e) }}
            className="mn-chat-trigger text-muted-foreground hover:text-foreground transition-colors" title="Open AI Chat">
            <Sparkles className="mn-menubar-el-15 h-[14px] w-[14px]" />
          </button>
          <button className="mn-menubar-el-16 text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="mn-menubar-el-17 h-[14px] w-[14px]" />
          </button>
          <span className="mn-menubar-el-18 text-[13px] text-muted-foreground tabular-nums leading-none hidden sm:inline">{currentTime}</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="mn-menubar-el-19 focus:outline-none">
              <Avatar className="mn-menubar-divider h-5 w-5 cursor-pointer border border-border">
                <AvatarFallback className="mn-menubar-el-21 bg-primary/10 text-[8px] font-bold text-primary leading-none">SM</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel><div className="mn-menubar-el-22 flex flex-col"><span className="mn-menubar-el-23 text-sm font-medium">Sarah Martinez</span><span className="mn-menubar-el-24 text-xs text-muted-foreground">s.martinez@dolphins.com</span></div></DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2"><User className="h-4 w-4" /> Profile</DropdownMenuItem>
              <DropdownMenuItem className="gap-2"><Settings className="h-4 w-4" /> Settings</DropdownMenuItem>
              <DropdownMenuItem className="gap-2"><CreditCard className="h-4 w-4" /> Billing</DropdownMenuItem>
              <DropdownMenuItem className="gap-2"><HelpCircle className="h-4 w-4" /> Help & Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="mn-menubar-el-25 gap-2 text-destructive-foreground"><LogOut className="h-4 w-4" /> Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Dropdowns */}
      {MINERVA_MENUS.map((menu) => (
        <MenuDropdown key={menu.label} isOpen={activeMenu === menu.label} onClose={() => setActiveMenu(null)} items={menu.items} position={dropdownPos} onItemClick={handleItem} />
      ))}
    </div>
  )
}
