"use client";

import { useState } from "react";
import { cn } from "~/lib/utils";

type SettingsSection = "accounts" | "notifications" | "automation" | "workspace" | "billing";

interface SettingsAccount {
  id: string;
  name: string;
  type: "google" | "slack" | "outlook" | "github";
  email: string;
  isConnected: boolean;
  lastSync: string;
  status: "active" | "error" | "syncing";
}

const mockAccounts: SettingsAccount[] = [
  {
    id: "google-1",
    name: "Google Workspace",
    type: "google",
    email: "user@company.com",
    isConnected: true,
    lastSync: "2 minutes ago",
    status: "active"
  },
  {
    id: "slack-1", 
    name: "Slack Workspace",
    type: "slack",
    email: "user@company.slack.com",
    isConnected: true,
    lastSync: "5 minutes ago",
    status: "active"
  },
  {
    id: "outlook-1",
    name: "Outlook",
    type: "outlook", 
    email: "user@company.com",
    isConnected: false,
    lastSync: "Never",
    status: "error"
  }
];

const sectionIcons = {
  accounts: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="m22 21-3-3m0 0a5.5 5.5 0 1 0-11 0 5.5 5.5 0 0 0 11 0z"/>
    </svg>
  ),
  notifications: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="m13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  automation: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v4"/>
      <path d="m16.24 7.76-2.12 2.12"/>
      <path d="M20 12h-4"/>
      <path d="m16.24 16.24-2.12-2.12"/>
      <path d="M12 20v-4"/>
      <path d="m7.76 16.24 2.12-2.12"/>
      <path d="M4 12h4"/>
      <path d="m7.76 7.76 2.12 2.12"/>
    </svg>
  ),
  workspace: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  ),
  billing: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
};

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("accounts");
  const [accounts, setAccounts] = useState<SettingsAccount[]>(mockAccounts);

  const sections = [
    { key: "accounts" as const, label: "Connected Accounts", description: "Manage your integrations" },
    { key: "notifications" as const, label: "Notifications", description: "Control how you're notified" },
    { key: "automation" as const, label: "Automation", description: "Configure intelligent workflows" },
    { key: "workspace" as const, label: "Workspace", description: "Customize your environment" },
    { key: "billing" as const, label: "Billing & Usage", description: "Manage your subscription" },
  ];

  const connectAccount = async (type: string) => {
    // Mock Google OAuth simulation
    if (type === "google") {
      const newAccount: SettingsAccount = {
        id: `google-${Date.now()}`,
        name: "Google Workspace",
        type: "google",
        email: "newuser@example.com",
        isConnected: true,
        lastSync: "Just now",
        status: "active"
      };
      setAccounts([...accounts, newAccount]);
    }
  };

  const disconnectAccount = (accountId: string) => {
    setAccounts(accounts.filter(acc => acc.id !== accountId));
  };

  const renderAccountsSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-headline text-foreground mb-2">Connected Accounts</h2>
        <p className="text-caption text-muted-foreground">
          Manage your connected platforms and data sources. Dex autonomously monitors these accounts for workflow intelligence.
        </p>
      </div>

      {/* Connected Accounts */}
      <div className="space-y-4">
        {accounts.map((account) => (
          <div key={account.id} className="flat-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  account.type === "google" && "bg-red-500/10 border border-red-500/20",
                  account.type === "slack" && "bg-purple-500/10 border border-purple-500/20",
                  account.type === "outlook" && "bg-blue-500/10 border border-blue-500/20"
                )}>
                  {account.type === "google" && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  {account.type === "slack" && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-purple-500">
                      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z"/>
                      <path d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"/>
                      <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z"/>
                      <path d="M8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"/>
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-title font-semibold text-foreground">{account.name}</h3>
                  <p className="text-caption text-muted-foreground">{account.email}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className={cn(
                      "status-indicator",
                      account.status === "active" && "active",
                      account.status === "error" && "error"
                    )}>
                      <span className="text-micro">
                        {account.status === "active" ? "Connected" : "Error"}
                      </span>
                    </div>
                    <span className="text-micro text-muted-foreground">
                      Last sync: {account.lastSync}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => disconnectAccount(account.id)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-accent transition-all"
              >
                Disconnect
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Account */}
      <div className="flat-card p-6 border-dashed">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5v14m-7-7h14"/>
            </svg>
          </div>
          <div>
            <h3 className="text-title font-semibold text-foreground mb-2">Connect New Account</h3>
            <p className="text-caption text-muted-foreground mb-4">
              Add more data sources for comprehensive workflow intelligence
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => connectAccount("google")}
              className="flat-button flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              </svg>
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-headline text-foreground mb-2">Notifications</h2>
        <p className="text-caption text-muted-foreground">
          Control how and when Dex notifies you about important events and insights.
        </p>
      </div>

      <div className="space-y-4">
        {[
          { id: "high-priority", label: "High Priority Events", description: "Immediate alerts for critical conversations", enabled: true },
          { id: "daily-summary", label: "Daily Summary", description: "End-of-day digest of your activities", enabled: true },
          { id: "weekly-insights", label: "Weekly Insights", description: "AI-generated weekly workflow insights", enabled: false },
          { id: "task-reminders", label: "Task Reminders", description: "Notifications for pending tasks and follow-ups", enabled: true },
        ].map((setting) => (
          <div key={setting.id} className="flat-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-title font-semibold text-foreground">{setting.label}</h3>
                <p className="text-caption text-muted-foreground mt-1">{setting.description}</p>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full border-2 transition-all cursor-pointer",
                setting.enabled 
                  ? "bg-primary border-primary" 
                  : "bg-muted border-border"
              )}>
                <div className={cn(
                  "w-4 h-4 rounded-full bg-white transition-transform",
                  setting.enabled ? "translate-x-6" : "translate-x-0"
                )} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAutomationSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-headline text-foreground mb-2">Automation</h2>
        <p className="text-caption text-muted-foreground">
          Configure intelligent workflows and autonomous processing rules.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flat-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-title font-semibold text-foreground">Auto-Export</h3>
            <div className="status-indicator active">
              <span className="text-micro">Active</span>
            </div>
          </div>
          <p className="text-caption text-muted-foreground mb-4">
            Automatically export high-priority conversations to your CRM
          </p>
          <div className="flex gap-3">
            <button className="flat-button">Configure Rules</button>
            <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-accent transition-all">
              View Logs
            </button>
          </div>
        </div>

        <div className="flat-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-title font-semibold text-foreground">Smart Tagging</h3>
            <div className="status-indicator active">
              <span className="text-micro">Active</span>
            </div>
          </div>
          <p className="text-caption text-muted-foreground mb-4">
            AI-powered automatic tagging of conversations by topic and priority
          </p>
          <button className="flat-button">Manage Tags</button>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case "accounts":
        return renderAccountsSection();
      case "notifications":
        return renderNotificationsSection();
      case "automation":
        return renderAutomationSection();
      case "workspace":
        return (
          <div className="space-y-6">
            <h2 className="text-headline text-foreground">Workspace Settings</h2>
            <div className="flat-card p-6">
              <p className="text-caption text-muted-foreground">Workspace settings coming soon...</p>
            </div>
          </div>
        );
      case "billing":
        return (
          <div className="space-y-6">
            <h2 className="text-headline text-foreground">Billing & Usage</h2>
            <div className="flat-card p-6">
              <p className="text-caption text-muted-foreground">Billing settings coming soon...</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display text-foreground mb-2">Settings</h1>
          <p className="text-caption text-muted-foreground">
            Configure your workspace for optimal autonomous intelligence
          </p>
        </div>
        
        <div className="status-indicator active">
          <span className="text-caption">All Systems Operational</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-2 sticky top-6">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200",
                  activeSection === section.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <div className="flex-shrink-0">
                  {sectionIcons[section.key]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{section.label}</div>
                  <div className={cn(
                    "text-xs mt-0.5",
                    activeSection === section.key
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}>
                    {section.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="animate-fade-in">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 