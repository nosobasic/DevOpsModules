import { Server } from 'socket.io';
import { BaseAgent } from './BaseAgent.js';

export class KPITrackerAgent extends BaseAgent {
  constructor(io: Server) {
    super('kpi-tracker', 'KPI Tracker', io, {
      interval: 30000, // 30 seconds
      settings: {
        kpis: ['revenue', 'conversion_rate', 'user_acquisition'],
        thresholds: {
          revenue: { min: 1000, max: 100000 },
          conversion_rate: { min: 0.01, max: 0.1 },
          user_acquisition: { min: 10, max: 1000 }
        }
      }
    });
  }

  async execute(): Promise<void> {
    // Simulate KPI data collection
    const kpis = this.config.settings.kpis || [];
    const data: Record<string, number> = {};

    for (const kpi of kpis) {
      // Simulate fetching KPI data
      data[kpi] = this.generateMockKPIValue(kpi);
    }

    // Check thresholds and emit alerts if needed
    this.checkThresholds(data);

    // Emit the collected data
    this.emit('data', {
      timestamp: new Date(),
      kpis: data,
      trend: this.calculateTrend(data)
    });
  }

  private generateMockKPIValue(kpi: string): number {
    const baseValues = {
      revenue: 50000,
      conversion_rate: 0.05,
      user_acquisition: 100
    };

    const base = baseValues[kpi] || 100;
    const variance = base * 0.1; // 10% variance
    return base + (Math.random() - 0.5) * variance;
  }

  private checkThresholds(data: Record<string, number>): void {
    const thresholds = this.config.settings.thresholds || {};

    for (const [kpi, value] of Object.entries(data)) {
      const threshold = thresholds[kpi];
      if (threshold) {
        if (value < threshold.min) {
          this.emit('alert', {
            type: 'threshold_breach',
            kpi,
            value,
            threshold: threshold.min,
            severity: 'warning',
            message: `${kpi} is below minimum threshold`
          });
        } else if (value > threshold.max) {
          this.emit('alert', {
            type: 'threshold_breach',
            kpi,
            value,
            threshold: threshold.max,
            severity: 'warning',
            message: `${kpi} is above maximum threshold`
          });
        }
      }
    }
  }

  private calculateTrend(data: Record<string, number>): Record<string, 'up' | 'down' | 'stable'> {
    // Simplified trend calculation
    const trends: Record<string, 'up' | 'down' | 'stable'> = {};
    
    for (const kpi of Object.keys(data)) {
      const recent = this.metrics.dataPoints.slice(-5);
      if (recent.length >= 2) {
        const firstValue = recent[0].metadata?.kpis?.[kpi] || 0;
        const lastValue = recent[recent.length - 1].metadata?.kpis?.[kpi] || 0;
        const change = (lastValue - firstValue) / firstValue;
        
        if (change > 0.05) trends[kpi] = 'up';
        else if (change < -0.05) trends[kpi] = 'down';
        else trends[kpi] = 'stable';
      } else {
        trends[kpi] = 'stable';
      }
    }
    
    return trends;
  }
}