import { WidgetType } from '../types/widgets';
import type { WidgetRegistration, WidgetTemplate } from '../types/widgets';

class WidgetRegistry {
  private widgets = new Map<WidgetType, WidgetRegistration>();
  private templates = new Map<string, WidgetTemplate>();

  /**
   * Register a new widget type
   */
  register(registration: WidgetRegistration): void {
    this.widgets.set(registration.type, registration);
    this.templates.set(registration.template.id, registration.template);
    console.log(`📦 Registered widget: ${registration.type}`);
  }

  /**
   * Get a widget registration by type
   */
  getWidget(type: WidgetType): WidgetRegistration | undefined {
    return this.widgets.get(type);
  }

  /**
   * Get all registered widgets
   */
  getAllWidgets(): WidgetRegistration[] {
    return Array.from(this.widgets.values());
  }

  /**
   * Get widget templates grouped by category
   */
  getTemplatesByCategory(): Record<string, WidgetTemplate[]> {
    const templates = Array.from(this.templates.values());
    return templates.reduce((acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = [];
      }
      acc[template.category].push(template);
      return acc;
    }, {} as Record<string, WidgetTemplate[]>);
  }

  /**
   * Get a template by ID
   */
  getTemplate(id: string): WidgetTemplate | undefined {
    return this.templates.get(id);
  }

  /**
   * Search templates by name or category
   */
  searchTemplates(query: string): WidgetTemplate[] {
    const normalizedQuery = query.toLowerCase();
    return Array.from(this.templates.values()).filter(
      template =>
        template.name.toLowerCase().includes(normalizedQuery) ||
        template.description.toLowerCase().includes(normalizedQuery) ||
        template.category.toLowerCase().includes(normalizedQuery)
    );
  }

  /**
   * Check if a widget type is registered
   */
  isRegistered(type: WidgetType): boolean {
    return this.widgets.has(type);
  }

  /**
   * Get default configuration for a widget type
   */
  getDefaultConfig(type: WidgetType) {
    const widget = this.widgets.get(type);
    return widget?.defaultConfig || {};
  }

  /**
   * Create a new widget instance with default configuration
   */
  createWidget(templateId: string, overrides: Partial<any> = {}) {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const widget = this.widgets.get(template.type);
    if (!widget) {
      throw new Error(`Widget type not registered: ${template.type}`);
    }

    const id = `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      id,
      type: template.type,
      title: template.name,
      position: {
        x: 0,
        y: 0,
        w: template.defaultSize.w,
        h: template.defaultSize.h,
        i: id,
        ...overrides.position
      },
      config: {
        title: template.name,
        description: template.description,
        refreshInterval: 30000, // 30 seconds default
        dataSources: [],
        visualization: {
          type: 'metric',
          options: {}
        },
        ...widget.defaultConfig,
        ...template.defaultConfig,
        ...overrides.config
      },
      data: undefined,
      lastUpdate: new Date(),
      isLoading: false,
      error: undefined
    };
  }

  /**
   * Validate widget configuration
   */
  validateConfig(type: WidgetType, config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config.title || config.title.trim() === '') {
      errors.push('Widget title is required');
    }

    if (!config.dataSources || config.dataSources.length === 0) {
      errors.push('At least one data source is required');
    }

    if (config.refreshInterval && config.refreshInterval < 1000) {
      errors.push('Refresh interval must be at least 1 second');
    }

    // Widget-specific validation
    const widget = this.widgets.get(type);
    if (widget && typeof widget.template === 'object') {
      // Additional validation based on widget type
      switch (type) {
        case WidgetType.METRIC_CARD:
          if (config.dataSources?.length > 1) {
            errors.push('Metric cards support only one data source');
          }
          break;
        case WidgetType.PIE_CHART:
          if (config.dataSources?.length > 5) {
            errors.push('Pie charts support maximum 5 data sources');
          }
          break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get widget statistics
   */
  getStats() {
    const templates = Array.from(this.templates.values());
    const categories = [...new Set(templates.map(t => t.category))];
    
    return {
      totalWidgets: this.widgets.size,
      totalTemplates: this.templates.size,
      categories: categories.length,
      byCategory: categories.reduce((acc, category) => {
        acc[category] = templates.filter(t => t.category === category).length;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}

// Export singleton instance
export const widgetRegistry = new WidgetRegistry();

// Export utility functions
export function registerWidget(registration: WidgetRegistration): void {
  widgetRegistry.register(registration);
}

export function getWidgetComponent(type: WidgetType) {
  const widget = widgetRegistry.getWidget(type);
  return widget?.component;
}

export function getWidgetConfigComponent(type: WidgetType) {
  const widget = widgetRegistry.getWidget(type);
  return widget?.configComponent;
}

export function createWidgetFromTemplate(templateId: string, overrides?: any) {
  return widgetRegistry.createWidget(templateId, overrides);
}

export function validateWidgetConfig(type: WidgetType, config: any) {
  return widgetRegistry.validateConfig(type, config);
}