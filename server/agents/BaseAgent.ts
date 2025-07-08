import { Server } from 'socket.io';
import { AgentStatus, AgentConfig, AgentMetrics } from '../../shared/types.js';

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
  }

  abstract execute(): Promise<void>;

  public start(): void {
    if (this.status === AgentStatus.ACTIVE || this.status === AgentStatus.RUNNING) {
      console.log(`⚠️ ${this.name} is already running`);
      return;
    }

    this.status = AgentStatus.ACTIVE;
    this.scheduleNextRun();
    
    // Emit real-time events
    this.emitStatusUpdate();
    this.emitActivityLog('agent_start', `${this.name} started successfully`);
    
    console.log(`🤖 ${this.name} started`);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.status = AgentStatus.INACTIVE;
    this.nextRun = undefined;
    
    // Emit real-time events
    this.emitStatusUpdate();
    this.emitActivityLog('agent_stop', `${this.name} stopped`);
    
    console.log(`🛑 ${this.name} stopped`);
  }

  public configure(config: Partial<AgentConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Emit configuration update
    this.emitActivityLog('metric_update', `${this.name} configuration updated`);
    
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

    const startTime = Date.now();
    this.status = AgentStatus.RUNNING;
    this.lastRun = new Date();

    // Emit running status
    this.emitStatusUpdate();

    try {
      await this.execute();
      this.metrics.runs++;
      
      const executionTime = Date.now() - startTime;
      this.updateMetrics(true, executionTime);
      
      this.status = AgentStatus.ACTIVE;
      
      // Emit success events
      this.emitStatusUpdate();
      this.emitActivityLog('success', `${this.name} execution completed successfully`, {
        executionTime,
        successRate: this.metrics.successRate,
        totalRuns: this.metrics.runs
      });
      
      console.log(`✅ ${this.name} execution completed in ${executionTime}ms`);
    } catch (error) {
      console.error(`❌ ${this.name} execution failed:`, error);
      this.metrics.lastError = error instanceof Error ? error.message : String(error);
      this.updateMetrics(false, Date.now() - startTime);
      this.status = AgentStatus.ERROR;
      
      // Emit error events
      this.emitStatusUpdate();
      this.emitActivityLog('error', `${this.name} execution failed: ${error instanceof Error ? error.message : String(error)}`, {
        error: error instanceof Error ? error.message : String(error),
        executionTime: Date.now() - startTime
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
    this.emitMetricsUpdate();
  }

  protected emit(event: string, data: any): void {
    this.io.emit(`agent:${this.id}:${event}`, data);
  }

  protected emitStatusUpdate(): void {
    this.io.emit('agent:status:update', {
      agentId: this.id,
      agentType: this.id,
      name: this.name,
      status: this.status,
      lastRun: this.lastRun,
      nextRun: this.nextRun
    });
  }

  protected emitMetricsUpdate(): void {
    this.io.emit('agent:metrics:update', {
      agentId: this.id,
      agentType: this.id,
      name: this.name,
      metrics: this.metrics
    });
  }

  protected emitActivityLog(type: string, message: string, details?: any): void {
    this.io.emit('activity:log', {
      id: `${this.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      agentId: this.id,
      agentName: this.name,
      type,
      status: type === 'error' ? 'error' : type === 'success' ? 'success' : 'info',
      message,
      details
    });
  }

  protected emitData(data: any): void {
    this.io.emit('agent:data', {
      agentType: this.id,
      agentId: this.id,
      data,
      timestamp: new Date()
    });
  }
}