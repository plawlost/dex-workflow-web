"use client";

import { useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Users,
  Bell,
  Sparkles,
  Palette,
  CreditCard,
} from "lucide-react";

type Section =
  | "accounts"
  | "notifications"
  | "automation"
  | "workspace"
  | "billing";

const sections = {
  accounts: { icon: Users, label: "Connected Accounts", description: "Manage your integrations" },
  notifications: { icon: Bell, label: "Notifications", description: "Control how you're notified" },
  automation: { icon: Sparkles, label: "Automation", description: "Configure intelligent workflows" },
  workspace: { icon: Palette, label: "Workspace", description: "Customize your environment" },
  billing: { icon: CreditCard, label: "Billing & Usage", description: "Manage your subscription" },
};

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("accounts");

  const renderSectionContent = () => {
    switch (activeSection) {
      case "accounts":
        return <AccountsSection />;
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{sections[activeSection].label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Coming soon.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
      <nav className="grid gap-4 text-sm text-muted-foreground">
        {Object.entries(sections).map(([key, { icon: Icon, label, description }]) => (
          <button
            key={key}
            onClick={() => setActiveSection(key as Section)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-all hover:text-primary",
              activeSection === key && "bg-muted text-primary"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>
      <div className="grid gap-6">
        {renderSectionContent()}
      </div>
    </div>
  );
}

function AccountsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AccountCard
          name="Google Workspace"
          details="user@company.com"
          status="connected"
        />
        <AccountCard
          name="Slack Workspace"
          details="user@company.slack.com"
          status="connected"
        />
        <AccountCard
          name="Outlook"
          details="user@company.com"
          status="error"
        />
        <Button variant="outline" className="w-full">
          Connect New Account
        </Button>
      </CardContent>
    </Card>
  );
}

interface AccountCardProps {
  name: string;
  details: string;
  status: "connected" | "error" | "syncing";
}

function AccountCard({ name, details, status }: AccountCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
          {/* Placeholder for icon */}
        </div>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{details}</p>
        </div>
      </div>
      <Button variant={status === "error" ? "destructive" : "outline"}>
        {status === "connected" ? "Disconnect" : "Reconnect"}
      </Button>
    </div>
  );
} 