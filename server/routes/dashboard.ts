import { Router } from 'express';
import { agentManager } from '../index.js';

export const dashboardRoutes = Router();

// Get dashboard overview
dashboardRoutes.get('/overview', (req, res) => {
  try {
    const agents = agentManager.getAllAgents();
    const totalAgents = agents.length;
    const activeAgents = agents.filter(agent => agent.status === 'active').length;
    const runningAgents = agents.filter(agent => agent.status === 'running').length;
    const errorAgents = agents.filter(agent => agent.status === 'error').length;

    const overview = {
      totalAgents,
      activeAgents,
      runningAgents,
      errorAgents,
      healthScore: Math.round(((activeAgents + runningAgents) / totalAgents) * 100) || 0
    };

    res.json({ success: true, data: overview, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error', 
      timestamp: new Date().toISOString() 
    });
  }
});

// Get metrics
dashboardRoutes.get('/metrics', (req, res) => {
  try {
    const agents = agentManager.getAllAgents();
    const metrics = agents.map(agent => ({
      type: agent.type,
      name: agent.name,
      metrics: agent.metrics
    }));

    res.json({ success: true, data: metrics, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error', 
      timestamp: new Date().toISOString() 
    });
  }
});

// Get activity log
dashboardRoutes.get('/activity', (req, res) => {
  try {
    // In a real implementation, this would come from a database
    const activities = [
      {
        id: '1',
        type: 'agent_start',
        agent: 'kpi-tracker',
        message: 'KPI Tracker agent started',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'metric_update',
        agent: 'revenue-ripple',
        message: 'Revenue metrics updated',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      }
    ];

    res.json({ success: true, data: activities, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error', 
      timestamp: new Date().toISOString() 
    });
  }
});