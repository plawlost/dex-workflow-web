"use client";

import { useState } from "react";
import { SiN8N, SiSlack, SiSupabase } from "react-icons/si";
import { CheckCircle } from "@phosphor-icons/react";
import { DashboardLayout } from "~/app/_components/dashboard-layout";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface IntegrationConfig {
  n8nServerUrl: string;
  slackAccessToken: string;
  supabaseAuthToken: string;
}

export default function IntegrationsPage() {
  const [config, setConfig] = useState<IntegrationConfig>({
    n8nServerUrl: "",
    slackAccessToken: "",
    supabaseAuthToken: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here you would save to your backend/database
      // For now, just simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof IntegrationConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-display font-medium text-deep-gray mb-2">
            Integration Settings
          </h1>
          <p className="text-caption text-slate-gray">
            Configure your backend services and API tokens.
          </p>
        </div>

        <div className="glass-surface rounded-xl p-6 border border-white/20 space-y-6">
          {/* N8N Server */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <SiN8N size={20} color="white" />
              </div>
              <div>
                <h3 className="text-title font-medium text-deep-gray">
                  N8N Workflow Server
                </h3>
                <p className="text-caption text-slate-gray">
                  Your N8N server endpoint URL
                </p>
              </div>
            </div>
            <Input
              placeholder="https://your-n8n-server.com"
              value={config.n8nServerUrl}
              onChange={(e) => handleInputChange("n8nServerUrl", e.target.value)}
              className="bg-white/80 border-white/20"
            />
          </div>

          {/* Slack Token */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <SiSlack size={20} color="#4A154B" />
              </div>
              <div>
                <h3 className="text-title font-medium text-deep-gray">
                  Slack Access Token
                </h3>
                <p className="text-caption text-slate-gray">
                  Bot token for Slack API access
                </p>
              </div>
            </div>
            <Input
              type="password"
              placeholder="xoxb-your-slack-bot-token"
              value={config.slackAccessToken}
              onChange={(e) => handleInputChange("slackAccessToken", e.target.value)}
              className="bg-white/80 border-white/20"
            />
          </div>

          {/* Supabase Token */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <SiSupabase size={20} color="#3ECF8E" />
              </div>
              <div>
                <h3 className="text-title font-medium text-deep-gray">
                  Supabase Auth Token
                </h3>
                <p className="text-caption text-slate-gray">
                  Service role key for Supabase
                </p>
              </div>
            </div>
            <Input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={config.supabaseAuthToken}
              onChange={(e) => handleInputChange("supabaseAuthToken", e.target.value)}
              className="bg-white/80 border-white/20"
            />
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-white/10">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full h-12"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : saved ? (
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} weight="fill" />
                  Saved Successfully
                </div>
              ) : (
                "Save Configuration"
              )}
            </Button>
          </div>

          {/* Help Text */}
          <div className="bg-accent-blue/5 border border-accent-blue/20 rounded-lg p-4">
            <h4 className="text-body font-medium text-deep-gray mb-2">
              Quick Setup Guide
            </h4>
            <ul className="text-caption text-slate-gray space-y-1">
              <li>• N8N: Deploy your workflow server and add the URL</li>
              <li>• Slack: Create a bot app and copy the bot token</li>
              <li>• Supabase: Get your service role key from project settings</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}