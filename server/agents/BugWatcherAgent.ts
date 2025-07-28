import { Server } from 'socket.io';
import { BaseAgent } from './BaseAgent.js';

export class BugWatcherAgent extends BaseAgent {
  private bugPatterns: Map<string, number> = new Map();
  private errorThresholds = {
    critical: 5,
    high: 10,
    medium: 25,
    low: 50
  };

  constructor(io: Server) {
    super('bug-watcher', 'Bug Watcher', io, {
      interval: 120000, // 2 minutes
      settings: {
        monitoring_sources: ['application_logs', 'user_reports', 'automated_tests'],
        severity_levels: ['critical', 'high', 'medium', 'low'],
        auto_assign: true,
        notification_channels: ['slack', 'email', 'dashboard']
      }
    });
  }

  async execute(): Promise<void> {
    // Monitor application logs
    const logErrors = await this.scanApplicationLogs();
    
    // Check user-reported issues
    const userReports = await this.checkUserReports();
    
    // Analyze error patterns
    const patterns = await this.analyzeErrorPatterns(logErrors);
    
    // Generate bug reports
    const bugReports = await this.generateBugReports([...logErrors, ...userReports]);
    
    // Check system health indicators
    const healthStatus = await this.checkSystemHealth();

    this.emit('data', {
      timestamp: new Date(),
      totalErrors: logErrors.length + userReports.length,
      criticalBugs: bugReports.filter(b => b.severity === 'critical').length,
      errorPatterns: patterns,
      systemHealth: healthStatus,
      recentBugs: bugReports.slice(0, 5),
      recommendations: this.generateRecommendations(patterns, healthStatus)
    });
  }

  private async scanApplicationLogs(): Promise<any[]> {
    // Mock log scanning - in real implementation, this would scan actual logs
    const mockErrors = [
      {
        id: 'err_' + Date.now(),
        timestamp: new Date(),
        level: 'error',
        message: 'Database connection timeout',
        stack: 'ConnectionTimeoutError at db.connect()',
        frequency: 3,
        affected_users: 12
      },
      {
        id: 'err_' + (Date.now() + 1),
        timestamp: new Date(),
        level: 'warning',
        message: 'Payment API slow response',
        stack: 'SlowResponseWarning at payment.process()',
        frequency: 8,
        affected_users: 25
      }
    ];

    return mockErrors;
  }

  private async checkUserReports(): Promise<any[]> {
    // Mock user reports
    return [
      {
        id: 'report_' + Date.now(),
        user_id: 'user_123',
        description: 'Unable to complete checkout process',
        severity: 'high',
        browser: 'Chrome 120',
        timestamp: new Date(),
        status: 'new'
      }
    ];
  }

  private async analyzeErrorPatterns(errors: any[]): Promise<any[]> {
    const patterns = [];
    
    // Group errors by type
    const errorGroups = errors.reduce((groups, error) => {
      const key = error.message.split(' ')[0];
      if (!groups[key]) groups[key] = [];
      groups[key].push(error);
      return groups;
    }, {} as Record<string, any[]>);

    for (const [type, errorList] of Object.entries(errorGroups)) {
      patterns.push({
        pattern: type,
        frequency: errorList.length,
        trend: this.calculateTrend(errorList),
        impact: this.calculateImpact(errorList)
      });
    }

    return patterns;
  }

  private async generateBugReports(issues: any[]): Promise<any[]> {
    return issues.map(issue => ({
      id: issue.id,
      title: issue.message || issue.description,
      severity: this.determineSeverity(issue),
      priority: this.calculatePriority(issue),
      assignee: this.suggestAssignee(issue),
      estimatedFix: this.estimateFixTime(issue),
      tags: this.generateTags(issue)
    }));
  }

  private async checkSystemHealth(): Promise<any> {
    return {
      cpu_usage: 45 + Math.random() * 30,
      memory_usage: 60 + Math.random() * 25,
      disk_usage: 35 + Math.random() * 20,
      api_response_time: 150 + Math.random() * 100,
      error_rate: Math.random() * 5,
      uptime: 99.8 + Math.random() * 0.2
    };
  }

  private determineSeverity(issue: any): string {
    if (issue.affected_users > 100 || issue.level === 'critical') return 'critical';
    if (issue.affected_users > 50 || issue.level === 'error') return 'high';
    if (issue.affected_users > 10 || issue.level === 'warning') return 'medium';
    return 'low';
  }

  private calculatePriority(issue: any): number {
    const severityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
    const severity = this.determineSeverity(issue);
    const userImpact = Math.min(issue.affected_users || 1, 100) / 100;
    return severityWeight[severity as keyof typeof severityWeight] * (1 + userImpact);
  }

  private suggestAssignee(issue: any): string {
    // Mock assignee suggestion based on issue type
    if (issue.message?.includes('Database')) return 'backend-team';
    if (issue.message?.includes('Payment')) return 'payments-team';
    if (issue.description?.includes('checkout')) return 'frontend-team';
    return 'general-dev-team';
  }

  private estimateFixTime(issue: any): string {
    const severity = this.determineSeverity(issue);
    const estimates = {
      critical: '2-4 hours',
      high: '4-8 hours', 
      medium: '1-2 days',
      low: '2-5 days'
    };
    return estimates[severity as keyof typeof estimates];
  }

  private generateTags(issue: any): string[] {
    const tags = [];
    if (issue.message?.includes('Database')) tags.push('database');
    if (issue.message?.includes('Payment')) tags.push('payment');
    if (issue.message?.includes('API')) tags.push('api');
    if (issue.browser) tags.push('frontend');
    return tags;
  }

  private calculateTrend(errorList: any[]): string {
    // Mock trend calculation
    return Math.random() > 0.5 ? 'increasing' : 'stable';
  }

  private calculateImpact(errorList: any[]): string {
    const totalUsers = errorList.reduce((sum, err) => sum + (err.affected_users || 0), 0);
    if (totalUsers > 100) return 'high';
    if (totalUsers > 20) return 'medium';
    return 'low';
  }

  private generateRecommendations(patterns: any[], healthStatus: any): string[] {
    const recommendations = [];
    
    if (healthStatus.error_rate > 3) {
      recommendations.push('High error rate detected - investigate recent deployments');
    }
    
    if (healthStatus.api_response_time > 200) {
      recommendations.push('API response time elevated - consider performance optimization');
    }
    
    if (patterns.some(p => p.trend === 'increasing')) {
      recommendations.push('Increasing error patterns detected - prioritize bug fixes');
    }
    
    return recommendations;
  }
}