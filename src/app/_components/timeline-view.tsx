"use client";

import { useState, useEffect } from "react";
import { cn } from "~/lib/utils";
import { CalendarIcon, PhoneIcon, MailIcon, MessageIcon } from "~/components/icons";
import { ContactModal } from "./contact-modal";
import { mockEvents, type Event } from "~/lib/mock-data";

type EventType = "call" | "email" | "slack" | "imessage";

const channelColors: Record<EventType, string> = {
  call: "bg-emerald-500",
  email: "bg-blue-500", 
  slack: "bg-violet-500",
  imessage: "bg-gray-500",
};

const channelAccents: Record<EventType, string> = {
  call: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  email: "bg-blue-500/10 text-blue-700 border-blue-200", 
  slack: "bg-violet-500/10 text-violet-700 border-violet-200",
  imessage: "bg-gray-500/10 text-gray-700 border-gray-200",
};

const channelIcons: Record<EventType, React.ComponentType<{ className?: string; size?: number }>> = {
  call: PhoneIcon,
  email: MailIcon,
  slack: MessageIcon,
  imessage: MessageIcon,
};

export function TimelineView() {
  const [selectedFilters, setSelectedFilters] = useState<(EventType | "all")[]>(["all"]);
  const [selectedDate, setSelectedDate] = useState("today");
  const [selectedContact, setSelectedContact] = useState<Event["contact"] | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [focusedCardIndex, setFocusedCardIndex] = useState<number>(-1);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Global shortcuts
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "k":
            e.preventDefault();
            document.getElementById("global-search")?.focus();
            break;
          case "/":
            e.preventDefault();
            console.log("Shortcuts cheat sheet");
            break;
        }
      }

      // Card navigation
      const filteredEvents = selectedFilters.includes("all") 
        ? mockEvents 
        : mockEvents.filter(event => selectedFilters.includes(event.type));

      if (e.key === "ArrowDown" && focusedCardIndex < filteredEvents.length - 1) {
        e.preventDefault();
        setFocusedCardIndex(prev => prev + 1);
      } else if (e.key === "ArrowUp" && focusedCardIndex > 0) {
        e.preventDefault();
        setFocusedCardIndex(prev => prev - 1);
      } else if (e.key === "Enter" && focusedCardIndex >= 0) {
        e.preventDefault();
        handleCardClick(filteredEvents[focusedCardIndex]!);
      } else if (e.key === "e" && focusedCardIndex >= 0) {
        e.preventDefault();
        console.log("Export card", focusedCardIndex);
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [focusedCardIndex, selectedFilters]);

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
    setSelectedContact(event.contact);
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
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-display">Timeline</h1>
        <p className="text-caption">
          Your recent conversations and interactions, intelligently organized.
        </p>
      </div>
      
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { key: "all", label: "All", count: mockEvents.length },
            { key: "call", label: "Calls", count: mockEvents.filter(e => e.type === "call").length },
            { key: "email", label: "Email", count: mockEvents.filter(e => e.type === "email").length },
            { key: "slack", label: "Slack", count: mockEvents.filter(e => e.type === "slack").length }, 
            { key: "imessage", label: "iMessage", count: mockEvents.filter(e => e.type === "imessage").length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => toggleFilter(key as EventType | "all")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                "hover:scale-105 hover-lift",
                selectedFilters.includes(key as EventType | "all")
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {label}
              <span className={cn(
                "px-1.5 py-0.5 rounded-full text-xs",
                selectedFilters.includes(key as EventType | "all")
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-foreground/10 text-muted-foreground"
              )}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Date Picker */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <CalendarIcon size={16} className="text-muted-foreground" />
          <select 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={cn(
              "px-3 py-2 bg-background border border-border rounded-lg text-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
              "transition-all duration-200"
            )}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="this-week">This Week</option>
            <option value="last-week">Last Week</option>
          </select>
        </div>
      </div>

      {/* Event Cards Grid */}
      <div className="space-y-4">
        {filteredEvents.map((event, index) => {
          const Icon = channelIcons[event.type];
          const isFocused = index === focusedCardIndex;
          
          return (
            <div 
              key={event.id}
              className={cn(
                "group relative p-6 rounded-xl border bg-card hover:shadow-md transition-all duration-200 cursor-pointer",
                "hover:border-border/60 hover-lift",
                isFocused && "ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
              )}
              onClick={() => handleCardClick(event)}
              tabIndex={0}
              onFocus={() => setFocusedCardIndex(index)}
            >
              {/* Channel indicator */}
              <div className={cn(
                "absolute left-0 top-6 bottom-6 w-1 rounded-r-full",
                channelColors[event.type]
              )} />
              
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg border",
                    channelAccents[event.type]
                  )}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <h3 className="text-title font-medium">{event.contactName}</h3>
                    <p className="text-caption">{event.time}</p>
                  </div>
                </div>
                
                {/* Export status */}
                {event.isExported && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-subtle" />
                    <span className="text-micro font-medium text-emerald-600">Exported</span>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="mb-4 space-y-2">
                {event.summary.map((point, pointIndex) => (
                  <div key={pointIndex} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-body text-muted-foreground leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
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

                {/* Action buttons */}
                <div className={cn(
                  "flex items-center gap-1 transition-opacity duration-200",
                  isFocused ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                  <button 
                    className="p-2 rounded-md hover:bg-accent transition-colors duration-150" 
                    title="Add notes"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button 
                    className="p-2 rounded-md hover:bg-accent transition-colors duration-150" 
                    title="Export (E)"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M7 7h10v10" />
                      <path d="M7 17 17 7" />
                    </svg>
                  </button>
                  <button 
                    className="p-2 rounded-md hover:bg-accent transition-colors duration-150" 
                    title="More options"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarIcon size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-title font-medium mb-2">No events found</h3>
          <p className="text-caption">
            Try adjusting your filters or check back later for new conversations.
          </p>
        </div>
      )}

      {/* Contact Modal */}
      {selectedContact && (
        <ContactModal
          contact={selectedContact}
          isOpen={isContactModalOpen}
          onClose={handleContactModalClose}
        />
      )}
    </div>
  );
} 