import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { agentRoutes } from './routes/agents.js';
import { dashboardRoutes } from './routes/dashboard.js';
import { webhookRoutes } from './routes/webhooks.js';
import { AgentManager } from './agents/AgentManager.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Agent Manager
export const agentManager = new AgentManager(io);

// Routes
app.use('/api/agents', agentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/webhooks', webhookRoutes);

// Health check
app.get('/api/health', (req, res) => {
  const overview = agentManager.getDashboardOverview();
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    agents: overview
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  
  // Send current agents status on connection
  const agents = agentManager.getAllAgents();
  socket.emit('agents:status', agents);
  
  // Agent-related events
  socket.on('agent:start', (agentType) => {
    console.log(`📡 WebSocket: Start agent ${agentType} from ${socket.id}`);
    const success = agentManager.startAgent(agentType, socket.id);
    
    if (success) {
      socket.emit('agent:started', { agentType, status: 'active' });
    } else {
      socket.emit('agent:error', { agentType, error: 'Failed to start agent' });
    }
  });
  
  socket.on('agent:stop', (agentType) => {
    console.log(`📡 WebSocket: Stop agent ${agentType} from ${socket.id}`);
    const success = agentManager.stopAgent(agentType, socket.id);
    
    if (success) {
      socket.emit('agent:stopped', { agentType, status: 'inactive' });
    } else {
      socket.emit('agent:error', { agentType, error: 'Failed to stop agent' });
    }
  });
  
  socket.on('agent:configure', (data) => {
    const { agentType, config } = data;
    console.log(`📡 WebSocket: Configure agent ${agentType} from ${socket.id}`);
    const success = agentManager.configureAgent(agentType, config);
    
    if (success) {
      socket.emit('agent:configured', { agentType, config });
    } else {
      socket.emit('agent:error', { agentType, error: 'Failed to configure agent' });
    }
  });
  
  // Request metrics
  socket.on('metrics:request', () => {
    const metrics = agentManager.getAgentMetrics();
    const overview = agentManager.getDashboardOverview();
    socket.emit('agents:metrics', metrics);
    socket.emit('dashboard:metrics', overview);
  });
  
  socket.on('disconnect', (reason) => {
    console.log(`🔌 Client disconnected: ${socket.id} (${reason})`);
    agentManager.handleDisconnect(socket.id);
  });
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// Graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

function gracefulShutdown(signal: string) {
  console.log(`🛑 Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('📡 HTTP server closed');
    
    // Cleanup agents
    agentManager.cleanup();
    console.log('🤖 All agents stopped');
    
    io.close(() => {
      console.log('🔌 WebSocket server closed');
      process.exit(0);
    });
  });
  
  // Force exit after 10 seconds
  setTimeout(() => {
    console.error('⏰ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log('🚀 DevOps Modules Server starting...');
  console.log(`📊 Server running on port ${PORT}`);
  console.log(`� WebSocket server ready`);
  console.log(`🌐 CORS enabled for: ${process.env.CLIENT_URL || "http://localhost:5173"}`);
  console.log(`🤖 Agent system initialized`);
  
  // Start broadcasting metrics
  agentManager.broadcastMetrics();
});

export { io };