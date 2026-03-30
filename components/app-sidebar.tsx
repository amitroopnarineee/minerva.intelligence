"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  LayoutDashboard,
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

const workspace = [
  { title: "Home", href: "/home", icon: Home },
  { title: "Command Center", href: "/", icon: LayoutDashboard, isNew: true },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Person Search", href: "/person-search", icon: Search },
  { title: "Bulk Enrich", href: "/bulk-enrich", icon: FileStack },
]

const audienceStudio = [
  { title: "Prospecting", href: "/prospecting", icon: Telescope },
  { title: "Owned Audience", href: "/owned-audience", icon: Users },
]

const bottom = [
  { title: "Integrations", href: "/integrations", icon: Plug },
  { title: "Usage", href: "/usage", icon: BarChart },
  { title: "Get Started", href: "/get-started", icon: Rocket, badge: 4 },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
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
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            {workspace.map((item) => (
              <SidebarMenuItem key={item.title}>
                <Link href={item.href}>
                  <SidebarMenuButton isActive={pathname === item.href} tooltip={item.title}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                    {item.isNew && (
                      <span className="ml-auto rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">NEW</span>
                    )}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Audience Studio</SidebarGroupLabel>
          <SidebarMenu>
            {audienceStudio.map((item) => (
              <SidebarMenuItem key={item.title}>
                <Link href={item.href}>
                  <SidebarMenuButton isActive={pathname === item.href} tooltip={item.title}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {bottom.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.href}>
                <SidebarMenuButton isActive={pathname === item.href} tooltip={item.title}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{item.badge}</span>
                  )}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="mn-sidebar-user" tooltip="Sarah Martinez">
              <Avatar className="size-7 rounded-md">
                <AvatarFallback className="rounded-md bg-muted text-[10px] font-bold">SM</AvatarFallback>
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
