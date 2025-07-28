import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, AlertCircle, Info, X, CheckCircle, Clock } from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: Date;
  agentId?: string;
  agentName?: string;
  actions?: AlertAction[];
  isRead: boolean;
  category: 'performance' | 'security' | 'business' | 'system';
}

interface AlertAction {
  id: string;
  label: string;
  action: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  estimatedTime: string;
  impact: string;
}

interface NotificationSystemProps {
  alerts?: Alert[];
  onDismiss?: (alertId: string) => void;
  onAction?: (actionId: string, alertId: string) => void;
}

export function NotificationSystem({ alerts = [], onDismiss, onAction }: NotificationSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unread = alerts.filter(alert => !alert.isRead).length;
    setUnreadCount(unread);
  }, [alerts]);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'high':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'medium':
        return <Info className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'high':
        return 'border-orange-200 bg-orange-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: AlertAction['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const handleAction = (actionId: string, alertId: string) => {
    onAction?.(actionId, alertId);
  };

  const handleDismiss = (alertId: string) => {
    onDismiss?.(alertId);
  };

  const criticalAlerts = alerts.filter(a => a.type === 'critical' && !a.isRead);
  const highAlerts = alerts.filter(a => a.type === 'high' && !a.isRead);
  const mediumAlerts = alerts.filter(a => a.type === 'medium' && !a.isRead);

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Critical Alerts */}
            {criticalAlerts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Critical Alerts ({criticalAlerts.length})
                </h4>
                <div className="space-y-3">
                  {criticalAlerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <h5 className="text-sm font-medium text-gray-900">{alert.title}</h5>
                            <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                            {alert.agentName && (
                              <p className="text-xs text-gray-500 mt-1">
                                Agent: {alert.agentName}
                              </p>
                            )}
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTimeAgo(alert.timestamp)}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDismiss(alert.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Actions */}
                      {alert.actions && alert.actions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <h6 className="text-xs font-medium text-gray-700">Recommended Actions:</h6>
                          {alert.actions.map(action => (
                            <div
                              key={action.id}
                              className="flex items-center justify-between p-2 bg-white rounded border"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{action.label}</p>
                                <p className="text-xs text-gray-600">{action.impact}</p>
                                <div className="flex items-center mt-1 space-x-2">
                                  <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(action.priority)}`}>
                                    {action.priority}
                                  </span>
                                  <span className="text-xs text-gray-500">~{action.estimatedTime}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleAction(action.id, alert.id)}
                                className="ml-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                              >
                                Take Action
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* High Priority Alerts */}
            {highAlerts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-orange-700 mb-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  High Priority ({highAlerts.length})
                </h4>
                <div className="space-y-3">
                  {highAlerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <h5 className="text-sm font-medium text-gray-900">{alert.title}</h5>
                            <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                            {alert.agentName && (
                              <p className="text-xs text-gray-500 mt-1">
                                Agent: {alert.agentName}
                              </p>
                            )}
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTimeAgo(alert.timestamp)}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDismiss(alert.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Actions */}
                      {alert.actions && alert.actions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <h6 className="text-xs font-medium text-gray-700">Recommended Actions:</h6>
                          {alert.actions.map(action => (
                            <div
                              key={action.id}
                              className="flex items-center justify-between p-2 bg-white rounded border"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{action.label}</p>
                                <p className="text-xs text-gray-600">{action.impact}</p>
                                <div className="flex items-center mt-1 space-x-2">
                                  <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(action.priority)}`}>
                                    {action.priority}
                                  </span>
                                  <span className="text-xs text-gray-500">~{action.estimatedTime}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleAction(action.id, alert.id)}
                                className="ml-2 px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                              >
                                Take Action
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Medium Priority Alerts */}
            {mediumAlerts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-yellow-700 mb-2 flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  Medium Priority ({mediumAlerts.length})
                </h4>
                <div className="space-y-3">
                  {mediumAlerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <h5 className="text-sm font-medium text-gray-900">{alert.title}</h5>
                            <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                            {alert.agentName && (
                              <p className="text-xs text-gray-500 mt-1">
                                Agent: {alert.agentName}
                              </p>
                            )}
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTimeAgo(alert.timestamp)}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDismiss(alert.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Actions */}
                      {alert.actions && alert.actions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <h6 className="text-xs font-medium text-gray-700">Recommended Actions:</h6>
                          {alert.actions.map(action => (
                            <div
                              key={action.id}
                              className="flex items-center justify-between p-2 bg-white rounded border"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{action.label}</p>
                                <p className="text-xs text-gray-600">{action.impact}</p>
                                <div className="flex items-center mt-1 space-x-2">
                                  <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(action.priority)}`}>
                                    {action.priority}
                                  </span>
                                  <span className="text-xs text-gray-500">~{action.estimatedTime}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleAction(action.id, alert.id)}
                                className="ml-2 px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                              >
                                Take Action
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Alerts */}
            {unreadCount === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-500">No new alerts</p>
                <p className="text-sm text-gray-400">All systems are running smoothly</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 