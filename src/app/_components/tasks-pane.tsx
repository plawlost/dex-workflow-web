"use client";

import { useState } from "react";
import { Phone, Mail, MessageSquare, Calendar, Check, MoreHorizontal, Plus } from "lucide-react";
import { mockTasks, type Task } from "~/lib/mock-data";

type TaskStatus = "todo" | "scheduled" | "done";
type TaskSource = "call" | "email" | "slack" | "manual";

const sourceIcons: Record<TaskSource, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  call: Phone,
  email: Mail,
  slack: MessageSquare,
  manual: Plus,
};

const sourceColors: Record<TaskSource, string> = {
  call: "text-green-600",
  email: "text-blue-600",
  slack: "text-purple-600",
  manual: "text-gray-600",
};

const priorityColors: Record<Task["priority"], string> = {
  low: "border-l-gray-300",
  medium: "border-l-yellow-400",
  high: "border-l-red-400",
};

const columns: { status: TaskStatus; title: string; color: string }[] = [
  { status: "todo", title: "To do", color: "bg-red-50 border-red-200" },
  { status: "scheduled", title: "Scheduled", color: "bg-yellow-50 border-yellow-200" },
  { status: "done", title: "Done", color: "bg-green-50 border-green-200" },
];

export function TasksPane() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const handleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: "done" as TaskStatus }
        : task
    ));
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    if (draggedTask) {
      setTasks(tasks.map(task => 
        task.id === draggedTask 
          ? { ...task, status: newStatus }
          : task
      ));
      setDraggedTask(null);
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Plus size={16} strokeWidth={1.5} />
          Add Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.status);
          
          return (
            <div key={column.status} className="space-y-4">
              {/* Column Header */}
              <div className={`p-4 rounded-lg border-2 border-dashed ${column.color}`}>
                <div className="flex items-center justify-between">
                  <h2 className="font-medium text-gray-900">{column.title}</h2>
                  <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              {/* Drop Zone */}
              <div
                className="min-h-[400px] space-y-3"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.status)}
              >
                {columnTasks.map((task) => {
                  const SourceIcon = sourceIcons[task.source];
                  
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className={`card p-4 cursor-move hover:shadow-md transition-all group border-l-4 ${priorityColors[task.priority]} ${
                        draggedTask === task.id ? "opacity-50" : ""
                      }`}
                    >
                      {/* Task Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <SourceIcon 
                            size={14} 
                            strokeWidth={1.5} 
                            className={sourceColors[task.source]} 
                          />
                          <span className="text-xs text-gray-500 capitalize">
                            {task.source}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {task.status !== "done" && (
                            <button
                              onClick={() => handleTaskComplete(task.id)}
                              className="p-1 rounded hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                              title="Mark complete"
                            >
                              <Check size={14} strokeWidth={1.5} className="text-green-600" />
                            </button>
                          )}
                          <button className="p-1 rounded hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100">
                            <MoreHorizontal size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>

                      {/* Task Title */}
                      <h3 className="font-medium text-sm mb-2 leading-tight">
                        {task.title}
                      </h3>

                      {/* Task Details */}
                      <div className="space-y-2">
                        {task.contactName && (
                          <p className="text-xs text-gray-600">
                            Contact: {task.contactName}
                          </p>
                        )}
                        
                        {task.dueDate && task.status !== "done" && (
                          <div className="flex items-center gap-1">
                            <Calendar size={12} strokeWidth={1.5} className="text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {task.dueDate}
                            </span>
                          </div>
                        )}

                        {/* Priority indicator */}
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            task.priority === "high" ? "bg-red-400" :
                            task.priority === "medium" ? "bg-yellow-400" : "bg-gray-300"
                          }`} />
                          <span className="text-xs text-gray-500 capitalize">
                            {task.priority} priority
                          </span>
                        </div>
                      </div>

                      {/* Completion indicator for done tasks */}
                      {task.status === "done" && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                          <Check size={14} strokeWidth={1.5} className="text-green-600" />
                          <span className="text-xs text-green-600">Completed</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Empty state */}
                {columnTasks.length === 0 && (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-500">No {column.title.toLowerCase()} tasks</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 