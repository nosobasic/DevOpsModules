import { useEffect, useRef, useState, useCallback } from 'react';
import { websocketService } from '../services/websocket';
import type { AgentType, AgentStatus } from '../../shared/types';

interface WebSocketState {
  isConnected: boolean;
  isReconnecting: boolean;
  lastError: string | null;
  connectionAttempts: number;
}

interface UseWebSocketReturn {
  state: WebSocketState;
  startAgent: (agentType: AgentType) => void;
  stopAgent: (agentType: AgentType) => void;
  configureAgent: (agentType: AgentType, config: any) => void;
  reconnect: () => void;
  disconnect: () => void;
}

export function useWebSocket(): UseWebSocketReturn {
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isReconnecting: false,
    lastError: null,
    connectionAttempts: 0
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  // Event handlers
  const handleConnect = useCallback(() => {
    setState(prev => ({
      ...prev,
      isConnected: true,
      isReconnecting: false,
      lastError: null,
      connectionAttempts: 0
    }));
    console.log('WebSocket connected');
  }, []);

  const handleDisconnect = useCallback(() => {
    setState(prev => ({
      ...prev,
      isConnected: false,
      isReconnecting: false
    }));
    console.log('WebSocket disconnected');
  }, []);

  const handleReconnect = useCallback(() => {
    setState(prev => ({
      ...prev,
      isConnected: true,
      isReconnecting: false,
      lastError: null
    }));
    console.log('WebSocket reconnected');
  }, []);

  const handleReconnectError = useCallback((error: Error) => {
    setState(prev => ({
      ...prev,
      isReconnecting: false,
      lastError: error.message,
      connectionAttempts: prev.connectionAttempts + 1
    }));
    console.error('WebSocket reconnection error:', error);
  }, []);

  // Setup WebSocket listeners
  useEffect(() => {
    websocketService.on('connect', handleConnect);
    websocketService.on('disconnect', handleDisconnect);
    websocketService.on('reconnect', handleReconnect);
    websocketService.on('reconnect_error', handleReconnectError);

    // Set initial connection state
    setState(prev => ({
      ...prev,
      isConnected: websocketService.getConnectionStatus()
    }));

    return () => {
      websocketService.off('connect', handleConnect);
      websocketService.off('disconnect', handleDisconnect);
      websocketService.off('reconnect', handleReconnect);
      websocketService.off('reconnect_error', handleReconnectError);
    };
  }, [handleConnect, handleDisconnect, handleReconnect, handleReconnectError]);

  // Agent control functions
  const startAgent = useCallback((agentType: AgentType) => {
    if (state.isConnected) {
      websocketService.startAgent(agentType);
    } else {
      console.warn('Cannot start agent: WebSocket not connected');
    }
  }, [state.isConnected]);

  const stopAgent = useCallback((agentType: AgentType) => {
    if (state.isConnected) {
      websocketService.stopAgent(agentType);
    } else {
      console.warn('Cannot stop agent: WebSocket not connected');
    }
  }, [state.isConnected]);

  const configureAgent = useCallback((agentType: AgentType, config: any) => {
    if (state.isConnected) {
      websocketService.configureAgent(agentType, config);
    } else {
      console.warn('Cannot configure agent: WebSocket not connected');
    }
  }, [state.isConnected]);

  const reconnect = useCallback(() => {
    setState(prev => ({
      ...prev,
      isReconnecting: true,
      lastError: null
    }));
    websocketService.reconnect();
  }, []);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
  }, []);

  return {
    state,
    startAgent,
    stopAgent,
    configureAgent,
    reconnect,
    disconnect
  };
}

// Hook for listening to specific WebSocket events
export function useWebSocketEvent<T = any>(
  eventName: string,
  callback: (data: T) => void,
  deps: any[] = []
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const handler = (data: T) => {
      callbackRef.current(data);
    };

    websocketService.on(eventName as any, handler);

    return () => {
      websocketService.off(eventName as any, handler);
    };
  }, deps);
}

// Hook for agent-specific events
export function useAgentEvents(agentType: AgentType) {
  const [agentData, setAgentData] = useState<any>(null);
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const [agentError, setAgentError] = useState<string | null>(null);

  useWebSocketEvent('agent:started', (data: { agentType: AgentType; status: AgentStatus }) => {
    if (data.agentType === agentType) {
      setAgentStatus(data.status);
      setAgentError(null);
    }
  });

  useWebSocketEvent('agent:stopped', (data: { agentType: AgentType; status: AgentStatus }) => {
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

// Hook for real-time metrics
export function useRealtimeMetrics() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<any>(null);

  useWebSocketEvent('agents:metrics', (data: any[]) => {
    setMetrics(data);
  });

  useWebSocketEvent('dashboard:metrics', (data: any) => {
    setDashboardMetrics(data);
  });

  return {
    metrics,
    dashboardMetrics
  };
}

// Hook for activity logs
export function useActivityLog() {
  const [activities, setActivities] = useState<any[]>([]);
  const maxActivities = 100;

  useWebSocketEvent('activity:log', (data: any) => {
    setActivities(prev => {
      const newActivities = [data, ...prev];
      return newActivities.slice(0, maxActivities);
    });
  });

  const clearActivities = useCallback(() => {
    setActivities([]);
  }, []);

  return {
    activities,
    clearActivities
  };
}