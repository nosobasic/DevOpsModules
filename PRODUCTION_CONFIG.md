# Production Configuration Summary

## Overview
This document summarizes the production configuration changes made to the Revenue Ripple DevOps Modules.

## Updated URLs

### API Endpoints
- **Development**: `http://localhost:3000`
- **Production**: `https://revenueripple.org`

### Client URLs
- **Development**: `http://localhost:5173`
- **Production**: `https://devops.revenueripple.org`

### Admin Panel
- **Development**: `/admin`
- **Production**: `https://revenueripple.org/admin`

### WebSocket Connections
- **Development**: `ws://localhost:3001/ws/devops-modules`
- **Production**: `wss://revenueripple.org/ws/devops-modules`

## Updated Files

### 1. Configuration Files
- `src/lib/config.ts` - Updated default URLs to production
- `server/index.ts` - Updated CORS origins to production
- `env.production` - Created production environment template

### 2. Integration Files
- `revenue-ripple-integration.js` - Updated baseURL and WebSocket URLs
- `dashboard-integration.html` - Updated configuration to use production URLs

### 3. Documentation
- `README.md` - Updated setup instructions for production
- `QUICK_SETUP_GUIDE.md` - Updated URLs and configuration steps

### 4. Deployment
- `deploy-production.sh` - Created production deployment script
- `package.json` - Added production build and start scripts

## Environment Variables

### Required for Production
```env
REACT_APP_REVENUE_RIPPLE_URL=https://revenueripple.org
REACT_APP_REVENUE_RIPPLE_API_KEY=rr_u_5n6KxpNEx2hsa32s3_gfGgVIo5hjfC2esJr7CBPtk
REACT_APP_ADMIN_PANEL_URL=https://revenueripple.org/admin
CLIENT_URL=https://devops.revenueripple.org
NODE_ENV=production
PORT=3001
```

### Optional
```env
REACT_APP_WEBHOOK_SECRET=your_webhook_secret_here
REACT_APP_INTEGRATION_MODE=embedded
DATABASE_URL=your_production_database_url_here
OPENAI_API_KEY=your_openai_api_key_here
```

## Deployment Commands

### Quick Deploy
```bash
npm run deploy
```

### Manual Deploy
```bash
# Build for production
npm run build:production

# Start production server
npm run start:production
```

### Using PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Deploy with PM2
pm2 start npm --name "devops-modules" -- start:production
pm2 save
pm2 startup
```

## Security Considerations

### HTTPS Only
- All production URLs use HTTPS/WSS
- No HTTP traffic allowed in production

### API Key Security
- API key is configured in environment variables
- Never commit API keys to version control

### CORS Configuration
- Production CORS is restricted to specific domains
- Development CORS is more permissive

## Monitoring

### Health Checks
- API Health: `https://revenueripple.org/api/health`
- Dashboard Status: `https://devops.revenueripple.org/status`

### Logs
```bash
# PM2 logs
pm2 logs devops-modules

# Direct logs
npm run start:production
```

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Verify API key is correct
   - Check if Revenue Ripple API is accessible
   - Ensure HTTPS certificates are valid

2. **CORS Errors**
   - Verify CLIENT_URL matches your domain
   - Check server CORS configuration

3. **WebSocket Connection Issues**
   - Ensure WSS (secure WebSocket) is used
   - Check firewall/proxy settings

### Support
For production issues, check:
- Application logs
- Network connectivity
- Environment variable configuration
- Revenue Ripple API status 