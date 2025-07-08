import { Server } from 'socket.io';
import { BaseAgent } from './BaseAgent.js';

export class KPITrackerAgent extends BaseAgent {
  private lastValues: Record<string, number> = {};

  constructor(io: Server) {
    super('kpi-tracker', 'KPI Tracker', io, {
      interval: 30000, // 30 seconds
      settings: {
        kpis: ['revenue', 'conversion_rate', 'user_acquisition', 'customer_satisfaction'],
        thresholds: {
          revenue: { min: 1000, max: 100000 },
          conversion_rate: { min: 0.01, max: 0.1 },
          user_acquisition: { min: 10, max: 1000 },
          customer_satisfaction: { min: 0.7, max: 1.0 }
        }
      }
    });
  }

  async execute(): Promise<void> {
    // Simulate KPI data collection
    const kpis = this.config.settings.kpis || [];
    const data: Record<string, number> = {};
    const alerts: string[] = [];

    for (const kpi of kpis) {
      // Generate realistic values with some variance
      data[kpi] = this.generateKPIValue(kpi);
      
      // Check thresholds
      const threshold = this.config.settings.thresholds?.[kpi];
      if (threshold) {
        if (data[kpi] < threshold.min) {
          alerts.push(`${kpi} below minimum threshold: ${data[kpi]} < ${threshold.min}`);
        } else if (data[kpi] > threshold.max) {
          alerts.push(`${kpi} above maximum threshold: ${data[kpi]} > ${threshold.max}`);
        }
      }
    }

    // Calculate trends
    const trends = this.calculateTrends(data);

    // Emit the collected data
    this.emitData({
      timestamp: new Date(),
      kpis: data,
      trends,
      alerts,
      summary: this.generateSummary(data, trends)
    });

    // Store current values for trend calculation
    this.lastValues = { ...data };

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
  }

  private generateKPIValue(kpi: string): number {
    const lastValue = this.lastValues[kpi];
    let baseValue: number;
    let variance: number;

    switch (kpi) {
      case 'revenue':
        baseValue = lastValue || 50000;
        variance = 0.05; // 5% variance
        return Math.max(0, baseValue * (1 + (Math.random() - 0.5) * variance));

      case 'conversion_rate':
        baseValue = lastValue || 0.03;
        variance = 0.1; // 10% variance
        return Math.max(0, Math.min(1, baseValue * (1 + (Math.random() - 0.5) * variance)));

      case 'user_acquisition':
        baseValue = lastValue || 150;
        variance = 0.2; // 20% variance
        return Math.max(0, Math.round(baseValue * (1 + (Math.random() - 0.5) * variance)));

      case 'customer_satisfaction':
        baseValue = lastValue || 0.85;
        variance = 0.05; // 5% variance
        return Math.max(0, Math.min(1, baseValue * (1 + (Math.random() - 0.5) * variance)));

      default:
        return Math.random() * 100;
    }
  }

  private calculateTrends(currentData: Record<string, number>): Record<string, { direction: 'up' | 'down' | 'stable', change: number }> {
    const trends: Record<string, { direction: 'up' | 'down' | 'stable', change: number }> = {};

    for (const [kpi, currentValue] of Object.entries(currentData)) {
      const lastValue = this.lastValues[kpi];
      
      if (lastValue !== undefined) {
        const change = ((currentValue - lastValue) / lastValue) * 100;
        let direction: 'up' | 'down' | 'stable';
        
        if (Math.abs(change) < 1) {
          direction = 'stable';
        } else if (change > 0) {
          direction = 'up';
        } else {
          direction = 'down';
        }

        trends[kpi] = { direction, change: Math.round(change * 100) / 100 };
      } else {
        trends[kpi] = { direction: 'stable', change: 0 };
      }
    }

    return trends;
  }

  private generateSummary(data: Record<string, number>, trends: Record<string, any>): string {
    const kpiCount = Object.keys(data).length;
    const upTrends = Object.values(trends).filter(t => t.direction === 'up').length;
    const downTrends = Object.values(trends).filter(t => t.direction === 'down').length;

    if (upTrends > downTrends) {
      return `Positive performance: ${upTrends}/${kpiCount} KPIs trending up`;
    } else if (downTrends > upTrends) {
      return `Declining performance: ${downTrends}/${kpiCount} KPIs trending down`;
    } else {
      return `Stable performance: ${kpiCount} KPIs monitored`;
    }
  }
}