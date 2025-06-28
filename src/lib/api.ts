import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { configManager, API_ENDPOINTS } from './config';
import type { 
  Agent, 
  DashboardMetrics, 
  ActivityLog, 
  WebhookEvent, 
  KPIData, 
  ABTestResult, 
  DeploymentStatus,
  IntegrationStatus
} from '../types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add API key and base URL
    this.client.interceptors.request.use((config) => {
      const { baseUrl, apiKey } = configManager.getConfig();
      
      if (baseUrl) {
        config.baseURL = baseUrl;
      }
      
      if (apiKey) {
        config.headers.Authorization = `Bearer ${apiKey}`;
      }

      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  // Generic API methods
  private async get<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url);
    return response.data;
  }

  private async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data);
    return response.data;
  }

  private async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data);
    return response.data;
  }

  private async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url);
    return response.data;
  }

  // Agent management
  async getAgents(): Promise<Agent[]> {
    return this.get<Agent[]>(API_ENDPOINTS.agents);
  }

  async getAgent(id: string): Promise<Agent> {
    return this.get<Agent>(`${API_ENDPOINTS.agents}/${id}`);
  }

  async createAgent(agent: Omit<Agent, 'id'>): Promise<Agent> {
    return this.post<Agent>(API_ENDPOINTS.agents, agent);
  }

  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
    return this.put<Agent>(`${API_ENDPOINTS.agents}/${id}`, updates);
  }

  async deleteAgent(id: string): Promise<void> {
    return this.delete<void>(`${API_ENDPOINTS.agents}/${id}`);
  }

  async startAgent(id: string): Promise<void> {
    return this.post<void>(`${API_ENDPOINTS.agents}/${id}/start`);
  }

  async stopAgent(id: string): Promise<void> {
    return this.post<void>(`${API_ENDPOINTS.agents}/${id}/stop`);
  }

  async restartAgent(id: string): Promise<void> {
    return this.post<void>(`${API_ENDPOINTS.agents}/${id}/restart`);
  }

  // Metrics and analytics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.get<DashboardMetrics>(`${API_ENDPOINTS.metrics}/dashboard`);
  }

  async getAgentMetrics(id: string, period: string = '24h'): Promise<any> {
    return this.get<any>(`${API_ENDPOINTS.metrics}/agents/${id}?period=${period}`);
  }

  async getKPIData(period: string = '30d'): Promise<KPIData[]> {
    return this.get<KPIData[]>(`${API_ENDPOINTS.metrics}/kpi?period=${period}`);
  }

  async getRevenueMetrics(period: string = '30d'): Promise<any> {
    return this.get<any>(`${API_ENDPOINTS.metrics}/revenue?period=${period}`);
  }

  // Activity logs
  async getActivityLogs(limit: number = 100, offset: number = 0): Promise<ActivityLog[]> {
    return this.get<ActivityLog[]>(`${API_ENDPOINTS.logs}?limit=${limit}&offset=${offset}`);
  }

  async getAgentLogs(agentId: string, limit: number = 100): Promise<ActivityLog[]> {
    return this.get<ActivityLog[]>(`${API_ENDPOINTS.logs}/agents/${agentId}?limit=${limit}`);
  }

  // Webhook management
  async getWebhookEvents(limit: number = 50): Promise<WebhookEvent[]> {
    return this.get<WebhookEvent[]>(`${API_ENDPOINTS.webhooks}?limit=${limit}`);
  }

  async processWebhook(event: Omit<WebhookEvent, 'id' | 'timestamp' | 'processed'>): Promise<void> {
    return this.post<void>(`${API_ENDPOINTS.webhooks}/process`, event);
  }

  async retryWebhook(eventId: string): Promise<void> {
    return this.post<void>(`${API_ENDPOINTS.webhooks}/${eventId}/retry`);
  }

  // A/B Testing
  async getABTests(): Promise<ABTestResult[]> {
    return this.get<ABTestResult[]>('/api/ab-tests');
  }

  async createABTest(test: any): Promise<ABTestResult> {
    return this.post<ABTestResult>('/api/ab-tests', test);
  }

  async getABTestResults(testId: string): Promise<ABTestResult[]> {
    return this.get<ABTestResult[]>(`/api/ab-tests/${testId}/results`);
  }

  // Deployment management
  async getDeployments(): Promise<DeploymentStatus[]> {
    return this.get<DeploymentStatus[]>(API_ENDPOINTS.deploy);
  }

  async triggerDeployment(environment: string, branch: string = 'main'): Promise<DeploymentStatus> {
    return this.post<DeploymentStatus>(`${API_ENDPOINTS.deploy}/trigger`, {
      environment,
      branch
    });
  }

  async getDeploymentStatus(deploymentId: string): Promise<DeploymentStatus> {
    return this.get<DeploymentStatus>(`${API_ENDPOINTS.deploy}/${deploymentId}`);
  }

  async rollbackDeployment(deploymentId: string): Promise<void> {
    return this.post<void>(`${API_ENDPOINTS.deploy}/${deploymentId}/rollback`);
  }

  // Integration status
  async getIntegrationStatus(): Promise<IntegrationStatus[]> {
    return this.get<IntegrationStatus[]>('/api/integrations/status');
  }

  async testIntegration(service: string): Promise<boolean> {
    const response = await this.post<{ success: boolean }>(`/api/integrations/${service}/test`);
    return response.success;
  }

  async syncIntegration(service: string): Promise<void> {
    return this.post<void>(`/api/integrations/${service}/sync`);
  }

  // Configuration
  async testConnection(): Promise<boolean> {
    try {
      await this.get<any>('/api/health');
      return true;
    } catch {
      return false;
    }
  }

  async getSystemInfo(): Promise<any> {
    return this.get<any>('/api/system/info');
  }

  // Revenue Ripple specific endpoints
  async syncWithRevenueRipple(): Promise<void> {
    return this.post<void>('/api/revenue-ripple/sync');
  }

  async getRevenueRippleMetrics(): Promise<any> {
    return this.get<any>('/api/revenue-ripple/metrics');
  }

  async updateRevenueRippleConfig(config: any): Promise<void> {
    return this.put<void>('/api/revenue-ripple/config', config);
  }

  // Bulk operations
  async bulkUpdateAgents(updates: Array<{ id: string; data: Partial<Agent> }>): Promise<void> {
    return this.put<void>(`${API_ENDPOINTS.agents}/bulk`, { updates });
  }

  async bulkStartAgents(agentIds: string[]): Promise<void> {
    return this.post<void>(`${API_ENDPOINTS.agents}/bulk/start`, { agentIds });
  }

  async bulkStopAgents(agentIds: string[]): Promise<void> {
    return this.post<void>(`${API_ENDPOINTS.agents}/bulk/stop`, { agentIds });
  }

  // Search and filtering
  async searchAgents(query: string, filters?: any): Promise<Agent[]> {
    const params = new URLSearchParams();
    params.append('q', query);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params.append(key, String(value));
      });
    }
    return this.get<Agent[]>(`${API_ENDPOINTS.agents}/search?${params}`);
  }

  async searchLogs(query: string, filters?: any): Promise<ActivityLog[]> {
    const params = new URLSearchParams();
    params.append('q', query);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params.append(key, String(value));
      });
    }
    return this.get<ActivityLog[]>(`${API_ENDPOINTS.logs}/search?${params}`);
  }

  // Export functionality
  async exportMetrics(format: 'csv' | 'json' = 'json', period: string = '30d'): Promise<Blob> {
    const response = await this.client.get(`${API_ENDPOINTS.metrics}/export`, {
      params: { format, period },
      responseType: 'blob'
    });
    return response.data;
  }

  async exportLogs(format: 'csv' | 'json' = 'json', filters?: any): Promise<Blob> {
    const response = await this.client.get(`${API_ENDPOINTS.logs}/export`, {
      params: { format, ...filters },
      responseType: 'blob'
    });
    return response.data;
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// Mock data for development
export const mockData = {
  agents: [
    {
      id: 'ab-optimizer-1',
      name: 'A/B Test Optimizer',
      description: 'Automatically optimizes A/B tests for maximum conversion',
      status: 'active' as const,
      type: 'ab-optimizer' as const,
      lastRun: new Date(),
      nextRun: new Date(Date.now() + 3600000),
      configuration: {
        testDuration: 14,
        minSampleSize: 1000,
        confidenceLevel: 0.95
      },
      metrics: {
        successRate: 94.5,
        totalRuns: 45,
        averageRunTime: 1200,
        lastSuccess: new Date(),
        errorCount: 2
      }
    },
    {
      id: 'revenue-tracker-1',
      name: 'Revenue Ripple Tracker',
      description: 'Tracks revenue metrics and sends data to Revenue Ripple',
      status: 'active' as const,
      type: 'revenue-ripple' as const,
      lastRun: new Date(),
      configuration: {
        syncInterval: 300,
        metrics: ['revenue', 'conversions', 'churn']
      },
      metrics: {
        successRate: 98.2,
        totalRuns: 124,
        averageRunTime: 850,
        lastSuccess: new Date(),
        errorCount: 1
      }
    }
  ],
  metrics: {
    totalAgents: 12,
    activeAgents: 9,
    totalRuns: 2456,
    successRate: 96.8,
    revenueGenerated: 125000,
    costSaved: 35000
  }
};

// Development helper
export const isDevelopment = process.env.NODE_ENV === 'development';

// Export default instance
export default apiClient;