import { useState } from 'react';
import { AgentCard } from '../components/dashboard/AgentCard';
import { MetricsOverview } from '../components/dashboard/MetricsOverview';
import { ActivityLog } from '../components/dashboard/ActivityLog';
import { Header } from '../components/dashboard/Header';
import { useAgents, useActivityLogs, useDashboardMetrics } from '../hooks/useAgents';
import { useWebSocket } from '../hooks/useWebSocket';
import { useRealTimeActivityLogs, useRealTimeDashboardMetrics } from '../hooks/useRealTimeData';

interface DashboardAgent {
  id: string;
  name: string;
  type: string;
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

export function Dashboard() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // API data
  const { 
    agents, 
    isLoading: agentsLoading, 
    error: agentsError, 
    startAgent, 
    stopAgent,
    isConnected 
  } = useAgents();

  const { logs: activityLogs, isLoading: logsLoading } = useActivityLogs(50);
  const { metrics: dashboardMetrics, isLoading: metricsLoading } = useDashboardMetrics();

  // WebSocket connection
  const { state: wsState } = useWebSocket();

  // Real-time updates
  const { logs: realtimeLogs } = useRealTimeActivityLogs(50);
  const { metrics: realtimeMetrics } = useRealTimeDashboardMetrics();

  // Combine API and real-time logs (real-time takes precedence)
  const combinedLogs = realtimeLogs.length > 0 ? realtimeLogs : activityLogs;
  
  // Use real-time metrics if available, otherwise fall back to API metrics
  const currentMetrics = realtimeMetrics || dashboardMetrics;

  // Transform agents to match the expected interface
  const dashboardAgents: DashboardAgent[] = agents.map(agent => ({
    id: agent.id,
    name: agent.name,
    type: agent.type,
    status: agent.status as any,
    lastRun: agent.lastRun,
    nextRun: agent.nextRun,
    config: agent.configuration || {},
    metrics: {
      runs: agent.metrics?.totalRuns || 0,
      successRate: agent.metrics?.successRate || 0,
      averageRunTime: agent.metrics?.averageRunTime || 0,
      lastError: agent.metrics?.errorCount ? 'Recent errors detected' : undefined,
      dataPoints: []
    }
  }));

  const handleStartAgent = async (agentId: string) => {
    try {
      await startAgent(agentId);
      console.log(`✅ Started agent: ${agentId}`);
    } catch (error) {
      console.error(`❌ Failed to start agent ${agentId}:`, error);
    }
  };

  const handleStopAgent = async (agentId: string) => {
    try {
      await stopAgent(agentId);
      console.log(`🛑 Stopped agent: ${agentId}`);
    } catch (error) {
      console.error(`❌ Failed to stop agent ${agentId}:`, error);
    }
  };

  if (agentsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Dashboard</h2>
          <p className="text-muted-foreground mb-4">
            {agentsError instanceof Error ? agentsError.message : 'Failed to connect to server'}
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Connection Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </p>
            <p className="text-sm text-muted-foreground">
              WebSocket: {wsState.isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Connection Status */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <span className={`flex items-center space-x-1 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>API: {isConnected ? 'Connected' : 'Disconnected'}</span>
            </span>
            <span className={`flex items-center space-x-1 ${wsState.isConnected ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full ${wsState.isConnected ? 'bg-green-500' : 'bg-red-500'} ${wsState.isConnected ? 'animate-pulse' : ''}`}></div>
              <span>WebSocket: {wsState.isConnected ? 'Connected' : 'Disconnected'}</span>
            </span>
            {wsState.lastError && (
              <span className="text-red-600 text-xs">
                Error: {wsState.lastError}
              </span>
            )}
          </div>
          
          {agentsLoading && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>Loading agents...</span>
            </div>
          )}
        </div>

        {/* Metrics Overview */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">System Overview</h2>
          <MetricsOverview 
            agents={dashboardAgents} 
            isLoading={agentsLoading || metricsLoading} 
          />
          
          {/* Additional metrics from backend */}
          {currentMetrics && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Runs</p>
                    <p className="text-2xl font-bold text-blue-600">{currentMetrics.totalRuns || 0}</p>
                  </div>
                  <div className="text-3xl">🚀</div>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Health Score</p>
                    <p className="text-2xl font-bold text-green-600">{currentMetrics.healthScore || 0}%</p>
                  </div>
                  <div className="text-3xl">💚</div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Agents Grid */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">DevOps Agents ({dashboardAgents.length})</h2>
          
          {agentsLoading ? (
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
          ) : dashboardAgents.length > 0 ? (
            <div className="dashboard-grid">
              {dashboardAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isSelected={selectedAgent === agent.id}
                  onSelect={() => setSelectedAgent(
                    selectedAgent === agent.id ? null : agent.id
                  )}
                  onStart={() => handleStartAgent(agent.id)}
                  onStop={() => handleStopAgent(agent.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-lg font-medium mb-2">No Agents Available</h3>
              <p className="text-muted-foreground">
                The agent system is initializing. Please wait a moment and refresh.
              </p>
            </div>
          )}
        </section>

        {/* Activity Log */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            Recent Activity ({combinedLogs.length})
          </h2>
          <ActivityLog 
            logs={combinedLogs} 
            isLoading={logsLoading}
          />
        </section>
      </main>
    </div>
  );
}