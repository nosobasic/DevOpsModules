import type { RevenueRippleConfig, ApiKey } from '../types';

// Configuration constants
export const DEFAULT_CONFIG: RevenueRippleConfig = {
  baseUrl: process.env.REACT_APP_REVENUE_RIPPLE_URL || 'https://revenueripple.org',
  apiKey: process.env.REACT_APP_REVENUE_RIPPLE_API_KEY || '',
  webhookSecret: process.env.REACT_APP_WEBHOOK_SECRET || '',
  adminPanelUrl: process.env.REACT_APP_ADMIN_PANEL_URL || 'https://revenueripple.org/admin',
  integrationMode: (process.env.REACT_APP_INTEGRATION_MODE as 'embedded' | 'standalone' | 'iframe') || 'embedded'
};

// API endpoints configuration
export const API_ENDPOINTS = {
  agents: '/api/agents',
  metrics: '/api/metrics',
  logs: '/api/logs',
  webhooks: '/api/webhooks',
  deploy: '/api/deploy',
  config: '/api/config',
  apiKeys: '/api/api-keys'
};

// Storage keys
export const STORAGE_KEYS = {
  config: 'devops_modules_config',
  apiKeys: 'devops_modules_api_keys',
  agentSettings: 'devops_modules_agent_settings'
};

class ConfigManager {
  private config: RevenueRippleConfig;
  private apiKeys: Map<string, ApiKey> = new Map();

  constructor() {
    this.config = this.loadConfig();
    this.loadApiKeys();
  }

  // Configuration management
  getConfig(): RevenueRippleConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<RevenueRippleConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  private loadConfig(): RevenueRippleConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.config);
      if (stored) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to load config from localStorage:', error);
    }
    return DEFAULT_CONFIG;
  }

  private saveConfig(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save config to localStorage:', error);
    }
  }

  // API Key management
  getApiKeys(): ApiKey[] {
    return Array.from(this.apiKeys.values());
  }

  getApiKey(service: string): ApiKey | undefined {
    return Array.from(this.apiKeys.values()).find(key => key.service === service && key.isActive);
  }

  addApiKey(apiKey: Omit<ApiKey, 'id' | 'createdAt'>): string {
    const id = `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newKey: ApiKey = {
      ...apiKey,
      id,
      createdAt: new Date()
    };
    this.apiKeys.set(id, newKey);
    this.saveApiKeys();
    return id;
  }

  updateApiKey(id: string, updates: Partial<ApiKey>): boolean {
    const existing = this.apiKeys.get(id);
    if (!existing) return false;

    this.apiKeys.set(id, { ...existing, ...updates });
    this.saveApiKeys();
    return true;
  }

  deleteApiKey(id: string): boolean {
    const deleted = this.apiKeys.delete(id);
    if (deleted) {
      this.saveApiKeys();
    }
    return deleted;
  }

  private loadApiKeys(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.apiKeys);
      if (stored) {
        const keys: ApiKey[] = JSON.parse(stored);
        keys.forEach(key => {
          // Convert date strings back to Date objects
          key.createdAt = new Date(key.createdAt);
          if (key.lastUsed) key.lastUsed = new Date(key.lastUsed);
          if (key.expiresAt) key.expiresAt = new Date(key.expiresAt);
          this.apiKeys.set(key.id, key);
        });
      }
    } catch (error) {
      console.warn('Failed to load API keys from localStorage:', error);
    }
  }

  private saveApiKeys(): void {
    try {
      const keys = Array.from(this.apiKeys.values());
      localStorage.setItem(STORAGE_KEYS.apiKeys, JSON.stringify(keys));
    } catch (error) {
      console.error('Failed to save API keys to localStorage:', error);
    }
  }

  // Integration helpers
  getIntegrationUrl(path: string = ''): string {
    const baseUrl = this.config.baseUrl.replace(/\/$/, '');
    const adminPath = this.config.adminPanelUrl.replace(/^\//, '');
    return `${baseUrl}/${adminPath}${path}`;
  }

  getWebhookUrl(): string {
    return `${this.config.baseUrl}/api/webhooks/devops-modules`;
  }

  isRevenueRippleConfigured(): boolean {
    return !!(this.config.baseUrl && this.config.apiKey);
  }

  // Environment detection
  isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  // API Key validation
  validateApiKey(key: string, service: string): boolean {
    // Basic validation - in production, this would make an API call
    return key.length > 10 && key.startsWith(service.toLowerCase());
  }

  // Reset configuration
  resetConfig(): void {
    this.config = { ...DEFAULT_CONFIG };
    this.apiKeys.clear();
    localStorage.removeItem(STORAGE_KEYS.config);
    localStorage.removeItem(STORAGE_KEYS.apiKeys);
    localStorage.removeItem(STORAGE_KEYS.agentSettings);
  }
}

// Singleton instance
export const configManager = new ConfigManager();

// Helper functions
export const getConfig = () => configManager.getConfig();
export const updateConfig = (updates: Partial<RevenueRippleConfig>) => configManager.updateConfig(updates);
export const getApiKey = (service: string) => configManager.getApiKey(service);
export const addApiKey = (apiKey: Omit<ApiKey, 'id' | 'createdAt'>) => configManager.addApiKey(apiKey);
export const isConfigured = () => configManager.isRevenueRippleConfigured();