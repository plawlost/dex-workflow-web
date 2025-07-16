"use client";

import { useState } from "react";
import { useAuth } from "~/contexts/auth-context";
import { AuthService } from "~/lib/auth-service";
import { DashboardLayout } from "~/app/_components/dashboard-layout";
import { Button } from "~/components/ui/button";

const connectionServices = [
  {
    id: "slack",
    name: "Slack",
    description: "Connect your Slack workspace for team communication",
    icon: "💬",
    color: "bg-purple-500",
    getConnection: () => AuthService.getSlackConnection(),
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Connect Gmail for email automation and management",
    icon: "📧",
    color: "bg-red-500",
    getConnection: () => AuthService.getGmailConnection(),
  },
  {
    id: "notion",
    name: "Notion",
    description: "Connect Notion for document and database management",
    icon: "📝",
    color: "bg-gray-800",
    getConnection: () => AuthService.getNotionConnection(),
  },
];

export default function AccountsPage() {
  const { user, loading } = useAuth();
  const [connectingService, setConnectingService] = useState<string | null>(null);

  const handleConnect = async (service: typeof connectionServices[0]) => {
    if (!user) return;
    
    setConnectingService(service.id);
    try {
      // The connection method now handles the redirect directly
      await service.getConnection();
    } catch (error) {
      console.error(`Failed to connect ${service.name}:`, error);
      alert(`Failed to connect ${service.name}. Please try again.`);
    } finally {
      setConnectingService(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-stone-gray border-t-accent-blue rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-gray">Please sign in to manage your accounts.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-display font-medium text-deep-gray mb-2">
            Connected Accounts
          </h1>
          <p className="text-caption text-slate-gray">
            Connect your external services to enable workflow automation.
          </p>
        </div>

        {/* User Info */}
        <div className="glass-surface rounded-xl p-6 border border-white/20 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-medium text-lg">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-title font-medium text-deep-gray">
                {user.name}
              </h3>
              <p className="text-caption text-slate-gray">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Connection Services */}
        <div className="glass-surface rounded-xl p-6 border border-white/20">
          <h2 className="text-title font-medium text-deep-gray mb-6">
            Available Connections
          </h2>
          
          <div className="space-y-4">
            {connectionServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/60 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-body font-medium text-deep-gray">
                      {service.name}
                    </h3>
                    <p className="text-caption text-slate-gray">
                      {service.description}
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleConnect(service)}
                  disabled={connectingService === service.id}
                  className="bg-white/80 hover:bg-white/90 text-deep-gray border border-white/20"
                >
                  {connectingService === service.id ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-deep-gray border-t-transparent rounded-full animate-spin" />
                      Connecting...
                    </div>
                  ) : (
                    "Connect"
                  )}
                </Button>
              </div>
            ))}
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-accent-blue/5 border border-accent-blue/20 rounded-lg">
            <h4 className="text-body font-medium text-deep-gray mb-2">
              How it works
            </h4>
            <p className="text-caption text-slate-gray">
              Click "Connect" to authorize Dex to access your accounts. You'll be redirected to the service's 
              authorization page where you can grant the necessary permissions.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}