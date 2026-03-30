"use client"

import * as React from "react"
import Link from "next/link"
import {
  BarChart3,
  Users,
  Radio,
  Search,
  Sparkles,
  TrendingUp,
  Target,
  Zap,
} from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const audienceItems = [
  {
    title: "Audience Studio",
    href: "#",
    description: "Build, manage, and monitor your audience segments.",
  },
  {
    title: "Predictive Audiences",
    href: "#",
    description: "AI-generated audiences based on propensity scoring.",
  },
  {
    title: "Prospecting",
    href: "#",
    description: "Discover new high-value prospects across 260M+ profiles.",
  },
  {
    title: "Person Search",
    href: "#",
    description: "Search and enrich individual consumer profiles.",
  },
]

const activationItems = [
  {
    title: "Campaigns",
    href: "#",
    description: "Active campaigns across email, paid, and SMS.",
  },
  {
    title: "Channel Performance",
    href: "#",
    description: "ROAS, conversion, and efficiency across all channels.",
  },
  {
    title: "Orchestrations",
    href: "#",
    description: "Automated multi-step activation workflows.",
  },
]

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink
        render={
          <Link href={href}>
            <div className="flex flex-col gap-1 text-sm">
              <div className="leading-none font-medium">{title}</div>
              <div className="line-clamp-2 text-muted-foreground">
                {children}
              </div>
            </div>
          </Link>
        }
      />
    </li>
  )
}

export function TopNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Analytics</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-96">
              <ListItem href="#" title="Executive Overview">
                High-level performance metrics and AI-powered insights.
              </ListItem>
              <ListItem href="#" title="Paid Ads">
                Meta, Google, and programmatic campaign analytics.
              </ListItem>
              <ListItem href="#" title="AI Agent">
                Ask questions about your data in natural language.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:flex">
          <NavigationMenuTrigger>Audiences</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2">
              {audienceItems.map((item) => (
                <ListItem
                  key={item.title}
                  title={item.title}
                  href={item.href}
                >
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden lg:flex">
          <NavigationMenuTrigger>Activations</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2">
              {activationItems.map((item) => (
                <ListItem
                  key={item.title}
                  title={item.title}
                  href={item.href}
                >
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            render={<Link href="#">Integrations</Link>}
          />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
