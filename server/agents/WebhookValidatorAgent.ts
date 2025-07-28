import { Server } from 'socket.io';
import { BaseAgent } from './BaseAgent.js';

export class WebhookValidatorAgent extends BaseAgent {
  private webhookEndpoints: Map<string, any> = new Map();
  private failureCount: Map<string, number> = new Map();

  constructor(io: Server) {
    super('webhook-validator', 'Webhook Validator', io, {
      interval: 120000, // 2 minutes
      settings: {
        webhooks: ['stripe', 'paypal', 'shopify'],
        retryAttempts: 3,
        timeoutMs: 5000
      }
    });

    // Enable self-healing for this agent
    this.enableSelfHealing();

    // Initialize webhook endpoints
    this.initializeEndpoints();
  }

  private initializeEndpoints(): void {
    const webhooks = this.config.settings.webhooks || [];
    webhooks.forEach((webhook: string) => {
      this.webhookEndpoints.set(webhook, {
        name: webhook,
        url: `https://api.${webhook}.com/webhook`,
        backupUrl: `https://backup.${webhook}.com/webhook`,
        lastResponse: null,
        consecutiveFailures: 0,
        status: 'unknown'
      });
      this.failureCount.set(webhook, 0);
    });
  }

  async execute(): Promise<any> {
    const results = [];
    let totalRequests = 0;
    let failedRequests = 0;
    let totalResponseTime = 0;

    for (const [name, endpoint] of this.webhookEndpoints.entries()) {
      const result = await this.validateWebhook(endpoint);
      results.push(result);
      totalRequests++;

      if (result.success) {
        // Reset failure count on success
        this.failureCount.set(name, 0);
        endpoint.consecutiveFailures = 0;
        endpoint.status = 'healthy';
      } else {
        failedRequests++;
        const failures = this.failureCount.get(name) || 0;
        this.failureCount.set(name, failures + 1);
        endpoint.consecutiveFailures = failures + 1;
        endpoint.status = 'unhealthy';

        // Auto-fix: Switch to backup URL if too many failures
        if (this.selfHealing && endpoint.consecutiveFailures >= 3) {
          await this.switchToBackupEndpoint(endpoint);
        }
      }

      totalResponseTime += result.responseTime;
    }

    const webhookData = {
      timestamp: new Date(),
      totalRequests,
      successfulRequests: totalRequests - failedRequests,
      failedRequests,
      successRate: totalRequests > 0 ? (totalRequests - failedRequests) / totalRequests : 1,
      failureRate: totalRequests > 0 ? failedRequests / totalRequests : 0,
      avgResponseTime: totalRequests > 0 ? totalResponseTime / totalRequests : 0,
      results,
      endpoints: Array.from(this.webhookEndpoints.values())
    };

    this.emit('data', webhookData);
    
    // Return data for AI analysis
    return webhookData;
  }

  private async validateWebhook(endpoint: any): Promise<any> {
    const startTime = Date.now();
    
    try {
      // Simulate webhook validation
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 100));
      
      // Simulate occasional failures
      const success = Math.random() > 0.15; // 85% success rate
      const responseTime = Date.now() - startTime;

      endpoint.lastResponse = {
        timestamp: new Date(),
        success,
        responseTime,
        status: success ? 200 : 500
      };

      return {
        webhook: endpoint.name,
        success,
        responseTime,
        status: success ? 200 : 500,
        error: success ? null : 'Connection timeout'
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      endpoint.lastResponse = {
        timestamp: new Date(),
        success: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      return {
        webhook: endpoint.name,
        success: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async switchToBackupEndpoint(endpoint: any): Promise<void> {
    console.log(`🔧 Webhook ${endpoint.name} switching to backup endpoint due to repeated failures`);
    
    // Switch to backup URL
    const originalUrl = endpoint.url;
    endpoint.url = endpoint.backupUrl;
    endpoint.backupUrl = originalUrl;
    
    // Reset failure count
    endpoint.consecutiveFailures = 0;
    this.failureCount.set(endpoint.name, 0);
    
    this.emit('endpoint-switched', {
      webhook: endpoint.name,
      newUrl: endpoint.url,
      reason: 'Multiple consecutive failures',
      timestamp: new Date()
    });
  }
}