"use client";

import { useEffect, useState } from "react";
import { useAuth } from "~/contexts/auth-context";
import { backendAPI, type DashboardOverviewResponse } from "~/lib/api";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { 
  ChartIcon, 
  ConversationIcon, 
  UsersIcon, 
  DocumentIcon,
  SlackIcon,
  GmailIcon,
  NotionIcon
} from "~/components/icons";

export function DashboardOverview() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardOverviewResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pushingToCRM, setPushingToCRM] = useState(false);

  useEffect(() => {
    if (!user?.backendToken) return;

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const response = await backendAPI.getDashboardOverview(user.backendToken!);
        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError("Failed to load dashboard data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.backendToken]);

  const handlePushToCRM = async () => {
    if (!user?.backendToken || !user?.email) return;

    try {
      setPushingToCRM(true);
      const response = await backendAPI.pushContactsToCRM(user.backendToken!, user.email);
      if (response.success) {
        alert("Contacts successfully pushed to CRM!");
      } else {
        alert("Failed to push contacts to CRM: " + (response.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error pushing contacts to CRM: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setPushingToCRM(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-stone-gray border-t-accent-blue rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading dashboard</p>
          <p className="text-stone-gray text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-stone-gray">No dashboard data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-display">
            {getGreeting()}
          </h1>
          <p className="text-title text-slate-gray">
            You have <span className="font-medium text-accent-blue">{dashboardData.stats.totalSummaries} summaries</span> ready for review.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-panel flex items-center gap-2 px-3 py-2 rounded-lg text-caption">
            <div className="status-dot success pulse"></div>
            AI monitoring active
          </div>
          <Button 
            onClick={handlePushToCRM}
            disabled={pushingToCRM}
            className="pure-button"
          >
            {pushingToCRM ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Pushing...
              </>
            ) : (
              "Push to CRM"
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-4 overflow-x-auto">
        <StatCard
          title="Sources"
          value={dashboardData.stats.totalSources}
          icon={<ChartIcon size={24} className="text-accent-blue" />}
        />
        <StatCard
          title="Conversations"
          value={dashboardData.stats.totalConversations}
          subtitle={`${dashboardData.stats.recentConversations} recent`}
          icon={<ConversationIcon size={24} className="text-success-green" />}
        />
        <StatCard
          title="Contacts"
          value={dashboardData.stats.totalContacts}
          subtitle={`${dashboardData.stats.newContacts} new`}
          icon={<UsersIcon size={24} className="text-purple-500" />}
        />
        <StatCard
          title="Summaries"
          value={dashboardData.stats.totalSummaries}
          subtitle={`${dashboardData.stats.pendingSummaries} pending`}
          icon={<DocumentIcon size={24} className="text-warning-amber" />}
        />
      </div>

      {/* Connected Platforms */}
      <div className="pure-card">
        <h2 className="text-headline mb-6">Connected Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-title text-slate-gray mb-3">Slack Workspaces</h3>
            <div className="space-y-2">
              {dashboardData.connectedPlatforms.slack.length > 0 ? (
                dashboardData.connectedPlatforms.slack.map((workspace) => (
                  <div key={workspace.id} className="flex items-center justify-between p-3 bg-whisper-gray rounded-lg">
                    <div className="flex items-center gap-3">
                      <SlackIcon size={16} className="text-purple-500" />
                      <span className="text-body">{workspace.teamName}</span>
                    </div>
                    <span className="text-caption text-stone-gray">
                      {formatTimeAgo(workspace.installedAt)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-caption text-stone-gray">No Slack workspaces connected</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-title text-slate-gray mb-3">Gmail Accounts</h3>
            <div className="space-y-2">
              {dashboardData.connectedPlatforms.gmail.length > 0 ? (
                dashboardData.connectedPlatforms.gmail.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-3 bg-whisper-gray rounded-lg">
                    <div className="flex items-center gap-3">
                      <GmailIcon size={16} className="text-blue-500" />
                      <span className="text-body">{account.email}</span>
                    </div>
                    <span className="text-caption text-stone-gray">
                      {formatTimeAgo(account.connectedAt)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-caption text-stone-gray">No Gmail accounts connected</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-title text-slate-gray mb-3">Notion Workspaces</h3>
            <div className="space-y-2">
              {dashboardData.connectedPlatforms.notion.length > 0 ? (
                dashboardData.connectedPlatforms.notion.map((workspace) => (
                  <div key={workspace.id} className="flex items-center justify-between p-3 bg-whisper-gray rounded-lg">
                    <div className="flex items-center gap-3">
                      <NotionIcon size={16} className="text-gray-800" />
                      <span className="text-body">{workspace.workspaceName}</span>
                    </div>
                    <span className="text-caption text-stone-gray">
                      {formatTimeAgo(workspace.connectedAt)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-caption text-stone-gray">No Notion workspaces connected</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Summaries */}
      <div className="pure-card">
        <h2 className="text-headline mb-6">Recent Summaries</h2>
        <div className="space-y-4">
          {dashboardData.summaries.length > 0 ? (
            dashboardData.summaries.slice(0, 5).map((summary) => (
              <div key={summary.id} className="p-4 bg-whisper-gray rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-title font-medium">{summary.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        summary.platform === "SLACK" 
                          ? "bg-purple-100 text-purple-700" 
                          : "bg-blue-100 text-blue-700"
                      )}>
                        {summary.platform}
                      </span>
                      <span className="text-caption text-stone-gray">
                        {summary.participants.length} participants
                      </span>
                      <span className="text-caption text-stone-gray">•</span>
                      <span className="text-caption text-stone-gray">
                        {formatTimeAgo(summary.lastActivityAt)}
                      </span>
                    </div>
                  </div>
                  {summary.analysis.hasActionItems && (
                    <div className="flex items-center gap-1 text-warning-amber">
                      <div className="w-2 h-2 bg-warning-amber rounded-full" />
                      <span className="text-xs">Action items</span>
                    </div>
                  )}
                </div>
                <p className="text-body text-slate-gray leading-relaxed">
                  {summary.summary}
                </p>
                {summary.participants.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-caption text-stone-gray">Participants:</span>
                    <div className="flex flex-wrap gap-1">
                      {summary.participants.slice(0, 3).map((participant, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-cosmic-gray rounded">
                          {participant.name}
                        </span>
                      ))}
                      {summary.participants.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-cosmic-gray rounded">
                          +{summary.participants.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-stone-gray text-center py-8">No summaries available</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, subtitle, icon }: StatCardProps) {
  return (
    <div className="pure-card min-w-[180px] flex-shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-caption text-stone-gray font-medium">{title}</p>
          <p className="text-headline font-medium text-deep-gray">{value}</p>
          {subtitle && (
            <p className="text-caption text-stone-gray">{subtitle}</p>
          )}
        </div>
        <div className="opacity-80">{icon}</div>
      </div>
    </div>
  );
} 