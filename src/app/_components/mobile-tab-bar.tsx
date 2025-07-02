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
}

const tabItems: TabItem[] = [
  { id: "timeline", label: "Timeline", icon: TimelineIcon, href: "/" },
  { id: "tasks", label: "Tasks", icon: TasksIcon, href: "/tasks" },
  { id: "rules", label: "Rules", icon: RulesIcon, href: "/rules" },
  { id: "settings", label: "Settings", icon: SettingsIcon, href: "/settings" },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 glass border-t border-border z-50 safe-area-pb">
      <div className="flex">
        {tabItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2",
                "transition-all duration-200 hover:bg-accent/50",
                isActive 
                  ? "text-primary bg-primary/5" 
                  : "text-muted-foreground"
              )}
            >
              <Icon 
                size={20} 
                className={cn(
                  "transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} 
              />
              <span className={cn(
                "text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
} 