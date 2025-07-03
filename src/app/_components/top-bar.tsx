"use client";

import Link from "next/link";
import { UserIcon, MenuIcon, SearchIcon, BellIcon } from "~/components/icons";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { MobileTabBar } from "./mobile-tab-bar";

export function TopBar() {
  return (
    <header className="glass-panel flex h-16 items-center gap-6 px-6 md:px-8 border-b border-white/20">
      <MobileTabBar />
      
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-gray" size={16} />
          <input
            type="search"
            placeholder="Search conversations, contacts..."
            className="pure-input w-full pl-10 text-sm border-0 bg-white/80 backdrop-blur-sm"
            style={{ 
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(12px)'
            }}
          />
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="pure-button-ghost relative p-2 rounded-lg">
          <BellIcon className="text-slate-gray" size={18} />
          <div className="status-dot error absolute -top-1 -right-1 w-2 h-2"></div>
        </button>
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="pure-button-ghost flex items-center gap-3 px-3 py-2 rounded-lg">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                   style={{ background: 'rgb(var(--accent))' }}>
                <span className="text-white text-sm font-medium">YC</span>
              </div>
              <div className="hidden md:block text-left">
                <div className="text-caption font-medium" style={{ color: 'rgb(var(--text-primary))' }}>Yagiz Celebi</div>
                <div className="text-label" style={{ color: 'rgb(var(--text-tertiary))' }}>@yaz</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-surface w-56 border-white/20">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon size={16} />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="icon icon-sm">⚙</span>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <span className="icon icon-sm">↗</span>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
} 