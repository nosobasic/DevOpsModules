# 🔧 Production CORS Issue Fix

## 🚨 **Current Issue**
Your production frontend at `https://dev-ops-modules.vercel.app` is trying to connect to `https://devopsmodules.onrender.com` which doesn't exist, causing CORS errors.

## 🎯 **Immediate Solutions**

### **Option 1: Deploy Backend to Render (Recommended)**

1. **Go to Render Dashboard**: https://render.com
2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect GitHub repo: `https://github.com/nosobasic/DevOpsModules`
   - Name: `devops-modules-api`
   - Environment: `Node`
   - Build Command: `npm install && npm run build:client`
   - Start Command: `npm start`

3. **Set Environment Variables**:
   ```bash
   NODE_ENV=production
   PORT=10000
   CLIENT_URL=https://dev-ops-modules.vercel.app
   REACT_APP_REVENUE_RIPPLE_URL=https://revenueripple.org
   REACT_APP_REVENUE_RIPPLE_API_KEY=rr_u_5n6KxpNEx2hsa32s3_gfGgVIo5hjfC2esJr7CBPtk
   WEBHOOK_SECRET=auto-generated-by-render
   ```

4. **Deploy and get URL**: `https://devops-modules-api.onrender.com`

5. **Update Vercel Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add/Update:
     ```bash
     VITE_API_URL=https://devops-modules-api.onrender.com
     VITE_WS_URL=wss://devops-modules-api.onrender.com
     ```

6. **Redeploy Frontend**: Vercel will auto-redeploy

### **Option 2: Use Local Development (Temporary)**

If you want to test locally while deploying:

1. **Run locally**:
   ```bash
   npm run dev
   ```

2. **Access at**: `http://localhost:5173/dashboard`

3. **Backend will be at**: `http://localhost:3001`

### **Option 3: Quick Backend Deployment**

Use the deployment script I created:

```bash
./deploy-backend.sh
```

Then follow the steps it provides.

## 🔍 **Verify Fix**

After deployment, test these endpoints:

```bash
# Health check
curl https://devops-modules-api.onrender.com/health

# Agents API
curl https://devops-modules-api.onrender.com/api/agents
```

## 📊 **Expected Results**

Once fixed, you should see:
- ✅ No CORS errors in browser console
- ✅ All 17 agents available in dashboard
- ✅ Self-healing capabilities active
- ✅ AI insights working
- ✅ Real-time WebSocket connections

## 🚀 **Current Status**

- **Frontend**: ✅ Live at `https://dev-ops-modules.vercel.app`
- **Backend**: ❌ Needs deployment to Render
- **Database**: ❌ Not configured (optional)
- **WebSocket**: ❌ Will work after backend deployment

## 📞 **Need Help?**

If you need assistance with the Render deployment:
1. The `render.yaml` file is already configured
2. The deployment script provides step-by-step instructions
3. All environment variables are documented
4. The backend code is production-ready with all 17 agents 