import { Router } from 'express';

export const dashboardRoutes = Router();

// Get dashboard overview
dashboardRoutes.get('/overview', async (req, res) => {
  try {
    // Import agentManager dynamically to avoid circular dependency
    const { agentManager } = await import('../index.js');
    const overview = agentManager.getDashboardOverview();

    res.json({ 
      success: true, 
      data: overview, 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message, 
      timestamp: new Date().toISOString() 
    });
  }
});

// Get metrics
dashboardRoutes.get('/metrics', async (req, res) => {
  try {
    const { agentManager } = await import('../index.js');
    const metrics = agentManager.getAgentMetrics();

    res.json({ 
      success: true, 
      data: metrics, 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message, 
      timestamp: new Date().toISOString() 
    });
  }
});

// Get activity log
dashboardRoutes.get('/activity', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const { agentManager } = await import('../index.js');
    const activities = agentManager.getActivityLogs(limit);

    res.json({ 
      success: true, 
      data: activities, 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error fetching activity log:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message, 
      timestamp: new Date().toISOString() 
    });
  }
});