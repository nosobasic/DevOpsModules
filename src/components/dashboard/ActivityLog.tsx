import { formatDistanceToNow } from 'date-fns';

interface ActivityEvent {
  id: string;
  timestamp: Date;
  type: 'agent_start' | 'agent_stop' | 'agent_success' | 'agent_error' | 'config_update' | 'metric_update' | 'error' | 'success';
  agentId?: string;
  agentName?: string;
  message: string;
  details?: any;
}

interface ActivityLogProps {
  events?: ActivityEvent[];
}

export function ActivityLog({ events = [] }: ActivityLogProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
      case 'agent_success':
        return '✅';
      case 'error':
      case 'agent_error':
        return '❌';
      case 'agent_start':
        return '🚀';
      case 'agent_stop':
        return '🛑';
      case 'metric_update':
        return '📊';
      case 'config_update':
        return '⚙️';
      default:
        return 'ℹ️';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success':
      case 'agent_success':
        return 'text-green-600';
      case 'error':
      case 'agent_error':
        return 'text-red-600';
      case 'agent_start':
        return 'text-blue-600';
      case 'agent_stop':
        return 'text-gray-600';
      case 'metric_update':
        return 'text-purple-600';
      case 'config_update':
        return 'text-orange-600';
      default:
        return 'text-gray-500';
    }
  };

  const getActivityType = (type: string) => {
    switch (type) {
      case 'agent_start':
        return 'AGENT START';
      case 'agent_stop':
        return 'AGENT STOP';
      case 'agent_success':
        return 'SUCCESS';
      case 'agent_error':
        return 'ERROR';
      case 'config_update':
        return 'CONFIG UPDATE';
      case 'metric_update':
        return 'METRIC UPDATE';
      default:
        return type.toUpperCase();
    }
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Activity Log</h3>
          <button className="text-sm text-muted-foreground hover:text-foreground">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="text-lg flex-shrink-0">
                  {getActivityIcon(event.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {event.message}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs font-medium ${getActivityColor(event.type)}`}>
                      {getActivityType(event.type)}
                    </span>
                    {event.agentName && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {event.agentName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}