import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  timestamp: string | Date;
  agentId?: string;
  agentName?: string;
  action?: string;
  type?: 'agent_start' | 'agent_stop' | 'metric_update' | 'error' | 'success';
  status?: 'success' | 'error' | 'warning';
  message: string;
  details?: Record<string, any>;
}

interface ActivityLogProps {
  logs?: Activity[];
  isLoading?: boolean;
  maxItems?: number;
}

export function ActivityLog({ logs = [], isLoading = false, maxItems = 20 }: ActivityLogProps) {
  const getActivityIcon = (activity: Activity) => {
    const type = activity.type || activity.status;
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'agent_start':
        return '🚀';
      case 'agent_stop':
        return '🛑';
      case 'metric_update':
        return '📊';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getActivityColor = (activity: Activity) => {
    const type = activity.type || activity.status;
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'agent_start':
        return 'text-blue-600';
      case 'agent_stop':
        return 'text-gray-600';
      case 'metric_update':
        return 'text-purple-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-gray-500';
    }
  };

  const displayLogs = logs.slice(0, maxItems);

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Activity Log</h3>
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded-lg animate-pulse">
                <div className="w-6 h-6 bg-muted rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
          {displayLogs.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="text-lg flex-shrink-0">
                {getActivityIcon(activity)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {activity.message}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(
                      new Date(activity.timestamp), 
                      { addSuffix: true }
                    )}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-xs font-medium ${getActivityColor(activity)}`}>
                    {(activity.type || activity.status || 'info').replace('_', ' ').toUpperCase()}
                  </span>
                  {activity.agentName && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {activity.agentName}
                      </span>
                    </>
                  )}
                  {activity.details?.executionTime && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {activity.details.executionTime}ms
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {displayLogs.length === 0 && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">📝</div>
            <p>No recent activity</p>
            <p className="text-sm mt-1">Agent activities will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}