"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { 
  TimelineIcon, 
  TasksIcon, 
  RulesIcon, 
  SettingsIcon 
} from "~/components/icons";

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  href: string;
  badge?: number;
}

const tabItems: TabItem[] = [
  { id: "timeline", label: "Timeline", icon: TimelineIcon, href: "/", badge: 3 },
  { id: "tasks", label: "Tasks", icon: TasksIcon, href: "/tasks", badge: 7 },
  { id: "rules", label: "Rules", icon: RulesIcon, href: "/rules" },
  { id: "settings", label: "Settings", icon: SettingsIcon, href: "/settings" },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass-panel border-t border-border">
        <div className="flex items-center">
          {tabItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.id} href={item.href} className="flex-1">
                <div className={cn(
                  "relative flex flex-col items-center gap-1 py-3 px-2 transition-all duration-200",
                  "active:scale-95",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}>
                  <div className="relative">
                    <Icon 
                      size={22} 
                      className={cn(
                        "transition-all duration-200",
                        isActive && "scale-110"
                      )} 
                    />
                    {item.badge && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs font-semibold rounded-full flex items-center justify-center animate-scale-in">
                        {item.badge > 9 ? "9+" : item.badge}
                      </div>
                    )}
                  </div>
                  <span className={cn(
                    "text-xs font-medium transition-all duration-200",
                    isActive 
                      ? "text-primary scale-105" 
                      : "text-muted-foreground"
                  )}>
                    {item.label}
                  </span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
} 