"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { 
  TimelineIcon, 
  TasksIcon, 
  RulesIcon, 
  SettingsIcon, 
  HelpIcon,
  ChevronLeftIcon,
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
];

const secondaryNavItems: NavItem[] = [
  { id: "settings", label: "Settings", icon: SettingsIcon, href: "/settings" },
  { id: "help", label: "Help", icon: HelpIcon, href: "/help" },
];

interface LeftNavProps {
  isCollapsed: boolean;
  setCollapsed: (isCollapsed: boolean) => void;
}

export function LeftNav({ isCollapsed, setCollapsed }: LeftNavProps) {
  const pathname = usePathname();

  return (
    <div className={cn(
      "hidden md:block glass-panel border-r border-white/20 transition-all duration-300",
      isCollapsed ? "w-20" : "w-72"
    )}>
      <div className="flex h-full max-h-screen flex-col relative">
        {/* Header */}
        <div className={cn(
          "flex h-16 items-center border-b border-white/10 transition-all",
          isCollapsed ? "px-0 justify-center" : "px-6"
        )}>
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="Dex Logo" className="h-8 w-8 transition-transform group-hover:scale-105" />
            <span className={cn("text-headline font-medium tracking-tight", isCollapsed && "hidden")}>Dex</span>
          </Link>
        </div>

        {/* Collapse Trigger */}
        <button 
          onClick={() => setCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-white/80 p-1.5 rounded-full border border-stone-gray/20 shadow-sm hover:bg-white transition-all"
        >
          <ChevronLeftIcon className={cn("transition-transform text-slate-gray", isCollapsed && "rotate-180")} size={16} />
        </button>
        
        {/* Navigation */}
        <div className="flex-1 px-4 py-6 space-y-8">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavItemLink key={item.id} item={item} pathname={pathname} isCollapsed={isCollapsed} />
            ))}
          </nav>
          
          <nav className="space-y-1">
            <h2 className={cn("text-xs text-stone-gray uppercase tracking-wider font-semibold px-3 py-2", isCollapsed && "text-center")}>
              {isCollapsed ? "..." : "Support"}
            </h2>
            {secondaryNavItems.map((item) => (
              <NavItemLink key={item.id} item={item} pathname={pathname} isCollapsed={isCollapsed} />
            ))}
          </nav>
        </div>
        
        {/* Footer Status */}
        <div className={cn("px-6 py-4 border-t border-white/10", isCollapsed && "px-0")}>
          <div className="flex items-center justify-center gap-3">
            <div className="status-dot success pulse"></div>
            <span className={cn("text-caption font-medium text-slate-gray", isCollapsed && "hidden")}>
              System Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItemLink({ item, pathname, isCollapsed }: { item: NavItem; pathname: string; isCollapsed: boolean }) {
  const Icon = item.icon;
  const isActive = pathname === item.href;
  
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-3 rounded-lg text-body font-medium transition-all duration-200",
        isActive ? "bg-accent-blue text-white" : "text-slate-gray hover:bg-white/10",
        isCollapsed && "justify-center"
      )}
    >
      <Icon 
        className={cn("transition-colors", isActive ? "text-white" : "text-stone-gray")} 
        size={20} 
      />
      <span className={cn(isCollapsed && "hidden")}>{item.label}</span>
    </Link>
  );
} 