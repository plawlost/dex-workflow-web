import { DashboardLayout } from "../_components/dashboard-layout";

export default function HelpPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Help & Support</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-lg font-medium mb-4">Getting Started</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>• Connect your accounts to start monitoring conversations</p>
              <p>• Configure automation rules to save time</p>
              <p>• Use the timeline to review daily interactions</p>
              <p>• Export important contacts to your CRM</p>
            </div>
          </div>
          
          <div className="card p-6">
            <h2 className="text-lg font-medium mb-4">Keyboard Shortcuts</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Global search</span>
                <code className="bg-gray-100 px-2 py-1 rounded">⌘K</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Show shortcuts</span>
                <code className="bg-gray-100 px-2 py-1 rounded">⌘/</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Export focused card</span>
                <code className="bg-gray-100 px-2 py-1 rounded">E</code>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <h2 className="text-lg font-medium mb-4">Contact Support</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>Need help? We're here for you.</p>
              <p>Email: support@dex.ai</p>
              <p>Response time: < 2 hours</p>
            </div>
          </div>
          
          <div className="card p-6">
            <h2 className="text-lg font-medium mb-4">Resources</h2>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-blue-600 hover:text-blue-800">
                Documentation
              </a>
              <a href="#" className="block text-blue-600 hover:text-blue-800">
                Video Tutorials
              </a>
              <a href="#" className="block text-blue-600 hover:text-blue-800">
                API Reference
              </a>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 