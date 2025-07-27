import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AgentCard } from '../components/dashboard/AgentCard';
import { MetricsOverview } from '../components/dashboard/MetricsOverview';
import { ActivityLog } from '../components/dashboard/ActivityLog';
import { Header } from '../components/dashboard/Header';
import { AgentType } from '../../shared/types';
import { configManager } from '../lib/config';

interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: 'active' | 'inactive' | 'running' | 'error' | 'paused';
  lastRun?: Date;
  nextRun?: Date;
  config: any;
  metrics: {
    runs: number;
    successRate: number;
    averageRunTime: number;
    lastError?: string;
    dataPoints: any[];
  };
}

// Real API functions
async function fetchAgents(): Promise<Agent[]> {
  try {
    const apiUrl = configManager.getApiUrl();
    const response = await fetch(`${apiUrl}/api/agents`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch agents:', error);
    return [];
  }
}

async function startAgent(agentType: string): Promise<boolean> {
  try {
    const apiUrl = configManager.getApiUrl();
    const response = await fetch(`${apiUrl}/api/agents/${agentType}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Failed to start agent:', error);
    return false;
  }
}

async function stopAgent(agentType: string): Promise<boolean> {
  try {
    const apiUrl = configManager.getApiUrl();
    const response = await fetch(`${apiUrl}/api/agents/${agentType}/stop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Failed to stop agent:', error);
    return false;
  }
}

export function Dashboard() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: agents = [], isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
    refetchInterval: 5000 // Refetch every 5 seconds
  });

  const startMutation = useMutation({
    mutationFn: startAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    }
  });

  const stopMutation = useMutation({
    mutationFn: stopAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    }
  });

  const handleStartAgent = (agentType: string) => {
    startMutation.mutate(agentType);
  };

  const handleStopAgent = (agentType: string) => {
    stopMutation.mutate(agentType);
  };

  const handleConfigureAgent = (agentType: string) => {
    // TODO: Implement configuration modal
    console.log('Configure agent:', agentType);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Dashboard</h2>
          <p className="text-muted-foreground">Please try refreshing the page</p>
          <p className="text-sm text-muted-foreground mt-2">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Metrics Overview */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">System Overview</h2>
          <MetricsOverview agents={agents} isLoading={isLoading} />
        </section>

        {/* Agents Grid */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">DevOps Agents</h2>
          
          {isLoading ? (
            <div className="dashboard-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="agent-card p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-full mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-grid">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isSelected={selectedAgent === agent.id}
                  onSelect={() => setSelectedAgent(
                    selectedAgent === agent.id ? null : agent.id
                  )}
                  onStart={() => handleStartAgent(agent.type)}
                  onStop={() => handleStopAgent(agent.type)}
                  onConfigure={() => handleConfigureAgent(agent.type)}
                  isLoading={startMutation.isPending || stopMutation.isPending}
                />
              ))}
            </div>
          )}
        </section>

        {/* Activity Log */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <ActivityLog />
        </section>
      </main>
    </div>
  );
}