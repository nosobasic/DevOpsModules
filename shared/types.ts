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
  KPI_TRACKER: 'kpi-tracker',
  REVENUE_RIPPLE: 'revenue-ripple',
  AB_OPTIMIZER: 'ab-optimizer',
  FUNNEL_TESTER: 'funnel-tester',
  AD_GENERATOR: 'ad-generator',
  WEBHOOK_VALIDATOR: 'webhook-validator',
  DAILY_PULSE: 'daily-pulse'
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