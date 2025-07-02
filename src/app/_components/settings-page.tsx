"use client";

import { useState } from "react";
import { 
  Link2, 
  Bell, 
  Upload, 
  Globe, 
  RefreshCw, 
  Check, 
  X,
  ChevronDown,
  Moon,
  Sun,
  Settings
} from "lucide-react";

type SettingsSection = "accounts" | "notifications" | "exports" | "workspace";

interface Account {
  id: string;
  name: string;
  type: "gmail" | "outlook" | "slack" | "calendar" | "notion" | "hubspot";
  email?: string;
  isConnected: boolean;
  lastSync?: string;
  scopeEnabled: boolean;
}

const mockAccounts: Account[] = [
  { id: "1", name: "Gmail", type: "gmail", email: "john@example.com", isConnected: true, lastSync: "2 min ago", scopeEnabled: true },
  { id: "2", name: "Outlook", type: "outlook", email: "john@company.com", isConnected: true, lastSync: "5 min ago", scopeEnabled: true },
  { id: "3", name: "Slack", type: "slack", email: "TechCorp Workspace", isConnected: true, lastSync: "1 min ago", scopeEnabled: true },
  { id: "4", name: "Google Calendar", type: "calendar", isConnected: true, lastSync: "3 min ago", scopeEnabled: false },
  { id: "5", name: "Notion", type: "notion", isConnected: false, scopeEnabled: false },
  { id: "6", name: "HubSpot", type: "hubspot", isConnected: false, scopeEnabled: false },
];

const sections = [
  { key: "accounts" as SettingsSection, label: "Accounts", icon: Link2 },
  { key: "notifications" as SettingsSection, label: "Notifications", icon: Bell },
  { key: "exports" as SettingsSection, label: "Export Targets", icon: Upload },
  { key: "workspace" as SettingsSection, label: "Workspace", icon: Globe },
];

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("accounts");
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [slackChannel, setSlackChannel] = useState("#dex-updates");
  const [emailDigest, setEmailDigest] = useState(true);
  const [selectedCRM, setSelectedCRM] = useState("salesforce");
  const [darkMode, setDarkMode] = useState(false);

  const toggleAccountConnection = (accountId: string) => {
    setAccounts(accounts.map(account => 
      account.id === accountId 
        ? { ...account, isConnected: !account.isConnected }
        : account
    ));
  };

  const toggleAccountScope = (accountId: string) => {
    setAccounts(accounts.map(account => 
      account.id === accountId 
        ? { ...account, scopeEnabled: !account.scopeEnabled }
        : account
    ));
  };

  const renderAccountsSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Connected Accounts</h2>
      <div className="space-y-4">
        {accounts.map((account) => (
          <div key={account.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Settings size={16} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-medium">{account.name}</h3>
                {account.email && (
                  <p className="text-sm text-gray-600">{account.email}</p>
                )}
                {account.isConnected && account.lastSync && (
                  <p className="text-xs text-gray-500">Last sync: {account.lastSync}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {account.isConnected && (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={account.scopeEnabled}
                    onChange={() => toggleAccountScope(account.id)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">Full access</span>
                </label>
              )}
              
              <button
                onClick={() => toggleAccountConnection(account.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  account.isConnected
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {account.isConnected ? (
                  <>
                    <X size={14} strokeWidth={1.5} />
                    Disconnect
                  </>
                ) : (
                  <>
                    <Link2 size={14} strokeWidth={1.5} />
                    Connect
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Notification Settings</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium">Slack Notifications</h3>
            <p className="text-sm text-gray-600">Receive updates in your Slack workspace</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={slackChannel}
              onChange={(e) => setSlackChannel(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="#dex-updates">#dex-updates</option>
              <option value="#general">#general</option>
              <option value="#notifications">#notifications</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium">Email Digest</h3>
            <p className="text-sm text-gray-600">Daily summary of your activity</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={emailDigest}
              onChange={(e) => setEmailDigest(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderExportsSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Export Targets</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium">CRM Integration</h3>
            <p className="text-sm text-gray-600">Export contacts and interactions to your CRM</p>
          </div>
          <select
            value={selectedCRM}
            onChange={(e) => setSelectedCRM(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="salesforce">Salesforce</option>
            <option value="hubspot">HubSpot</option>
            <option value="pipedrive">Pipedrive</option>
            <option value="none">None</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium">Notion Database</h3>
            <p className="text-sm text-gray-600">Sync meeting notes to Notion</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Link2 size={14} strokeWidth={1.5} />
            Select Database
          </button>
        </div>
      </div>
    </div>
  );

  const renderWorkspaceSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Workspace Settings</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium">Timezone</h3>
            <p className="text-sm text-gray-600">Set your local timezone for scheduling</p>
          </div>
          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Pacific Time (PT)</option>
            <option>Eastern Time (ET)</option>
            <option>Central Time (CT)</option>
            <option>Mountain Time (MT)</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium">Date Format</h3>
            <p className="text-sm text-gray-600">Choose your preferred date format</p>
          </div>
          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>MM/DD/YYYY</option>
            <option>DD/MM/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium">Dark Mode</h3>
            <p className="text-sm text-gray-600">Toggle between light and dark themes</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
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
      case "exports":
        return renderExportsSection();
      case "workspace":
        return renderWorkspaceSection();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      
      <div className="flex gap-8">
        {/* Sub Navigation */}
        <div className="w-64 space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === section.key
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={16} strokeWidth={1.5} />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
} 