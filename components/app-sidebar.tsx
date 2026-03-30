"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { MinervaLogo } from "@/components/shared/MinervaLogo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  HomeIcon,
  BarChart3Icon,
  SearchIcon,
  FileStackIcon,
  TelescopeIcon,
  UsersIcon,
  PlugIcon,
  BarChartIcon,
  Settings2Icon,
} from "lucide-react"

const data = {
  user: {
    name: "Sarah Martinez",
    email: "s.martinez@dolphins.com",
    avatar: "",
  },
  teams: [
    {
      name: "Minerva",
      logo: (<MinervaLogo className="h-4 w-4" />),
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Command Center",
      url: "/",
      icon: (<HomeIcon />),
      isActive: true,
      items: [
        { title: "Overview", url: "/" },
        { title: "Morning Brief", url: "#briefing" },
        { title: "Opportunities", url: "#opportunities" },
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: (<BarChart3Icon />),
      items: [
        { title: "Executive Overview", url: "#" },
        { title: "Paid Ads", url: "#" },
        { title: "AI Agent", url: "#" },
      ],
    },
    {
      title: "Person Search",
      url: "#",
      icon: (<SearchIcon />),
      items: [
        { title: "Search", url: "#" },
        { title: "Saved Searches", url: "#" },
      ],
    },
    {
      title: "Bulk Enrich",
      url: "#",
      icon: (<FileStackIcon />),
      items: [
        { title: "Upload", url: "#" },
        { title: "History", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: (<Settings2Icon />),
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
      ],
    },
  ],
  projects: [
    {
      name: "Prospecting",
      url: "#",
      icon: (<TelescopeIcon />),
    },
    {
      name: "Owned Audience",
      url: "#",
      icon: (<UsersIcon />),
    },
    {
      name: "Integrations",
      url: "#",
      icon: (<PlugIcon />),
    },
    {
      name: "Usage",
      url: "#",
      icon: (<BarChartIcon />),
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
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
