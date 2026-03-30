import * as React from "react"
import {
  Sparkles,
  BarChart3,
  Search,
  FileStack,
  Telescope,
  Users,
  Plug,
  BarChart,
  Rocket,
  Home,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  workspace: [
    {
      title: "Command Center",
      url: "/",
      icon: Home,
      isActive: true,
      isNew: true,
      items: [
        { title: "Overview", url: "/", isActive: true },
        { title: "Morning Brief", url: "#briefing" },
        { title: "Opportunities", url: "#opportunities" },
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: BarChart3,
      items: [
        { title: "Executive Overview", url: "#" },
        { title: "Paid Ads", url: "#" },
        { title: "AI Agent", url: "#" },
      ],
    },
    {
      title: "Person Search",
      url: "#",
      icon: Search,
      items: [
        { title: "Search", url: "#" },
        { title: "Saved Searches", url: "#" },
      ],
    },
    {
      title: "Bulk Enrich",
      url: "#",
      icon: FileStack,
      items: [
        { title: "Upload", url: "#" },
        { title: "History", url: "#" },
      ],
    },
  ],
  audienceStudio: [
    {
      title: "Prospecting",
      url: "#",
      icon: Telescope,
      items: [
        { title: "Segments", url: "#" },
        { title: "Create Prospect", url: "#" },
      ],
    },
    {
      title: "Owned Audience",
      url: "#",
      icon: Users,
      items: [
        { title: "Audiences", url: "#" },
        { title: "Activations", url: "#" },
      ],
    },
  ],
  bottom: [
    { title: "Integrations", url: "#", icon: Plug },
    { title: "Usage", url: "#", icon: BarChart },
    { title: "Get Started", url: "#", icon: Rocket, badge: 4 },
  ],
}

function NavSection({
  label,
  items,
}: {
  label: string
  items: typeof data.workspace
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton isActive={item.isActive} tooltip={item.title}>
              {item.icon && <item.icon className="size-4" />}
              <span className="font-medium">{item.title}</span>
              {item.isNew && (
                <span className="ml-auto rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  NEW
                </span>
              )}
            </SidebarMenuButton>
            {item.items?.length ? (
              <SidebarMenuSub>
                {item.items.map((sub) => (
                  <SidebarMenuSubItem key={sub.title}>
                    <SidebarMenuSubButton isActive={("isActive" in sub) && sub.isActive}>
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
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      {/* Brand header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-sm">Minerva</span>
                <span className="text-[11px] text-muted-foreground">Miami Dolphins</span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main nav */}
      <SidebarContent>
        <NavSection label="Workspace" items={data.workspace} />
        <NavSection label="Audience Studio" items={data.audienceStudio} />
      </SidebarContent>

      {/* Bottom nav */}
      <SidebarFooter>
        <SidebarMenu>
          {data.bottom.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                <item.icon className="size-4" />
                <span>{item.title}</span>
                {item.badge && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {/* User */}
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sarah Martinez">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                SM
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xs font-medium">Sarah Martinez</span>
                <span className="text-[10px] text-muted-foreground">s.martinez@dolphins.com</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
