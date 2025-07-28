import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';
import { AgentManager } from './agents/AgentManager.js';
import { healthMetrics } from './utils/HealthMetrics.js';
import { RateLimiterFactory } from './utils/RateLimiter.js';
import { aiInsightsEngine } from './utils/AIInsightsEngine.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiters for different endpoints
const apiLimiter = RateLimiterFactory.createAPILimiter(io);
const authLimiter = RateLimiterFactory.createAuthLimiter(io);

// Rate limiting middleware
const createRateLimitMiddleware = (limiter: any, identifier: (req: any) => string) => {
  return async (req: any, res: any, next: any) => {
    try {
      const id = identifier(req);
      const rateLimitInfo = await limiter.checkLimit(id);
      
      if (rateLimitInfo.isBlocked) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          retryAfter: rateLimitInfo.resetTime,
          remaining: rateLimitInfo.remaining
        });
      }
      
      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': limiter.config?.maxRequests || 100,
        'X-RateLimit-Remaining': rateLimitInfo.remaining,
        'X-RateLimit-Reset': rateLimitInfo.resetTime.toISOString()
      });
      
      next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      next(); // Continue on rate limiter error
    }
  };
};

// Apply rate limiting
app.use('/api/', createRateLimitMiddleware(apiLimiter, (req) => req.ip || 'unknown'));
app.use('/auth/', createRateLimitMiddleware(authLimiter, (req) => req.ip || 'unknown'));

// Initialize systems
const agentManager = new AgentManager(io);

// Initialize AI insights engine with WebSocket support
aiInsightsEngine['io'] = io;

// Start health metrics collection
healthMetrics.startCollection(30000); // Every 30 seconds

// Health check endpoint
app.get('/health', async (req, res) => {
  const metrics = healthMetrics.getLatestMetrics();
  const allAgents = agentManager.getAllAgents();
  
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date(),
    agents: {
      total: allAgents.length,
      active: allAgents.filter(a => a.status === 'active').length,
      inactive: allAgents.filter(a => a.status === 'inactive').length,
      errors: allAgents.filter(a => a.status === 'error').length
    },
    system: metrics?.system || null,
    uptime: process.uptime()
  };

  // Determine overall health status
  if (healthStatus.agents.errors > 3) {
    healthStatus.status = 'degraded';
  }
  if (healthStatus.agents.errors > 5) {
    healthStatus.status = 'unhealthy';
  }

  const statusCode = healthStatus.status === 'healthy' ? 200 : 
                    healthStatus.status === 'degraded' ? 206 : 503;
  
  res.status(statusCode).json(healthStatus);
});

// Agent management endpoints
app.get('/api/agents', (req, res) => {
  const agents = agentManager.getAllAgents();
  res.json({
    success: true,
    data: agents,
    timestamp: new Date()
  });
});

app.post('/api/agents/:agentType/start', (req, res) => {
  const { agentType } = req.params;
  const connectionId = req.headers['x-connection-id'] as string || 'api';
  
  const success = agentManager.startAgent(agentType as any, connectionId);
  
  res.json({
    success,
    message: success ? `Agent ${agentType} started` : `Failed to start agent ${agentType}`,
    timestamp: new Date()
  });
});

app.post('/api/agents/:agentType/stop', (req, res) => {
  const { agentType } = req.params;
  const connectionId = req.headers['x-connection-id'] as string || 'api';
  
  const success = agentManager.stopAgent(agentType as any, connectionId);
  
  res.json({
    success,
    message: success ? `Agent ${agentType} stopped` : `Failed to stop agent ${agentType}`,
    timestamp: new Date()
  });
});

app.post('/api/agents/:agentType/configure', (req, res) => {
  const { agentType } = req.params;
  const config = req.body;
  
  const success = agentManager.configureAgent(agentType as any, config);
  
  res.json({
    success,
    message: success ? `Agent ${agentType} configured` : `Failed to configure agent ${agentType}`,
    timestamp: new Date()
  });
});

// Get AI report for agent
app.get('/api/agents/:agentType/report', (req, res) => {
  try {
    const { agentType } = req.params;
    const agent = agentManager.getAgent(agentType as any);
    
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

// Metrics endpoints
app.get('/api/metrics/system', (req, res) => {
  const metrics = healthMetrics.getLatestMetrics();
  res.json({
    success: true,
    data: metrics,
    timestamp: new Date()
  });
});

app.get('/api/metrics/agents', (req, res) => {
  const agents = agentManager.getAllAgents();
  const metrics = agents.map(agent => ({
    id: agent.id,
    name: agent.name,
    type: agent.type,
    metrics: agent.metrics,
    rateLimitInfo: agent.metrics // Would include rate limit info in real implementation
  }));
  
  res.json({
    success: true,
    data: metrics,
    timestamp: new Date()
  });
});

// Rate limiter metrics endpoint
app.get('/api/metrics/rate-limits', (req, res) => {
  const stats = {
    api: apiLimiter.getStats(),
    auth: authLimiter.getStats()
  };
  
  res.json({
    success: true,
    data: stats,
    timestamp: new Date()
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  
  // Send current system status
  socket.emit('system:status', {
    agents: agentManager.getAllAgents(),
    health: healthMetrics.getLatestMetrics(),
    timestamp: new Date()
  });

  // Agent management via WebSocket
  socket.on('agent:start', (data) => {
    const { agentType } = data;
    const success = agentManager.startAgent(agentType, socket.id);
    socket.emit('agent:start:response', { success, agentType });
  });

  socket.on('agent:stop', (data) => {
    const { agentType } = data;
    const success = agentManager.stopAgent(agentType, socket.id);
    socket.emit('agent:stop:response', { success, agentType });
  });

  socket.on('agent:configure', (data) => {
    const { agentType, config } = data;
    const success = agentManager.configureAgent(agentType, config);
    socket.emit('agent:configure:response', { success, agentType });
  });

  // Broadcast metrics periodically
  const metricsInterval = setInterval(() => {
    socket.emit('metrics:update', {
      agents: agentManager.getAllAgents().map(a => ({
        id: a.id,
        status: a.status,
        metrics: a.metrics
      })),
      system: healthMetrics.getLatestMetrics(),
      timestamp: new Date()
    });
  }, 10000); // Every 10 seconds

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
    clearInterval(metricsInterval);
    agentManager.handleDisconnect(socket.id);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  
  // Stop all agents
  const agents = agentManager.getAllAgents();
  agents.forEach(agent => {
    if (agent.status === 'active') {
      agentManager.stopAgent(agent.type, 'system');
    }
  });
  
  // Stop health metrics collection
  healthMetrics.stopCollection();
  
  // Close server
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.emit('SIGTERM');
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 AI Agent System running on port ${PORT}`);
  console.log(`📊 Health monitoring active`);
  console.log(`🛡️ Rate limiting enabled`);
  console.log(`🤖 17 agents available (16 specialized + 1 health monitor)`);
});

export { io, agentManager, healthMetrics };