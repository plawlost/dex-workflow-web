"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, Save, RotateCcw, Star, AlertTriangle, Filter } from "lucide-react";
import { mockRecipes, type Recipe } from "~/lib/mock-data";

export function RulesEditor() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(mockRecipes[0] || null);
  const [editorValue, setEditorValue] = useState(selectedRecipe?.yaml || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Debounced save effect
  useEffect(() => {
    if (editorValue !== selectedRecipe?.yaml) {
      const timeout = setTimeout(() => {
        handleSave();
      }, 2000); // 2 second debounce

      return () => clearTimeout(timeout);
    }
  }, [editorValue]);

  const handleSave = async () => {
    setSaveStatus("saving");
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaveStatus("saved");
    setIsSaving(false);
    
    // Show toast
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setEditorValue(recipe.yaml);
  };

  const handleReset = () => {
    if (selectedRecipe) {
      setEditorValue(selectedRecipe.yaml);
    }
  };

  const filteredRecipes = selectedCategory === "all" 
    ? mockRecipes 
    : mockRecipes.filter(recipe => recipe.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Rules Editor</h1>
        <div className="flex items-center gap-2">
          {saveStatus === "saved" && (
            <span className="text-sm text-green-600 animate-fade-in">
              Rules live ✓
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Save size={16} strokeWidth={1.5} />
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        
        {/* Left Panel - Preset Recipes */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Preset Recipes</h2>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="priority">Priority</option>
              <option value="automation">Automation</option>
              <option value="filter">Filter</option>
            </select>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-full">
            {filteredRecipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => handleRecipeSelect(recipe)}
                className={`w-full text-left p-4 rounded-lg border transition-all hover:shadow-sm ${
                  selectedRecipe?.id === recipe.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm">{recipe.name}</h3>
                  <div className="flex items-center gap-1">
                    {recipe.isPopular && (
                      <Star size={12} strokeWidth={1.5} className="text-yellow-500 fill-current" />
                    )}
                    <div className={`w-2 h-2 rounded-full ${
                      recipe.category === "priority" ? "bg-red-400" :
                      recipe.category === "automation" ? "bg-blue-400" : "bg-gray-400"
                    }`} />
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {recipe.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">
              {selectedRecipe ? selectedRecipe.name : "Custom Rule"}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RotateCcw size={14} strokeWidth={1.5} />
                Reset
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                <Play size={14} strokeWidth={1.5} />
                Test
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="yaml"
              value={editorValue}
              onChange={(value) => setEditorValue(value || "")}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: "on",
                folding: true,
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-gray-600">YAML syntax valid</span>
            </div>
            <div className="text-gray-500">
              Last saved: {saveStatus === "saved" ? "just now" : "auto-save in 2s"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 