// Mock data for development - easily replaceable with real API calls

export interface Contact {
  id: string;
  name: string;
  title: string;
  company: string;
  linkedinUrl?: string;
  avatar?: string;
}

export interface Event {
  id: string;
  type: "call" | "email" | "slack" | "imessage";
  contactName: string;
  time: string;
  summary: string[];
  tags: string[];
  isExported: boolean;
  contact: Contact;
}

export interface Task {
  id: string;
  title: string;
  source: "call" | "email" | "slack" | "manual";
  dueDate?: string;
  status: "todo" | "scheduled" | "done";
  contactName?: string;
  priority: "low" | "medium" | "high";
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
  },
];

// Mock Contacts
export const mockContacts: Contact[] = [
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    title: "Senior Product Manager",
    company: "TechCorp Inc.",
    linkedinUrl: "https://linkedin.com/in/sarahchen"
  },
  {
    id: "marcus-rodriguez",
    name: "Marcus Rodriguez", 
    title: "Engineering Lead",
    company: "DevSolutions Ltd.",
    linkedinUrl: "https://linkedin.com/in/marcusrodriguez"
  },
  {
    id: "product-team",
    name: "Product Team",
    title: "Team Channel",
    company: "Internal",
  },
  {
    id: "alexandra-kim",
    name: "Alexandra Kim",
    title: "VP of Design",
    company: "DesignFlow Studio",
    linkedinUrl: "https://linkedin.com/in/alexandrakim"
  },
  {
    id: "david-wilson",
    name: "David Wilson",
    title: "Head of Sales",
    company: "Growth Ventures",
    linkedinUrl: "https://linkedin.com/in/davidwilson"
  }
];

// Mock Events
export const mockEvents: Event[] = [
  {
    id: "1",
    type: "call",
    contactName: "Sarah Chen",
    time: "10:30 AM",
    summary: [
      "Discussed Q4 roadmap priorities and resource allocation",
      "Confirmed launch date for mobile app redesign project",
      "Action item: send user research findings by EOD"
    ],
    tags: ["high-priority", "roadmap", "mobile"],
    isExported: true,
    contact: mockContacts[0]!
  },
  {
    id: "2", 
    type: "email",
    contactName: "Marcus Rodriguez",
    time: "9:15 AM",
    summary: [
      "Follow-up on API integration proposal discussion",
      "Technical requirements review completed successfully",
      "Next steps: schedule architecture review meeting"
    ],
    tags: ["technical", "integration", "api"],
    isExported: false,
    contact: mockContacts[1]!
  },
  {
    id: "3",
    type: "slack",
    contactName: "Product Team",
    time: "8:45 AM", 
    summary: [
      "Daily standup: progress on user onboarding flow",
      "Blocker identified with third-party authentication",
      "Design review scheduled for tomorrow 2 PM"
    ],
    tags: ["standup", "blocker", "authentication"],
    isExported: false,
    contact: mockContacts[2]!
  },
  {
    id: "4",
    type: "email",
    contactName: "Alexandra Kim",
    time: "Yesterday, 4:30 PM",
    summary: [
      "Shared updated design system components",
      "Requested feedback on new interaction patterns",
      "Timeline: finalize designs by end of week"
    ],
    tags: ["design", "feedback", "components"],
    isExported: true,
    contact: mockContacts[3]!
  },
  {
    id: "5",
    type: "call",
    contactName: "David Wilson",
    time: "Yesterday, 2:00 PM",
    summary: [
      "Quarterly sales review and pipeline discussion",
      "Identified 3 high-value prospects for Q1",
      "Follow-up: prepare demo for Enterprise client"
    ],
    tags: ["sales", "pipeline", "enterprise"],
    isExported: false,
    contact: mockContacts[4]!
  },
  {
    id: "6",
    type: "imessage",
    contactName: "Sarah Chen",
    time: "Yesterday, 11:20 AM",
    summary: [
      "Quick check-in about team capacity planning",
      "Confirmed availability for Friday strategy session",
      "Shared link to latest user research insights"
    ],
    tags: ["capacity", "strategy", "research"],
    isExported: false,
    contact: mockContacts[0]!
  }
];

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Send user research findings to Sarah",
    source: "call",
    dueDate: "Today, 5:00 PM",
    status: "todo",
    contactName: "Sarah Chen",
    priority: "high",
  },
  {
    id: "2",
    title: "Schedule architecture review meeting",
    source: "email",
    dueDate: "Tomorrow, 10:00 AM",
    status: "todo",
    contactName: "Marcus Rodriguez",
    priority: "medium",
  },
  {
    id: "3",
    title: "Review onboarding flow designs",
    source: "slack",
    dueDate: "Dec 15, 2:00 PM",
    status: "scheduled",
    contactName: "Product Team",
    priority: "medium",
  },
  {
    id: "4",
    title: "Follow up on Q4 budget allocation",
    source: "manual",
    dueDate: "Dec 20, 9:00 AM",
    status: "scheduled",
    contactName: "Finance Team",
    priority: "low",
  },
  {
    id: "5",
    title: "Prepare demo for Enterprise client",
    source: "call",
    dueDate: "Dec 18, 3:00 PM",
    status: "todo",
    contactName: "David Wilson",
    priority: "high",
  },
  {
    id: "6",
    title: "Review design system components",
    source: "email",
    dueDate: "Dec 16, 11:00 AM",
    status: "scheduled",
    contactName: "Alexandra Kim",
    priority: "medium",
  },
  {
    id: "7",
    title: "Finalize API integration requirements",
    source: "email",
    status: "done",
    contactName: "Marcus Rodriguez",
    priority: "high",
  },
  {
    id: "8",
    title: "Complete user interview analysis",
    source: "call",
    status: "done",
    contactName: "Research Team",
    priority: "medium",
  },
  {
    id: "9",
    title: "Update sales pipeline documentation",
    source: "manual",
    status: "done",
    contactName: "David Wilson",
    priority: "low",
  }
];

// Mock Rules/Recipes
export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: "priority" | "automation" | "filter";
  isPopular: boolean;
  yaml: string;
}

export const mockRecipes: Recipe[] = [
  {
    id: "high-priority-intros",
    name: "High Priority Intros", 
    description: "Auto-tag messages containing introduction requests from key domains",
    category: "priority",
    isPopular: true,
    yaml: `# High Priority Introduction Detection
name: high_priority_intros
description: Automatically tag introduction requests as high priority

triggers:
  - type: email
    conditions:
      - contains: ["introduce", "introduction", "connect you with"]
      - from_domain: ["linkedin.com", "techcorp.com", "venture.capital"]
  - type: slack
    conditions:
      - contains: ["intro", "meet", "connect"]
      - channel_type: "dm"

actions:
  - add_tag: "high-priority"
  - add_tag: "introduction"
  - notify_slack:
      channel: "#intros"
      message: "New high-priority introduction request from {{contact_name}}"
  - create_task:
      title: "Process introduction request from {{contact_name}}"
      due: "+2 hours"
      priority: "high"`,
  },
  {
    id: "spam-filter",
    name: "Spam Filter",
    description: "Filter out promotional content and automated messages",
    category: "filter", 
    isPopular: true,
    yaml: `# Spam and Promotional Filter
name: spam_filter
description: Filter out promotional content and automated messages

triggers:
  - type: email
    conditions:
      - contains: ["unsubscribe", "promotional", "marketing", "newsletter"]
      - or:
        - from_pattern: "noreply@*"
        - from_pattern: "*@marketing.*"
        - from_pattern: "*newsletter*"
  - type: slack
    conditions:
      - from_bot: true
      - contains: ["automated", "bot message", "notification"]

actions:
  - add_tag: "spam"
  - skip_processing: true
  - archive: true
  - log: "Filtered spam from {{sender}}"`,
  },
  {
    id: "warm-lead-detection",
    name: "Warm Lead Detection",
    description: "Identify and prioritize potential warm leads and opportunities",
    category: "automation",
    isPopular: false,
    yaml: `# Warm Lead Detection
name: warm_lead_detection
description: Identify warm leads and potential opportunities

triggers:
  - type: email
    conditions:
      - contains: ["interested", "demo", "pricing", "proposal", "budget"]
      - not_contains: ["not interested", "no thanks", "unsubscribe"]
      - from_domain_not: ["spam.com", "marketing.*"]
  - type: call
    conditions:
      - duration: ">10 minutes"
      - sentiment: "positive"
      - contains: ["interested", "next steps", "proposal"]

actions:
  - add_tag: "warm-lead"
  - add_tag: "opportunity"
  - create_task:
      title: "Follow up with warm lead: {{contact_name}}"
      due: "+1 day"
      priority: "high"
  - push_to_crm:
      status: "qualified"
      priority: "high"
      lead_score: 85
  - notify_slack:
      channel: "#sales"
      message: "🔥 New warm lead detected: {{contact_name}} from {{company}}"`,
  },
  {
    id: "follow-up-reminders",
    name: "Smart Follow-up Reminders",
    description: "Create intelligent follow-up tasks based on conversation context",
    category: "automation", 
    isPopular: true,
    yaml: `# Smart Follow-up Reminders
name: follow_up_reminders
description: Create follow-up tasks for important conversations

triggers:
  - type: call
    conditions:
      - contains: ["follow up", "next steps", "action items", "send", "share"]
      - duration: ">5 minutes"
      - not_contains: ["no follow up", "one-time"]
  - type: email
    conditions:
      - contains: ["follow up", "checking in", "next steps", "will send"]
      - thread_length: ">1"
      - sentiment: "positive"

actions:
  - create_task:
      title: "Follow up: {{extracted_action}} with {{contact_name}}"
      due: "+3 days"
      priority: "medium"
  - add_tag: "follow-up-needed"
  - calendar_reminder:
      time: "+2 days"
      message: "Follow up with {{contact_name}} about {{topic}}"
  - add_to_crm:
      next_action: "Follow up on {{extracted_action}}"
      next_date: "+3 days"`,
  },
];

// API simulation functions (easily replaceable with real API calls)
export const mockApi = {
  // Users
  getCurrentUser: async (): Promise<User> => {
    return new Promise(resolve => 
      setTimeout(() => resolve(mockUsers[0]!), 100)
    );
  },

  // Events
  getEvents: async (filters?: { type?: string; date?: string }): Promise<Event[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        let filtered = mockEvents;
        
        if (filters?.type && filters.type !== "all") {
          filtered = filtered.filter(event => event.type === filters.type);
        }
        
        // Add date filtering logic here if needed
        
        resolve(filtered);
      }, 200);
    });
  },

  // Tasks
  getTasks: async (): Promise<Task[]> => {
    return new Promise(resolve => 
      setTimeout(() => resolve(mockTasks), 150)
    );
  },

  updateTask: async (taskId: string, updates: Partial<Task>): Promise<Task> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const task = mockTasks.find(t => t.id === taskId);
        if (task) {
          Object.assign(task, updates);
          resolve(task);
        }
      }, 100);
    });
  },

  // Contacts
  getContacts: async (): Promise<Contact[]> => {
    return new Promise(resolve => 
      setTimeout(() => resolve(mockContacts), 100)
    );
  },

  // Rules
  getRecipes: async (): Promise<Recipe[]> => {
    return new Promise(resolve => 
      setTimeout(() => resolve(mockRecipes), 100)
    );
  },

  saveRule: async (yaml: string): Promise<{ success: boolean }> => {
    return new Promise(resolve => 
      setTimeout(() => resolve({ success: true }), 1000)
    );
  },
}; 