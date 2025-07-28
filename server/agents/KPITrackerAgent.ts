import { Server } from 'socket.io';
import { BaseAgent } from './BaseAgent.js';

export class KPITrackerAgent extends BaseAgent {
  constructor(io: Server) {
    super('kpi-tracker', 'KPI Tracker', io, {
      interval: 120000, // 2 minutes
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

  async execute(): Promise<any> {
    // Simulate KPI data collection with more realistic scenarios
    const kpis = this.config.settings.kpis || [];
    const data: Record<string, number> = {};
    const issues: string[] = [];
    const opportunities: string[] = [];

    for (const kpi of kpis) {
      // Simulate fetching KPI data with realistic scenarios
      data[kpi] = this.generateMockKPIValue(kpi);
      
      // Simulate issues and opportunities
      if (kpi === 'revenue' && data[kpi] < 30000) {
        issues.push('Revenue is declining - 15% below target');
      } else if (kpi === 'revenue' && data[kpi] > 80000) {
        opportunities.push('Revenue is exceeding expectations - consider scaling');
      }
      
      if (kpi === 'conversion_rate' && data[kpi] < 0.03) {
        issues.push('Conversion rate is critically low - UX optimization needed');
      } else if (kpi === 'conversion_rate' && data[kpi] > 0.08) {
        opportunities.push('High conversion rate - consider increasing ad spend');
      }
      
      if (kpi === 'user_acquisition' && data[kpi] < 50) {
        issues.push('User acquisition is declining - marketing strategy review needed');
      } else if (kpi === 'user_acquisition' && data[kpi] > 200) {
        opportunities.push('Strong user growth - consider expanding to new markets');
      }
    }

    // Check thresholds and emit alerts if needed
    this.checkThresholds(data);

    const kpiData = {
      timestamp: new Date(),
      kpis: data,
      trend: this.calculateTrend(data),
      issues,
      opportunities,
      performance: this.calculatePerformanceScore(data),
      recommendations: this.generateRecommendations(data, issues, opportunities)
    };

    // Emit the collected data
    this.emit('data', kpiData);
    
    // Return data for AI analysis
    return kpiData;
  }

  private generateMockKPIValue(kpi: string): number {
    const baseValues = {
      revenue: 50000,
      conversion_rate: 0.05,
      user_acquisition: 100
    };

    const base = baseValues[kpi as keyof typeof baseValues] || 100;
    
    // Create more varied scenarios to trigger different insights
    const scenarios = [
      { probability: 0.3, multiplier: 0.6 }, // Low performance
      { probability: 0.4, multiplier: 1.0 }, // Normal performance
      { probability: 0.2, multiplier: 1.4 }, // High performance
      { probability: 0.1, multiplier: 1.8 }  // Exceptional performance
    ];

    const random = Math.random();
    let cumulativeProbability = 0;
    let selectedScenario = scenarios[0];

    for (const scenario of scenarios) {
      cumulativeProbability += scenario.probability;
      if (random <= cumulativeProbability) {
        selectedScenario = scenario;
        break;
      }
    }

    const variance = base * 0.15; // 15% variance
    return base * selectedScenario.multiplier + (Math.random() - 0.5) * variance;
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

  private calculatePerformanceScore(data: Record<string, number>): number {
    const weights = {
      revenue: 0.4,
      conversion_rate: 0.35,
      user_acquisition: 0.25
    };

    let score = 0;
    for (const [kpi, value] of Object.entries(data)) {
      const weight = weights[kpi as keyof typeof weights] || 0.33;
      const normalizedValue = this.normalizeKPIValue(kpi, value);
      score += normalizedValue * weight;
    }

    return Math.round(score * 100);
  }

  private normalizeKPIValue(kpi: string, value: number): number {
    const ranges = {
      revenue: { min: 10000, max: 100000 },
      conversion_rate: { min: 0.01, max: 0.15 },
      user_acquisition: { min: 10, max: 500 }
    };

    const range = ranges[kpi as keyof typeof ranges];
    if (!range) return 0.5;

    const normalized = (value - range.min) / (range.max - range.min);
    return Math.max(0, Math.min(1, normalized));
  }

  private generateRecommendations(
    data: Record<string, number>, 
    issues: string[], 
    opportunities: string[]
  ): string[] {
    const recommendations: string[] = [];

    // Revenue recommendations
    if (data.revenue < 30000) {
      recommendations.push('Implement pricing optimization strategy');
      recommendations.push('Launch targeted marketing campaigns');
    } else if (data.revenue > 80000) {
      recommendations.push('Consider expanding to new markets');
      recommendations.push('Increase customer lifetime value programs');
    }

    // Conversion rate recommendations
    if (data.conversion_rate < 0.03) {
      recommendations.push('A/B test landing page elements');
      recommendations.push('Optimize checkout flow');
    } else if (data.conversion_rate > 0.08) {
      recommendations.push('Increase ad spend on high-performing channels');
      recommendations.push('Scale successful campaigns');
    }

    // User acquisition recommendations
    if (data.user_acquisition < 50) {
      recommendations.push('Review and optimize marketing channels');
      recommendations.push('Implement referral program');
    } else if (data.user_acquisition > 200) {
      recommendations.push('Expand to new geographic markets');
      recommendations.push('Develop strategic partnerships');
    }

    return recommendations;
  }
}