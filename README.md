# DevOps Modules

A comprehensive DevOps automation platform with intelligent agents for monitoring, optimization, and management of your development and operations workflows.

## 🚀 Features

### Intelligent Agents
- **KPI Tracker**: Real-time monitoring of key performance indicators
- **Revenue Ripple Tracker**: Revenue analytics and growth tracking
- **A/B Optimizer**: Automated A/B testing and optimization
- **Funnel Tester**: Conversion funnel analysis and testing
- **Ad Generator**: AI-powered advertisement generation
- **Webhook Validator**: Webhook monitoring and validation
- **Daily Pulse**: Daily system health and performance summaries

### Dashboard Features
- **Real-time Monitoring**: Live agent status and metrics
- **Interactive Controls**: Start, stop, and configure agents
- **Activity Logging**: Comprehensive system activity tracking
- **Responsive Design**: Modern, mobile-friendly interface
- **Dark/Light Mode**: Customizable theme support

## 🛠 Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Tanstack Query** for data fetching
- **React Router** for navigation
- **date-fns** for date utilities

### Backend
- **Node.js** with TypeScript
- **Express.js** for REST API
- **Socket.IO** for real-time communication
- **Modular Agent Architecture**

## 📁 Project Structure

```
├── src/                          # Frontend source code
│   ├── components/              # React components
│   │   ├── dashboard/          # Dashboard-specific components
│   │   └── ui/                 # Reusable UI components
│   ├── pages/                  # Page components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility libraries
│   └── types/                  # TypeScript type definitions
├── server/                      # Backend source code
│   ├── agents/                 # Agent implementations
│   ├── routes/                 # API route handlers
│   └── middleware/             # Express middleware
├── shared/                      # Shared types and utilities
└── public/                      # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nosobasic/DevOpsModules.git
   cd DevOpsModules
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp env.production .env
   # Edit .env with your Revenue Ripple API key and settings
   ```

4. **Start the application**:
   ```bash
   npm run dev
   ```

5. **Access the dashboard**:
   - Frontend: https://devops.revenueripple.org
   - Backend API: https://revenueripple.org

### Production Build

```bash
# Build the frontend
npm run build

# Build the server
npm run build:server

# Start production server
npm start
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3001
CLIENT_URL=http://localhost:5173

# Agent Configuration
KPI_TRACKER_INTERVAL=30000
REVENUE_TRACKER_INTERVAL=60000

# API Keys (add your actual keys)
ANALYTICS_API_KEY=your_analytics_key
STRIPE_API_KEY=your_stripe_key
```

### Agent Configuration

Agents can be configured through the dashboard UI or programmatically:

```typescript
// Example agent configuration
const kpiConfig = {
  interval: 30000, // 30 seconds
  settings: {
    kpis: ['revenue', 'conversion_rate', 'user_acquisition'],
    thresholds: {
      revenue: { min: 1000, max: 100000 },
      conversion_rate: { min: 0.01, max: 0.1 }
    }
  }
};
```

## 📊 API Endpoints

### Agents API
```
GET    /api/agents          # Get all agents
GET    /api/agents/:type    # Get specific agent
POST   /api/agents/:type/start  # Start agent
POST   /api/agents/:type/stop   # Stop agent
PUT    /api/agents/:type/config # Configure agent
```

### Dashboard API
```
GET    /api/dashboard/overview  # System overview
GET    /api/dashboard/metrics   # Agent metrics
GET    /api/dashboard/activity  # Activity log
```

### Webhooks API
```
POST   /api/webhooks/:source    # Receive webhook
GET    /api/webhooks/logs       # Get webhook logs
```

## 🧪 Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Adding New Agents

1. **Create agent class** in `server/agents/`
   ```typescript
   import { BaseAgent } from './BaseAgent.js';
   
   export class MyCustomAgent extends BaseAgent {
     constructor(io: Server) {
       super('my-agent', 'My Custom Agent', io);
     }
     
     async execute(): Promise<void> {
       // Your agent logic here
     }
   }
   ```

2. **Register in AgentManager**
   ```typescript
   // In server/agents/AgentManager.ts
   this.agents.set(AgentType.MY_CUSTOM, new MyCustomAgent(this.io));
   ```

3. **Add to shared types**
   ```typescript
   // In shared/types.ts
   export enum AgentType {
     MY_CUSTOM = 'my-custom',
     // ... other agents
   }
   ```

## 🔌 WebSocket Events

### Client → Server
- `agent:start` - Start an agent
- `agent:stop` - Stop an agent  
- `agent:configure` - Configure an agent

### Server → Client
- `agent:started` - Agent started successfully
- `agent:stopped` - Agent stopped
- `agent:error` - Agent error occurred
- `agent:data` - Agent data update
- `agents:metrics` - System metrics update

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs and request features via GitHub Issues
- **Discord**: Join our community server for support and discussions

---

**Built with ❤️ for the DevOps community**
