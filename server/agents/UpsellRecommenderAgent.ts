import { Server } from 'socket.io';
import { BaseAgent } from './BaseAgent.js';

export class UpsellRecommenderAgent extends BaseAgent {
  private upsellStrategies = ['feature_based', 'usage_based', 'tier_upgrade', 'add_on_services'];
  private customerSegments = ['enterprise', 'professional', 'starter', 'trial'];

  constructor(io: Server) {
    super('upsell-recommender', 'Upsell Recommender', io, {
      interval: 600000, // 10 minutes
      settings: {
        min_confidence_score: 0.7,
        revenue_impact_threshold: 1000,
        timing_optimization: true,
        personalization_enabled: true,
        success_tracking: true
      }
    });
  }

  async execute(): Promise<void> {
    // Identify upsell opportunities
    const opportunities = await this.identifyUpsellOpportunities();
    
    // Analyze customer readiness and behavior
    const customerAnalysis = await this.analyzeCustomerReadiness();
    
    // Calculate revenue impact and probability
    const revenueProjections = await this.calculateRevenueProjections(opportunities);
    
    // Generate personalized recommendations
    const personalizedOffers = await this.generatePersonalizedOffers(opportunities, customerAnalysis);
    
    // Track upsell campaign performance
    const campaignPerformance = await this.trackCampaignPerformance();
    
    // Optimize timing and messaging
    const timingOptimization = await this.optimizeOfferTiming(customerAnalysis);

    this.emit('data', {
      timestamp: new Date(),
      totalOpportunities: opportunities.length,
      highConfidenceOpportunities: opportunities.filter(o => o.confidence > 0.8).length,
      projectedRevenue: revenueProjections.total,
      conversionRate: campaignPerformance.conversionRate,
      avgDealSize: revenueProjections.avgDealSize,
      topRecommendations: personalizedOffers.slice(0, 5),
      bestTiming: timingOptimization.optimal,
      recommendations: this.generateUpsellRecommendations(opportunities, campaignPerformance, revenueProjections)
    });
  }

  private async identifyUpsellOpportunities(): Promise<any[]> {
    // Mock opportunity identification with realistic scoring
    return [
      {
        customerId: 'cust_001',
        currentPlan: 'professional',
        opportunity: 'enterprise_upgrade',
        confidence: 0.87,
        indicators: ['usage_limit_reached', 'team_growth', 'advanced_feature_requests'],
        timeframe: '30_days',
        estimatedValue: 2400,
        riskFactors: ['price_sensitivity']
      },
      {
        customerId: 'cust_002',
        currentPlan: 'starter',
        opportunity: 'professional_upgrade',
        confidence: 0.92,
        indicators: ['feature_usage_spike', 'support_requests', 'integration_needs'],
        timeframe: '14_days',
        estimatedValue: 600,
        riskFactors: []
      },
      {
        customerId: 'cust_003',
        currentPlan: 'professional',
        opportunity: 'add_on_analytics',
        confidence: 0.76,
        indicators: ['reporting_feature_usage', 'data_export_frequency'],
        timeframe: '45_days',
        estimatedValue: 300,
        riskFactors: ['budget_constraints']
      },
      {
        customerId: 'cust_004',
        currentPlan: 'enterprise',
        opportunity: 'additional_seats',
        confidence: 0.95,
        indicators: ['team_expansion', 'user_limit_approaching'],
        timeframe: '7_days',
        estimatedValue: 1200,
        riskFactors: []
      },
      {
        customerId: 'cust_005',
        currentPlan: 'trial',
        opportunity: 'conversion_to_paid',
        confidence: 0.83,
        indicators: ['high_engagement', 'feature_adoption', 'trial_nearing_end'],
        timeframe: '3_days',
        estimatedValue: 180,
        riskFactors: ['trial_user']
      }
    ];
  }

  private async analyzeCustomerReadiness(): Promise<any> {
    return {
      readinessSegments: {
        'high_readiness': {
          count: 89,
          characteristics: ['high_usage', 'growth_indicators', 'budget_available'],
          conversionRate: 0.34,
          avgTimeToPurchase: 12 // days
        },
        'medium_readiness': {
          count: 156,
          characteristics: ['moderate_usage', 'some_growth', 'unclear_budget'],
          conversionRate: 0.18,
          avgTimeToPurchase: 28
        },
        'low_readiness': {
          count: 234,
          characteristics: ['stable_usage', 'no_growth_signals', 'price_sensitive'],
          conversionRate: 0.07,
          avgTimeToPurchase: 65
        }
      },
      behaviorPatterns: [
        {
          pattern: 'Feature Exploration',
          description: 'Users actively exploring premium features',
          count: 67,
          upsellProbability: 0.78,
          recommendedAction: 'Offer feature trial with guided demo'
        },
        {
          pattern: 'Usage Spike',
          description: 'Significant increase in platform usage',
          count: 45,
          upsellProbability: 0.65,
          recommendedAction: 'Highlight usage efficiency gains with upgrade'
        },
        {
          pattern: 'Team Growth',
          description: 'Adding team members or expanding use cases',
          count: 34,
          upsellProbability: 0.82,
          recommendedAction: 'Present collaboration and management features'
        }
      ],
      purchasingTriggers: {
        'approaching_limits': { frequency: 0.45, conversionRate: 0.67 },
        'competitor_evaluation': { frequency: 0.23, conversionRate: 0.41 },
        'budget_cycle': { frequency: 0.18, conversionRate: 0.52 },
        'team_onboarding': { frequency: 0.31, conversionRate: 0.59 }
      }
    };
  }

  private async calculateRevenueProjections(opportunities: any[]): Promise<any> {
    const totalValue = opportunities.reduce((sum, opp) => sum + opp.estimatedValue, 0);
    const weightedValue = opportunities.reduce((sum, opp) => sum + (opp.estimatedValue * opp.confidence), 0);

    return {
      total: totalValue,
      weighted: Math.round(weightedValue),
      avgDealSize: Math.round(totalValue / opportunities.length),
      byTimeframe: {
        '7_days': opportunities.filter(o => o.timeframe === '7_days').reduce((sum, o) => sum + o.estimatedValue, 0),
        '14_days': opportunities.filter(o => o.timeframe === '14_days').reduce((sum, o) => sum + o.estimatedValue, 0),
        '30_days': opportunities.filter(o => o.timeframe === '30_days').reduce((sum, o) => sum + o.estimatedValue, 0),
        '45_days': opportunities.filter(o => o.timeframe === '45_days').reduce((sum, o) => sum + o.estimatedValue, 0)
      },
      confidenceDistribution: {
        high: opportunities.filter(o => o.confidence > 0.8).length,
        medium: opportunities.filter(o => o.confidence > 0.6 && o.confidence <= 0.8).length,
        low: opportunities.filter(o => o.confidence <= 0.6).length
      }
    };
  }

  private async generatePersonalizedOffers(opportunities: any[], customerData: any): Promise<any[]> {
    return opportunities.map(opp => {
      const readinessLevel = this.determineReadinessLevel(opp, customerData);
      
      return {
        customerId: opp.customerId,
        offer: this.createPersonalizedOffer(opp, readinessLevel),
        messaging: this.generateOfferMessaging(opp, readinessLevel),
        incentives: this.suggestIncentives(opp, readinessLevel),
        timeline: this.optimizeOfferTimeline(opp, readinessLevel),
        priority: this.calculateOfferPriority(opp)
      };
    });
  }

  private async trackCampaignPerformance(): Promise<any> {
    return {
      conversionRate: 0.23,
      emailOpenRate: 0.34,
      emailClickRate: 0.12,
      demoRequestRate: 0.08,
      avgSalesEycle: 18, // days
      byOfferType: {
        'tier_upgrade': { conversion: 0.28, avgValue: 850 },
        'add_on_features': { conversion: 0.19, avgValue: 320 },
        'seat_expansion': { conversion: 0.35, avgValue: 450 },
        'trial_conversion': { conversion: 0.41, avgValue: 180 }
      },
      seasonalTrends: {
        q1: 0.19,
        q2: 0.26,
        q3: 0.21,
        q4: 0.34 // Higher in Q4 due to budget cycles
      },
      topPerformingMessages: [
        { message: 'Usage-based value proposition', conversionRate: 0.31 },
        { message: 'Limited-time upgrade discount', conversionRate: 0.28 },
        { message: 'Feature comparison with ROI', conversionRate: 0.26 }
      ]
    };
  }

  private async optimizeOfferTiming(customerData: any): Promise<any> {
    return {
      optimal: {
        dayOfWeek: 'Tuesday',
        timeOfDay: '10:00 AM',
        month: 'March', // End of Q1
        conversionLift: 0.23
      },
      bySegment: {
        enterprise: { bestDay: 'Wednesday', bestTime: '2:00 PM' },
        professional: { bestDay: 'Tuesday', bestTime: '10:00 AM' },
        starter: { bestDay: 'Thursday', bestTime: '11:00 AM' }
      },
      avoidTimes: [
        { period: 'Friday afternoon', reason: 'Low engagement' },
        { period: 'Monday morning', reason: 'Email overload' },
        { period: 'End of month', reason: 'Budget focus' }
      ],
      triggerEvents: [
        { event: 'Usage threshold reached', timing: 'Within 24 hours', effectiveness: 0.45 },
        { event: 'Feature limit hit', timing: 'Immediately', effectiveness: 0.67 },
        { event: 'Team member added', timing: 'Within 48 hours', effectiveness: 0.38 }
      ]
    };
  }

  private determineReadinessLevel(opportunity: any, customerData: any): string {
    if (opportunity.confidence > 0.8 && opportunity.riskFactors.length === 0) return 'high';
    if (opportunity.confidence > 0.6 && opportunity.riskFactors.length <= 1) return 'medium';
    return 'low';
  }

  private createPersonalizedOffer(opportunity: any, readiness: string): any {
    const baseOffer = {
      type: opportunity.opportunity,
      value: opportunity.estimatedValue,
      customizations: []
    };

    if (readiness === 'high') {
      baseOffer.customizations.push('premium_support', 'implementation_assistance');
    } else if (readiness === 'medium') {
      baseOffer.customizations.push('extended_trial', 'gradual_rollout');
    } else {
      baseOffer.customizations.push('educational_content', 'free_consultation');
    }

    return baseOffer;
  }

  private generateOfferMessaging(opportunity: any, readiness: string): string {
    const messages = {
      high: `Based on your usage patterns, upgrading to ${opportunity.opportunity} could save your team 15+ hours per week`,
      medium: `You're approaching your current plan limits. Consider upgrading to ${opportunity.opportunity} for continued growth`,
      low: `Discover how ${opportunity.opportunity} can unlock new possibilities for your business`
    };

    return messages[readiness as keyof typeof messages];
  }

  private suggestIncentives(opportunity: any, readiness: string): string[] {
    const incentives = {
      high: ['implementation_support', 'priority_support'],
      medium: ['10%_discount', 'extended_trial'],
      low: ['free_consultation', 'educational_resources']
    };

    return incentives[readiness as keyof typeof incentives];
  }

  private optimizeOfferTimeline(opportunity: any, readiness: string): string {
    const timelines = {
      high: opportunity.timeframe,
      medium: opportunity.timeframe + '_with_nurturing',
      low: 'extended_consideration'
    };

    return timelines[readiness as keyof typeof timelines];
  }

  private calculateOfferPriority(opportunity: any): string {
    const score = (opportunity.confidence * 100) + (opportunity.estimatedValue / 10);
    if (score > 150) return 'high';
    if (score > 100) return 'medium';
    return 'low';
  }

  private generateUpsellRecommendations(opportunities: any[], campaignData: any, revenueData: any): string[] {
    const recommendations = [];

    if (campaignData.conversionRate < 0.2) {
      recommendations.push('Upsell conversion rate below 20% - review messaging and offer targeting');
    }

    const highValueOpportunities = opportunities.filter(o => o.estimatedValue > 1000).length;
    if (highValueOpportunities > 3) {
      recommendations.push(`${highValueOpportunities} high-value opportunities identified - prioritize enterprise sales team engagement`);
    }

    if (revenueData.weighted > 10000) {
      recommendations.push(`$${revenueData.weighted.toLocaleString()} in weighted revenue potential - execute targeted campaigns`);
    }

    const urgentOpportunities = opportunities.filter(o => o.timeframe === '7_days' || o.timeframe === '3_days').length;
    if (urgentOpportunities > 0) {
      recommendations.push(`${urgentOpportunities} time-sensitive opportunities require immediate attention`);
    }

    recommendations.push('Consider implementing behavioral triggers for automated upsell campaigns');

    return recommendations;
  }
}