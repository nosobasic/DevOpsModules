import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'agent_start' | 'agent_stop' | 'metric_update' | 'error' | 'success';
  agent: string;
  message: string;
  timestamp: string;
}

// Mock activity data
const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'success',
    agent: 'kpi-tracker',
    message: 'KPI Tracker completed data collection successfully',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    type: 'agent_start',
    agent: 'revenue-ripple',
    message: 'Revenue Ripple Tracker started monitoring',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    type: 'metric_update',
    agent: 'ab-optimizer',
    message: 'A/B test results updated - Test #AB-2024-001 completed',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    type: 'error',
    agent: 'funnel-tester',
    message: 'Connection timeout to analytics API',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    type: 'agent_stop',
    agent: 'webhook-validator',
    message: 'Webhook Validator stopped by user',
    timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString()
  }
];

export function ActivityLog() {
  const getActivityIcon = (type: string) => {
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
      default:
        return 'ℹ️';
    }
  };

  const getActivityColor = (type: string) => {
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
      default:
        return 'text-gray-500';
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
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="text-lg flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {activity.message}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-xs font-medium ${getActivityColor(activity.type)}`}>
                    {activity.type.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {activity.agent}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {mockActivities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
}