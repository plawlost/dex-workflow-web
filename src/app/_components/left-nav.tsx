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
}

const navItems: NavItem[] = [
  { id: "timeline", label: "Timeline", icon: TimelineIcon, href: "/" },
  { id: "tasks", label: "Tasks", icon: TasksIcon, href: "/tasks" },
  { id: "rules", label: "Rules", icon: RulesIcon, href: "/rules" },
  { id: "settings", label: "Settings", icon: SettingsIcon, href: "/settings" },
  { id: "help", label: "Help", icon: HelpIcon, href: "/help" },
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
        "fixed left-0 top-0 h-full bg-background/95 backdrop-blur-md border-r border-border z-50 transition-all duration-300 ease-out",
        isNavExpanded ? "w-64" : "w-16"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <DexLogo size={24} />
        <div className={cn(
          "transition-all duration-200 overflow-hidden",
          isNavExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
        )}>
          <span className="text-title font-geist font-medium">Dex</span>
        </div>
        
        {/* Pin Toggle - only show when expanded */}
        {isNavExpanded && (
          <button
            onClick={togglePin}
            className={cn(
              "ml-auto p-1.5 rounded-md hover:bg-accent transition-colors",
              isPinned ? "text-primary" : "text-muted-foreground"
            )}
          >
            <svg
              width="12"
              height="12"
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

      {/* Navigation Items */}
      <div className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "hover:bg-accent/50 hover-lift",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full" />
              )}
              
              <Icon 
                size={18} 
                className={cn(
                  "transition-colors flex-shrink-0",
                  isActive ? "text-primary" : "group-hover:text-foreground"
                )} 
              />
              
              <span
                className={cn(
                  "text-sm font-medium transition-all duration-200 overflow-hidden whitespace-nowrap",
                  isNavExpanded 
                    ? "opacity-100 translate-x-0" 
                    : "opacity-0 -translate-x-2 w-0"
                )}
              >
                {item.label}
              </span>

              {/* Tooltip for collapsed state */}
              {!isNavExpanded && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Expansion Indicator */}
      {!isNavExpanded && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="w-1 h-8 bg-gradient-to-t from-border to-transparent rounded-full" />
        </div>
      )}
    </nav>
  );
} 