"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Mail, MessageSquare, Calendar, FileText, Building, MoreHorizontal } from "lucide-react";

type OnboardingStep = "welcome" | "oauth" | "permissions" | "finish";

interface Provider {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  isAvailable: boolean;
}

interface Permission {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const providers: Provider[] = [
  { id: "gmail", name: "Gmail", icon: Mail, isAvailable: true },
  { id: "outlook", name: "Outlook", icon: Mail, isAvailable: true },
  { id: "slack", name: "Slack", icon: MessageSquare, isAvailable: true },
  { id: "calendar", name: "Google Calendar", icon: Calendar, isAvailable: true },
  { id: "notion", name: "Notion", icon: FileText, isAvailable: true },
  { id: "hubspot", name: "HubSpot", icon: Building, isAvailable: true },
  { id: "more", name: "More coming", icon: MoreHorizontal, isAvailable: false },
];

const defaultPermissions: Permission[] = [
  {
    id: "summarize",
    title: "Auto summarise calls",
    description: "Automatically generate summaries of your phone calls and meetings",
    enabled: true,
  },
  {
    id: "slack-recap",
    title: "Send recap to Slack",
    description: "Post meeting summaries and action items to your designated Slack channel",
    enabled: true,
  },
  {
    id: "crm-push",
    title: "Push data to CRM",
    description: "Automatically sync contacts and interactions to your CRM system",
    enabled: false,
  },
  {
    id: "calendar-followup",
    title: "Add calendar follow-ups",
    description: "Create calendar reminders for important follow-up actions",
    enabled: false,
  },
];

export function OnboardingFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>(defaultPermissions);

  const handleProviderToggle = (providerId: string) => {
    if (!providers.find(p => p.id === providerId)?.isAvailable) return;
    
    setSelectedProviders(prev => 
      prev.includes(providerId)
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  const handlePermissionToggle = (permissionId: string) => {
    setPermissions(prev => prev.map(p => 
      p.id === permissionId ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const handleNext = () => {
    switch (currentStep) {
      case "welcome":
        setCurrentStep("oauth");
        break;
      case "oauth":
        setCurrentStep("permissions");
        break;
      case "permissions":
        setCurrentStep("finish");
        break;
      case "finish":
        router.push("/");
        break;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "welcome":
        return true;
      case "oauth":
        return selectedProviders.length > 0;
      case "permissions":
        return true;
      case "finish":
        return true;
      default:
        return false;
    }
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
          <span className="text-2xl font-bold text-white">D</span>
        </div>
        <h1 className="text-3xl font-semibold">Welcome to Dex</h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          AI-powered workflow intelligence that transforms your conversations into actionable insights.
        </p>
      </div>
      
      <button
        onClick={handleNext}
        className="flex items-center gap-2 px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
      >
        Connect accounts
        <ArrowRight size={16} strokeWidth={1.5} />
      </button>
    </div>
  );

  const renderOAuthStep = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">Connect your accounts</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Choose which platforms you'd like Dex to monitor and analyze for workflow insights.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
        {providers.map((provider) => {
          const Icon = provider.icon;
          const isSelected = selectedProviders.includes(provider.id);
          const isAvailable = provider.isAvailable;
          
          return (
            <button
              key={provider.id}
              onClick={() => handleProviderToggle(provider.id)}
              disabled={!isAvailable}
              className={`p-6 rounded-lg border-2 transition-all text-center ${
                isSelected && isAvailable
                  ? "border-blue-500 bg-blue-50"
                  : isAvailable
                    ? "border-gray-200 hover:border-gray-300"
                    : "border-gray-100 bg-gray-50 cursor-not-allowed"
              }`}
            >
              <Icon 
                size={24} 
                strokeWidth={1.5} 
                className={`mx-auto mb-3 ${
                  isAvailable ? "text-gray-700" : "text-gray-400"
                }`} 
              />
              <div className={`font-medium ${
                isAvailable ? "text-gray-900" : "text-gray-400"
              }`}>
                {provider.name}
              </div>
              {isSelected && (
                <Check size={16} strokeWidth={1.5} className="text-blue-500 mx-auto mt-2" />
              )}
            </button>
          );
        })}
      </div>

      <div className="text-center">
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex items-center gap-2 px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
          <ArrowRight size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );

  const renderPermissionsStep = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">Configure permissions</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Choose which actions Dex can perform automatically. You can change these settings later.
        </p>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        {permissions.map((permission) => (
          <label
            key={permission.id}
            className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <input
              type="checkbox"
              checked={permission.enabled}
              onChange={() => handlePermissionToggle(permission.id)}
              className="mt-1 rounded text-blue-500 focus:ring-blue-500"
            />
            <div className="flex-1">
              <h3 className="font-medium">{permission.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{permission.description}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
        >
          Continue
          <ArrowRight size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );

  const renderFinishStep = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
          <Check size={32} strokeWidth={1.5} className="text-white" />
        </div>
        <h1 className="text-2xl font-semibold">You're all set!</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Dex is now monitoring your connected accounts and will start providing insights within minutes.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
        >
          Go to Dashboard
          <ArrowRight size={16} strokeWidth={1.5} />
        </button>
        
        <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          Take a quick tour (3 slides)
        </button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "welcome":
        return renderWelcomeStep();
      case "oauth":
        return renderOAuthStep();
      case "permissions":
        return renderPermissionsStep();
      case "finish":
        return renderFinishStep();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            {["welcome", "oauth", "permissions", "finish"].map((step, index) => {
              const isActive = step === currentStep;
              const isCompleted = ["welcome", "oauth", "permissions", "finish"].indexOf(currentStep) > index;
              
              return (
                <div key={step} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isActive
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}>
                    {isCompleted ? <Check size={16} strokeWidth={1.5} /> : index + 1}
                  </div>
                  {index < 3 && (
                    <div className={`w-8 h-0.5 ${
                      isCompleted ? "bg-green-500" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <div className="w-full max-w-lg mx-auto">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
} 