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
    methods: ["GET", "POST"]
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
const agentManager = new AgentManager(io);

// Routes
app.use('/api/agents', agentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/webhooks', webhookRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Agent-related events
  socket.on('agent:start', (agentType) => {
    agentManager.startAgent(agentType, socket.id);
  });
  
  socket.on('agent:stop', (agentType) => {
    agentManager.stopAgent(agentType, socket.id);
  });
  
  socket.on('agent:configure', (agentType, config) => {
    agentManager.configureAgent(agentType, config);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    agentManager.handleDisconnect(socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 DevOps Modules Server running on port ${PORT}`);
  console.log(`📊 Dashboard available at http://localhost:${PORT}`);
});

export { io, agentManager };