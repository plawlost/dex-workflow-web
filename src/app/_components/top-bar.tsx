"use client";

import { useState, useEffect } from "react";
import { cn } from "~/lib/utils";
import { SearchIcon, UserIcon, LogOutIcon, SettingsIcon } from "~/components/icons";
import { mockUsers } from "~/lib/mock-data";

export function TopBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Use the first mock user as current user
  const currentUser = mockUsers[0];

  // Handle ⌘K shortcut
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "k") {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-16 h-16 glass border-b border-border z-40 flex items-center justify-between px-6">
      {/* Global Search */}
      <div className="flex-1 max-w-md relative">
        <SearchIcon 
          size={16}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
        />
        <input
          id="global-search"
          type="text"
          placeholder="Search conversations, contacts, tasks... ⌘K"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            "w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-lg",
            "text-sm placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
            "transition-all duration-200 hover:bg-muted/70"
          )}
        />
      </div>

      {/* Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={cn(
            "flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary/20"
          )}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
            <UserIcon size={16} className="text-primary-foreground" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-foreground">{currentUser?.name}</p>
            <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isProfileOpen && (
          <>
            <div className={cn(
              "absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-xl shadow-hard py-2",
              "animate-fade-in"
            )}>
              <div className="px-4 py-3 border-b border-border">
                <p className="font-medium text-sm text-popover-foreground">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
              </div>
              
              <div className="py-2">
                <button className={cn(
                  "flex items-center gap-3 w-full px-4 py-2 text-sm text-popover-foreground",
                  "hover:bg-accent transition-colors duration-150"
                )}>
                  <SettingsIcon size={16} />
                  Settings
                </button>
                
                <button className={cn(
                  "flex items-center gap-3 w-full px-4 py-2 text-sm text-popover-foreground",
                  "hover:bg-accent transition-colors duration-150"
                )}>
                  <LogOutIcon size={16} />
                  Sign out
                </button>
              </div>
            </div>

            {/* Click outside to close dropdown */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsProfileOpen(false)}
            />
          </>
        )}
      </div>
    </header>
  );
} 