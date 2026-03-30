"use client";

import {
  Home,
  BarChart3,
  Users,
  Radio,
  Plug,
  Search,
  Settings,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Users, label: "Audiences", active: false },
  { icon: Search, label: "Person Search", active: false },
  { icon: Radio, label: "Activations", active: false },
  { icon: Plug, label: "Integrations", active: false },
];

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="flex w-16 flex-col items-center border-r border-border-subtle bg-bg-surface py-4">
        {/* Logo */}
        <div className="mb-8 flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
          <span className="text-sm font-bold text-accent">M</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              title={item.label}
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-150 ${
                item.active
                  ? "bg-bg-raised text-text-primary"
                  : "text-text-tertiary hover:bg-bg-raised hover:text-text-secondary"
              }`}
            >
              <item.icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
            </button>
          ))}
        </nav>

        {/* Settings */}
        <button
          title="Settings"
          className="mt-auto flex h-10 w-10 items-center justify-center rounded-lg text-text-tertiary transition-colors duration-150 hover:bg-bg-raised hover:text-text-secondary"
        >
          <Settings className="h-[18px] w-[18px]" strokeWidth={1.7} />
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
