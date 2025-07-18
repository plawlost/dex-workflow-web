"use client";

import { useState } from "react";
import { useAuth } from "~/contexts/auth-context";
import { SiSlack, SiGmail, SiNotion, SiGoogle } from "react-icons/si";
import { DashboardLayout } from "~/app/_components/dashboard-layout";
import { Button } from "~/components/ui/button";

const connectionServices = [
  {
    id: "slack",
    name: "Slack",
    description: "Connect your Slack workspace for team communication",
    icon: <SiSlack size={24} color="#4A154B" />,
    color: "bg-purple-500",
    status: "available",
  },
  {
    id: "gmail",
    name: "Gmail", 
    description: "Connect Gmail for email automation and management",
    icon: <SiGmail size={24} color="#D44638" />,
    color: "bg-red-500",
    status: "available",
  },
  {
    id: "notion",
    name: "Notion",
    description: "Connect Notion for document and database management", 
    icon: <SiNotion size={24} />,
    color: "bg-gray-800",
    status: "available",
  },
];

export default function AccountsPage() {
  const { user, loading, refreshBackendToken } = useAuth();
  const [connectingService, setConnectingService] = useState<string | null>(null);

  const handleConnect = async (service: typeof connectionServices[0]) => {
    if (!user) return;
    
    setConnectingService(service.id);
    try {
      // Get the backend access token (not Supabase token)
      const backendToken = JSON.parse(localStorage.getItem('dex_backend_token') || '{}').accessToken;
      if (!backendToken) {
        throw new Error('No backend access token found. Please sign in again.');
      }

      // Map service IDs to backend endpoints
      const endpointMap = {
        slack: '/auth/slack',
        gmail: '/auth/gmail/connect', 
        notion: '/auth/notion'
      };

      const endpoint = endpointMap[service.id as keyof typeof endpointMap];
      if (!endpoint) {
        throw new Error(`Unknown service: ${service.id}`);
      }

      // Make request to your backend with backend token as query param
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://dex-backend-main.vercel.app';
      const authUrl = `${backendUrl}${endpoint}?token=${backendToken}`;
      
      console.log(`Connecting to ${service.name} via:`, authUrl);
      
      // Redirect to the OAuth flow
      window.location.href = authUrl;
      
    } catch (error) {
      console.error(`Failed to connect ${service.name}:`, error);
      alert(`Failed to connect ${service.name}. Please try again.`);
      setConnectingService(null);
    }
    // Note: Don't set connectingService to null here since we're redirecting
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

        {/* Connected Google Account */}
        <div className="glass-surface rounded-xl p-6 border border-white/20 mb-6">
          <h2 className="text-title font-medium text-deep-gray mb-4">
            Primary Account
          </h2>
          <div className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-sm border border-white/10 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                <SiGoogle size={24} />
              </div>
              <div>
                <h3 className="text-body font-medium text-deep-gray">
                  Google Account
                </h3>
                <p className="text-caption text-slate-gray">
                  {user.email}
                </p>
                <p className="text-caption text-slate-gray">
                  {user.name}
                </p>
                {/* Debug info */}
                <p className="text-xs text-gray-500 mt-1">
                  Backend Token: {user.backendToken ? '✅ Available' : '❌ Missing'}
                </p>
                {!user.backendToken && (
                  <button 
                    onClick={refreshBackendToken}
                    className="text-xs text-blue-500 hover:text-blue-700 mt-1"
                  >
                    🔄 Refresh Token
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-green rounded-full"></div>
              <span className="text-caption text-success-green font-medium">Connected</span>
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