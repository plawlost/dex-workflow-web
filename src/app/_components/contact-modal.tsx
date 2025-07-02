"use client";

import { useState } from "react";
import { X, ExternalLink, Bell, Share, Linkedin, ChevronDown } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  title: string;
  company: string;
  linkedinUrl?: string;
  avatar?: string;
}

interface ContactModalProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
}

type TabKey = "summary" | "transcript" | "emails" | "slack" | "notes";

const tabs: { key: TabKey; label: string }[] = [
  { key: "summary", label: "Summary" },
  { key: "transcript", label: "Transcript" },
  { key: "emails", label: "Emails" },
  { key: "slack", label: "Slack" },
  { key: "notes", label: "Notes" },
];

export function ContactModal({ contact, isOpen, onClose }: ContactModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("summary");
  const [crmDropdownOpen, setCrmDropdownOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 z-40"
        onClick={onClose}
      />
      
      {/* Modal Panel */}
      <div className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-xl z-50 transform transition-transform duration-250 ease-out border-l border-gray-200">
        
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-semibold">{contact.name}</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600">{contact.title}</p>
            <p className="text-sm text-gray-600">{contact.company}</p>
            
            {contact.linkedinUrl && (
              <a 
                href={contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Linkedin size={14} strokeWidth={1.5} />
                LinkedIn Profile
              </a>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-2">
            {/* Push to CRM Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCrmDropdownOpen(!crmDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                Push to CRM
                <ChevronDown size={14} strokeWidth={1.5} />
              </button>
              
              {crmDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                  <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors">
                    Salesforce
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors">
                    HubSpot
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors">
                    Pipedrive
                  </button>
                </div>
              )}
            </div>

            {/* Remind Me Button */}
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
              <Bell size={14} strokeWidth={1.5} />
              Remind me
            </button>

            {/* Share Link */}
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
              <Share size={14} strokeWidth={1.5} />
              Share
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "summary" && (
            <div className="space-y-4">
              <h3 className="font-medium">Recent Activity</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Call • 2 hours ago</p>
                  <p className="text-sm">Discussed Q4 roadmap and resource allocation. Follow-up needed on user research findings.</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Email • Yesterday</p>
                  <p className="text-sm">Sent project timeline and milestone breakdown. Awaiting feedback on deliverables.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "transcript" && (
            <div className="space-y-4">
              <h3 className="font-medium">Call Transcript</h3>
              <div className="space-y-2 text-sm">
                <p><strong>You:</strong> Hi Sarah, thanks for taking the time to chat about the Q4 roadmap.</p>
                <p><strong>Sarah:</strong> Of course! I'm excited to discuss our priorities and how we can best allocate our resources.</p>
                <p><strong>You:</strong> Great. So I wanted to start with the mobile app redesign timeline...</p>
              </div>
            </div>
          )}

          {activeTab === "emails" && (
            <div className="space-y-4">
              <h3 className="font-medium">Email History</h3>
              <div className="space-y-3">
                <div className="border-l-2 border-blue-500 pl-3">
                  <p className="text-sm font-medium">Re: Q4 Planning Session</p>
                  <p className="text-sm text-gray-600">Yesterday, 3:45 PM</p>
                  <p className="text-sm mt-1">Thanks for the productive discussion. I've attached the updated timeline...</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "slack" && (
            <div className="space-y-4">
              <h3 className="font-medium">Slack Messages</h3>
              <div className="space-y-3">
                <div className="border-l-2 border-purple-500 pl-3">
                  <p className="text-sm font-medium">#product-team</p>
                  <p className="text-sm text-gray-600">Today, 8:45 AM</p>
                  <p className="text-sm mt-1">@channel Daily standup in 5 minutes. Sarah, can you share the onboarding flow progress?</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              <h3 className="font-medium">Notes</h3>
              <textarea 
                placeholder="Add your notes about this contact..."
                className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">
                Save Notes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close CRM dropdown */}
      {crmDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setCrmDropdownOpen(false)}
        />
      )}
    </>
  );
} 