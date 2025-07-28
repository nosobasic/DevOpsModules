import { useState } from 'react';

interface AgentConfig {
  id: string;
  name: string;
  enabled: boolean;
  interval: number;
  settings: Record<string, any>;
}

interface ConfigModalProps {
  agent: AgentConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: AgentConfig) => void;
}

export function ConfigModal({ agent, isOpen, onClose, onSave }: ConfigModalProps) {
  const [config, setConfig] = useState<AgentConfig>(agent);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(config);
      onClose();
    } catch (error) {
      console.error('Failed to save configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Configure {agent.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Basic Settings</h3>
            
            <div className="flex items-center justify-between">
              <label htmlFor="enabled" className="font-medium">Enable Agent</label>
              <input
                id="enabled"
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                className="w-4 h-4"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="interval" className="font-medium">Run Interval (seconds)</label>
              <input
                id="interval"
                type="number"
                value={config.interval / 1000}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  interval: parseInt(e.target.value) * 1000 
                }))}
                min="30"
                max="3600"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Revenue Ripple Integration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Revenue Ripple Integration</h3>
            
            <div className="space-y-2">
              <label htmlFor="apiKey" className="font-medium">API Key</label>
              <input
                id="apiKey"
                type="password"
                placeholder="Enter your Revenue Ripple API key"
                value={config.settings.apiKey || ''}
                onChange={(e) => updateSetting('apiKey', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="webhookUrl" className="font-medium">Webhook URL</label>
              <input
                id="webhookUrl"
                type="url"
                placeholder="https://your-domain.com/webhooks"
                value={config.settings.webhookUrl || ''}
                onChange={(e) => updateSetting('webhookUrl', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Agent-Specific Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Agent-Specific Settings</h3>
            
            {agent.id === 'kpi-tracker' && (
              <div className="space-y-2">
                <label className="font-medium">KPI Thresholds</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm">Revenue Min</label>
                    <input
                      type="number"
                      value={config.settings.revenueMin || 1000}
                      onChange={(e) => updateSetting('revenueMin', parseInt(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Revenue Max</label>
                    <input
                      type="number"
                      value={config.settings.revenueMax || 100000}
                      onChange={(e) => updateSetting('revenueMax', parseInt(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {agent.id === 'ab-optimizer' && (
              <div className="space-y-2">
                <label className="font-medium">Test Types</label>
                <select
                  value={config.settings.testType || 'landing_page'}
                  onChange={(e) => updateSetting('testType', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="landing_page">Landing Page</option>
                  <option value="email">Email</option>
                  <option value="ads">Ads</option>
                </select>
              </div>
            )}

            {agent.id === 'funnel-tester' && (
              <div className="space-y-2">
                <label className="font-medium">Funnel Stages</label>
                <textarea
                  placeholder="Enter funnel stages (one per line)"
                  value={config.settings.funnelStages?.join('\n') || ''}
                  onChange={(e) => updateSetting('funnelStages', e.target.value.split('\n').filter(Boolean))}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 