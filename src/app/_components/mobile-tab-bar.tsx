"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { MenuIcon } from "~/components/icons";
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
  badge?: number;
}

const navItems: NavItem[] = [
  { id: "timeline", label: "Timeline", icon: TimelineIcon, href: "/", badge: 12 },
  { id: "tasks", label: "Tasks", icon: TasksIcon, href: "/tasks", badge: 3 },
  { id: "rules", label: "Rules", icon: RulesIcon, href: "/rules" },
  { id: "settings", label: "Settings", icon: SettingsIcon, href: "/settings" },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Navigation Header */}
      <div className="md:hidden flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <button className="pure-button-ghost p-2 rounded-lg">
              <MenuIcon size={20} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="glass-panel w-64 p-0 border-white/20">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex h-16 items-center px-6 border-b border-white/10">
                <Link href="/" className="flex items-center gap-3">
                  <img src="/logo.png" alt="Dex Logo" className="h-6 w-6" />
                  <span className="text-title font-medium" style={{ color: 'rgb(var(--text-primary))' }}>
                    Dex
                  </span>
                </Link>
              </div>
              
              {/* Navigation */}
              <div className="flex-1 px-4 py-6">
                                 <nav className="space-y-1">
                   {[...navItems, { id: "help", label: "Help", icon: HelpIcon, href: "/help", badge: undefined }].map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 rounded-lg text-body font-medium transition-all duration-200",
                          isActive 
                            ? "text-white" 
                            : "hover:bg-white/10"
                        )}
                        style={{
                          background: isActive ? 'rgb(var(--accent))' : 'transparent',
                          color: isActive ? 'white' : 'rgb(var(--text-secondary))'
                        }}
                      >
                        <Icon 
                          className={cn("transition-colors", isActive ? "text-white" : "text-stone-gray")} 
                          size={20} 
                        />
                        {item.label}
                        {item.badge && (
                          <span className="ml-auto px-2 py-1 text-xs rounded-full"
                                style={{ 
                                  background: isActive ? 'rgba(255,255,255,0.2)' : 'rgb(var(--accent))',
                                  color: isActive ? 'white' : 'white'
                                }}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              
              {/* Footer Status */}
              <div className="px-6 py-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="status-dot success pulse"></div>
                  <span className="text-caption font-medium" style={{ color: 'rgb(var(--text-secondary))' }}>
                    System Active
                  </span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-white/20 p-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200 relative min-w-[60px]",
                  isActive ? "text-white" : "hover:bg-white/10"
                )}
                style={{
                  background: isActive ? 'rgb(var(--accent))' : 'transparent',
                  color: isActive ? 'white' : 'rgb(var(--text-secondary))'
                }}
              >
                <Icon 
                  className={cn("transition-colors", isActive ? "text-white" : "text-stone-gray")} 
                  size={20} 
                />
                <span className="text-xs font-medium">{item.label}</span>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs rounded-full font-medium"
                        style={{ 
                          background: 'rgb(var(--error-red))',
                          color: 'white'
                        }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
} 