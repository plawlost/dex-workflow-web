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
    <div className="min-h-screen bg-background font-inter">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <LeftNav />
        <TopBar />
      </div>
      
      {/* Mobile Top Bar - Refined */}
      <div className="md:hidden">
        <div className="fixed top-0 left-0 right-0 h-16 glass-panel border-b border-border z-50 flex items-center px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-foreground">D</span>
            </div>
            <span className="text-title font-semibold">Dex</span>
          </div>
          
          {/* Status indicator for mobile */}
          <div className="ml-auto flex items-center gap-3">
            <div className="status-indicator active">
              <span className="text-micro">Live</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area - Optimized */}
      <main className={cn(
        "md:pl-20 md:pt-20 pt-16 pb-20 md:pb-6 min-h-screen",
        "transition-all duration-300 ease-out"
      )}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation - Enhanced */}
      <div className="md:hidden">
        <MobileTabBar />
      </div>
    </div>
  );
} 