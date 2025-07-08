// Widget Components
import { MetricCardWidget } from './components/MetricCardWidget';
import { ChartWidget } from './components/ChartWidget';

// Registry
import { registerWidget, widgetRegistry } from './registry';
import { WidgetType } from '../types/widgets';

// Register Metric Card Widget
registerWidget({
  type: WidgetType.METRIC_CARD,
  component: MetricCardWidget,
  defaultConfig: {
    title: 'Metric Card',
    description: 'Display a single metric with trend indicators',
    refreshInterval: 30000,
    dataSources: [],
    visualization: {
      type: 'metric',
      options: {
        icon: '📊',
        showTrend: true,
        showPrevious: true
      }
    },
    thresholds: {
      warning: 75,
      critical: 90
    }
  },
  template: {
    id: 'metric-card-template',
    name: 'Metric Card',
    description: 'Display a single key metric with trend indicators and thresholds',
    type: WidgetType.METRIC_CARD,
    category: 'metrics',
    icon: '📊',
    defaultSize: { w: 3, h: 2 },
    defaultConfig: {
      title: 'New Metric',
      dataSources: [{
        type: 'agent',
        source: 'kpi-tracker',
        field: 'successRate',
        aggregation: 'latest'
      }],
      visualization: {
        type: 'metric',
        options: { icon: '📊' }
      }
    }
  }
});

// Register Line Chart Widget
registerWidget({
  type: WidgetType.LINE_CHART,
  component: ChartWidget,
  defaultConfig: {
    title: 'Line Chart',
    description: 'Display data trends over time',
    refreshInterval: 30000,
    dataSources: [],
    visualization: {
      type: 'line',
      options: {
        showLegend: true,
        showGrid: true,
        smoothLine: true
      }
    },
    colors: ['#8884d8', '#82ca9d', '#ffc658']
  },
  template: {
    id: 'line-chart-template',
    name: 'Line Chart',
    description: 'Visualize trends and patterns over time with smooth line charts',
    type: WidgetType.LINE_CHART,
    category: 'charts',
    icon: '📈',
    defaultSize: { w: 6, h: 4 },
    defaultConfig: {
      title: 'Trend Analysis',
      dataSources: [{
        type: 'realtime',
        source: 'kpi-tracker',
        timeRange: '24h'
      }],
      visualization: {
        type: 'line',
        options: { showLegend: true }
      }
    }
  }
});

// Register Bar Chart Widget
registerWidget({
  type: WidgetType.BAR_CHART,
  component: ChartWidget,
  defaultConfig: {
    title: 'Bar Chart',
    description: 'Compare values across categories',
    refreshInterval: 30000,
    dataSources: [],
    visualization: {
      type: 'bar',
      options: {
        showLegend: true,
        showGrid: true,
        horizontal: false
      }
    },
    colors: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300']
  },
  template: {
    id: 'bar-chart-template',
    name: 'Bar Chart',
    description: 'Compare categorical data with vertical or horizontal bars',
    type: WidgetType.BAR_CHART,
    category: 'charts',
    icon: '📊',
    defaultSize: { w: 6, h: 4 },
    defaultConfig: {
      title: 'Category Comparison',
      dataSources: [{
        type: 'realtime',
        source: 'kpi-tracker'
      }],
      visualization: {
        type: 'bar',
        options: { showLegend: true }
      }
    }
  }
});

// Register Area Chart Widget
registerWidget({
  type: WidgetType.AREA_CHART,
  component: ChartWidget,
  defaultConfig: {
    title: 'Area Chart',
    description: 'Show volume and trends with filled areas',
    refreshInterval: 30000,
    dataSources: [],
    visualization: {
      type: 'area',
      options: {
        showLegend: true,
        showGrid: true,
        stacked: false
      }
    },
    colors: ['#8884d8', '#82ca9d', '#ffc658']
  },
  template: {
    id: 'area-chart-template',
    name: 'Area Chart',
    description: 'Visualize volume and cumulative trends with filled area charts',
    type: WidgetType.AREA_CHART,
    category: 'charts',
    icon: '🏔️',
    defaultSize: { w: 6, h: 4 },
    defaultConfig: {
      title: 'Volume Analysis',
      dataSources: [{
        type: 'realtime',
        source: 'kpi-tracker'
      }],
      visualization: {
        type: 'area',
        options: { showLegend: true }
      }
    }
  }
});

// Register Pie Chart Widget
registerWidget({
  type: WidgetType.PIE_CHART,
  component: ChartWidget,
  defaultConfig: {
    title: 'Pie Chart',
    description: 'Show proportions and percentages',
    refreshInterval: 30000,
    dataSources: [],
    visualization: {
      type: 'pie',
      options: {
        showLegend: true,
        showLabels: true,
        innerRadius: 0
      }
    },
    colors: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00']
  },
  template: {
    id: 'pie-chart-template',
    name: 'Pie Chart',
    description: 'Display proportional data with circular pie charts',
    type: WidgetType.PIE_CHART,
    category: 'charts',
    icon: '🥧',
    defaultSize: { w: 4, h: 4 },
    defaultConfig: {
      title: 'Distribution Analysis',
      dataSources: [{
        type: 'realtime',
        source: 'kpi-tracker'
      }],
      visualization: {
        type: 'pie',
        options: { showLegend: true }
      }
    }
  }
});

// Register Agent Status Widget
registerWidget({
  type: WidgetType.AGENT_STATUS,
  component: MetricCardWidget, // Reuse metric card for agent status
  defaultConfig: {
    title: 'Agent Status',
    description: 'Monitor individual agent performance',
    refreshInterval: 10000,
    dataSources: [],
    visualization: {
      type: 'metric',
      options: {
        icon: '🤖',
        showStatus: true
      }
    }
  },
  template: {
    id: 'agent-status-template',
    name: 'Agent Status',
    description: 'Monitor the status and performance of individual agents',
    type: WidgetType.AGENT_STATUS,
    category: 'agents',
    icon: '🤖',
    defaultSize: { w: 3, h: 2 },
    defaultConfig: {
      title: 'Agent Monitor',
      dataSources: [{
        type: 'agent',
        source: 'kpi-tracker',
        field: 'status'
      }],
      visualization: {
        type: 'metric',
        options: { icon: '🤖' }
      }
    }
  }
});

// Register System Health Widget
registerWidget({
  type: WidgetType.SYSTEM_HEALTH,
  component: MetricCardWidget, // Reuse metric card for system health
  defaultConfig: {
    title: 'System Health',
    description: 'Overall system health score',
    refreshInterval: 30000,
    dataSources: [],
    visualization: {
      type: 'metric',
      options: {
        icon: '💚',
        showHealth: true
      }
    },
    thresholds: {
      warning: 70,
      critical: 50
    }
  },
  template: {
    id: 'system-health-template',
    name: 'System Health',
    description: 'Monitor overall system health and performance metrics',
    type: WidgetType.SYSTEM_HEALTH,
    category: 'system',
    icon: '💚',
    defaultSize: { w: 3, h: 2 },
    defaultConfig: {
      title: 'System Health',
      dataSources: [{
        type: 'api',
        source: '/api/dashboard/overview',
        field: 'healthScore'
      }],
      visualization: {
        type: 'metric',
        options: { icon: '💚' }
      }
    }
  }
});

// Export registry for use in other parts of the app
export { widgetRegistry } from './registry';

// Export utility functions
export {
  registerWidget,
  getWidgetComponent,
  getWidgetConfigComponent,
  createWidgetFromTemplate,
  validateWidgetConfig
} from './registry';

console.log('🔧 Widget system initialized with', widgetRegistry.getStats().totalWidgets, 'widget types');