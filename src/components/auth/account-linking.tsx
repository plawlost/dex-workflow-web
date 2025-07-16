"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { SiGoogle, SiSlack, SiNotion } from "react-icons/si";
import { Button } from "~/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "~/components/ui/dialog";

interface LinkedAccount {
  id: string;
  provider: string;
  providerAccountId: string;
}

interface AccountLinkingProps {
  linkedAccounts: LinkedAccount[];
  onUnlink: (accountId: string) => Promise<void>;
}

const providerConfig = {
  google: {
    name: "Google",
    color: "bg-blue-500",
    icon: <SiGoogle size={20} color="#4285F4" />
  },
  slack: {
    name: "Slack",
    color: "bg-purple-500", 
    icon: <SiSlack size={20} color="#4A154B" />
  },
  notion: {
    name: "Notion",
    color: "bg-gray-800",
    icon: <SiNotion size={20} />
  }
};

export function AccountLinking({ linkedAccounts, onUnlink }: AccountLinkingProps) {
  const [isLinking, setIsLinking] = useState<string | null>(null);
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null);

  const linkedProviders = linkedAccounts.map(acc => acc.provider);
  const availableProviders = Object.keys(providerConfig).filter(
    provider => !linkedProviders.includes(provider)
  );

  const handleLinkProvider = async (provider: string) => {
    setIsLinking(provider);
    try {
      await signIn(provider, { callbackUrl: "/settings?tab=accounts" });
    } catch (error) {
      console.error("Link provider error:", error);
    } finally {
      setIsLinking(null);
    }
  };

  const handleUnlinkProvider = async (accountId: string) => {
    setUnlinkingId(accountId);
    try {
      await onUnlink(accountId);
    } catch (error) {
      console.error("Unlink provider error:", error);
    } finally {
      setUnlinkingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Linked Accounts */}
      <div>
        <h3 className="text-title font-medium text-deep-gray mb-4">
          Connected Accounts
        </h3>
        <div className="space-y-3">
          {linkedAccounts.map((account) => {
            const config = providerConfig[account.provider as keyof typeof providerConfig];
            const canUnlink = linkedAccounts.length > 1;
            
            return (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border border-white/20 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${config.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                    {config.icon}
                  </div>
                  <div>
                    <p className="text-body font-medium text-deep-gray">
                      {config.name}
                    </p>
                    <p className="text-caption text-slate-gray">
                      Connected
                    </p>
                  </div>
                </div>
                
                {canUnlink && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-error-red hover:text-error-red hover:bg-error-red/10"
                      >
                        Disconnect
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-surface border-white/20">
                      <DialogHeader>
                        <DialogTitle>Disconnect {config.name}?</DialogTitle>
                        <DialogDescription>
                          You won't be able to sign in with {config.name} anymore. 
                          You can reconnect it later if needed.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex gap-3 mt-6">
                        <Button
                          variant="destructive"
                          onClick={() => handleUnlinkProvider(account.id)}
                          disabled={unlinkingId === account.id}
                          className="flex-1"
                        >
                          {unlinkingId === account.id ? "Disconnecting..." : "Disconnect"}
                        </Button>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1">
                            Cancel
                          </Button>
                        </DialogTrigger>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Providers */}
      {availableProviders.length > 0 && (
        <div>
          <h3 className="text-title font-medium text-deep-gray mb-4">
            Connect More Accounts
          </h3>
          <div className="space-y-3">
            {availableProviders.map((provider) => {
              const config = providerConfig[provider as keyof typeof providerConfig];
              
              return (
                <div
                  key={provider}
                  className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-sm border border-white/10 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${config.color} rounded-lg flex items-center justify-center text-white text-lg opacity-60`}>
                      {config.icon}
                    </div>
                    <div>
                      <p className="text-body font-medium text-deep-gray">
                        {config.name}
                      </p>
                      <p className="text-caption text-slate-gray">
                        Not connected
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLinkProvider(provider)}
                    disabled={isLinking === provider}
                    className="bg-white/80 hover:bg-white/90"
                  >
                    {isLinking === provider ? "Connecting..." : "Connect"}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}