// Configuration management for the DevOps Modules frontend
export interface Config {
  apiUrl: string;
  wsUrl: string;
  apiKey?: string;
  webhookSecret?: string;
  adminPanelUrl?: string;
  integrationMode: 'embedded' | 'standalone' | 'widget';
}

// Default configuration
const DEFAULT_CONFIG: Config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:3001',
  integrationMode: 'standalone'
};

// API endpoints
export const API_ENDPOINTS = {
  AGENTS: '/api/agents',
  METRICS: '/api/dashboard/metrics',
  LOGS: '/api/dashboard/logs',
  WEBHOOKS: '/api/webhooks',
  DEPLOYMENTS: '/api/deployments',
  INTEGRATIONS: '/api/integrations',
  CONFIG: '/api/config'
} as const;

// Storage keys
export const STORAGE_KEYS = {
  CONFIG: 'devops_modules_config',
  API_KEY: 'devops_modules_api_key',
  SESSION: 'devops_modules_session'
} as const;

class ConfigManager {
  private apiUrl: string;

  constructor() {
    // In development, use localhost
    // In production, use the deployed backend URL
    this.apiUrl = import.meta.env.VITE_API_URL || 
                  (import.meta.env.DEV ? 'http://localhost:3001' : 'https://devopsmodules.onrender.com');
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  setApiUrl(url: string): void {
    this.apiUrl = url;
  }

  getWebSocketUrl(): string {
    // WebSocket URL should match the API URL but with ws:// or wss://
    const wsUrl = this.apiUrl.replace(/^http/, 'ws');
    return wsUrl;
  }

  isDevelopment(): boolean {
    return import.meta.env.DEV;
  }

  isProduction(): boolean {
    return import.meta.env.PROD;
  }
}

export const configManager = new ConfigManager();

// Export default config for direct use
// Export a simple config object for backward compatibility
export const config = {
  baseUrl: configManager.getApiUrl(),
  wsUrl: configManager.getWebSocketUrl(),
  apiKey: undefined // Will be set by settings
};