"use client";

import { X, Mail, Phone, Building, User, MessageSquare, Calendar, ExternalLink } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

interface ContactModalProps {
  contact: {
    name: string;
    title?: string;
    company?: string;
    time?: string;
    type?: string;
    summary?: string | string[];
    tags?: string[];
    isExported?: boolean;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ contact, isOpen, onClose }: ContactModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <Card className="relative w-full max-w-2xl mx-4 bg-white/95 backdrop-blur-xl border-slate-200/80 shadow-2xl animate-scale-in">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{contact.name}</h2>
                {contact.title && contact.company && (
                  <p className="text-sm text-slate-600">{contact.title} at {contact.company}</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Email</p>
                  <p className="text-sm text-slate-600">{contact.name.toLowerCase().replace(' ', '.')}@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <Phone className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Phone</p>
                  <p className="text-sm text-slate-600">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>

            {/* Last Interaction */}
            {contact.time && contact.type && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Last Interaction</span>
                </div>
                <p className="text-sm text-blue-800">
                  {contact.time} via {contact.type.toUpperCase()}
                </p>
              </div>
            )}
            
            {/* Summary */}
            {contact.summary && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-slate-600" />
                  Conversation Summary
                </h3>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  {Array.isArray(contact.summary) ? (
                    contact.summary.map((point, i) => (
                      <p key={i} className="text-sm text-slate-700 leading-relaxed">• {point}</p>
                    ))
                  ) : (
                    <p className="text-sm text-slate-700 leading-relaxed">{contact.summary}</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Tags */}
            {contact.tags && contact.tags.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-900">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Export Status */}
            {contact.isExported && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-green-800 font-medium">Successfully exported to CRM</span>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-slate-200/50 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                View in CRM
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Take Action
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 