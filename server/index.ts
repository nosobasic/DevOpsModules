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

// CORS configuration
const corsOptions = {
  origin: [
    process.env.CLIENT_URL,
    "https://dev-ops-modules-508gpxf5m-nosobasics-projects.vercel.app",
    "https://dev-ops-modules-iq3edu6p4-nosobasics-projects.vercel.app",
    "https://devops.revenueripple.org",
    "http://localhost:5173",
    "http://localhost:3000"
  ].filter((origin): origin is string => Boolean(origin)),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

const io = new Server(server, {
  cors: {
    origin: corsOptions.origin,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Agent Manager
const agentManager = new AgentManager(io);

// Set agent manager for routes
import { setAgentManager } from './routes/agents.js';
setAgentManager(agentManager);

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
  const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
  console.log(`🚀 DevOps Modules Server running on ${HOST}:${PORT}`);
  console.log(`📊 Dashboard available at http://${HOST}:${PORT}`);
  console.log(`🌐 CORS origins:`, corsOptions.origin);
});

export { io, agentManager };