import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { WidgetWrapper } from './WidgetWrapper';
import { useDashboard } from '../../contexts/DashboardContext';
import { useAgents } from '../../hooks/useAgents';
import type { WidgetProps } from '../../types/widgets';

interface MetricData {
  value: number;
  previousValue?: number;
  trend?: 'up' | 'down' | 'stable';
  trendPercentage?: number;
  unit?: string;
  timestamp?: Date;
  status?: 'normal' | 'warning' | 'critical';
}

export function MetricCardWidget(props: WidgetProps) {
  const { widget, data, isLoading, error } = props;
  const { actions } = useDashboard();
  const { agents } = useAgents();
  const [metricData, setMetricData] = useState<MetricData | null>(null);

  // Process widget data into metric format
  useEffect(() => {
    if (!data) return;

    let processedData: MetricData;

    // Handle different data sources
    if (widget.config.dataSources?.[0]?.type === 'agent') {
      // Agent data source
      const agentId = widget.config.dataSources[0].source;
      const field = widget.config.dataSources[0].field;
      
      const agent = agents.find(a => a.id === agentId);
      if (agent && field) {
        // Extract specific field from agent metrics
        const value = extractValueFromAgent(agent, field);
        processedData = {
          value,
          unit: getUnitForField(field),
          timestamp: new Date(),
          status: getStatusForValue(value, widget.config.thresholds)
        };
      } else {
        // Default to showing agent success rate
        processedData = {
          value: agent?.metrics?.successRate || 0,
          unit: '%',
          timestamp: new Date(),
          status: 'normal'
        };
      }
    } else if (widget.config.dataSources?.[0]?.type === 'realtime') {
      // Real-time data from KPI Tracker or other sources
      processedData = {
        value: data.value || data.kpis?.revenue || 0,
        previousValue: data.previousValue,
        trend: data.trend || calculateTrend(data.value, data.previousValue),
        trendPercentage: data.trendPercentage || calculateTrendPercentage(data.value, data.previousValue),
        unit: data.unit || '$',
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
        status: getStatusForValue(data.value, widget.config.thresholds)
      };
    } else {
      // Static or API data
      processedData = {
        value: typeof data === 'number' ? data : data.value || 0,
        unit: data.unit,
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
        status: 'normal'
      };
    }

    setMetricData(processedData);
  }, [data, widget.config, agents]);

  const extractValueFromAgent = (agent: any, field: string): number => {
    switch (field) {
      case 'successRate':
        return agent.metrics?.successRate || 0;
      case 'totalRuns':
        return agent.metrics?.totalRuns || 0;
      case 'averageRunTime':
        return agent.metrics?.averageRunTime || 0;
      case 'errorCount':
        return agent.metrics?.errorCount || 0;
      default:
        return 0;
    }
  };

  const getUnitForField = (field: string): string => {
    switch (field) {
      case 'successRate':
        return '%';
      case 'totalRuns':
        return '';
      case 'averageRunTime':
        return 'ms';
      case 'errorCount':
        return '';
      default:
        return '';
    }
  };

  const calculateTrend = (current: number, previous?: number): 'up' | 'down' | 'stable' => {
    if (!previous || previous === 0) return 'stable';
    const change = ((current - previous) / previous) * 100;
    if (Math.abs(change) < 1) return 'stable';
    return change > 0 ? 'up' : 'down';
  };

  const calculateTrendPercentage = (current: number, previous?: number): number => {
    if (!previous || previous === 0) return 0;
    return Math.abs(((current - previous) / previous) * 100);
  };

  const getStatusForValue = (value: number, thresholds?: { warning: number; critical: number }): 'normal' | 'warning' | 'critical' => {
    if (!thresholds) return 'normal';
    
    if (value >= thresholds.critical) return 'critical';
    if (value >= thresholds.warning) return 'warning';
    return 'normal';
  };

  const formatValue = (value: number, unit?: string): string => {
    let formattedValue: string;
    
    if (value >= 1000000) {
      formattedValue = (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      formattedValue = (value / 1000).toFixed(1) + 'K';
    } else if (value % 1 === 0) {
      formattedValue = value.toString();
    } else {
      formattedValue = value.toFixed(2);
    }
    
    return unit ? `${formattedValue}${unit}` : formattedValue;
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-green-600" />;
      case 'down':
        return <TrendingDown size={16} className="text-red-600" />;
      default:
        return <Minus size={16} className="text-gray-400" />;
    }
  };

  const getStatusStyles = (status?: string) => {
    switch (status) {
      case 'warning':
        return {
          border: 'border-yellow-200',
          bg: 'bg-yellow-50',
          text: 'text-yellow-800',
          accent: 'text-yellow-600'
        };
      case 'critical':
        return {
          border: 'border-red-200',
          bg: 'bg-red-50',
          text: 'text-red-800',
          accent: 'text-red-600'
        };
      default:
        return {
          border: 'border-gray-200',
          bg: 'bg-white',
          text: 'text-gray-900',
          accent: 'text-blue-600'
        };
    }
  };

  const statusStyles = getStatusStyles(metricData?.status);

  return (
    <WidgetWrapper {...props}>
      <div className={`h-full p-6 ${statusStyles.bg} ${statusStyles.border} border-l-4`}>
        {/* Status indicator */}
        {metricData?.status && metricData.status !== 'normal' && (
          <div className="flex items-center mb-4">
            <AlertTriangle size={16} className={statusStyles.accent} />
            <span className={`ml-2 text-sm font-medium ${statusStyles.text}`}>
              {metricData.status.charAt(0).toUpperCase() + metricData.status.slice(1)} threshold reached
            </span>
          </div>
        )}

        {/* Main metric display */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className={`text-3xl font-bold ${statusStyles.text}`}>
              {metricData ? formatValue(metricData.value, metricData.unit) : '--'}
            </div>
            
            {/* Trend indicator */}
            {metricData?.trend && metricData.trend !== 'stable' && (
              <div className="flex items-center mt-2">
                {getTrendIcon(metricData.trend)}
                <span className={`ml-1 text-sm font-medium ${
                  metricData.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metricData.trendPercentage?.toFixed(1)}%
                </span>
                <span className="ml-2 text-sm text-muted-foreground">
                  vs previous
                </span>
              </div>
            )}
            
            {/* Previous value comparison */}
            {metricData?.previousValue !== undefined && (
              <div className="mt-2 text-sm text-muted-foreground">
                Previous: {formatValue(metricData.previousValue, metricData.unit)}
              </div>
            )}
          </div>

          {/* Visual accent */}
          <div className="ml-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${statusStyles.bg} border-2 ${statusStyles.border}`}>
              <span className={`text-lg ${statusStyles.accent}`}>
                {widget.config.visualization?.options?.icon || '📊'}
              </span>
            </div>
          </div>
        </div>

        {/* Threshold indicators */}
        {widget.config.thresholds && (
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Warning: {formatValue(widget.config.thresholds.warning, metricData?.unit)}</span>
              <span>Critical: {formatValue(widget.config.thresholds.critical, metricData?.unit)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  metricData?.status === 'critical' ? 'bg-red-500' :
                  metricData?.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{
                  width: `${Math.min((metricData?.value || 0) / widget.config.thresholds.critical * 100, 100)}%`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </WidgetWrapper>
  );
}