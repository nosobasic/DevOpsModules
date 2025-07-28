import express from 'express';
import { AgentManager } from '../agents/AgentManager.js';
import { AgentType } from '../../shared/types.js';

let agentManager: AgentManager;

export function setAgentManager(manager: AgentManager) {
  agentManager = manager;
}

export const agentRoutes = express.Router();

// Get all agents
agentRoutes.get('/', async (req, res) => {
  try {
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
      message: error instanceof Error ? error.message : 'Failed to fetch agents',
      timestamp: new Date().toISOString()
    });
  }
});

// Get specific agent
agentRoutes.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const agentType = type as AgentType;
    const status = agentManager.getAgentStatus(agentType);
    
    if (!status) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      data: { type: agentType, status },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch agent',
      timestamp: new Date().toISOString()
    });
  }
});

// Start agent
agentRoutes.post('/:type/start', async (req, res) => {
  try {
    const { type } = req.params;
    const agentType = type as AgentType;
    const success = agentManager.startAgent(agentType, 'api-request');
    
    if (success) {
      res.json({
        success: true,
        message: 'Agent started successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to start agent',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error starting agent:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to start agent',
      timestamp: new Date().toISOString()
    });
  }
});

// Stop agent
agentRoutes.post('/:type/stop', async (req, res) => {
  try {
    const { type } = req.params;
    const agentType = type as AgentType;
    const success = agentManager.stopAgent(agentType, 'api-request');
    
    if (success) {
      res.json({
        success: true,
        message: 'Agent stopped successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to stop agent',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error stopping agent:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to stop agent',
      timestamp: new Date().toISOString()
    });
  }
});

// Configure agent
agentRoutes.post('/:type/configure', async (req, res) => {
  try {
    const { type } = req.params;
    const agentType = type as AgentType;
    const config = req.body;
    
    const success = agentManager.configureAgent(agentType, config);
    
    if (success) {
      res.json({
        success: true,
        message: 'Agent configured successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to configure agent',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error configuring agent:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to configure agent',
      timestamp: new Date().toISOString()
    });
  }
});

// Get AI report for agent
agentRoutes.get('/:type/report', async (req, res) => {
  try {
    const { type } = req.params;
    const agentType = type as AgentType;
    const agent = agentManager.getAgent(agentType);
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found',
        timestamp: new Date().toISOString()
      });
    }
    
    // Get the last AI report from the agent
    const lastReport = agent.getLastReport();
    
    if (!lastReport) {
      return res.status(404).json({
        success: false,
        message: 'No AI report available for this agent',
        timestamp: new Date().toISOString()
      });
    }
    
    res.json(lastReport);
  } catch (error) {
    console.error('Error fetching AI report:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch AI report',
      timestamp: new Date().toISOString()
    });
  }
});