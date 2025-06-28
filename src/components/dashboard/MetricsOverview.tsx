

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
  isLoading: boolean;
}

export function MetricsOverview({ agents, isLoading }: MetricsOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="metric-card animate-pulse">
            <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-muted rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const totalAgents = agents.length;
  const activeAgents = agents.filter(agent => 
    agent.status === 'active' || agent.status === 'running'
  ).length;
  const errorAgents = agents.filter(agent => agent.status === 'error').length;
  const averageSuccessRate = agents.length > 0 
    ? agents.reduce((sum, agent) => sum + agent.metrics.successRate, 0) / agents.length
    : 0;
  const totalRuns = agents.reduce((sum, agent) => sum + agent.metrics.runs, 0);

  const metrics = [
    {
      label: 'Total Agents',
      value: totalAgents,
      icon: '🤖',
      color: 'text-blue-600'
    },
    {
      label: 'Active Agents',
      value: activeAgents,
      icon: '🟢',
      color: 'text-green-600'
    },
    {
      label: 'System Health',
      value: `${averageSuccessRate.toFixed(1)}%`,
      icon: '💚',
      color: 'text-emerald-600'
    },
    {
      label: 'Total Runs',
      value: totalRuns.toLocaleString(),
      icon: '🚀',
      color: 'text-purple-600'
    }
  ];

  if (errorAgents > 0) {
    metrics[2] = {
      label: 'Agents in Error',
      value: errorAgents,
      icon: '⚠️',
      color: 'text-red-600'
    };
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </p>
              <p className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </p>
            </div>
            <div className="text-3xl">{metric.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}