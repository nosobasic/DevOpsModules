# 🚀 Render Deployment Guide for DevOps Modules

## 📋 **Prerequisites**
- GitHub account with the DevOpsModules repository
- Render.com account (free tier available)
- 5-10 minutes for deployment

## 🎯 **Step-by-Step Deployment**

### **1. Go to Render Dashboard**
- Visit: https://render.com
- Sign in to your account
- Click "New +" → "Web Service"

### **2. Connect GitHub Repository**
- Click "Connect a repository"
- Select GitHub
- Find and select: `nosobasic/DevOpsModules`
- Click "Connect"

### **3. Configure Service Settings**
```
Name: devops-modules-api
Environment: Node
Region: Choose closest to you (US East recommended)
Branch: main
Root Directory: ./ (leave empty)
```

### **4. Build & Start Commands**
```
Build Command: npm install
Start Command: npm run start:render
```

### **5. Environment Variables**
Add these in the Render dashboard:

```bash
NODE_ENV=production
PORT=10000
CLIENT_URL=https://dev-ops-modules.vercel.app
REACT_APP_REVENUE_RIPPLE_URL=https://revenueripple.org
REACT_APP_REVENUE_RIPPLE_API_KEY=rr_u_5n6KxpNEx2hsa32s3_gfGgVIo5hjfC2esJr7CBPtk
WEBHOOK_SECRET=auto-generated-by-render
OPENAI_API_KEY=your_openai_api_key_here
```

### **6. Advanced Settings**
- **Auto-Deploy**: ✅ Enabled
- **Health Check Path**: `/health`
- **Health Check Timeout**: 180 seconds

### **7. Deploy**
- Click "Create Web Service"
- Wait for build to complete (5-10 minutes)
- Note the URL: `https://devops-modules-api.onrender.com`

## 🔧 **Post-Deployment Steps**

### **1. Update Vercel Frontend**
After successful backend deployment:

1. **Go to Vercel Dashboard**: https://vercel.com
2. **Navigate to your project**: `dev-ops-modules`
3. **Go to Settings** → **Environment Variables**
4. **Add/Update these variables**:
   ```bash
   VITE_API_URL=https://devops-modules-api.onrender.com
   VITE_WS_URL=wss://devops-modules-api.onrender.com
   ```
5. **Redeploy** (Vercel will auto-redeploy)

### **2. Test the Deployment**
Once deployed, test these endpoints:

```bash
# Health check
curl https://devops-modules-api.onrender.com/health

# Agents API
curl https://devops-modules-api.onrender.com/api/agents

# AI Report (after starting an agent)
curl https://devops-modules-api.onrender.com/api/agents/kpi-tracker/report
```

## 🎯 **Expected Results**

After successful deployment:
- ✅ Service shows "Live" status in Render
- ✅ Health check passes
- ✅ API endpoints respond correctly
- ✅ WebSocket connections work
- ✅ AI insights and recommendations work
- ✅ Self-healing agents are active

## 🔍 **Troubleshooting**

### **If Build Fails:**
1. Check Render build logs
2. Verify all dependencies are in `package.json`
3. Ensure Node.js version compatibility

### **If Start Fails:**
1. Check Render runtime logs
2. Verify environment variables are set correctly
3. Test locally with: `NODE_ENV=production npm run start:render`

### **If Health Check Fails:**
1. Verify the `/health` endpoint works
2. Check if server is binding to correct port
3. Ensure CORS is configured properly

### **If Agents Don't Work:**
1. Check if agents are starting correctly
2. Verify rate limiting isn't blocking execution
3. Check WebSocket connections

## 📊 **Monitoring**

### **Render Dashboard**
- Monitor service status
- View build and runtime logs
- Check resource usage

### **Application Health**
- Health endpoint: `/health`
- Agent status: `/api/agents`
- Metrics: `/api/metrics/system`

## 🚀 **Features Available After Deployment**

### **AI-Powered Insights**
- ✅ Comprehensive agent reports
- ✅ AI-generated recommendations
- ✅ Performance trends analysis
- ✅ Quick actions with priority levels

### **Self-Healing Agents**
- ✅ Webhook Validator (auto-fixes webhook issues)
- ✅ Bug Watcher (auto-triages critical bugs)
- ✅ Deploy Bot (auto-rollback on failures)
- ✅ Churn Detector (auto-triggers retention campaigns)
- ✅ Health Monitor (auto-heals system issues)

### **Real-Time Monitoring**
- ✅ Live agent status updates
- ✅ WebSocket real-time communication
- ✅ Rate limiting and health monitoring
- ✅ Comprehensive metrics tracking

## 📞 **Need Help?**

If deployment fails:
1. Check Render build logs for specific errors
2. Verify all files are committed to GitHub
3. Test the build locally: `npm install && npm run start:render`
4. Check if any TypeScript compilation errors exist

## 🎉 **Success Indicators**

You'll know it's working when:
- ✅ Frontend loads without console errors
- ✅ Agents can be started/stopped
- ✅ AI insights panel shows comprehensive reports
- ✅ Real-time updates work via WebSocket
- ✅ Self-healing agents automatically fix issues

---

**Deployment Time**: ~10 minutes
**Cost**: Free tier available on Render
**Uptime**: 99.9% with proper configuration 