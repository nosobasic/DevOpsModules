import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AgentCard } from '../components/dashboard/AgentCard';
import { MetricsOverview } from '../components/dashboard/MetricsOverview';
import { ActivityLog } from '../components/dashboard/ActivityLog';
import { Header } from '../components/dashboard/Header';
import { AgentType } from '../../shared/types';

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

// Mock data for development
const mockAgents: Agent[] = [
  {
    id: 'kpi-tracker',
    name: 'KPI Tracker',
    type: AgentType.KPI_TRACKER,
    status: 'active',
    lastRun: new Date(Date.now() - 5 * 60 * 1000),
    nextRun: new Date(Date.now() + 25 * 60 * 1000),
    config: { interval: 30000 },
    metrics: {
      runs: 142,
      successRate: 98.5,
      averageRunTime: 2340,
      dataPoints: []
    }
  },
  {
    id: 'revenue-ripple',
    name: 'Revenue Ripple Tracker',
    type: AgentType.REVENUE_RIPPLE,
    status: 'running',
    lastRun: new Date(Date.now() - 2 * 60 * 1000),
    nextRun: new Date(Date.now() + 58 * 60 * 1000),
    config: { interval: 60000 },
    metrics: {
      runs: 89,
      successRate: 100,
      averageRunTime: 1850,
      dataPoints: []
    }
  },
  {
    id: 'ab-optimizer',
    name: 'A/B Optimizer',
    type: AgentType.AB_OPTIMIZER,
    status: 'inactive',
    config: { interval: 120000 },
    metrics: {
      runs: 24,
      successRate: 95.8,
      averageRunTime: 4200,
      dataPoints: []
    }
  },
  {
    id: 'funnel-tester',
    name: 'Funnel Tester',
    type: AgentType.FUNNEL_TESTER,
    status: 'error',
    lastRun: new Date(Date.now() - 15 * 60 * 1000),
    config: { interval: 300000 },
    metrics: {
      runs: 12,
      successRate: 83.3,
      averageRunTime: 3100,
      lastError: 'Connection timeout to analytics API',
      dataPoints: []
    }
  }
];

async function fetchAgents(): Promise<Agent[]> {
  // In production, this would be an API call
  // const response = await fetch('/api/agents');
  // return response.json();
  
  // For now, return mock data
  return new Promise(resolve => setTimeout(() => resolve(mockAgents), 1000));
}

export function Dashboard() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const { data: agents = [], isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents
  });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Dashboard</h2>
          <p className="text-muted-foreground">Please try refreshing the page</p>
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