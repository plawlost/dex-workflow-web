"use client";

import Link from "next/link";
import { User, LinkSimple, Lightning, Bell } from "@phosphor-icons/react";
import { DashboardLayout } from "~/app/_components/dashboard-layout";
import { Button } from "~/components/ui/button";

const settingsPages = [
  {
    title: "Connected Accounts",
    description: "Manage your authentication providers and linked accounts",
    href: "/settings/accounts",
    icon: <User size={24} weight="fill" />,
    color: "bg-blue-500"
  },
  {
    title: "Integrations",
    description: "Configure N8N, Slack, and Supabase connections",
    href: "/settings/integrations", 
    icon: <LinkSimple size={24} weight="bold" />,
    color: "bg-green-500"
  },
  {
    title: "Workflow Rules",
    description: "Set up automation rules and triggers",
    href: "/rules",
    icon: <Lightning size={24} weight="fill" />,
    color: "bg-purple-500"
  },
  {
    title: "Notifications",
    description: "Control how and when you receive alerts",
    href: "/settings/notifications",
    icon: <Bell size={24} weight="fill" />,
    color: "bg-orange-500"
  }
];

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-display font-medium text-deep-gray mb-2">
            Settings
          </h1>
          <p className="text-caption text-slate-gray">
            Manage your account, integrations, and workflow preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsPages.map((page) => (
            <Link key={page.href} href={page.href}>
              <div className="glass-surface rounded-xl p-6 border border-white/20 hover:border-accent-blue/30 transition-all duration-200 group">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${page.color} rounded-lg flex items-center justify-center text-white text-xl group-hover:scale-105 transition-transform`}>
                    {page.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-title font-medium text-deep-gray mb-2 group-hover:text-accent-blue transition-colors">
                      {page.title}
                    </h3>
                    <p className="text-caption text-slate-gray">
                      {page.description}
                    </p>
                  </div>
                  <div className="text-stone-gray group-hover:text-accent-blue transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 glass-surface rounded-xl p-6 border border-white/20">
          <h2 className="text-title font-medium text-deep-gray mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" className="bg-white/80 hover:bg-white/90">
              Export Data
            </Button>
            <Button variant="outline" size="sm" className="bg-white/80 hover:bg-white/90">
              Reset Preferences
            </Button>
            <Button variant="outline" size="sm" className="bg-white/80 hover:bg-white/90 text-error-red hover:text-error-red">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}