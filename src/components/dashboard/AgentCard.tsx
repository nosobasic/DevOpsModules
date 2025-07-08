import { formatDistanceToNow } from 'date-fns';

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'running' | 'error' | 'paused';
  lastRun?: Date;
  nextRun?: Date;
  metrics: {
    runs: number;
    successRate: number;
    averageRunTime: number;
    lastError?: string;
  };
}

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: () => void;
  onStart?: () => void | Promise<void>;
  onStop?: () => void | Promise<void>;
}

export function AgentCard({ agent, isSelected, onSelect, onStart, onStop }: AgentCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '🟢';
      case 'running':
        return '🔵';
      case 'error':
        return '🔴';
      case 'paused':
        return '🟡';
      default:
        return '⚪';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'running':
        return 'status-running';
      case 'error':
        return 'status-error';
      case 'paused':
        return 'status-indicator';
      default:
        return 'status-inactive';
    }
  };

  const isRunning = agent.status === 'active' || agent.status === 'running';

  const handleToggle = async () => {
    if (isRunning && onStop) {
      await onStop();
    } else if (!isRunning && onStart) {
      await onStart();
    }
  };

  return (
    <div
      className={`agent-card p-6 cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getStatusIcon(agent.status)}</span>
          <div>
            <h3 className="font-semibold text-lg">{agent.name}</h3>
            <span className={`status-indicator ${getStatusClass(agent.status)}`}>
              {agent.status}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Runs:</span>
            <div className="font-medium">{agent.metrics.runs}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Success Rate:</span>
            <div className="font-medium">{agent.metrics.successRate.toFixed(1)}%</div>
          </div>
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">Avg Runtime:</span>
          <div className="font-medium">{agent.metrics.averageRunTime}ms</div>
        </div>

        {agent.lastRun && (
          <div className="text-sm">
            <span className="text-muted-foreground">Last Run:</span>
            <div className="font-medium">
              {formatDistanceToNow(agent.lastRun, { addSuffix: true })}
            </div>
          </div>
        )}

        {agent.nextRun && agent.status === 'active' && (
          <div className="text-sm">
            <span className="text-muted-foreground">Next Run:</span>
            <div className="font-medium">
              {formatDistanceToNow(agent.nextRun, { addSuffix: true })}
            </div>
          </div>
        )}

        {agent.metrics.lastError && (
          <div className="text-sm p-2 bg-destructive/10 rounded border border-destructive/20">
            <span className="text-destructive font-medium">Error:</span>
            <div className="text-destructive text-xs mt-1">{agent.metrics.lastError}</div>
          </div>
        )}
      </div>

      <div className="mt-4 flex space-x-2" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={handleToggle}
          disabled={!onStart && !onStop}
          className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3"
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3">
          ⚙️
        </button>
      </div>
    </div>
  );
}