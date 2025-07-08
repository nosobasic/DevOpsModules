import { Router } from 'express';
import { AgentType } from '../../shared/types.js';

export const agentRoutes = Router();

// Get all agents
agentRoutes.get('/', async (req, res) => {
  try {
    // Import agentManager dynamically to avoid circular dependency
    const { agentManager } = await import('../index.js');
    const agents = agentManager.getAllAgents();
    
    res.json({ 
      success: true, 
      data: agents, 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error', 
      timestamp: new Date().toISOString() 
    });
  }
});

// Get specific agent
agentRoutes.get('/:type', async (req, res) => {
  try {
    const agentType = req.params.type as AgentType;
    const { agentManager } = await import('../index.js');
    const agent = agentManager.getAgent(agentType);
    
    if (!agent) {
      return res.status(404).json({ 
        success: false, 
        error: 'Agent not found', 
        timestamp: new Date().toISOString() 
      });
    }
    
    res.json({ 
      success: true, 
      data: agent, 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error', 
      timestamp: new Date().toISOString() 
    });
  }
});

// Start agent
agentRoutes.post('/:type/start', async (req: Request, res: Response) => {
  try {
    const agentType = req.params.type as AgentType;
    const { agentManager } = await import('../index.js');
    const success = agentManager.startAgent(agentType, 'api-request');
    
    if (success) {
      res.json({ 
        success: true, 
        message: `Agent ${agentType} started successfully`,
        timestamp: new Date().toISOString() 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: `Failed to start agent ${agentType}`,
        timestamp: new Date().toISOString() 
      });
    }
  } catch (error) {
    console.error('Error starting agent:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error', 
      timestamp: new Date().toISOString() 
    });
  }
});

// Stop agent
agentRoutes.post('/:type/stop', async (req: Request, res: Response) => {
  try {
    const agentType = req.params.type as AgentType;
    const { agentManager } = await import('../index.js');
    const success = agentManager.stopAgent(agentType, 'api-request');
    
    if (success) {
      res.json({ 
        success: true, 
        message: `Agent ${agentType} stopped successfully`,
        timestamp: new Date().toISOString() 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: `Failed to stop agent ${agentType}`,
        timestamp: new Date().toISOString() 
      });
    }
  } catch (error) {
    console.error('Error stopping agent:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error', 
      timestamp: new Date().toISOString() 
    });
  }
});

// Configure agent
agentRoutes.put('/:type/config', async (req: Request, res: Response) => {
  try {
    const agentType = req.params.type as AgentType;
    const config = req.body;
    const { agentManager } = await import('../index.js');
    const success = agentManager.configureAgent(agentType, config);
    
    if (success) {
      res.json({ 
        success: true, 
        message: `Agent ${agentType} configured successfully`,
        timestamp: new Date().toISOString() 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: `Failed to configure agent ${agentType}`,
        timestamp: new Date().toISOString() 
      });
    }
  } catch (error) {
    console.error('Error configuring agent:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error', 
      timestamp: new Date().toISOString() 
    });
  }
});

// Get agent metrics
agentRoutes.get('/:type/metrics', async (req: Request, res: Response) => {
  try {
    const agentType = req.params.type as AgentType;
    const { agentManager } = await import('../index.js');
    const metrics = agentManager.getAgentMetrics(agentType);
    
    if (!metrics) {
      return res.status(404).json({ 
        success: false, 
        error: 'Agent not found', 
        timestamp: new Date().toISOString() 
      });
    }
    
    res.json({ 
      success: true, 
      data: metrics, 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error fetching agent metrics:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error', 
      timestamp: new Date().toISOString() 
    });
  }
});