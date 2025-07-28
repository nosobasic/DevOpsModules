import { Server } from 'socket.io';
import os from 'os';
import fs from 'fs/promises';

export interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    loadAverage: number[];
  };
  memory: {
    total: number;
    used: number;
    free: number;
    cached: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
  };
  uptime: number;
}

export interface ProcessMetrics {
  pid: number;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  cpu: {
    user: number;
    system: number;
  };
  eventLoop: {
    delay: number;
    utilization: number;
  };
  handles: number;
  requests: number;
}

export interface ServiceMetrics {
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  responseTime: number;
  errorRate: number;
  lastCheck: Date;
  metadata?: Record<string, any>;
}

export class HealthMetrics {
  private io?: Server;
  private metrics: Map<string, any> = new Map();
  private isCollecting = false;
  private collectionInterval?: NodeJS.Timeout;

  constructor(io?: Server) {
    this.io = io;
  }

  startCollection(intervalMs: number = 30000): void {
    if (this.isCollecting) return;

    this.isCollecting = true;
    this.collectionInterval = setInterval(() => {
      this.collectAndEmitMetrics();
    }, intervalMs);

    // Initial collection
    this.collectAndEmitMetrics();
  }

  stopCollection(): void {
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
      this.collectionInterval = undefined;
    }
    this.isCollecting = false;
  }

  private async collectAndEmitMetrics(): Promise<void> {
    try {
      const systemMetrics = await this.collectSystemMetrics();
      const processMetrics = await this.collectProcessMetrics();
      const serviceMetrics = await this.collectServiceMetrics();

      const allMetrics = {
        timestamp: new Date(),
        system: systemMetrics,
        process: processMetrics,
        services: serviceMetrics,
        health: this.calculateHealthScore(systemMetrics, processMetrics, serviceMetrics)
      };

      this.metrics.set('latest', allMetrics);

      if (this.io) {
        this.io.emit('health:metrics', allMetrics);
      }
    } catch (error) {
      console.error('Failed to collect health metrics:', error);
    }
  }

  async collectSystemMetrics(): Promise<SystemMetrics> {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    // Calculate CPU usage (simplified)
    const cpuUsage = await this.getCPUUsage();

    // Get disk usage (simplified for cross-platform compatibility)
    const diskUsage = await this.getDiskUsage();

    return {
      cpu: {
        usage: cpuUsage,
        cores: cpus.length,
        loadAverage: os.loadavg()
      },
      memory: {
        total: Math.round(totalMem / 1024 / 1024), // MB
        used: Math.round(usedMem / 1024 / 1024), // MB
        free: Math.round(freeMem / 1024 / 1024), // MB
        cached: 0 // Simplified
      },
      disk: diskUsage,
      network: {
        bytesIn: 0, // Would need platform-specific implementation
        bytesOut: 0
      },
      uptime: os.uptime()
    };
  }

  async collectProcessMetrics(): Promise<ProcessMetrics> {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      pid: process.pid,
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024), // MB
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        external: Math.round(memUsage.external / 1024 / 1024) // MB
      },
      cpu: {
        user: cpuUsage.user / 1000, // Convert to milliseconds
        system: cpuUsage.system / 1000
      },
      eventLoop: {
        delay: await this.measureEventLoopDelay(),
        utilization: await this.measureEventLoopUtilization()
      },
      handles: (process as any)._getActiveHandles?.()?.length || 0,
      requests: (process as any)._getActiveRequests?.()?.length || 0
    };
  }

  async collectServiceMetrics(): Promise<ServiceMetrics[]> {
    const services: ServiceMetrics[] = [];

    // Add built-in service checks
    services.push(await this.checkNodeJSHealth());
    services.push(await this.checkMemoryHealth());
    services.push(await this.checkEventLoopHealth());

    return services;
  }

  private async getCPUUsage(): Promise<number> {
    return new Promise((resolve) => {
      const startUsage = process.cpuUsage();
      const startTime = process.hrtime();

      setTimeout(() => {
        const currentUsage = process.cpuUsage(startUsage);
        const currentTime = process.hrtime(startTime);

        const totalTime = currentTime[0] * 1e6 + currentTime[1] / 1e3; // Convert to microseconds
        const cpuPercent = ((currentUsage.user + currentUsage.system) / totalTime) * 100;

        resolve(Math.min(100, Math.max(0, cpuPercent)));
      }, 100);
    });
  }

  private async getDiskUsage(): Promise<{ total: number; used: number; free: number }> {
    try {
      // Simplified disk usage - in production, use a proper disk usage library
      const stats = await fs.stat('.');
      return {
        total: 100000, // Mock values in MB
        used: 45000,
        free: 55000
      };
    } catch (error) {
      return {
        total: 0,
        used: 0,
        free: 0
      };
    }
  }

  private async measureEventLoopDelay(): Promise<number> {
    return new Promise((resolve) => {
      const start = process.hrtime.bigint();
      setImmediate(() => {
        const delta = process.hrtime.bigint() - start;
        resolve(Number(delta / BigInt(1000000))); // Convert to milliseconds
      });
    });
  }

  private async measureEventLoopUtilization(): Promise<number> {
    // Simplified event loop utilization measurement
    const start = process.hrtime.bigint();
    await new Promise(resolve => setImmediate(resolve));
    const end = process.hrtime.bigint();
    
    const duration = Number(end - start) / 1000000; // Convert to milliseconds
    return Math.min(100, duration); // Simplified calculation
  }

  private async checkNodeJSHealth(): Promise<ServiceMetrics> {
    const memUsage = process.memoryUsage();
    const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

    let status: ServiceMetrics['status'] = 'healthy';
    if (heapUsedPercent > 90) status = 'critical';
    else if (heapUsedPercent > 75) status = 'warning';

    return {
      name: 'Node.js Process',
      status,
      responseTime: 0,
      errorRate: 0,
      lastCheck: new Date(),
      metadata: {
        version: process.version,
        heapUsedPercent: Math.round(heapUsedPercent),
        uptime: process.uptime()
      }
    };
  }

  private async checkMemoryHealth(): Promise<ServiceMetrics> {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedPercent = ((totalMem - freeMem) / totalMem) * 100;

    let status: ServiceMetrics['status'] = 'healthy';
    if (usedPercent > 95) status = 'critical';
    else if (usedPercent > 85) status = 'warning';

    return {
      name: 'System Memory',
      status,
      responseTime: 0,
      errorRate: 0,
      lastCheck: new Date(),
      metadata: {
        usedPercent: Math.round(usedPercent),
        totalGB: Math.round(totalMem / 1024 / 1024 / 1024),
        freeGB: Math.round(freeMem / 1024 / 1024 / 1024)
      }
    };
  }

  private async checkEventLoopHealth(): Promise<ServiceMetrics> {
    const delay = await this.measureEventLoopDelay();
    
    let status: ServiceMetrics['status'] = 'healthy';
    if (delay > 100) status = 'critical';
    else if (delay > 50) status = 'warning';

    return {
      name: 'Event Loop',
      status,
      responseTime: delay,
      errorRate: 0,
      lastCheck: new Date(),
      metadata: {
        delayMs: Math.round(delay),
        threshold: { warning: 50, critical: 100 }
      }
    };
  }

  private calculateHealthScore(system: SystemMetrics, process: ProcessMetrics, services: ServiceMetrics[]): number {
    let score = 100;

    // System health impact
    if (system.cpu.usage > 80) score -= 15;
    if ((system.memory.used / system.memory.total) > 0.9) score -= 20;

    // Process health impact
    if (process.memory.heapUsed / process.memory.heapTotal > 0.8) score -= 10;
    if (process.eventLoop.delay > 50) score -= 10;

    // Service health impact
    const criticalServices = services.filter(s => s.status === 'critical').length;
    const warningServices = services.filter(s => s.status === 'warning').length;
    
    score -= criticalServices * 15;
    score -= warningServices * 5;

    return Math.max(0, Math.round(score));
  }

  getLatestMetrics(): any {
    return this.metrics.get('latest');
  }

  getMetricsHistory(): any[] {
    // In a real implementation, you'd store historical data
    return [this.metrics.get('latest')].filter(Boolean);
  }
}

// Export singleton instance
export const healthMetrics = new HealthMetrics();