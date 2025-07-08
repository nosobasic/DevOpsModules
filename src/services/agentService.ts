import { apiClient } from '../lib/api';
import type { Agent } from '../types';
import type { AgentType, AgentStatus } from '../../shared/types';

interface AgentOperation {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

interface AgentMetrics {
  type: AgentType;
  name: string;
  metrics: {
    runs: number;
    successRate: number;
    averageRunTime: number;
    lastError?: string;
    dataPoints: any[];
  };
}

class AgentService {
  private cache = new Map<string, any>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  /**
   * Get all agents from the API
   */
  async getAgents(): Promise<Agent[]> {
    try {
      const cacheKey = 'agents';
      
      // Check cache first
      if (this.isCacheValid(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const agents = await apiClient.getAgents();
      this.setCache(cacheKey, agents);
      return agents;
    } catch (error) {
      console.error('Error fetching agents:', error);
      
      // Return cached data if available
      if (this.cache.has('agents')) {
        console.warn('Using cached agents due to API error');
        return this.cache.get('agents');
      }
      
      throw error;
    }
  }

  /**
   * Get a specific agent by ID
   */
  async getAgent(agentId: string): Promise<Agent | null> {
    try {
      const agent = await apiClient.getAgent(agentId);
      return agent;
    } catch (error) {
      console.error('Error fetching agent:', error);
      return null;
    }
  }

  /**
   * Start an agent
   */
  async startAgent(agentId: string): Promise<AgentOperation> {
    try {
      await apiClient.startAgent(agentId);
      
      // Invalidate cache
      this.invalidateCache('agents');
      
      return {
        success: true,
        message: 'Agent started successfully'
      };
    } catch (error) {
      console.error('Error starting agent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error while starting agent'
      };
    }
  }

  /**
   * Stop an agent
   */
  async stopAgent(agentId: string): Promise<AgentOperation> {
    try {
      await apiClient.stopAgent(agentId);
      
      // Invalidate cache
      this.invalidateCache('agents');
      
      return {
        success: true,
        message: 'Agent stopped successfully'
      };
    } catch (error) {
      console.error('Error stopping agent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error while stopping agent'
      };
    }
  }

  /**
   * Restart an agent
   */
  async restartAgent(agentId: string): Promise<AgentOperation> {
    try {
      await apiClient.restartAgent(agentId);
      
      // Invalidate cache
      this.invalidateCache('agents');
      
      return {
        success: true,
        message: 'Agent restarted successfully'
      };
    } catch (error) {
      console.error('Error restarting agent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error while restarting agent'
      };
    }
  }

  /**
   * Update an agent configuration
   */
  async configureAgent(agentId: string, config: any): Promise<AgentOperation> {
    try {
      await apiClient.updateAgent(agentId, { configuration: config });
      
      // Invalidate cache
      this.invalidateCache('agents');
      
      return {
        success: true,
        message: 'Agent configured successfully'
      };
    } catch (error) {
      console.error('Error configuring agent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error while configuring agent'
      };
    }
  }

  /**
   * Get agent metrics
   */
  async getAgentMetrics(agentId: string, period: string = '24h'): Promise<any> {
    try {
      const cacheKey = `agent-metrics-${agentId}-${period}`;
      
      // Check cache first
      if (this.isCacheValid(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const metrics = await apiClient.getAgentMetrics(agentId, period);
      this.setCache(cacheKey, metrics);
      return metrics;
    } catch (error) {
      console.error('Error fetching agent metrics:', error);
      
      // Return cached data if available
      const cacheKey = `agent-metrics-${agentId}-${period}`;
      if (this.cache.has(cacheKey)) {
        console.warn('Using cached agent metrics due to API error');
        return this.cache.get(cacheKey);
      }
      
      throw error;
    }
  }

  /**
   * Get dashboard metrics
   */
  async getDashboardMetrics(): Promise<any> {
    try {
      const cacheKey = 'dashboard-metrics';
      
      // Check cache first
      if (this.isCacheValid(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const metrics = await apiClient.getDashboardMetrics();
      this.setCache(cacheKey, metrics);
      return metrics;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      
      // Return cached data if available
      if (this.cache.has('dashboard-metrics')) {
        console.warn('Using cached dashboard metrics due to API error');
        return this.cache.get('dashboard-metrics');
      }
      
      throw error;
    }
  }

  /**
   * Get activity logs
   */
  async getActivityLogs(limit: number = 100, offset: number = 0): Promise<any[]> {
    try {
      const logs = await apiClient.getActivityLogs(limit, offset);
      return logs;
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return [];
    }
  }

  /**
   * Get agent-specific logs
   */
  async getAgentLogs(agentId: string, limit: number = 100): Promise<any[]> {
    try {
      const logs = await apiClient.getAgentLogs(agentId, limit);
      return logs;
    } catch (error) {
      console.error('Error fetching agent logs:', error);
      return [];
    }
  }

  /**
   * Batch operation for multiple agents
   */
  async batchStartAgents(agentIds: string[]): Promise<AgentOperation> {
    try {
      await apiClient.bulkStartAgents(agentIds);
      
      // Invalidate cache
      this.invalidateCache('agents');
      
      return {
        success: true,
        message: `${agentIds.length} agents started successfully`
      };
    } catch (error) {
      console.error('Error starting agents:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error while starting agents'
      };
    }
  }

  /**
   * Batch stop agents
   */
  async batchStopAgents(agentIds: string[]): Promise<AgentOperation> {
    try {
      await apiClient.bulkStopAgents(agentIds);
      
      // Invalidate cache
      this.invalidateCache('agents');
      
      return {
        success: true,
        message: `${agentIds.length} agents stopped successfully`
      };
    } catch (error) {
      console.error('Error stopping agents:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error while stopping agents'
      };
    }
  }

  /**
   * Search agents
   */
  async searchAgents(query: string, filters?: any): Promise<Agent[]> {
    try {
      const agents = await apiClient.searchAgents(query, filters);
      return agents;
    } catch (error) {
      console.error('Error searching agents:', error);
      return [];
    }
  }

  /**
   * Test connection to backend
   */
  async testConnection(): Promise<boolean> {
    try {
      return await apiClient.testConnection();
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Cache management
   */
  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
  }

  private invalidateCache(key: string): void {
    this.cache.delete(key);
    this.cacheExpiry.delete(key);
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

// Singleton instance
export const agentService = new AgentService();
export default agentService;