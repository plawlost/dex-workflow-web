"use client";

import { useState, useEffect } from "react";
import { useAuth } from "~/contexts/auth-context";
import { SiSlack, SiGmail, SiNotion, SiGoogle } from "react-icons/si";
import { DashboardLayout } from "~/app/_components/dashboard-layout";
import { Button } from "~/components/ui/button";

interface SlackWorkspace {
  id: string;
  teamId: string;
  isActive: boolean;
  teamName: string;
  installedAt: Date;
}

interface GmailAccount {
  [key: string]: any; // Ignoring contents as requested
}

interface NotionAccount {
  [key: string]: any; // Ignoring contents as requested
}

interface BackendUserData {
  id: string;
  updatedAt: Date;
  name: string | null;
  createdAt: Date;
  email: string;
  emailVerified: boolean;
  slackWorkspaces: SlackWorkspace[];
  gmailAccounts: GmailAccount[];
  notionAccounts: NotionAccount[];
}

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
  const [disconnectingService, setDisconnectingService] = useState<string | null>(null);
  const [showDisconnectModal, setShowDisconnectModal] = useState<string | null>(null);
  const [backendUserData, setBackendUserData] = useState<BackendUserData | null>(null);
  const [fetchingUserData, setFetchingUserData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      setFetchingUserData(true);
      setFetchError(null);

      // Get the backend access token
      const backendToken = JSON.parse(localStorage.getItem('dex_backend_token') || '{}').accessToken;
      if (!backendToken) {
        throw new Error('No backend access token found. Please sign in again.');
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://dex-backend-main.vercel.app';
      const response = await fetch(`${backendUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${backendToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      const userData = responseData.user || responseData;
      setBackendUserData(userData);
      console.log('Backend user data:', userData);

    } catch (error) {
      console.error('Error fetching user data:', error);
      setFetchError(error instanceof Error ? error.message : 'Failed to fetch user data');
    } finally {
      setFetchingUserData(false);
    }
  };

  useEffect(() => {
    if (user && !loading) {
      fetchUserData();
    }
  }, [user, loading]);

  const isServiceConnected = (serviceId: string): boolean => {
    if (!backendUserData) return false;
    
    // Check if the respective array has elements
    switch (serviceId) {
      case 'slack':
        return backendUserData.slackWorkspaces.length > 0;
      case 'gmail':
        return backendUserData.gmailAccounts.length > 0;
      case 'notion':
        return backendUserData.notionAccounts.length > 0;
      default:
        return false;
    }
  };

  const getConnectedAccountInfo = (serviceId: string) => {
    if (!backendUserData) return null;
    
    switch (serviceId) {
      case 'slack':
        const slack = backendUserData.slackWorkspaces[0];
        return slack ? {
          name: slack.teamName,
          connectedAt: slack.installedAt,
          count: backendUserData.slackWorkspaces.length
        } : null;
      case 'gmail':
        return backendUserData.gmailAccounts.length > 0 ? {
          count: backendUserData.gmailAccounts.length,
          connectedAt: null
        } : null;
      case 'notion':
        return backendUserData.notionAccounts.length > 0 ? {
          count: backendUserData.notionAccounts.length,
          connectedAt: null
        } : null;
      default:
        return null;
    }
  };

  const handleConnect = async (service: typeof connectionServices[0]) => {
    if (!user) return;
    
    const isReconnecting = isServiceConnected(service.id);
    setConnectingService(service.id);
    
    try {
      // Get the backend access token
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

      // Create a form to POST with Authorization header (for OAuth redirect)
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://dex-backend-main.vercel.app';
      const authUrl = `${backendUrl}${endpoint}`;
      
      console.log(`${isReconnecting ? 'Reconnecting to' : 'Connecting to'} ${service.name} via:`, authUrl);
      
      // For OAuth flows, we still need to redirect with token in URL since we can't set headers on redirects
      // The backend engineer can update this if they prefer a different approach for OAuth flows
      window.location.href = `${authUrl}?token=${backendToken}`;
      
    } catch (error) {
      console.error(`Failed to ${isReconnecting ? 'reconnect' : 'connect'} ${service.name}:`, error);
      alert(`Failed to ${isReconnecting ? 'reconnect' : 'connect'} ${service.name}. Please try again.`);
      setConnectingService(null);
    }
    // Note: Don't set connectingService to null here since we're redirecting
  };

  const handleDisconnectSpecific = async (serviceId: string, workspaceId?: string) => {
    if (!user) return;
    
    setDisconnectingService(serviceId);
    
    try {
      // Get the backend access token
      const backendToken = JSON.parse(localStorage.getItem('dex_backend_token') || '{}').accessToken;
      if (!backendToken) {
        throw new Error('No backend access token found. Please sign in again.');
      }

      // Map service IDs to remove endpoints
      const removeEndpointMap = {
        slack: '/auth/slack/remove',
        gmail: '/auth/gmail/remove',
        notion: '/auth/notion/remove'
      };

      const endpoint = removeEndpointMap[serviceId as keyof typeof removeEndpointMap];
      if (!endpoint) {
        throw new Error(`Unknown service: ${serviceId}`);
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://dex-backend-main.vercel.app';
      
      console.log(`Disconnecting ${serviceId}${workspaceId ? ` workspace ${workspaceId}` : ' all accounts'}...`);
      
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${backendToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workspaceId ? { workspaceId } : {})
      });

      if (!response.ok) {
        throw new Error(`Failed to disconnect: ${response.status} ${response.statusText}`);
      }

      console.log(`Successfully disconnected ${serviceId}${workspaceId ? ` workspace ${workspaceId}` : ' all accounts'}`);
      
      // Refresh user data to reflect the changes
      await fetchUserData();
      setShowDisconnectModal(null);
      
    } catch (error) {
      console.error(`Failed to disconnect ${serviceId}:`, error);
      alert(`Failed to disconnect ${serviceId}. Please try again.`);
    } finally {
      setDisconnectingService(null);
    }
  };

  const renderDisconnectModal = () => {
    if (!showDisconnectModal || !backendUserData) return null;

    const service = connectionServices.find(s => s.id === showDisconnectModal);
    if (!service) return null;

    let accounts: any[] = [];
    let accountType = '';

    switch (showDisconnectModal) {
      case 'slack':
        accounts = backendUserData.slackWorkspaces;
        accountType = 'workspace';
        break;
      case 'gmail':
        accounts = backendUserData.gmailAccounts;
        accountType = 'account';
        break;
      case 'notion':
        accounts = backendUserData.notionAccounts;
        accountType = 'workspace';
        break;
    }

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="glass-surface rounded-xl p-6 border border-white/20 max-w-md w-full mx-4">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 ${service.color} rounded-lg flex items-center justify-center text-white`}>
              {service.icon}
            </div>
            <div>
              <h3 className="text-title font-medium text-deep-gray">
                Disconnect {service.name}
              </h3>
              <p className="text-caption text-slate-gray">
                Choose which {accountType}s to disconnect
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {accounts.map((account, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/40 rounded-lg border border-white/10">
                <div>
                  <p className="text-body font-medium text-deep-gray">
                    {showDisconnectModal === 'slack' ? account.teamName : 
                     showDisconnectModal === 'gmail' ? `Gmail Account ${index + 1}` :
                     `Notion Workspace ${index + 1}`}
                  </p>
                  {showDisconnectModal === 'slack' && (
                    <p className="text-caption text-slate-gray">
                      Team ID: {account.teamId}
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => handleDisconnectSpecific(showDisconnectModal, 
                    showDisconnectModal === 'slack' ? account.teamId :
                    showDisconnectModal === 'notion' ? account.id : undefined
                  )}
                  disabled={disconnectingService === showDisconnectModal}
                  variant="outline"
                  size="sm"
                  className="bg-red-50/80 hover:bg-red-100/80 text-red-600 border border-red-200/50 text-xs px-3 py-1 h-8"
                >
                  {disconnectingService === showDisconnectModal ? (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      Removing...
                    </div>
                  ) : (
                    "Remove"
                  )}
                </Button>
              </div>
            ))}

            {/* Disconnect All Option */}
            <div className="border-t border-white/10 pt-3">
              <div className="flex items-center justify-between p-3 bg-red-50/40 rounded-lg border border-red-200/30">
                <div>
                  <p className="text-body font-medium text-red-700">
                    Disconnect All {service.name} {accountType}s
                  </p>
                  <p className="text-caption text-red-600">
                    This will remove all connected {accountType}s
                  </p>
                </div>
                <Button
                  onClick={() => handleDisconnectSpecific(showDisconnectModal)}
                  disabled={disconnectingService === showDisconnectModal}
                  variant="outline"
                  size="sm"
                  className="bg-red-100/80 hover:bg-red-200/80 text-red-700 border border-red-300/50 text-xs px-3 py-1 h-8"
                >
                  {disconnectingService === showDisconnectModal ? (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 border-2 border-red-700 border-t-transparent rounded-full animate-spin" />
                      Disconnecting...
                    </div>
                  ) : (
                    "Disconnect All"
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setShowDisconnectModal(null)}
              variant="outline"
              className="flex-1 bg-white/60 hover:bg-white/80 text-deep-gray border border-white/30"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
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

        {/* Error Message */}
        {fetchError && (
          <div className="glass-surface rounded-xl p-6 border border-red-200 bg-red-50/50 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-500">⚠️</span>
              <h3 className="text-body font-medium text-red-700">Error Loading Account Data</h3>
            </div>
            <p className="text-caption text-red-600 mb-3">{fetchError}</p>
            <Button 
              onClick={fetchUserData} 
              disabled={fetchingUserData}
              className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-200"
            >
              {fetchingUserData ? 'Retrying...' : 'Retry'}
            </Button>
          </div>
        )}

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
                  {backendUserData?.email || user.email}
                </p>
                <p className="text-caption text-slate-gray">
                  {backendUserData?.name || user.name}
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-title font-medium text-deep-gray">
              Available Connections
            </h2>
            {fetchingUserData && (
              <div className="flex items-center gap-2 text-slate-gray">
                <div className="w-4 h-4 border-2 border-slate-gray border-t-transparent rounded-full animate-spin" />
                <span className="text-caption">Loading...</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {connectionServices.map((service) => {
              const isConnected = isServiceConnected(service.id);
              const connectedAccount = getConnectedAccountInfo(service.id);
              
              return (
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
                                             {isConnected && connectedAccount?.name && (
                         <p className="text-xs text-success-green mt-1">
                           Connected: {connectedAccount.name}
                         </p>
                       )}
                       {isConnected && connectedAccount?.count && (
                         <p className="text-xs text-success-green mt-1">
                           {connectedAccount.count} account{connectedAccount.count > 1 ? 's' : ''} connected
                         </p>
                       )}
                       {isConnected && connectedAccount?.connectedAt && (
                         <p className="text-xs text-slate-gray">
                           Since: {new Date(connectedAccount.connectedAt).toLocaleDateString()}
                         </p>
                       )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {isConnected ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-success-green rounded-full"></div>
                          <span className="text-caption text-success-green font-medium">Connected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleConnect(service)}
                            disabled={connectingService === service.id || disconnectingService === service.id || fetchingUserData}
                            variant="outline"
                            size="sm"
                            className="bg-white/60 hover:bg-white/80 text-deep-gray border border-white/30 text-xs px-3 py-1 h-8"
                          >
                            {connectingService === service.id ? (
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 border-2 border-deep-gray border-t-transparent rounded-full animate-spin" />
                                Reconnecting...
                              </div>
                            ) : (
                              "Reconnect"
                            )}
                          </Button>
                          <Button
                            onClick={() => setShowDisconnectModal(service.id)}
                            disabled={connectingService === service.id || disconnectingService === service.id || fetchingUserData}
                            variant="outline"
                            size="sm"
                            className="bg-red-50/80 hover:bg-red-100/80 text-red-600 border border-red-200/50 text-xs px-3 py-1 h-8"
                          >
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleConnect(service)}
                        disabled={connectingService === service.id || fetchingUserData}
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
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-accent-blue/5 border border-accent-blue/20 rounded-lg">
            <h4 className="text-body font-medium text-deep-gray mb-2">
              How it works
            </h4>
            <ul className="text-caption text-slate-gray space-y-1">
              <li>• <strong>Connect:</strong> Authorize Dex to access your accounts via OAuth</li>
              <li>• <strong>Reconnect:</strong> Update permissions or switch to a different account</li>
              <li>• <strong>Disconnect:</strong> Remove all connected accounts for a service</li>
            </ul>
          </div>

          {/* Debug Info */}
          {backendUserData && (
            <div className="mt-4 p-3 bg-gray-100/50 border border-gray-200 rounded-lg">
              <details>
                <summary className="text-xs text-gray-600 cursor-pointer">Debug: Backend User Data</summary>
                <pre className="text-xs text-gray-500 mt-2 overflow-auto">
                  {JSON.stringify(backendUserData, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>

        {/* Disconnect Modal */}
        {renderDisconnectModal()}
      </div>
    </DashboardLayout>
  );
}