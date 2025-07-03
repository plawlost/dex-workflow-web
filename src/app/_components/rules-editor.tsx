"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

const recipes = [
  {
    name: "High Priority Intros",
    description: "Auto-tag messages containing introduction requests from key domains",
    stars: 4,
    code: `triggers:
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
  { name: "Spam Filter", description: "Filter out promotional content and automated messages", stars: 5 },
  { name: "Warm Lead Detection", description: "Identify and prioritize potential warm leads and opportunities", stars: 3 },
  { name: "Smart Follow-up Reminders", description: "Create intelligent follow-up tasks based on conversation context", stars: 4 },
];

export function RulesEditor() {
  const [selectedRecipe, setSelectedRecipe] = useState(recipes[0]);

  return (
    <div className="grid h-full grid-cols-[350px_1fr] gap-4">
      <div className="flex flex-col gap-4">
        <div className="rounded-lg border bg-card p-4">
          <h2 className="text-lg font-semibold">Preset Recipes</h2>
        </div>
        <div className="space-y-2">
          {recipes.map((recipe) => (
            <button
              key={recipe.name}
              onClick={() => setSelectedRecipe(recipe)}
              className={cn(
                "w-full rounded-lg border p-4 text-left transition-colors",
                selectedRecipe.name === recipe.name
                  ? "bg-muted"
                  : "hover:bg-muted/50"
              )}
            >
              <div className="flex justify-between">
                <h3 className="font-semibold">{recipe.name}</h3>
                <div className="flex items-center gap-1">
                  {recipe.stars}
                  <span className="text-yellow-500">★</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{recipe.description}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center justify-between rounded-t-lg border bg-card p-4">
          <h2 className="text-lg font-semibold">{selectedRecipe.name}</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline">Reset</Button>
            <Button>Test</Button>
            <Button variant="default">Save</Button>
          </div>
        </div>
        <div className="flex-grow rounded-b-lg border border-t-0">
          <Editor
            height="100%"
            language="yaml"
            theme="vs-dark"
            value={selectedRecipe.code}
            options={{ minimap: { enabled: false } }}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border bg-card p-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>YAML syntax valid</span>
          </div>
          <span className="text-muted-foreground">Last saved: auto-save in 2s</span>
        </div>
      </div>
    </div>
  );
} 