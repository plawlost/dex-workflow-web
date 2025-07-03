"use client";

import { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { CheckCircle, Clock, AlertCircle, Plus, Filter, Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed";
  dueDate: string;
  assignee?: string;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Follow up with John about quarterly planning",
    description: "Schedule a meeting to discuss Q4 priorities and resource allocation",
    priority: "high",
    status: "pending",
    dueDate: "Today",
    assignee: "You",
  },
  {
    id: "2", 
    title: "Update CRM with new contact information",
    description: "Import recent contact data from yesterday's networking event",
    priority: "medium",
    status: "in_progress",
    dueDate: "Tomorrow",
    assignee: "You",
  },
  {
    id: "3",
    title: "Review and respond to Sarah's proposal",
    description: "Analyze the product roadmap proposal and provide feedback",
    priority: "high",
    status: "pending",
    dueDate: "Dec 15",
    assignee: "You",
  },
];

const priorityColors = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200",
};

const statusIcons = {
  pending: Clock,
  in_progress: AlertCircle,
  completed: CheckCircle,
};

export function TasksPane() {
  const [filter, setFilter] = useState<"all" | "pending" | "in_progress" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = mockTasks.filter(task => {
    const matchesFilter = filter === "all" || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tasks</h1>
            <p className="text-slate-600 text-lg">
              Stay on top of your workflow with AI-powered task management
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-2xl font-bold text-slate-900">{mockTasks.length}</p>
                <p className="text-sm text-slate-600">Total Tasks</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-2xl font-bold text-slate-900">{mockTasks.filter(t => t.status === "pending").length}</p>
                <p className="text-sm text-slate-600">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-2xl font-bold text-slate-900">{mockTasks.filter(t => t.status === "in_progress").length}</p>
                <p className="text-sm text-slate-600">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-2xl font-bold text-slate-900">{mockTasks.filter(t => t.status === "completed").length}</p>
                <p className="text-sm text-slate-600">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filter by:</span>
          </div>
          <div className="flex items-center gap-2">
            {[
              { key: "all", label: "All" },
              { key: "pending", label: "Pending" },
              { key: "in_progress", label: "In Progress" },
              { key: "completed", label: "Completed" },
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(key as typeof filter)}
                className={cn(
                  "rounded-xl transition-all duration-200",
                  filter === key
                    ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                    : "bg-white/80 hover:bg-white border-slate-200/80 text-slate-700"
                )}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/80 border-slate-200/80 rounded-xl focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const StatusIcon = statusIcons[task.status];
          return (
            <Card
              key={task.id}
              className="bg-white/80 backdrop-blur-sm border-slate-200/80 shadow-sm hover:shadow-md hover:bg-white transition-all duration-200 cursor-pointer group"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    task.status === "completed" ? "bg-green-100" : "bg-slate-100"
                  )}>
                    <StatusIcon className={cn(
                      "h-5 w-5",
                      task.status === "completed" ? "text-green-600" : "text-slate-600"
                    )} />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {task.title}
                        </h3>
                        <p className="text-sm text-slate-600">{task.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
                          priorityColors[task.priority]
                        )}>
                          {task.priority.toUpperCase()}
                        </span>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">{task.dueDate}</p>
                          <p className="text-xs text-slate-500">{task.assignee}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/80 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">No tasks found</h3>
                <p className="text-slate-600">Try adjusting your filters or create a new task.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 