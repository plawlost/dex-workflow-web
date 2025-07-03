"use client";

import { useState } from "react";
import { cn } from "~/lib/utils";
import { ContactModal } from "./contact-modal";
import { mockEvents, type Event } from "~/lib/mock-data";
import { 
  CalendarIcon,
  PhoneIcon,
  MailIcon,
  MessageIcon,
  UserIcon
} from "~/components/icons";

type EventType = "call" | "email" | "slack" | "imessage";

const channelIcons = {
  call: PhoneIcon,
  email: MailIcon,
  slack: MessageIcon,
  imessage: MessageIcon,
} as const;

const channelColors = {
  call: "border-l-emerald-500",
  email: "border-l-blue-500", 
  slack: "border-l-purple-500",
  imessage: "border-l-cyan-500",
} as const;

const channelAccents = {
  call: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  email: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  slack: "bg-purple-500/10 border-purple-500/20 text-purple-400", 
  imessage: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
} as const;

export function TimelineView() {
  const [selectedFilters, setSelectedFilters] = useState<(EventType | "all")[]>(["all"]);
  const [selectedDate, setSelectedDate] = useState("today");
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [focusedCardIndex, setFocusedCardIndex] = useState<number>(-1);

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

  return (
    <div className="space-y-8">
      {/* Header - Refined */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display text-foreground mb-2">Timeline</h1>
          <p className="text-caption max-w-2xl">
            Autonomous monitoring of your conversations and interactions, intelligently organized by AI.
          </p>
        </div>
        
        {/* System Status */}
        <div className="hidden md:flex items-center gap-4">
          <div className="status-indicator active">
            <span className="text-caption">System Active</span>
          </div>
          <div className="text-right">
            <div className="text-title font-semibold text-foreground">{filteredEvents.length}</div>
            <div className="text-micro text-muted-foreground">Total Events</div>
          </div>
        </div>
      </div>
      
      {/* Filter & Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Event Type Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { key: "all", label: "All Events", count: mockEvents.length },
            { key: "call", label: "Calls", count: mockEvents.filter(e => e.type === "call").length },
            { key: "email", label: "Email", count: mockEvents.filter(e => e.type === "email").length },
            { key: "slack", label: "Slack", count: mockEvents.filter(e => e.type === "slack").length }, 
            { key: "imessage", label: "Messages", count: mockEvents.filter(e => e.type === "imessage").length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => toggleFilter(key as EventType | "all")}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap",
                "border border-border",
                selectedFilters.includes(key as EventType | "all")
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground hover:bg-accent hover:text-foreground hover:border-accent"
              )}
            >
              <span>{label}</span>
              <span className={cn(
                "px-2 py-0.5 rounded-lg text-xs font-semibold",
                selectedFilters.includes(key as EventType | "all")
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Date & Time Controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarIcon size={16} />
            <span className="text-caption">Period:</span>
          </div>
          <select 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flat-input text-sm min-w-32"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="this-week">This Week</option>
            <option value="last-week">Last Week</option>
            <option value="this-month">This Month</option>
          </select>
        </div>
      </div>

      {/* Event Timeline */}
      <div className="space-y-4">
        {filteredEvents.map((event, index) => {
          const Icon = channelIcons[event.type];
          const isFocused = index === focusedCardIndex;
          
          return (
            <div 
              key={event.id}
              className={cn(
                "group flat-card p-6 cursor-pointer",
                "hover:shadow-lg transition-all duration-200",
                isFocused && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background",
                channelColors[event.type]
              )}
              onClick={() => handleCardClick(event)}
              tabIndex={0}
              onFocus={() => setFocusedCardIndex(index)}
            >
              {/* Event Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-xl border",
                    channelAccents[event.type]
                  )}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-title text-foreground font-semibold">{event.contactName}</h3>
                      <span className="text-micro text-muted-foreground">{event.type.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-caption text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12,6 12,12 16,14"/>
                        </svg>
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <UserIcon size={14} />
                        <span>Direct</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Status & Actions */}
                <div className="flex items-center gap-3">
                  {event.isExported && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-subtle" />
                      <span className="text-micro text-emerald-400 font-medium">Exported</span>
                    </div>
                  )}
                  
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground group-hover:text-foreground transition-colors">
                    <polyline points="9,18 15,12 9,6"/>
                  </svg>
                </div>
              </div>

              {/* Event Summary */}
              <div className="space-y-3">
                <div className="space-y-2">
                  {Array.isArray(event.summary) ? (
                    event.summary.map((point, pointIndex) => (
                      <div key={pointIndex} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-body text-foreground leading-relaxed">{point}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-body text-foreground leading-relaxed">
                      {event.summary}
                    </p>
                  )}
                </div>
                
                {/* Event Metadata */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex gap-2 flex-wrap">
                    {event.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-2 py-1 bg-muted/50 text-muted-foreground text-micro font-medium rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Quick Actions */}
                  <div className={cn(
                    "flex items-center gap-1 transition-opacity duration-200",
                    "opacity-0 group-hover:opacity-100"
                  )}>
                    <button 
                      className="p-2 rounded-lg hover:bg-accent transition-colors duration-150" 
                      title="Add to task"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 5v14m-7-7h14" />
                      </svg>
                    </button>
                    <button 
                      className="p-2 rounded-lg hover:bg-accent transition-colors duration-150" 
                      title="Export"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M7 7h10v10" />
                        <path d="M7 17 17 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="flat-card p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
              <CalendarIcon size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-title text-foreground mb-2">No events found</h3>
            <p className="text-caption text-muted-foreground">
              No events match your current filters. Try adjusting your selection or date range.
            </p>
          </div>
        )}
      </div>

      {/* Contact Detail Modal */}
      {isContactModalOpen && selectedContact && (
        <ContactModal
          contactName={selectedContact}
          onClose={handleContactModalClose}
        />
      )}
    </div>
  );
} 