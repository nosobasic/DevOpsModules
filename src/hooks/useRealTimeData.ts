import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocketEvent } from './useWebSocket';
import { useQueryClient } from '@tanstack/react-query';
import type { AgentType } from '../../shared/types';

interface RealTimeDataState<T> {
  data: T | null;
  isConnected: boolean;
  lastUpdate: Date | null;
  error: string | null;
}

interface UseRealTimeDataReturn<T> {
  data: T | null;
  isConnected: boolean;
  lastUpdate: Date | null;
  error: string | null;
  subscribe: () => void;
  unsubscribe: () => void;
  clearData: () => void;
}

export function useRealTimeData<T = any>(
  eventName: string,
  options: {
    initialData?: T;
    retainHistory?: boolean;
    maxHistorySize?: number;
    autoSubscribe?: boolean;
  } = {}
): UseRealTimeDataReturn<T> {
  const {
    initialData = null,
    retainHistory = false,
    maxHistorySize = 100,
    autoSubscribe = true
  } = options;

  const [state, setState] = useState<RealTimeDataState<T>>({
    data: initialData,
    isConnected: false,
    lastUpdate: null,
    error: null
  });

  const historyRef = useRef<T[]>([]);
  const isSubscribedRef = useRef(false);

  const handleData = useCallback((newData: T) => {
    setState(prev => ({
      ...prev,
      data: newData,
      lastUpdate: new Date(),
      error: null
    }));

    if (retainHistory) {
      historyRef.current.push(newData);
      if (historyRef.current.length > maxHistorySize) {
        historyRef.current = historyRef.current.slice(-maxHistorySize);
      }
    }
  }, [retainHistory, maxHistorySize]);

  const handleConnect = useCallback(() => {
    setState(prev => ({
      ...prev,
      isConnected: true,
      error: null
    }));
  }, []);

  const handleDisconnect = useCallback(() => {
    setState(prev => ({
      ...prev,
      isConnected: false
    }));
  }, []);

  const handleError = useCallback((error: Error) => {
    setState(prev => ({
      ...prev,
      error: error.message,
      isConnected: false
    }));
  }, []);

  const subscribe = useCallback(() => {
    if (!isSubscribedRef.current) {
      isSubscribedRef.current = true;
    }
  }, []);

  const unsubscribe = useCallback(() => {
    if (isSubscribedRef.current) {
      isSubscribedRef.current = false;
      setState(prev => ({
        ...prev,
        isConnected: false
      }));
    }
  }, []);

  const clearData = useCallback(() => {
    setState(prev => ({
      ...prev,
      data: initialData,
      lastUpdate: null,
      error: null
    }));
    historyRef.current = [];
  }, [initialData]);

  // Auto-subscribe if enabled
  useEffect(() => {
    if (autoSubscribe) {
      subscribe();
    }
    return () => {
      if (autoSubscribe) {
        unsubscribe();
      }
    };
  }, [autoSubscribe, subscribe, unsubscribe]);

  // WebSocket event listeners
  useWebSocketEvent(eventName, handleData, [eventName]);
  useWebSocketEvent('connect', handleConnect);
  useWebSocketEvent('disconnect', handleDisconnect);
  useWebSocketEvent('reconnect_error', handleError);

  return {
    data: state.data,
    isConnected: state.isConnected,
    lastUpdate: state.lastUpdate,
    error: state.error,
    subscribe,
    unsubscribe,
    clearData
  };
}

// Hook for agent metrics in real-time
export function useRealTimeAgentMetrics() {
  const queryClient = useQueryClient();
  
  const { data: metrics, isConnected } = useRealTimeData<any[]>('agents:metrics', {
    initialData: [],
    retainHistory: false,
    autoSubscribe: true
  });

  // Update React Query cache when new metrics arrive
  useEffect(() => {
    if (metrics && Array.isArray(metrics)) {
      metrics.forEach(metric => {
        queryClient.setQueryData(['agent-metrics', metric.agentId], metric);
      });
    }
  }, [metrics, queryClient]);

  return {
    metrics: metrics || [],
    isConnected
  };
}

// Hook for dashboard metrics in real-time
export function useRealTimeDashboardMetrics() {
  const queryClient = useQueryClient();
  
  const { data: metrics, isConnected } = useRealTimeData('dashboard:metrics', {
    autoSubscribe: true
  });

  // Update React Query cache when new metrics arrive
  useEffect(() => {
    if (metrics) {
      queryClient.setQueryData(['dashboard-metrics'], metrics);
    }
  }, [metrics, queryClient]);

  return {
    metrics,
    isConnected
  };
}

// Hook for real-time activity logs
export function useRealTimeActivityLogs(maxLogs: number = 100) {
  const [logs, setLogs] = useState<any[]>([]);
  const queryClient = useQueryClient();

  const { isConnected } = useRealTimeData('activity:log', {
    autoSubscribe: true
  });

  useWebSocketEvent('activity:log', (newLog: any) => {
    setLogs(prev => {
      const newLogs = [newLog, ...prev];
      return newLogs.slice(0, maxLogs);
    });

    // Update React Query cache
    queryClient.setQueryData(['activity-logs'], (oldData: any[] = []) => {
      const newData = [newLog, ...oldData];
      return newData.slice(0, maxLogs);
    });
  });

  const clearLogs = useCallback(() => {
    setLogs([]);
    queryClient.setQueryData(['activity-logs'], []);
  }, [queryClient]);

  return {
    logs,
    isConnected,
    clearLogs
  };
}

// Hook for agent-specific real-time data
export function useRealTimeAgentData(agentType: AgentType) {
  const [agentData, setAgentData] = useState<any>(null);
  const [agentStatus, setAgentStatus] = useState<string | null>(null);
  const [agentError, setAgentError] = useState<string | null>(null);

  useWebSocketEvent('agent:started', (data: { agentType: AgentType; status: string }) => {
    if (data.agentType === agentType) {
      setAgentStatus(data.status);
      setAgentError(null);
    }
  });

  useWebSocketEvent('agent:stopped', (data: { agentType: AgentType; status: string }) => {
    if (data.agentType === agentType) {
      setAgentStatus(data.status);
      setAgentError(null);
    }
  });

  useWebSocketEvent('agent:error', (data: { agentType: AgentType; error: string }) => {
    if (data.agentType === agentType) {
      setAgentError(data.error);
    }
  });

  useWebSocketEvent('agent:data', (data: { agentType: AgentType; data: any }) => {
    if (data.agentType === agentType) {
      setAgentData(data.data);
    }
  });

  return {
    agentData,
    agentStatus,
    agentError
  };
}

// Hook for connection status monitoring
export function useConnectionStatus() {
  const [connectionHistory, setConnectionHistory] = useState<{ 
    timestamp: Date; 
    status: 'connected' | 'disconnected' | 'reconnecting' 
  }[]>([]);

  const { isConnected } = useRealTimeData('connection', {
    autoSubscribe: true
  });

  useWebSocketEvent('connect', () => {
    setConnectionHistory(prev => [...prev, { 
      timestamp: new Date(), 
      status: 'connected' as const
    }].slice(-10));
  });

  useWebSocketEvent('disconnect', () => {
    setConnectionHistory(prev => [...prev, { 
      timestamp: new Date(), 
      status: 'disconnected' as const
    }].slice(-10));
  });

  useWebSocketEvent('reconnect', () => {
    setConnectionHistory(prev => [...prev, { 
      timestamp: new Date(), 
      status: 'connected' as const
    }].slice(-10));
  });

  const getConnectionHealth = useCallback(() => {
    const recent = connectionHistory.slice(-5);
    const disconnects = recent.filter(h => h.status === 'disconnected').length;
    
    if (disconnects === 0) return 'excellent';
    if (disconnects <= 1) return 'good';
    if (disconnects <= 3) return 'fair';
    return 'poor';
  }, [connectionHistory]);

  return {
    isConnected,
    connectionHistory,
    connectionHealth: getConnectionHealth()
  };
}

// Hook for real-time system health
export function useSystemHealth() {
  const { metrics } = useRealTimeDashboardMetrics();
  const { isConnected } = useConnectionStatus();
  const { metrics: agentMetrics } = useRealTimeAgentMetrics();

  const getSystemHealth = useCallback(() => {
    if (!isConnected) return { status: 'down', score: 0 };

    let score = 100;
    let status = 'excellent';

    // Check agent health
    if (agentMetrics) {
      const errorAgents = agentMetrics.filter(a => a.status === 'error').length;
      const totalAgents = agentMetrics.length;
      
      if (totalAgents > 0) {
        const errorRate = errorAgents / totalAgents;
        if (errorRate > 0.5) {
          score -= 30;
          status = 'poor';
        } else if (errorRate > 0.2) {
          score -= 20;
          status = 'fair';
        } else if (errorRate > 0.1) {
          score -= 10;
          status = 'good';
        }
      }
    }

    // Check overall success rate
    if (metrics?.successRate) {
      if (metrics.successRate < 80) {
        score -= 25;
        status = 'poor';
      } else if (metrics.successRate < 90) {
        score -= 15;
        status = 'fair';
      } else if (metrics.successRate < 95) {
        score -= 5;
        status = 'good';
      }
    }

    return { status, score: Math.max(0, score) };
  }, [isConnected, agentMetrics, metrics]);

  return {
    health: getSystemHealth(),
    isConnected,
    metrics,
    agentMetrics
  };
}