import { Server } from 'socket.io';
import { BaseAgent } from './BaseAgent.js';

export class HealthMonitorAgent extends BaseAgent {
  private healthThresholds = {
    cpu: 85,
    memory: 90,
    disk: 95,
    responseTime: 5000,
    errorRate: 0.05
  };

  private services = [
    'database',
    'redis',
    'external_apis',
    'file_system',
    'websocket_server',
    'email_service'
  ];

  constructor(io: Server) {
    super('health-monitor', 'Health Monitor', io, {
      interval: 60000, // 1 minute
      settings: {
        alert_thresholds: this.healthThresholds,
        services_to_monitor: this.services,
        auto_restart: true,
        notification_channels: ['slack', 'email', 'dashboard']
      }
    });

    // Enable self-healing for this agent
    this.enableSelfHealing();
  }

  async execute(): Promise<any> {
    // Monitor system resources
    const systemHealth = await this.checkSystemHealth();
    
    // Check service availability
    const serviceHealth = await this.checkServiceHealth();
    
    // Monitor application performance
    const performanceMetrics = await this.checkPerformanceMetrics();
    
    // Check dependency health
    const dependencyHealth = await this.checkDependencyHealth();
    
    // Monitor security indicators
    const securityHealth = await this.checkSecurityHealth();
    
    // Calculate overall health score
    const overallHealth = this.calculateOverallHealth(
      systemHealth, 
      serviceHealth, 
      performanceMetrics, 
      dependencyHealth, 
      securityHealth
    );

    // Check for alerts
    const alerts = await this.generateHealthAlerts(
      systemHealth, 
      serviceHealth, 
      performanceMetrics
    );

    // Auto-healing: Attempt to fix issues if self-healing is enabled
    if (this.selfHealing && overallHealth.score < 75) {
      await this.performAutoHealing(systemHealth, serviceHealth, alerts);
    }

    const healthData = {
      timestamp: new Date(),
      overallHealth,
      systemHealth,
      serviceHealth,
      performanceMetrics,
      dependencyHealth,
      securityHealth,
      alerts,
      recommendations: this.generateHealthRecommendations(alerts, overallHealth)
    };

    this.emit('data', healthData);
    
    // Return data for AI analysis
    return healthData;
  }

  private async checkSystemHealth(): Promise<any> {
    // Mock system health check - in production, use actual system metrics
    return {
      cpu: {
        usage: 45 + Math.random() * 30,
        cores: 8,
        loadAverage: [1.2, 1.1, 0.9],
        status: 'healthy'
      },
      memory: {
        total: 16384, // MB
        used: 8192 + Math.random() * 4096,
        free: 4096 + Math.random() * 2048,
        cached: 2048,
        status: 'healthy'
      },
      disk: {
        total: 512000, // MB
        used: 256000 + Math.random() * 100000,
        free: 200000 - Math.random() * 50000,
        iops: 450 + Math.random() * 100,
        status: 'healthy'
      },
      network: {
        bytesIn: 1024000 + Math.random() * 500000,
        bytesOut: 2048000 + Math.random() * 1000000,
        packetsIn: 5000 + Math.random() * 1000,
        packetsOut: 4500 + Math.random() * 1000,
        status: 'healthy'
      },
      uptime: 86400 * 7 + Math.random() * 86400 // ~7 days
    };
  }

  private async checkServiceHealth(): Promise<any> {
    const serviceChecks = await Promise.all(
      this.services.map(service => this.checkIndividualService(service))
    );

    return {
      services: serviceChecks,
      totalServices: this.services.length,
      healthyServices: serviceChecks.filter(s => s.status === 'healthy').length,
      unhealthyServices: serviceChecks.filter(s => s.status !== 'healthy').length,
      overallStatus: this.calculateServiceStatus(serviceChecks)
    };
  }

  private async checkIndividualService(serviceName: string): Promise<any> {
    // Mock service health checks
    const mockHealth = {
      database: {
        status: 'healthy',
        responseTime: 15 + Math.random() * 10,
        connections: 45,
        maxConnections: 100,
        queryPerformance: 0.95,
        lastError: null
      },
      redis: {
        status: 'healthy',
        responseTime: 1 + Math.random() * 2,
        memoryUsage: 0.67,
        hitRate: 0.94,
        lastError: null
      },
      external_apis: {
        status: Math.random() > 0.1 ? 'healthy' : 'warning',
        responseTime: 150 + Math.random() * 100,
        successRate: 0.98,
        rateLimitRemaining: 8500,
        lastError: Math.random() > 0.9 ? 'Rate limit exceeded' : null
      },
      file_system: {
        status: 'healthy',
        readLatency: 5 + Math.random() * 3,
        writeLatency: 8 + Math.random() * 5,
        errorRate: 0.001,
        lastError: null
      },
      websocket_server: {
        status: 'healthy',
        activeConnections: 234,
        maxConnections: 1000,
        messageRate: 1500,
        lastError: null
      },
      email_service: {
        status: 'healthy',
        queueSize: 12,
        deliveryRate: 0.97,
        bounceRate: 0.03,
        lastError: null
      }
    };

    return {
      name: serviceName,
      ...mockHealth[serviceName as keyof typeof mockHealth]
    };
  }

  private async checkPerformanceMetrics(): Promise<any> {
    return {
      apiResponseTime: {
        avg: 145 + Math.random() * 50,
        p95: 280 + Math.random() * 100,
        p99: 450 + Math.random() * 200,
        status: 'healthy'
      },
      errorRate: {
        rate: Math.random() * 0.02,
        threshold: this.healthThresholds.errorRate,
        status: 'healthy'
      },
      throughput: {
        requestsPerSecond: 150 + Math.random() * 50,
        peakRps: 300,
        status: 'healthy'
      },
      concurrency: {
        activeRequests: 45 + Math.random() * 20,
        maxConcurrent: 100,
        queueSize: 5 + Math.random() * 10,
        status: 'healthy'
      }
    };
  }

  private async checkDependencyHealth(): Promise<any> {
    return {
      externalServices: [
        {
          name: 'Stripe API',
          status: 'healthy',
          responseTime: 120,
          lastCheck: new Date(),
          uptime: 99.9
        },
        {
          name: 'SendGrid API',
          status: 'healthy',
          responseTime: 89,
          lastCheck: new Date(),
          uptime: 99.8
        },
        {
          name: 'Auth0',
          status: 'warning',
          responseTime: 340,
          lastCheck: new Date(),
          uptime: 99.5
        }
      ],
      internalServices: [
        {
          name: 'Agent Manager',
          status: 'healthy',
          activeAgents: 16,
          errorRate: 0.001
        },
        {
          name: 'WebSocket Server',
          status: 'healthy',
          connections: 234,
          messageRate: 1500
        }
      ]
    };
  }

  private async checkSecurityHealth(): Promise<any> {
    return {
      certificateStatus: {
        ssl: { valid: true, expiresIn: 89, status: 'healthy' },
        api: { valid: true, expiresIn: 156, status: 'healthy' }
      },
      authenticationMetrics: {
        failedLogins: 12,
        suspiciousActivity: 2,
        blockedIPs: 5,
        status: 'healthy'
      },
      vulnerabilityScans: {
        lastScan: new Date(Date.now() - 86400000), // 1 day ago
        criticalVulns: 0,
        highVulns: 0,
        mediumVulns: 2,
        status: 'healthy'
      },
      dataIntegrity: {
        backupStatus: 'healthy',
        lastBackup: new Date(Date.now() - 3600000), // 1 hour ago
        checksumValidation: true,
        status: 'healthy'
      }
    };
  }

  private calculateOverallHealth(
    system: any, 
    services: any, 
    performance: any, 
    dependencies: any, 
    security: any
  ): any {
    let score = 100;
    let issues = [];

    // System health impact
    if (system.cpu.usage > this.healthThresholds.cpu) {
      score -= 15;
      issues.push('High CPU usage');
    }
    if ((system.memory.used / system.memory.total) > (this.healthThresholds.memory / 100)) {
      score -= 15;
      issues.push('High memory usage');
    }

    // Service health impact
    const unhealthyServiceRatio = services.unhealthyServices / services.totalServices;
    score -= unhealthyServiceRatio * 30;

    // Performance impact
    if (performance.errorRate.rate > this.healthThresholds.errorRate) {
      score -= 20;
      issues.push('High error rate');
    }

    // Security impact
    if (security.vulnerabilityScans.criticalVulns > 0) {
      score -= 25;
      issues.push('Critical vulnerabilities detected');
    }

    return {
      score: Math.max(0, Math.round(score)),
      status: this.getHealthStatus(score),
      issues,
      lastUpdated: new Date()
    };
  }

  private calculateServiceStatus(serviceChecks: any[]): string {
    const healthyCount = serviceChecks.filter(s => s.status === 'healthy').length;
    const warningCount = serviceChecks.filter(s => s.status === 'warning').length;
    const criticalCount = serviceChecks.filter(s => s.status === 'critical').length;

    if (criticalCount > 0) return 'critical';
    if (warningCount > serviceChecks.length * 0.3) return 'warning';
    if (healthyCount === serviceChecks.length) return 'healthy';
    return 'warning';
  }

  private async generateHealthAlerts(system: any, services: any, performance: any): Promise<any[]> {
    const alerts = [];

    // CPU alerts
    if (system.cpu.usage > this.healthThresholds.cpu) {
      alerts.push({
        type: 'system',
        severity: 'warning',
        message: `CPU usage at ${system.cpu.usage.toFixed(1)}% (threshold: ${this.healthThresholds.cpu}%)`,
        component: 'cpu',
        timestamp: new Date()
      });
    }

    // Memory alerts
    const memoryUsage = (system.memory.used / system.memory.total) * 100;
    if (memoryUsage > this.healthThresholds.memory) {
      alerts.push({
        type: 'system',
        severity: 'critical',
        message: `Memory usage at ${memoryUsage.toFixed(1)}% (threshold: ${this.healthThresholds.memory}%)`,
        component: 'memory',
        timestamp: new Date()
      });
    }

    // Service alerts
    services.services.forEach((service: any) => {
      if (service.status !== 'healthy') {
        alerts.push({
          type: 'service',
          severity: service.status === 'critical' ? 'critical' : 'warning',
          message: `${service.name} service is ${service.status}`,
          component: service.name,
          timestamp: new Date()
        });
      }
    });

    // Performance alerts
    if (performance.errorRate.rate > this.healthThresholds.errorRate) {
      alerts.push({
        type: 'performance',
        severity: 'warning',
        message: `Error rate at ${(performance.errorRate.rate * 100).toFixed(2)}% (threshold: ${(this.healthThresholds.errorRate * 100)}%)`,
        component: 'api',
        timestamp: new Date()
      });
    }

    return alerts;
  }

  private getHealthStatus(score: number): string {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    if (score >= 40) return 'poor';
    return 'critical';
  }

  private async performAutoHealing(systemHealth: any, serviceHealth: any, alerts: any[]): Promise<void> {
    console.log(`🔧 Health Monitor performing auto-healing (health score: ${systemHealth.cpu.usage})`);

    // Auto-fix: Clear caches if memory usage is high
    if (systemHealth.memory.used / systemHealth.memory.total > 0.85) {
      await this.clearSystemCaches();
    }

    // Auto-fix: Restart unhealthy services
    const unhealthyServices = serviceHealth.services.filter((s: any) => s.status !== 'healthy');
    if (unhealthyServices.length > 0) {
      await this.restartUnhealthyServices(unhealthyServices);
    }

    // Auto-fix: Clean up temporary files if disk usage is high
    if (systemHealth.disk.used / systemHealth.disk.total > 0.9) {
      await this.cleanupDiskSpace();
    }

    // Auto-fix: Garbage collection if memory is high
    if (systemHealth.memory.used / systemHealth.memory.total > 0.9) {
      await this.forceGarbageCollection();
    }
  }

  private async clearSystemCaches(): Promise<void> {
    try {
      console.log('🧹 Clearing system caches...');
      
      // Simulate cache clearing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.emit('auto-healing', {
        action: 'clear_caches',
        status: 'completed',
        timestamp: new Date()
      });
      
      console.log('✅ System caches cleared');
    } catch (error) {
      console.error('❌ Failed to clear caches:', error);
    }
  }

  private async restartUnhealthyServices(services: any[]): Promise<void> {
    try {
      console.log(`🔄 Restarting ${services.length} unhealthy service(s)...`);
      
      for (const service of services) {
        // Simulate service restart
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.emit('service-restarted', {
          service: service.name,
          timestamp: new Date()
        });
      }
      
      this.emit('auto-healing', {
        action: 'restart_services',
        services: services.map(s => s.name),
        status: 'completed',
        timestamp: new Date()
      });
      
      console.log('✅ Unhealthy services restarted');
    } catch (error) {
      console.error('❌ Failed to restart services:', error);
    }
  }

  private async cleanupDiskSpace(): Promise<void> {
    try {
      console.log('🗑️ Cleaning up disk space...');
      
      // Simulate disk cleanup
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      this.emit('auto-healing', {
        action: 'cleanup_disk',
        status: 'completed',
        timestamp: new Date()
      });
      
      console.log('✅ Disk space cleaned up');
    } catch (error) {
      console.error('❌ Failed to cleanup disk space:', error);
    }
  }

  private async forceGarbageCollection(): Promise<void> {
    try {
      console.log('🗑️ Forcing garbage collection...');
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      this.emit('auto-healing', {
        action: 'garbage_collection',
        status: 'completed',
        timestamp: new Date()
      });
      
      console.log('✅ Garbage collection completed');
    } catch (error) {
      console.error('❌ Failed to force garbage collection:', error);
    }
  }

  private generateHealthRecommendations(alerts: any[], overallHealth: any): string[] {
    const recommendations = [];

    if (overallHealth.score < 70) {
      recommendations.push('Overall system health below 70% - immediate attention required');
    }

    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    if (criticalAlerts.length > 0) {
      recommendations.push(`${criticalAlerts.length} critical alerts detected - prioritize resolution`);
    }

    const systemAlerts = alerts.filter(a => a.type === 'system');
    if (systemAlerts.length > 0) {
      recommendations.push('System resource constraints detected - consider scaling');
    }

    const serviceAlerts = alerts.filter(a => a.type === 'service');
    if (serviceAlerts.length > 2) {
      recommendations.push('Multiple service issues detected - check infrastructure');
    }

    if (recommendations.length === 0) {
      recommendations.push('System health is optimal - continue monitoring');
    }

    return recommendations;
  }
}