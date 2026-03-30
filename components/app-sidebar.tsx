"use client"

import * as React from "react"
import {
  Home,
  BarChart3,
  Users,
  Search,
  Radio,
  Plug,
  Sparkles,
  Settings2,
  Target,
  TrendingUp,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Sarah Martinez",
    email: "s.martinez@dolphins.com",
    avatar: "",
  },
  teams: [
    {
      name: "Minerva",
      logo: (<Sparkles />),
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Command Center",
      url: "/",
      icon: (<Home />),
      isActive: true,
      items: [
        { title: "Overview", url: "/" },
        { title: "Morning Brief", url: "#briefing" },
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: (<BarChart3 />),
      items: [
        { title: "Performance", url: "#" },
        { title: "Attribution", url: "#" },
        { title: "AI Agent", url: "#" },
      ],
    },
    {
      title: "Audiences",
      url: "#",
      icon: (<Users />),
      items: [
        { title: "Audience Studio", url: "#" },
        { title: "Predictive", url: "#" },
        { title: "Segments", url: "#" },
      ],
    },
    {
      title: "Activations",
      url: "#",
      icon: (<Radio />),
      items: [
        { title: "Campaigns", url: "#" },
        { title: "Channels", url: "#" },
        { title: "Orchestrations", url: "#" },
      ],
    },
    {
      title: "Person Search",
      url: "#",
      icon: (<Search />),
      items: [
        { title: "Search", url: "#" },
        { title: "Enrichment", url: "#" },
      ],
    },
    {
      title: "Integrations",
      url: "#",
      icon: (<Plug />),
      items: [
        { title: "Connected", url: "#" },
        { title: "Marketplace", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: (<Settings2 />),
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
