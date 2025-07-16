"use client";

import { useAuth } from "~/contexts/auth-context";
import { DashboardLayout } from "./_components/dashboard-layout";
import { TimelineView } from "./_components/timeline-view";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic-gray/50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-stone-gray border-t-accent-blue rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-cosmic-gray/50 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          <div className="w-20 h-20 bg-accent-blue rounded-xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          
          <h1 className="text-hero font-light text-deep-gray mb-4">
            Welcome to Dex
          </h1>
          <p className="text-body text-slate-gray mb-8 max-w-lg mx-auto">
            Autonomous Workflow Intelligence. Connect your tools, automate your processes, 
            and let AI handle the complexity.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="h-12 px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="h-12 px-8 bg-white/80 hover:bg-white/90">
                Sign In
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-caption text-stone-gray">
              Create your account to connect with Slack, Gmail, and Notion
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <TimelineView />
    </DashboardLayout>
  );
}
