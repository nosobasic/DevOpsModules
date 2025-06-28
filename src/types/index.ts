export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  type: AgentType;
  lastRun?: Date;
  nextRun?: Date;
  configuration: Record<string, any>;
  metrics?: AgentMetrics;
}

export type AgentType = 
  | 'ab-optimizer'
  | 'ad-generator'
  | 'daily-pulse'
  | 'funnel-tester'
  | 'kpi-tracker'
  | 'revenue-ripple'
  | 'webhook-validator'
  | 'deploy-bot'
  | 'bug-watcher'
  | 'churn-detector'
  | 'ltv-predictor'
  | 'upsell-recommender'
  | 'support-concierge'
  | 'onboarding-coach'
  | 'auto-doc-generator'
  | 'auth-flow-bot'
  | 'audience-refiner'
  | 'email-split-tester'
  | 'alert-manager';

export interface AgentMetrics {
  successRate: number;
  totalRuns: number;
  averageRunTime: number;
  lastSuccess?: Date;
  errorCount: number;
}

export interface ApiKey {
  id: string;
  name: string;
  service: string;
  key: string;
  isActive: boolean;
  lastUsed?: Date;
  createdAt: Date;
  expiresAt?: Date;
}

export interface RevenueRippleConfig {
  baseUrl: string;
  apiKey: string;
  webhookSecret: string;
  adminPanelUrl: string;
  integrationMode: 'embedded' | 'standalone' | 'iframe';
}

export interface DashboardMetrics {
  totalAgents: number;
  activeAgents: number;
  totalRuns: number;
  successRate: number;
  revenueGenerated: number;
  costSaved: number;
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  agentId: string;
  agentName: string;
  action: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: Record<string, any>;
}

export interface WebhookEvent {
  id: string;
  timestamp: Date;
  source: string;
  event: string;
  data: Record<string, any>;
  processed: boolean;
  processingTime?: number;
}

export interface KPIData {
  metric: string;
  value: number;
  change: number;
  period: string;
  target?: number;
}

export interface ABTestResult {
  testId: string;
  variant: string;
  conversions: number;
  visitors: number;
  conversionRate: number;
  confidence: number;
  isWinner: boolean;
}

export interface DeploymentStatus {
  id: string;
  environment: string;
  status: 'pending' | 'deploying' | 'success' | 'failed';
  timestamp: Date;
  commitHash: string;
  branch: string;
  deployTime?: number;
}

export interface IntegrationStatus {
  service: string;
  connected: boolean;
  lastSync?: Date;
  errorMessage?: string;
}