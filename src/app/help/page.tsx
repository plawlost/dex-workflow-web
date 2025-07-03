import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { DashboardLayout } from "../_components/dashboard-layout";

export default function HelpPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Help & Support</CardTitle>
            <CardDescription>
              Find answers to your questions and get in touch with our team.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>• Connect your accounts to start monitoring conversations</p>
                <p>• Configure automation rules to save time</p>
                <p>• Use the timeline to review daily interactions</p>
                <p>• Export important contacts to your CRM</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Keyboard Shortcuts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Global search</span>
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span>Show shortcuts</span>
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>/
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span>Export focused card</span>
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    E
                  </kbd>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Need help? We're here for you.</p>
                <p>Email: support@dex.ai</p>
                <p>Response time: &lt; 2 hours</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a href="#" className="block text-primary hover:underline">
                  Documentation
                </a>
                <a href="#" className="block text-primary hover:underline">
                  Video Tutorials
                </a>
                <a href="#" className="block text-primary hover:underline">
                  API Reference
                </a>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 