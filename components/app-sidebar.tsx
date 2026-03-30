import * as React from "react"
import { Sparkles } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Command Center",
      url: "/",
      items: [
        { title: "Overview", url: "/", isActive: true },
        { title: "Morning Brief", url: "#briefing" },
        { title: "Opportunities", url: "#opportunities" },
      ],
    },
    {
      title: "Analytics",
      url: "#",
      items: [
        { title: "Performance", url: "#" },
        { title: "Attribution", url: "#" },
        { title: "AI Agent", url: "#" },
      ],
    },
    {
      title: "Audiences",
      url: "#",
      items: [
        { title: "Audience Studio", url: "#" },
        { title: "Predictive", url: "#" },
        { title: "Segments", url: "#" },
        { title: "Person Search", url: "#" },
      ],
    },
    {
      title: "Activations",
      url: "#",
      items: [
        { title: "Campaigns", url: "#" },
        { title: "Channels", url: "#" },
        { title: "Orchestrations", url: "#" },
      ],
    },
    {
      title: "Integrations",
      url: "#",
      items: [
        { title: "Connected", url: "#" },
        { title: "Marketplace", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
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
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-sm">Minerva</span>
                <span className="text-xs text-muted-foreground">Miami Dolphins</span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton>
                  <span className="font-medium">{item.title}</span>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((sub) => (
                      <SidebarMenuSubItem key={sub.title}>
                        <SidebarMenuSubButton isActive={sub.isActive}>
                          <span>{sub.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
