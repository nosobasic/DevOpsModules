import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { configManager } from '../../lib/config';

interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'critical' | 'optimization' | 'trend';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  confidence: number;
  recommendations: AIRecommendation[];
  dataPoints: any[];
  trend: 'improving' | 'declining' | 'stable' | 'volatile';
  estimatedROI?: string;
  timeframe: string;
  tags: string[];
}

interface AIRecommendation {
  id: string;
  action: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  effort: 'low' | 'medium' | 'high';
  estimatedImpact: string;
  steps: string[];
  resources: string[];
  timeline: string;
  riskLevel: 'low' | 'medium' | 'high';
  automatable: boolean;
}

interface AgentReport {
  agentId: string;
  agentName: string;
  timestamp: Date;
  summary: string;
  overallHealth: number;
  insights: AIInsight[];
  quickActions: AIRecommendation[];
  trends: {
    name: string;
    direction: 'up' | 'down' | 'stable';
    change: number;
    significance: 'low' | 'medium' | 'high';
  }[];
  nextRecommendedAction: AIRecommendation | null;
}

interface AIInsightsPanelProps {
  agentId: string;
  agentName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AIInsightsPanel({ agentId, agentName, isOpen, onClose }: AIInsightsPanelProps) {
  const [report, setReport] = useState<AgentReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && agentId) {
      fetchAIReport();
    }
  }, [isOpen, agentId]);

  const fetchAIReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = configManager.getApiUrl();
      const response = await fetch(`${apiUrl}/api/agents/${agentId}/report`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch AI report: ${response.statusText}`);
      }
      
      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch AI insights');
      console.error('Error fetching AI report:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return '🚀';
      case 'warning': return '⚠️';
      case 'critical': return '🚨';
      case 'optimization': return '⚡';
      case 'trend': return '📈';
      default: return '💡';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">AI Insights & Recommendations</h2>
              <p className="text-gray-600">{agentName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Analyzing agent performance...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
              <button
                onClick={fetchAIReport}
                className="mt-2 text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          )}

          {report && !loading && (
            <div className="space-y-6">
              {/* Summary Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Executive Summary</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Health Score:</span>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      report.overallHealth >= 80 ? 'bg-green-100 text-green-800' :
                      report.overallHealth >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {report.overallHealth}/100
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{report.summary}</p>
                <div className="mt-4 text-sm text-gray-600">
                  Last updated: {formatDistanceToNow(report.timestamp, { addSuffix: true })}
                </div>
              </div>

              {/* Quick Actions */}
              {report.quickActions.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                  <div className="grid gap-4">
                    {report.quickActions.map((action) => (
                      <div key={action.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{action.action}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(action.priority)}`}>
                            {action.priority}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">Impact:</span>
                            <div className="font-medium">{action.estimatedImpact}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Effort:</span>
                            <div className="font-medium capitalize">{action.effort}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Timeline:</span>
                            <div className="font-medium">{action.timeline}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Risk:</span>
                            <div className="font-medium capitalize">{action.riskLevel}</div>
                          </div>
                        </div>
                        {action.automatable && (
                          <div className="bg-green-50 border border-green-200 rounded p-2 mb-3">
                            <span className="text-green-800 text-sm">🤖 Auto-fix available</span>
                          </div>
                        )}
                        <div>
                          <h5 className="text-sm font-medium mb-2">Steps:</h5>
                          <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                            {action.steps.map((step, index) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Insights */}
              {report.insights.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">AI Insights</h3>
                  <div className="grid gap-4">
                    {report.insights.map((insight) => (
                      <div key={insight.id} className={`border rounded-lg p-4 ${getSeverityColor(insight.severity)}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">{getTypeIcon(insight.type)}</span>
                            <h4 className="font-semibold">{insight.title}</h4>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(insight.severity)}`}>
                              {insight.severity}
                            </span>
                            <span className="text-xs text-gray-600">
                              {Math.round(insight.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{insight.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">Impact:</span>
                            <div className="font-medium">{insight.impact}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Timeframe:</span>
                            <div className="font-medium">{insight.timeframe}</div>
                          </div>
                          {insight.estimatedROI && (
                            <div className="col-span-2">
                              <span className="text-gray-600">Estimated ROI:</span>
                              <div className="font-medium text-green-600">{insight.estimatedROI}</div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {insight.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trends */}
              {report.trends.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Performance Trends</h3>
                  <div className="grid gap-3">
                    {report.trends.map((trend, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="font-medium">{trend.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${
                            trend.direction === 'up' ? 'text-green-600' :
                            trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'}
                            {trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}%
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            trend.significance === 'high' ? 'bg-red-100 text-red-800' :
                            trend.significance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {trend.significance}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 