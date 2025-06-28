/**
 * Revenue Ripple - DevOps Modules Integration Script
 * Provides seamless integration between Revenue Ripple and DevOps Modules
 */

class RevenueRippleIntegration {
    constructor(config = {}) {
        this.config = {
            apiKey: config.apiKey || 'rr_u_5n6KxpNEx2hsa32s3_gfGgVIo5hjfC2esJr7CBPtk',
            baseURL: config.baseURL || 'https://revenueripple.org',
            webhookEndpoint: config.webhookEndpoint || '/api/webhooks/devops-modules',
            integrationMode: config.integrationMode || 'embedded',
            debug: config.debug || false,
            ...config
        };
        
        this.agents = new Map();
        this.metrics = {
            totalRevenue: 0,
            activeAgents: 0,
            successRate: 0,
            lastUpdate: null
        };
        
        this.websocket = null;
        this.init();
    }

    /**
     * Initialize the integration
     */
    async init() {
        try {
            this.log('Initializing Revenue Ripple DevOps Modules integration...');
            
            // Validate API key and establish connection
            await this.validateConnection();
            
            // Load agent configurations
            await this.loadAgentConfigurations();
            
            // Initialize WebSocket connection for real-time updates
            this.initWebSocket();
            
            // Start periodic sync with Revenue Ripple
            this.startPeriodicSync();
            
            this.log('Integration initialized successfully');
            
            // Dispatch initialization complete event
            this.dispatchEvent('integration:initialized', { config: this.config });
            
        } catch (error) {
            this.error('Failed to initialize integration:', error);
            throw error;
        }
    }

    /**
     * Validate connection to Revenue Ripple
     */
    async validateConnection() {
        try {
            const response = await this.apiCall('GET', '/api/devops/config');
            
            if (response.status === 'success') {
                this.log('Connection to Revenue Ripple validated');
                return response.data;
            } else {
                throw new Error('Invalid API response');
            }
        } catch (error) {
            this.error('Connection validation failed:', error);
            throw new Error('Failed to connect to Revenue Ripple. Please check your API key.');
        }
    }

    /**
     * Load agent configurations from Revenue Ripple
     */
    async loadAgentConfigurations() {
        const config = await this.apiCall('GET', '/api/devops/config');
        
        const agentConfigs = {
            'ab-optimizer': {
                name: 'AB Optimizer Agent',
                description: 'Automatically manages A/B tests for maximum conversion',
                enabled: config.data.agents?.ab_testing || false,
                status: 'stopped'
            },
            'kpi-tracker': {
                name: 'KPI Tracker Agent',
                description: 'Monitors key performance indicators and alerts on thresholds',
                enabled: config.data.agents?.kpi_monitoring || false,
                status: 'stopped'
            },
            'revenue-ripple': {
                name: 'Revenue Ripple Agent',
                description: 'Syncs revenue metrics with main Revenue Ripple system',
                enabled: config.data.agents?.revenue_tracking || false,
                status: 'stopped'
            },
            'funnel-tester': {
                name: 'Funnel Tester Agent',
                description: 'Tests and optimizes conversion funnels',
                enabled: true,
                status: 'stopped'
            },
            'ad-generator': {
                name: 'Ad Generator Agent',
                description: 'Creates and optimizes advertising campaigns',
                enabled: true,
                status: 'stopped'
            },
            'daily-pulse': {
                name: 'Daily Pulse Agent',
                description: 'Generates daily performance reports and insights',
                enabled: true,
                status: 'stopped'
            },
            'webhook-validator': {
                name: 'Webhook Validator',
                description: 'Validates and processes incoming webhooks',
                enabled: true,
                status: 'stopped'
            }
        };

        // Initialize agents
        for (const [agentId, agentConfig] of Object.entries(agentConfigs)) {
            this.agents.set(agentId, agentConfig);
        }

        this.updateMetrics();
        this.log(`Loaded ${this.agents.size} agent configurations`);
    }

    /**
     * Initialize WebSocket connection for real-time updates
     */
    initWebSocket() {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsURL = `${wsProtocol}//revenueripple.org/ws/devops-modules`;
        
        try {
            this.websocket = new WebSocket(wsURL);
            
            this.websocket.onopen = () => {
                this.log('WebSocket connection established');
                // Authenticate WebSocket connection
                this.websocket.send(JSON.stringify({
                    type: 'auth',
                    apiKey: this.config.apiKey
                }));
            };
            
            this.websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleWebSocketMessage(data);
            };
            
            this.websocket.onclose = () => {
                this.log('WebSocket connection closed, attempting to reconnect...');
                setTimeout(() => this.initWebSocket(), 5000);
            };
            
            this.websocket.onerror = (error) => {
                this.error('WebSocket error:', error);
            };
            
        } catch (error) {
            this.error('Failed to initialize WebSocket:', error);
        }
    }

    /**
     * Handle WebSocket messages
     */
    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'agent_status':
                this.updateAgentStatus(data.agentId, data.status);
                break;
            case 'metrics_update':
                this.updateMetrics(data.metrics);
                break;
            case 'revenue_generated':
                this.handleRevenueGenerated(data);
                break;
            default:
                this.log('Unknown WebSocket message type:', data.type);
        }
    }

    /**
     * Start/stop an agent
     */
    async toggleAgent(agentId, action = 'toggle') {
        const agent = this.agents.get(agentId);
        if (!agent) {
            throw new Error(`Agent ${agentId} not found`);
        }

        let newStatus;
        if (action === 'toggle') {
            newStatus = agent.status === 'running' ? 'stopped' : 'running';
        } else {
            newStatus = action;
        }

        try {
            const response = await this.apiCall('POST', `/api/agents/${agentId}/${newStatus}`, {
                agentId,
                action: newStatus
            });

            if (response.status === 'success') {
                this.updateAgentStatus(agentId, newStatus);
                this.dispatchEvent('agent:status_changed', { agentId, status: newStatus });
                this.log(`Agent ${agentId} ${newStatus}`);
            }

            return response;
        } catch (error) {
            this.error(`Failed to ${newStatus} agent ${agentId}:`, error);
            throw error;
        }
    }

    /**
     * Update agent status
     */
    updateAgentStatus(agentId, status) {
        const agent = this.agents.get(agentId);
        if (agent) {
            agent.status = status;
            agent.lastUpdate = new Date();
            this.updateMetrics();
        }
    }

    /**
     * Update system metrics
     */
    updateMetrics(newMetrics = {}) {
        // Count active agents
        this.metrics.activeAgents = Array.from(this.agents.values())
            .filter(agent => agent.status === 'running').length;

        // Update other metrics
        Object.assign(this.metrics, newMetrics);
        this.metrics.lastUpdate = new Date();

        // Dispatch metrics update event
        this.dispatchEvent('metrics:updated', this.metrics);
    }

    /**
     * Handle revenue generated event
     */
    async handleRevenueGenerated(data) {
        this.metrics.totalRevenue += data.amount || 0;
        
        // Send revenue data to Revenue Ripple
        await this.reportRevenueImpact({
            source: data.agent || 'devops_modules',
            amount: data.amount,
            details: data.details || {}
        });

        this.dispatchEvent('revenue:generated', data);
    }

    /**
     * Report revenue impact to Revenue Ripple
     */
    async reportRevenueImpact(impactData) {
        try {
            const response = await this.apiCall('POST', '/api/devops/metrics', {
                event: 'revenue_generated',
                data: impactData,
                timestamp: new Date().toISOString()
            });

            this.log('Revenue impact reported:', impactData);
            return response;
        } catch (error) {
            this.error('Failed to report revenue impact:', error);
        }
    }

    /**
     * Make API call to Revenue Ripple
     */
    async apiCall(method, endpoint, data = null) {
        const url = `${this.config.baseURL}${endpoint}`;
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json',
                'X-DevOps-Integration': 'v1.0'
            }
        };

        if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(`API call failed: ${response.status} ${response.statusText}`);
            }

            return responseData;
        } catch (error) {
            this.error(`API call to ${endpoint} failed:`, error);
            throw error;
        }
    }

    /**
     * Start periodic sync with Revenue Ripple
     */
    startPeriodicSync() {
        // Sync every 5 minutes
        setInterval(async () => {
            try {
                await this.syncConfiguration();
                this.log('Periodic sync completed');
            } catch (error) {
                this.error('Periodic sync failed:', error);
            }
        }, 5 * 60 * 1000);
    }

    /**
     * Sync configuration with Revenue Ripple
     */
    async syncConfiguration() {
        const config = await this.apiCall('GET', '/api/devops/config');
        
        // Update agent configurations if changed
        if (config.data.agents) {
            for (const [agentId, agent] of this.agents.entries()) {
                const serverEnabled = config.data.agents[agentId.replace('-', '_')];
                if (serverEnabled !== undefined && agent.enabled !== serverEnabled) {
                    agent.enabled = serverEnabled;
                    this.log(`Agent ${agentId} enabled status updated to ${serverEnabled}`);
                }
            }
        }

        this.dispatchEvent('config:synced', config.data);
    }

    /**
     * Get all agents
     */
    getAgents() {
        return Array.from(this.agents.entries()).map(([id, agent]) => ({
            id,
            ...agent
        }));
    }

    /**
     * Get system metrics
     */
    getMetrics() {
        return { ...this.metrics };
    }

    /**
     * Dispatch custom event
     */
    dispatchEvent(eventType, data) {
        const event = new CustomEvent(`devops:${eventType}`, {
            detail: data,
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    /**
     * Logging utility
     */
    log(...args) {
        if (this.config.debug) {
            console.log('[DevOps Integration]', ...args);
        }
    }

    /**
     * Error logging utility
     */
    error(...args) {
        console.error('[DevOps Integration]', ...args);
    }

    /**
     * Cleanup and disconnect
     */
    destroy() {
        if (this.websocket) {
            this.websocket.close();
        }
        this.log('Integration destroyed');
    }
}

// Global initialization function for embedded mode
window.DevOpsModules = {
    integration: null,
    
    init(config = {}) {
        if (this.integration) {
            this.integration.destroy();
        }
        
        this.integration = new RevenueRippleIntegration(config);
        
        // If container specified, render basic dashboard
        if (config.container) {
            this.renderEmbeddedDashboard(config.container);
        }
        
        return this.integration;
    },
    
    renderEmbeddedDashboard(container) {
        const containerEl = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
            
        if (!containerEl) {
            console.error('Container not found:', container);
            return;
        }
        
        // Create basic dashboard HTML
        containerEl.innerHTML = `
            <div class="devops-modules-dashboard">
                <div class="dashboard-header">
                    <h2>DevOps Modules</h2>
                    <div class="metrics-summary">
                        <span id="active-agents-count">0</span> Active Agents
                        <span id="total-revenue">$0</span> Revenue Generated
                    </div>
                </div>
                <div class="agents-grid" id="agents-grid">
                    <!-- Agents will be populated here -->
                </div>
            </div>
        `;
        
        // Add basic styling
        if (!document.getElementById('devops-modules-styles')) {
            const styles = document.createElement('style');
            styles.id = 'devops-modules-styles';
            styles.textContent = `
                .devops-modules-dashboard {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    background: #f8fafc;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                }
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #e2e8f0;
                }
                .metrics-summary {
                    font-size: 14px;
                    color: #64748b;
                }
                .metrics-summary span {
                    margin-right: 20px;
                    font-weight: 600;
                }
                .agents-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 15px;
                }
                .agent-card {
                    background: white;
                    border-radius: 6px;
                    padding: 15px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    border: 1px solid #e2e8f0;
                }
                .agent-card.running {
                    border-left: 4px solid #10b981;
                }
                .agent-card.stopped {
                    border-left: 4px solid #ef4444;
                }
                .agent-name {
                    font-weight: 600;
                    margin-bottom: 5px;
                }
                .agent-description {
                    font-size: 13px;
                    color: #64748b;
                    margin-bottom: 10px;
                }
                .agent-controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .agent-status {
                    font-size: 12px;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-weight: 500;
                    text-transform: uppercase;
                }
                .agent-status.running {
                    background: #dcfce7;
                    color: #166534;
                }
                .agent-status.stopped {
                    background: #fef2f2;
                    color: #991b1b;
                }
                .toggle-btn {
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                }
                .toggle-btn:hover {
                    background: #2563eb;
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Update dashboard when agents load
        document.addEventListener('devops:integration:initialized', () => {
            this.updateEmbeddedDashboard();
        });
        
        // Update dashboard on metrics changes
        document.addEventListener('devops:metrics:updated', () => {
            this.updateEmbeddedDashboard();
        });
    },
    
    updateEmbeddedDashboard() {
        if (!this.integration) return;
        
        const metrics = this.integration.getMetrics();
        const agents = this.integration.getAgents();
        
        // Update metrics display
        const activeAgentsEl = document.getElementById('active-agents-count');
        const totalRevenueEl = document.getElementById('total-revenue');
        
        if (activeAgentsEl) {
            activeAgentsEl.textContent = metrics.activeAgents;
        }
        if (totalRevenueEl) {
            totalRevenueEl.textContent = `$${metrics.totalRevenue.toLocaleString()}`;
        }
        
        // Update agents grid
        const agentsGrid = document.getElementById('agents-grid');
        if (agentsGrid) {
            agentsGrid.innerHTML = agents.map(agent => `
                <div class="agent-card ${agent.status}">
                    <div class="agent-name">${agent.name}</div>
                    <div class="agent-description">${agent.description}</div>
                    <div class="agent-controls">
                        <span class="agent-status ${agent.status}">${agent.status}</span>
                        <button class="toggle-btn" onclick="DevOpsModules.toggleAgent('${agent.id}')">
                            ${agent.status === 'running' ? 'Stop' : 'Start'}
                        </button>
                    </div>
                </div>
            `).join('');
        }
    },
    
    async toggleAgent(agentId) {
        if (this.integration) {
            try {
                await this.integration.toggleAgent(agentId);
                this.updateEmbeddedDashboard();
            } catch (error) {
                alert(`Failed to toggle agent: ${error.message}`);
            }
        }
    }
};

// Auto-initialize if configuration is provided
document.addEventListener('DOMContentLoaded', () => {
    if (window.DEVOPS_MODULES_CONFIG) {
        window.DevOpsModules.init(window.DEVOPS_MODULES_CONFIG);
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RevenueRippleIntegration;
}