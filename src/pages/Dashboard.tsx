import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AgentCard } from '../components/dashboard/AgentCard';
import { MetricsOverview } from '../components/dashboard/MetricsOverview';
import { ActivityLog } from '../components/dashboard/ActivityLog';
import { Header } from '../components/dashboard/Header';
import { SettingsPanel } from '../components/dashboard/SettingsPanel';
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

interface ActivityEvent {
  id: string;
  timestamp: Date;
  type: 'agent_start' | 'agent_stop' | 'agent_success' | 'agent_error' | 'config_update';
  agentId?: string;
  agentName?: string;
  message: string;
  details?: any;
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

async function configureAgent(agentType: string, config: any): Promise<boolean> {
  try {
    const apiUrl = configManager.getApiUrl();
    const response = await fetch(`${apiUrl}/api/agents/${agentType}/configure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Failed to configure agent:', error);
    return false;
  }
}

async function fetchActivityLog(): Promise<ActivityEvent[]> {
  try {
    const apiUrl = configManager.getApiUrl();
    const response = await fetch(`${apiUrl}/api/dashboard/logs`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch activity log:', error);
    return [];
  }
}

export function Dashboard() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [alerts, setAlerts] = useState([
    {
      id: '1',
      type: 'critical' as const,
      title: 'Critical Revenue Decline Detected',
      message: 'Revenue has dropped 40% below target. Immediate action required.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      agentId: 'kpi-tracker',
      agentName: 'KPI Tracker',
      isRead: false,
      category: 'business' as const,
      actions: [
        {
          id: 'action-1',
          label: 'Implement Revenue Recovery Plan',
          action: 'revenue_recovery',
          priority: 'urgent' as const,
          estimatedTime: '2-4 hours',
          impact: '20-35% revenue recovery'
        },
        {
          id: 'action-2',
          label: 'Launch Emergency Marketing Campaign',
          action: 'emergency_marketing',
          priority: 'high' as const,
          estimatedTime: '1-2 hours',
          impact: '15-25% immediate boost'
        }
      ]
    },
    {
      id: '2',
      type: 'high' as const,
      title: 'System Performance Degradation',
      message: 'Response times have increased by 300%. User experience is being impacted.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      agentId: 'health-monitor',
      agentName: 'Health Monitor',
      isRead: false,
      category: 'performance' as const,
      actions: [
        {
          id: 'action-3',
          label: 'Scale Infrastructure Resources',
          action: 'scale_infrastructure',
          priority: 'high' as const,
          estimatedTime: '30 minutes',
          impact: 'Immediate performance improvement'
        }
      ]
    },
    {
      id: '3',
      type: 'medium' as const,
      title: 'Conversion Rate Optimization Opportunity',
      message: 'A/B test results show 25% improvement potential in checkout flow.',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      agentId: 'funnel-tester',
      agentName: 'Funnel Tester',
      isRead: false,
      category: 'business' as const,
      actions: [
        {
          id: 'action-4',
          label: 'Implement Winning Variant',
          action: 'implement_ab_test',
          priority: 'medium' as const,
          estimatedTime: '1 hour',
          impact: '25% conversion improvement'
        }
      ]
    }
  ]);
  const queryClient = useQueryClient();

  const { data: agents = [], isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
    refetchInterval: 5000 // Refetch every 5 seconds
  });

  const { data: activityLog = [] } = useQuery({
    queryKey: ['activity-log'],
    queryFn: fetchActivityLog,
    refetchInterval: 10000 // Refetch every 10 seconds
  });

  const startMutation = useMutation({
    mutationFn: startAgent,
    onSuccess: (_, agentType) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      // Add activity event
      const agent = agents.find(a => a.type === agentType);
      setActivityEvents(prev => [{
        id: Date.now().toString(),
        timestamp: new Date(),
        type: 'agent_start',
        agentId: agentType,
        agentName: agent?.name,
        message: `${agent?.name || agentType} started monitoring`
      }, ...prev.slice(0, 49)]); // Keep last 50 events
    }
  });

  const stopMutation = useMutation({
    mutationFn: stopAgent,
    onSuccess: (_, agentType) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      // Add activity event
      const agent = agents.find(a => a.type === agentType);
      setActivityEvents(prev => [{
        id: Date.now().toString(),
        timestamp: new Date(),
        type: 'agent_stop',
        agentId: agentType,
        agentName: agent?.name,
        message: `${agent?.name || agentType} stopped monitoring`
      }, ...prev.slice(0, 49)]);
    }
  });

  const configureMutation = useMutation({
    mutationFn: ({ agentType, config }: { agentType: string; config: any }) => 
      configureAgent(agentType, config),
    onSuccess: (_, { agentType, config }) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      // Add activity event
      const agent = agents.find(a => a.type === agentType);
      setActivityEvents(prev => [{
        id: Date.now().toString(),
        timestamp: new Date(),
        type: 'config_update',
        agentId: agentType,
        agentName: agent?.name,
        message: `${agent?.name || agentType} configuration updated`,
        details: config
      }, ...prev.slice(0, 49)]);
    }
  });

  const handleStartAgent = (agentType: string) => {
    startMutation.mutate(agentType);
  };

  const handleStopAgent = (agentType: string) => {
    stopMutation.mutate(agentType);
  };

  const handleConfigureAgent = (config: any) => {
    const agentType = config.id;
    configureMutation.mutate({ agentType, config });
  };

  const handleSaveSettings = (settings: any) => {
    console.log('Settings saved:', settings);
    // Here you would typically save settings to backend
    // For now, we'll just log them
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const handleActionAlert = (actionId: string, alertId: string) => {
    console.log(`Taking action ${actionId} for alert ${alertId}`);
    // Here you would typically trigger the action
    // For now, we'll just log it and mark the alert as read
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  // Combine server activity log with local events
  const allActivityEvents = [...activityEvents, ...activityLog].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

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
      <Header 
        onSettingsClick={() => setShowSettings(true)}
        alerts={alerts}
        onDismissAlert={handleDismissAlert}
        onActionAlert={handleActionAlert}
      />
      
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
                  onConfigure={handleConfigureAgent}
                  isLoading={startMutation.isPending || stopMutation.isPending || configureMutation.isPending}
                />
              ))}
            </div>
          )}
        </section>

        {/* Activity Log */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <ActivityLog events={allActivityEvents} />
        </section>
      </main>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSaveSettings}
      />
    </div>
  );
}