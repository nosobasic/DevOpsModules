import { Router } from 'express';
import { agentManager } from '../index.js';
import { AgentType } from '../../shared/types.js';

export const agentRoutes = Router();

// Get all agents
agentRoutes.get('/', (req, res) => {
  try {
    const agents = agentManager.getAllAgents();
    res.json({ success: true, data: agents, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message, 
      timestamp: new Date().toISOString() 
    });
  }
});

// Get specific agent
agentRoutes.get('/:type', (req, res) => {
  try {
    const agentType = req.params.type as AgentType;
    const status = agentManager.getAgentStatus(agentType);
    
    if (!status) {
      return res.status(404).json({ 
        success: false, 
        error: 'Agent not found', 
        timestamp: new Date().toISOString() 
      });
    }
    
    res.json({ success: true, data: { type: agentType, status }, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message, 
      timestamp: new Date().toISOString() 
    });
  }
});

// Start agent
agentRoutes.post('/:type/start', (req, res) => {
  try {
    const agentType = req.params.type as AgentType;
    const success = agentManager.startAgent(agentType, 'api-request');
    
    res.json({ 
      success, 
      message: success ? 'Agent started successfully' : 'Failed to start agent',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message, 
      timestamp: new Date().toISOString() 
    });
  }
});

// Stop agent
agentRoutes.post('/:type/stop', (req, res) => {
  try {
    const agentType = req.params.type as AgentType;
    const success = agentManager.stopAgent(agentType, 'api-request');
    
    res.json({ 
      success, 
      message: success ? 'Agent stopped successfully' : 'Failed to stop agent',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message, 
      timestamp: new Date().toISOString() 
    });
  }
});

// Configure agent
agentRoutes.put('/:type/config', (req, res) => {
  try {
    const agentType = req.params.type as AgentType;
    const config = req.body;
    const success = agentManager.configureAgent(agentType, config);
    
    res.json({ 
      success, 
      message: success ? 'Agent configured successfully' : 'Failed to configure agent',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message, 
      timestamp: new Date().toISOString() 
    });
  }
});