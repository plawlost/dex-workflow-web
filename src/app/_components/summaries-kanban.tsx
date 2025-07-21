"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "~/contexts/auth-context";
import { backendAPI } from "~/lib/api";
import { summariesWS } from "~/lib/websocket";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { SparklesIcon, ClockIcon, RefreshIcon, TrendingUpIcon } from "~/components/icons";

interface SummaryCard {
  id: string;
  content: string;
  timestamp: Date;
  status: 'new' | 'processing' | 'completed';
}

// Component to render individual summary cards
function SummaryCard({ summary }: { summary: SummaryCard }) {
  const getStatusColor = (status: SummaryCard['status']) => {
    switch (status) {
      case 'new':
        return 'border-accent-blue bg-accent-blue/5';
      case 'processing':
        return 'border-warning-amber bg-warning-amber/5';
      case 'completed':
        return 'border-success-green/30 bg-success-green/5';
      default:
        return 'border-stone-gray bg-whisper-gray';
    }
  };

  const getStatusIcon = (status: SummaryCard['status']) => {
    switch (status) {
      case 'new':
        return <SparklesIcon className="text-accent-blue" size={16} />;
      case 'processing':
        return <RefreshIcon className="text-warning-amber animate-spin" size={16} />;
      case 'completed':
        return <ClockIcon className="text-success-green" size={16} />;
      default:
        return null;
    }
  };

  // Format the timestamp to a readable format
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('summaryId', summary.id);
    e.dataTransfer.setData('currentStatus', summary.status);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  return (
    <Card 
      className={cn(
        "border-l-4 transition-all duration-300 cursor-grab active:cursor-grabbing",
        getStatusColor(summary.status)
      )}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            {getStatusIcon(summary.status)}
            <span className="text-caption font-medium">
              {summary.status.charAt(0).toUpperCase() + summary.status.slice(1)}
            </span>
          </div>
          <span className="text-caption text-slate-gray">
            {formatTime(summary.timestamp)}
          </span>
        </div>
        <p className="text-body">{summary.content}</p>
      </CardContent>
    </Card>
  );
}

export function SummariesKanban() {
  const { user } = useAuth();
  const [summaries, setSummaries] = useState<SummaryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Handle card drop to change status
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: SummaryCard['status']) => {
    e.preventDefault();
    const summaryId = e.dataTransfer.getData('summaryId');
    const currentStatus = e.dataTransfer.getData('currentStatus') as SummaryCard['status'];
    
    // Don't do anything if dropped in the same column
    if (currentStatus === newStatus) return;
    
    // Update the status of the dragged summary
    setSummaries(prev => 
      prev.map(summary => 
        summary.id === summaryId 
          ? { ...summary, status: newStatus }
          : summary
      )
    );
  };
  
  // Handle drag over to allow drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Load initial summaries from API
  const loadSummaries = useCallback(async () => {
    if (!user?.backendToken) return;

    try {
      setLoading(true);
      setError(null);
      const response = await backendAPI.getOverview(user.backendToken);
      
      // Convert string array to SummaryCard objects with more realistic timestamps
      const summaryCards: SummaryCard[] = response.summaries.map((summary, index) => ({
        id: `summary-${Date.now()}-${index}`,
        content: summary,
        timestamp: new Date(Date.now() - (index * 1800000)), // Spread out by 30 minutes each
        status: 'completed' as const
      }));

      setSummaries(summaryCards);
    } catch (err) {
      console.error('Failed to load summaries:', err);
      setError('Failed to load summaries. Please try again.');
      // For development, let's add some mock data if the API fails
      if (process.env.NODE_ENV === 'development') {
        const mockSummaries: SummaryCard[] = [
          {
            id: 'mock-1',
            content: 'Discussed project timeline with client. Key deliverables due next week including the new dashboard features and API integrations.',
            timestamp: new Date(),
            status: 'completed'
          },
          {
            id: 'mock-2', 
            content: 'Team standup: Sprint planning completed, 3 new features in progress. Backend team working on Redis integration.',
            timestamp: new Date(Date.now() - 3600000),
            status: 'completed'
          },
          {
            id: 'mock-3',
            content: 'Customer feedback session: Users love the new dashboard design. Requesting dark mode and mobile optimizations.',
            timestamp: new Date(Date.now() - 7200000),
            status: 'completed'
          },
          {
            id: 'mock-4',
            content: 'Weekly review meeting: Q4 goals on track, need to prioritize performance improvements for the next sprint.',
            timestamp: new Date(Date.now() - 10800000),
            status: 'completed'
          }
        ];
        setSummaries(mockSummaries);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  }, [user?.backendToken]);

  // Setup WebSocket connection for real-time updates
  useEffect(() => {
    if (!user?.email || !user?.backendToken) return;

    let unsubscribe: (() => void) | null = null;

    const setupWebSocket = async () => {
      try {
        // Connect to WebSocket using user email and backend token
        await summariesWS.connect(user.email, user.backendToken!);
        setIsConnected(true);
        console.log(`Connected to WebSocket for user: ${user.email}`);

        // Subscribe to Redis channel based on user email (userEmail:summaries)
        unsubscribe = summariesWS.subscribeToSummaries(user.email, (newSummary: string) => {
          console.log('Received new summary:', newSummary);
          
          // Create a new summary card with "new" status
          const newCard: SummaryCard = {
            id: `summary-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            content: newSummary,
            timestamp: new Date(),
            status: 'new'
          };

          // Add the new summary to the beginning of the list
          setSummaries(prev => [newCard, ...prev]);

          // Auto-transition to processing after 1 second
          setTimeout(() => {
            setSummaries(prev => 
              prev.map(card => 
                card.id === newCard.id 
                  ? { ...card, status: 'processing' }
                  : card
              )
            );
          }, 1000);

          // Auto-transition to completed after 3 seconds
          setTimeout(() => {
            setSummaries(prev => 
              prev.map(card => 
                card.id === newCard.id 
                  ? { ...card, status: 'completed' }
                  : card
              )
            );
          }, 3000);
        });
      } catch (err) {
        console.error('Failed to setup WebSocket:', err);
        setIsConnected(false);
      }
    };

    setupWebSocket();

    // Cleanup function to disconnect WebSocket when component unmounts
    return () => {
      if (unsubscribe) unsubscribe();
      summariesWS.disconnect();
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };
  }, [user?.email, user?.backendToken]);

  // Load initial data
  useEffect(() => {
    loadSummaries();
  }, [loadSummaries]);

  const getStatusColor = (status: SummaryCard['status']) => {
    switch (status) {
      case 'new':
        return 'border-accent-blue bg-accent-blue/5';
      case 'processing':
        return 'border-warning-amber bg-warning-amber/5';
      case 'completed':
        return 'border-success-green/30 bg-success-green/5';
      default:
        return 'border-stone-gray bg-whisper-gray';
    }
  };

  const getStatusIcon = (status: SummaryCard['status']) => {
    switch (status) {
      case 'new':
        return <SparklesIcon className="text-accent-blue" size={16} />;
      case 'processing':
        return <RefreshIcon className="text-warning-amber animate-spin" size={16} />;
      case 'completed':
        return <ClockIcon className="text-success-green" size={16} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-display">AI Summaries</h2>
          <div className="flex items-center gap-2 text-caption">
            <div className="w-2 h-2 bg-stone-gray rounded-full animate-pulse" />
            Loading summaries...
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="pure-card animate-pulse">
              <div className="h-4 bg-whisper-gray rounded mb-3" />
              <div className="h-3 bg-whisper-gray rounded mb-2" />
              <div className="h-3 bg-whisper-gray rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-display">AI Summaries</h2>
          <button
            onClick={loadSummaries}
            className="pure-button-secondary text-sm px-4 py-2"
          >
            <RefreshIcon size={16} />
            Retry
          </button>
        </div>
        <div className="pure-card text-center py-12">
          <div className="w-12 h-12 bg-error-red/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-error-red text-xl">⚠</span>
          </div>
          <h3 className="text-title mb-2">Failed to load summaries</h3>
          <p className="text-caption text-slate-gray mb-4">{error}</p>
          <button
            onClick={loadSummaries}
            className="pure-button text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-display">AI Summaries</h2>
          <p className="text-caption text-slate-gray">
            Real-time insights from your conversations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-caption",
            isConnected 
              ? "glass-panel text-success-green" 
              : "bg-error-red/10 text-error-red"
          )}>
            <div className={cn(
              "status-dot",
              isConnected ? "success pulse" : "error"
            )} />
            {isConnected ? "Live updates active" : "Connection lost"}
          </div>
          <button
            onClick={loadSummaries}
            className="pure-button-ghost p-2"
            title="Refresh summaries"
          >
            <RefreshIcon size={16} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="pure-card flex items-center gap-4">
          <div className="p-3 bg-accent-blue/10 rounded-lg">
            <SparklesIcon className="text-accent-blue" />
          </div>
          <div>
            <p className="text-headline">{summaries.length}</p>
            <p className="text-caption">Total summaries</p>
          </div>
        </div>
        <div className="pure-card flex items-center gap-4">
          <div className="p-3 bg-success-green/10 rounded-lg">
            <ClockIcon className="text-success-green" />
          </div>
          <div>
            <p className="text-headline">{summaries.filter(s => s.status === 'completed').length}</p>
            <p className="text-caption">Completed</p>
          </div>
        </div>
        <div className="pure-card flex items-center gap-4">
          <div className="p-3 bg-warning-amber/10 rounded-lg">
            <RefreshIcon className="text-warning-amber" />
          </div>
          <div>
            <p className="text-headline">{summaries.filter(s => s.status === 'processing').length}</p>
            <p className="text-caption">Processing</p>
          </div>
        </div>
        <div className="pure-card flex items-center gap-4">
          <div className="p-3 bg-accent-blue/10 rounded-lg">
            <TrendingUpIcon className="text-accent-blue" />
          </div>
          <div>
            <p className="text-headline">{summaries.filter(s => s.status === 'new').length}</p>
            <p className="text-caption">New today</p>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {summaries.length === 0 ? (
        <div className="pure-card text-center py-12">
          <div className="w-16 h-16 bg-accent-blue/10 rounded-xl flex items-center justify-center mx-auto mb-6">
            <SparklesIcon className="text-accent-blue w-8 h-8" />
          </div>
          <h3 className="text-title mb-2">No summaries yet</h3>
          <p className="text-caption text-slate-gray max-w-md mx-auto">
            Your AI-generated summaries will appear here as they're created from your conversations. 
            Connect your tools to start receiving insights.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Kanban Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* New Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-accent-blue/20">
                <div className="p-2 bg-accent-blue/10 rounded-lg">
                  <TrendingUpIcon className="text-accent-blue" size={16} />
                </div>
                <div>
                  <h3 className="text-title">New</h3>
                  <p className="text-caption text-slate-gray">
                    {summaries.filter(s => s.status === 'new').length} items
                  </p>
                </div>
              </div>
              <div 
                className="space-y-3 min-h-[200px] p-2 rounded-lg border-2 border-dashed border-transparent hover:border-accent-blue/20 transition-colors"
                onDrop={(e) => handleDrop(e, 'new')}
                onDragOver={handleDragOver}
              >
                {summaries
                  .filter(summary => summary.status === 'new')
                  .map((summary) => (
                    <SummaryCard key={summary.id} summary={summary} />
                  ))}
                {summaries.filter(s => s.status === 'new').length === 0 && (
                  <div className="text-center py-8 text-caption text-slate-gray">
                    No new summaries
                  </div>
                )}
              </div>
            </div>

            {/* Processing Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-warning-amber/20">
                <div className="p-2 bg-warning-amber/10 rounded-lg">
                  <RefreshIcon className="text-warning-amber" size={16} />
                </div>
                <div>
                  <h3 className="text-title">Processing</h3>
                  <p className="text-caption text-slate-gray">
                    {summaries.filter(s => s.status === 'processing').length} items
                  </p>
                </div>
              </div>
              <div 
                className="space-y-3 min-h-[200px] p-2 rounded-lg border-2 border-dashed border-transparent hover:border-warning-amber/20 transition-colors"
                onDrop={(e) => handleDrop(e, 'processing')}
                onDragOver={handleDragOver}
              >
                {summaries
                  .filter(summary => summary.status === 'processing')
                  .map((summary) => (
                    <SummaryCard key={summary.id} summary={summary} />
                  ))}
                {summaries.filter(s => s.status === 'processing').length === 0 && (
                  <div className="text-center py-8 text-caption text-slate-gray">
                    No processing summaries
                  </div>
                )}
              </div>
            </div>

            {/* Completed Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-success-green/20">
                <div className="p-2 bg-success-green/10 rounded-lg">
                  <ClockIcon className="text-success-green" size={16} />
                </div>
                <div>
                  <h3 className="text-title">Completed</h3>
                  <p className="text-caption text-slate-gray">
                    {summaries.filter(s => s.status === 'completed').length} items
                  </p>
                </div>
              </div>
              <div 
                className="space-y-3 min-h-[200px] max-h-[600px] overflow-y-auto p-2 rounded-lg border-2 border-dashed border-transparent hover:border-success-green/20 transition-colors"
                onDrop={(e) => handleDrop(e, 'completed')}
                onDragOver={handleDragOver}
              >
                {summaries
                  .filter(summary => summary.status === 'completed')
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .map((summary) => (
                    <SummaryCard key={summary.id} summary={summary} />
                  ))}
                {summaries.filter(s => s.status === 'completed').length === 0 && (
                  <div className="text-center py-8 text-caption text-slate-gray">
                    No completed summaries
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile View - All Summaries */}
          <div className="lg:hidden">
            <h3 className="text-title mb-4">All Summaries</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summaries
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map((summary) => (
                  <SummaryCard key={summary.id} summary={summary} />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}