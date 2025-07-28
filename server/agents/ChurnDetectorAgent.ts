import { Server } from 'socket.io';
import { BaseAgent } from './BaseAgent.js';

export class ChurnDetectorAgent extends BaseAgent {
  private churnModels: Map<string, any> = new Map();
  private riskThresholds = {
    high: 0.8,
    medium: 0.6,
    low: 0.4
  };

  constructor(io: Server) {
    super('churn-detector', 'Churn Detector', io, {
      interval: 300000, // 5 minutes
      settings: {
        risk_factors: ['login_frequency', 'purchase_recency', 'support_tickets', 'feature_usage'],
        intervention_triggers: ['high_risk', 'medium_risk_trending_up'],
        prediction_window: 30, // days
        confidence_threshold: 0.75
      }
    });

    // Enable self-healing for this agent
    this.enableSelfHealing();
  }

  async execute(): Promise<any> {
    // Analyze customer risk levels
    const riskAnalysis = await this.analyzeCustomerRisk();
    
    // Identify customers at risk of churning
    const atRiskCustomers = await this.identifyAtRiskCustomers();
    
    // Generate intervention recommendations
    const interventions = await this.generateInterventions(atRiskCustomers);
    
    // Track intervention effectiveness
    const interventionResults = await this.trackInterventionResults();
    
    // Analyze churn patterns
    const churnPatterns = await this.analyzeChurnPatterns();

    // Auto-healing: Trigger interventions for high-risk customers
    const highRiskCustomers = atRiskCustomers.filter(c => c.riskLevel === 'high');
    if (this.selfHealing && highRiskCustomers.length > 5) {
      await this.autoTriggerRetentionCampaigns(highRiskCustomers);
    }

    const churnData = {
      timestamp: new Date(),
      totalAtRisk: atRiskCustomers.length,
      riskDistribution: riskAnalysis.distribution,
      highRiskCustomers: highRiskCustomers.length,
      interventionSuccess: interventionResults.successRate,
      churnPredictionAccuracy: interventionResults.accuracy,
      topRiskFactors: churnPatterns.topFactors,
      atRiskCustomers,
      interventions,
      recommendations: this.generateChurnRecommendations(riskAnalysis, interventionResults)
    };

    this.emit('data', churnData);
    
    // Return data for AI analysis
    return churnData;
  }

  private async analyzeCustomerRisk(): Promise<any> {
    return {
      distribution: {
        high: { count: 89, percentage: 3.2 },
        medium: { count: 234, percentage: 8.5 },
        low: { count: 456, percentage: 16.6 },
        stable: { count: 1967, percentage: 71.7 }
      },
      trendingRisk: {
        increasing: 45,
        stable: 189,
        decreasing: 23
      },
      riskFactorAnalysis: {
        decreased_engagement: { weight: 0.35, affected_customers: 167 },
        payment_issues: { weight: 0.28, affected_customers: 89 },
        support_escalations: { weight: 0.22, affected_customers: 34 },
        feature_abandonment: { weight: 0.15, affected_customers: 78 }
      }
    };
  }

  private async identifyAtRiskCustomers(): Promise<any[]> {
    // Mock at-risk customer identification
    return [
      {
        customerId: 'cust_001',
        email: 'user1@example.com',
        riskScore: 0.87,
        riskLevel: 'high',
        riskFactors: ['login_frequency_drop', 'no_recent_purchase', 'support_ticket'],
        lastActivity: new Date(Date.now() - 86400000 * 14), // 14 days ago
        customerValue: 245.80,
        tenure: 8, // months
        predictedChurnDate: new Date(Date.now() + 86400000 * 7) // 7 days from now
      },
      {
        customerId: 'cust_002',
        email: 'user2@example.com',
        riskScore: 0.73,
        riskLevel: 'high',
        riskFactors: ['payment_failed', 'feature_usage_drop'],
        lastActivity: new Date(Date.now() - 86400000 * 21), // 21 days ago
        customerValue: 567.20,
        tenure: 15,
        predictedChurnDate: new Date(Date.now() + 86400000 * 12)
      },
      {
        customerId: 'cust_003',
        email: 'user3@example.com',
        riskScore: 0.64,
        riskLevel: 'medium',
        riskFactors: ['engagement_decline', 'competitive_browsing'],
        lastActivity: new Date(Date.now() - 86400000 * 7),
        customerValue: 123.45,
        tenure: 4,
        predictedChurnDate: new Date(Date.now() + 86400000 * 18)
      }
    ];
  }

  private async generateInterventions(atRiskCustomers: any[]): Promise<any[]> {
    return atRiskCustomers.map(customer => {
      const interventions = [];

      if (customer.riskFactors.includes('login_frequency_drop')) {
        interventions.push({
          type: 'engagement',
          action: 'Send personalized feature highlights email',
          priority: 'high',
          estimatedImpact: 0.35
        });
      }

      if (customer.riskFactors.includes('payment_failed')) {
        interventions.push({
          type: 'billing',
          action: 'Proactive payment assistance and alternative payment methods',
          priority: 'critical',
          estimatedImpact: 0.68
        });
      }

      if (customer.riskFactors.includes('support_ticket')) {
        interventions.push({
          type: 'support',
          action: 'Priority support assignment and follow-up call',
          priority: 'high',
          estimatedImpact: 0.42
        });
      }

      if (customer.customerValue > 200) {
        interventions.push({
          type: 'retention',
          action: 'Account manager outreach with exclusive offer',
          priority: 'high',
          estimatedImpact: 0.58
        });
      }

      return {
        customerId: customer.customerId,
        riskLevel: customer.riskLevel,
        interventions,
        recommendedAction: this.selectBestIntervention(interventions),
        timeline: this.calculateInterventionTimeline(customer.predictedChurnDate)
      };
    });
  }

  private async trackInterventionResults(): Promise<any> {
    return {
      successRate: 0.73,
      accuracy: 0.81,
      interventionEffectiveness: {
        'engagement': { attempts: 145, success: 89, rate: 0.61 },
        'billing': { attempts: 67, success: 52, rate: 0.78 },
        'support': { attempts: 89, success: 71, rate: 0.80 },
        'retention': { attempts: 34, success: 28, rate: 0.82 }
      },
      falsePozitives: 0.12,
      costPerIntervention: 23.50,
      revenueRetained: 34567.80
    };
  }

  private async analyzeChurnPatterns(): Promise<any> {
    return {
      topFactors: [
        { factor: 'Payment failure', impact: 0.34, preventable: true },
        { factor: 'Support dissatisfaction', impact: 0.28, preventable: true },
        { factor: 'Competitor switching', impact: 0.19, preventable: false },
        { factor: 'Feature deprecation', impact: 0.12, preventable: true },
        { factor: 'Price sensitivity', impact: 0.07, preventable: false }
      ],
      seasonalTrends: {
        q1: 1.15, // Relative churn rate
        q2: 0.87,
        q3: 0.92,
        q4: 1.06
      },
      cohortAnalysis: {
        month1: 0.15,
        month3: 0.12,
        month6: 0.08,
        month12: 0.05,
        month24: 0.03
      },
      churnReasons: {
        'price': 0.31,
        'features': 0.24,
        'support': 0.18,
        'competition': 0.15,
        'other': 0.12
      }
    };
  }

  private selectBestIntervention(interventions: any[]): any {
    if (interventions.length === 0) return null;
    
    // Select intervention with highest impact and appropriate priority
    return interventions.reduce((best, current) => {
      if (current.priority === 'critical') return current;
      if (best.priority !== 'critical' && current.estimatedImpact > best.estimatedImpact) {
        return current;
      }
      return best;
    });
  }

  private calculateInterventionTimeline(predictedChurnDate: Date): string {
    const daysUntilChurn = Math.ceil((predictedChurnDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilChurn <= 7) return 'immediate';
    if (daysUntilChurn <= 14) return 'within_week';
    if (daysUntilChurn <= 30) return 'within_month';
    return 'monitor';
  }

  private async autoTriggerRetentionCampaigns(highRiskCustomers: any[]): Promise<void> {
    try {
      console.log(`🔧 Churn Detector auto-triggering retention campaigns for ${highRiskCustomers.length} high-risk customers...`);

      for (const customer of highRiskCustomers) {
        // Determine best intervention strategy
        const strategy = this.selectOptimalStrategy(customer);
        
        // Execute intervention
        await this.executeIntervention(customer, strategy);
        
        // Schedule follow-up
        await this.scheduleFollowUp(customer);

        this.emit('intervention-triggered', {
          customerId: customer.customerId,
          strategy: strategy.type,
          riskScore: customer.riskScore,
          timestamp: new Date()
        });
      }

      this.emit('auto-healing', {
        action: 'retention_campaigns',
        customersTargeted: highRiskCustomers.length,
        status: 'completed',
        timestamp: new Date()
      });

      console.log('✅ Retention campaigns auto-triggered');
      
    } catch (error) {
      console.error('❌ Auto-trigger retention campaigns failed:', error);
    }
  }

  private selectOptimalStrategy(customer: any): any {
    const strategies = {
      payment_failed: {
        type: 'billing_assistance',
        message: 'Payment support and flexible options',
        discount: 0.15
      },
      low_engagement: {
        type: 'feature_highlight',
        message: 'Discover unused features',
        bonus: 'premium_trial'
      },
      support_issues: {
        type: 'priority_support',
        message: 'Personal success manager assignment',
        escalation: true
      },
      default: {
        type: 'retention_offer',
        message: 'Exclusive customer loyalty discount',
        discount: 0.10
      }
    };

    // Select strategy based on primary risk factor
    const primaryRisk = customer.riskFactors[0];
    return strategies[primaryRisk as keyof typeof strategies] || strategies.default;
  }

  private async executeIntervention(customer: any, strategy: any): Promise<void> {
    console.log(`📧 Executing ${strategy.type} intervention for customer ${customer.customerId}`);
    
    // Simulate intervention execution
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.emit('intervention-executed', {
      customerId: customer.customerId,
      intervention: strategy.type,
      details: strategy,
      timestamp: new Date()
    });
  }

  private async scheduleFollowUp(customer: any): Promise<void> {
    console.log(`📅 Scheduling follow-up for customer ${customer.customerId}`);
    
    // Simulate follow-up scheduling
    await new Promise(resolve => setTimeout(resolve, 200));
    
    this.emit('followup-scheduled', {
      customerId: customer.customerId,
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      timestamp: new Date()
    });
  }

  private generateChurnRecommendations(riskAnalysis: any, interventionResults: any): string[] {
    const recommendations = [];

    if (riskAnalysis.distribution.high.percentage > 5) {
      recommendations.push('High-risk customer percentage elevated - investigate underlying causes');
    }

    if (interventionResults.successRate < 0.7) {
      recommendations.push('Intervention success rate below 70% - review and optimize strategies');
    }

    if (riskAnalysis.trendingRisk.increasing > riskAnalysis.trendingRisk.decreasing) {
      recommendations.push('More customers trending toward risk - proactive engagement needed');
    }

    const paymentIssueWeight = riskAnalysis.riskFactorAnalysis.payment_issues.weight;
    if (paymentIssueWeight > 0.25) {
      recommendations.push('Payment issues are major churn driver - improve billing experience');
    }

    recommendations.push('Consider implementing predictive churn scoring in customer dashboard');

    return recommendations;
  }
}