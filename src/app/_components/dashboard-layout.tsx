"use client";

import { LeftNav } from "./left-nav";
import { TopBar } from "./top-bar";
import { MobileTabBar } from "./mobile-tab-bar";
import { cn } from "~/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <LeftNav />
        <TopBar />
      </div>
      
      {/* Mobile Top Bar */}
      <div className="md:hidden">
        <div className="fixed top-0 left-0 right-0 h-16 glass border-b border-border z-40 flex items-center px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">D</span>
            </div>
            <span className="text-title font-geist font-medium">Dex</span>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <main className={cn(
        "md:pl-16 md:pt-16 pt-16 pb-20 md:pb-0 min-h-screen",
        "transition-all duration-300 ease-out"
      )}>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <MobileTabBar />
      </div>
    </div>
  );
} 