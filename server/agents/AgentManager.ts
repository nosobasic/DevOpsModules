import { Server } from 'socket.io';
import { Agent, AgentType, AgentStatus } from '../../shared/types.js';
// Active Monitoring Agents
import { KPITrackerAgent } from './KPITrackerAgent.js';
import { RevenueRippleAgent } from './RevenueRippleAgent.js';
import { FunnelTesterAgent } from './FunnelTesterAgent.js';
import { DailyPulseAgent } from './DailyPulseAgent.js';
import { WebhookValidatorAgent } from './WebhookValidatorAgent.js';

// Optimization & Testing Agents
import { ABOptimizerAgent } from './ABOptimizerAgent.js';
import { EmailSplitTesterAgent } from './EmailSplitTesterAgent.js';
import { AdGeneratorAgent } from './AdGeneratorAgent.js';
import { AudienceRefinerAgent } from './AudienceRefinerAgent.js';

// Development & Operations Agents
import { BugWatcherAgent } from './BugWatcherAgent.js';
import { AutoDocGeneratorAgent } from './AutoDocGeneratorAgent.js';
import { AuthFlowBotAgent } from './AuthFlowBotAgent.js';
import { DeployBotAgent } from './DeployBotAgent.js';

// Customer Intelligence Agents
import { LTVPredictorAgent } from './LTVPredictorAgent.js';
import { ChurnDetectorAgent } from './ChurnDetectorAgent.js';
import { OnboardingCoachAgent } from './OnboardingCoachAgent.js';
import { SupportConciergeAgent } from './SupportConciergeAgent.js';
import { UpsellRecommenderAgent } from './UpsellRecommenderAgent.js';

// System Monitoring Agents
import { HealthMonitorAgent } from './HealthMonitorAgent.js';

export class AgentManager {
  private agents: Map<AgentType, any> = new Map();
  private activeConnections: Map<string, AgentType[]> = new Map();
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.initializeAgents();
  }

  private initializeAgents() {
    // Active Monitoring Agents
    this.agents.set(AgentType.KPI_TRACKER, new KPITrackerAgent(this.io));
    this.agents.set(AgentType.REVENUE_RIPPLE, new RevenueRippleAgent(this.io));
    this.agents.set(AgentType.FUNNEL_TESTER, new FunnelTesterAgent(this.io));
    this.agents.set(AgentType.DAILY_PULSE, new DailyPulseAgent(this.io));
    this.agents.set(AgentType.WEBHOOK_VALIDATOR, new WebhookValidatorAgent(this.io));
    
    // Optimization & Testing Agents
    this.agents.set(AgentType.AB_OPTIMIZER, new ABOptimizerAgent(this.io));
    this.agents.set(AgentType.EMAIL_SPLIT_TESTER, new EmailSplitTesterAgent(this.io));
    this.agents.set(AgentType.AD_GENERATOR, new AdGeneratorAgent(this.io));
    this.agents.set(AgentType.AUDIENCE_REFINER, new AudienceRefinerAgent(this.io));
    
    // Development & Operations Agents
    this.agents.set(AgentType.BUG_WATCHER, new BugWatcherAgent(this.io));
    this.agents.set(AgentType.AUTO_DOC_GENERATOR, new AutoDocGeneratorAgent(this.io));
    this.agents.set(AgentType.AUTH_FLOW_BOT, new AuthFlowBotAgent(this.io));
    this.agents.set(AgentType.DEPLOY_BOT, new DeployBotAgent(this.io));
    
    // Customer Intelligence Agents
    this.agents.set(AgentType.LTV_PREDICTOR, new LTVPredictorAgent(this.io));
    this.agents.set(AgentType.CHURN_DETECTOR, new ChurnDetectorAgent(this.io));
    this.agents.set(AgentType.ONBOARDING_COACH, new OnboardingCoachAgent(this.io));
    this.agents.set(AgentType.SUPPORT_CONCIERGE, new SupportConciergeAgent(this.io));
    this.agents.set(AgentType.UPSELL_RECOMMENDER, new UpsellRecommenderAgent(this.io));
    
    // System Monitoring Agents
    this.agents.set(AgentType.HEALTH_MONITOR, new HealthMonitorAgent(this.io));
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
      this.io.emit('agent:error', { agentType, error: error instanceof Error ? error.message : 'Unknown error' });
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

  public getAgent(agentType: AgentType): any {
    return this.agents.get(agentType);
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