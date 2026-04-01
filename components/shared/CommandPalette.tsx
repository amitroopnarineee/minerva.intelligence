"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { Home, BarChart3, Search, Telescope, Users, User } from "lucide-react"
import { persons } from "@/lib/data/persons"
import { audiences } from "@/lib/data/audiences"

const navItems = [
  { label: "Home", href: "/", icon: Home, group: "Navigation" },
  { label: "Insights", href: "/command-center", icon: Search, group: "Navigation" },
  { label: "All People", href: "/people", icon: Users, group: "Navigation" },
  { label: "Prospecting", href: "/prospecting", icon: Telescope, group: "Navigation" },
  { label: "Owned Audience", href: "/owned-audience", icon: Users, group: "Navigation" },
  { label: "Audience Segments", href: "/person-search", icon: BarChart3, group: "Navigation" },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

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
            <CommandItem key={a.id} onSelect={() => runCommand(() => router.push("/person-search/dolphins"))} className="mn-cmd-item">
              <Users className="mn-cmdpal-el-4 mr-2 h-4 w-4 text-muted-foreground" />
              {a.name}
              <span className="mn-cmdpal-el-5 ml-auto text-xs text-muted-foreground">{a.estimatedSize.toLocaleString()}</span>
            </CommandItem>
          ))}
        </CommandGroup>

      </CommandList>
    </CommandDialog>
  )
}
