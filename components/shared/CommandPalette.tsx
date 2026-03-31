"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { Home, LayoutDashboard, BarChart3, Search, FileStack, Telescope, Users, Plug, Activity, Rocket, User, Moon, Sun } from "lucide-react"
import { persons } from "@/lib/data/persons"
import { audiences } from "@/lib/data/audiences"
import { useTheme } from "next-themes"

const navItems = [
  { label: "Dashboard", href: "/", icon: Home, group: "Navigation" },
  { label: "Command Center", href: "/command-center", icon: LayoutDashboard, group: "Navigation" },
  { label: "All People", href: "/people", icon: Users, group: "Navigation" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, group: "Navigation" },
  { label: "People Directory", href: "/people", icon: Users, group: "Navigation" },
  { label: "Person Search", href: "/person-search", icon: Search, group: "Navigation" },
  { label: "Bulk Enrich", href: "/bulk-enrich", icon: FileStack, group: "Navigation" },
  { label: "Prospecting", href: "/prospecting", icon: Telescope, group: "Navigation" },
  { label: "Owned Audience", href: "/owned-audience", icon: Users, group: "Navigation" },
  { label: "Integrations", href: "/integrations", icon: Plug, group: "Navigation" },
  { label: "Usage", href: "/usage", icon: Activity, group: "Navigation" },
  { label: "Get Started", href: "/get-started", icon: Rocket, group: "Navigation" },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  const runCommand = useCallback((fn: () => void) => {
    setOpen(false)
    fn()
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, people, audiences..." className="mn-cmd-input" />
      <CommandList className="mn-cmd-list">
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {navItems.map((item) => (
            <CommandItem key={item.href} onSelect={() => runCommand(() => router.push(item.href))} className="mn-cmd-item">
              <item.icon className="mn-cmdpal-el-1 mr-2 h-4 w-4 text-muted-foreground" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="People">
          {persons.map((p) => (
            <CommandItem key={p.id} onSelect={() => runCommand(() => router.push(`/person-search/person/${p.id}`))} className="mn-cmd-item">
              <User className="mn-cmdpal-el-2 mr-2 h-4 w-4 text-muted-foreground" />
              {p.firstName} {p.lastName}
              <span className="mn-cmdpal-el-3 ml-auto text-xs text-muted-foreground">{p.city}, {p.state}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Audiences">
          {audiences.map((a) => (
            <CommandItem key={a.id} onSelect={() => runCommand(() => router.push("/prospecting"))} className="mn-cmd-item">
              <Users className="mn-cmdpal-el-4 mr-2 h-4 w-4 text-muted-foreground" />
              {a.name}
              <span className="mn-cmdpal-el-5 ml-auto text-xs text-muted-foreground">{a.estimatedSize.toLocaleString()}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))} className="mn-cmd-item">
            {resolvedTheme === "dark" ? <Sun className="mn-cmdpal-el-6 mr-2 h-4 w-4 text-muted-foreground" /> : <Moon className="mn-cmdpal-el-7 mr-2 h-4 w-4 text-muted-foreground" />}
            Toggle {resolvedTheme === "dark" ? "Light" : "Dark"} Mode
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
