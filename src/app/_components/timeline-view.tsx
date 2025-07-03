"use client";

import { useState } from "react";
import { cn } from "~/lib/utils";
import { ContactModal } from "./contact-modal";
import { mockEvents, type Event } from "~/lib/mock-data";
import { 
  CalendarIcon, PhoneIcon, MailIcon, MessageIcon, 
  UserIcon, FilterIcon, TrendingUpIcon, SparklesIcon, ClockIcon, ExternalLinkIcon 
} from "~/components/icons";

type EventType = "call" | "email" | "slack" | "imessage";

const channelIcons = {
  call: PhoneIcon,
  email: MailIcon,
  slack: MessageIcon,
  imessage: MessageIcon,
} as const;

const channelColors = {
  call: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
  email: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
  slack: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
  imessage: { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-200" },
} as const;

export function TimelineView() {
  const [selectedFilters, setSelectedFilters] = useState<(EventType | "all")[]>(["all"]);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const toggleFilter = (filter: EventType | "all") => {
    if (filter === "all") {
      setSelectedFilters(["all"]);
    } else {
      const newFilters = selectedFilters.includes("all") 
        ? [filter]
        : selectedFilters.includes(filter)
          ? selectedFilters.filter(f => f !== filter)
          : [...selectedFilters.filter(f => f !== "all"), filter];
      
      setSelectedFilters(newFilters.length === 0 ? ["all"] : newFilters);
    }
  };

  const handleCardClick = (event: Event) => {
    setSelectedContact(event.contactName);
    setIsContactModalOpen(true);
  };

  const handleContactModalClose = () => {
    setIsContactModalOpen(false);
    setSelectedContact(null);
  };

  const filteredEvents = selectedFilters.includes("all") 
    ? mockEvents 
    : mockEvents.filter(event => selectedFilters.includes(event.type));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-display">
              {getGreeting()}, Yagiz
            </h1>
            <p className="text-title" style={{ color: 'rgb(var(--text-secondary))' }}>
              You have <span className="font-medium" style={{ color: 'rgb(var(--accent))' }}>{filteredEvents.length} conversations</span> ready for review.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-panel flex items-center gap-2 px-3 py-2 rounded-lg text-caption">
              <div className="status-dot success pulse"></div>
              AI monitoring active
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="pure-card flex items-center gap-4">
            <div className="p-3 bg-accent-blue/10 rounded-lg">
              <TrendingUpIcon className="text-accent-blue" />
            </div>
            <div>
              <p className="text-headline">24</p>
              <p className="text-caption">Today's insights</p>
            </div>
          </div>
          <div className="pure-card flex items-center gap-4">
            <div className="p-3 bg-success-green/10 rounded-lg">
              <SparklesIcon className="text-success-green" />
            </div>
            <div>
              <p className="text-headline">12</p>
              <p className="text-caption">Auto-exported</p>
            </div>
          </div>
          <div className="pure-card flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <ClockIcon className="text-purple-500" />
            </div>
            <div>
              <p className="text-headline">4.2m</p>
              <p className="text-caption">Time saved</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-caption">
            <FilterIcon className="text-stone-gray" />
            <span className="font-medium">Filter by:</span>
          </div>
          <div className="flex items-center gap-2">
            {[
              { key: "all", label: "All", count: mockEvents.length }, 
              { key: "call", label: "Calls", count: mockEvents.filter(e => e.type === "call").length }, 
              { key: "email", label: "Email", count: mockEvents.filter(e => e.type === "email").length }, 
              { key: "slack", label: "Slack", count: mockEvents.filter(e => e.type === "slack").length }, 
              { key: "imessage", label: "Messages", count: mockEvents.filter(e => e.type === "imessage").length }
            ].map(({ key, label, count }) => {
              const isActive = selectedFilters.includes(key as EventType | "all");
              return (
                <button
                  key={key}
                  onClick={() => toggleFilter(key as EventType | "all")}
                  className={cn(
                    "pure-button text-sm px-4 py-2",
                    isActive ? "" : "pure-button-secondary"
                  )}
                >
                  {label}
                  <span className={cn(
                    "ml-2 px-2 py-0.5 text-xs rounded-lg",
                    isActive
                      ? "bg-white/20"
                      : "bg-whisper-gray"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-gray" size={16} />
          <input 
            placeholder="Today" 
            className="pure-input pl-10 w-40 text-sm" 
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredEvents.map((event) => {
          const Icon = channelIcons[event.type];
          const colors = channelColors[event.type];
          return (
            <div
              key={event.id}
              className="pure-card cursor-pointer group"
              onClick={() => handleCardClick(event)}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={cn("p-3 rounded-lg border", colors.bg, colors.border)}>
                  <Icon className={cn("h-5 w-5", colors.text)} />
                </div>
                
                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-title font-medium group-hover:text-accent-blue transition-colors">
                        {event.contactName}
                      </h3>
                      <p className="text-caption">
                        {event.time} · {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </p>
                    </div>
                    {event.isExported && (
                      <div className="flex items-center gap-2 text-caption text-success-green">
                        <div className="status-dot success" />
                        Exported to CRM
                      </div>
                    )}
                  </div>
                  
                  {/* Summary */}
                  <div className="space-y-1 text-body text-slate-gray">
                    {Array.isArray(event.summary) ? (
                      event.summary.map((point, i) => (
                        <p key={i}>{point}</p>
                      ))
                    ) : (
                      <p>{event.summary}</p>
                    )}
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {event.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-3 py-1 rounded-lg bg-whisper-gray text-slate-gray text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {selectedContact && (
        <ContactModal 
          isOpen={isContactModalOpen}
          onClose={handleContactModalClose}
          contactName={selectedContact}
        />
      )}
    </div>
  );
} 