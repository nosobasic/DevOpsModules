import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agentService } from '../services/agentService';
import type { Agent } from '../types';
import type { AgentType } from '../../shared/types';

interface UseAgentsReturn {
  agents: Agent[];
  isLoading: boolean;
  error: unknown;
  isConnected: boolean;
  startAgent: (agentId: string) => Promise<void>;
  stopAgent: (agentId: string) => Promise<void>;
  restartAgent: (agentId: string) => Promise<void>;
  configureAgent: (agentId: string, config: any) => Promise<void>;
  batchStartAgents: (agentIds: string[]) => Promise<void>;
  batchStopAgents: (agentIds: string[]) => Promise<void>;
  refreshAgents: () => void;
  searchAgents: (query: string, filters?: any) => Promise<Agent[]>;
}

export function useAgents(): UseAgentsReturn {
  const queryClient = useQueryClient();

  // Fetch agents
  const {
    data: agents = [],
    isLoading,
    error,
    refetch: refreshAgents
  } = useQuery({
    queryKey: ['agents'],
    queryFn: agentService.getAgents,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
    refetchOnWindowFocus: true
  });

  // Test connection
  const { data: isConnected = false } = useQuery({
    queryKey: ['connection'],
    queryFn: agentService.testConnection,
    staleTime: 30000,
    refetchInterval: 30000
  });

  // Start agent mutation
  const startAgentMutation = useMutation({
    mutationFn: agentService.startAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
    onError: (error) => {
      console.error('Failed to start agent:', error);
    }
  });

  // Stop agent mutation
  const stopAgentMutation = useMutation({
    mutationFn: agentService.stopAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
    onError: (error) => {
      console.error('Failed to stop agent:', error);
    }
  });

  // Restart agent mutation
  const restartAgentMutation = useMutation({
    mutationFn: agentService.restartAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
    onError: (error) => {
      console.error('Failed to restart agent:', error);
    }
  });

  // Configure agent mutation
  const configureAgentMutation = useMutation({
    mutationFn: ({ agentId, config }: { agentId: string; config: any }) =>
      agentService.configureAgent(agentId, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
    onError: (error) => {
      console.error('Failed to configure agent:', error);
    }
  });

  // Batch start agents mutation
  const batchStartMutation = useMutation({
    mutationFn: agentService.batchStartAgents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
    onError: (error) => {
      console.error('Failed to start agents:', error);
    }
  });

  // Batch stop agents mutation
  const batchStopMutation = useMutation({
    mutationFn: agentService.batchStopAgents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
    onError: (error) => {
      console.error('Failed to stop agents:', error);
    }
  });

  // Wrapper functions
  const startAgent = async (agentId: string) => {
    const result = await startAgentMutation.mutateAsync(agentId);
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  const stopAgent = async (agentId: string) => {
    const result = await stopAgentMutation.mutateAsync(agentId);
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  const restartAgent = async (agentId: string) => {
    const result = await restartAgentMutation.mutateAsync(agentId);
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  const configureAgent = async (agentId: string, config: any) => {
    const result = await configureAgentMutation.mutateAsync({ agentId, config });
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  const batchStartAgents = async (agentIds: string[]) => {
    const result = await batchStartMutation.mutateAsync(agentIds);
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  const batchStopAgents = async (agentIds: string[]) => {
    const result = await batchStopMutation.mutateAsync(agentIds);
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  const searchAgents = async (query: string, filters?: any) => {
    return agentService.searchAgents(query, filters);
  };

  return {
    agents,
    isLoading,
    error,
    isConnected,
    startAgent,
    stopAgent,
    restartAgent,
    configureAgent,
    batchStartAgents,
    batchStopAgents,
    refreshAgents,
    searchAgents
  };
}

// Hook for a single agent
export function useAgent(agentId: string) {
  const queryClient = useQueryClient();

  const {
    data: agent,
    isLoading,
    error
  } = useQuery({
    queryKey: ['agent', agentId],
    queryFn: () => agentService.getAgent(agentId),
    enabled: !!agentId,
    staleTime: 30000
  });

  // Agent metrics
  const {
    data: metrics,
    isLoading: metricsLoading
  } = useQuery({
    queryKey: ['agent-metrics', agentId],
    queryFn: () => agentService.getAgentMetrics(agentId),
    enabled: !!agentId,
    staleTime: 30000,
    refetchInterval: 60000
  });

  // Agent logs
  const {
    data: logs = [],
    isLoading: logsLoading
  } = useQuery({
    queryKey: ['agent-logs', agentId],
    queryFn: () => agentService.getAgentLogs(agentId),
    enabled: !!agentId,
    staleTime: 30000
  });

  const refreshAgent = () => {
    queryClient.invalidateQueries({ queryKey: ['agent', agentId] });
    queryClient.invalidateQueries({ queryKey: ['agent-metrics', agentId] });
    queryClient.invalidateQueries({ queryKey: ['agent-logs', agentId] });
  };

  return {
    agent,
    metrics,
    logs,
    isLoading,
    metricsLoading,
    logsLoading,
    error,
    refreshAgent
  };
}

// Hook for dashboard metrics
export function useDashboardMetrics() {
  const {
    data: metrics,
    isLoading,
    error
  } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: agentService.getDashboardMetrics,
    staleTime: 30000,
    refetchInterval: 60000
  });

  return {
    metrics,
    isLoading,
    error
  };
}

// Hook for activity logs
export function useActivityLogs(limit: number = 100) {
  const {
    data: logs = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['activity-logs', limit],
    queryFn: () => agentService.getActivityLogs(limit),
    staleTime: 30000,
    refetchInterval: 30000
  });

  return {
    logs,
    isLoading,
    error
  };
}

// Hook for filtering agents
export function useFilteredAgents(filters: {
  status?: string;
  type?: AgentType;
  search?: string;
}) {
  const { agents, isLoading, error } = useAgents();

  const filteredAgents = agents.filter(agent => {
    if (filters.status && agent.status !== filters.status) return false;
    if (filters.type && agent.type !== filters.type) return false;
    if (filters.search && !agent.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return {
    agents: filteredAgents,
    isLoading,
    error
  };
}

// Hook for agent statistics
export function useAgentStats() {
  const { agents, isLoading } = useAgents();

  const stats = {
    total: agents.length,
    active: agents.filter(a => a.status === 'active').length,
    inactive: agents.filter(a => a.status === 'inactive').length,
    error: agents.filter(a => a.status === 'error').length,
    avgSuccessRate: agents.length > 0 
      ? agents.reduce((sum, agent) => sum + (agent.metrics?.successRate || 0), 0) / agents.length
      : 0,
    totalRuns: agents.reduce((sum, agent) => sum + (agent.metrics?.totalRuns || 0), 0)
  };

  return {
    stats,
    isLoading
  };
}