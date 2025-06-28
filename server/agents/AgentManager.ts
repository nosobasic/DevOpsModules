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

  constructor(io: Server) {
    this.io = io;
    this.initializeAgents();
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
  }

  public startAgent(agentType: AgentType, connectionId: string): boolean {
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
      this.activeConnections.get(connectionId)?.push(agentType);

      this.io.emit('agent:started', { agentType, status: AgentStatus.ACTIVE });
      return true;
    } catch (error) {
      console.error(`Failed to start agent ${agentType}:`, error);
      this.io.emit('agent:error', { agentType, error: error.message });
      return false;
    }
  }

  public stopAgent(agentType: AgentType, connectionId: string): boolean {
    const agent = this.agents.get(agentType);
    if (!agent) {
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
      return true;
    } catch (error) {
      console.error(`Failed to stop agent ${agentType}:`, error);
      return false;
    }
  }

  public configureAgent(agentType: AgentType, config: any): boolean {
    const agent = this.agents.get(agentType);
    if (!agent) {
      return false;
    }

    try {
      agent.configure(config);
      this.io.emit('agent:configured', { agentType, config });
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

  public handleDisconnect(connectionId: string) {
    const activeAgents = this.activeConnections.get(connectionId) || [];
    
    // Stop all agents for this connection
    activeAgents.forEach(agentType => {
      this.stopAgent(agentType, connectionId);
    });
    
    this.activeConnections.delete(connectionId);
  }

  public broadcastMetrics() {
    const metrics = this.getAllAgents().map(agent => ({
      type: agent.type,
      metrics: agent.metrics
    }));
    
    this.io.emit('agents:metrics', metrics);
  }
}