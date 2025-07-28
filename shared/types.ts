// Agent Types
export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  lastRun?: Date;
  nextRun?: Date;
  config: AgentConfig;
  metrics: AgentMetrics;
}

export const AgentType = {
  // Active Monitoring Agents
  KPI_TRACKER: 'kpi-tracker',
  REVENUE_RIPPLE: 'revenue-ripple',
  FUNNEL_TESTER: 'funnel-tester',
  DAILY_PULSE: 'daily-pulse',
  WEBHOOK_VALIDATOR: 'webhook-validator',
  
  // Optimization & Testing Agents
  AB_OPTIMIZER: 'ab-optimizer',
  EMAIL_SPLIT_TESTER: 'email-split-tester',
  AD_GENERATOR: 'ad-generator',
  AUDIENCE_REFINER: 'audience-refiner',
  
  // Development & Operations Agents
  BUG_WATCHER: 'bug-watcher',
  AUTO_DOC_GENERATOR: 'auto-doc-generator',
  AUTH_FLOW_BOT: 'auth-flow-bot',
  DEPLOY_BOT: 'deploy-bot',
  
  // Customer Intelligence Agents
  LTV_PREDICTOR: 'ltv-predictor',
  CHURN_DETECTOR: 'churn-detector',
  ONBOARDING_COACH: 'onboarding-coach',
  SUPPORT_CONCIERGE: 'support-concierge',
  UPSELL_RECOMMENDER: 'upsell-recommender',
  
  // System Monitoring Agents
  HEALTH_MONITOR: 'health-monitor'
} as const;

export type AgentType = typeof AgentType[keyof typeof AgentType];

export const AgentStatus = {
  INACTIVE: 'inactive',
  ACTIVE: 'active',
  RUNNING: 'running',
  ERROR: 'error',
  PAUSED: 'paused'
} as const;

export type AgentStatus = typeof AgentStatus[keyof typeof AgentStatus];

export interface AgentConfig {
  interval?: number;
  apiKeys?: Record<string, string>;
  webhooks?: string[];
  settings: Record<string, any>;
}

export interface AgentMetrics {
  runs: number;
  successRate: number;
  averageRunTime: number;
  lastError?: string;
  dataPoints: MetricDataPoint[];
}

export interface MetricDataPoint {
  timestamp: Date;
  value: number;
  label?: string;
  metadata?: Record<string, any>;
}

// Dashboard Types
export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: WidgetConfig;
  data?: any;
}

export const WidgetType = {
  CHART: 'chart',
  METRIC: 'metric',
  TABLE: 'table',
  ALERT: 'alert',
  LOG: 'log'
} as const;

export type WidgetType = typeof WidgetType[keyof typeof WidgetType];

export interface WidgetConfig {
  refreshInterval: number;
  dataSource: string;
  visualization: ChartType;
  filters?: Record<string, any>;
}

export const ChartType = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  AREA: 'area',
  SCATTER: 'scatter'
} as const;

export type ChartType = typeof ChartType[keyof typeof ChartType];

// API Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface WebhookPayload {
  id: string;
  source: string;
  event: string;
  timestamp: Date;
  data: Record<string, any>;
  signature?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: NotificationAction[];
}

export const NotificationType = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export interface NotificationAction {
  label: string;
  action: string;
  variant?: 'primary' | 'secondary' | 'destructive';
}