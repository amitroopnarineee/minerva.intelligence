"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { NotificationPopover } from "@/components/shared/NotificationPopover"
import { UserMenu } from "@/components/shared/UserMenu"
import { MinervaLogo } from "@/components/shared/MinervaLogo"

export function HomeHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex h-14 items-center justify-between px-5 bg-transparent">
      <Link href="/home" className="flex items-center gap-2 text-current opacity-60 hover:opacity-100 transition-opacity">
        <MinervaLogo className="h-5 w-5" />
        <span className="text-sm font-semibold hidden sm:inline">Minerva</span>
      </Link>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NotificationPopover />
        <UserMenu />
      </div>
    </header>
  )
}
