import { Server } from 'socket.io';
import { AgentStatus, AgentConfig, AgentMetrics } from '../../shared/types.js';
import { RateLimiter, RateLimiterFactory } from '../utils/RateLimiter.js';
import { aiInsightsEngine, AgentReport } from '../utils/AIInsightsEngine.js';

export abstract class BaseAgent {
  protected id: string;
  protected name: string;
  protected status: AgentStatus = AgentStatus.INACTIVE;
  protected config: AgentConfig;
  protected metrics: AgentMetrics;
  protected io: Server;
  protected intervalId?: NodeJS.Timeout;
  protected lastRun?: Date;
  protected nextRun?: Date;
  protected rateLimiter?: RateLimiter;
  protected lastReport?: AgentReport;
  protected selfHealing: boolean = false;

  constructor(id: string, name: string, io: Server, config: AgentConfig = { settings: {} }) {
    this.id = id;
    this.name = name;
    this.io = io;
    this.config = config;
    this.metrics = {
      runs: 0,
      successRate: 100,
      averageRunTime: 0,
      dataPoints: []
    };

    // Initialize rate limiter for this agent
    this.rateLimiter = RateLimiterFactory.createAgentLimiter(io);
  }

  abstract execute(): Promise<any>;

  public start(): void {
    if (this.status === AgentStatus.ACTIVE || this.status === AgentStatus.RUNNING) {
      return;
    }

    this.status = AgentStatus.ACTIVE;
    this.scheduleNextRun();
    console.log(`🤖 ${this.name} started`);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.status = AgentStatus.INACTIVE;
    this.nextRun = undefined;
    console.log(`🛑 ${this.name} stopped`);
  }

  public configure(config: Partial<AgentConfig>): void {
    this.config = { ...this.config, ...config };
    if (this.status === AgentStatus.ACTIVE) {
      this.stop();
      this.start();
    }
  }

  public getStatus(): AgentStatus {
    return this.status;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getConfig(): AgentConfig {
    return this.config;
  }

  public getMetrics(): AgentMetrics {
    return this.metrics;
  }

  public getLastRun(): Date | undefined {
    return this.lastRun;
  }

  public getNextRun(): Date | undefined {
    return this.nextRun;
  }

  public getRateLimitInfo(): any {
    return this.rateLimiter?.getInfo(this.id) || null;
  }

  public getLastReport(): AgentReport | undefined {
    return this.lastReport;
  }

  public enableSelfHealing(): void {
    this.selfHealing = true;
    console.log(`🤖 Self-healing enabled for ${this.name}`);
  }

  public disableSelfHealing(): void {
    this.selfHealing = false;
    console.log(`🤖 Self-healing disabled for ${this.name}`);
  }

  protected generateAIReport(data: any): AgentReport {
    const report = aiInsightsEngine.generateReport(this.id, this.name, data);
    this.lastReport = report;
    
    // Emit the report
    this.emit('ai-report', report);
    
    return report;
  }

  protected async handleAutoFix(report: AgentReport): Promise<void> {
    if (!this.selfHealing || !report.nextRecommendedAction?.autoFix) {
      return;
    }

    const action = report.nextRecommendedAction;
    console.log(`🔧 ${this.name} attempting auto-fix: ${action.action}`);
    
    try {
      const success = await action.autoFix();
      
      if (success) {
        console.log(`✅ ${this.name} auto-fix successful: ${action.action}`);
        this.emit('auto-fix-success', {
          agent: this.id,
          action: action.action,
          timestamp: new Date()
        });
      } else {
        console.log(`❌ ${this.name} auto-fix failed: ${action.action}`);
        this.emit('auto-fix-failed', {
          agent: this.id,
          action: action.action,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error(`💥 ${this.name} auto-fix error:`, error);
      this.emit('auto-fix-error', {
        agent: this.id,
        action: action.action,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
    }
  }

  protected scheduleNextRun(): void {
    const interval = this.config.interval || 60000; // Default 1 minute
    this.nextRun = new Date(Date.now() + interval);
    
    this.intervalId = setInterval(async () => {
      await this.runExecution();
    }, interval);
  }

  protected async runExecution(): Promise<void> {
    if (this.status !== AgentStatus.ACTIVE) {
      return;
    }

    // Check rate limit before execution
    if (this.rateLimiter) {
      const rateLimitInfo = await this.rateLimiter.checkLimit(this.id);
      if (rateLimitInfo.isBlocked) {
        console.warn(`⚠️ ${this.name} rate limited - skipping execution`);
        this.emit('rate-limited', {
          agent: this.id,
          remaining: rateLimitInfo.remaining,
          resetTime: rateLimitInfo.resetTime
        });
        return;
      }
    }

    const startTime = Date.now();
    this.status = AgentStatus.RUNNING;
    this.lastRun = new Date();

    try {
      const executionData = await this.execute();
      this.metrics.runs++;
      
      const executionTime = Date.now() - startTime;
      this.updateMetrics(true, executionTime);
      
      // Generate AI report if execution returned data
      let report: AgentReport | undefined;
      if (executionData) {
        report = this.generateAIReport(executionData);
        
        // Handle auto-fix if self-healing is enabled
        await this.handleAutoFix(report);
      }
      
      this.status = AgentStatus.ACTIVE;
      console.log(`✅ ${this.name} execution completed in ${executionTime}ms`);
    } catch (error) {
      console.error(`❌ ${this.name} execution failed:`, error);
      this.metrics.lastError = error instanceof Error ? error.message : 'Unknown error';
      this.updateMetrics(false, Date.now() - startTime);
      this.status = AgentStatus.ERROR;
      
      // Emit error event
      this.emit('error', {
        agent: this.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
    }

    this.scheduleNextRun();
  }

  protected updateMetrics(success: boolean, executionTime: number): void {
    // Update success rate
    const totalRuns = this.metrics.runs;
    const currentSuccessRate = this.metrics.successRate;
    this.metrics.successRate = success 
      ? ((currentSuccessRate * (totalRuns - 1)) + 100) / totalRuns
      : ((currentSuccessRate * (totalRuns - 1)) + 0) / totalRuns;

    // Update average run time
    this.metrics.averageRunTime = 
      ((this.metrics.averageRunTime * (totalRuns - 1)) + executionTime) / totalRuns;

    // Add data point
    this.metrics.dataPoints.push({
      timestamp: new Date(),
      value: success ? 1 : 0,
      metadata: { executionTime, success }
    });

    // Keep only last 100 data points
    if (this.metrics.dataPoints.length > 100) {
      this.metrics.dataPoints = this.metrics.dataPoints.slice(-100);
    }

    // Emit metrics update
    this.emit('metrics-updated', {
      agent: this.id,
      metrics: this.metrics,
      rateLimitInfo: this.getRateLimitInfo()
    });
  }

  protected emit(event: string, data: any): void {
    this.io.emit(`agent:${this.id}:${event}`, data);
  }

  // Helper method for external API calls with rate limiting
  protected async makeAPICall(
    apiName: string, 
    apiCall: () => Promise<any>, 
    maxRequests: number = 100, 
    windowMs: number = 60000
  ): Promise<any> {
    const apiLimiter = RateLimiterFactory.createExternalAPILimiter(
      apiName, 
      maxRequests, 
      windowMs, 
      this.io
    );

    const rateLimitInfo = await apiLimiter.checkLimit(`${this.id}:${apiName}`);
    
    if (rateLimitInfo.isBlocked) {
      throw new Error(`Rate limit exceeded for ${apiName}. Try again at ${rateLimitInfo.resetTime}`);
    }

    try {
      const result = await apiCall();
      
      // Emit successful API call metric
      this.emit('api-call-success', {
        api: apiName,
        remaining: rateLimitInfo.remaining,
        resetTime: rateLimitInfo.resetTime
      });
      
      return result;
    } catch (error) {
      // Emit failed API call metric
      this.emit('api-call-failed', {
        api: apiName,
        error: error instanceof Error ? error.message : 'Unknown error',
        remaining: rateLimitInfo.remaining
      });
      
      throw error;
    }
  }
}