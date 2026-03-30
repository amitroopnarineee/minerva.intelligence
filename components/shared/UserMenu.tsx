"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, CreditCard, HelpCircle } from "lucide-react"

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mn-header-avatar focus:outline-none">
        <Avatar className="h-8 w-8 cursor-pointer border border-border transition-opacity hover:opacity-80">
          <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">SM</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Sarah Martinez</span>
            <span className="text-xs text-muted-foreground">s.martinez@dolphins.com</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2"><User className="h-4 w-4" /> Profile</DropdownMenuItem>
        <DropdownMenuItem className="gap-2"><Settings className="h-4 w-4" /> Settings</DropdownMenuItem>
        <DropdownMenuItem className="gap-2"><CreditCard className="h-4 w-4" /> Billing</DropdownMenuItem>
        <DropdownMenuItem className="gap-2"><HelpCircle className="h-4 w-4" /> Help & Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 text-destructive-foreground"><LogOut className="h-4 w-4" /> Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
