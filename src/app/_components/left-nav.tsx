"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { 
  TimelineIcon, 
  TasksIcon, 
  RulesIcon, 
  SettingsIcon, 
  HelpIcon,
  DexLogo 
} from "~/components/icons";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  href: string;
  statusType?: "active" | "warning" | "error" | "none";
}

const navItems: NavItem[] = [
  { id: "timeline", label: "Timeline", icon: TimelineIcon, href: "/", statusType: "active" },
  { id: "tasks", label: "Tasks", icon: TasksIcon, href: "/tasks", statusType: "active" },
  { id: "rules", label: "Rules", icon: RulesIcon, href: "/rules", statusType: "active" },
  { id: "settings", label: "Settings", icon: SettingsIcon, href: "/settings", statusType: "none" },
  { id: "help", label: "Help", icon: HelpIcon, href: "/help", statusType: "none" },
];

export function LeftNav() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const pathname = usePathname();

  const handleMouseEnter = () => {
    if (!isPinned) setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (!isPinned) setIsExpanded(false);
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
    if (!isPinned) setIsExpanded(true);
  };

  const isNavExpanded = isExpanded || isPinned;

  return (
    <nav
      className={cn(
        "fixed left-0 top-0 h-full glass-panel border-r border-border z-50",
        "transition-all duration-300 ease-out",
        isNavExpanded ? "w-64" : "w-20"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header - Refined */}
      <div className="flex items-center gap-3 p-5 border-b border-border">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <DexLogo size={20} className="text-primary-foreground" />
        </div>
        <div className={cn(
          "transition-all duration-200 overflow-hidden",
          isNavExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
        )}>
          <span className="text-title font-semibold">Dex</span>
        </div>
        
        {/* Pin Toggle - Refined */}
        {isNavExpanded && (
          <button
            onClick={togglePin}
            className={cn(
              "ml-auto p-2 rounded-lg transition-all duration-150",
              "hover:bg-accent",
              isPinned ? "text-primary bg-primary/10" : "text-muted-foreground"
            )}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 17v5" />
              <path d="M9 10.76a2 2 0 0 1-1.11 1.79L7 13a2 2 0 0 1-2 0l-.89-.55A2 2 0 0 1 3 10.76V7a2 2 0 0 1 1.11-1.79L5 5a2 2 0 0 1 2 0l.89.55A2 2 0 0 1 9 7v3.76Z" />
              <path d="M15 10.76a2 2 0 0 0 1.11 1.79L17 13a2 2 0 0 0 2 0l.89-.55A2 2 0 0 0 21 10.76V7a2 2 0 0 0-1.11-1.79L19 5a2 2 0 0 0-2 0l-.89.55A2 2 0 0 0 15 7v3.76Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Status Overview - Autonomous UI Element */}
      {isNavExpanded && (
        <div className="p-5 border-b border-border">
          <div className="status-indicator active mb-3">
            <span className="text-micro">System Active</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-semibold text-foreground">24</div>
              <div className="text-micro text-muted-foreground">Events</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">3</div>
              <div className="text-micro text-muted-foreground">Rules</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">7</div>
              <div className="text-micro text-muted-foreground">Tasks</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Items - Enhanced */}
      <div className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.id} href={item.href}>
              <div className={cn(
                "group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-150",
                "hover:bg-accent",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}>
                {/* Status indicator for nav items */}
                {item.statusType && item.statusType !== "none" && (
                  <div className={cn(
                    "absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full",
                    item.statusType === "active" && "bg-emerald-500",
                    item.statusType === "warning" && "bg-amber-500", 
                    item.statusType === "error" && "bg-red-500"
                  )} />
                )}
                
                <Icon size={20} className="flex-shrink-0" />
                <span className={cn(
                  "font-medium transition-all duration-200 overflow-hidden",
                  isNavExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
                )}>
                  {item.label}
                </span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-3 w-1.5 h-1.5 bg-primary-foreground rounded-full" />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Section - User & Settings Quick Access */}
      {isNavExpanded && (
        <div className="p-5 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
              <span className="text-sm font-semibold text-secondary-foreground">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">User</div>
              <div className="text-micro text-muted-foreground">Free Plan</div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 