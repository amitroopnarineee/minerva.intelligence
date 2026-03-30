"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { NotificationPopover } from "@/components/shared/NotificationPopover"
import { UserMenu } from "@/components/shared/UserMenu"

export function HomeHeader() {
  return (
    <header className="mn-header absolute top-0 left-0 right-0 z-20 flex h-14 items-center gap-2 px-4 bg-transparent">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="mn-header-trigger" />
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NotificationPopover />
        <UserMenu />
      </div>
    </header>
  )
}
