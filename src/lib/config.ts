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

// Configuration manager
export class ConfigManager {
  private config: Config;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): Config {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (stored) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to load stored config:', error);
    }
    return { ...DEFAULT_CONFIG };
  }

  getConfig(): Config {
    return { ...this.config };
  }

  updateConfig(updates: Partial<Config>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  private saveConfig(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(this.config));
    } catch (error) {
      console.warn('Failed to save config:', error);
    }
  }

  getApiUrl(): string {
    return this.config.apiUrl;
  }

  getWsUrl(): string {
    return this.config.wsUrl;
  }

  getApiKey(): string | undefined {
    return this.config.apiKey || localStorage.getItem(STORAGE_KEYS.API_KEY) || undefined;
  }

  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
    localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
    this.saveConfig();
  }

  clearApiKey(): void {
    this.config.apiKey = undefined;
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
    this.saveConfig();
  }
}

// Global config instance
export const configManager = new ConfigManager();

// Export default config for direct use
export const config = configManager.getConfig();