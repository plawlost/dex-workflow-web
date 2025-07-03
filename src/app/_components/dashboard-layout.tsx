"use client";

import { useState } from "react";
import { cn } from "~/lib/utils";
import { LeftNav } from "./left-nav";
import { TopBar } from "./top-bar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-cosmic-gray/50" style={{ background: 'rgb(var(--background))' }}>
      <div className={cn(
        "grid min-h-screen w-full transition-all duration-300",
        isSidebarCollapsed ? "md:grid-cols-[80px_1fr]" : "md:grid-cols-[280px_1fr]"
      )}>
        <LeftNav isCollapsed={isSidebarCollapsed} setCollapsed={setIsSidebarCollapsed} />
        <div className="flex flex-col">
          <TopBar />
          <main className="flex flex-1 flex-col p-6 md:p-8 overflow-hidden">
            <div className="animate-fade-in-pure max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 