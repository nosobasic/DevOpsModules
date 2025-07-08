export interface WidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
  i: string;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface WidgetDataSource {
  type: 'agent' | 'api' | 'static' | 'realtime';
  source: string; // agent ID, API endpoint, etc.
  field?: string; // specific field from the data source
  aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'latest';
  timeRange?: '1h' | '6h' | '24h' | '7d' | '30d';
}

export interface WidgetConfig {
  title: string;
  description?: string;
  refreshInterval: number; // in milliseconds
  dataSources: WidgetDataSource[];
  visualization: {
    type: 'line' | 'bar' | 'pie' | 'area' | 'metric' | 'table' | 'gauge' | 'heatmap';
    options: Record<string, any>;
  };
  colors?: string[];
  thresholds?: {
    warning: number;
    critical: number;
  };
  filters?: Record<string, any>;
  customCSS?: string;
}

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  position: WidgetPosition;
  config: WidgetConfig;
  data?: any;
  lastUpdate?: Date;
  error?: string;
  isLoading?: boolean;
}

export enum WidgetType {
  METRIC_CARD = 'metric_card',
  LINE_CHART = 'line_chart',
  BAR_CHART = 'bar_chart',
  PIE_CHART = 'pie_chart',
  AREA_CHART = 'area_chart',
  TABLE = 'table',
  GAUGE = 'gauge',
  HEATMAP = 'heatmap',
  ACTIVITY_FEED = 'activity_feed',
  AGENT_STATUS = 'agent_status',
  SYSTEM_HEALTH = 'system_health',
  KPI_OVERVIEW = 'kpi_overview'
}

export interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  type: WidgetType;
  category: 'metrics' | 'charts' | 'monitoring' | 'agents' | 'system';
  icon: string;
  defaultSize: { w: number; h: number };
  defaultConfig: Partial<WidgetConfig>;
  preview?: string; // URL to preview image
}

export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  widgets: Widget[];
  layout: WidgetPosition[];
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface WidgetProps {
  widget: Widget;
  data?: any;
  isLoading?: boolean;
  error?: string;
  onConfigChange: (config: Partial<WidgetConfig>) => void;
  onDataRefresh: () => void;
  onRemove: () => void;
}

export interface WidgetContextMenuAction {
  id: string;
  label: string;
  icon: string;
  action: (widget: Widget) => void;
  disabled?: boolean;
}

export interface WidgetRegistration {
  type: WidgetType;
  component: React.ComponentType<WidgetProps>;
  configComponent?: React.ComponentType<{
    config: WidgetConfig;
    onChange: (config: Partial<WidgetConfig>) => void;
  }>;
  defaultConfig: Partial<WidgetConfig>;
  template: WidgetTemplate;
}

// Widget data transformation interfaces
export interface DataTransform {
  type: 'filter' | 'map' | 'reduce' | 'sort' | 'group';
  config: Record<string, any>;
}

export interface WidgetDataRequest {
  widgetId: string;
  dataSources: WidgetDataSource[];
  transforms?: DataTransform[];
  cacheKey?: string;
  timestamp: Date;
}

export interface WidgetDataResponse {
  widgetId: string;
  data: any;
  metadata?: {
    source: string;
    timestamp: Date;
    recordCount?: number;
    cacheHit?: boolean;
  };
  error?: string;
}

// Real-time update interfaces
export interface WidgetSubscription {
  widgetId: string;
  dataSource: WidgetDataSource;
  callback: (data: any) => void;
  isActive: boolean;
}

export interface DashboardState {
  layouts: DashboardLayout[];
  currentLayoutId: string;
  widgets: Record<string, Widget>;
  subscriptions: Record<string, WidgetSubscription>;
  isEditMode: boolean;
  selectedWidgetId?: string;
}