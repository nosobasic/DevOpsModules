import { useState, useEffect } from 'react';
import { configManager } from '../../lib/config';

interface SettingsConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  agents: {
    defaultInterval: number;
    autoStart: boolean;
    maxConcurrent: number;
    healthCheckInterval: number;
  };
  webhooks: {
    enabled: boolean;
    endpoints: string[];
    retryAttempts: number;
    timeoutMs: number;
  };
  notifications: {
    email: boolean;
    slack: boolean;
    dashboard: boolean;
    criticalOnly: boolean;
  };
  security: {
    rateLimiting: boolean;
    maxRequestsPerMinute: number;
    apiKeyRequired: boolean;
  };
  monitoring: {
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    metricsCollection: boolean;
    performanceTracking: boolean;
  };
  integrations: {
    openai: {
      enabled: boolean;
      apiKey: string;
      model: string;
    };
    revenueRipple: {
      enabled: boolean;
      apiKey: string;
      url: string;
    };
  };
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: SettingsConfig) => void;
}

export function SettingsPanel({ isOpen, onClose, onSave }: SettingsPanelProps) {
  const [settings, setSettings] = useState<SettingsConfig>({
    api: {
      baseUrl: configManager.getApiUrl(),
      timeout: 30000,
      retryAttempts: 3
    },
    agents: {
      defaultInterval: 30000,
      autoStart: false,
      maxConcurrent: 5,
      healthCheckInterval: 60000
    },
    webhooks: {
      enabled: true,
      endpoints: ['stripe', 'paypal', 'shopify'],
      retryAttempts: 3,
      timeoutMs: 5000
    },
    notifications: {
      email: true,
      slack: false,
      dashboard: true,
      criticalOnly: false
    },
    security: {
      rateLimiting: true,
      maxRequestsPerMinute: 100,
      apiKeyRequired: false
    },
    monitoring: {
      logLevel: 'info',
      metricsCollection: true,
      performanceTracking: true
    },
    integrations: {
      openai: {
        enabled: true,
        apiKey: '',
        model: 'gpt-4'
      },
      revenueRipple: {
        enabled: true,
        apiKey: 'rr_u_5n6KxpNEx2hsa32s3_gfGgVIo5hjfC2esJr7CBPtk',
        url: 'https://revenueripple.org'
      }
    }
  });

  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const apiUrl = configManager.getApiUrl();
      const response = await fetch(`${apiUrl}/api/settings`);
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const apiUrl = configManager.getApiUrl();
      const response = await fetch(`${apiUrl}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        onSave(settings);
        onClose();
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (section: keyof SettingsConfig, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedChange = (section: keyof SettingsConfig, subsection: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [field]: value
        }
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">System Settings</h2>
              <p className="text-gray-600">Configure your DevOps Modules system</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading settings...</p>
            </div>
          )}

          {!isLoading && (
            <div className="flex">
              {/* Sidebar Navigation */}
              <div className="w-64 border-r pr-6">
                <nav className="space-y-2">
                  {[
                    { id: 'general', label: 'General', icon: '⚙️' },
                    { id: 'agents', label: 'Agents', icon: '🤖' },
                    { id: 'api', label: 'API Configuration', icon: '🔌' },
                    { id: 'webhooks', label: 'Webhooks', icon: '🔗' },
                    { id: 'notifications', label: 'Notifications', icon: '🔔' },
                    { id: 'security', label: 'Security', icon: '🛡️' },
                    { id: 'monitoring', label: 'Monitoring', icon: '📊' },
                    { id: 'integrations', label: 'Integrations', icon: '🔗' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content Area */}
              <div className="flex-1 pl-6">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">General Settings</h3>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Environment</label>
                        <select
                          value={process.env.NODE_ENV || 'development'}
                          disabled
                          className="w-full p-2 border rounded-md bg-gray-50"
                        >
                          <option value="development">Development</option>
                          <option value="production">Production</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">System Version</label>
                        <input
                          type="text"
                          value="1.0.0"
                          disabled
                          className="w-full p-2 border rounded-md bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'agents' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Agent Configuration</h3>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Default Interval (ms)</label>
                        <input
                          type="number"
                          value={settings.agents.defaultInterval}
                          onChange={(e) => handleInputChange('agents', 'defaultInterval', parseInt(e.target.value))}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Max Concurrent Agents</label>
                        <input
                          type="number"
                          value={settings.agents.maxConcurrent}
                          onChange={(e) => handleInputChange('agents', 'maxConcurrent', parseInt(e.target.value))}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Health Check Interval (ms)</label>
                        <input
                          type="number"
                          value={settings.agents.healthCheckInterval}
                          onChange={(e) => handleInputChange('agents', 'healthCheckInterval', parseInt(e.target.value))}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.agents.autoStart}
                          onChange={(e) => handleInputChange('agents', 'autoStart', e.target.checked)}
                          className="mr-2"
                        />
                        <label className="text-sm font-medium">Auto-start agents on system startup</label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'api' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">API Configuration</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Base URL</label>
                        <input
                          type="url"
                          value={settings.api.baseUrl}
                          onChange={(e) => handleInputChange('api', 'baseUrl', e.target.value)}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Timeout (ms)</label>
                          <input
                            type="number"
                            value={settings.api.timeout}
                            onChange={(e) => handleInputChange('api', 'timeout', parseInt(e.target.value))}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Retry Attempts</label>
                          <input
                            type="number"
                            value={settings.api.retryAttempts}
                            onChange={(e) => handleInputChange('api', 'retryAttempts', parseInt(e.target.value))}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'webhooks' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Webhook Configuration</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.webhooks.enabled}
                          onChange={(e) => handleInputChange('webhooks', 'enabled', e.target.checked)}
                          className="mr-2"
                        />
                        <label className="text-sm font-medium">Enable webhook validation</label>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Webhook Endpoints</label>
                        <div className="space-y-2">
                          {['stripe', 'paypal', 'shopify', 'custom'].map(endpoint => (
                            <div key={endpoint} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={settings.webhooks.endpoints.includes(endpoint)}
                                onChange={(e) => {
                                  const newEndpoints = e.target.checked
                                    ? [...settings.webhooks.endpoints, endpoint]
                                    : settings.webhooks.endpoints.filter(e => e !== endpoint);
                                  handleInputChange('webhooks', 'endpoints', newEndpoints);
                                }}
                                className="mr-2"
                              />
                              <label className="text-sm">{endpoint}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Retry Attempts</label>
                          <input
                            type="number"
                            value={settings.webhooks.retryAttempts}
                            onChange={(e) => handleInputChange('webhooks', 'retryAttempts', parseInt(e.target.value))}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Timeout (ms)</label>
                          <input
                            type="number"
                            value={settings.webhooks.timeoutMs}
                            onChange={(e) => handleInputChange('webhooks', 'timeoutMs', parseInt(e.target.value))}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Notification Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.email}
                            onChange={(e) => handleInputChange('notifications', 'email', e.target.checked)}
                            className="mr-2"
                          />
                          <label className="text-sm font-medium">Email Notifications</label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.slack}
                            onChange={(e) => handleInputChange('notifications', 'slack', e.target.checked)}
                            className="mr-2"
                          />
                          <label className="text-sm font-medium">Slack Notifications</label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.dashboard}
                            onChange={(e) => handleInputChange('notifications', 'dashboard', e.target.checked)}
                            className="mr-2"
                          />
                          <label className="text-sm font-medium">Dashboard Notifications</label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.criticalOnly}
                            onChange={(e) => handleInputChange('notifications', 'criticalOnly', e.target.checked)}
                            className="mr-2"
                          />
                          <label className="text-sm font-medium">Critical Alerts Only</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Security Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.rateLimiting}
                          onChange={(e) => handleInputChange('security', 'rateLimiting', e.target.checked)}
                          className="mr-2"
                        />
                        <label className="text-sm font-medium">Enable Rate Limiting</label>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Max Requests per Minute</label>
                        <input
                          type="number"
                          value={settings.security.maxRequestsPerMinute}
                          onChange={(e) => handleInputChange('security', 'maxRequestsPerMinute', parseInt(e.target.value))}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.apiKeyRequired}
                          onChange={(e) => handleInputChange('security', 'apiKeyRequired', e.target.checked)}
                          className="mr-2"
                        />
                        <label className="text-sm font-medium">Require API Key for External Access</label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'monitoring' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Monitoring Configuration</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Log Level</label>
                        <select
                          value={settings.monitoring.logLevel}
                          onChange={(e) => handleInputChange('monitoring', 'logLevel', e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="debug">Debug</option>
                          <option value="info">Info</option>
                          <option value="warn">Warning</option>
                          <option value="error">Error</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.monitoring.metricsCollection}
                          onChange={(e) => handleInputChange('monitoring', 'metricsCollection', e.target.checked)}
                          className="mr-2"
                        />
                        <label className="text-sm font-medium">Enable Metrics Collection</label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.monitoring.performanceTracking}
                          onChange={(e) => handleInputChange('monitoring', 'performanceTracking', e.target.checked)}
                          className="mr-2"
                        />
                        <label className="text-sm font-medium">Enable Performance Tracking</label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'integrations' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Integration Settings</h3>
                    
                    <div className="space-y-6">
                      {/* OpenAI Integration */}
                      <div className="border rounded-lg p-4">
                        <h4 className="text-lg font-medium mb-4">OpenAI Integration</h4>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.integrations.openai.enabled}
                              onChange={(e) => handleNestedChange('integrations', 'openai', 'enabled', e.target.checked)}
                              className="mr-2"
                            />
                            <label className="text-sm font-medium">Enable OpenAI AI Insights</label>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">API Key</label>
                            <input
                              type="password"
                              value={settings.integrations.openai.apiKey}
                              onChange={(e) => handleNestedChange('integrations', 'openai', 'apiKey', e.target.value)}
                              className="w-full p-2 border rounded-md"
                              placeholder="sk-..."
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Model</label>
                            <select
                              value={settings.integrations.openai.model}
                              onChange={(e) => handleNestedChange('integrations', 'openai', 'model', e.target.value)}
                              className="w-full p-2 border rounded-md"
                            >
                              <option value="gpt-4">GPT-4</option>
                              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      {/* Revenue Ripple Integration */}
                      <div className="border rounded-lg p-4">
                        <h4 className="text-lg font-medium mb-4">Revenue Ripple Integration</h4>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.integrations.revenueRipple.enabled}
                              onChange={(e) => handleNestedChange('integrations', 'revenueRipple', 'enabled', e.target.checked)}
                              className="mr-2"
                            />
                            <label className="text-sm font-medium">Enable Revenue Ripple Tracking</label>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">API Key</label>
                            <input
                              type="password"
                              value={settings.integrations.revenueRipple.apiKey}
                              onChange={(e) => handleNestedChange('integrations', 'revenueRipple', 'apiKey', e.target.value)}
                              className="w-full p-2 border rounded-md"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">URL</label>
                            <input
                              type="url"
                              value={settings.integrations.revenueRipple.url}
                              onChange={(e) => handleNestedChange('integrations', 'revenueRipple', 'url', e.target.value)}
                              className="w-full p-2 border rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 