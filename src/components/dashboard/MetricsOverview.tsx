

import { Activity, Users, TrendingUp, AlertTriangle, Heart, Rocket } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'running' | 'error' | 'paused';
  metrics: {
    runs: number;
    successRate: number;
    averageRunTime: number;
  };
}

interface MetricsOverviewProps {
  agents: Agent[];
  isLoading?: boolean;
}

export function MetricsOverview({ agents, isLoading }: MetricsOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card p-6 rounded-lg border animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const activeAgents = agents.filter(agent => 
    agent.status === 'active' || agent.status === 'running'
  ).length;
  const totalRuns = agents.reduce((sum, agent) => sum + agent.metrics.runs, 0);
  const errorAgents = agents.filter(agent => agent.status === 'error').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-card p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Agents</p>
            <p className="text-2xl font-bold text-blue-600">{activeAgents}</p>
          </div>
          <Activity className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
            <p className="text-2xl font-bold text-green-600">{totalRuns.toLocaleString()}</p>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="h-6 w-6 text-green-600" />
            <Rocket className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pending Actions</p>
            <p className="text-2xl font-bold text-orange-600">0</p>
          </div>
          <AlertTriangle className="h-8 w-8 text-orange-600" />
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Issues Detected</p>
            <p className="text-2xl font-bold text-red-600">{errorAgents}</p>
          </div>
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
      </div>
    </div>
  );
}