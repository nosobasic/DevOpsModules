import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { WidgetWrapper } from './WidgetWrapper';
import { useDashboard } from '../../contexts/DashboardContext';
import { useAgents } from '../../hooks/useAgents';
import type { WidgetProps } from '../../types/widgets';

interface ChartDataPoint {
  name: string;
  value: number;
  timestamp?: string;
  [key: string]: any;
}

const DEFAULT_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', 
  '#0088aa', '#ff8800', '#00aaff', '#aa00ff', '#ff00aa'
];

export function ChartWidget(props: WidgetProps) {
  const { widget, data, isLoading, error } = props;
  const { actions } = useDashboard();
  const { agents } = useAgents();
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    if (!data) return;

    let processedData: ChartDataPoint[] = [];

    // Handle different data sources and formats
    if (widget.config.dataSources?.[0]?.type === 'agent') {
      // Agent data source - create chart from agent metrics
      const agentId = widget.config.dataSources[0].source;
      const field = widget.config.dataSources[0].field;
      
      const agent = agents.find(a => a.id === agentId);
                     if (agent?.metrics && 'dataPoints' in agent.metrics && Array.isArray((agent.metrics as any).dataPoints)) {
          processedData = (agent.metrics as any).dataPoints.map((point: any, index: number) => ({
            name: `Run ${index + 1}`,
            value: point.value,
            timestamp: point.timestamp?.toISOString() || new Date().toISOString(),
            executionTime: point.metadata?.executionTime || 0,
            success: point.metadata?.success ? 1 : 0
          }));
        } else if (agent?.metrics) {
          // Fallback to basic metrics if dataPoints not available
          processedData = [
            { name: 'Success Rate', value: agent.metrics.successRate },
            { name: 'Total Runs', value: agent.metrics.totalRuns },
            { name: 'Avg Runtime', value: agent.metrics.averageRunTime },
            { name: 'Errors', value: agent.metrics.errorCount }
          ];
        }
    } else if (widget.config.dataSources?.[0]?.type === 'realtime') {
      // Real-time data from KPI Tracker or other sources
      if (data.kpis) {
        // Multiple KPIs - convert to chart format
        processedData = Object.entries(data.kpis).map(([key, value]) => ({
          name: formatKPIName(key),
          value: value as number,
          timestamp: data.timestamp
        }));
      } else if (Array.isArray(data.trends)) {
        // Time series data with trends
        processedData = data.trends.map((item: any, index: number) => ({
          name: item.name || `Point ${index + 1}`,
          value: item.value,
          change: item.change,
          direction: item.direction,
          timestamp: item.timestamp
        }));
      } else if (data.dataPoints) {
        // Historical data points
        processedData = data.dataPoints.map((point: any, index: number) => ({
          name: point.name || `Point ${index + 1}`,
          value: point.value,
          timestamp: point.timestamp
        }));
      }
    } else if (Array.isArray(data)) {
      // Direct array data
      processedData = data.map((item, index) => ({
        name: item.name || `Item ${index + 1}`,
        value: typeof item === 'number' ? item : item.value || 0,
        ...item
      }));
    } else if (typeof data === 'object') {
      // Object data - convert to chart format
      processedData = Object.entries(data).map(([key, value]) => ({
        name: key,
        value: typeof value === 'number' ? value : 0
      }));
    }

    setChartData(processedData);
  }, [data, widget.config, agents]);

  const formatKPIName = (key: string): string => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  const formatTooltipValue = (value: any, name: string) => {
    if (typeof value === 'number') {
      if (name.toLowerCase().includes('rate') || name.toLowerCase().includes('percentage')) {
        return `${value.toFixed(2)}%`;
      }
      if (name.toLowerCase().includes('time') && value > 1000) {
        return `${(value / 1000).toFixed(2)}s`;
      }
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toFixed(2);
    }
    return value;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${formatTooltipValue(entry.value, entry.name)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const chartType = widget.config.visualization?.type || 'line';
    const colors = widget.config.colors || DEFAULT_COLORS;
    const options = widget.config.visualization?.options || {};

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              {options.showLegend !== false && <Legend />}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={colors[0]} 
                strokeWidth={2}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              {options.showLegend !== false && <Legend />}
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={colors[0]} 
                fill={`${colors[0]}20`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              {options.showLegend !== false && <Legend />}
              <Bar 
                dataKey="value" 
                fill={colors[0]}
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              {options.showLegend !== false && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Unsupported chart type: {chartType}</p>
          </div>
        );
    }
  };

  const getEmptyState = () => (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      <div className="text-center">
        <div className="text-4xl mb-2">📊</div>
        <p className="text-sm font-medium">No data available</p>
        <p className="text-xs mt-1">Configure a data source to display chart</p>
      </div>
    </div>
  );

  return (
    <WidgetWrapper {...props}>
      <div className="h-full p-4">
        {chartData.length > 0 ? renderChart() : getEmptyState()}
      </div>
    </WidgetWrapper>
  );
}