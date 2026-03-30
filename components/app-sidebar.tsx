"use client"

import * as React from "react"
import {
  BarChart3,
  Search,
  FileStack,
  Telescope,
  Users,
  Plug,
  BarChart,
  Rocket,
  Home,
  Sparkles,
  Settings2,
  ChevronsUpDown,
  MoreHorizontal,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { MinervaLogo } from "@/components/shared/MinervaLogo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// ── Matches real Minerva product nav exactly ──
const workspace = [
  { title: "Command Center", url: "/", icon: Home, isActive: true, isNew: true },
  { title: "Analytics", url: "#analytics", icon: BarChart3 },
  { title: "Person Search", url: "#person-search", icon: Search },
  { title: "Bulk Enrich", url: "#bulk-enrich", icon: FileStack },
]

const audienceStudio = [
  { title: "Prospecting", url: "#prospecting", icon: Telescope },
  { title: "Owned Audience", url: "#owned-audience", icon: Users },
]

const bottom = [
  { title: "Integrations", url: "#integrations", icon: Plug },
  { title: "Usage", url: "#usage", icon: BarChart },
  { title: "Get Started", url: "#get-started", icon: Rocket, badge: 4 },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Brand — matches Minerva's logo + wordmark */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="mn-sidebar-brand" tooltip="Minerva">
              <div className="flex aspect-square size-8 items-center justify-center">
                <MinervaLogo className="size-5" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Minerva</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Workspace section */}
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            {workspace.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton isActive={item.isActive} tooltip={item.title}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                  {item.isNew && (
                    <span className="ml-auto rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
                      NEW
                    </span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Audience Studio section */}
        <SidebarGroup>
          <SidebarGroupLabel>Audience Studio</SidebarGroupLabel>
          <SidebarMenu>
            {audienceStudio.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Bottom nav — matches Minerva's Integrations/Usage/Get Started + user */}
      <SidebarFooter>
        <SidebarMenu>
          {bottom.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                <item.icon className="size-4" />
                <span>{item.title}</span>
                {item.badge && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {/* User profile — matches Minerva's bottom user row */}
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="mn-sidebar-user" tooltip="Sarah Martinez">
              <Avatar className="size-7 rounded-md">
                <AvatarFallback className="rounded-md bg-muted text-[10px] font-bold">
                  SM
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col gap-0.5 leading-none">
                <span className="truncate text-sm font-medium">Sarah Martinez</span>
                <span className="truncate text-xs text-muted-foreground">s.martinez@dolphins.com</span>
              </div>
              <MoreHorizontal className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
