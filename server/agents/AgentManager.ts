import { Server } from 'socket.io';
import { Agent, AgentType, AgentStatus } from '../../shared/types.js';
import { KPITrackerAgent } from './KPITrackerAgent.js';
import { RevenueRippleAgent } from './RevenueRippleAgent.js';
import { ABOptimizerAgent } from './ABOptimizerAgent.js';
import { FunnelTesterAgent } from './FunnelTesterAgent.js';
import { AdGeneratorAgent } from './AdGeneratorAgent.js';
import { WebhookValidatorAgent } from './WebhookValidatorAgent.js';
import { DailyPulseAgent } from './DailyPulseAgent.js';

export class AgentManager {
  private agents: Map<AgentType, any> = new Map();
  private activeConnections: Map<string, AgentType[]> = new Map();
  private io: Server;
  private metricsInterval?: NodeJS.Timeout;

  constructor(io: Server) {
    this.io = io;
    this.initializeAgents();
    this.startMetricsBroadcast();
  }

  private initializeAgents() {
    // Initialize all available agents
    this.agents.set(AgentType.KPI_TRACKER, new KPITrackerAgent(this.io));
    this.agents.set(AgentType.REVENUE_RIPPLE, new RevenueRippleAgent(this.io));
    this.agents.set(AgentType.AB_OPTIMIZER, new ABOptimizerAgent(this.io));
    this.agents.set(AgentType.FUNNEL_TESTER, new FunnelTesterAgent(this.io));
    this.agents.set(AgentType.AD_GENERATOR, new AdGeneratorAgent(this.io));
    this.agents.set(AgentType.WEBHOOK_VALIDATOR, new WebhookValidatorAgent(this.io));
    this.agents.set(AgentType.DAILY_PULSE, new DailyPulseAgent(this.io));

    console.log(`🚀 Initialized ${this.agents.size} agents`);
  }

  private startMetricsBroadcast() {
    // Broadcast metrics every 30 seconds
    this.metricsInterval = setInterval(() => {
      this.broadcastMetrics();
    }, 30000);
  }

  public startAgent(agentType: AgentType, connectionId: string = 'api'): boolean {
    const agent = this.agents.get(agentType);
    if (!agent) {
      console.error(`Agent type ${agentType} not found`);
      return false;
    }

    try {
      agent.start();
      
      // Track connection
      if (!this.activeConnections.has(connectionId)) {
        this.activeConnections.set(connectionId, []);
      }
      
      const connections = this.activeConnections.get(connectionId);
      if (connections && !connections.includes(agentType)) {
        connections.push(agentType);
      }

      this.io.emit('agent:started', { agentType, status: AgentStatus.ACTIVE });
      console.log(`🟢 Agent ${agentType} started by ${connectionId}`);
      return true;
    } catch (error) {
      console.error(`Failed to start agent ${agentType}:`, error);
      this.io.emit('agent:error', { agentType, error: error instanceof Error ? error.message : String(error) });
      return false;
    }
  }

  public stopAgent(agentType: AgentType, connectionId: string = 'api'): boolean {
    const agent = this.agents.get(agentType);
    if (!agent) {
      console.error(`Agent type ${agentType} not found`);
      return false;
    }

    try {
      agent.stop();
      
      // Remove from active connections
      const connections = this.activeConnections.get(connectionId) || [];
      const index = connections.indexOf(agentType);
      if (index > -1) {
        connections.splice(index, 1);
      }

      this.io.emit('agent:stopped', { agentType, status: AgentStatus.INACTIVE });
      console.log(`🔴 Agent ${agentType} stopped by ${connectionId}`);
      return true;
    } catch (error) {
      console.error(`Failed to stop agent ${agentType}:`, error);
      this.io.emit('agent:error', { agentType, error: error instanceof Error ? error.message : String(error) });
      return false;
    }
  }

  public configureAgent(agentType: AgentType, config: any): boolean {
    const agent = this.agents.get(agentType);
    if (!agent) {
      console.error(`Agent type ${agentType} not found`);
      return false;
    }

    try {
      agent.configure(config);
      this.io.emit('agent:configured', { agentType, config });
      console.log(`⚙️ Agent ${agentType} configured`);
      return true;
    } catch (error) {
      console.error(`Failed to configure agent ${agentType}:`, error);
      return false;
    }
  }

  public getAgentStatus(agentType: AgentType): AgentStatus | null {
    const agent = this.agents.get(agentType);
    return agent ? agent.getStatus() : null;
  }

  public getAgent(agentType: AgentType): Agent | null {
    const agent = this.agents.get(agentType);
    if (!agent) return null;

    return {
      id: agent.getId(),
      name: agent.getName(),
      type: agentType,
      status: agent.getStatus(),
      lastRun: agent.getLastRun(),
      nextRun: agent.getNextRun(),
      config: agent.getConfig(),
      metrics: agent.getMetrics()
    };
  }

  public getAllAgents(): Agent[] {
    return Array.from(this.agents.entries()).map(([type, agent]) => ({
      id: agent.getId(),
      name: agent.getName(),
      type,
      status: agent.getStatus(),
      lastRun: agent.getLastRun(),
      nextRun: agent.getNextRun(),
      config: agent.getConfig(),
      metrics: agent.getMetrics()
    }));
  }

  public getAgentMetrics(agentType?: AgentType) {
    if (agentType) {
      const agent = this.agents.get(agentType);
      return agent ? agent.getMetrics() : null;
    }

    return this.getAllAgents().map(agent => ({
      type: agent.type,
      name: agent.name,
      metrics: agent.metrics
    }));
  }

  public getDashboardOverview() {
    const agents = this.getAllAgents();
    const totalAgents = agents.length;
    const activeAgents = agents.filter(agent => agent.status === AgentStatus.ACTIVE).length;
    const runningAgents = agents.filter(agent => agent.status === AgentStatus.RUNNING).length;
    const errorAgents = agents.filter(agent => agent.status === AgentStatus.ERROR).length;
    const totalRuns = agents.reduce((sum, agent) => sum + agent.metrics.runs, 0);
    const avgSuccessRate = agents.length > 0 
      ? agents.reduce((sum, agent) => sum + agent.metrics.successRate, 0) / agents.length
      : 0;

    return {
      totalAgents,
      activeAgents,
      runningAgents,
      errorAgents,
      totalRuns,
      successRate: Math.round(avgSuccessRate * 100) / 100,
      healthScore: Math.round(((activeAgents + runningAgents) / Math.max(totalAgents, 1)) * 100)
    };
  }

  public getActivityLogs(limit: number = 100) {
    // In a real implementation, this would come from a database
    // For now, return some mock data that represents real activity
    const agents = this.getAllAgents();
    const logs: any[] = [];

    agents.forEach(agent => {
      if (agent.lastRun) {
        logs.push({
          id: `${agent.id}-${Date.now()}`,
          timestamp: agent.lastRun,
          agentId: agent.id,
          agentName: agent.name,
          action: 'execution_completed',
          status: agent.status === AgentStatus.ERROR ? 'error' : 'success',
          message: agent.status === AgentStatus.ERROR 
            ? `Agent execution failed: ${agent.metrics.lastError || 'Unknown error'}`
            : `Agent executed successfully in ${agent.metrics.averageRunTime}ms`,
          details: {
            executionTime: agent.metrics.averageRunTime,
            successRate: agent.metrics.successRate,
            totalRuns: agent.metrics.runs
          }
        });
      }
    });

    return logs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  public handleDisconnect(connectionId: string) {
    const activeAgents = this.activeConnections.get(connectionId) || [];
    
    console.log(`🔌 Client ${connectionId} disconnected, stopping ${activeAgents.length} agents`);
    
    // Stop all agents for this connection
    activeAgents.forEach(agentType => {
      this.stopAgent(agentType, connectionId);
    });
    
    this.activeConnections.delete(connectionId);
  }

  public broadcastMetrics() {
    const metrics = this.getAgentMetrics();
    const overview = this.getDashboardOverview();
    
    this.io.emit('agents:metrics', metrics);
    this.io.emit('dashboard:metrics', overview);
  }

  public cleanup() {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }

    // Stop all agents
    this.agents.forEach((agent, agentType) => {
      try {
        agent.stop();
        console.log(`🛑 Stopped agent ${agentType} during cleanup`);
      } catch (error) {
        console.error(`Error stopping agent ${agentType}:`, error);
      }
    });
  }
}